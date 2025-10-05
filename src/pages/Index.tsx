import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MeetingDashboard from "@/components/MeetingDashboard";
import Footer from "@/components/Footer";

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