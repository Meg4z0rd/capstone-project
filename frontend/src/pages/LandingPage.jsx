import Navbar from '../components/organisms/Navbar';
import HeroSection from '../components/organisms/HeroSection';
import FeaturesSection from '../components/organisms/FeaturesSection';
import HowItWorksSection from '../components/organisms/HowItWorksSection';
import CTASection from '../components/organisms/CTASection';
import Footer from '../components/organisms/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
