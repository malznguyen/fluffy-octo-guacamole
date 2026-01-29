import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryBento } from '@/components/home/CategoryBento';
import { LookbookGrid } from '@/components/home/LookbookGrid';
import { MarqueeBanner } from '@/components/home/MarqueeBanner';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Header />
      <HeroSection />
      <CategoryBento />
      <MarqueeBanner />
      <LookbookGrid />
      <Footer />
    </main>
  );
}
