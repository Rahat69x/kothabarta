import { useEffect, useState } from "react";
import { Settings2, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ReaderPrefs = {
  fontSize: number;
  lineHeight: number;
  paraGap: number;
  width: number;
  family: "serif" | "sans";
  bg: "default" | "sepia" | "dark";
};

export const DEFAULT_PREFS: ReaderPrefs = {
  fontSize: 18,
  lineHeight: 2,
  paraGap: 1.1,
  width: 720,
  family: "sans",
  bg: "default",
};

const KEY = "reader-prefs";

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const update = (patch: Partial<ReaderPrefs>) =>
    setPrefs((p) => {
      const next = { ...p, ...patch };
      window.localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });

  const reset = () => {
    window.localStorage.removeItem(KEY);
    setPrefs(DEFAULT_PREFS);
  };

  return { prefs, update, reset };
}

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
      </div>
      {children}
    </div>
  );
}

export function ReaderSettings({
  prefs,
  update,
  reset,
}: {
  prefs: ReaderPrefs;
  update: (p: Partial<ReaderPrefs>) => void;
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm">
          <Settings2 className="mr-1 h-4 w-4" />
          {t("readerSettings")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-4">
        <Row label={t("fontSize")} value={`${prefs.fontSize}px`}>
          <Slider
            min={14}
            max={30}
            step={1}
            value={[prefs.fontSize]}
            onValueChange={([v]) => update({ fontSize: v })}
          />
        </Row>

        <Row label={t("lineHeight")} value={prefs.lineHeight.toFixed(2)}>
          <Slider
            min={1.4}
            max={2.6}
            step={0.05}
            value={[prefs.lineHeight]}
            onValueChange={([v]) => update({ lineHeight: v })}
          />
        </Row>

        <Row label={t("paraSpacing")} value={`${prefs.paraGap.toFixed(1)}em`}>
          <Slider
            min={0.4}
            max={2.5}
            step={0.1}
            value={[prefs.paraGap]}
            onValueChange={([v]) => update({ paraGap: v })}
          />
        </Row>

        <Row label={t("pageWidth")} value={`${prefs.width}px`}>
          <Slider
            min={560}
            max={1200}
            step={20}
            value={[prefs.width]}
            onValueChange={([v]) => update({ width: v })}
          />
        </Row>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">{t("fontFamily")}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant={prefs.family === "sans" ? "default" : "outline"}
              onClick={() => update({ family: "sans" })}
            >
              {t("sansSerif")}
            </Button>
            <Button
              size="sm"
              variant={prefs.family === "serif" ? "default" : "outline"}
              onClick={() => update({ family: "serif" })}
            >
              {t("serif")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">{t("readerTheme")}</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant={prefs.bg === "default" ? "default" : "outline"}
              onClick={() => update({ bg: "default" })}
            >
              {t("lightMode")}
            </Button>
            <Button
              size="sm"
              variant={prefs.bg === "sepia" ? "default" : "outline"}
              onClick={() => update({ bg: "sepia" })}
            >
              {t("sepia")}
            </Button>
            <Button
              size="sm"
              variant={prefs.bg === "dark" ? "default" : "outline"}
              onClick={() => update({ bg: "dark" })}
            >
              {t("darkMode")}
            </Button>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={reset}>
          <RotateCcw className="mr-1 h-4 w-4" />
          {t("reset")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
