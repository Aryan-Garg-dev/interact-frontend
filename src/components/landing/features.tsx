import React from 'react';
import Qoute from './qoute';

const Features = () => {
  return (
    <div className="w-full mx-auto ">
      {/* Projects Section */}
      <section className="flex flex-col lg:flex-row items-center gap-8 p-6 lg:p-12">
        {/* Left Dashboard Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-square">
            <img
              src="/community.svg"
              alt="Dashboard Preview"
              className="w-full h-full object-contain scale-[1.1] md:scale-[1.8] md:-translate-x-1/2"
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Managing</h1>
              <div className="flex flex-wrap items-baseline gap-2 mt-2">
                <span className="text-gray-600 italic text-xl">your</span>
                <span className="text-4xl font-bold text-sky-400">Projects</span>
                <span className="text-xl">Made easy.</span>
              </div>
            </div>
            <p className="text-gray-600 max-w-xl">
              Unlike the popular but noisy networking cum social media platforms, we are devoted to the project cycles
              specifically at Universities.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#51D1F6] p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-xl mb-3">Real-Time Collaboration Tools</h3>
              <p className="text-black">
                Set up your project tracks, milestones, and deadlines effortlessly. Gain full control through our
                intuitive dashboard.
              </p>
            </div>
            <div className="bg-[#ade9fb] p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-xl mb-3">Team Management</h3>
              <p className="text-black">Organize teams, assign roles, and track progress in real-time.</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-[#00BDF2] text-white px-8 py-3 rounded-full hover:bg-sky-500 transition-colors">
            Know More
          </button>
        </div>
      </section>

      {/* Quote Section */}
      <div className="hidden md:flex flex-row w-full justify-center my-24 text-left h-[15vh]">
        <div className="h-full w-2 bg-[#00BDF2]"></div>
        <div className="w-[30vw] pl-4">
          <Qoute
            name="Pranay"
            position="Co-Founder"
            quote="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </div>
      </div>

      {/* Hackathon Section */}
      <section className=" flex flex-col-reverse lg:flex-row items-center gap-4 p-6 lg:p-12  overflow-hidden">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Host your</h1>
              <div className="flex flex-wrap items-baseline gap-2 mt-2">
                <span className="text-4xl font-bold text-sky-400">Hackathon</span>
                <span className="text-xl">with us.</span>
              </div>
            </div>
            <p className="text-black max-w-xl">
              Reach out to us today and elevate your hackathon experience. We're here to provide a seamless,
              student-focused solution to make your event a success.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#ade9fb] p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-xl mb-3">End-to-End Event Management</h3>
              <p className="text-black">Complete hackathon lifecycle management from registration to judging.</p>
            </div>
            <div className="bg-[#51D1F6] p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-xl mb-3">Multi-Round Judging</h3>
              <p className="text-black">Streamlined evaluation process with customizable scoring criteria.</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-[#00BDF2] text-white px-8 py-3 rounded-full hover:bg-sky-500 transition-colors">
            Know More
          </button>
        </div>

        {/* Right Dashboard Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-square">
            <img
              src="/hackathon.svg"
              alt="Hackathon Dashboard"
              className="w-full h-full object-contain scale-[1.1] md:scale-[1.8] md:translate-x-1/2 "
            />
          </div>
        </div>
      </section>
      <div className="hidden md:flex flex-row-reverse w-full justify-center my-24 text-left h-[15vh]">
        <div className="h-full w-2 bg-[#00BDF2]"></div>
        <div className="w-[30vw] pl-4">
          <Qoute
            name="Pranay"
            position="Co-Founder"
            quote="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
