import {
  HeroSection,
  StatsSection,
  AboutSection,
  PropertySection,
  TestimonialsSection,
  HowItWorksSection,
  CTASection,
} from '../../components/home';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <PropertySection />
      
      <TestimonialsSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}