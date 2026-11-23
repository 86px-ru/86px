import Preloader from '@/components/Preloader';
import RevealInit from '@/components/RevealInit';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import Works from '@/components/Works';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Preloader />
      <RevealInit />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Works />
        <Process />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
