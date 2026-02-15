import { HeroSection } from '@/components/landing/HeroSection';
import { ComparisonDemo } from '@/components/landing/ComparisonDemo';
import { ArchitectureDiagram } from '@/components/landing/ArchitectureDiagram';
import { DemoAccountCards } from '@/components/landing/DemoAccountCards';
import { TestScenarios } from '@/components/landing/TestScenarios';
import { DocumentsDownload } from '@/components/landing/DocumentsDownload';
import { ProductionVision } from '@/components/landing/ProductionVision';

export default function Home() {
  return (
    <main className="landing-page min-h-screen">
      <HeroSection />
      <ComparisonDemo />
      <ArchitectureDiagram />
      <DemoAccountCards />
      <TestScenarios />
      <DocumentsDownload />
      <ProductionVision />
    </main>
  );
}
