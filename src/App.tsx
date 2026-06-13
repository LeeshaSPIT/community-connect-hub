import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { INITIAL_CONTACTS } from './data';
import { Contact, NeighborhoodSetting, Review } from './types';
import HomeTab from './components/HomeTab';
import SearchTab from './components/SearchTab';
import ContributeTab from './components/ContributeTab';
import { Language, TRANSLATIONS } from './localization';
import { 
  AlertCircle, X, Layers, Lock, Home, Search, PlusCircle,
  MapPin, Phone, Shield, Users, CheckCircle, Star
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [role, setRole] = useState<'user' | 'deployer'>('user');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [onboardingDeployerPassword, setOnboardingDeployerPassword] = useState('');
  const [onboardingPasswordError, setOnboardingPasswordError] = useState('');
  const [onboardingSelection, setOnboardingSelection] = useState<'none' | 'resident' | 'deployer'>('none');
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '081032') {
      setRole('deployer');
      setShowPasswordModal(false);
      setPasswordError('');
    } else {
      setPasswordError(language === 'mr' ? 'चुकीचा पासवर्ड! पुन्हा प्रयत्न करा.' : 'Incorrect password. Please try again.');
    }
  };

  const handleApproveContact = async (id: string) => {
    const updated = contacts.map(c => c.id === id ? { ...c, isPendingApproval: false, isVerified: true } : c);
    const approvedContact = updated.find(c => c.id === id);
    if (approvedContact) await setDoc(doc(db, 'contacts', approvedContact.id), approvedContact);
    setContacts(updated);
  };

  const handleEditContactSave = async (updatedContact: Contact) => {
    const updated = contacts.map(c => c.id === updatedContact.id ? updatedContact : c);
    await setDoc(doc(db, 'contacts', updatedContact.id), updatedContact);
    setContacts(updated);
    setEditingContact(null);
  };
  
  const [neighborhood, setNeighborhood] = useState<NeighborhoodSetting>({ societyName: 'Parsik Nagar', pincode: '400605' });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSociety, setTempSociety] = useState('');
  const [tempPincode, setTempPincode] = useState('');
  const [activeCall, setActiveCall] = useState<{ name: string; phone: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [activeWhatsApp, setActiveWhatsApp] = useState<{ name: string; phone: string; initialMessage: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'merchant'; text: string; time: string }[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [merchantTyping, setMerchantTyping] = useState(false);

  useEffect(() => {
    if (neighborhood) { setTempSociety(neighborhood.societyName); setTempPincode(neighborhood.pincode); }
  }, [neighborhood]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'contacts'), (snapshot) => {
      const firebaseContacts: Contact[] = snapshot.docs
        .map(doc => doc.data() as Contact)
        .filter(c => c.subcategory !== 'Society Watch & Utilities' && c.subcategory !== 'सोसायटी वॉच आणि युक्त्या');
      const baseIds = new Set(INITIAL_CONTACTS.map(c => c.id));
      const merged = INITIAL_CONTACTS.map(base => {
        const fb = firebaseContacts.find(fc => fc.id === base.id);
        return fb ? { ...base, ...fb } : base;
      });
      firebaseContacts.filter(fc => !baseIds.has(fc.id)).forEach(fc => merged.push(fc));
      setContacts(merged);
    });
    const storedSetting = localStorage.getItem('community_connect_setting');
    if (storedSetting) { try { setNeighborhood(JSON.parse(storedSetting)); } catch (e) {} }
    return () => unsubscribe();
  }, []);

  const handleUpdateNeighborhood = (setting: NeighborhoodSetting) => {
    setNeighborhood(setting);
    localStorage.setItem('community_connect_setting', JSON.stringify(setting));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateNeighborhood({ societyName: tempSociety || 'Parsik Nagar', pincode: tempPincode || '400605' });
    setShowSettingsModal(false);
  };

  const handleEndorse = async (id: string) => {
    const updated = contacts.map(c => c.id === id ? { ...c, endorsements: c.endorsements + 1 } : c);
    const endorsedContact = updated.find(c => c.id === id);
    if (endorsedContact) await setDoc(doc(db, 'contacts', endorsedContact.id), endorsedContact);
    setContacts(updated);
  };

  const handleAddReview = async (contactId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-gen-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const newReviewsList = [newReview, ...c.reviews];
        const avgRating = parseFloat((newReviewsList.reduce((acc, r) => acc + r.rating, 0) / newReviewsList.length).toFixed(1));
        return { ...c, reviews: newReviewsList, ratingsCount: c.ratingsCount + 1, rating: avgRating };
      }
      return c;
    });
    const reviewedContact = updated.find(c => c.id === contactId);
    if (reviewedContact) await setDoc(doc(db, 'contacts', reviewedContact.id), reviewedContact);
    setContacts(updated);
  };

  const handleAddContact = async (newContactData: Omit<Contact, 'id' | 'rating' | 'ratingsCount' | 'endorsements' | 'reviews' | 'isVerified'>) => {
    const sanitizedPhone = newContactData.phone.replace(/[^0-9]/g, '');
    const cleanName = newContactData.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    const stableId = `usr-suggest-${cleanName}-${sanitizedPhone}`;
    const fullContact: Contact = {
      ...newContactData,
      id: stableId,
      rating: 5.0, ratingsCount: 1, endorsements: 1,
      isVerified: false, isUserSuggested: true, isPendingApproval: true,
      reviews: [{ id: `rev-init-${Date.now()}`, author: 'Submitting Neighbor', flat: 'Flat Member', rating: 5, comment: `Suggested: "${newContactData.details}"`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]
    };
    const safeFirestoreData = Object.fromEntries(Object.entries(fullContact).filter(([_, value]) => value !== undefined));
    try {
      await setDoc(doc(db, 'contacts', fullContact.id), safeFirestoreData);
      setContacts(prev => prev.some(c => c.id === fullContact.id) ? prev : [fullContact, ...prev]);
    } catch (error) {
      console.error("Firebase save failed:", error);
      alert("Database error! Could not save suggestion.");
    }
  };

  const handleSimulateCall = (name: string, phone: string) => { setActiveCall({ name, phone }); setCallDuration(0); };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleEndCall = () => { setActiveCall(null); setCallDuration(0); };
  const getFormattedDuration = (totalSecs: number) => `${Math.floor(totalSecs / 60)}:${(totalSecs % 60).toString().padStart(2, '0')}`;

  const handleSimulateWhatsApp = (name: string, phone: string, initialText: string) => {
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages([{ sender: 'user', text: initialText, time: currentTimeStr }]);
    setActiveWhatsApp({ name, phone, initialMessage: initialText });
    setTypedMessage(''); setMerchantTyping(false);
  };

  const handleSendWhatsAppMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeWhatsApp) return;
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: typedMessage, time: currentTimeStr }]);
    setTypedMessage(''); setMerchantTyping(true);
    setTimeout(() => {
      let replyText = `Thanks for writing! Yes, I am currently available in ${neighborhood.societyName}. I can head over to your block shortly.`;
      if (activeWhatsApp.name.toLowerCase().includes('sharma')) replyText = "Hello! Yes, I am free now. I have some pipeline tools in my scooter, can visit your flat in 15 mins. Standard visit fee is ₹150.";
      else if (activeWhatsApp.name.toLowerCase().includes('apex')) replyText = "Apex Pharmacy here. Yes, medicines are available. Please send the doctor's prescription snapshot for home delivery.";
      else if (activeWhatsApp.name.toLowerCase().includes('sparkle')) replyText = "Hi! Car Wash is active. Let me know your block/flat and parking floor number. Will clean it first thing tomorrow!";
      else if (activeWhatsApp.name.toLowerCase().includes('verma')) replyText = "Verma Electrician here. I am servicing another flat in Tower B. I can come to your apartment next. What's the problem?";
      const merchantTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [...prev, { sender: 'merchant', text: replyText, time: merchantTimeStr }]);
      setMerchantTyping(false);
    }, 1500);
  };

  const userSuggestedContacts = contacts.filter(c => c.isUserSuggested || c.isPendingApproval);

  // ============================================
  // REDESIGNED WELCOME / ONBOARDING SCREEN
  // ============================================
  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-white text-slate-800 antialiased font-sans">
        
        {/* Top Navigation Bar */}
        <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">CC</span>
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">Community Connect</span>
              <span className="text-slate-400 text-xs block">Parsik Nagar · 400605</span>
            </div>
          </div>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => setLanguage('mr')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'mr' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>मराठी</button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left — Hero Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                {language === 'mr' ? 'पारसिक नगर सेवा निर्देशिका' : 'Parsik Nagar Service Directory'}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                {language === 'mr' 
                  ? 'आपल्या परिसरातील विश्वासू सेवा' 
                  : 'Your Neighbourhood,\nOne Directory'}
              </h1>

              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {language === 'mr'
                  ? 'स्थानिक प्लंबर, किराणा दुकाने, आपत्कालीन सेवा आणि बरेच काही एकाच ठिकाणी शोधा.'
                  : 'Find trusted local plumbers, grocery stores, emergency helplines, and more — verified by your own neighbors.'}
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mb-10">
                {[
                  { value: '34+', label: language === 'mr' ? 'स्थानिक संपर्क' : 'Local Contacts' },
                  { value: '5', label: language === 'mr' ? 'श्रेणी' : 'Categories' },
                  { value: '100%', label: language === 'mr' ? 'विनामूल्य' : 'Free Access' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-xl font-bold text-indigo-600">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Phone size={11} />, text: language === 'mr' ? 'थेट कॉल करा' : 'Direct Calls' },
                  { icon: <Shield size={11} />, text: language === 'mr' ? 'प्रमाणित संपर्क' : 'Verified Contacts' },
                  { icon: <Star size={11} />, text: language === 'mr' ? 'शेजारी पुनरावलोकने' : 'Neighbor Reviews' },
                  { icon: <MapPin size={11} />, text: language === 'mr' ? 'स्थानिक सेवा' : 'Local Services' },
                ].map((pill, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-full">
                    {pill.icon}
                    <span>{pill.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Login Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">

              {onboardingSelection === 'none' && (
                <>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">
                    {language === 'mr' ? 'प्रवेश करा' : 'Get Started'}
                  </h2>
                  <p className="text-slate-400 text-xs mb-6">
                    {language === 'mr' ? 'आपली भूमिका निवडा' : 'Select your role to continue'}
                  </p>

                  <div className="space-y-3">
                    {/* Resident Button */}
                    <button
                      onClick={() => { setRole('user'); localStorage.setItem('community_connect_onboarded', 'true'); setIsOnboarded(true); }}
                      className="w-full flex items-center gap-4 p-4 border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 rounded-xl transition-all group text-left"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-200 transition-colors">
                        <Users size={18} className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-slate-800">{language === 'mr' ? 'रहिवासी' : 'Resident'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{language === 'mr' ? 'संपर्क शोधा, कॉल करा, पुनरावलोकन द्या' : 'Browse contacts, call, and leave reviews'}</div>
                      </div>
                      <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">→</div>
                    </button>

                    {/* Deployer Button */}
                    <button
                      onClick={() => { setOnboardingSelection('deployer'); setOnboardingPasswordError(''); setOnboardingDeployerPassword(''); }}
                      className="w-full flex items-center gap-4 p-4 border-2 border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 rounded-xl transition-all group text-left"
                    >
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                        <Shield size={18} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-slate-800">{language === 'mr' ? 'व्यवस्थापक' : 'Deployer'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{language === 'mr' ? 'संपर्क व्यवस्थापित करा आणि प्रमाणित करा' : 'Manage and verify contact listings'}</div>
                      </div>
                      <div className="text-slate-300 group-hover:text-amber-400 transition-colors">
                        <Lock size={14} />
                      </div>
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle size={12} className="text-emerald-500" />
                      <span>{language === 'mr' ? 'कोणत्याही खात्याची आवश्यकता नाही' : 'No account required · Free forever'}</span>
                    </div>
                  </div>
                </>
              )}

              {onboardingSelection === 'deployer' && (
                <>
                  <button
                    onClick={() => { setOnboardingSelection('none'); setOnboardingDeployerPassword(''); setOnboardingPasswordError(''); }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-4 transition-colors"
                  >
                    ← {language === 'mr' ? 'मागे जा' : 'Back'}
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Lock size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-slate-800">{language === 'mr' ? 'व्यवस्थापक प्रवेश' : 'Deployer Access'}</h2>
                      <p className="text-xs text-slate-400">{language === 'mr' ? 'पिन प्रविष्ट करा' : 'Enter your PIN to continue'}</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (onboardingDeployerPassword === '081032') {
                      setRole('deployer');
                      localStorage.setItem('community_connect_onboarded', 'true');
                      setIsOnboarded(true);
                    } else {
                      setOnboardingPasswordError(language === 'mr' ? 'चुकीचा पासवर्ड!' : 'Incorrect PIN. Please try again.');
                    }
                  }} className="space-y-3">
                    <input
                      type="password"
                      value={onboardingDeployerPassword}
                      onChange={(e) => setOnboardingDeployerPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                      autoFocus
                      required
                    />
                    {onboardingPasswordError && (
                      <p className="text-xs text-red-500 flex items-center gap-1.5">
                        <AlertCircle size={12} /> {onboardingPasswordError}
                      </p>
                    )}
                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                      {language === 'mr' ? 'प्रवेश करा' : 'Unlock & Enter'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 px-6 py-4 text-center">
          <p className="text-xs text-slate-400">Community Connect · Parsik Nagar · Always free · Firebase synced</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN APP
  // ============================================
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100 antialiased font-sans">
      
      <header className="bg-white border-b border-slate-200 relative md:sticky top-0 z-40 shadow-xs select-none">
        <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 animate-in fade-in duration-350">
          
          <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
                <span className="text-sm md:text-base tracking-wider text-white font-black">CC</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-black text-slate-800 text-base md:text-lg tracking-tight leading-none">Community Connect</h1>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] md:text-xs font-black uppercase px-2 py-0.5 rounded-full tracking-wider leading-none">Hub</span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1 tracking-wide line-clamp-1">
                  {TRANSLATIONS[language]['app.tagline'] || "Centralized Neighborhood Directory & Emergency Helpline"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-1 rounded-2xl flex items-center justify-between gap-1 w-full md:w-auto">
            {[
              { id: 'home', icon: <Home size={15} />, label: TRANSLATIONS[language]['nav.directory'] || 'Directory', shortLabel: language === 'mr' ? 'दर्शिका' : 'Directory' },
              { id: 'search', icon: <Search size={15} />, label: TRANSLATIONS[language]['nav.filter'] || 'Universal Filter', shortLabel: language === 'mr' ? 'शोध' : 'Filter' },
              { id: 'contribute', icon: <PlusCircle size={15} />, label: TRANSLATIONS[language]['nav.suggest'] || 'Suggest Provider', shortLabel: language === 'mr' ? 'सुचवा' : 'Suggest' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2.5 sm:px-4 py-2 rounded-xl transition-all text-xs sm:text-sm font-black uppercase tracking-wider flex-1 md:flex-initial cursor-pointer ${activeTab === tab.id ? 'text-indigo-600 bg-white shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-800'}`}>
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 md:gap-3 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="flex items-center px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl bg-slate-100 border border-slate-200 select-none text-slate-700">
                <span className="text-slate-400 mr-1.5 font-bold">{language === 'mr' ? 'भूमिका:' : 'Role:'}</span>
                <span className={role === 'deployer' ? 'text-amber-600' : 'text-slate-700'}>
                  {role === 'deployer' ? (language === 'mr' ? 'व्यवस्थापक' : 'Deployer') : (language === 'mr' ? 'रहिवासी' : 'Resident')}
                </span>
              </div>
              <div className="flex items-center bg-slate-100 p-0.5 border border-slate-200 rounded-xl select-none shadow-inner shrink-0">
                <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>EN</button>
                <button onClick={() => setLanguage('mr')} className={`px-2 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${language === 'mr' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>मराठी</button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap ml-auto md:ml-0 bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1 sm:px-3">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 mr-1 uppercase tracking-wide">Area:</span>
              <span className="text-xs font-black text-slate-800 truncate">{neighborhood.societyName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 py-6 md:py-8 flex-1 select-text">
        {activeTab === 'home' && <HomeTab contacts={contacts} onEndorse={handleEndorse} onAddReview={handleAddReview} onSelectSubcategory={() => setActiveTab('search')} onSimulateCall={handleSimulateCall} onSimulateWhatsApp={handleSimulateWhatsApp} language={language} role={role} onApproveContact={handleApproveContact} onEditContact={setEditingContact} />}
        {activeTab === 'search' && <SearchTab contacts={contacts} onEndorse={handleEndorse} onSimulateCall={handleSimulateCall} onSimulateWhatsApp={handleSimulateWhatsApp} language={language} role={role} onApproveContact={handleApproveContact} onEditContact={setEditingContact} />}
        {activeTab === 'contribute' && <ContributeTab onAddContact={handleAddContact} userSuggestedContacts={userSuggestedContacts} onEndorse={handleEndorse} language={language} />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4 text-xs text-slate-400 font-semibold tracking-wide">
          <div>
            <p>Community Connect Directory • Centralized Society Desk Registry</p>
            <p className="text-[10px] text-slate-300 mt-1 font-medium">
              Serving blocks & complexes across {neighborhood.societyName} ({neighborhood.pincode})
              <button onClick={() => { localStorage.removeItem('community_connect_onboarded'); setOnboardingSelection('none'); setOnboardingPasswordError(''); setOnboardingDeployerPassword(''); setIsOnboarded(false); }} className="text-[10px] text-indigo-500 hover:text-indigo-700 underline font-extrabold uppercase tracking-wider ml-3 inline-block cursor-pointer">
                {language === 'mr' ? 'स्वागत स्क्रीनवर जा' : 'Go to Welcome Screen'}
              </button>
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-slate-300 bg-slate-50 border border-slate-100 py-1 px-3.5 rounded-2xl">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span>Always available • Firebase Cloud Sync Enabled</span>
          </div>
        </div>
      </footer>

      {/* CALL MODAL */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[360px] h-[580px] bg-zinc-950 text-white rounded-[40px] shadow-2xl border-8 border-slate-900 flex flex-col justify-between p-8 select-none animate-in zoom-in-95 duration-150">
            <div className="text-center pt-8 space-y-2">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">Simulated Phone Call</span>
              <h2 className="text-lg font-bold tracking-tight text-white">{activeCall.name}</h2>
              <span className="text-zinc-500 font-mono text-xs block">{activeCall.phone}</span>
              <span className="inline-block mt-3 bg-red-950/50 border border-red-900 text-red-500 text-[10px] py-1 px-3.5 rounded-full font-bold animate-pulse">Line Safe Mode • {getFormattedDuration(callDuration)}</span>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto text-center">
              {[{ label: 'Mute', active: false }, { label: 'Keypad', active: false }, { label: 'Speaker', active: true }, { label: 'Add Call', active: false }, { label: 'FaceTime', active: false }, { label: 'Contacts', active: false }].map((b, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border transition-colors ${b.active ? 'bg-white text-zinc-950 border-white' : 'bg-white/10 hover:bg-white/15 text-white border-white/10'}`}>{b.label[0]}</div>
                  <span className="text-[10px] text-zinc-400 font-semibold mt-1.5">{b.label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center pb-6">
              <button onClick={handleEndCall} className="w-16 h-16 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer border border-red-500">
                <span className="text-2xl">📞</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP MODAL */}
      {activeWhatsApp && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[360px] h-[580px] bg-zinc-950 text-white rounded-[40px] shadow-2xl border-8 border-slate-900 flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 border-b border-zinc-800 p-3.5 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-700 border border-emerald-600 flex items-center justify-center text-xs font-black relative shrink-0">
                  {activeWhatsApp.name.slice(0, 2).toUpperCase()}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900"></span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-extrabold truncate max-w-[140px] leading-tight text-white">{activeWhatsApp.name}</h3>
                  <span className="text-[9.5px] text-emerald-500 font-semibold">Online • Vendor</span>
                </div>
              </div>
              <button onClick={() => setActiveWhatsApp(null)} className="p-1 px-2.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700/80 rounded-xl transition-all cursor-pointer text-xs"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-950 select-text">
              <div className="mx-auto text-center py-1">
                <span className="bg-zinc-900 text-zinc-500 text-[9px] font-bold py-1 px-3 rounded-md uppercase tracking-wider">Today</span>
                <p className="text-[9px] text-zinc-500 mt-2 italic max-w-[240px] mx-auto leading-relaxed">Messages are simulated. Replies are triggered automatically.</p>
              </div>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-150`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800'}`}>
                    <p>{msg.text}</p>
                    <span className="text-[8px] text-white/60 block text-right mt-1 font-semibold">{msg.time}</span>
                  </div>
                </div>
              ))}
              {merchantTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 text-zinc-400 rounded-2xl rounded-tl-none p-3 text-xs border border-zinc-800 italic flex items-center space-x-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span>Typing...</span>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendWhatsAppMessage} className="bg-zinc-900 border-t border-zinc-800 p-3 flex gap-2 shrink-0">
              <input type="text" value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} placeholder="Type message response..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-700 text-white" />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md shrink-0 cursor-pointer">Send</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CONTACT MODAL */}
      {editingContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center space-x-2">
                <Layers size={18} className="text-amber-500" />
                <span>{TRANSLATIONS[language]['admin.modal_title'] || "Edit Provider Information"}</span>
              </h3>
              <button onClick={() => setEditingContact(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleEditContactSave(editingContact); }} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{TRANSLATIONS[language]['admin.label_name'] || "Shop / Professional Name"}</label>
                <input type="text" value={editingContact.name} onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{TRANSLATIONS[language]['admin.label_phone'] || "Direct Phone Contact"}</label>
                <input type="text" value={editingContact.phone} onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{TRANSLATIONS[language]['admin.label_hours'] || "Operating Timing Hours"}</label>
                  <input type="text" value={editingContact.hours || ''} onChange={(e) => setEditingContact({ ...editingContact, hours: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all" placeholder="e.g. 9 AM - 7 PM" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{TRANSLATIONS[language]['admin.label_address'] || "Shop Location Address"}</label>
                  <input type="text" value={editingContact.address || ''} onChange={(e) => setEditingContact({ ...editingContact, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all" placeholder="e.g. Shop 4, Sector B" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{TRANSLATIONS[language]['admin.label_details'] || "Specialities or Highlights"}</label>
                <textarea value={editingContact.details || ''} rows={3} onChange={(e) => setEditingContact({ ...editingContact, details: e.target.value })} className="w-full bg-slate-50 border border-slate-100 mt-0.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all" required />
              </div>
              <div className="flex space-x-2 pt-2">
                <button type="button" onClick={() => setEditingContact(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer">{TRANSLATIONS[language]['switch.cancel'] || "Cancel"}</button>
                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-100 cursor-pointer">{TRANSLATIONS[language]['admin.save'] || "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center space-x-2">
                <Lock size={18} className="text-amber-500" />
                <span>{language === 'mr' ? 'डेव्हलॉयर ऑथेंटिकेशन' : 'Deployer Authentication'}</span>
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">{language === 'mr' ? 'डेव्हलॉयर मोड सक्षम करण्यासाठी पासवर्ड प्रविष्ट करा.' : 'Enter the Deployer password to access administrative controls.'}</p>
              <div>
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all" required autoFocus />
                {passwordError && <p className="text-[11px] text-red-500 font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /><span>{passwordError}</span></p>}
              </div>
              <div className="flex space-x-2 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer">{TRANSLATIONS[language]['switch.cancel'] || "Cancel"}</button>
                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-100 cursor-pointer">{language === 'mr' ? 'प्रवेश करा' : 'Unlock'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
