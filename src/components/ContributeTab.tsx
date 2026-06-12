import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, User, Phone, PhoneCall, Layers, FileText, Gift, Heart, HelpCircle, Star, ArrowRight } from 'lucide-react';
import { Contact, CategoryType } from '../types';
import { Language, TRANSLATIONS, translateDataValue } from '../localization';

interface ContributeTabProps {
  onAddContact: (contact: Omit<Contact, 'id' | 'rating' | 'ratingsCount' | 'endorsements' | 'reviews' | 'isVerified'>) => void;
  userSuggestedContacts: Contact[];
  onEndorse: (id: string) => void;
  language: Language;
}

export default function ContributeTab({
  onAddContact,
  userSuggestedContacts,
  onEndorse,
  language
}: ContributeTabProps) {
  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('repair');
  const [subcategory, setSubcategory] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [hours, setHours] = useState('9:00 AM - 8:00 PM');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  const [image, setImage] = useState('');

  // Status flags
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added submission state

  // File to base64 conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Subcategory suggestions depending on Category
  const subcategorySuggestions: { [key in CategoryType]?: string[] } = {
    'repair': ['Plumber', 'Electrician', 'Carpenter', 'Appliance Repair', 'Pest Control', 'Gas & LPG Repair'],
    'daily': ['Grocery Shop', 'Medical/Pharmacy Store', 'Dairy & Milk Supply', 'Bakery', 'Vegetable Vendor', 'General Store'],
    'personal': ['Beauty Parlour', 'Barber', 'Laundry & Dhobi', 'Maid & Housekeeping', 'Home Helpers', 'Pet Care', 'Car Wash', 'Raddiwala (Scrap)']
  };

  // Changed to an async submission lock handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subcategory.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Wait for the parent Firestore operation to finish saving
      await onAddContact({
        name,
        category,
        subcategory,
        phone,
        whatsapp: whatsapp || undefined,
        hours,
        address: address || undefined,
        details: details || `Provider of ${subcategory} services in our block. Contact for appointments.`,
        whatsappEnabled: !!whatsapp,
        isUserSuggested: true,
        image: image || undefined
      });

      // Reset Form fields cleanly
      setName('');
      setSubcategory('');
      setPhone('');
      setWhatsapp('');
      setAddress('');
      setDetails('');
      setImage('');
      setIsSuccess(true);

      // Auto dismiss congratulations after 5 sec
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error("Form submission encountered an error: ", err);
    } finally {
      setIsSubmitting(false); // Release lockout
    }
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Intro details */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
        <h2 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5 animate-pulse">
          <PlusCircle size={16} className="text-indigo-600" />
          {TRANSLATIONS[language]['contrib.title'] || "Suggest a Local Contact"}
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
          {TRANSLATIONS[language]['contrib.desc'] || "Crowdsource the neighborhood directory! Add trusted helpers, shops, or nearby landmarks."}
        </p>
      </div>

      {/* Success banner alert */}
      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 text-emerald-900 animate-in zoom-in-95 duration-200 shadow-sm">
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-100 stroke-1.5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-xs">
                {TRANSLATIONS[language]['contrib.saved_title'] || "Contact Saved Successfully!"}
              </h4>
              <p className="text-[11px] text-emerald-700/90 leading-relaxed mt-0.5 font-medium">
                {TRANSLATIONS[language]['contrib.saved_desc'] || "Saved into the local database."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-5 py-4.5 border-b border-slate-150">
          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700">
            {TRANSLATIONS[language]['contrib.form_header'] || "Service Registration Form"}
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              {TRANSLATIONS[language]['contrib.label_name'] || "Provider or Shop Name *"}
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Plumbing Solutions"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                {TRANSLATIONS[language]['contrib.label_cat'] || "Category Type *"}
              </label>
              <select 
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as CategoryType);
                  setSubcategory('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="repair">🛠️ {TRANSLATIONS[language]['cat.repair'] || "Repair & Fix"}</option>
                <option value="daily">🛒 {TRANSLATIONS[language]['cat.daily'] || "Daily Shops"}</option>
                <option value="personal">💇 {TRANSLATIONS[language]['cat.personal'] || "Lifestyle & Home"}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                {TRANSLATIONS[language]['contrib.label_subcat'] || "Subcategory Line *"}
              </label>
              <input 
                type="text"
                required
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Plumber, Grocery Shop"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Quick chip suggestions of matching subcategory line */}
          {subcategorySuggestions[category] && (
            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">
                {TRANSLATIONS[language]['search.try_label'] || "Try:"}
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {subcategorySuggestions[category]!.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSubcategory(item)}
                    className={`text-[9.5px] py-1 px-2.5 rounded-full border transition-all font-bold cursor-pointer ${
                      subcategory === item 
                        ? 'bg-indigo-600 text-white border-transparent shadow-sm' 
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {TRANSLATIONS[language][item] || item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                {TRANSLATIONS[language]['contrib.label_phone'] || "Phone Number *"}
              </label>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 99999 12345"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                {TRANSLATIONS[language]['contrib.label_whatsapp'] || "WhatsApp (Optional)"}
              </label>
              <input 
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. Same as Phone"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              {TRANSLATIONS[language]['contrib.label_hours'] || "Working Timing Hours"}
            </label>
            <input 
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 9:00 AM - 8:00 PM"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              {TRANSLATIONS[language]['contrib.label_address'] || "Address / Shop Location (Optional)"}
            </label>
            <input 
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Shop 42, Block C, Main High Street"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              {language === 'mr' ? 'फोटो जोडा (पर्यायी)' : 'Add Photo of Shop / Person (Optional)'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                  {language === 'mr' ? 'फाँईल निवडा' : 'Option A: Choose Image File'}
                </span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:uppercase file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                  {language === 'mr' ? 'किंवा फोटो URL टाका' : 'Option B: Paste Image URL'}
                </span>
                <input 
                  type="text"
                  value={image.startsWith('data:') ? '' : image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            {image && (
              <div className="mt-2 flex items-center space-x-3 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 inline-flex animate-in zoom-in-95 duration-150">
                <img 
                  src={image} 
                  alt="Shop Preview" 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover border border-indigo-200"
                />
                <div className="pr-2 text-left">
                  <span className="text-[9px] text-indigo-700 font-black block uppercase tracking-widest">{language === 'mr' ? 'फोटो उपलब्ध' : 'Photo Loaded'}</span>
                  <button 
                    type="button" 
                    onClick={() => setImage('')}
                    className="text-[9px] text-red-500 font-black underline hover:text-red-700 shrink-0 cursor-pointer"
                  >
                    {language === 'mr' ? 'काढून टाका' : 'Remove Photo'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              {TRANSLATIONS[language]['contrib.label_details'] || "Notes / Specialities (Optional)"}
            </label>
            <textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Expert leaks specialist. Restores supply lines quickly."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Updated Button to follow submission states */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest transition-colors shadow-sm mt-2 flex items-center justify-center space-x-1.5 ${
              isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 cursor-pointer'
            }`}
          >
            <span>
              {isSubmitting 
                ? (language === 'mr' ? 'नोंदणी होत आहे...' : 'Registering...') 
                : (TRANSLATIONS[language]['contrib.submit'] || "Register Contact Suggested info")}
            </span>
            {!isSubmitting && <ArrowRight size={13} />}
          </button>

        </form>
      </div>

      {/* User Contributions List */}
      <div className="space-y-2.5">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {TRANSLATIONS[language]['contrib.recent_title'] || "Recent Neighborhood Submissions"} ({userSuggestedContacts.length})
        </h3>

        {userSuggestedContacts.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-center text-xs text-slate-400 font-bold leading-relaxed italic">
            {TRANSLATIONS[language]['contrib.recent_empty'] || "No contacts suggested yet. Try adding one above to see them live!"}
          </div>
        ) : (
          <div className="space-y-2">
            {userSuggestedContacts.map((contact) => (
              <div 
                key={contact.id}
                className="bg-white rounded-3xl p-4 border border-slate-200 flex justify-between items-start hover:border-indigo-300 transition-colors shadow-sm animate-in fade-in duration-150"
              >
                <div className="flex gap-2.5 items-start">
                  {contact.image && (
                    <img 
                      src={contact.image} 
                      alt={contact.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs mt-0.5"
                    />
                  )}
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800">{contact.name}</h4>
                    <div className="flex flex-wrap gap-1.5 items-center mt-1">
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold tracking-widest uppercase py-0.5 px-2 rounded-md inline-block">
                        {TRANSLATIONS[language][contact.subcategory] || contact.subcategory}
                      </span>
                      {contact.isPendingApproval ? (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/50 py-0.5 px-1.5 rounded-md flex items-center gap-0.5">
                          <span className="inline-block w-1 h-1 rounded-full bg-amber-500 animate-pulse shrink-0" />
                          {TRANSLATIONS[language]['admin.pending_approval'] || "Pending Approval"}
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/50 py-0.5 px-1.5 rounded-md flex items-center gap-0.5">
                          <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                          {TRANSLATIONS[language]['admin.verified_live'] || "Verified & Live"}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-slate-500 mt-2 font-semibold">
                      <span className="block font-mono">📞 {contact.phone}</span>
                      {contact.address && <span className="block mt-0.5">📍 Loc: {translateDataValue(contact.address, language)}</span>}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onEndorse(contact.id)}
                  className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all border border-rose-100 cursor-pointer shrink-0"
                >
                  <Heart size={10} className="fill-rose-500 stroke-none" />
                  <span>{contact.endorsements}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}