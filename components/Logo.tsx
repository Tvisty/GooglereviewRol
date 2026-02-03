import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex justify-center mb-8 animate-fade-in-up">
      <div className="relative">
        <div className="absolute inset-0 bg-gold-400 blur-2xl opacity-10 rounded-full"></div>
        <img 
          src="https://imgur.com/Z8wE64s.png" 
          alt="Auto Parc Rolcris Logo" 
          className="relative h-28 md:h-36 object-contain drop-shadow-lg transition-transform hover:scale-105 duration-500"
        />
      </div>
    </div>
  );
};