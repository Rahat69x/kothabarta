import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { fetchWriterRating } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function WriterRating({
  writerId,
  className,
  compact = false,
}: {
  writerId: string;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const { data } = useQuery({
    queryKey: ["writer-rating", writerId],
    queryFn: () => fetchWriterRating(writerId),
  });

  if (!data) return null;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}
      title={`${data.likes} ${t("like")} · ${data.stories} ${t("stories")}`}
    >
      <span className="flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              data.rating >= i + 0.75
                ? "fill-accent text-accent"
                : data.rating >= i + 0.25
                  ? "fill-accent/50 text-accent"
                  : "text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      <span className="font-medium text-foreground">{data.rating.toFixed(1)}</span>
      {!compact && (
        <span>
          {t("rating")} · {data.likes} {t("like")}
        </span>
      )}
    </span>
  );
}
