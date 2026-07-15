import { getSiteContent } from "./actions/content";
import HomeClient from "./HomeClient";

// Static by default; saveSiteContent() calls revalidatePath("/") after edits.
export default async function Home() {
  const c = await getSiteContent();
  return <HomeClient c={c} />;
}
