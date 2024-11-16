import React from 'react';

const SocialMediaGrid: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-rows-3 grid-cols-3 gap-4 px-4 space-y-2">
        {/* Top Center Icon */}
        <div className="col-span-3 flex items-center justify-center w-full  rounded-lg text-2xl font-bold text-gray-600">
          <img src="/landings/logos/x.svg" />
        </div>

        {/* Middle Row Icons */}
        <div className="flex items-center justify-center w-full  rounded-lg text-2xl font-bold text-gray-600">
          <img src="/landings/logos/discord.svg" />
        </div>
        <div className="flex items-center justify-center  w-full  rounded-lg text-2xl font-bold text-gray-600">
          <img src="/landings/logos/linkedin.svg" />
        </div>
        <div className="flex items-center justify-center  w-full rounded-lg text-2xl font-bold text-gray-600">
          <img src="/landings/logos/instagram.svg" />
        </div>

        {/* Bottom Center Icon */}
        <div className="col-span-3 flex items-center justify-center w-full  rounded-lg text-2xl font-bold text-gray-600">
          <img src="/landings/logos/reddit.svg" />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaGrid;
