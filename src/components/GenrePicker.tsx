import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Genre } from "@/lib/data";
import { cn } from "@/lib/utils";

const ALL: Genre[] = ["fiction", "nonfiction", "experience"];

/** Single-select story type — Fiction, Non-fiction or Experience. */
export function GenrePicker({
  value,
  onChange,
  className,
}: {
  value: Genre;
  onChange: (next: Genre) => void;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label={t("genre")}>
      {ALL.map((g) => {
        const active = value === g;
        return (
          <button
            key={g}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(g)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {active && <Check className="h-3.5 w-3.5" />}
            {t(g)}
          </button>
        );
      })}
    </div>
  );
}
