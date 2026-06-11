import React, { useState } from 'react';
import { 
  Wrench, Shield, CheckCircle2, Phone, Star, Heart, MessageSquare, 
  MapPin, Clock, ArrowLeft, Send, Search, Sparkles, Footprints, 
  BadgeHelp, ShoppingCart, Scissors, Landmark, HelpCircle, 
  Tv, EyeOff, User, Layers, Calendar, HeartPulse, Flame, DoorClosed, ShieldAlert,
  Zap, Hammer, Bug, Store, Pill, Coffee, Cake, Leaf, Shirt, Car, Trash2, CreditCard, Mail, Building, Bus, Trees, GraduationCap, Droplet
} from 'lucide-react';
import { Contact, CategoryType, Review } from '../types';
import { Language, TRANSLATIONS, translateDataValue } from '../localization';

interface HomeTabProps {
  contacts: Contact[];
  onEndorse: (id: string) => void;
  onAddReview: (contactId: string, review: Omit<Review, 'id' | 'date'>) => void;
  onSelectSubcategory: (sub: string) => void;
  onSimulateCall: (name: string, phone: string) => void;
  onSimulateWhatsApp: (name: string, phone: string, text: string) => void;
  language: Language;
  role: 'user' | 'deployer';
  onApproveContact?: (id: string) => void;
  onEditContact?: (contact: Contact) => void;
}

