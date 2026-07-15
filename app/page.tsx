import type { Metadata } from "next";
import { getSiteContent, getSettings } from "./actions/content";
import { getFaqs } from "./actions/faq";
import HomeClient from "./HomeClient";

// SEO fields from the Site Editor override the layout defaults when set.
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const meta: Metadata = {};
  if (s["meta.title"]) {
    meta.title = s["meta.title"];
    meta.openGraph = { title: s["meta.title"] };
  }
  if (s["meta.desc"]) {
    meta.description = s["meta.desc"];
    meta.openGraph = { ...meta.openGraph, description: s["meta.desc"] };
  }
  return meta;
}

// Static by default; saveSiteContent() calls revalidatePath("/") after edits.
export default async function Home() {
  const [c, faq, s] = await Promise.all([getSiteContent(), getFaqs(), getSettings()]);
  const bar =
    s["bar.enabled"] === "1" && s["bar.text"]
      ? { text: s["bar.text"], link: s["bar.link"] }
      : {};
  return <HomeClient c={c} faq={faq} bar={bar} />;
}
