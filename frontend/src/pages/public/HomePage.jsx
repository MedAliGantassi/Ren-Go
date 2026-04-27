import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSearch = (form) => {
    const params = new URLSearchParams();
    if (form.arrivee) params.append('dateDebut', form.arrivee);
    if (form.depart) params.append('dateFin', form.depart);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <main>
      <HeroSection onSearch={handleSearch} />
      <StatsSection />
      <AboutSection />
      <PropertySection />
      
      <TestimonialsSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}