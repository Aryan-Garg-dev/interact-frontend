import React from 'react';

interface WhyChooseUsProps {
  cards?: {
    subtitle: string;
    title: string;
    description: string;
  }[];
  motivatingStatement?: string;
  bulletPoints?: string[];
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({
  cards = [
    {
      subtitle: 'Heading',
      title: 'Heading',
      description:
        'Lorem ipsum dolor sit amet consectetur. Enim aliquam neque feugiat molestie id feugiat augue. Imperdiet ullamcorper tortor amet ac diam leo. Cursus vivamus mauris eu sed elit nulla consectetur ipsum quis. Pellentesque venenatis nunc hendrerit nunc sodales.',
    },
    {
      subtitle: 'Heading',
      title: 'Heading',
      description:
        'Lorem ipsum dolor sit amet consectetur. Arnaeos lectus vulputate quis sed elit in nunc amet risus. diam cras risus. Est praesent velit dui amet egestas sed nunc risus. Aliquet feugiat sit consectetur mauris ac a. Et neque mattis id lectus velit hac tortor nisi eu. Aenean tincidunt elementum velit mauris rutrum nisi.',
    },
    {
      subtitle: 'Heading',
      title: 'Heading',
      description:
        'Lorem ipsum dolor sit amet consectetur. At a pellentesque nisl amet sed dignissim habitant purus. In vestibulum pellentesque pellentesque mauris,in sit lacinia faucibus. Est mattis dictum id elementum ac. Et vulputate vulputate eu nascetur volutpat dui pulvinar. Lectus dolor sagittis in tristique. Facilisi pretium rutrum vel donec consequat. Velit turpis pharetra eget lacinia amet imperdiet.',
    },
  ],
  motivatingStatement = 'Join the ranks of innovative organizations and university clubs already streamlining their hackathons with Interact. Let us help you bring your vision to life with ease and efficiency.',
  bulletPoints = [
    'Our trusted reputation at the college, backed by latest testimonials, sets us apart as a reliable partner in hackathon management.',
    'Registration to judging, we ensure the best experience for both organizers and participants.',
  ],
}) => {
  return (
    <div className="w-full flex flex-col gap-8 bg-gradient-to-b from-[#0A2732] via-[#000000] to-[#0A2732] text-white py-32 px-48 max-md:p-8">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
        Why Choose <span className="text-sky-400">Us</span> ?
      </h2>
      <div className="w-full flex lg:flex-row flex-col justify-center gap-6">
        {cards.map((card, index) => (
          <div key={index} className="w-1/3 bg-[#1a1a1a] rounded-2xl p-8">
            <h3 className="text-lg text-gray-300 mb-2">{card.subtitle}</h3>
            <h4 className="text-2xl font-bold mb-4">{card.title}</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="w-full">
        <div className="bg-[#1a1a1a] rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">Motivating Statement</h3>
          <p className="text-gray-300 leading-relaxed mb-4">{motivatingStatement}</p>
          <p className="text-gray-300 leading-relaxed">{motivatingStatement}</p>
        </div>
      </div>

      <div className="w-full space-y-4">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex items-start space-x-2">
            <span className="text-sky-400 font-bold mt-1">*</span>
            <p className="text-gray-300 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
