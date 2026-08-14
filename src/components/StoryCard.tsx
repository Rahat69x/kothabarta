import { Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  authorName,
  categoryName,
  storyGenres,
  type Category,
  type Profile,
  type Story,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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

  return (
    <Link to="/story/$storyId" params={{ storyId: story.id }} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden border-border/70 p-0 transition-shadow hover:shadow-lg">
        <div className="relative flex aspect-[3/4] w-full shrink-0 items-center justify-center overflow-hidden bg-secondary paper-texture">
          {story.cover_url ? (
            <img
              src={story.cover_url}
              alt={story.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <BookMarked className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3">
          <div className="flex h-4 flex-nowrap gap-1 overflow-hidden">
            {storyGenres(story).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="shrink-0 px-1.5 py-0 text-[10px] whitespace-nowrap"
              >
                {t(g)}
              </Badge>
            ))}
            {category && (
              <Badge variant="outline" className="shrink-0 px-1.5 py-0 text-[10px] whitespace-nowrap">
                {categoryName(category, lang)}
              </Badge>
            )}
          </div>
          <h3 className="line-clamp-2 min-h-[2.6em] font-display text-sm leading-snug font-semibold sm:text-base">
            {story.title}
          </h3>
          <p className="mt-auto line-clamp-1 text-[11px] text-muted-foreground">
            {t("by")} {authorName(profile ?? null, story)} · {t(story.status)}
          </p>
        </div>
      </Card>

    </Link>
  );
}
