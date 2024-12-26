import React from 'react';
import Navbar from '@/sections/landing/navbar';
import HeroSection from '@/sections/landing/heroSection';
import Features from '@/sections/landing/features';
import WhyChooseUs from '@/sections/landing/whyechosseus';
import Community from '@/sections/landing/community';
import Footer from '@/sections/landing/footer';
import ExploreCommunity from '@/sections/landing/explore';
import Testimonials from '@/sections/landing/testimonails';

const Separator = ({ excludeMargin = false }) => {
  return (
    <div
      className={`h-[2px] w-screen bg-gradient-to-r from-white dark:from-dark_primary_comp via-gray-300 dark:via-dark_primary_btn to-white ${
        !excludeMargin && 'my-2'
      }`}
    ></div>
  );
};

const LandingPage = () => {
  return (
    <div
      className="w-full flex flex-col gap-24 bg-background overflow-hidden"
      style={{
        cursor: `url('/landing/cursor.svg'), auto`,
      }}
    >
      <div className="w-5/6 max-md:w-full mx-auto">
        <div className="flex flex-col items-center justify-center">
          <Navbar />
          <Separator excludeMargin />
          <HeroSection />
          <Separator excludeMargin />
        </div>
        <Features />
        <Community />
      </div>
      {/* <WhyChooseUs /> */}
      <Testimonials />
      <ExploreCommunity />
      <Footer />
    </div>
  );
};

export default LandingPage;
