import LandingNav from "@/components/landing/LandingNav";
import PremiumHero from "@/components/landing/PremiumHero";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TrustSection from "@/components/landing/TrustSection";
import WhyDifferentSection from "@/components/landing/WhyDifferentSection";
import CTASection from "@/components/landing/CTASection";
import PremiumFooter from "@/components/landing/PremiumFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingNav />
      <PremiumHero />
      <ProblemSection />
      <section id="features">
        <SolutionSection />
      </section>
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      <section id="about">
        <TrustSection />
      </section>
      <WhyDifferentSection />
      <CTASection />
      <PremiumFooter />
    </div>
  );
};

export default Index;
