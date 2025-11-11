import Navigation from "@/components/Navigation";
import Hero from "@/components/landingPage/Hero";
import Features from "@/components/landingPage/Features";
import MeetingDashboard from "@/components/landingPage/MeetingDashboard";
import Footer from "@/components/landingPage/Footer";

const Index = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <Hero />
      <Features />
      <MeetingDashboard />
      <Footer />
    </main>
  );
};

export default Index;