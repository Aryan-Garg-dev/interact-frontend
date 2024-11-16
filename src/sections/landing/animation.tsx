import React, { useState, useEffect } from 'react';

export const Animation = () => {
  const texts = ['Organizations', 'Hackathons', 'Projects'];
  const [index, setIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const animate = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (index === texts.length - 1) {
        setIsResetting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIndex(0);
        requestAnimationFrame(() => setIsResetting(false));
      } else {
        setIndex(prev => prev + 1);
      }
    };

    const timer = setTimeout(animate, 1000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="h-24 overflow-hidden">
      <div
        className={`transform transition-transform duration-500 ease-in-out ${isResetting ? 'transition-none' : ''}`}
        style={{
          transform: `translateY(-${index * 96}px)`,
        }}
      >
        {texts.map((text, i) => (
          <div key={i} className="h-24 flex items-center justify-center md:text-7xl text-5xl font-bold">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Animation;
