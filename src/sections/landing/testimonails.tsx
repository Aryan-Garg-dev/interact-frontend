import React from 'react';
import TestimonialsCard from '../../components/landing/testimonials_card';

const testimonials = [
  {
    user: 'Pranay',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'Sarah',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'John',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'Emily',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'Michael',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'Lisa',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'Emily',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'Michael',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    user: 'Lisa',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

const config = {
  mobile: {
    cardsToShow: 4,
    columns: 1,
  },
  tablet: {
    cardsToShow: 6,
    columns: 2,
  },
  desktop: {
    cardsToShow: 7,
    columns: 3,
  },
};

const Testimonials = () => {
  const chunkArray = (arr: any[], size: number): any[][] => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  return (
    <div className="flex flex-col space-y-12 justify-center items-center text-center">
      <div className="w-full space-y-2">
        <h1 className="text-8xl font-bold text-sky-400">Testimonials</h1>
        <h3 className="text-xl">Don&apos;t believe us? Look what people have to say about us!</h3>
      </div>

      <div className="w-full relative">
        <div className="flex-center flex-col gap-6 container mx-auto p-8">
          {/* Mobile layout (1 column) */}
          <div className="md:hidden flex flex-col space-y-6">
            {testimonials.slice(0, config.mobile.cardsToShow).map((testimonial, index) => (
              <TestimonialsCard key={index} user={testimonial.user} text={testimonial.text} />
            ))}
          </div>

          {/* Tablet layout (2 columns) */}
          <div className="hidden md:flex lg:hidden gap-6">
            {chunkArray(
              testimonials.slice(0, config.tablet.cardsToShow),
              Math.ceil(config.tablet.cardsToShow / config.tablet.columns)
            ).map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col space-y-6 flex-1">
                {column.map((testimonial, index) => (
                  <TestimonialsCard key={index} user={testimonial.user} text={testimonial.text} />
                ))}
              </div>
            ))}
          </div>

          {/* Desktop layout (3 columns) */}
          <div className="hidden lg:flex gap-6">
            {chunkArray(testimonials, Math.ceil(testimonials.length / config.desktop.columns)).map(
              (column, colIndex) => (
                <div key={colIndex} className={`flex flex-col space-y-6 flex-1 ${colIndex === 1 ? 'mt-12' : ''}`}>
                  {column.map((testimonial, index) => (
                    <TestimonialsCard key={index} user={testimonial.user} text={testimonial.text} />
                  ))}
                </div>
              )
            )}
          </div>

          <div
            className="absolute inset-0 pointer-events-none w-[100vw] flex justify-between items-center mx-auto"
            style={{
              background: `
                linear-gradient(to bottom, transparent 0%, transparent 85%, rgb(255, 255, 255) 100%),
                linear-gradient(to right, transparent 0%, transparent 85%, rgb(255, 255, 255) 100%),
                linear-gradient(to top, transparent 0%, transparent 85%, rgb(255, 255, 255) 100%),
                linear-gradient(to left, transparent 0%, transparent 85%, rgb(255, 255, 255) 100%)
              `,
            }}
          ></div>
        </div>
        {/* Gradient overlay */}
      </div>
    </div>
  );
};

export default Testimonials;
