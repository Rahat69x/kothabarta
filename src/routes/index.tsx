import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
  PenLine,
  HelpCircle,
  FileText,
  Bookmark,
  Users,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fetchCategories, type Genre } from "@/lib/data";
import { fetchStories } from "@/lib/stories";
import { StoryCard } from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "জানুন, পড়ুন, লিখুন — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        name: "description",
        content:
          "বাংলা লেখকদের গল্প, প্রবন্ধ আর অভিজ্ঞতার খোলামেলা সংবাদপত্র। জানুন, পড়ুন, লিখুন — নিজের নামে অথবা ছদ্মনামে প্রকাশ করুন।",
      },
      { property: "og:title", content: "জানুন, পড়ুন, লিখুন — বাংলা গল্প, প্রবন্ধ ও অভিজ্ঞতার প্ল্যাটফর্ম" },
      {
        property: "og:description",
        content:
          "বাংলা লেখকদের গল্প, প্রবন্ধ আর অভিজ্ঞতার খোলামেলা সংবাদপত্র। জানুন, পড়ুন, লিখুন — নিজের নামে অথবা ছদ্মনামে প্রকাশ করুন।",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: NewspaperHome,
});

const CONTAINER_WIDTH = "mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8";

function NewspaperShelf({
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
    <section className={`${CONTAINER_WIDTH} py-8 border-b border-foreground/20`}>
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 border-b-2 border-foreground pb-2">
        <div>
          <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground font-sans">
              {subtitle}
            </p>
          )}
        </div>

        <Link
          to="/browse"
          search={genre ? { genre } : {}}
          className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-foreground hover:underline"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Scroller Frame */}
      <div className="group relative">
        {canLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="absolute top-1/2 left-0 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-foreground bg-background text-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {canRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="absolute top-1/2 right-0 z-20 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-foreground bg-background text-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={update}
          className="no-scrollbar flex snap-x items-stretch gap-4 overflow-x-auto pb-2 pt-1"
        >
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-40 shrink-0 border border-foreground/20" />
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
      </div>
    </section>
  );
}

