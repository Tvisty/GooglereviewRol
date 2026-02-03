import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Phone, User, MessageSquare, ThumbsUp, ThumbsDown, Calendar, Search, RefreshCw, AlertTriangle, Copy, ExternalLink, Shield, CheckCircle2, AlertOctagon } from 'lucide-react';
import { FeedbackData } from '../types';
import { db, isConfigured } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, writeBatch, getDocs, setDoc } from 'firebase/firestore';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [feedback, setFeedback] = useState<(FeedbackData & { id: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  const [testingPermissions, setTestingPermissions] = useState(false);
  
  // State for delete operations
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured()) {
        setError("Firebase nu este configurat. Editează fisierul firebase.ts");
        setLoading(false);
        return;
    }

    // Real-time listener for database changes
    const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as (FeedbackData & { id: string })[];
      
      setFeedback(data);
      setLoading(false);
      
      // Cleanup states if item disappears
      setDeletingId(null); 
    }, (err: any) => {
      console.error(err);
      if (err.code === 'permission-denied' || err.message?.includes('permission') || err.message?.includes('Missing or insufficient permissions')) {
        setPermissionError(true);
      } else {
        setError("Eroare la încărcarea datelor: " + err.message);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearData = async () => {
    if (window.confirm('Ești sigur că vrei să ștergi TOATE mesajele? Această acțiune este ireversibilă!')) {
      try {
        setLoading(true);
        const q = query(collection(db, "feedback"));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
      } catch (err: any) {
          console.error(err);
          setLoading(false);
          if (err.code === 'permission-denied' || err.message?.includes('permission')) {
            setPermissionError(true);
          } else {
            alert(`Eroare la ștergere: ${err.message}\nCod: ${err.code}`);
          }
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (confirmDeleteId === id) {
        // Second click: actually delete
        deleteItem(id);
    } else {
        // First click: ask for confirmation
        setConfirmDeleteId(id);
        // Reset confirmation after 3 seconds if not clicked
        setTimeout(() => {
            setConfirmDeleteId(prev => prev === id ? null : prev);
        }, 3000);
    }
  };

  const deleteItem = async (id: string) => {
    setDeletingId(id);
    
    try {
        await deleteDoc(doc(db, "feedback", id));
        // Success is handled by onSnapshot removing the item
        setConfirmDeleteId(null);
    } catch (err: any) {
        console.error("Delete failed:", err);
        setDeletingId(null);
        setConfirmDeleteId(null);
        
        if (err.code === 'permission-denied' || err.message?.includes('permission') || err.message?.includes('Missing or insufficient permissions')) {
            setPermissionError(true);
        } else {
            alert(`Eroare la ștergerea mesajului: ${err.message}\nCod: ${err.code}`);
        }
    }
  };

  const checkPermissions = async () => {
    setTestingPermissions(true);
    try {
      const uniqueId = "check_" + Date.now();
      const testRef = doc(db, "_diagnostics", uniqueId);
      await setDoc(testRef, { timestamp: new Date().toISOString(), test: true, agent: navigator.userAgent });
      await deleteDoc(testRef);
      setPermissionError(false);
      alert("✅ SUCCES! \n\nRegulile funcționează corect.\nAcum puteți șterge mesajele.");
    } catch (err: any) {
      console.error("Test failed:", err);
      let errorMsg = `Eroare: ${err.code || 'Necunoscută'}\n${err.message || ''}`;
      if (err.code === 'permission-denied') {
        errorMsg = "EROARE: PERMISSION_DENIED\n\nRegulile nu au fost salvate corect sau nu s-au propagat încă.";
      } else if (err.code === 'unavailable') {
        errorMsg = "EROARE: UNAVAILABLE\n\nNu există conexiune la internet sau serviciul este oprit.";
      }
      alert(`❌ TEST EȘUAT\n\n${errorMsg}\n\nSFAT: Încercați un Refresh (F5) la pagină și asigurați-vă că ați apăsat PUBLISH în consolă.`);
    } finally {
      setTestingPermissions(false);
    }
  };

  const filteredFeedback = feedback.filter(item => 
    item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customerPhone?.includes(searchTerm) ||
    item.customerMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  return (
    <div className="animate-fade-in-up h-full flex flex-col relative">
      
      {/* Permission Error Overlay */}
      {permissionError && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-3xl animate-fade-in-up">
            <div className="bg-red-100 p-4 rounded-full mb-4">
                <AlertTriangle size={40} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Permisiuni Firebase</h3>
            <div className="bg-slate-50 p-4 rounded-xl text-left text-sm text-slate-700 mb-6 max-w-md border border-slate-200 shadow-sm">
                <p className="font-bold mb-2 text-red-600">IMPORTANT:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>După ce dai Paste la cod, trebuie să apeși butonul <strong>PUBLISH</strong> (sus).</li>
                    <li>Asigură-te că ești în secțiunea <strong>Firestore Database</strong>.</li>
                </ul>
            </div>
            <div className="bg-slate-900 text-left p-4 rounded-xl w-full max-w-md mb-4 shadow-lg overflow-hidden relative group">
                <pre className="text-green-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">{rulesCode}</pre>
                <button 
                    onClick={() => navigator.clipboard.writeText(rulesCode)}
                    className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded-lg transition-colors"
                >
                    <Copy size={14} />
                </button>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                 <button onClick={checkPermissions} disabled={testingPermissions} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2">
                    {testingPermissions ? <><RefreshCw className="animate-spin" size={20} />Verific...</> : <><CheckCircle2 size={20} />Verifică Status</>}
                </button>
                <a href="https://console.firebase.google.com/u/0/project/reviewrolcris/firestore/rules" target="_blank" rel="noreferrer" className="bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-900 transition-all text-sm">
                    Deschide Firebase Rules <ExternalLink size={16} />
                </a>
                <button onClick={() => setPermissionError(false)} className="text-slate-400 hover:text-slate-600 font-semibold py-2 text-sm">Închide fereastra</button>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4 shrink-0">
        <button onClick={onBack} className="text-slate-500 hover:text-gold-600 transition-colors flex items-center gap-2 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm uppercase tracking-wide">Înapoi</span>
        </button>
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Mesaje</h2>
            <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Live DB
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setPermissionError(true)} className="text-blue-300 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50">
                <Shield size={20} />
            </button>
            <button onClick={clearData} disabled={feedback.length === 0} className="text-red-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50">
                <Trash2 size={20} />
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center text-sm mb-4 font-medium flex flex-col items-center gap-2">
            <AlertTriangle className="text-red-500" />
            {error}
        </div>
      )}

      {/* Search */}
      {feedback.length > 0 && (
        <div className="relative mb-4 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Caută după nume, telefon..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
          />
        </div>
      )}

      {/* List */}
      <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-grow -mr-2" style={{ maxHeight: '500px' }}>
        {loading ? (
             <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <RefreshCw className="animate-spin mb-2 text-gold-500" size={24} />
                <p>Se încarcă baza de date...</p>
             </div>
        ) : filteredFeedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <div className="bg-slate-50 p-4 rounded-full mb-3">
                  <MessageSquare size={32} className="text-slate-300" />
                </div>
                <p>Nu există mesaje înregistrate.</p>
            </div>
        ) : (
            filteredFeedback.map((item) => (
                <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-gold-200 hover:shadow-md transition-all duration-300 group relative">
                    <div className="flex justify-between items-start mb-3">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.sentiment === 'positive' ? <ThumbsUp size={10} /> : <ThumbsDown size={10} />}
                            {item.sentiment === 'positive' ? 'POZITIV' : 'NEGATIV'}
                        </div>
                        
                        <div className="flex items-center gap-3 relative">
                            <div className="flex items-center text-slate-400 text-[10px] font-medium uppercase tracking-wide">
                                <Calendar size={10} className="mr-1"/>
                                {new Date(item.timestamp).toLocaleDateString('ro-RO')} • {new Date(item.timestamp).toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            
                            <button 
                                onClick={(e) => handleDeleteClick(e, item.id)}
                                disabled={deletingId === item.id}
                                className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1 ${
                                    confirmDeleteId === item.id 
                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-md ring-2 ring-red-200' 
                                    : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                                }`}
                                title={confirmDeleteId === item.id ? "Apasă din nou pentru a confirma" : "Șterge"}
                            >
                                {deletingId === item.id ? (
                                    <RefreshCw size={16} className="animate-spin text-white" />
                                ) : confirmDeleteId === item.id ? (
                                    <>
                                        <AlertOctagon size={14} className="animate-pulse" />
                                        <span className="text-[10px] font-bold pr-1">CONFIRM?</span>
                                    </>
                                ) : (
                                    <Trash2 size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {item.sentiment === 'negative' ? (
                        <div className="space-y-2.5 pr-2">
                            <div className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                                <User size={14} className="text-gold-500" />
                                {item.customerName || "Anonim"}
                            </div>
                            {item.customerPhone && (
                              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                  <Phone size={14} className="text-gold-500" />
                                  <a href={`tel:${item.customerPhone}`} className="hover:text-gold-600 transition-colors">{item.customerPhone}</a>
                              </div>
                            )}
                            {item.customerMessage && (
                              <div className="flex items-start gap-2 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm mt-1">
                                  <MessageSquare size={14} className="text-gold-400 mt-0.5 flex-shrink-0" />
                                  <p className="leading-relaxed text-slate-700">"{item.customerMessage}"</p>
                              </div>
                            )}
                        </div>
                    ) : (
                      <div className="text-sm text-slate-500 italic pl-1">
                        Redirectat către Google Reviews
                      </div>
                    )}
                    
                     <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(star => (
                              <div key={star} className={`w-1.5 h-1.5 rounded-full ${star <= item.rating ? 'bg-gold-400' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating: {item.rating}/5</span>
                     </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};