export default function HomeTab({
  contacts,
  onEndorse,
  onAddReview,
  onSelectSubcategory,
  onSimulateCall,
  onSimulateWhatsApp,
  language,
  role,
  onApproveContact,
  onEditContact
}: HomeTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('repair');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<{ [key: string]: boolean }>({});
  
  // Local states for posting reviews
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerFlat, setReviewerFlat] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);

  // Quick statistics
  const visibleContacts = role === 'user' 
    ? contacts.filter(c => !c.isPendingApproval) 
    : contacts;

  const totalVerified = visibleContacts.filter(c => c.isVerified).length;
  
  // Helper icons mapper for subcategories
  const getSubcategoryIcon = (sub: string) => {
    switch (sub.toLowerCase()) {
      case 'plumber': return Droplet;
      case 'electrician': return Zap;
      case 'carpenter': return Hammer;
      case 'appliance repair': return Tv;
      case 'pest control': return Bug;
      case 'gas & lpg repair': return Flame;
      
      case 'grocery shop': return Store;
      case 'medical/pharmacy store': return Pill;
      case 'dairy & milk supply': return Coffee;
      case 'bakery': return Cake;
      case 'vegetable vendor': return Leaf;
      case 'general store': return Store;

      case 'beauty parlour': return Sparkles;
      case 'barber': return Scissors;
      case 'laundry & dhobi': return Shirt;
      case 'maid & housekeeping': return Sparkles;
      case 'home helpers': return User;
      case 'pet care': return Footprints;
      case 'car wash': return Car;
      case 'raddiwala (scrap)': return Trash2;

      case 'atm': return CreditCard;
      case 'post office': return Mail;
      case 'banks': return Building;
      case 'transport hub': return Bus;
      case 'parks & recreation': return Trees;
      case 'schools & coaching': return GraduationCap;
      
      case 'police': return Shield;
      case 'hospital': return HeartPulse;
      case 'fire brigade': return Flame;
      case "women's helpline": return Heart;
      case 'child helpline': return User;
      
      default: return HelpCircle;
    }
  };

  const popularServices = [
    { name: 'Plumber', count: visibleContacts.filter(c => c.subcategory === 'Plumber').length, icon: Droplet },
    { name: 'Medical/Pharmacy Store', count: visibleContacts.filter(c => c.subcategory === 'Medical/Pharmacy Store').length, icon: Pill },
    { name: 'Laundry & Dhobi', count: visibleContacts.filter(c => c.subcategory === 'Laundry & Dhobi').length, icon: Shirt },
    { name: 'ATM', count: visibleContacts.filter(c => c.subcategory === 'ATM').length, icon: CreditCard }
  ];

  const categories = [
    { id: 'repair', label: TRANSLATIONS[language]['cat.repair'] || 'Repair & Fix', color: 'indigo', text: TRANSLATIONS[language]['cat.desc.repair'] || 'Household maintenance', icon: Wrench, activeBg: 'bg-indigo-50/50 border-indigo-400 text-indigo-950 shadow-indigo-100/50' },
    { id: 'daily', label: TRANSLATIONS[language]['cat.daily'] || 'Daily Shops', color: 'amber', text: TRANSLATIONS[language]['cat.desc.daily'] || 'Groceries & medicines', icon: Store, activeBg: 'bg-amber-50/50 border-amber-400 text-amber-950 shadow-amber-100/50' },
    { id: 'personal', label: TRANSLATIONS[language]['cat.personal'] || 'Lifestyle & Home', color: 'emerald', text: TRANSLATIONS[language]['cat.desc.personal'] || 'Support & assistance', icon: Sparkles, activeBg: 'bg-emerald-50/50 border-emerald-400 text-emerald-950 shadow-emerald-100/50' },
    { id: 'emergency', label: TRANSLATIONS[language]['cat.emergency'] || 'Emergency Help', color: 'rose', text: TRANSLATIONS[language]['cat.desc.emergency'] || 'SOS helplines & safety', icon: ShieldAlert, activeBg: 'bg-rose-50/50 border-rose-400 text-rose-950 shadow-rose-100/50 mr-0' }
  ];

  // Filter contacts by selected category
  const filteredContacts = visibleContacts.filter(c => c.category === selectedCategory);
  
  // Extract unique subcategories for the selected category
  const subcategories = Array.from(new Set(filteredContacts.map(c => c.subcategory)));

  const handleToggleReviews = (contactId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [contactId]: !prev[contactId]
    }));
  };

  const handleSubmitReview = (e: React.FormEvent, contactId: string) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    onAddReview(contactId, {
      author: reviewerName,
      flat: reviewerFlat || 'Resident',
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewerName('');
    setReviewerFlat('');
    setReviewRating(5);
    setReviewComment('');
    setSubmittingFor(null);
  };

  // If viewing filtered list of a specific subcategory
  const displayedContacts = activeSubcategory 
    ? filteredContacts.filter(c => c.subcategory === activeSubcategory)
    : [];

  return (
    <div className="p-4 space-y-4">
      {/* Intro Header */}
      {!activeSubcategory && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full opacity-60"></div>
          <h2 className="text-base font-black text-slate-850 tracking-tight flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600 fill-indigo-100" />
            {TRANSLATIONS[language]['info.title'] || "Parsik Nagar Directory"}
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 font-bold leading-relaxed text-center md:text-left">
            {TRANSLATIONS[language]['info.desc'] || "Browse reliable service contacts verified by your neighbors. Always accessible offline."}
          </p>
          <div className="flex justify-center md:justify-start items-center mt-3 pt-3 border-t border-slate-100 text-center">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-indigo-650">{visibleContacts.length}</span>
              <span className="text-xs uppercase font-black tracking-wider text-slate-500">
                {TRANSLATIONS[language]['info.stat_contacts'] || "Local Contacts"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Detail list view of a specific subcategory */}
      {activeSubcategory ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveSubcategory(null)}
              className="flex items-center space-x-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-900 cursor-pointer p-1"
            >
              <ArrowLeft size={16} />
              <span>{TRANSLATIONS[language]['sub.back'] || "Back to Categories"}</span>
            </button>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {TRANSLATIONS[language][activeSubcategory] || activeSubcategory} ({displayedContacts.length})
            </span>
          </div>

          <div className="space-y-3.5">
            {displayedContacts.map((contact) => {
              const isPending = contact.isPendingApproval;
              
              const accentBorder = selectedCategory === 'repair' ? 'border-l-indigo-500' : 
                                   selectedCategory === 'daily' ? 'border-l-amber-500' : 
                                   selectedCategory === 'personal' ? 'border-l-emerald-500' : 
                                   'border-l-rose-500';

              const cardHoverClass = selectedCategory === 'repair' ? 'hover:border-indigo-300' : 
                                     selectedCategory === 'daily' ? 'hover:border-amber-300' : 
                                     selectedCategory === 'personal' ? 'hover:border-emerald-300' : 
                                     'hover:border-rose-300';
              return (
                <div 
                  key={contact.id} 
                  className={`bg-white rounded-[24px] border-t border-r border-b border-l-[5px] ${accentBorder} overflow-hidden ${cardHoverClass} transition-all shadow-xs hover:shadow-md duration-150`}
                >
                  {isPending && (
                    <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-amber-800">
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert size={12} className="text-amber-600 shrink-0" />
                        {TRANSLATIONS[language]['admin.pending_approval'] || "Pending Deployer Approval"}
                      </span>
                      <span className="text-[9px] bg-amber-200/60 px-2 py-0.5 rounded-full font-extrabold uppercase text-amber-800 tracking-wider">
                        Suggested Info
                      </span>
                    </div>
                  )}
                  {/* Header info */}
                  <div className="p-4 border-b border-slate-150">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-3 items-start">
                        {contact.image ? (
                          <img 
                            src={contact.image} 
                            alt={contact.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm mt-0.5"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-xl shrink-0 border mt-0.5 flex items-center justify-center font-black text-xs shadow-xs ${
                            selectedCategory === 'repair' ? 'bg-indigo-50 border-indigo-150 text-indigo-750' :
                            selectedCategory === 'daily' ? 'bg-amber-50 border-amber-150 text-amber-750' :
                            selectedCategory === 'personal' ? 'bg-emerald-50 border-emerald-150 text-emerald-750' :
                            'bg-rose-50 border-rose-150 text-rose-750'
                          }`}>
                            {contact.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-black text-base text-slate-850 leading-tight">{contact.name}</h4>
                            {contact.isVerified && (
                              <span className="inline-flex items-center text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 py-0.5 px-2 rounded-md">
                                <CheckCircle2 size={11} className="mr-0.5 fill-emerald-500 text-white" />
                                {language === 'mr' ? 'प्रमाणित' : 'Verified'}
                              </span>
                            )}
                            {contact.isUserSuggested && (
                              <span className="inline-flex items-center text-[10px] font-black text-indigo-700 bg-indigo-50 py-0.5 px-2 rounded-md border border-indigo-100">
                                {TRANSLATIONS[language]['card.suggested'] || "Suggested"}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-indigo-650 uppercase tracking-widest block mt-1">
                            {TRANSLATIONS[language][contact.subcategory] || contact.subcategory}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => onEndorse(contact.id)}
                        className="flex items-center space-x-1.5 py-1 px-3 rounded-xl text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors shrink-0 select-none cursor-pointer border border-rose-100"
                      >
                        <Heart size={12} className="fill-rose-500 stroke-none" />
                        <span>{contact.endorsements}</span>
                      </button>
                    </div>

                    <p className="text-sm text-slate-700 mt-3 font-bold bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                      {translateDataValue(contact.details, language) || TRANSLATIONS[language]['card.noreviews']}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs font-bold text-slate-650">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span className="truncate">{translateDataValue(contact.hours || 'Varies', language)}</span>
                      </div>
                      {contact.address && (
                        <div className="col-span-2 flex items-start gap-1 mt-1 text-slate-500 text-xs font-bold">
                          <span className="uppercase text-[10px] text-slate-400 shrink-0">Loc:</span>
                          <span className="line-clamp-1">{translateDataValue(contact.address, language)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Direct Number Contact & Reviews Row */}
                  <div className="bg-slate-50 border-t border-slate-150 p-2.5 flex gap-2">
                    <div 
                      className="flex-1 bg-slate-100 text-slate-800 font-extrabold py-2.5 rounded-xl text-sm uppercase tracking-wide flex items-center justify-center space-x-1.5 border border-slate-200"
                    >
                      <Phone size={14} className="text-slate-500" />
                      <span className="font-mono text-sm">{contact.phone}</span>
                    </div>

                    <button 
                      onClick={() => handleToggleReviews(contact.id)}
                      className="bg-white border border-slate-200 text-slate-700 font-extrabold py-2.5 px-4.5 rounded-xl text-sm hover:bg-slate-100 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm hover:border-slate-300"
                    >
                      <MessageSquare size={14} className="text-slate-400" />
                      <span className="font-extrabold">{contact.reviews.length || 0}</span>
                    </button>
                  </div>

                  {/* Deployer Controls Row */}
                  {role === 'deployer' && (
                    <div className="bg-slate-100 border-t border-slate-200 p-2 flex gap-2">
                      {isPending && (
                        <button 
                          onClick={() => onApproveContact?.(contact.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 size={12} className="fill-white text-emerald-600" />
                          <span>{TRANSLATIONS[language]['admin.btn_approve'] || "Verify Contact"}</span>
                        </button>
                      )}
                      <button 
                        onClick={() => onEditContact?.(contact)}
                        className="flex-1 bg-white border border-slate-200 text-slate-700 font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 hover:bg-slate-50 cursor-pointer transition-all hover:border-slate-300"
                      >
                        <Layers size={11} className="text-slate-500" />
                        <span>{TRANSLATIONS[language]['admin.btn_edit'] || "Edit Info"}</span>
                      </button>
                    </div>
                  )}

                {/* Reviews expansion drawer */}
                {expandedReviews[contact.id] && (
                  <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-4 animate-in slide-in-from-top duration-200">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {TRANSLATIONS[language]['trust.header'] || "Neighbor Recommendations"}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-extrabold">Rating: {contact.rating} / 5</span>
                    </div>

                    {contact.reviews.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic text-center py-2 font-medium">
                        {TRANSLATIONS[language]['card.noreviews'] || "No written reviews yet. Be the first to express your endorsement!"}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {contact.reviews.map((rev) => (
                          <div key={rev.id} className="bg-white border border-slate-150 rounded-2xl p-3 shadow-xs">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-bold text-slate-800">{rev.author} <span className="text-slate-400 font-medium">({translateDataValue(rev.flat || 'Flat', language)})</span></span>
                              <div className="flex items-center text-amber-500 gap-0.5">
                                <Star size={10} className="fill-amber-500 stroke-none" />
                                <span className="font-bold">{rev.rating}</span>
                              </div>
                            </div>
                            <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed italic font-medium">"{translateDataValue(rev.comment, language)}"</p>
                            <span className="text-[9px] text-slate-400 block text-right mt-1 font-bold">{translateDataValue(rev.date, language)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Write a review form toggle */}
                    {submittingFor !== contact.id ? (
                      <button 
                        onClick={() => setSubmittingFor(contact.id)}
                        className="w-full text-center py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        {TRANSLATIONS[language]['card.addreview_btn'] || "+ Add Neighbor Endorsement Review"}
                      </button>
                    ) : (
                      <form onSubmit={(e) => handleSubmitReview(e, contact.id)} className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            {TRANSLATIONS[language]['card.new_endorsement'] || "New Endorsement"}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setSubmittingFor(null)}
                            className="text-[10px] text-slate-400 font-bold hover:text-slate-600 uppercase"
                          >
                            {TRANSLATIONS[language]['card.cancel'] || "Cancel"}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                              {TRANSLATIONS[language]['card.label_name'] || "Your Name"}
                            </label>
                            <input 
                              type="text" 
                              value={reviewerName} 
                              onChange={(e) => setReviewerName(e.target.value)}
                              placeholder="e.g. Mrs. Sharma"
                              required
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                              {TRANSLATIONS[language]['card.label_flat'] || "Your Flat / Block"}
                            </label>
                            <input 
                              type="text" 
                              value={reviewerFlat} 
                              onChange={(e) => setReviewerFlat(e.target.value)}
                              placeholder="e.g. A-42"
                              required
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {TRANSLATIONS[language]['card.label_stars'] || "Stars"}
                          </label>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button 
                                key={s}
                                type="button" 
                                onClick={() => setReviewRating(s)}
                                className="focus:outline-none cursor-pointer"
                              >
                                <Star 
                                  size={16} 
                                  className={s <= reviewRating ? "text-amber-500 fill-amber-500" : "text-slate-300"} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                            {TRANSLATIONS[language]['card.label_comment'] || "Your Feedback Comments"}
                          </label>
                          <textarea 
                            value={reviewComment} 
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={TRANSLATIONS[language]['card.comment_placeholder'] || "How was their work? Punctual, neat, honest pricing?"}
                            required
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          {TRANSLATIONS[language]['card.submit'] || "Publish Endorsement Feedback"}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        /* Main Category Dashboard Grid */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Custom Category Selection Row */}
          <div className="bg-white p-3.5 rounded-[28px] border border-slate-200 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const CatIcon = cat.icon;
                const isEmergency = cat.id === 'emergency';
                
                // Custom interactive borders & shadows
                const selectionStyles = isSelected 
                  ? cat.activeBg + ' ring-1'
                  : 'border-slate-180 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs';
                
                const iconColors = isSelected
                  ? isEmergency ? 'text-rose-600 bg-rose-100' : 'text-indigo-600 bg-indigo-100/60'
                  : 'text-slate-500 bg-slate-100';

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as CategoryType)}
                    className={`p-4.5 rounded-[22px] border text-left flex flex-col justify-between h-32 transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden cursor-pointer ${selectionStyles}`}
                  >
                    <div className="flex justify-end items-center w-full">
                      <div className={`p-2 rounded-xl transition-colors ${iconColors}`}>
                        <CatIcon size={16} className="stroke-[2.5]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className={`text-sm sm:text-base font-black tracking-tight leading-tight ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                        {cat.label}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-bold line-clamp-1 leading-none">{cat.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory list inside selected Category pillar */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {TRANSLATIONS[language]['sub.available'] || "Available Sub-Services"}
              </span>
              <span className="text-xs text-indigo-700 font-extrabold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {subcategories.length} {TRANSLATIONS[language]['sub.lines'] || "Lines"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subcategories.map((sub) => {
                const count = filteredContacts.filter(c => c.subcategory === sub).length;
                const IconComp = getSubcategoryIcon(sub);
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-2xl p-3.5 text-left transition-all active:scale-98 flex items-center justify-between group cursor-pointer shadow-sm w-full"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="bg-slate-50 text-slate-600 p-2.5 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                        <IconComp size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-sm text-slate-800 tracking-tight leading-snug whitespace-normal break-words group-hover:text-indigo-900">
                          {TRANSLATIONS[language][sub] || sub}
                        </h4>
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-505 uppercase tracking-wide mt-1 inline-block">
                          {count} {TRANSLATIONS[language]['sub.listed'] || "listed"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust endorsement banner / highlight */}
          <div className="bg-rose-50 border border-slate-200 rounded-3xl p-5.5 flex items-start space-x-4 shadow-sm">
            <div className="bg-rose-100 border border-rose-200 p-2.5 rounded-xl text-rose-600 shrink-0">
              <Heart size={18} className="fill-rose-500 stroke-none animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-rose-950 uppercase tracking-wide">
                {TRANSLATIONS[language]['trust.header'] || "Neighbor Endorsements"}
              </h4>
              <p className="text-xs text-rose-800/90 mt-1.5 leading-relaxed font-bold">
                {TRANSLATIONS[language]['trust.body'] || "Clicking the heart next to any provider registers your endorsement. This grows trust score inside our society block!"}
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
