import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { categoryName, fetchCategories, type Genre, type Status } from "@/lib/data";
import { fetchStories } from "@/lib/stories";
import { StoryCard } from "@/components/StoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type BrowseSearch = {
  q?: string;
  genre?: Genre | "all";
  status?: Status | "all";
  category?: string;
  regional?: "all" | "yes" | "no";
};

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    genre: (search.genre as BrowseSearch["genre"]) ?? undefined,
    status: (search.status as BrowseSearch["status"]) ?? undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    regional: (search.regional as BrowseSearch["regional"]) ?? undefined,
  }),
  head: () => ({
    meta: [
      { title: "খুঁজুন ও ব্রাউজ করুন — গল্পঘর" },
      {
        name: "description",
        content:
          "Search Bangla stories and filter by genre, category, status and region on গল্পঘর.",
      },
      { property: "og:title", content: "Browse & search — গল্পঘর" },
      {
        property: "og:description",
        content: "Search Bangla stories and filter by genre, category, status and region.",
      },
      { property: "og:url", content: "/browse" },
    ],
    links: [{ rel: "canonical", href: "/browse" }],
  }),
  component: Browse,
});

function Browse() {
  const { t, lang } = useI18n();
  const navigate = useNavigate({ from: "/browse" });
  const sp = Route.useSearch();

  const genre = sp.genre ?? "all";
  const status = sp.status ?? "all";
  const categoryId = sp.category ?? "all";
  const regional = sp.regional ?? "all";
  const query = sp.q ?? "";

  const [search, setSearch] = useState(query);
  useEffect(() => setSearch(query), [query]);

  const setParam = (patch: Partial<BrowseSearch>) =>
    navigate({ search: (prev: BrowseSearch) => ({ ...prev, ...patch }), replace: true });

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const visibleCategories = useMemo(
    () => (categories ?? []).filter((c) => genre === "all" || c.genre_type === genre),
    [categories, genre],
  );

  const filters = { genre, status, categoryId, regional, search: query };
  const { data, isLoading } = useQuery({
    queryKey: ["stories", filters],
    queryFn: () => fetchStories(filters),
  });

  const catById = useMemo(
    () => Object.fromEntries((categories ?? []).map((c) => [c.id, c])),
    [categories],
  );

  const hasFilters =
    genre !== "all" || status !== "all" || categoryId !== "all" || regional !== "all" || !!query;

  return (
    <div className="w-full px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{t("browseTitle")}</h1>

      <form
        className="relative mt-5 max-w-3xl lg:max-w-4xl"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setParam({ q: search || undefined });
        }}
      >
        <label htmlFor="browse-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="browse-search"
          type="search"
          className="h-11 pl-9"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* Quick Collection Filter Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setParam({ q: undefined, genre: "all", category: undefined });
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            !query && genre === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          সকল বই
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("হুমায়ূন আহমেদ");
            setParam({ q: "হুমায়ূন আহমেদ" });
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            query === "হুমায়ূন আহমেদ"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          হুমায়ূন আহমেদ ৯৯ সাহিত্য সংকলন
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("উপন্যাস");
            setParam({ q: "উপন্যাস" });
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            query === "উপন্যাস"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          কালজয়ী উপন্যাস
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("রহস্য");
            setParam({ q: "রহস্য" });
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            query === "রহস্য"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          রহস্য ও মিসির আলি
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("মুক্তিযুদ্ধ");
            setParam({ q: "মুক্তিযুদ্ধ" });
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            query === "মুক্তিযুদ্ধ"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          মুক্তিযুদ্ধের ইতিহাস
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("সায়েন্স ফিকশন");
            setParam({ q: "সায়েন্স ফিকশন" });
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            query === "সায়েন্স ফিকশন"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          সায়েন্স ফিকশন
        </button>
      </div>

      <section aria-labelledby="browse-filters-heading">
        <h2 id="browse-filters-heading" className="sr-only">
          {t("filters")}
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            {t("filters")}
          </span>
          <Select
            value={genre}
            onValueChange={(v) => setParam({ genre: v as Genre | "all", category: undefined })}
          >
            <SelectTrigger className="w-[170px]" aria-label={t("genre")}>
              <SelectValue placeholder={t("genre")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("genre")}: {t("all")}
              </SelectItem>
              <SelectItem value="fiction">{t("fiction")}</SelectItem>
              <SelectItem value="nonfiction">{t("nonfiction")}</SelectItem>
              <SelectItem value="experience">{t("experience")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryId} onValueChange={(v) => setParam({ category: v })}>
            <SelectTrigger className="w-[190px]" aria-label={t("category")}>
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("category")}: {t("all")}
              </SelectItem>
              {visibleCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {categoryName(c, lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setParam({ status: v as Status | "all" })}>
            <SelectTrigger className="w-[160px]" aria-label={t("status")}>
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("status")}: {t("all")}
              </SelectItem>
              <SelectItem value="ongoing">{t("ongoing")}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
              <SelectItem value="hiatus">{t("hiatus")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={regional}
            onValueChange={(v) => setParam({ regional: v as "all" | "yes" | "no" })}
          >
            <SelectTrigger className="w-[150px]" aria-label={t("regional")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="yes">{t("regional")}</SelectItem>
              <SelectItem value="no">{t("nonRegional")}</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate({
                  search: {},
                  replace: true,
                })
              }
            >
              {t("clearFilters")}
            </Button>
          )}
        </div>
      </section>

      <section aria-labelledby="browse-results-heading">
        <h2 id="browse-results-heading" className="mt-6 text-sm text-muted-foreground">
          {t("results")}: {data?.stories.length ?? 0}
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8">
          {isLoading &&
            Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
          {data?.stories.map((s) => (
            <StoryCard
              key={s.id}
              story={s}
              profile={data.profiles[s.writer_id]}
              category={s.category_id ? catById[s.category_id] : null}
            />
          ))}
        </div>
        {!isLoading && data?.stories.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">{t("noStories")}</p>
        )}
      </section>

    </div>
  );
}
