import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fetchCategories, type Genre } from "@/lib/data";
import { fetchStories } from "@/lib/stories";
import { StoryCard } from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-books-wall.jpg";
import heroImageLight from "@/assets/hero-books-wall-light.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "গল্পঘর — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        name: "description",
        content:
          "Browse Bangla fiction, non-fiction and personal experience blogs by category, genre and status. Write and publish serialized parts.",
      },
      { property: "og:title", content: "গল্পঘর — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        property: "og:description",
        content:
          "Browse Bangla fiction, non-fiction and personal experience blogs by category, genre and status. Write and publish serialized parts.",
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
  genre,
  catById,
}: {
  title: string;
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
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 200), behavior: "smooth" });
  };

  if (!isLoading && (data?.stories.length ?? 0) === 0) return null;

  return (
    <section className={`${SHELF_WIDTH} py-4`}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-xl font-semibold sm:text-2xl">{title}</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/browse" search={genre ? { genre } : {}}>
            {t("viewAll")}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="group relative mt-3">
        {canLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="absolute top-1/2 left-0 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-md backdrop-blur transition-opacity group-hover:grid group-focus-within:grid hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="absolute top-1/2 right-0 z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-md backdrop-blur transition-opacity group-hover:grid group-focus-within:grid hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={update}
          className="no-scrollbar flex snap-x items-stretch gap-3 overflow-x-auto pb-1 sm:gap-4"
        >
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-32 shrink-0 sm:h-60 sm:w-36" />
            ))}
          {data?.stories.slice(0, 12).map((s) => (
            <div key={s.id} className="w-32 shrink-0 snap-start sm:w-36 lg:w-40">
              <StoryCard
                story={s}
                profile={data.profiles[s.writer_id]}
                category={s.category_id ? catById[s.category_id] : null}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Home() {
  const { t } = useI18n();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const catById = useMemo(
    () => Object.fromEntries((categories ?? []).map((c) => [c.id, c])),
    [categories],
  );

  return (
    <div className="pb-16">
      <section className="hero-surface relative isolate flex min-h-[340px] items-center overflow-hidden border-b border-border/70 sm:min-h-[420px] lg:min-h-[520px]">
        <img
          src={heroImageLight}
          alt="নানা রঙের বইয়ের প্রচ্ছদের দেয়াল"
          width={1920}
          height={1024}
          className="absolute inset-0 -z-10 h-full w-full object-cover dark:hidden"
        />
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1024}
          className="absolute inset-0 -z-10 hidden h-full w-full object-cover dark:block"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-white/94 via-white/85 to-white/70 sm:bg-linear-to-r sm:from-white/92 sm:via-white/78 sm:to-white/45 dark:from-black/88 dark:via-black/75 dark:to-black/55 sm:dark:from-black/85 sm:dark:via-black/65 sm:dark:to-black/35"
          aria-hidden="true"
        />

        <div className={`${SHELF_WIDTH} py-10 sm:py-16 lg:py-20`}>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase sm:text-[11px] sm:tracking-[0.2em]">
            {t("appName")} · {t("motto")}
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-xl leading-snug font-bold text-balance text-foreground sm:text-3xl sm:leading-tight">
            {t("tagline")}
          </h1>
          <p className="mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">{t("heroLead")}</p>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
            <Button asChild size="sm" className="sm:h-10 sm:px-6 sm:text-sm">
              <Link to="/write">{t("quickPost")}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 sm:h-10 sm:px-6 sm:text-sm"
            >
              <Link to="/browse">{t("browse")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Shelf title={t("latest")} catById={catById} />
      <Shelf title={t("fiction")} genre="fiction" catById={catById} />
      <Shelf title={t("nonfiction")} genre="nonfiction" catById={catById} />
      <Shelf title={t("experience")} genre="experience" catById={catById} />
    </div>
  );
}
