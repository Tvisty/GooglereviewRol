import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Rolcris2026@') {
      onLogin();
    } else {
      setError('Parolă incorectă. Acces interzis.');
      setPassword('');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center mb-8">
        <button 
          onClick={onCancel}
          className="mr-4 p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Securitate Admin</h2>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="bg-slate-50 p-6 rounded-full mb-4 shadow-inner border border-slate-100">
            <Lock size={32} className="text-gold-500" />
        </div>
        <p className="text-slate-500 text-sm text-center max-w-xs">
          Această zonă este restricționată. Vă rugăm să introduceți parola de administrator.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Parolă Acces
            </label>
            <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                }}
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-gold-400'} text-slate-800 placeholder-slate-400 focus:ring-2 focus:border-transparent focus:bg-white outline-none transition-all duration-300 shadow-sm`}
                placeholder="••••••••••••"
            />
            {error && <p className="text-red-500 text-xs mt-2 ml-1 font-bold tracking-wide">{error}</p>}
        </div>

        <button
            type="submit"
            className="w-full gold-gradient text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-300"
        >
            Verifică Identitatea
        </button>
      </form>
    </div>
  );
};