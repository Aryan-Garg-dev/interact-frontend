import React from 'react';
import { ReactSVG } from 'react-svg';
import { CaretRight } from '@phosphor-icons/react';
import Image from 'next/image';

const comments = [
  {
    caption:
      'Lorem ipsum dolor sit amet consectetur. Dui dictum ut tellus cursus ac mauris sagittis cras. Ultricies est interdum arcu quis. Egestas sagittis fusce vitae massa donec tincidunt elementum.',
    user: {
      picURL: '/logo.png',
      name: 'Chomu',
      username: 'Zexgar29',
    },
  },
  {
    caption:
      'Lorem ipsum dolor sit amet consectetur. Dui dictum ut tellus cursus ac mauris sagittis cras. Ultricies est interdum arcu quis. Egestas sagittis fusce vitae massa donec tincidunt elementum.',
    user: {
      picURL: '/logo.png',
      name: 'Chomu',
      username: 'Zexgar29',
    },
  },
  {
    caption:
      'Lorem ipsum dolor sit amet consectetur. Dui dictum ut tellus cursus ac mauris sagittis cras. Ultricies est interdum arcu quis. Egestas sagittis fusce vitae massa donec tincidunt elementum.',
    user: {
      picURL: '/logo.png',
      name: 'Chomu',
      username: 'Zexgar29',
    },
  },
];

const ExploreCommunity: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-24 text-black">
      <div className="w-full flex-center flex-col gap-8">
        <div className="flex flex-row items-center justify-center text-4xl md:text-5xl space-x-4 font-semibold">
          <h3>Explore Community</h3>
          <CaretRight weight="bold" size={24} />
        </div>

        <div className="w-4/5 rounded-lg space-y-8">
          <div className="w-full md:max-h-72 overflow-y-clip flex-center md:flex-row flex-col md:gap-8 px-12 border-2 rounded-xl">
            <div className="w-1/2 space-y-24 md:space-y-16 py-16 md:py-18">
              <div className="relative py-4">
                <div className="text-4xl font-semibold mb-2">Supporting the</div>
                <div className="w-fit font-cursive rotate-[-8deg] text-sky-400 text-5xl font-medium absolute">
                  Future makers
                </div>
              </div>
              <p className="text-gray-600">
                We are proud to give back to the Student Community to create the impact needed.
              </p>
            </div>
            <SocialMediaGrid />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comments.map((comment, index) => (
              <div key={index} className="p-4 rounded-lg space-y-4 border-2">
                <p className="text-gray-600 italic text-sm">&quot;{comment.caption}&quot;</p>
                <div className="flex justify-between items-center text-gray-500 text-xs">
                  <div className="flex-center gap-1">
                    <Image
                      width={50}
                      height={50}
                      alt={'User Pic'}
                      src={comment.user.picURL}
                      className="w-4 h-4 rounded-full"
                    />
                    {comment.user.name}
                  </div>
                  <span>@{comment.user.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex justify-center items-center ">
        <div
          className="absolute inset-0 pointer-events-none flex justify-center items-center"
          style={{
            background: `
            linear-gradient(to bottom, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 80%),
            linear-gradient(to right, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 80%),
            linear-gradient(to left, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 80%)`,
          }}
        ></div>
        <div className=" w-full overflow-hidden">
          <ReactSVG src="/landing/bg-interact.svg" className="flex justify-center overflow-hidden" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ReactSVG src="/onboarding_logo.svg" className="mb-24 scale-[2.0]" />
        </div>
      </div>
    </div>
  );
};

const GridBox = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="w-1/3 mx-auto flex-center p-4 border-[1px] border-dashed hover:bg-slate-100 transition-ease-300">
      <Image width={75} height={75} src={src} alt={alt} />
    </div>
  );
};

const SocialMediaGrid: React.FC = () => {
  return (
    <div className="md:w-1/2 w-[70vw] flex-center flex-col mt-4">
      <GridBox src="/landing/logos/x.svg" alt="Twitter Logo" />
      <div className="w-full flex">
        <GridBox src="/landing/logos/discord.svg" alt="Discord Logo" />
        <GridBox src="/landing/logos/linkedin.svg" alt="Linkedin Logo" />
        <GridBox src="/landing/logos/instagram.svg" alt="Instagram Logo" />
      </div>
      <GridBox src="/landing/logos/reddit.svg" alt="Reddit Logo" />
    </div>
  );
};

export default ExploreCommunity;
