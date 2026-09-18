import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  PenLine,
  LogOut,
  Languages,
  Moon,
  Sun,
  Menu,
  Search,
  Library,
} from "lucide-react";
import logo from "@/assets/golpoghor-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { fetchProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/" });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/browse", search: q.trim() ? { q: q.trim() } : {} });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1720px] items-center gap-3 px-4 sm:px-8 lg:px-12">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src={logo}
            alt="গল্পঘর logo"
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-lg font-semibold tracking-tight sm:text-xl">
              {t("appName")}
            </span>
            <span className="block truncate text-[11px] tracking-wide text-muted-foreground">
              {t("motto")}
            </span>
          </span>
        </Link>

        <form onSubmit={submitSearch} className="relative ml-4 hidden max-w-md flex-1 md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-9"
            placeholder={t("searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        {/* Desktop nav */}
        <div className="ml-auto hidden items-center gap-1 md:flex lg:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/browse">
              <Library className="mr-1 h-4 w-4" />
              {t("browse")}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            aria-label="Toggle language"
          >
            <Languages className="mr-1 h-4 w-4" />
            {lang === "bn" ? "EN" : "বাং"}
          </Button>

          {user ? (
            <>
              <Button size="sm" asChild>
                <Link to="/write">
                  <PenLine className="mr-1 h-4 w-4" />
                  {t("quickPost")}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <PenLine className="mr-1 h-4 w-4" />
                  {t("write")}
                </Link>
              </Button>
              {profile && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/writer/$handle" params={{ handle: profile.handle }}>
                    @{profile.handle}
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" aria-label={t("signOut")} onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">{t("signIn")}</Link>
            </Button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" aria-label={t("search")} asChild>
            <Link to="/browse">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] max-w-xs">
              <SheetHeader>
                <SheetTitle className="font-display">{t("appName")}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                <form onSubmit={submitSearch} className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder={t("searchPlaceholder")}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </form>
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to="/browse">
                    <Library className="mr-2 h-4 w-4" />
                    {t("browse")}
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setLang(lang === "bn" ? "en" : "bn")}
                >
                  <Languages className="mr-2 h-4 w-4" />
                  {lang === "bn" ? "English" : "বাংলা"}
                </Button>

                {user ? (
                  <>
                    <Button className="justify-start" asChild onClick={() => setOpen(false)}>
                      <Link to="/write">
                        <PenLine className="mr-2 h-4 w-4" />
                        {t("quickPost")}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link to="/dashboard">
                        <PenLine className="mr-2 h-4 w-4" />
                        {t("write")}
                      </Link>
                    </Button>
                    {profile && (
                      <Button
                        variant="ghost"
                        className="justify-start"
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link to="/writer/$handle" params={{ handle: profile.handle }}>
                          @{profile.handle}
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="justify-start" onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("signOut")}
                    </Button>
                  </>
                ) : (
                  <Button className="justify-start" asChild onClick={() => setOpen(false)}>
                    <Link to="/auth">{t("signIn")}</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