function NewspaperHome() {
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
    <div className="bg-background text-foreground min-h-screen">
      {/* 1. TOP NEWSPAPER MASTHEAD STRIP */}
      <div className="border-b border-foreground/30 bg-muted/40 py-1.5 text-center">
        <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          দৈনিক সাহিত্য সংস্করণ • উন্মুক্ত বাংলা প্রকাশনা আঙিনা • ঢাকা, বাংলাদেশ
        </p>
      </div>

      {/* 2. BOLD EDITORIAL TITLE HEADER */}
      <div className={`${CONTAINER_WIDTH} pt-8 pb-6 text-center`}>
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground uppercase">
          জানুন, পড়ুন, লিখুন
        </h1>
        <p className="mt-2 text-xs sm:text-sm font-serif italic text-muted-foreground">
          “বাংলা সাহিত্যের উন্মুক্ত পাঠশালা ও মুক্তচিন্তার প্রকাশনা”
        </p>
      </div>

      {/* 3. STEP 2: THREE EQUAL, TAPPABLE SECTIONS (RIGHT AT THE TOP) */}
      <div className="border-y-2 border-foreground bg-background">
        <div className="mx-auto w-full max-w-[1500px]">
          <nav
            aria-label="প্রধান তিনটি বিভাগ"
            className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground"
          >
            {/* 1. জানুন (Know) */}
            <button
              onClick={scrollToKnow}
              className="group flex min-h-[96px] sm:min-h-[110px] w-full flex-col justify-center p-5 text-left transition-colors duration-150 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-60 group-hover:opacity-90">
                  ০১ • জানুন
                </span>
                <HelpCircle className="h-5 w-5 stroke-2 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="mt-1 font-display text-2xl sm:text-3xl font-black tracking-tight">
                জানুন
              </span>
              <span className="mt-0.5 text-xs font-sans opacity-70 group-hover:opacity-95">
                প্ল্যাটফর্মের উদ্দেশ্য, নিয়মাবলি ও সাহিত্যের নির্দেশিকা
              </span>
            </button>

            {/* 2. পড়ুন (Read) → links to /browse */}
            <Link
              to="/browse"
              className="group flex min-h-[96px] sm:min-h-[110px] w-full flex-col justify-center p-5 text-left transition-colors duration-150 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-60 group-hover:opacity-90">
                  ০২ • পড়ুন
                </span>
                <BookOpen className="h-5 w-5 stroke-2 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="mt-1 font-display text-2xl sm:text-3xl font-black tracking-tight">
                পড়ুন
              </span>
              <span className="mt-0.5 text-xs font-sans opacity-70 group-hover:opacity-95">
                হাজারো গল্প, উপন্যাস ও চিন্তাশীল প্রবন্ধের সংগ্রহশালা
              </span>
            </Link>

            {/* 3. লিখুন (Write) → links to /write */}
            <Link
              to="/write"
              className="group flex min-h-[96px] sm:min-h-[110px] w-full flex-col justify-center p-5 text-left transition-colors duration-150 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-60 group-hover:opacity-90">
                  ০৩ • লিখুন
                </span>
                <PenLine className="h-5 w-5 stroke-2 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="mt-1 font-display text-2xl sm:text-3xl font-black tracking-tight">
                লিখুন
              </span>
              <span className="mt-0.5 text-xs font-sans opacity-70 group-hover:opacity-95">
                নিজের সৃষ্টি প্রকাশ করুন উন্মুক্ত সাহিত্য দরবারে
              </span>
            </Link>
          </nav>
        </div>
      </div>

      {/* 4. TYPOGRAPHIC / LINE-BASED GENRE TABS (Strict B&W) */}
      <div className={`${CONTAINER_WIDTH} py-6`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/30 pb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
            বিভাগসমূহ:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/browse"
              className="border border-foreground px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
            >
              সব লেখা
            </Link>
            <Link
              to="/browse"
              search={{ genre: "fiction" }}
              className="border border-foreground/40 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              কল্পকাহিনি
            </Link>
            <Link
              to="/browse"
              search={{ genre: "nonfiction" }}
              className="border border-foreground/40 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              প্রবন্ধ ও চিন্তা
            </Link>
            <Link
              to="/browse"
              search={{ genre: "experience" }}
              className="border border-foreground/40 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              বাস্তব অভিজ্ঞতা
            </Link>
          </div>
        </div>
      </div>

      {/* 5. EDITORIAL STORY SHELVES */}
      <NewspaperShelf
        title="সদ্য প্রকাশিত"
        subtitle="লেখক ও পাঠকদের নতুন প্রকাশিত সব তাজা লেখা ও ধারাবাহিক পর্ব"
        catById={catById}
      />

      <NewspaperShelf
        title="কল্পকাহিনি ও উপন্যাস"
        subtitle="উপন্যাস, ছোটগল্প, রূপকথা ও রোমাঞ্চকর সাহিত্যকর্ম"
        genre="fiction"
        catById={catById}
      />

      <NewspaperShelf
        title="প্রবন্ধ ও ভাবনা"
        subtitle="চিন্তাশীল প্রবন্ধ, দর্শন, সমাজ ও মননশীল বিশ্লেষণ"
        genre="nonfiction"
        catById={catById}
      />

      <NewspaperShelf
        title="বাস্তব জীবনের অভিজ্ঞতা"
        subtitle="স্মৃতিচারণ, ভ্রমণকাহিনি ও বাস্তব জীবনের উপলব্ধি"
        genre="experience"
        catById={catById}
      />

      {/* 6. "জানুন" (KNOW) DETAILED EDITORIAL SECTION */}
      <section
        id="know-section"
        className={`${CONTAINER_WIDTH} py-14 border-t-2 border-foreground`}
      >
        <div className="border-b-2 border-foreground pb-3 mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            সম্পাদকীয় নির্দেশিকা
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mt-1">
            জানুন: এই প্ল্যাটফর্ম সম্পর্কে
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-relaxed">
          {/* Column 1 */}
          <div className="md:border-r border-foreground/20 md:pr-6 space-y-3">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <span className="font-mono text-xs border border-foreground px-1.5 py-0.5">০১</span>
              <span>উদ্দেশ্য ও দর্শন</span>
            </h3>
            <p className="text-muted-foreground font-serif">
              ‘জানুন, পড়ুন, লিখুন’ হলো বাংলা সাহিত্যের স্বাধীন, উন্মুক্ত ও নিরপেক্ষ একটি প্রকাশনা
              মাধ্যম। প্রতিটি মানুষের ভেতরেই এক একটি জীবন্ত গল্প লুকিয়ে থাকে। আমাদের লক্ষ্য সেই
              সুপ্ত কথাগুলোকে এক ছাদের নিচে সাহিত্যের রূপ দেওয়া।
            </p>
          </div>

          {/* Column 2 */}
          <div className="md:border-r border-foreground/20 md:pr-6 space-y-3">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <span className="font-mono text-xs border border-foreground px-1.5 py-0.5">০২</span>
              <span>লেখকদের স্বাধিকার</span>
            </h3>
            <p className="text-muted-foreground font-serif">
              এখানে আপনি নিজের আসল নামে কিংবা ছদ্মনামে লিখতে পারবেন সম্পূর্ণ স্বাধীনভাবে।
              ধারাবাহিক পর্ব প্রকাশের সুবিধা রয়েছে, রয়েছে পাঠকদের তাৎক্ষণিক প্রতিক্রিয়া জানার ব্যবস্থা।
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <span className="font-mono text-xs border border-foreground px-1.5 py-0.5">০৩</span>
              <span>পাঠ ও মূল্যায়ন</span>
            </h3>
            <p className="text-muted-foreground font-serif">
              পাঠকরা এখানে খুঁজে পাবেন নানা স্বাদের লেখা—কল্পকাহিনি থেকে শুরু করে মননশীল প্রবন্ধ
              এবং সত্য জীবনের অভিজ্ঞতা। পছন্দের লেখকদের ফলো করুন ও রেটিং দিন।
            </p>
          </div>
        </div>
      </section>

      {/* 7. CLASSIC NEWSPAPER COLOPHON / FOOTER */}
      <footer className="border-t-2 border-foreground bg-muted/20 py-10">
        <div className={`${CONTAINER_WIDTH} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground`}>
          <div>
            <span className="font-bold text-foreground font-display text-sm">জানুন, পড়ুন, লিখুন</span>
            <span className="mx-2">•</span>
            <span>সর্বস্বত্ব সংরক্ষিত © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/browse" className="hover:text-foreground hover:underline">
              পড়ুন (লাইব্রেরি)
            </Link>
            <Link to="/write" className="hover:text-foreground hover:underline">
              লিখুন (নতুন পোস্ট)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
