import React, { useState } from 'react';
import { Logo } from './components/Logo';
import { StarRating } from './components/StarRating';
import { NegativeFeedbackForm } from './components/NegativeFeedbackForm';
import { PositiveRedirect } from './components/PositiveRedirect';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { FeedbackData, FlowStep } from './types';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { db, isConfigured } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [step, setStep] = useState<FlowStep>(FlowStep.RATING);
  const [rating, setRating] = useState<number>(0);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const saveFeedback = async (data: FeedbackData) => {
    if (!isConfigured()) {
      alert("ATENȚIE: Baza de date nu este configurată. Verificați fișierul firebase.ts");
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), data);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Eroare la salvarea datelor. Verificați conexiunea la internet.");
    }
  };

  const handleRating = (selectedRating: number) => {
    setRating(selectedRating);
    
    if (selectedRating >= 4) {
      setStep(FlowStep.POSITIVE_REDIRECT);
    } else {
      setStep(FlowStep.NEGATIVE_FEEDBACK);
    }
  };

  const handleNegativeSubmit = (name: string, phone: string, message: string) => {
    const data: FeedbackData = {
      rating,
      sentiment: 'negative',
      googleRedirectTriggered: false,
      customerName: name,
      customerPhone: phone,
      customerMessage: message,
      timestamp: new Date().toISOString()
    };

    saveFeedback(data);
    setStep(FlowStep.SUCCESS);
  };

  const handlePositiveRedirect = () => {
    const data: FeedbackData = {
      rating,
      sentiment: 'positive',
      googleRedirectTriggered: true,
      timestamp: new Date().toISOString()
    };
    
    saveFeedback(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Premium Card Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden relative backdrop-blur-sm flex flex-col" style={{ minHeight: '600px' }}>
        
        {/* Top Gold Accent Bar */}
        <div className="h-2 w-full gold-gradient shrink-0"></div>

        {!isConfigured() && !showAdmin && (
           <div className="bg-red-500 text-white text-xs text-center py-1 font-bold flex justify-center items-center gap-2">
             <AlertTriangle size={12} />
             DATABASE NOT CONFIGURED (Edit firebase.ts)
           </div>
        )}

        <div className="p-8 md:p-12 flex-grow flex flex-col">
          
          {showAdmin ? (
            isAuthenticated ? (
              <AdminPanel onBack={() => setShowAdmin(false)} />
            ) : (
              <AdminLogin 
                onLogin={() => setIsAuthenticated(true)} 
                onCancel={() => setShowAdmin(false)} 
              />
            )
          ) : (
            <>
              <Logo />

              {step === FlowStep.RATING && (
                <div className="text-center animate-fade-in-up">
                  <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Evaluarea Ta</h1>
                  <p className="text-slate-500 mb-10 text-lg">
                    Cum a fost experiența ta cu <br/> <span className="font-semibold text-slate-700">Auto Parc Rolcris</span>?
                  </p>
                  <StarRating onRate={handleRating} />
                </div>
              )}

              {step === FlowStep.NEGATIVE_FEEDBACK && (
                <NegativeFeedbackForm onSubmit={handleNegativeSubmit} />
              )}

              {step === FlowStep.POSITIVE_REDIRECT && (
                <PositiveRedirect onRedirect={handlePositiveRedirect} />
              )}

              {step === FlowStep.SUCCESS && (
                <div className="text-center py-10 animate-fade-in-up">
                  <div className="flex justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-green-100 blur-xl rounded-full opacity-50"></div>
                    <CheckCircle2 className="text-green-500 w-24 h-24 relative z-10 drop-shadow-sm" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Mesaj Recepționat</h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    Vă mulțumim pentru feedback. Echipa noastră a fost notificată și vă va contacta în cel mai scurt timp posibil.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="inline-block px-8 py-3 rounded-full bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 hover:text-slate-800 transition-colors"
                  >
                    Înapoi la început
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 text-center shrink-0 z-10 relative">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            {/* The hidden trigger is the copyright symbol */}
            <span 
              onClick={() => setShowAdmin(true)} 
              className="cursor-default select-none transition-colors duration-500 hover:text-slate-500"
              title="" 
            >
              &copy;
            </span> {new Date().getFullYear()} Auto Parc Rolcris. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;