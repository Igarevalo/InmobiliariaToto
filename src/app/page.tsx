import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { StatsCounter } from "@/components/home/StatsCounter";
import { Testimonials } from "@/components/home/Testimonials";
import { PublishSection } from "@/components/home/PublishSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsCounter />
        <FeaturedProperties />
        <PublishSection />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
