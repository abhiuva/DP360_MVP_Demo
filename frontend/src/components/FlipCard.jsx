import React, { useState } from "react";

const FlipCard = ({ title, children }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[360px] perspective"
      onClick={() => !flipped && setFlipped(true)}
    >
      <div
        className={`transition-transform duration-700 w-full h-full transform-style preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front side */}
        <div className="absolute w-full h-full backface-hidden bg-gray-900 text-white flex items-center justify-center rounded-lg shadow-lg cursor-pointer">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* Back side (visualization) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
