import React, { useState, useMemo } from 'react';
import { Search, Star, Phone, CheckCircle, Heart, Clock, MapPin, X, SlidersHorizontal, Sliders, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Contact } from '../types';
import { SEARCH_KEYWORDS } from '../data';
import { Language, TRANSLATIONS, translateDataValue } from '../localization';

interface SearchTabProps {
  contacts: Contact[];
  onEndorse: (id: string) => void;
  onSimulateCall: (name: string, phone: string) => void;
  onSimulateWhatsApp: (name: string, phone: string, text: string) => void;
  language: Language;
  role: 'user' | 'deployer';
  onApproveContact?: (id: string) => void;
  onEditContact?: (contact: Contact) => void;
}

export default function SearchTab({
  contacts,
  onEndorse,
  onSimulateCall,
  onSimulateWhatsApp,
  language,
  role,
  onApproveContact,
  onEditContact
}: SearchTabProps) {
  const [query, setQuery] = useState('');
  const [onlyHighRated, setOnlyHighRated] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Quick suggestion tags we can search directly
  const suggestionTags = ['Leak', 'Medicine', 'ATM', 'Laundry', 'Car Wash', 'Plumber', 'Raddi'];

  // Smart matching logic with keyword mapping
  const visibleContacts = useMemo(() => {
    return role === 'user' 
      ? contacts.filter(c => !c.isPendingApproval) 
      : contacts;
  }, [contacts, role]);

  const searchResults = useMemo(() => {
    const cleanedQuery = query.toLowerCase().trim();
    if (!cleanedQuery) {
      let list = visibleContacts;
      if (onlyHighRated) list = list.filter(c => c.rating >= 4.5);
      return list;
    }

    // Identify if any keyword mappings exist in data.ts
    const matchedSubcategories = new Set<string>();
    
    Object.keys(SEARCH_KEYWORDS).forEach(keyword => {
      if (cleanedQuery.includes(keyword) || keyword.includes(cleanedQuery)) {
        SEARCH_KEYWORDS[keyword].forEach(sub => matchedSubcategories.add(sub.toLowerCase()));
      }
    });

    return visibleContacts.filter(contact => {
      // Basic checks
      const matchesName = contact.name.toLowerCase().includes(cleanedQuery);
      const matchesSubcategory = contact.subcategory.toLowerCase().includes(cleanedQuery);
      const matchesDetails = contact.details?.toLowerCase().includes(cleanedQuery) || false;
      const matchesCategory = contact.category.toLowerCase().includes(cleanedQuery);
      
      // Keyword mapping check
      const matchesKeywordMapping = matchedSubcategories.has(contact.subcategory.toLowerCase());

      const satisfiesText = matchesName || matchesSubcategory || matchesDetails || matchesCategory || matchesKeywordMapping;
      const satisfiesRating = onlyHighRated ? contact.rating >= 4.5 : true;

      return satisfiesText && satisfiesRating;
    });
  }, [query, visibleContacts, onlyHighRated]);

  return (
    <div className="p-4 space-y-4">
      
      {/* Search Header Wrapper */}
      <div className="space-y-3.5">
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={TRANSLATIONS[language]['search.placeholder'] || "Search e.g. 'leaking pipe', 'chemist', 'laundry'..."}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-10 py-4 text-base font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
          />
          <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Suggestion Quick Tags */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 select-none scrollbar-none px-1">
          <span className="text-xs text-slate-500 font-extrabold uppercase shrink-0 tracking-wider">
            {TRANSLATIONS[language]['search.try_label'] || "Try:"}
          </span>
          {suggestionTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="text-xs bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 py-1.5 px-3.5 rounded-full transition-colors font-bold shrink-0 cursor-pointer"
            >
              {TRANSLATIONS[language]['tag.' + tag] || tag}
            </button>
          ))}
        </div>
      </div>

      {/* Filter sliders panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm">
        <span className="text-xs text-slate-500 font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <Sliders size={13} className="text-indigo-600" />
          {TRANSLATIONS[language]['search.refine'] || "Refine Results"}
        </span>
        
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={onlyHighRated}
              onChange={(e) => setOnlyHighRated(e.target.checked)}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-black text-slate-750">4.5★+</span>
          </label>
        </div>
      </div>

      {/* Results Info and List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-black tracking-wider uppercase text-slate-500">
            {query 
              ? (TRANSLATIONS[language]['search.results_matched'] || 'Matched Search Results') 
              : (TRANSLATIONS[language]['search.results_general'] || 'General Directory')}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 py-1 px-3 rounded-full">
            {searchResults.length} Match{searchResults.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2 animate-in fade-in duration-150 shadow-sm">
            <span className="text-3xl">🔍</span>
            <h4 className="font-bold text-sm text-slate-800">
              {TRANSLATIONS[language]['search.not_found'] || "No matching contacts found"}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold">
              {TRANSLATIONS[language]['search.no_match_desc'] || "We couldn't match your search to any local listings. Try resetting or selecting a suggestion tag."}
            </p>
            <button 
              onClick={() => { setQuery(''); setOnlyHighRated(false); }}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 mt-2 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
            >
              {TRANSLATIONS[language]['search.reset'] || "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {searchResults.map((contact) => {
              const isPending = contact.isPendingApproval;
              const cat = contact.category;
              
              const accentBorder = cat === 'repair' ? 'border-l-indigo-500' : 
                                   cat === 'daily' ? 'border-l-amber-500' : 
                                   cat === 'personal' ? 'border-l-emerald-500' : 
                                   'border-l-rose-500';

              const cardHoverClass = cat === 'repair' ? 'hover:border-indigo-300' : 
                                     cat === 'daily' ? 'hover:border-amber-300' : 
                                     cat === 'personal' ? 'hover:border-emerald-300' : 
                                     'hover:border-rose-300';
              return (
                <div 
                  key={contact.id}
                  className={`bg-white border-t border-r border-b border-l-[5px] ${accentBorder} overflow-hidden ${cardHoverClass} transition-all shadow-xs hover:shadow-md duration-150`}
                >
                  {isPending && (
                    <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-amber-800">
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle size={12} className="text-amber-600 shrink-0" />
                        {TRANSLATIONS[language]['admin.pending_approval'] || "Pending Deployer Approval"}
                      </span>
                      <span className="text-[9px] bg-amber-200/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Suggested Info
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-3 items-start">
                        {contact.image ? (
                          <img 
                            src={contact.image} 
                            alt={contact.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm mt-0.5 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
                            onClick={() => setExpandedImage(contact.image)}
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-xl shrink-0 border mt-0.5 flex items-center justify-center font-black text-xs shadow-xs ${
                            cat === 'repair' ? 'bg-indigo-50 border-indigo-150 text-indigo-755' :
                            cat === 'daily' ? 'bg-amber-50 border-amber-150 text-amber-755' :
                            cat === 'personal' ? 'bg-emerald-50 border-emerald-150 text-emerald-755' :
                            'bg-rose-50 border-rose-150 text-rose-755'
                          }`}>
                            {contact.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-black text-sm text-slate-800 leading-tight">{contact.name}</h4>
                            {contact.isVerified && (
                              <span className="inline-flex items-center text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 py-0.5 px-2 rounded-md">
                                <CheckCircle2 size={11} className="mr-0.5 fill-emerald-500 text-white" />
                                {language === 'mr' ? 'प्रमाणित' : 'Verified'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-650 mt-1 block">
                            {TRANSLATIONS[language][contact.subcategory] || contact.subcategory}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => onEndorse(contact.id)}
                        className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 px-3 py-1 rounded-lg text-xs font-black transition-all border border-rose-100 cursor-pointer"
                      >
                        <Heart size={11} className="fill-rose-500 stroke-none" />
                        <span>{contact.endorsements}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-650 mt-2 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                      {translateDataValue(contact.details, language) || TRANSLATIONS[language]['card.noreviews']}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-550 mt-2.5 font-bold border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500 stroke-none" />
                        <span className="font-bold text-slate-700">{contact.rating}</span>
                        <span className="text-[10px]">({contact.ratingsCount})</span>
                      </div>
                      <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {translateDataValue(contact.hours || 'Varies', language)}
                      </span>
                    </div>
                  </div>

                  {/* Direct quick operations */}
                  <div className="bg-slate-50 border-t border-slate-150 p-2 flex gap-2">
                    <div 
                      className="flex-1 bg-slate-100 text-slate-800 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 uppercase tracking-wider border border-slate-200"
                    >
                      <Phone size={13} className="text-slate-500" />
                      <span className="text-xs font-mono">{contact.phone}</span>
                    </div>
                  </div>

                  {/* Deployer actions */}
                  {role === 'deployer' && (
                    <div className="bg-slate-100 border-t border-slate-200 p-2 flex gap-2">
                      {isPending && (
                        <button 
                          onClick={() => onApproveContact?.(contact.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                        >
                          <CheckCircle size={11} className="fill-white text-emerald-600 mr-0.5" />
                          <span>{TRANSLATIONS[language]['admin.btn_approve'] || "Verify Contact"}</span>
                        </button>
                      )}
                      <button 
                        onClick={() => onEditContact?.(contact)}
                        className="flex-1 bg-white border border-slate-200 text-slate-700 font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 hover:bg-slate-50 cursor-pointer transition-all hover:border-slate-300"
                      >
                        <SlidersHorizontal size={11} className="text-slate-500 mr-0.5" />
                        <span>{TRANSLATIONS[language]['admin.btn_edit'] || "Edit Info"}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
        {expandedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md cursor-pointer"
            onClick={() => setExpandedImage(null)}
          >
            ✕ Close View
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={expandedImage} alt="Expanded view" className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
