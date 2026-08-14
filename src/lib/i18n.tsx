import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";

const dict = {
  appName: { bn: "গল্পঘর", en: "Golpoghor" },
  tagline: {
    bn: "বাংলা লেখকদের গল্প, প্রবন্ধ আর অভিজ্ঞতার ঘর",
    en: "A home for Bangla stories, essays and lived experience",
  },
  heroLead: {
    bn: "নিজের নামে অথবা ছদ্মনামে লিখুন — পর্বে পর্বে প্রকাশ করুন।",
    en: "Write under your real name or a pen name — publish part by part.",
  },
  browse: { bn: "পড়ুন", en: "Browse" },
  write: { bn: "লিখুন", en: "Write" },
  dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  signIn: { bn: "সাইন ইন", en: "Sign in" },
  signOut: { bn: "সাইন আউট", en: "Sign out" },
  signUp: { bn: "রেজিস্টার", en: "Sign up" },
  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  continueGoogle: { bn: "গুগল দিয়ে চালিয়ে যান", en: "Continue with Google" },
  profileSetup: { bn: "প্রোফাইল সেটআপ", en: "Profile setup" },
  handle: { bn: "ইউজারনেম", en: "Username" },
  realName: { bn: "আসল নাম", en: "Real name" },
  penName: { bn: "ছদ্মনাম", en: "Pen name" },
  bio: { bn: "পরিচিতি", en: "Bio" },
  publishAs: { bn: "যে নামে প্রকাশ করবেন", en: "Publish as" },
  useRealName: { bn: "আসল নাম", en: "Real name" },
  usePenName: { bn: "ছদ্মনাম / বেনামে", en: "Pen name / anonymous" },
  save: { bn: "সংরক্ষণ", en: "Save" },
  saving: { bn: "সংরক্ষণ হচ্ছে…", en: "Saving…" },
  cancel: { bn: "বাতিল", en: "Cancel" },
  delete: { bn: "মুছুন", en: "Delete" },
  edit: { bn: "সম্পাদনা", en: "Edit" },
  newStory: { bn: "নতুন লেখা", en: "New story" },
  myStories: { bn: "আমার লেখা", en: "My stories" },
  title: { bn: "শিরোনাম", en: "Title" },
  description: { bn: "সারসংক্ষেপ", en: "Description" },
  coverImage: { bn: "কভার ছবি", en: "Cover image" },
  tags: { bn: "ট্যাগ", en: "Tags" },
  tagsHint: { bn: "কমা দিয়ে আলাদা করুন", en: "Comma separated" },
  category: { bn: "ক্যাটাগরি", en: "Category" },
  genre: { bn: "ধরন", en: "Type" },
  status: { bn: "অবস্থা", en: "Status" },
  fiction: { bn: "কল্পকাহিনি", en: "Fiction" },
  nonfiction: { bn: "নন-ফিকশন", en: "Non-fiction" },
  experience: { bn: "অভিজ্ঞতা / ব্লগ", en: "Experience blog" },
  ongoing: { bn: "চলমান", en: "Ongoing" },
  completed: { bn: "সমাপ্ত", en: "Completed" },
  hiatus: { bn: "বিরতিতে", en: "Hiatus" },
  regional: { bn: "আঞ্চলিক", en: "Regional" },
  nonRegional: { bn: "অ-আঞ্চলিক", en: "Non-regional" },
  all: { bn: "সব", en: "All" },
  parts: { bn: "পর্ব", en: "Parts" },
  addPart: { bn: "নতুন পর্ব", en: "Add part" },
  partTitle: { bn: "পর্বের শিরোনাম", en: "Part title" },
  body: { bn: "লেখা", en: "Body" },
  bodyHint: {
    bn: "ছবি যোগ করতে আলাদা লাইনে ছবির লিংক দিন",
    en: "Put an image URL on its own line to embed it",
  },
  draft: { bn: "খসড়া", en: "Draft" },
  published: { bn: "প্রকাশিত", en: "Published" },
  publish: { bn: "প্রকাশ করুন", en: "Publish" },
  unpublish: { bn: "খসড়ায় ফেরান", en: "Move to draft" },
  words: { bn: "শব্দ", en: "words" },
  minRead: { bn: "মিনিট পড়া", en: "min read" },
  like: { bn: "লাইক", en: "Like" },
  love: { bn: "ভালোবাসা", en: "Love" },
  haha: { bn: "হাহা", en: "Haha" },
  wow: { bn: "বাহ", en: "Wow" },
  sad: { bn: "দুঃখিত", en: "Sad" },
  angry: { bn: "রাগ", en: "Angry" },
  deleteStory: { bn: "লেখা মুছুন", en: "Delete story" },
  deleteConfirm: {
    bn: "এটি স্থায়ীভাবে মুছে যাবে। নিশ্চিত?",
    en: "This will be permanently deleted. Are you sure?",
  },
  deleted: { bn: "মুছে ফেলা হয়েছে", en: "Deleted" },
  bookmark: { bn: "বুকমার্ক", en: "Bookmark" },
  follow: { bn: "ফলো", en: "Follow" },
  following: { bn: "ফলো করছেন", en: "Following" },
  comments: { bn: "মন্তব্য", en: "Comments" },
  writeComment: { bn: "মন্তব্য লিখুন…", en: "Write a comment…" },
  send: { bn: "পাঠান", en: "Send" },
  noStories: { bn: "কোনো লেখা পাওয়া যায়নি", en: "No stories found" },
  noParts: { bn: "এখনো কোনো পর্ব নেই", en: "No parts yet" },
  readingList: { bn: "পড়ছি", en: "Reading list" },
  by: { bn: "লিখেছেন", en: "by" },
  search: { bn: "খুঁজুন", en: "Search" },
  startReading: { bn: "পড়া শুরু করুন", en: "Start reading" },
  loginRequired: { bn: "আগে সাইন ইন করুন", en: "Please sign in first" },
  profileFirst: { bn: "প্রথমে প্রোফাইল সেটআপ করুন", en: "Set up your profile first" },
  stories: { bn: "লেখা", en: "Stories" },
  followers: { bn: "ফলোয়ার", en: "Followers" },
  penNameOverride: { bn: "এই লেখার জন্য আলাদা নাম", en: "Pen name for this story" },
  optional: { bn: "ঐচ্ছিক", en: "optional" },
  premiumLater: { bn: "প্রিমিয়াম (পরে চালু হবে)", en: "Premium (coming later)" },
  back: { bn: "ফিরে যান", en: "Back" },
  anonymous: { bn: "বেনামী", en: "Anonymous" },
  rating: { bn: "রেটিং", en: "rating" },
  motto: { bn: "লিখুন মন খুলে", en: "Likhkhun Mon Khule" },
  darkMode: { bn: "ডার্ক মোড", en: "Dark mode" },
  lightMode: { bn: "লাইট মোড", en: "Light mode" },
  share: { bn: "শেয়ার", en: "Share" },
  linkCopied: { bn: "লিংক কপি হয়েছে", en: "Link copied" },
  quickPost: { bn: "দ্রুত পোস্ট", en: "Quick post" },
  quickPostLead: {
    bn: "শিরোনাম আর লেখা দিন — এক ক্লিকেই প্রকাশ।",
    en: "Add a title and your text — publish in one click.",
  },
  publishNow: { bn: "এখনই প্রকাশ করুন", en: "Publish now" },
  saveDraft: { bn: "খসড়া রাখুন", en: "Save as draft" },
  goToComments: { bn: "মন্তব্য দেখুন", en: "See comments" },
  searchPlaceholder: { bn: "গল্প বা লেখকের নাম খুঁজুন…", en: "Search stories or writers…" },
  browseTitle: { bn: "গল্প ব্রাউজ করুন", en: "Browse stories" },
  searchLabel: { bn: "গল্প খুঁজুন", en: "Search stories" },

  filters: { bn: "ফিল্টার", en: "Filters" },
  clearFilters: { bn: "ফিল্টার মুছুন", en: "Clear filters" },
  results: { bn: "ফলাফল", en: "Results" },
  viewAll: { bn: "সব দেখুন", en: "View all" },
  latest: { bn: "সদ্য প্রকাশিত", en: "Just added" },
  allBooks: { bn: "সব লেখা", en: "All stories" },
  readerSettings: { bn: "পড়ার সেটিংস", en: "Reading settings" },
  fontSize: { bn: "ফন্ট সাইজ", en: "Font size" },
  lineHeight: { bn: "লাইন স্পেসিং", en: "Line spacing" },
  paraSpacing: { bn: "প্যারা দূরত্ব", en: "Paragraph spacing" },
  pageWidth: { bn: "পেজ প্রস্থ", en: "Page width" },
  fontFamily: { bn: "ফন্ট", en: "Typeface" },
  serif: { bn: "সেরিফ", en: "Serif" },
  sansSerif: { bn: "সান্স", en: "Sans" },
  readerTheme: { bn: "ব্যাকগ্রাউন্ড", en: "Background" },
  sepia: { bn: "সেপিয়া", en: "Sepia" },
  reset: { bn: "রিসেট", en: "Reset" },
} as const;



export type TKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };

const LanguageContext = createContext<Ctx>({ lang: "bn", setLang: () => {}, t: (k) => dict[k].bn });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "bn" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("lang", l);
  }, []);

  const t = useCallback((k: TKey) => dict[k][lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useI18n() {
  return useContext(LanguageContext);
}
