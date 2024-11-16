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
      className="w-full flex flex-col gap-8"
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

      <div className="flex flex-col space-y-4 justify-center items-center mt-12 text-center">
        <h1 className="text-6xl font-bold text-[#51D1F6]">Testimonials</h1>
        <h3 className="text-2xl">Don&apos;t believe us? Look what people have to say about us!</h3>
        <div className="relative w-[95vw]">
          <div className="container mx-auto p-8">
            <div className="flex flex-col gap-6 items-center">
              <Testimonials />
            </div>
          </div>
          {/* Gradient overlay */}
        </div>
      </div>
      <div className="min-h-screen overflow-hidden">
        <ExploreCommunity />
      </div>
      <div className="bottom-0 mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
