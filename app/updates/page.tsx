import { getEvents } from "../actions/events";
import UpdatesClient from "./UpdatesClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata = {
  title: "Updates & Events | Higgins Law",
  description: "Stay up to date with the latest news and events from Higgins Law.",
};

export default async function UpdatesPage() {
  const events = await getEvents();
  return (
    <>
      <Navbar />
      <main>
        <UpdatesClient events={events} />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
