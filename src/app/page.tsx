import { Hero } from '@/components/home/Hero';
import { MissionSection } from '@/components/home/MissionSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ThoughtsTeaser } from '@/components/home/ThoughtsTeaser';
import { VisitSection } from '@/components/home/VisitSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionSection />
      <FeaturedProducts />
      <ThoughtsTeaser />
      <VisitSection />
    </>
  );
}
