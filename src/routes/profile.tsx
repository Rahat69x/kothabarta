import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { fetchProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "প্রোফাইল সেটআপ — গল্পঘর" },
      {
        name: "description",
        content: "Choose whether to publish under your real name or a pen name.",
      },
      { property: "og:title", content: "Writer profile — গল্পঘর" },
      { property: "og:description", content: "Set your writer identity on গল্পঘর." },
      { property: "og:url", content: "/profile" },
    ],
    links: [{ rel: "canonical", href: "/profile" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  const [handle, setHandle] = useState("");
  const [realName, setRealName] = useState("");
  const [penName, setPenName] = useState("");
  const [usePen, setUsePen] = useState("real");
  const [bio, setBio] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!profile) return;
    setHandle(profile.handle);
    setRealName(profile.real_name ?? "");
    setPenName(profile.default_pen_name ?? "");
    setUsePen(profile.use_pen_name ? "pen" : "real");
    setBio(profile.bio ?? "");
  }, [profile]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("writer_profiles").upsert({
      id: user.id,
      handle: handle.trim().toLowerCase(),
      real_name: realName.trim() || null,
      default_pen_name: penName.trim() || null,
      use_pen_name: usePen === "pen",
      bio: bio.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Saved");
    navigate({ to: "/dashboard" });
  }

  if (loading || isLoading) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="font-display text-2xl leading-none font-semibold">{t("profileSetup")}</h1>
        </CardHeader>


        <CardContent>
          <form onSubmit={save} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="handle">{t("handle")}</Label>
              <Input
                id="handle"
                required
                value={handle}
                pattern="[a-zA-Z0-9_\-]+"
                onChange={(e) => setHandle(e.target.value)}
                placeholder="rafi_writes"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("publishAs")}</Label>
              <RadioGroup value={usePen} onValueChange={setUsePen} className="gap-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="real" id="as-real" />
                  <Label htmlFor="as-real" className="font-normal">
                    {t("useRealName")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pen" id="as-pen" />
                  <Label htmlFor="as-pen" className="font-normal">
                    {t("usePenName")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="real">{t("realName")}</Label>
                <Input id="real" value={realName} onChange={(e) => setRealName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pen">{t("penName")}</Label>
                <Input id="pen" value={penName} onChange={(e) => setPenName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("bio")}</Label>
              <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <Button type="submit" disabled={busy}>
              {busy ? t("saving") : t("save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
