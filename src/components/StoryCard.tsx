import { Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  authorName,
  categoryName,
  storyGenres,
  resolveCoverUrl,
  type Category,
  type Profile,
  type Story,
} from "@/lib/data";

export function StoryCard({
  story,
  profile,
  category,
}: {
  story: Story;
  profile?: Profile | null;
  category?: Category | null;
}) {
  const { t, lang } = useI18n();
  const coverSrc = resolveCoverUrl(story.cover_url);

  return (
    <Link
      to="/story/$storyId"
      params={{ storyId: story.id }}
      className="group flex h-full flex-col border border-foreground/30 bg-card p-2.5 sm:p-3 transition-all duration-200 hover:border-foreground hover:shadow-[4px_4px_0px_0px_currentColor]"
    >
      {/* Newspaper Image Frame */}
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden border border-foreground/20 bg-muted">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={story.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale contrast-115 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center text-muted-foreground">
            <BookMarked className="h-8 w-8 stroke-1 opacity-70" />
            <span className="mt-2 font-display text-xs font-semibold text-foreground">
              {story.title}
            </span>
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {/* Genre / Category Tag Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            {storyGenres(story).slice(0, 1).map((g) => (
              <span
                key={g}
                className="border border-foreground/40 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-foreground"
              >
                {t(g)}
              </span>
            ))}
            {category && (
              <span className="border border-foreground/20 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {categoryName(category, lang)}
              </span>
            )}
          </div>

          {/* Headline */}
          <h3 className="mt-1 line-clamp-2 min-h-[2.5em] font-display text-sm font-bold leading-tight text-foreground transition-colors group-hover:underline sm:text-base">
            {story.title}
          </h3>
        </div>

        {/* Byline / Metadata Line */}
        <div className="mt-3 border-t border-foreground/20 pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate">
            {t("by")} <span className="font-semibold text-foreground">{authorName(profile ?? null, story)}</span>
          </span>
          <span className="shrink-0 font-mono text-[10px] uppercase">
            {t(story.status)}
          </span>
        </div>
      </div>
    </Link>
  );
}
