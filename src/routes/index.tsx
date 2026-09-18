import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PenLine,
  BookOpen,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
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
      { title: "জানুন, পড়ুন, লিখুন — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        name: "description",
        content:
          "বাংলা লেখকদের গল্প, প্রবন্ধ আর অভিজ্ঞতার ঘর। জানুন, পড়ুন, লিখুন — নিজের নামে অথবা ছদ্মনামে প্রকাশ করুন।",
      },
      { property: "og:title", content: "জানুন, পড়ুন, লিখুন — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        property: "og:description",
        content:
          "বাংলা লেখকদের গল্প, প্রবন্ধ আর অভিজ্ঞতার ঘর। জানুন, পড়ুন, লিখুন — নিজের নামে অথবা ছদ্মনামে প্রকাশ করুন।",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const CONTAINER_WIDTH = "mx-auto w-full max-w-[1720px] px-4 sm:px-8 lg:px-12";

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
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 260), behavior: "smooth" });
  };

  if (!isLoading && (data?.stories.length ?? 0) === 0) return null;

  return (
    <section className={`${CONTAINER_WIDTH} py-6 sm:py-8`}>
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

      {/* Horizontal Scroller */}
      <div className="group relative">
        {canLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="absolute -left-3 sm:-left-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur transition-all hover:scale-110 active:scale-95 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {canRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="absolute -right-3 sm:-right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur transition-all hover:scale-110 active:scale-95 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={update}
          className="no-scrollbar flex snap-x items-stretch gap-4 overflow-x-auto pb-3 pt-1 sm:gap-5"
        >
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-40 shrink-0 rounded-xl sm:h-72 sm:w-44" />
            ))}

          {data?.stories.map((story) => (
            <div
              key={story.id}
              className="w-40 shrink-0 snap-start sm:w-48 lg:w-52 transition-transform duration-200"
            >
              <StoryCard
                story={story}
                profile={data.profiles[story.writer_id]}
                category={story.category_id ? catById[story.category_id] : null}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CorePillarsSection() {
  const scrollToKnow = () => {
    const el = document.getElementById("know-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 mb-6 sm:mb-10">
      <div className={CONTAINER_WIDTH}>
        <div className="overflow-hidden rounded-2xl border-2 border-black bg-white text-black shadow-2xl">
          {/* Header Bar */}
          <div className="border-b-2 border-black bg-black px-4 sm:px-6 py-2.5 text-white flex items-center justify-between">
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-200">
              প্রধান তিনটি স্তম্ভ • Core Pillars
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-neutral-400">
              জানুন • পড়ুন • লিখুন
            </span>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 divide-y-2 divide-black sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
            {/* 1. জানুন */}
            <button
              type="button"
              onClick={scrollToKnow}
              className="group flex flex-col justify-between p-5 sm:p-6 text-left transition-colors duration-150 hover:bg-black hover:text-white"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider opacity-60 group-hover:opacity-100">
                  <span>০১ • জানুন</span>
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  জানুন
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed opacity-75 group-hover:opacity-90">
                  প্ল্যাটফর্মের উদ্দেশ্য, উন্মুক্ত প্রকাশনার দর্শন ও সাহিত্য নির্দেশিকা
                </p>
              </div>
              <div className="mt-4 inline-flex items-center text-xs font-bold group-hover:underline">
                <span>বিস্তারিত জানুন</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* 2. পড়ুন */}
            <Link
              to="/browse"
              className="group flex flex-col justify-between p-5 sm:p-6 text-left transition-colors duration-150 hover:bg-black hover:text-white"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider opacity-60 group-hover:opacity-100">
                  <span>০২ • পড়ুন</span>
                  <BookOpen className="h-4 w-4" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  পড়ুন
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed opacity-75 group-hover:opacity-90">
                  হাজারো গল্প, ধারাবাহিক উপন্যাস ও মননশীল প্রবন্ধের উন্মুক্ত সংগ্রহশালা
                </p>
              </div>
              <div className="mt-4 inline-flex items-center text-xs font-bold group-hover:underline">
                <span>লাইব্রেরি ব্রাউজ করুন</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* 3. লিখুন */}
            <Link
              to="/write"
              className="group flex flex-col justify-between p-5 sm:p-6 text-left transition-colors duration-150 hover:bg-black hover:text-white"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider opacity-60 group-hover:opacity-100">
                  <span>০৩ • লিখুন</span>
                  <PenLine className="h-4 w-4" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  লিখুন
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed opacity-75 group-hover:opacity-90">
                  নিজের কথা ও মৌলিক সাহিত্য প্রকাশ করুন নিজের নামে অথবা ছদ্মনামে
                </p>
              </div>
              <div className="mt-4 inline-flex items-center text-xs font-bold group-hover:underline">
                <span>লেখা শুরু করুন</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function KnowSection() {
  return (
    <section id="know-section" className={`${CONTAINER_WIDTH} py-10 sm:py-14 scroll-mt-20`}>
      <div className="rounded-2xl border border-border/70 bg-card/50 p-6 sm:p-10 backdrop-blur-sm shadow-xl">
        <div className="border-b border-border/60 pb-4 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              সাহিত্য নির্দেশিকা • LITERARY GUIDE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
              জানুন: গল্পঘর সম্পর্কে
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            স্বাধীন ও উন্মুক্ত সাহিত্য ভাবনার জন্য পাঠক-লেখকদের সার্বজনীন মিলনমেলা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-border/60 bg-background/50 p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                ০১
              </span>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              উদ্দেশ্য ও দর্শন
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              ‘জানুন, পড়ুন, লিখুন’ হলো বাংলা সাহিত্যের মুক্তচিন্তার এক অনন্য অঙ্গন। প্রাতিষ্ঠানিক বাধ্যবাধকতা ছাড়াই মনের ভাব প্রকাশের সুযোগ।
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/50 p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                ০২
              </span>
              <PenLine className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              লেখকদের স্বাধিকার
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              আসল নাম কিংবা পছন্দমতো ছদ্মনামে প্রকাশ করুন ছোটগল্প অথবা বহু পর্বের ধারাবাহিক উপন্যাস। প্রতিটি লেখার পূর্ণ স্বত্ব আপনার।
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/50 p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                ০৩
              </span>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              পাঠ ও সুস্থ মূল্যায়ন
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              বিজ্ঞাপনমুক্ত পরিচ্ছন্ন পরিবেশে গল্প উপভোগ করুন। প্রিয় লেখককে অনুসরণ করুন এবং গঠনমূলক রেটিং ও মন্তব্য জানান।
            </p>
          </div>
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
    [categories]
  );

  return (
    <div className="bg-background text-foreground min-h-screen pb-16 relative overflow-x-hidden">
      {/* 1. CLEAN FULL-WIDTH HERO SECTION (ORIGINAL KOTHABARTA FORMAT) */}
      <section className="relative isolate flex min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] items-center overflow-hidden border-b border-border/70">
        {/* Book Covers Wall Background Image */}
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

        {/* Readability Gradient */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/90 via-background/80 to-background sm:bg-gradient-to-r sm:from-background/95 sm:via-background/75 sm:to-transparent"
          aria-hidden="true"
        />

        {/* Hero Typography & Actions */}
        <div className={`${CONTAINER_WIDTH} py-12 sm:py-16 lg:py-20 relative z-10`}>
          <div className="max-w-3xl">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 mb-3.5 text-[11px] font-semibold tracking-wider text-primary uppercase backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{t("appName")} · {t("motto")}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-3xl leading-snug font-extrabold text-foreground sm:text-4xl sm:leading-tight lg:text-5xl">
              জানুন, পড়ুন, লিখুন
            </h1>

            {/* Subtitle */}
            <p className="mt-3 max-w-2xl text-xs sm:text-base text-muted-foreground leading-relaxed">
              বাংলা গল্প, প্রবন্ধ ও বাস্তব অভিজ্ঞতার উন্মুক্ত সাহিত্য প্ল্যাটফর্ম — নিজের নামে অথবা ছদ্মনামে লিখুন, জানুন এবং পড়ুন সেরা সব লেখা।
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-10 sm:h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-all gap-2"
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
                className="h-10 sm:h-11 px-6 rounded-xl border-border/80 bg-background/80 hover:bg-secondary text-foreground backdrop-blur-sm transition-all gap-2"
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

      {/* 2. THREE-PART HOMEPAGE SECTION — জানুন, পড়ুন, লিখুন (STARK B&W ACCENT) */}
      <CorePillarsSection />

      {/* 3. FULL-WIDTH STORY SHELVES */}
      <Shelf title={t("latest")} catById={catById} />
      <Shelf title={t("fiction")} genre="fiction" catById={catById} />
      <Shelf title={t("nonfiction")} genre="nonfiction" catById={catById} />
      <Shelf title={t("experience")} genre="experience" catById={catById} />

      {/* 4. LITERARY GUIDE / KNOW SECTION */}
      <KnowSection />
    </div>
  );
}
