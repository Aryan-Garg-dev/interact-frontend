import React from 'react';
import Navbar from '@/sections/landing/navbar';
import HeroSection from '@/sections/landing/heroSection';
import Features from '@/sections/landing/features';
import WhyChooseUs from '@/sections/landing/whyechosseus';
import Community from '@/sections/landing/community';
import Footer from '@/sections/landing/footer';
import ExploreCommunity from '@/sections/landing/explore';
import Testimonials from '@/sections/landing/testimonails';

const Separator = () => {
  return <div className="h-[3px] w-full bg-gradient-to-r from-white via-gray-300 to-white my-2"></div>;
};

const LandingPage = () => {
  return (
    <div
      className="w-full flex flex-col gap-24"
      style={{
        cursor: `url('/landing/cursor.svg'), auto`,
      }}
    >
      <div className="w-4/5 max-md:w-full mx-auto">
        <Navbar />
        <Separator />
        <HeroSection />
        <Separator />
        <Features />
        <Community />
      </div>
      <WhyChooseUs />
      <Testimonials />
      <div className="w-4/5 max-md:w-full mx-auto">
        <ExploreCommunity />
      </div>
      <div className="bottom-0 mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
