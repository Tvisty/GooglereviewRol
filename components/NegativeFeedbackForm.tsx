import React, { useState } from 'react';
import { ShieldAlert, Send } from 'lucide-react';

interface NegativeFeedbackFormProps {
  onSubmit: (name: string, phone: string, message: string) => void;
}

export const NegativeFeedbackForm: React.FC<NegativeFeedbackFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(name, phone, message);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="bg-gradient-to-r from-gold-50 to-white border-l-4 border-gold-500 p-5 mb-8 rounded-r-xl shadow-sm">
        <div className="flex items-start">
          <div className="bg-gold-100 p-2 rounded-full mr-4 flex-shrink-0">
            <ShieldAlert className="text-gold-600" size={24} />
          </div>
          <div>
            <h3 className="text-gold-700 font-bold text-sm uppercase tracking-wider mb-1">Escaladare Suport VIP</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Ne pare rău că experiența nu a fost perfectă. Vă rugăm să ne lăsați detaliile, iar un manager vă va contacta cu prioritate maximă.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="group">
          <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Numele Dumneavoastră</label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent focus:bg-white outline-none transition-all duration-300 shadow-sm hover:border-gold-200"
            placeholder="ex. Ion Popescu"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="group">
          <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Telefon Contact</label>
          <input
            type="tel"
            id="phone"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent focus:bg-white outline-none transition-all duration-300 shadow-sm hover:border-gold-200"
            placeholder="ex. 07xx xxx xxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="group">
          <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Cum putem îmbunătăți?</label>
          <textarea
            id="message"
            required
            rows={4}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent focus:bg-white outline-none transition-all duration-300 resize-none shadow-sm hover:border-gold-200"
            placeholder="Vă rugăm să detaliați situația..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 gold-gradient text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Se trimite...
            </span>
          ) : (
            <>
              <span>Trimite către Management</span>
              <Send size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};