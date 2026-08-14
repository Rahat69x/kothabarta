import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function ShareButton({ title, path }: { title: string; path?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function share() {
    const url =
      typeof window === "undefined" ? "" : path ? window.location.origin + path : window.location.href;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("linkCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user dismissed the share sheet */
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={share}>
      {copied ? <Check className="mr-1 h-4 w-4" /> : <Share2 className="mr-1 h-4 w-4" />}
      {t("share")}
    </Button>
  );
}
