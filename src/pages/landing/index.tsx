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
  return <div className="h-[3px] md:w-[80vw] w-[90vw] bg-gradient-to-r from-white via-gray-300 to-white my-2"></div>;
};

const LandingPage = () => {
  return (
    <div
      className="w-full flex flex-col gap-24 bg-white overflow-hidden"
      style={{
        cursor: `url('/landing/cursor.svg'), auto`,
      }}
    >
      <div className="w-4/5 max-md:w-full mx-auto">
        <div className="flex flex-col items-center justify-center">
          <Navbar />
          <Separator />
          <HeroSection />
          <Separator />
        </div>
        <Features />
        <Community />
      </div>
      <WhyChooseUs />
      <Testimonials />
      <div className="w-4/5 max-md:w-full mx-auto">
        <ExploreCommunity />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
