import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Team from "@/components/Team";
import Process from "@/components/Process";
import Practice from "@/components/Practice";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export default function Home() {
  const marquee1 = [
    "Experience", "Compassion", "Results", "Criminal Defense", 
    "Estate Planning", "Personal Injury", "Juvenile Law", 
    "54+ Years Combined", "Father & Son Firm", "Free Consultations"
  ];
  
  const marquee2 = [
    "Relationships", "Respect", "Results", "Trusted Since Day One",
    "Your Future Matters", "Pineville, Louisiana", "318.473.4250",
    "Schedule a Free Consultation"
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee items={marquee1} />
        <About />
        <Team />
        <Process />
        <Marquee items={marquee2} reverse />
        <Practice />
        <WhyUs />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
