import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  onRate: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ onRate }) => {
  const [hovered, setHovered] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);

  const handleRate = (rating: number) => {
    setSelected(rating);
    setTimeout(() => {
      onRate(rating);
    }, 400);
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex gap-2 sm:gap-4 p-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="group relative focus:outline-none transition-transform duration-200 hover:scale-110 active:scale-95"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
            aria-label={`Rate ${star} stars`}
          >
             {/* Glow effect behind star */}
             <div className={`absolute inset-0 bg-gold-400 blur-md rounded-full transition-opacity duration-300 ${
               star <= (hovered || selected) ? 'opacity-30' : 'opacity-0'
             }`}></div>
             
            <Star
              size={42}
              strokeWidth={1.5}
              className={`relative z-10 transition-all duration-300 ${
                star <= (hovered || selected)
                  ? 'fill-gold-400 text-gold-500 drop-shadow-sm'
                  : 'text-slate-300 fill-transparent group-hover:text-gold-200'
              }`}
            />
          </button>
        ))}
      </div>
      
      <div className="h-8 flex items-center justify-center">
        <p className={`text-gold-600 font-semibold text-lg tracking-wide transition-opacity duration-300 ${hovered || selected ? 'opacity-100' : 'opacity-0'}`}>
          {hovered === 1 && "Foarte nemulțumit"}
          {hovered === 2 && "Nemulțumit"}
          {hovered === 3 && "Acceptabil"}
          {hovered === 4 && "Mulțumit"}
          {hovered === 5 && "Excelent"}
        </p>
      </div>
    </div>
  );
};