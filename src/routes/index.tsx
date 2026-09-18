import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PenLine,
  BookOpen,
  HelpCircle,
  Sparkles,
  Feather,
  Flame,
  ArrowRight,
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

const SHELF_WIDTH = "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8";

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

      {/* Scroller Frame */}
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
          className="no-scrollbar flex snap-x items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-2"
        >
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-68 w-40 sm:w-48 shrink-0 rounded-xl" />
            ))}

          {data?.stories.slice(0, 14).map((s) => (
            <div key={s.id} className="w-38 sm:w-48 lg:w-52 shrink-0 snap-start">
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
    <section className={`${SHELF_WIDTH} py-8 sm:py-10`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {genres.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.id}
              to="/browse"
              search={g.id === "all" ? {} : { genre: g.id as Genre }}
              className={`group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br ${g.color} p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${g.border}`}
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-background/80 text-foreground shadow-sm group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-3 sm:mt-4">
                <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
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

function KnowSection() {
  return (
    <section
      id="know-section"
      className={`${SHELF_WIDTH} py-12 sm:py-16 scroll-mt-20`}
    >
      <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="border-b border-border/60 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              সাহিত্য নির্দেশিকা • LITERARY GUIDE
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground mt-1">
              জানুন: প্ল্যাটফর্ম সম্পর্কে
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            স্বাধীন ও উন্মুক্ত সাহিত্য ভাবনার জন্য পাঠক-লেখকদের এক সার্বজনীন মিলনমেলা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-border/60 bg-background/60 p-5 sm:p-6 space-y-3">
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
              ‘জানুন, পড়ুন, লিখুন’ হলো বাংলা সাহিত্যের স্বাধীন ও মুক্তচিন্তার এক অনন্য অঙ্গন। প্রতিটি মানুষের অন্তরে জমা থাকা সুপ্ত ভাবনা ও গল্পগুলোকে প্রাতিষ্ঠানিক বাধা ছাড়া পাঠকের দরবারে পৌঁছে দেওয়াই আমাদের ব্রত।
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-border/60 bg-background/60 p-5 sm:p-6 space-y-3">
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
              এখানে লেখক সম্পূর্ণ স্বাধীন। আপনি নিজের আসল নাম কিংবা পছন্দমতো ছদ্মনামে প্রকাশ করতে পারেন একক লেখা অথবা বহু পর্বের ধারাবাহিক উপন্যাস। প্রতিটি লেখার উপর লেখকের পূর্ণ স্বত্ব সংরক্ষিত।
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-border/60 bg-background/60 p-5 sm:p-6 space-y-3">
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
              পাঠকরা এখানে সম্পূর্ণ বিজ্ঞাপনমুক্ত ও পরিচ্ছন্ন পরিবেশে গল্প-প্রবন্ধ উপভোগ করতে পারবেন। প্রিয় লেখককে ফলো করা, রেটিং দেওয়া এবং গঠনমূলক মন্তব্য করে লেখকদের উৎসাহিত করার সুযোগ রয়েছে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityCallout() {
  return (
    <section className={`${SHELF_WIDTH} py-10 sm:py-14`}>
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

  const scrollToKnow = () => {
    const el = document.getElementById("know-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen pb-20 relative overflow-x-hidden">
      {/* 1. 3D INTERACTIVE DARK HERO SECTION */}
      <section className="relative isolate flex min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] items-center overflow-hidden border-b border-border/70">
        {/* Visual Book Covers Wall Background */}
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

        {/* Atmospheric Cinematic Gradients for Deep Contrast */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/85 to-background sm:bg-gradient-to-r sm:from-background/95 sm:via-background/85 sm:to-background/40"
          aria-hidden="true"
        />

        {/* Real-time 3D WebGL Literary Universe */}
        <LiteraryUniverse3D interactive={true} />

        {/* Hero Content */}
        <div className={`${SHELF_WIDTH} py-12 sm:py-20 lg:py-24 relative z-10`}>
          <div className="max-w-2xl">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/15 border border-primary/30 mb-4 text-[11px] font-semibold tracking-wider text-primary uppercase backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              <span>{t("appName")} · {t("motto")}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-3xl leading-tight font-extrabold text-foreground sm:text-5xl sm:leading-tight lg:text-6xl drop-shadow-sm">
              জানুন, পড়ুন, লিখুন
            </h1>

            {/* Subtitle */}
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

      {/* 2. THREE-PART HOMEPAGE LAYOUT — জানুন, পড়ুন, লিখুন (HIGH-CONTRAST B&W ACCENT SECTION) */}
      <section className="relative z-20 -mt-6 sm:-mt-10 mb-6 sm:mb-12">
        <div className={SHELF_WIDTH}>
          <div className="overflow-hidden rounded-2xl border-2 border-black bg-white text-black shadow-2xl ring-1 ring-white/10">
            {/* Top B&W Editorial Header Tag */}
            <div className="border-b-2 border-black bg-black px-4 py-2 text-white flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-200">
                প্রধান তিনটি স্তম্ভ • Core Pillars
              </span>
              <span className="hidden sm:inline font-mono text-[11px] tracking-wider text-neutral-400">
                জানুন · পড়ুন · লিখুন
              </span>
            </div>

            <nav
              aria-label="প্রধান তিনটি স্তম্ভ"
              className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black"
            >
              {/* Pillar 1: জানুন (Know) */}
              <button
                type="button"
                onClick={scrollToKnow}
                className="group flex min-h-[96px] sm:min-h-[120px] w-full flex-col justify-center p-5 text-left transition-colors duration-150 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-black cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-70 group-hover:opacity-100">
                    ০১ • জানুন
                  </span>
                  <HelpCircle className="h-5 w-5 stroke-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                </div>
                <span className="mt-1 font-display text-2xl sm:text-3xl font-black tracking-tight">
                  জানুন
                </span>
                <span className="mt-1 text-xs font-sans text-neutral-600 group-hover:text-neutral-300 leading-relaxed">
                  প্ল্যাটফর্মের উদ্দেশ্য, উন্মুক্ত প্রকাশনার দর্শন ও সাহিত্য নির্দেশিকা
                </span>
              </button>

              {/* Pillar 2: পড়ুন (Read) */}
              <Link
                to="/browse"
                className="group flex min-h-[96px] sm:min-h-[120px] w-full flex-col justify-center p-5 text-left transition-colors duration-150 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-black"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-70 group-hover:opacity-100">
                    ০২ • পড়ুন
                  </span>
                  <BookOpen className="h-5 w-5 stroke-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                </div>
                <span className="mt-1 font-display text-2xl sm:text-3xl font-black tracking-tight">
                  পড়ুন
                </span>
                <span className="mt-1 text-xs font-sans text-neutral-600 group-hover:text-neutral-300 leading-relaxed">
                  হাজারো গল্প, ধারাবাহিক উপন্যাস ও মননশীল প্রবন্ধের উন্মুক্ত সংগ্রহশালা
                </span>
              </Link>

              {/* Pillar 3: লিখুন (Write) */}
              <Link
                to="/write"
                className="group flex min-h-[96px] sm:min-h-[120px] w-full flex-col justify-center p-5 text-left transition-colors duration-150 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-black"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-70 group-hover:opacity-100">
                    ০৩ • লিখুন
                  </span>
                  <PenLine className="h-5 w-5 stroke-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                </div>
                <span className="mt-1 font-display text-2xl sm:text-3xl font-black tracking-tight">
                  লিখুন
                </span>
                <span className="mt-1 text-xs font-sans text-neutral-600 group-hover:text-neutral-300 leading-relaxed">
                  নিজের কথা ও মৌলিক সাহিত্য প্রকাশ করুন নিজের নামে অথবা ছদ্মনামে
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </section>

      {/* 3. 3D GENRE EXPLORER */}
      <GenreExplorer />

      {/* 4. 3D STORY SHELVES */}
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

      {/* 5. "জানুন" (KNOW) EDITORIAL SECTION */}
      <KnowSection />

      {/* 6. COMMUNITY CALLOUT */}
      <CommunityCallout />
    </div>
  );
}
