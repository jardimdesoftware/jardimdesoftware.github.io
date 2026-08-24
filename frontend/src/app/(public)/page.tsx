import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ValuePropsSection } from "@/components/landing/ValuePropsSection";
import { TeamPreviewSection } from "@/components/landing/TeamPreviewSection";
import { ProjectsPreviewSection } from "@/components/landing/ProjectsPreviewSection";
import { TestimonialsCarouselSection } from "@/components/landing/TestimonialsCarouselSection";
import { NewsPreviewSection } from "@/components/landing/NewsPreviewSection";
import { CTASection } from "@/components/landing/CTASection";

// Export estatico (GitHub Pages, sem servidor Node/SSR): nao ha mais
// prefetch/HydrationBoundary aqui. Cada secao abaixo ja e um Client
// Component ("use client") que busca seus proprios dados via useQuery
// (React Query) depois da hidratacao, com seu proprio skeleton de loading -
// ver src/components/landing/*.
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ValuePropsSection />
      <TeamPreviewSection />
      <ProjectsPreviewSection />
      <TestimonialsCarouselSection />
      <NewsPreviewSection />
      <CTASection />
    </>
  );
}
