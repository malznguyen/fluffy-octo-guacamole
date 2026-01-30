import { HeroSection } from '@/components/home/HeroSection';
import { CategoryBento } from '@/components/home/CategoryBento';
import { LookbookGrid } from '@/components/home/LookbookGrid';
import { MarqueeBanner } from '@/components/home/MarqueeBanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <HeroSection />
      <CategoryBento />
      <MarqueeBanner />
      <LookbookGrid />
    </main>
  );
}
