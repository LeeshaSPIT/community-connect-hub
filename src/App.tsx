import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { INITIAL_CONTACTS } from './data';
import { Contact, NeighborhoodSetting, Review } from './types';
import HomeTab from './components/HomeTab';
import SearchTab from './components/SearchTab';
import ContributeTab from './components/ContributeTab';
import { Language, TRANSLATIONS } from './localization';
import { 
  Phone, Users, Check, MessageSquare, CornerDownLeft, Sparkles, 
  AlertCircle, X, CheckSquare, Heart, MapPin, Search, PlusCircle, Home, HelpCircle,
  ShieldAlert, Layers, Lock, CheckCircle2, Trash2
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [role, setRole] = useState<'user' | 'deployer'>('user');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Onboarding screens state
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [onboardingDeployerPassword, setOnboardingDeployerPassword] = useState('');
  const [onboardingPasswordError, setOnboardingPasswordError] = useState('');
  const [onboardingSelection, setOnboardingSelection] = useState<'none' | 'resident' | 'deployer'>('none');
  
  // Deployer security password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSwitchToDeployerClick = () => {
    if (role === 'deployer') return;
    setShowPasswordModal(true);
    setPasswordInput('');
    setPasswordError('');
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '081032') {
      setRole('deployer');
      setShowPasswordModal(false);
      setPasswordError('');
    } else {
      setPasswordError(language === 'mr' ? 'चुकीचा पासवर्ड! पुन्हा प्रयत्न करा.' : 'Incorrect password! Please try again.');
    }
  };

  // Verification helper for user suggest contacts
  const handleApproveContact = async (id: string) => {
    const updated = contacts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isPendingApproval: false,
          isVerified: true
        };
      }
      return c;
    });
    const approvedContact = updated.find(c => c.id === id);
    if (approvedContact) {
      await setDoc(doc(db, 'contacts', approvedContact.id), approvedContact);
    }
    setContacts(updated);
  };

  // Full information editing submit handler for Deployer
  // Full information editing submit handler for Deployer
  const handleEditContactSave = async (updatedContact: Contact) => {
    const updated = contacts.map(c => {
      if (c.id === updatedContact.id) {
        return updatedContact;
      }
      return c;
    });
    await setDoc(doc(db, 'contacts', updatedContact.id), updatedContact);
    setContacts(updated);
    setEditingContact(null);
  };

  // Permanent record deletion action for Deployers
  const handleDeleteContact = async (id: string) => {
    const confirmationText = language === 'mr' 
      ? 'तुम्हाला खात्री आहे की तुम्ही हा संपर्क हटवू इच्छिता?' 
      : 'Are you sure you want to delete this contact permanently?';
      
    if (window.confirm(confirmationText)) {
      await deleteDoc(doc(db, 'contacts', id));
      setContacts(contacts.filter(c => c.id !== id));
      setEditingContact(null);
    }
  };
  
  // Neighborhood profile settings state
  const [neighborhood, setNeighborhood] = useState<NeighborhoodSetting>({
    societyName: 'Parsik Nagar',
    pincode: '400605'
  });

  // Location selector settings state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSociety, setTempSociety] = useState('');
  const [tempPincode, setTempPincode] = useState('');

  // Call simulator overlay state
  const [activeCall, setActiveCall] = useState<{ name: string; phone: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // WhatsApp simulator overlay state
  const [activeWhatsApp, setActiveWhatsApp] = useState<{ name: string; phone: string; initialMessage: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'merchant'; text: string; time: string }[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [merchantTyping, setMerchantTyping] = useState(false);

  // Sync temp variables with active neighborhood setting
  useEffect(() => {
    if (neighborhood) {
      setTempSociety(neighborhood.societyName);
      setTempPincode(neighborhood.pincode);
    }
  }, [neighborhood]);

  // Load initial dataset, merging with Firebase for shared state
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'contacts'), (snapshot) => {
      const firebaseContacts: Contact[] = snapshot.docs
        .map(doc => doc.data() as Contact)
        .filter(c =>
          c.subcategory !== 'Society Watch & Utilities' &&
          c.subcategory !== 'सोसायटी वॉच आणि युक्त्या'
        );

      const baseIds = new Set(INITIAL_CONTACTS.map(c => c.id));
      // Start with firebase versions of base contacts, merged with base defaults
      const merged = INITIAL_CONTACTS.map(base => {
        const fb = firebaseContacts.find(fc => fc.id === base.id);
        return fb ? { ...base, ...fb } : base;
      });
      // Add user-suggested contacts (not in base)
      firebaseContacts
        .filter(fc => !baseIds.has(fc.id))
        .forEach(fc => merged.push(fc));
      setContacts(merged);
    });

    const storedSetting = localStorage.getItem('community_connect_setting');
    if (storedSetting) {
      try {
        setNeighborhood(JSON.parse(storedSetting));
      } catch (e) {}
    }

    return () => unsubscribe();
  }, []);

  // Save contact changes to Firebase
  const updateAndStoreContacts = async (newsList: Contact[]) => {
    setContacts(newsList);
  };

  const handleUpdateNeighborhood = (setting: NeighborhoodSetting) => {
    setNeighborhood(setting);
    localStorage.setItem('community_connect_setting', JSON.stringify(setting));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateNeighborhood({
      societyName: tempSociety || 'Parsik Nagar',
      pincode: tempPincode || '400605'
    });
    setShowSettingsModal(false);
  };

  // 1. One-click endorsement increment (Trust layer)
  const handleEndorse = async (id: string) => {
    const updated = contacts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          endorsements: c.endorsements + 1
        };
      }
      return c;
    });
    const endorsedContact = updated.find(c => c.id === id);
    if (endorsedContact) {
      await setDoc(doc(db, 'contacts', endorsedContact.id), endorsedContact);
    }
    setContacts(updated);
  };

  // 2. Add custom review to contact (Neighbor Stars & comments)
  const handleAddReview = async (contactId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-gen-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const newReviewsList = [newReview, ...c.reviews];
        const totalRating = newReviewsList.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = parseFloat((totalRating / newReviewsList.length).toFixed(1));

        return {
          ...c,
          reviews: newReviewsList,
          ratingsCount: c.ratingsCount + 1,
          rating: avgRating
        };
      }
      return c;
    });
    const reviewedContact = updated.find(c => c.id === contactId);
    if (reviewedContact) {
      await setDoc(doc(db, 'contacts', reviewedContact.id), reviewedContact);
    }
    setContacts(updated);
  };

  // 3. User registers a suggested provider contact (Crowdsourcing)
  const handleAddContact = async (newContactData: Omit<Contact, 'id' | 'rating' | 'ratingsCount' | 'endorsements' | 'reviews' | 'isVerified'>) => {
    // Generate a deterministic stable ID using the phone number and partial name
    const sanitizedPhone = newContactData.phone.replace(/[^0-9]/g, '');
    const cleanName = newContactData.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    const stableId = `usr-suggest-${cleanName}-${sanitizedPhone}`;

    const fullContact: Contact = {
      ...newContactData,
      id: stableId, // Use the new stable ID here
      rating: 5.0,
      ratingsCount: 1,
      endorsements: 1,
      isVerified: false,
      isUserSuggested: true,
      isPendingApproval: true,
      reviews: [
        {
          id: `rev-init-${Date.now()}`,
          author: 'Submitting Neighbor',
          flat: 'Flat Member',
          rating: 5,
          comment: `Suggested: "${newContactData.details}"`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      ]
    };

    // FIX: A bulletproof filter that strips out ANY undefined values before Firebase sees them
    const safeFirestoreData = Object.fromEntries(
      Object.entries(fullContact).filter(([_, value]) => value !== undefined)
    );

    try {
      // Save the cleaned data to Firebase
      await setDoc(doc(db, 'contacts', fullContact.id), safeFirestoreData);
      
      // Update the local screen
      setContacts(prev => {
        // Prevent local state duplication if it's already in the list
        if (prev.some(c => c.id === fullContact.id)) return prev;
        return [fullContact, ...prev];
      });
    } catch (error) {
      console.error("Firebase save failed:", error);
      alert("Database error! Could not save suggestion.");
    }
  };

  // Trigger outbound dialed call simulation
  const handleSimulateCall = (name: string, phone: string) => {
    setActiveCall({ name, phone });
    setCallDuration(0);
  };

  // Outbound call timer incrementer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleEndCall = () => {
    setActiveCall(null);
    setCallDuration(0);
  };

  const getFormattedDuration = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger WhatsApp Chat framework simulator
  const handleSimulateWhatsApp = (name: string, phone: string, initialText: string) => {
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages([
      { sender: 'user', text: initialText, time: currentTimeStr }
    ]);
    setActiveWhatsApp({ name, phone, initialMessage: initialText });
    setTypedMessage('');
    setMerchantTyping(false);
  };

  // Send typed text in simulated WhatsApp box
  const handleSendWhatsAppMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeWhatsApp) return;

    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: typedMessage, time: currentTimeStr };
    
    setChatMessages(prev => [...prev, userMsg]);
    setTypedMessage('');
    setMerchantTyping(true);

    setTimeout(() => {
      let replyText = `Thanks for writing! Yes, I am currently available in ${neighborhood.societyName}. I can head over to your block shortly.`;
      if (activeWhatsApp.name.toLowerCase().includes('sharma')) {
        replyText = "Hello! Yes, I am free now. I have some pipeline tools in my scooter, can visit your flat in 15 mins. Standard visit fee is ₹150. Hope that is fine?";
      } else if (activeWhatsApp.name.toLowerCase().includes('apex')) {
        replyText = "Apex Pharmacy here. Yes, medicines are currently available. Please send the doctor's prescription snapshot here to dispatch home delivery.";
      } else if (activeWhatsApp.name.toLowerCase().includes('sparkle')) {
        replyText = "Hi sir, Car Wash is active. Let me know your block/flat and parking floor number. Will clean it first thing tomorrow morning!";
      } else if (activeWhatsApp.name.toLowerCase().includes('verma')) {
        replyText = "Verma Electrician here. Yes, I am servicing another flat in Tower B right now. I can wrap up and come to your apartment next. What's the problem?";
      }

      const merchantTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const responseMsg = { sender: 'merchant' as const, text: replyText, time: merchantTimeStr };
      
      setChatMessages(prev => [...prev, responseMsg]);
      setMerchantTyping(false);
    }, 1500);
  };

  // Filter user suggested contributors only
  const userSuggestedContacts = contacts.filter(c => c.isUserSuggested || c.isPendingApproval);

  // Render onboarding / role-selection page if not onboarded
  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100 antialiased font-sans p-4 md:p-8 relative overflow-hidden">
        
        {/* Soft background decor */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl -z-10 translate-x-[-20%] translate-y-[-20%]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl -z-10 translate-x-[20%] translate-y-[20%]" />

        {/* Top bar on Onboarding */}
        <div className="max-w-[500px] mx-auto w-full flex justify-between items-center py-2 shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0 font-sans">
              <span className="font-extrabold text-xs tracking-wider text-white font-black">CC</span>
            </div>
            <span className="font-extrabold text-slate-800 text-xs tracking-tight">Community Connect Hub</span>
          </div>

          {/* Multilingual language switcher */}
          <div className="flex items-center bg-white p-0.5 border border-slate-200 rounded-xl shadow-inner shrink-0 scale-90">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('mr')}
              className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                language === 'mr' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Center Card */}
        <div className="max-w-[500px] mx-auto w-full bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-slate-200/60 my-auto text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-50 to-white border border-indigo-100 rounded-[20px] flex items-center justify-center text-2xl mb-5 shadow-sm animate-bounce [animation-duration:3s]">
            🏡
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-slate-850 tracking-tight leading-tight">
            {language === 'mr' ? 'कम्युनिटी कनेक्टमध्ये आपले स्वागत आहे' : 'Welcome to Community Connect'}
          </h1>
          
          <p className="text-indigo-600 text-[9px] font-black uppercase tracking-widest mt-2 px-3 py-0.5 bg-indigo-50/65 rounded-full border border-indigo-100 inline-block">
            {language === 'mr' ? 'पारसिक नगर सेवा आणि निर्देशिका' : 'Parsik Nagar Services & Directory'}
          </p>

          <p className="text-slate-500 text-xs font-medium mt-3.5 max-w-sm leading-relaxed">
            {language === 'mr' 
              ? 'शेजाऱ्यांची जोडणी, स्थानिक सेवांशी सुसंवाद. आपल्या परिसरातील प्रमाणित प्रदाते शोधा, संपर्क साधा आणि आपले जीवन सोपे करा.'
              : 'Bridging neighbors, empowering local service heroes. Your active gateway to search, contact, and verify trusted neighborhood mechanics, repair teams, daily vendors, and emergency helpers.'}
          </p>

          {/* Separation line */}
          <div className="w-full border-t border-slate-100 my-5" />

          {onboardingSelection === 'none' && (
            <div className="w-full space-y-3.5">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === 'mr' ? 'प्रवेश करण्यासाठी आपली भूमिका निवडा' : 'Select Your Role to Access'}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {/* Resident Option Card */}
                <button
                  type="button"
                  onClick={() => {
                    setRole('user');
                    localStorage.setItem('community_connect_onboarded', 'true');
                    setIsOnboarded(true);
                  }}
                  className="bg-slate-50 hover:bg-slate-100/10 hover:bg-indigo-50/20 border border-slate-200 hover:border-indigo-350 text-left p-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-base shrink-0">
                      👥
                    </div>
                    <span className="font-extrabold text-xs text-slate-800 group-hover:text-indigo-700">
                      {language === 'mr' ? 'रहिवासी / नागरिक' : 'Resident'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                    {language === 'mr' 
                      ? 'स्थानिक प्लंबर, औषधांची दुकाने आणि आपत्कालीन सोसायटी हेल्प लाईन्स पहा. कोणत्या पासवर्डची गरज नाही.'
                      : 'Look up directory listings, plumber profiles, grocery operating maps, and rapid emergency desks with zero barriers.'}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] text-indigo-600 font-black uppercase tracking-wider mt-2.5 group-hover:translate-x-1 transition-transform">
                    {language === 'mr' ? 'प्रवेश करा' : 'Explore Area'} →
                  </span>
                </button>

                {/* Deployer Option Card */}
                <button
                  type="button"
                  onClick={() => {
                    setOnboardingSelection('deployer');
                    setOnboardingPasswordError('');
                    setOnboardingDeployerPassword('');
                  }}
                  className="bg-slate-50 hover:bg-slate-100/10 hover:bg-amber-50/20 border border-slate-200 hover:border-amber-350 text-left p-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <div className="w-7 h-7 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center text-base shrink-0">
                      🛠️
                    </div>
                    <span className="font-extrabold text-xs text-slate-800 group-hover:text-amber-700">
                      {language === 'mr' ? 'डॅशबोर्ड व्यवस्थापक' : 'Deployer'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                    {language === 'mr' 
                      ? 'नवीन सुचवलेले प्रदाते स्वीकृत करा, माहिती दुरुस्त करा किंवा संपूर्ण डेटाबेस व्यवस्थापित करा.'
                      : 'Moderate listings, verify suggested contacts, edit timings, and curate the active complex database.'}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] text-amber-600 font-black uppercase tracking-wider mt-2.5 group-hover:translate-x-1 transition-transform">
                    {language === 'mr' ? 'पासवर्ड टाका' : 'Authenticate Security'} →
                  </span>
                </button>
              </div>
            </div>
          )}

          {onboardingSelection === 'deployer' && (
            <div className="w-full space-y-4 text-left animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider flex items-center gap-1">
                  <Lock size={11} />
                  {language === 'mr' ? 'व्यवस्थापक प्रमाणीकरण' : 'Deployer Security'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOnboardingSelection('none');
                    setOnboardingDeployerPassword('');
                    setOnboardingPasswordError('');
                  }}
                  className="text-[10px] text-slate-400 hover:text-slate-600 underline font-extrabold uppercase tracking-wider"
                >
                  {language === 'mr' ? 'मागे जा' : '← Back'}
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onboardingDeployerPassword === '081032') {
                    setRole('deployer');
                    localStorage.setItem('community_connect_onboarded', 'true');
                    setIsOnboarded(true);
                  } else {
                    setOnboardingPasswordError(language === 'mr' ? 'चुकीचा पासवर्ड! पुन्हा प्रयत्न करा.' : 'Incorrect password! Please try again.');
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <input 
                    type="password"
                    value={onboardingDeployerPassword}
                    onChange={(e) => setOnboardingDeployerPassword(e.target.value)}
                    placeholder={language === 'mr' ? 'संख्यात्मक पिन प्रविष्ट करा' : 'Enter numeric PIN'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
                    autoFocus
                    required
                  />
                  {onboardingPasswordError && (
                    <p className="text-[11px] text-red-500 font-bold mt-1.5 flex items-center gap-1 animate-in shake">
                      <AlertCircle size={12} />
                      <span>{onboardingPasswordError}</span>
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOnboardingSelection('none');
                      setOnboardingDeployerPassword('');
                      setOnboardingPasswordError('');
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-705 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                  >
                    {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all text-center shadow-md shadow-amber-100 cursor-pointer"
                  >
                    {language === 'mr' ? 'प्रवेश करा' : 'Unlock & Enter'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Bottom copyright footer */}
        <div className="max-w-[500px] mx-auto w-full text-center shrink-0">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
            Connected Area: Parsik Nagar • 400605
          </p>
          <p className="text-[9px] text-slate-300 font-semibold mt-1">
            Always local • Offline Cache Enabled • Secure Directory Registry
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100 antialiased font-sans">
      
      {/* Premium Desktop Website Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 relative md:sticky top-0 z-40 shadow-xs select-none">
        <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 animate-in fade-in duration-350">
          
          {/* Logo & Branding Area */}
          <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
                <span className="text-sm md:text-base tracking-wider text-white font-black">CC</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-black text-slate-800 text-base md:text-lg tracking-tight leading-none">Community Connect</h1>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] md:text-xs font-black uppercase px-2 py-0.5 rounded-full tracking-wider leading-none">
                    Hub
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1 tracking-wide line-clamp-1">
                  {TRANSLATIONS[language]['app.tagline'] || "Centralized Neighborhood Directory & Emergency Helpline"}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Control Tabs */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center justify-between gap-1 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2.5 sm:px-4 py-2 rounded-xl transition-all text-xs sm:text-sm font-black uppercase tracking-wider flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-indigo-600 bg-white shadow-sm font-black scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home size={15} className={activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-1.5'} />
              <span className="hidden sm:inline">{TRANSLATIONS[language]['nav.directory'] || "Dashboard Directory"}</span>
              <span className="inline sm:hidden">{language === 'mr' ? 'दर्शिका' : 'Directory'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('search')}
              className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2.5 sm:px-4 py-2 rounded-xl transition-all text-xs sm:text-sm font-black uppercase tracking-wider flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'search' 
                  ? 'text-indigo-600 bg-white shadow-sm font-black scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Search size={15} className={activeTab === 'search' ? 'stroke-[2.5]' : 'stroke-1.5'} />
              <span className="hidden sm:inline">{TRANSLATIONS[language]['nav.filter'] || "Universal Filter"}</span>
              <span className="inline sm:hidden">{language === 'mr' ? 'शोध' : 'Filter'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('contribute')}
              className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2.5 sm:px-4 py-2 rounded-xl transition-all text-xs sm:text-sm font-black uppercase tracking-wider flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'contribute' 
                  ? 'text-indigo-600 bg-white shadow-sm font-black scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <PlusCircle size={15} className={activeTab === 'contribute' ? 'stroke-[2.5]' : 'stroke-1.5'} />
              <span className="hidden sm:inline">{TRANSLATIONS[language]['nav.suggest'] || "Suggest Provider"}</span>
              <span className="inline sm:hidden">{language === 'mr' ? 'सुचवा' : 'Suggest'}</span>
            </button>
          </div>

          {/* Current Connected Residential Base Indicator */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 md:gap-3 shrink-0 w-full md:w-auto">
            
            {/* Quick settings grouping (Role / Language) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Active Role Indicator (Read-only) */}
              <div className="flex items-center px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl bg-slate-100 border border-slate-200 select-none text-slate-700">
                <span className="text-slate-400 mr-1.5 font-bold">{language === 'mr' ? 'भूमिका:' : 'Role:'}</span>
                <span className={role === 'deployer' ? 'text-amber-600' : 'text-slate-700'}>
                  {role === 'deployer' ? (language === 'mr' ? 'व्यवस्थापक' : 'Deployer') : (language === 'mr' ? 'रहिवासी' : 'Resident')}
                </span>
              </div>

              {/* Elegant Language Toggle Switches */}
              <div className="flex items-center bg-slate-100 p-0.5 border border-slate-200 rounded-xl select-none shadow-inner shrink-0">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    language === 'en' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mr')}
                  className={`px-2 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    language === 'mr' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  मराठी
                </button>
              </div>
            </div>

            {/* Geographical Base Block */}
            <div className="flex items-center gap-2 flex-wrap ml-auto md:ml-0 bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1 sm:px-3">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 mr-1 uppercase tracking-wide">
                Area:
              </span>
              <span className="text-xs font-black text-slate-800 truncate">
                {neighborhood.societyName}
              </span>
            </div>

          </div>

        </div>
      </header>

      {/* Main Container Stage wrapper */}
      <main className="max-w-5xl mx-auto w-full px-4 py-6 md:py-8 flex-1 select-text">
        {activeTab === 'home' && (
          <HomeTab 
            contacts={contacts}
            onEndorse={handleEndorse}
            onAddReview={handleAddReview}
            onSelectSubcategory={(sub) => {
              setActiveTab('search');
            }}
            onSimulateCall={handleSimulateCall}
            onSimulateWhatsApp={handleSimulateWhatsApp}
            language={language}
            role={role}
            onApproveContact={handleApproveContact}
            onEditContact={setEditingContact}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab 
            contacts={contacts}
            onEndorse={handleEndorse}
            onSimulateCall={handleSimulateCall}
            onSimulateWhatsApp={handleSimulateWhatsApp}
            language={language}
            role={role}
            onApproveContact={handleApproveContact}
            onEditContact={setEditingContact}
          />
        )}

        {activeTab === 'contribute' && (
          <ContributeTab 
            onAddContact={handleAddContact}
            userSuggestedContacts={userSuggestedContacts}
            onEndorse={handleEndorse}
            language={language}
          />
        )}
      </main>

      {/* Modern Desktop Website Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4 text-xs text-slate-400 font-semibold tracking-wide">
          <div>
            <p>Community Connect Directory • Centralized Society Desk Registry</p>
            <p className="text-[10px] text-slate-300 mt-1 font-medium">
              Serving blocks & complexes across {neighborhood.societyName} ({neighborhood.pincode})
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('community_connect_onboarded');
                  setOnboardingSelection('none');
                  setOnboardingPasswordError('');
                  setOnboardingDeployerPassword('');
                  setIsOnboarded(false);
                }}
                className="text-[10px] text-indigo-500 hover:text-indigo-700 underline font-extrabold uppercase tracking-wider ml-3 inline-block cursor-pointer"
              >
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

      {/* OUTBOUND CALL DIAL PHONE MOCK MODAL */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[360px] h-[580px] bg-zinc-950 text-white rounded-[40px] shadow-2xl border-8 border-slate-900 flex flex-col justify-between p-8 select-none animate-in zoom-in-95 duration-150">
            <div className="text-center pt-8 space-y-2">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">Simulated Phone Call</span>
              <h2 className="text-lg font-bold tracking-tight text-white">{activeCall.name}</h2>
              <span className="text-zinc-500 font-mono text-xs block">{activeCall.phone}</span>
              <span className="inline-block mt-3 bg-red-950/50 border border-red-900 text-red-500 text-[10px] py-1 px-3.5 rounded-full font-bold animate-pulse">
                Line Safe Mode • {getFormattedDuration(callDuration)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto text-center">
              {[
                { label: 'Mute', active: false }, { label: 'Keypad', active: false }, { label: 'Speaker', active: true },
                { label: 'Add Call', active: false }, { label: 'FaceTime', active: false }, { label: 'Contacts', active: false }
              ].map((b, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border transition-colors ${
                    b.active ? 'bg-white text-zinc-950 border-white' : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  }`}>
                    {b.label[0]}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold mt-1.5">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center pb-6">
              <button 
                type="button"
                onClick={handleEndCall}
                className="w-16 h-16 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer border border-red-500"
              >
                <span className="text-2xl">📞</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP CHAT SANDBOX PHONE MOCK MODAL */}
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
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveWhatsApp(null)}
                  className="p-1 px-2.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700/80 rounded-xl transition-all cursor-pointer text-xs"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div 
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-950 select-text"
              style={{
                backgroundImage: 'radial-gradient(ellipse at center, rgba(16,185,129,0.02) 0%, rgba(0,0,0,0) 70%)'
              }}
            >
              <div className="mx-auto text-center py-1">
                <span className="bg-zinc-900 text-zinc-500 text-[9px] font-bold py-1 px-3 rounded-md uppercase tracking-wider">
                  Today
                </span>
                <p className="text-[9px] text-zinc-500 mt-2 italic max-w-[240px] mx-auto leading-relaxed">
                  Messages are simulated. Replies are triggered automatically.
                </p>
              </div>

              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-150`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800'
                  }`}>
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

            <form onSubmit={handleSendWhatsAppMessage} className="bg-zinc-900 border-t border-zinc-800 p-3 flex gap-2 shrink-0 animate-in slide-in-from-bottom-2 duration-150">
              <input 
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type message response..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-700 text-white animate-fade-in"
              />
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md shrink-0 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEPLOYER CONTACT EDITING OVERLAY MODAL */}
      {editingContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[95vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 z-10">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center space-x-2">
                <Layers size={18} className="text-amber-500" />
                <span>{TRANSLATIONS[language]['admin.modal_title'] || "Edit Provider Information"}</span>
              </h3>
              <button 
                onClick={() => setEditingContact(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleEditContactSave(editingContact);
              }}
              className="space-y-4"
            >
              {/* NAME FIELD */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {TRANSLATIONS[language]['admin.label_name'] || "Shop / Professional Name"}
                </label>
                <input 
                  type="text" 
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* PHONE FIELD */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {TRANSLATIONS[language]['admin.label_phone'] || "Direct Phone Contact"}
                </label>
                <input 
                  type="text" 
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* HOURS & LOCATION GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    {TRANSLATIONS[language]['admin.label_hours'] || "Operating Timing Hours"}
                  </label>
                  <input 
                    type="text" 
                    value={editingContact.hours || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, hours: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    placeholder="e.g. 9 AM - 8 PM"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    {TRANSLATIONS[language]['admin.label_address'] || "Shop Location Address"}
                  </label>
                  <input 
                    type="text" 
                    value={editingContact.address || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    placeholder="e.g. Shop No. 5, Phase 1"
                  />
                </div>
              </div>

              {/* PHOTO / IMAGE URL */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {language === 'mr' ? 'फोटो / इमेज URL' : 'Photo / Image URL'}
                </label>
                <input 
                  type="text" 
                  value={editingContact.image || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* SPECIALITIES / DETAILS TEXTAREA */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {TRANSLATIONS[language]['admin.label_details'] || "Specialities or Highlights"}
                </label>
                <textarea 
                  value={editingContact.details || ''}
                  rows={3}
                  onChange={(e) => setEditingContact({ ...editingContact, details: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-none"
                  placeholder="Describe your services..."
                  required
                />
              </div>

              {/* ACTION CONTROL BUTTON CONTAINER */}
              <div className="flex flex-col space-y-2 pt-2">
                <div className="flex space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingContact(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {TRANSLATIONS[language]['switch.cancel'] || "Cancel"}
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-100 cursor-pointer"
                  >
                    {TRANSLATIONS[language]['admin.save'] || "Save Changes"}
                  </button>
                </div>

                <div className="border-t border-slate-100 my-1 pt-1" />

                <button 
                  type="button"
                  onClick={() => handleDeleteContact(editingContact.id)}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Trash2 size={13} />
                  <span>{language === 'mr' ? 'संपर्क कायमचा हटवा' : 'Delete Contact Permanently'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPLOYER PASSWORD VERIFICATION MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center space-x-2">
                <Lock size={18} className="text-amber-500" />
                <span>{language === 'mr' ? 'डेव्हलॉयर ऑथेंटिकेशन' : 'Deployer Authentication'}</span>
              </h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'mr' 
                  ? 'डेव्हलॉयर मोड सक्षम करण्यासाठी अधिकृत संकेतशब्द (पासवर्ड) प्रविष्ट करा.'
                  : 'Enter the designated Deployer password to access administrative controls.'}
              </p>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {language === 'mr' ? 'पासवर्ड प्रविष्ट करा' : 'Enter Password'}
                </label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  required
                  autoFocus
                />
                {passwordError && (
                  <p className="text-[11px] text-red-500 font-bold mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {TRANSLATIONS[language]['switch.cancel'] || "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-100 cursor-pointer"
                >
                  {language === 'mr' ? 'प्रवेश करा' : 'Unlock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
