import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PenLine,
  BookOpen,
  Sparkles,
  Feather,
  Flame,
  Compass,
  Layers,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fetchCategories, type Genre } from "@/lib/data";
import { fetchStories } from "@/lib/stories";
import { StoryCard } from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LiteraryUniverse3D } from "@/components/3d/LiteraryUniverse3D";
import heroImage from "@/assets/hero-books-wall.jpg";
import heroImageLight from "@/assets/hero-books-wall-light.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "গল্পঘর — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        name: "description",
        content:
          "বাংলা লেখকদের গল্প, প্রবন্ধ আর অভিজ্ঞতার ঘর। নিজের নামে অথবা ছদ্মনামে লিখুন — পর্বে পর্বে প্রকাশ করুন।",
      },
      { property: "og:title", content: "গল্পঘর — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        property: "og:description",
        content:
          "বাংলা লেখকদের গল্প, প্রবন্ধ আর অভিজ্ঞতার ঘর। নিজের নামে অথবা ছদ্মনামে লিখুন — পর্বে পর্বে প্রকাশ করুন।",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const SHELF_WIDTH = "mx-auto w-full max-w-[1600px] px-4 sm:px-8";

function Shelf({
  title,
  subtitle,
  genre,
  catById,
}: {
  title: string;
  subtitle?: string;
  genre?: Genre;
  catById: Record<string, any>;
}) {
  const { t } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["stories", { shelf: genre ?? "latest" }],
    queryFn: () => fetchStories(genre ? { genre } : {}),
  });

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update, data]);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.75, 240), behavior: "smooth" });
  };

  if (!isLoading && (data?.stories.length ?? 0) === 0) return null;

  return (
    <section className={`${SHELF_WIDTH} py-8 relative`}>
      {/* Shelf Header */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-sans">
              {subtitle}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="rounded-full text-xs hover:bg-secondary transition-all"
        >
          <Link to="/browse" search={genre ? { genre } : {}}>
            <span>{t("viewAll")}</span>
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* 3D Shelf Viewport */}
      <div className="group relative">
        {canLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="absolute top-1/2 left-0 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-background active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {canRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="absolute top-1/2 right-0 z-20 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-background active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={update}
          className="no-scrollbar flex snap-x items-stretch gap-4 overflow-x-auto pb-4 pt-2 px-1"
        >
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-40 shrink-0 rounded-xl" />
            ))}

          {data?.stories.slice(0, 14).map((s) => (
            <div key={s.id} className="w-36 shrink-0 snap-start sm:w-44 lg:w-48">
              <StoryCard
                story={s}
                profile={data.profiles[s.writer_id]}
                category={s.category_id ? catById[s.category_id] : null}
              />
            </div>
          ))}
        </div>

        {/* 3D Dimensional Shelf Base Line */}
        <div
          className="h-1.5 w-full rounded-full bg-gradient-to-r from-transparent via-border to-transparent opacity-60 mt-1"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function GenreExplorer() {
  const genres = [
    {
      id: "fiction",
      title: "কল্পকাহিনি",
      subtitle: "উপন্যাস ও রূপকথা",
      icon: Sparkles,
      color: "from-rose-500/15 via-primary/10 to-amber-500/15",
      border: "hover:border-primary/60",
    },
    {
      id: "nonfiction",
      title: "প্রবন্ধ ও চিন্তা",
      subtitle: "মননশীল বিশ্লেষণ",
      icon: Feather,
      color: "from-amber-500/15 via-accent/10 to-emerald-500/15",
      border: "hover:border-accent/60",
    },
    {
      id: "experience",
      title: "বাস্তব অভিজ্ঞতা",
      subtitle: "জীবনের না বলা গল্প",
      icon: Flame,
      color: "from-emerald-500/15 via-teal-500/10 to-cyan-500/15",
      border: "hover:border-emerald-500/60",
    },
    {
      id: "all",
      title: "সব বই ও রচনা",
      subtitle: "মুক্ত সাহিত্য লাইব্রেরি",
      icon: BookOpen,
      color: "from-blue-500/15 via-indigo-500/10 to-purple-500/15",
      border: "hover:border-blue-500/60",
    },
  ];

  return (
    <section className={`${SHELF_WIDTH} py-10`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {genres.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.id}
              to="/browse"
              search={g.id === "all" ? {} : { genre: g.id as Genre }}
              className="group block"
            >
              <div
                className={`relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br ${g.color} p-4 sm:p-5 transition-all duration-300 transform-gpu hover:-translate-y-1.5 hover:shadow-xl ${g.border} backdrop-blur-md`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-xl bg-background/80 flex items-center justify-center border border-border/60 group-hover:scale-110 transition-transform">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {g.title}
                </h3>
                <p className="text-[11px] text-muted-foreground font-sans mt-0.5">
                  {g.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CommunityCallout() {
  return (
    <section className={`${SHELF_WIDTH} py-12`}>
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-accent/10 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-semibold text-primary mb-4">
            <Feather className="h-3.5 w-3.5" />
            <span>লেখকদের জন্য উন্মুক্ত প্ল্যাটফর্ম</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            আপনার মনের ভাবনায় রচিত হোক নতুন কোনো অমর আখ্যান
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            গল্পঘরে নিজের নামে অথবা সম্পূর্ণ ছদ্মনামে প্রকাশ করুন ছোটগল্প, ধারাবাহিক উপন্যাস কিংবা
            ব্যক্তিগত স্মৃতিচারণ। পাঠকের প্রতিক্রিয়া জানুন এবং গড়ে তুলুন আপনার নিজস্ব সাহিত্য বলয়।
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-xl px-6 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90">
              <Link to="/write">
                <PenLine className="mr-2 h-4 w-4" />
                <span>আজই লেখা শুরু করুন</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-xl px-6 border-border/80 hover:bg-secondary">
              <Link to="/browse">
                <BookOpen className="mr-2 h-4 w-4 text-accent" />
                <span>লাইব্রেরি দেখুন</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Ambient subtle decorative glow */}
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      </div>
    </section>
  );
}

function Home() {
  const { t } = useI18n();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const catById = useMemo(
    () => Object.fromEntries((categories ?? []).map((c) => [c.id, c])),
    [categories]
  );

  return (
    <div className="pb-20 relative">
      {/* 3D INTERACTIVE HERO SECTION */}
      <section className="relative isolate flex min-h-[440px] sm:min-h-[520px] lg:min-h-[600px] items-center overflow-hidden border-b border-border/70">
        {/* Background Visual Book Covers Wall */}
        <img
          src={heroImageLight}
          alt="বইয়ের কভার দেয়াল"
          width={1920}
          height={1024}
          className="absolute inset-0 -z-20 h-full w-full object-cover dark:hidden"
        />
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1024}
          className="absolute inset-0 -z-20 hidden h-full w-full object-cover dark:block"
        />

        {/* Atmospheric Cinematic Gradients */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/95 via-background/80 to-background/95 sm:bg-linear-to-r sm:from-background/95 sm:via-background/80 sm:to-transparent"
          aria-hidden="true"
        />

        {/* Real-time 3D WebGL Literary Universe (Interactive 3D Book & Ink Particles) */}
        <LiteraryUniverse3D interactive={true} />

        {/* Hero Content Layer */}
        <div className={`${SHELF_WIDTH} py-12 sm:py-20 lg:py-24 relative z-10`}>
          <div className="max-w-2xl">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 text-[11px] font-semibold tracking-wider text-primary uppercase backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              <span>{t("appName")} · {t("motto")}</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display text-3xl leading-tight font-extrabold text-foreground sm:text-5xl sm:leading-tight lg:text-6xl drop-shadow-sm">
              জানুন, পড়ুন, লিখুন
            </h1>

            {/* Subheading */}
            <p className="mt-3 max-w-xl text-xs sm:text-base text-muted-foreground leading-relaxed">
              বাংলা গল্প, প্রবন্ধ ও বাস্তব অভিজ্ঞতার উন্মুক্ত সাহিত্য ঘর — নিজের নামে অথবা ছদ্মনামে লিখুন, জানুন এবং পড়ুন সেরা সব লেখা।
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 sm:h-12 px-7 rounded-xl bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
              >
                <Link to="/write">
                  <PenLine className="h-4 w-4" />
                  <span>{t("quickPost")}</span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 sm:h-12 px-7 rounded-xl border-border/80 bg-background/80 hover:bg-secondary text-foreground backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
              >
                <Link to="/browse">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span>{t("browse")}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Interactive Genre Explorer */}
      <GenreExplorer />

      {/* 3D Story Shelves */}
      <Shelf
        title={t("latest")}
        subtitle="লেখক ও পাঠকদের সদ্য প্রকাশিত তাজা লেখা ও পর্বসমূহ"
        catById={catById}
      />

      <Shelf
        title={t("fiction")}
        subtitle="উপন্যাস, রূপকথা, কল্পবিজ্ঞান ও রোমাঞ্চকর সব কল্পকাহিনী"
        genre="fiction"
        catById={catById}
      />

      <Shelf
        title={t("nonfiction")}
        subtitle="মননশীল প্রবন্ধ, দর্শন, সমাজ ও সাহিত্যের ভাবনাসমূহ"
        genre="nonfiction"
        catById={catById}
      />

      <Shelf
        title={t("experience")}
        subtitle="ব্যক্তিগত স্মৃতিচারণ, ভ্রমণকাহিনি ও জীবনের বাস্তব চালচিত্র"
        genre="experience"
        catById={catById}
      />

      {/* Community Callout */}
      <CommunityCallout />
    </div>
  );
}
