import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "সাইন ইন — গল্পঘর" },
      { name: "description", content: "Sign in or create a writer account on গল্পঘর." },
      { property: "og:title", content: "Sign in — গল্পঘর" },
      { property: "og:description", content: "Create a writer account and start publishing." },
      { property: "og:url", content: "https://amrjaicchalikhmu.lovable.app/auth" },
    ],
    links: [{ rel: "canonical", href: "https://amrjaicchalikhmu.lovable.app/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/profile" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/profile` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Check your inbox to confirm your email.");
  }

  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });
    if (error) return toast.error(error.message);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">{t("appName")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="in">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="in">{t("signIn")}</TabsTrigger>
              <TabsTrigger value="up">{t("signUp")}</TabsTrigger>
            </TabsList>

            {(["in", "up"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="pt-4">
                <form onSubmit={tab === "in" ? signIn : signUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${tab}`}>{t("email")}</Label>
                    <Input
                      id={`email-${tab}`}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pw-${tab}`}>{t("password")}</Label>
                    <Input
                      id={`pw-${tab}`}
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {tab === "in" ? t("signIn") : t("signUp")}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="my-4 h-px bg-border" />
          <Button variant="outline" className="w-full" onClick={google}>
            {t("continueGoogle")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
