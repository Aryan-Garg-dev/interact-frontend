import React from 'react';

interface QuoteProps {
  name: string;
  position: string;
  quote: string;
}

const Quote: React.FC<QuoteProps> = ({ name, position, quote }) => {
  return (
    <div className="h-[15vh]">
      <p>&quot;{quote}&quot;</p>
      <p className="font-bold">
        {name} - {position}
      </p>
    </div>
  );
};

export default Quote;
