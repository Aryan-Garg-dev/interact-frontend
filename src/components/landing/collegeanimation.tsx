import React, { useState, useEffect, useRef } from 'react';
import { ReactSVG } from 'react-svg';

export const CollegeScroll = () => {
  const colleges = [
    { name: 'Christ University', svgPath: '/colleges/christ-university.svg' },
    { name: 'SRM', svgPath: '/colleges/srm.svg' },
    { name: 'VIT', svgPath: '/colleges/vit.svg' },
    { name: 'NIT Trichy', svgPath: '/colleges/nit-trichy.svg' },
    { name: 'BITS Pilani', svgPath: '/colleges/bits-pilani.svg' },
    { name: 'SYMBIOSIS', svgPath: '/colleges/symbiosis.svg' },
    { name: 'Manipal', svgPath: '/colleges/manipal.svg' },
    { name: 'Christ University', svgPath: '/colleges/christ-university.svg' },
    { name: 'SRM', svgPath: '/colleges/srm.svg' },
    { name: 'NIT Trichy', svgPath: '/colleges/nit-trichy.svg' },
  ];

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isReversing, setIsReversing] = useState(false);
  const [speed, setSpeed] = useState(2);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cardWidth = 200;
    const maxScroll = (colleges.length - 6) * cardWidth;
    const baseSpeed = 2;
    const minSpeed = 0.8;
    const slowdownDistance = 100; // pixels from the end to start slowing
    const frameRate = 1000 / 60;

    const getSlowdownFactor = (position: number) => {
      if (isReversing) {
        // Slowing down near start
        if (position < slowdownDistance) {
          return Math.max(position / slowdownDistance, 0.8);
        }
      } else {
        // Slowing down near end
        const distanceFromEnd = maxScroll - position;
        if (distanceFromEnd < slowdownDistance) {
          return Math.max(distanceFromEnd / slowdownDistance, 0.8);
        }
      }
      return 1;
    };

    const animate = () => {
      setScrollPosition(prev => {
        const slowdownFactor = getSlowdownFactor(prev);
        const currentSpeed = baseSpeed * slowdownFactor;
        setSpeed(currentSpeed);

        if (isReversing) {
          const newPosition = prev - currentSpeed;
          if (newPosition <= 0) {
            setIsReversing(false);
            return 0;
          }
          return newPosition;
        } else {
          const newPosition = prev + currentSpeed;
          if (newPosition >= maxScroll) {
            setIsReversing(true);
            return maxScroll;
          }
          return newPosition;
        }
      });
    };

    animationRef.current = setInterval(animate, frameRate);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isReversing, colleges.length]);

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Left fade overlay */}
      <div
        className="absolute left-0 top-0 h-full w-24 z-10"
        style={{
          background: 'linear-gradient(to right, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)',
        }}
      />

      {/* Right fade overlay */}
      <div
        className="absolute right-0 top-0 h-full w-24 z-10"
        style={{
          background: 'linear-gradient(to left, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)',
        }}
      />

      <div className="relative w-full">
        <div
          className="flex transition-transform duration-100 ease-linear"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
          }}
        >
          {colleges.map((college, i) => (
            <div key={i} className="w-[200px] flex-shrink-0 px-4 mx-6">
              <div
                className={`
                  bg-white p-4 mx-2 h-24
                  flex items-center justify-center
                  transition-all duration-300
                  ${isReversing ? '' : ''}
                  ${speed < 1 ? '' : ''}
                `}
              >
                <img src={college.svgPath} alt={college.name} className="object-contain scale-150 mx-" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeScroll;
