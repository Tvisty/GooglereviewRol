import React from 'react';
import { ExternalLink, ThumbsUp } from 'lucide-react';

interface PositiveRedirectProps {
  onRedirect: () => void;
}

export const PositiveRedirect: React.FC<PositiveRedirectProps> = ({ onRedirect }) => {
  const GOOGLE_REVIEW_URL = "https://www.google.com/search?sca_esv=dc45e1216515a3e4&sxsrf=ANbL-n7U3RIatBVm6x9rS0pOH3OuyoJHpw:1770098777234&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOdUM3U9gFaUQWxtrm10I6wubDyR9OK4HVcgqNilRXW9heXvmkVTioTp1cbWCzORWZjbiFjYR-cb49qFcBOxTXNWOYKoK&q=Rol+Cris+Auto+Reviews&sa=X&ved=2ahUKEwiLl9bm07ySAxW09LsIHZv9BfoQ0bkNegQIJhAH&biw=1920&bih=953&dpr=1&aic=0"; 
  
  const handleGoogleClick = () => {
    onRedirect();
    window.open(GOOGLE_REVIEW_URL, '_blank');
  };

  return (
    <div className="text-center animate-fade-in-up">
      <div className="flex justify-center mb-8 relative">
        {/* Decorative background circle */}
        <div className="absolute w-24 h-24 bg-green-100 rounded-full animate-pulse-soft blur-md"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center shadow-inner border border-green-200">
          <ThumbsUp className="text-green-600 drop-shadow-sm" size={44} />
        </div>
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Vă mulțumim!</h2>
      <p className="text-slate-600 mb-10 px-2 leading-relaxed text-lg">
        Ne bucurăm enorm că ați avut o experiență pozitivă. Ne-ar ajuta foarte mult dacă ați împărtăși acest lucru și cu alții pe Google.
      </p>

      <div className="space-y-4">
        <button
          onClick={handleGoogleClick}
          className="w-full gold-gradient text-white font-bold text-lg py-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <span className="tracking-wide">Postează pe Google</span>
          <ExternalLink size={20} className="opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>
        
        <p className="text-xs text-slate-400 font-medium mt-6">
          Durează mai puțin de 30 de secunde.
        </p>
      </div>
    </div>
  );
};