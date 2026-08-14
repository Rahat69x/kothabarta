import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const REACTIONS = [
  { key: "like", emoji: "👍" },
  { key: "love", emoji: "❤️" },
  { key: "haha", emoji: "😂" },
  { key: "wow", emoji: "😮" },
  { key: "sad", emoji: "😢" },
  { key: "angry", emoji: "😡" },
] as const;

type ReactionKey = (typeof REACTIONS)[number]["key"];

export function ReactionBar({ storyId }: { storyId: string }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: rows } = useQuery({
    queryKey: ["likes", storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("user_id, reaction")
        .eq("story_id", storyId);
      if (error) throw error;
      return (data ?? []) as { user_id: string; reaction: string }[];
    },
  });

  const list = rows ?? [];
  const mine = user ? list.find((r) => r.user_id === user.id) : undefined;
  const mineKey = (mine?.reaction ?? null) as ReactionKey | null;
  const active = REACTIONS.find((r) => r.key === mineKey);

  const counts = REACTIONS.map((r) => ({
    ...r,
    n: list.filter((l) => l.reaction === r.key).length,
  })).filter((r) => r.n > 0);

  async function react(key: ReactionKey) {
    setOpen(false);
    if (!user) return toast.error(t("loginRequired"));
    if (mineKey === key) {
      await supabase.from("likes").delete().eq("story_id", storyId).eq("user_id", user.id);
    } else if (mineKey) {
      await supabase
        .from("likes")
        .update({ reaction: key })
        .eq("story_id", storyId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("likes").insert({ story_id: storyId, user_id: user.id, reaction: key });
    }
    qc.invalidateQueries({ queryKey: ["likes", storyId] });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <PopoverTrigger asChild>
            <Button
              variant={mineKey ? "default" : "outline"}
              size="sm"
              onClick={() => react(mineKey ?? "like")}
            >
              {active ? (
                <span className="mr-1 text-base leading-none">{active.emoji}</span>
              ) : (
                <ThumbsUp className="mr-1 h-4 w-4" />
              )}
              {mineKey ? t(mineKey) : t("like")} · {list.length}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            className="flex w-auto gap-1 rounded-full p-1.5"
          >
            {REACTIONS.map((r) => (
              <button
                key={r.key}
                type="button"
                aria-label={t(r.key)}
                title={t(r.key)}
                onClick={() => react(r.key)}
                className={cn(
                  "rounded-full px-1.5 py-1 text-2xl leading-none transition-transform hover:-translate-y-1 hover:scale-125",
                  mineKey === r.key && "bg-secondary",
                )}
              >
                {r.emoji}
              </button>
            ))}
          </PopoverContent>
        </div>
      </Popover>

      {counts.length > 0 && (
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          {counts.map((c) => (
            <span key={c.key} title={`${t(c.key)} · ${c.n}`}>
              {c.emoji}
              {c.n}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
