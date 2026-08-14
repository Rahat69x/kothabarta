import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = process.env.VITE_SITE_URL || process.env.SITE_URL || "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/browse", changefreq: "daily", priority: "0.9" },
          { path: "/write", changefreq: "monthly", priority: "0.4" },
          { path: "/auth", changefreq: "yearly", priority: "0.2" },
        ];

        const [{ data: stories }, { data: profiles }] = await Promise.all([
          supabase.from("stories").select("id").eq("is_published", true),
          supabase.from("writer_profiles").select("handle"),
        ]);

        for (const s of stories ?? []) {
          entries.push({ path: `/story/${s.id}`, changefreq: "weekly", priority: "0.8" });
        }
        for (const p of profiles ?? []) {
          if (p.handle) {
            entries.push({
              path: `/writer/${encodeURIComponent(p.handle)}`,
              changefreq: "weekly",
              priority: "0.6",
            });
          }
        }

        const storyIds = (stories ?? []).map((s) => s.id);
        if (storyIds.length) {
          const { data: parts } = await supabase
            .from("parts")
            .select("id")
            .eq("is_draft", false)
            .in("story_id", storyIds);
          for (const part of parts ?? []) {
            entries.push({ path: `/read/${part.id}`, changefreq: "monthly", priority: "0.6" });
          }
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
