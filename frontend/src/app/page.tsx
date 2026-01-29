import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestSellersGrid } from "@/components/home/BestSellersGrid";
import { ServiceBanner } from "@/components/home/ServiceBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Featured Categories */}
        <CategoryGrid />

        {/* Best Selling Products */}
        <BestSellersGrid />

        {/* Service Banner */}
        <ServiceBanner />
      </main>

      <Footer />
    </div>
  );
}
