import React from 'react';
import Navbar from '@/sections/landing/navbar';
import { FloatingImages } from '@/sections/landing/floatingimages';
import { HeroTitle } from '@/sections/landing/herotitle';
import { CTASection } from '@/sections/landing/CTAsection';
import Features from '@/sections/landing/features';
import WhyChooseUs from '@/sections/landing/whyechosseus';
import Community from '@/sections/landing/community';
import Footer from '@/sections/landing/footer';
import ExploreCommunity from '@/sections/landing/explore';
import Testimonials from '@/sections/landing/testimonails';

const LandingPage = () => {
  return (
    <div
      className="w-full flex flex-col"
      style={{
        cursor: `url('/landing/cursor.svg'), auto`,
      }}
    >
      <div className="md:min-h-screen">
        <div className="flex flex-col items-center justify-center h-[10vh] ">
          <Navbar />
          <div className="h-[4px] w-[85vw] bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 my-2"></div>
        </div>
        <div className="relative  mx-auto pt-12 overflow-hidden">
          <FloatingImages />
          <div className="text-center pt-20 relative z-10 felx items-center justify-center">
            <HeroTitle />
            <CTASection />
          </div>
        </div>
      </div>
      <div className="h-[30vh] my-12">
        <div className="flex flex-col items-center justify-center pb-4">
          <div className="h-[4px] w-[85vw] bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 my-2"></div>
        </div>
      </div>
      <div className="md:flex-row flex-col space-y-8">
        <Features />
      </div>
      <Community />
      <div>
        <WhyChooseUs />
      </div>
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
