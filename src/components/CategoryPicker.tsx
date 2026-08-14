import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { categoryName, type Category } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Multi-select genre (category) chips — a story can belong to several genres. */
export function CategoryPicker({
  options,
  value,
  onChange,
  className,
}: {
  options: Category[];
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
}) {
  const { t, lang } = useI18n();

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }

  if (options.length === 0)
    return <p className="text-sm text-muted-foreground">{t("category")}…</p>;

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label={t("category")}>
      {options.map((c) => {
        const active = value.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(c.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {active && <Check className="h-3 w-3" />}
            {categoryName(c, lang)}
          </button>
        );
      })}
    </div>
  );
}
