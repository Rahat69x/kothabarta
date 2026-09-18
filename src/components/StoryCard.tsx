import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { BookMarked, Sparkles } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 14;

    setRotX(rX);
    setRotY(rY);

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <Link to="/story/$storyId" params={{ storyId: story.id }} className="group block h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(12px) scale3d(1.03, 1.03, 1.03)`
            : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)`,
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease",
        }}
        className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground transform-gpu preserve-3d transition-shadow duration-300 ${
          isHovered
            ? "shadow-2xl shadow-primary/20 border-primary/50"
            : "shadow-md hover:shadow-xl"
        }`}
      >
        {/* Dynamic Specular Sheen across Cover */}
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.4), transparent 75%)`,
            opacity: glare.opacity,
          }}
          aria-hidden="true"
        />

        {/* 3D Book Cover Presentation with Left Spine highlight */}
        <div className="relative flex aspect-[3/4] w-full shrink-0 items-center justify-center overflow-hidden bg-secondary/80 paper-texture book-spine-left">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={story.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
              <BookMarked className="h-10 w-10 text-primary/60 animate-pulse" />
              <span className="font-display text-xs font-semibold">{story.title}</span>
            </div>
          )}

          {/* Book Spine Shadow Overlay on the Left Edge */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10"
            aria-hidden="true"
          />

          {/* Page Edge Highlight on the Right Edge */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-white/20 z-10"
            aria-hidden="true"
          />
        </div>

        {/* Story Metadata Body */}
        <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-3.5 bg-card/90 backdrop-blur-sm">
          <div>
            {/* Genre & Category Badges with 3D Float */}
            <div className="flex flex-nowrap items-center gap-1 overflow-hidden pb-1">
              {storyGenres(story).slice(0, 1).map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="shrink-0 px-1.5 py-0 text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 whitespace-nowrap"
                >
                  {t(g)}
                </Badge>
              ))}
              {category && (
                <Badge
                  variant="outline"
                  className="shrink-0 px-1.5 py-0 text-[10px] font-medium border-border/80 text-muted-foreground whitespace-nowrap"
                >
                  {categoryName(category, lang)}
                </Badge>
              )}
            </div>

            {/* Story Title with Editorial Styling */}
            <h3 className="line-clamp-2 min-h-[2.6em] font-display text-sm leading-snug font-bold text-foreground group-hover:text-primary transition-colors sm:text-base mt-1">
              {story.title}
            </h3>
          </div>

          {/* Author & Publication Status */}
          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="truncate">
              {t("by")} <span className="font-medium text-foreground">{authorName(profile ?? null, story)}</span>
            </span>
            <span className="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/80 text-foreground">
              {t(story.status)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
