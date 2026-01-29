import { Header } from "@/components/sections/Header";
import { HeroSlideshow } from "@/components/sections/HeroSlideshow";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { ServiceBanner } from "@/components/sections/ServiceBanner";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSlideshow />
        <CategoryGrid />
        <ProductGrid />
        <ServiceBanner />
      </main>
      <Footer />
    </div>
  );
}
