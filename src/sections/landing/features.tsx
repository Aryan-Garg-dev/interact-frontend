import React from 'react';
import LandingButton from '@/components/buttons/landing_btn';
import Image from 'next/image';
import ShineBorder from '@/components/ui/shine-border';
import { useTheme } from 'next-themes';
import SparklesText from '@/components/ui/sparkles-text';
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

export const TitleBlock = ({
  titleUpper,
  titleMid,
  titleLower,
  titleSide,
  description,
  center = false,
  includeSparkles = false,
}: {
  titleUpper: string;
  titleMid?: string;
  titleLower: string;
  titleSide?: string;
  description: string;
  center?: boolean;
  includeSparkles?: boolean;
}) => {
  return (
    <div className="space-y-4">
      <div className={`relative ${center && 'flex-center flex-col'}`}>
        <div className="text-6xl font-bold">{titleUpper}</div>
        {titleMid && (
          <div className={`w-fit font-cursive rotate-[-20deg] text-3xl absolute ${!center && '-left-5'}`}>
            {titleMid}
          </div>
        )}
        <div className={`inline-block ${titleMid && 'pt-5'}`}>
          {includeSparkles ? (
            <SparklesText className="md:text-8xl text-6xl text-sky-400 font-bold" text={titleLower} />
          ) : (
            <span className="md:text-8xl text-6xl text-sky-400 font-bold">{titleLower}</span>
          )}

          {titleSide && <span className="text-gray-600 italic text-xl">{titleSide}</span>}
        </div>
      </div>
      <p className={`text-gray-600 ${center && 'text-center'}`}>{description}</p>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  const theme = useTheme();
  return (
    <ShineBorder className="p-5 shadow-sm" color={theme.theme === 'dark' ? 'white' : '#51D1F6'}>
      <h3 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-500 to-neutral-700 mb-3">
        {title}
      </h3>
      <p className="text-primary_black text-sm">{description}</p>
      <AnimatedGridPattern
        numSquares={10}
        maxOpacity={0.05}
        duration={3}
        repeatDelay={1}
        className={cn('[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]', 'inset-x-0 skew-y-12')}
      />
    </ShineBorder>
  );
};

const Quote = ({
  name,
  designation,
  quote,
  position = 'center',
}: {
  name: string;
  designation: string;
  quote: string;
  position?: string;
}) => {
  const variants = ['self-start', 'self-center', 'self-end'];
  return (
    <div
      className={`md:w-2/5 w-full self-${position} flex ${position == 'end' ? 'flex-row-reverse' : 'flex-row'} ${
        position == 'end' ? 'text-right' : position == 'start' ? 'text-left' : 'text-center'
      } justify-center gap-4`}
    >
      <div className="grow rounded-lg w-4 bg-[#00BDF2]"></div>
      <div className="">
        <p className="italic">&quot;{quote}&quot;</p>
        <p className="font-bold">
          {name} - {designation}
        </p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="w-full px-8 text-black">
      <div className="w-full flex flex-col gap-24 py-24">
        <section className="flex flex-col lg:flex-row items-center gap-12">
          <div className="relative w-full lg:w-1/2 h-full">
            <Image
              width={500}
              height={300}
              src="/landing/community.svg"
              alt="Dashboard Preview"
              className="w-full h-full object-contain lg:scale-[1.5] lg:-translate-x-[140px] fade-img-left"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <TitleBlock
              titleUpper="Managing"
              titleMid="Your"
              titleLower="Projects"
              titleSide="made easy."
              description="Unlike the popular but noisy networking cum social media platforms such as Linkedin, Interact is devoted to the project cycles specifically at Universities."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureCard
                title="Real-Time Collaboration Tools"
                description="Set up your project tracks, milestones, and deadlines effortlessly. Gain full control through our intuitive dashboard."
              />
              <FeatureCard
                title="Team Management"
                description="Organize teams, assign roles, and track progress in real-time."
              />
            </div>
            <LandingButton label="Know More" />
          </div>
        </section>
        <Quote
          name="Pranay"
          designation="Co-Founder"
          quote="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          position="end"
        />
      </div>

      <div className="w-full flex flex-col gap-24 pb-24">
        <section className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-8">
            <TitleBlock
              titleUpper="Host your"
              titleMid="Next"
              titleLower="Hackathon"
              titleSide="with us."
              description="Reach out to us today and elevate your hackathon experience. We're here to provide a seamless, student-focused solution to make your event a success."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureCard
                title="End-to-End Event Management"
                description="Complete hackathon lifecycle management from registration to judging."
              />
              <FeatureCard
                title="Multi-Round Judging"
                description="Streamlined evaluation process with customizable scoring criteria."
              />
            </div>
            <LandingButton label="Know More" />
          </div>

          <div className="relative w-full lg:w-1/2 h-full">
            <Image
              width={500}
              height={300}
              src="/landing/hackathon.svg"
              alt="Hackathon Dashboard"
              className="w-full h-full object-contain lg:scale-[1.5] lg:translate-x-[140px] fade-img-right"
            />
          </div>
        </section>
        <Quote
          name="Pranay"
          designation="Co-Founder"
          quote="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          position="start"
        />
      </div>
    </div>
  );
};

export default Features;
