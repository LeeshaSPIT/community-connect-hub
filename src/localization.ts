// Localization dictionary for English and Marathi languages
export type Language = 'en' | 'mr';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Global Header
    'app.title': 'Community Connect',
    'app.subtitle': 'Centralized Neighborhood Directory & Emergency Helpline',
    'app.badge': 'Hub',
    'nav.directory': 'Dashboard Directory',
    'nav.filter': 'Universal Filter',
    'nav.suggest': 'Suggest Provider',
    'nav.role_label': 'Select Role:',
    'nav.role_resident': 'Resident',
    'nav.role_deployer': 'Deployer',
    'admin.pending_approval': 'Pending Deployer Approval',
    'admin.verified_live': 'Verified & Live',
    'admin.btn_approve': 'Verify Contact',
    'admin.btn_edit': 'Edit Contact',
    'admin.modal_title': 'Edit Service Provider Contact',
    'admin.label_name': 'Shop / Professional Name',
    'admin.label_phone': 'Direct Phone Contact',
    'admin.label_hours': 'Operating Timing Hours',
    'admin.label_address': 'Shop Location Address',
    'admin.label_details': 'Specialities or Highlights',
    'admin.save': 'Save Changes',
    'location.active': 'Active Base Location',
    'location.switch': 'Switch Area',
    'location.always_offline': 'Always available offline • LocalStorage Client Cache Enabled',
    'location.serving': 'Serving blocks & complexes across',

    // Switch Area dialog
    'switch.title': 'Switch Connected Area',
    'switch.desc': 'Tailors search outputs, nearest providers, and local emergency helper panels tailored specifically for your block.',
    'switch.label_society': 'Society or Residential Block Name',
    'switch.label_pincode': 'Local Postal Pincode / Area Code',
    'switch.cancel': 'Cancel',
    'switch.apply': 'Apply Location',

    // Dashboard Info banner
    'info.title': 'Parsik Nagar Directory',
    'info.desc': 'Browse reliable service contacts verified by your neighbors. Always accessible offline.',
    'info.stat_contacts': 'Local Contacts',
    'info.stat_verified': 'Verified Checked',

    // Main Category Pill Titles
    'cat.repair': 'Repair & Fix',
    'cat.daily': 'Daily Shops',
    'cat.personal': 'Lifestyle & Home',
    'cat.nearby': 'Nearby Places',
    'cat.emergency': 'Emergency Help',

    // Main Category Pill Subtitles
    'cat.desc.repair': 'Household maintenance & fixes',
    'cat.desc.daily': 'Groceries, medicines & needs',
    'cat.desc.personal': 'Personal support & convenience',
    'cat.desc.nearby': 'Public infrastructure & spots',
    'cat.desc.emergency': 'Helplines & safety desk',

    // Subcategories Titles
    'sub.available': 'Available Sub-Services',
    'sub.lines': 'Lines',
    'sub.listed': 'listed',
    'sub.back': 'Back to Categories',

    // Subcategory mappings as listed
    'Plumber': 'Plumber',
    'Electrician': 'Electrician',
    'Carpenter': 'Carpenter',
    'Appliance Repair': 'Appliance Repair',
    'Pest Control': 'Pest Control',
    'Gas & LPG Repair': 'Gas & LPG Repair',
    'Grocery Shop': 'Grocery Shop',
    'Medical/Pharmacy Store': 'Medical/Pharmacy Store',
    'Dairy & Milk Supply': 'Dairy & Milk Supply',
    'Bakery': 'Bakery',
    'Vegetable Vendor': 'Vegetable Vendor',
    'Beauty Parlour': 'Beauty Parlour',
    'Barber': 'Barber',
    'Laundry & Dhobi': 'Laundry & Dhobi',
    'Maid & Housekeeping': 'Maid & Housekeeping',
    'Car Wash': 'Car Wash',
    'Raddiwala (Scrap)': 'Raddiwala (Scrap)',
    'ATM': 'ATM',
    'Post Office': 'Post Office',
    'Banks': 'Banks',
    'Transport Hub': 'Transport Hub',
    'Parks & Recreation': 'Parks & Recreation',
    'Schools & Coaching': 'Schools & Coaching',
    'Police': 'Police',
    'Hospital': 'Hospital',
    'Fire Brigade': 'Fire Brigade',
    "Women's Helpline": "Women's Helpline",
    'Child Helpline': 'Child Helpline',
    'Society Watch & Utilities': 'Society Watch & Utilities',
    'Home Helpers': 'Home Helpers',
    'Pet Care': 'Pet Care',

    // Card Actions & Statuses
    'card.verified': 'Verified',
    'card.suggested': 'Suggested',
    'card.hours': 'Hours',
    'card.away': 'away',
    'card.call': 'Call Now',
    'card.whatsapp': 'WhatsApp',
    'card.noreviews': 'No written reviews yet. Be the first to express your endorsement!',
    'card.addreview_btn': '+ Add Neighbor Endorsement Review',
    'card.new_endorsement': 'New Endorsement',
    'card.cancel': 'Cancel',
    'card.label_name': 'Your Name',
    'card.label_flat': 'Your Flat / Block',
    'card.label_stars': 'Stars',
    'card.label_comment': 'Your Feedback Comments',
    'card.comment_placeholder': 'How was their work? Punctual, neat, honest pricing?',
    'card.submit': 'Publish Endorsement Feedback',

    // Search Tab
    'search.box_p': 'Search plumbers, groceries, medicine helplines, ATMs...',
    'search.found': 'matching directory providers',
    'search.no_match': 'No matches found',
    'search.no_match_tip': 'Try widening your query. Search with keywords like "leak", "power", "medicine", or "milk" to discover active neighbors.',
    'search.quick_tags': 'Quick Filter Tags',

    // Contribute Tab
    'contrib.form_header': 'Suggest a Local Contact',
    'contrib.form_desc': 'Crowdsource the neighborhood directory! Add your trusted plumbers, milkmen, laundry, or nearby ATMs to help other residents access reliable service instantly.',
    'contrib.alert_title': 'Contact Saved Successfully!',
    'contrib.alert_desc': 'Saved into the local database. Your neighbor-suggested contact is now immediately searchable inside the home directory and the Search Bar!',
    'contrib.reg_title': 'Service Registration Form',
    'contrib.label_name': 'Provider or Shop Name *',
    'contrib.placeholder_name': 'e.g. Ramesh Plumbing Solutions',
    'contrib.label_cat': 'Category Type *',
    'contrib.label_sub': 'Subcategory Line *',
    'contrib.placeholder_sub': 'e.g. Plumber, Grocery Shop',
    'contrib.quick_sug': 'Quick Suggestions:',
    'contrib.label_phone': 'Phone Number *',
    'contrib.label_wa': 'WhatsApp (Optional)',
    'contrib.label_hours': 'Working Timing Hours',
    'contrib.placeholder_hours': 'e.g. 9:00 AM - 8:00 PM',
    'contrib.label_addr': 'Address / Shop Location (Optional)',
    'contrib.placeholder_addr': 'e.g. Shop 42, Block C, Main High Street',
    'contrib.label_notes': 'Notes / Specialities (Optional)',
    'contrib.placeholder_notes': 'Describe specializations or standard rates...',
    'contrib.submit_btn': 'Register Contact Suggested info',
    'contrib.recent_title': 'Recent Neighborhood Submissions',
    'contrib.no_submission': 'No contacts suggested yet. Try adding one above to see them live!',

    // Trust banners
    'trust.header': 'Neighbor Endorsements',
    'trust.body': 'Clicking the heart next to any provider registers your endorsement. This grows trust score inside our society block! No spam permitted.',
    'trust.missing': 'Missing an essential service provider contact?',
    'trust.suggest_link': 'Suggest them in the contribution board tab ↗',

    // Dial Simulator
    'dial.simulated': 'Simulated Phone Call',
    'dial.linemode': 'Line Safe Mode',
    'dial.merchantspeaking': 'System dialing connection sound...',

    // WhatsApp Sandbox
    'wa.vendor': 'Vendor',
    'wa.typing': 'Typing...',
    'wa.today': 'Today',
    'wa.simulated_desc': 'Messages are simulated. Replies are triggered automatically.',
    'wa.placeholder': 'Type message response...',
    'wa.send': 'Send',
    'wa.welcome_msg': 'Hello, I found your contact on Community Connect. Are you available for a service?'
  },
  mr: {
    // Top Bar & Global Header
    'app.title': 'कम्युनिटी कनेक्ट',
    'app.subtitle': 'केंद्रीकृत शेजारी मार्गदर्शिका आणि आपत्कालीन हेल्पलाइन',
    'app.badge': 'हब',
    'nav.directory': 'डॅशबोर्ड मार्गदर्शिका',
    'nav.filter': 'सार्वत्रिक शोध',
    'nav.suggest': 'सेवा सुचवा',
    'nav.role_label': 'भूमिका निवडा:',
    'nav.role_resident': 'रहिवासी',
    'nav.role_deployer': 'डॅशबोर्ड व्यवस्थापक',
    'admin.pending_approval': 'मंजुरी प्रलंबित',
    'admin.verified_live': 'प्रमाणित आणि थेट सुरू',
    'admin.btn_approve': 'प्रमाणित करा',
    'admin.btn_edit': 'माहिती बदला',
    'admin.modal_title': 'सेवा प्रदाता संपर्क सुधारा',
    'admin.label_name': 'दुकान / प्रदात्याचे नाव',
    'admin.label_phone': 'थेट फोन संपर्क',
    'admin.label_hours': 'कामाची वेळ / तास',
    'admin.label_address': 'दुकानाचा पत्ता',
    'admin.label_details': 'टिप्पण्या / वैशिष्ट्ये',
    'admin.save': 'बदल जतन करा',
    'location.active': 'सक्रिय स्थान',
    'location.switch': 'परिसर बदला',
    'location.always_offline': 'नेहमी ऑफलाइन उपलब्ध • लोकल डेटा सेव्ह सुरू आहे',
    'location.serving': 'ब्लॉक्स आणि संकुलांसाठी कार्यरत परिसर:',

    // Switch Area dialog
    'switch.title': 'परिसर बदला',
    'switch.desc': 'तुमच्या ब्लॉकसाठी आणि परिसरासाठी योग्य शोध परिणाम, जवळचे प्रदाते आणि आपत्कालीन सेवा तयार करते.',
    'switch.label_society': 'सोसायटी किंवा निवासी ब्लॉकचे नाव',
    'switch.label_pincode': 'स्थानिक पिनकोड / एरिया कोड',
    'switch.cancel': 'रद्द करा',
    'switch.apply': 'स्थान लागू करा',

    // Dashboard Info banner
    'info.title': 'पारसिक नगर मार्गदर्शिका',
    'info.desc': 'तुमच्या शेजाऱ्यांनी प्रमाणित केलेल्या विश्वसनीय सेवा संपर्क पहा. नेहमी ऑफलाइन उपलब्ध.',
    'info.stat_contacts': 'स्थानिक संपर्क',
    'info.stat_verified': 'प्रमाणित सेवा',

    // Main Category Pill Titles
    'cat.repair': 'दुरुस्ती आणि फिक्स',
    'cat.daily': 'दैनंदिन दुकाने',
    'cat.personal': 'जीवनशैली आणि घर',
    'cat.nearby': 'जवळची ठिकाणे',
    'cat.emergency': 'आपत्कालीन मदत',

    // Main Category Pill Subtitles
    'cat.desc.repair': 'घरगुती देखभाल आणि दुरुस्ती',
    'cat.desc.daily': 'किराणा, औषधे आणि गरजा',
    'cat.desc.personal': 'वैयक्तिक मदत आणि सोय',
    'cat.desc.nearby': 'सार्वजनिक पायाभूत सुविधा व जागा',
    'cat.desc.emergency': 'हेल्पलाइन आणि सुरक्षा डेस्क',

    // Subcategories Titles
    'sub.available': 'उपलब्ध उप-सेवा',
    'sub.lines': 'सेवा प्रकार',
    'sub.listed': 'प्रदाते सूचीबद्ध',
    'sub.back': 'वर्गांवर परत जा',

    // Subcategory mappings as listed (translated titles shown when MR selected)
    'Plumber': 'प्लंबर (नळदुरुस्तकार)',
    'Electrician': 'इलेक्ट्रिशियन (वीजतंत्री)',
    'Carpenter': 'सुतार (कारपेन्टर)',
    'Appliance Repair': 'घरगुती उपकरणे दुरुस्ती',
    'Pest Control': 'कीटक नियंत्रण (पेस्ट कंट्रोल)',
    'Gas & LPG Repair': 'गॅस आणि एलपीजी दुरुस्ती',
    'Grocery Shop': 'किराणा दुकान',
    'Medical/Pharmacy Store': 'औषध / फार्मसी दुकान',
    'Dairy & Milk Supply': 'डेअरी आणि दूध पुरवठा',
    'Bakery': 'बेकरी दुकान',
    'Vegetable Vendor': 'भाजीपाला विक्रेता',
    'Beauty Parlour': 'ब्युटी पार्लर',
    'Barber': 'न्हावी (सलून)',
    'Laundry & Dhobi': 'लाँड्री आणि धोबी',
    'Maid & Housekeeping': 'घरकाम मदतनीस',
    'Car Wash': 'कार वॉश आणि क्लीन',
    'Raddiwala (Scrap)': 'रद्दीवाला (भंगार)',
    'ATM': 'एटीएम (ATM)',
    'Post Office': 'पोस्ट ऑफिस',
    'Banks': 'बँक आणि वित्तीय संस्था',
    'Transport Hub': 'वाहतूक केंद्र / स्थानक',
    'Parks & Recreation': 'उद्याने आणि मनोरंजन',
    'Schools & Coaching': 'शाळा आणि कोचिंग',
    'Police': 'पोलीस (Police)',
    'Hospital': 'रुग्णालय (Hospital)',
    'Fire Brigade': 'अग्निशामक दल (Fire Brigade)',
    "Women's Helpline": "महिला हेल्पलाइन (Women's Helpline)",
    'Child Helpline': 'बाल सुरक्षा हेल्पलाइन (Child Helpline)',
    'Society Watch & Utilities': 'सोसायटी वॉच आणि युक्त्या',
    'Home Helpers': 'घरगुती मदतनीस (Home Helpers)',
    'Pet Care': 'प्राणी काळजी सेवा (Pet Care)',

    // Card Actions & Statuses
    'card.verified': 'प्रमाणित',
    'card.suggested': 'सुचवलेले',
    'card.hours': 'वेळ',
    'card.away': 'दूर',
    'card.call': 'कॉल करा',
    'card.whatsapp': 'व्हॉट्सॲप',
    'card.noreviews': 'अद्याप युझर पुनरावलोकने नाहीत. अभिप्राय देणारे पहिले व्हा!',
    'card.addreview_btn': '+ नवीन शेजारी पुनरावलोकन जोडा',
    'card.new_endorsement': 'नवीन शिफारस',
    'card.cancel': 'रद्द करा',
    'card.label_name': 'तुमचे नाव',
    'card.label_flat': 'तुमचा फ्लॅट / ब्लॉक',
    'card.label_stars': 'तारे (रेटिंग)',
    'card.label_comment': 'तुमचा अभिप्राय टिप्पणी',
    'card.comment_placeholder': 'त्यांचे काम कसे होते? वेळेवर, स्वच्छ, वाजवी दर?',
    'card.submit': 'अभिप्राय प्रकाशित करा',

    // Search Tab
    'search.box_p': 'प्लंबर्स, किराणा सामान, औषध हेल्पलाइन, एटीएम शोधा...',
    'search.found': 'प्रदाते सापडले',
    'search.no_match': 'जुळणारे संपर्क सापडले नाहीत',
    'search.no_match_tip': 'तुमचा शोध शब्द बदला. "leak", "power", "medicine", किंवा "milk" यासारखे रंजक शब्द वापरून पहा.',
    'search.quick_tags': 'त्वरित फिल्टर टॅग्ज',

    // Contribute Tab
    'contrib.form_header': 'स्थानिक संपर्क सुचवा',
    'contrib.form_desc': 'परिसर आणि सोसायटी मार्गदर्शिका समृद्ध करा! तुमच्या विश्वासातील प्लंबर, दूधवाले, लाँड्री किंवा जवळील एटीएम जोडून इतर रहिवाशांना त्वरित मदत करा.',
    'contrib.alert_title': 'संपर्क यशस्वीरित्या जतन केला!',
    'contrib.alert_desc': 'स्थानिक डेटाबेसमध्ये माहिती यशस्वीरित्या सेव्ह केली आहे. आता परिसर मार्गदर्शिका आणि सर्च बारमध्ये हा संपर्क थेट शोधता येईल!',
    'contrib.reg_title': 'सेवा नोंदणी फॉर्म (सुझाव)',
    'contrib.label_name': 'प्रदाता किंवा दुकानाचे नाव *',
    'contrib.placeholder_name': 'उदा. रमेश प्लंबिंग सोल्यूशन्स',
    'contrib.label_cat': 'श्रेणी प्रकार *',
    'contrib.label_sub': 'उपश्रेणी प्रकार *',
    'contrib.placeholder_sub': 'उदा. Plumber, Grocery Shop',
    'contrib.quick_sug': 'त्वरित पर्याय:',
    'contrib.label_phone': 'फोन नंबर *',
    'contrib.label_wa': 'व्हॉट्सॲप नंबर (पर्यायी)',
    'contrib.label_hours': 'कामाची वेळ / तास',
    'contrib.placeholder_hours': 'उदा. सकाळी ९:०० - रात्री ८:००',
    'contrib.label_addr': 'पत्ता / दुकानाचे ठिकाण (पर्यायी)',
    'contrib.placeholder_addr': 'उदा. शॉप ४२, ब्लॉक सी, मेन हाय स्ट्रीट',
    'contrib.label_notes': 'टिप्पण्या / वैशिष्ट्ये (पर्यायी)',
    'contrib.placeholder_notes': 'उदा. विशिष्ट तंत्रज्ञ, वाजवी दर, जलद काम...',
    'contrib.submit_btn': 'सुचवलेली संपर्क माहिती जतन करा',
    'contrib.recent_title': 'अलीकडील शेजारील योगदान आणि सुचवलेले प्रदाते',
    'contrib.no_submission': 'अद्याप कोणतेही संपर्क सुचवले नाहीत. थेट पाहण्यासाठी वरील फॉर्ममध्ये एक जोडून पहा!',

    // Trust banners
    'trust.header': 'शेजाऱ्यांची मान्यता',
    'trust.body': 'कोणत्याही प्रदात्याच्या शेजारील हार्टवर क्लिक केल्यास तुमची मान्यता नोंदवली जाते. यामुळे आमच्या सोसायटी ब्लॉक मधील विश्वासाचा गुणांक वाढतो!',
    'trust.missing': 'महत्त्वाचे सेवा प्रदाता संपर्क सापडले नाहीत?',
    'trust.suggest_link': 'योगदान बोर्ड टॅबमध्ये त्यांना सुचवा ↗',

    // Dial Simulator
    'dial.simulated': 'सिम्युलेटेड फोन कॉल संपर्क',
    'dial.linemode': 'लाइन संपर्क मोड',
    'dial.merchantspeaking': 'प्रणाली संपर्क रिंग वाजवत आहे...',

    // WhatsApp Sandbox
    'wa.vendor': 'प्रदाता / व्हेंडर',
    'wa.typing': 'टाईपिंग...',
    'wa.today': 'आज',
    'wa.simulated_desc': 'हे संदेश सिम्युलेटेड आहेत. उत्तरे स्वयंचलितपणे ट्रिगर केली जातात.',
    'wa.placeholder': 'संदेश टाईप करा...',
    'wa.send': 'पाठवा',
    'wa.welcome_msg': 'नमस्कार, मी कम्युनिटी कनेक्टवर आपली संपर्क माहिती शोधली. आपण सेवेसाठी उपलब्ध आहात का?'
  }
};

// Simple helper to translate dynamic values like details or hours when switched to Marathi
export function translateDataValue(text: string | undefined, lang: Language): string {
  if (!text) return '';
  if (lang === 'en') return text;

  // Let's create an elegant mapping dictionary for common words used in descriptions, details and addresses
  const matchMap: Record<string, string> = {
    'Expert in leak fixing, bathroom fitting renovations, and high pressure pump installation.': 'गळती दुरुस्ती, बाथरूम फिटिंग नूतनीकरण आणि हाय प्रेशर पंप बसवण्यात तज्ञ.',
    'Inverter setups, short circuits, fan repairs, and house wiring wizard.': 'इन्व्हर्टर सेटअप, शॉर्ट सर्किट, पंखा दुरुस्ती आणि घरगुती वायरिंग तज्ञ.',
    'Door fittings, sunmica woodwork, sofa repair, furniture custom assembly.': 'दारांचे फिटिंग, सनमायका लाकूडकाम, सोफा दुरुस्ती आणि सानुकूल फर्निचर जोडणी.',
    'Specialist in AC servicing, PCB repairs, washing machines, and refrigerator gas refilling.': 'एसी सर्व्हिसिंग, पीसीबी दुरुस्ती, वॉशिंग मशीन आणि रेफ्रिजरेटर गॅस रिफिलिंगचे तज्ञ.',
    'Odourless herbal gel treatments for cockroaches, bedbugs & anti-termite operations.': 'झुरळे, ढेकुण नियंत्रण आणि वाळवी प्रतिबंधक वासाशिवाय हर्बल जेल उपचार.',
    'Dealing with stove repairs, yellow flame issues, gas pipe assembly, and regulator checks.': 'गॅस शेगडी दुरुस्ती, पिवळ्या ज्योतीची समस्या, गॅस पाईप आणि रेग्युलेटर तपासणी.',
    'Wide range of fresh veggies, spices, daily groceries, and organic products. Free home delivery above ₹300.': 'ताजी भाजीपाला, मसाले, किराणा आणि सेंद्रिय उत्पादने. ३०० रुपयांच्या वर मोफत होम डिलिव्हरी.',
    'Full range of prescription medicines, baby care products, health tests, and emergency oxygen. They deliver meds on WhatsApp order.': 'सर्व प्रकारची लिहून दिलेली औषधे, लहान मुलांचे साहित्य आणि आपत्कालीन ऑक्सिजन. व्हॉट्सॲप ऑर्डरवर औषध पुरवठा.',
    'Fresh cow milk, thick buffalo curd, freshly made Paneer, butter, and ghee delivered to doorsteps directly before 7:00 AM.': 'ताजे गाईचे दूध, घट्ट म्हशीचे दही, मऊ पनीर, लोणी आणि तूप सकाळी ७:०० पूर्वी थेट दारात पोहोचवले जाईल.',
    'Freshly baked multigrain bread, customised birthday cakes, pastries, tea rusks, and dry snacks.': 'ताजे भाजलेले मल्टीग्रेन ब्रेड, सानुकूलित वाढदिवस केक, पेस्ट्री आणि सुके स्नॅक्स.',
    'Directly sourced seasonal vegetables and exotic fruits. Cheap price and fair weights.': 'थेट शेतातून उत्पादित केलेली विलायती फळे आणि हंगामी भाज्या. स्वस्त दर आणि योग्य वजन.',
    'Specialized women facial treatments, herbal hair spa, bridal makeup, wax, and nail art. Home service available on request!': 'महिलांसाठी खास फेशिअल उपचार, हर्बल हेअर स्पा, नवरीचा मेकअप आणि नेल आर्ट. विनंतीनुसार घरी सेवा उपलब्ध!',
    'Professional men hair styling, shaving, organic face scrubs, and relaxing head massages.': 'पुरुषांची हेअर स्टाईलिंग, दाढी, सेंद्रिय फेस स्क्रब आणि डोक्याची रिलॅक्सिंग मसाज.',
    'Wash, steam pressing, dry cleaning of blankets, suits and delicate ethnic wear. Express 24-hr delivery available.': 'धुलाई, स्टीम प्रेस, ब्लँकेट्स व सुट्सचे ड्राय क्लीनिंग. २४ तासात जलद सेवा उपलब्ध.',
    'Full-service cleaning, dusting, bathroom deep scrubbing, kitchen chimney de-greasing, and balcony washing.': 'संपूर्ण घर साफसफाई, धुळीचे नियंत्रण, बाथरूम घासणे, चिमणी ग्रीस स्वच्छता आणि बाल्कनी धुलाई.',
    'Eco-friendly waterless foam cleaning, dashboard polishing, vacuuming, and tire shine at your parking slot.': 'पर्यावरणपूरक सुके फोम क्लीनिंग, डॅशबोर्ड पॉलिशिंग आणि पार्किंग स्लॉटमध्ये टायर चमकवणे.',
    'Newspaper buying, heavy cardboard piles, plastic containers, and iron scrap bought by weight with digital scales.': 'वृत्तपत्र खरेदी, पुठ्ठा, प्लास्टिकचे डबे आणि लोखंडी स्क्रॅप डिजिटल वजन काट्याने योग्य वजनानुसार खरेदी.',
    'Equipped with 3 active cash-dispensing kiosks (SBI, HDFC, ICICI). Secure guard present inside.': '३ सक्रिय कॅश एटीएम मशीन (SBI, HDFC, ICICI) उपलब्ध. आत सुरक्षित रक्षक कार्यरत.',
    'Speed post dispatch, registered letters, courier stamps, manual bill deposits, and saving scheme forms.': 'स्पीड पोस्ट सेवा, नोंदणीकृत पत्रे, कुरिअर स्टॅम्प आणि बचत योजना फॉर्म.',
    'Serving blocks & complexes across': 'ब्लॉक्स आणि संकुलांसाठी कार्यरत क्षेत्र:',
    'Always available offline • LocalStorage Client Cache Enabled': 'नेहमी ऑफलाइन उपलब्ध • लोकल डेटा सेव्ह सुरू आहे',
    'National emergency standard line for immediate safety & rescue.': 'त्वरित सुरक्षा आणि सुटकेसाठी राष्ट्रीय आपत्कालीन मानक लाइन क्रमांक.',
    'Direct desk line of the nearest police post at Sector 4 junction.': 'सेक्टर ४ जंक्शन चौकीच्या सर्वात जवळच्या पोलीस पोस्टची थेट डेस्क लाईन.',
    'Primary rapid medical dispatch command desk for cardiac & trauma care.': 'हृदय आणि अपघात उपचारासाठी मुख्य वैद्यकीय प्रेषण कमांड डेस्क.',
    'Fully equipped critical care unit, trauma surgeons and ICU. 24/7.': 'पूर्णपणे सुसज्ज गंभीर काळजी युनिट, अपघात तज्ञ आणि आयसीयू २४ तास उपलब्ध.',
    'Rapid response fire protection, engine dispatch and gas emergencies.': 'त्वरित अग्निशमन यंत्रणा, इंजिन प्रेषण आणि गॅस गळती आपत्कालीन नियंत्रण.',
    'Intercom Line 99 - Main gate watchtower, parking controls and visitor verify.': 'इंटरकॉम लाइन ९९ - मुख्य गेट वॉचटावर, पार्किंग नियंत्रण आणि अभ्यागत पडताळणी.',
    'Plumbing office control for emergency tanker orders during pipeline bursts.': 'पाईपलाईन फुटल्यास आपत्कालीन पाणी टँकर मागवण्यासाठी प्लंबिंग केंद्र.',
    'Toll-free supply restoration and transformer explosion reports.': 'मोफत वीज पुरवठा पुनर्संचयित करणे आणि ट्रान्सफॉर्मर स्फोट अहवाल नोंदणी केंद्र.',
    'Fixed a major sink leak in 15 mins. Highly recommended!': '१५ मिनिटांत सिंकची मोठी गळती दुरुस्त केली. अत्यंत शिफारसीय!',
    'Punctual and charged the standard rate. Very professional.': 'वेळेचे पक्के आणि प्रमाणित शुल्क आकारले. खूप व्यावसायिक.',
    'Restored power at midnight. Absolute lifesaver!': 'मध्यरात्री वीज पुरवठा सुरळीत केला. अत्यंत मोलाची मदत!',
    'Good woodwork for kitchen cabinets, but takes his time.': 'किचन कॅबिनेटसाठी चांगले लाकूडकाम केले, परंतु वेळ थोडा जास्त घेतात.',
    'Unbelievably fast home delivery. Veggies are always top fresh!': 'अकल्पनीय जलद होम डिलिव्हरी. भाज्या नेहमी खूप ताज्या असतात!',
    'Best paneer in this entire locality. Soft and pure.': 'या संपूर्ण परिसरातील सर्वोत्तम पनीर. मऊ आणि शुद्ध.',
    'Ramu kaka always gives some coriander & green chillies for free! Very sweet man.': 'रामु काका नेहमी थोडी कोथिंबीर आणि हिरवी मिरची मोफत देतात! खूप प्रेमळ माणूस आहे.',
    'Always staffed with skilled barbers. Minimal waiting time on weekdays.': 'कुशल न्हाव्यांचे स्टाफ नेहमी हजर असतात. आठवड्याच्या दिवशी खूप कमी प्रतीक्षा करावी लागते.',
    'Professional staff. Clean and hygienic tool sets used for pedicure. Devoted care.': 'व्यावसायिक कर्मचारी. पेडीक्योरसाठी स्वच्छ आणि निर्जंतुक साधनांचा वापर. सर्वोत्तम काळजी.',
    'Clean washing. Steam ironing on linen shirts is perfect here. Charges are average.': 'स्वच्छ धुलाई. सुती शर्टवर स्टीम इस्त्री उत्तम केली जाते. मध्यम दर.'
  };

  // Check direct matches
  if (matchMap[text]) {
    return matchMap[text];
  }

  // Fallback translators for hours/dist
  let cleanText = text;
  cleanText = cleanText.replace(/9:00 AM/g, 'सकाळी ९:००');
  cleanText = cleanText.replace(/8:00 PM/g, 'रात्री ८:००');
  cleanText = cleanText.replace(/8:00 AM/g, 'सकाळी ८:००');
  cleanText = cleanText.replace(/9:00 PM/g, 'रात्री ९:००');
  cleanText = cleanText.replace(/10:00 AM/g, 'सकाळी १०:००');
  cleanText = cleanText.replace(/7:30 PM/g, 'संध्याकाळी ७:३०');
  cleanText = cleanText.replace(/7:30 AM/g, 'सकाळी ७:३०');
  cleanText = cleanText.replace(/10:00 PM/g, 'रात्री १०:००');
  cleanText = cleanText.replace(/24 Hours Open/g, '२४ तास खुली');
  cleanText = cleanText.replace(/24 Hours/g, '२४ तास');
  cleanText = cleanText.replace(/Tuesday Closed/g, 'मंगळवारी बंद');
  cleanText = cleanText.replace(/Shop 12/g, 'दुकान क्र. १२');
  cleanText = cleanText.replace(/Vikas/g, 'विकास');
  cleanText = cleanText.replace(/Market/g, 'मार्केट');
  cleanText = cleanText.replace(/Sector-4/g, 'सेक्टर-४');
  cleanText = cleanText.replace(/Pocket-B/g, 'पॉकेट-बी');
  cleanText = cleanText.replace(/km/g, 'किमी');
  cleanText = cleanText.replace(/away/g, 'दूर');

  return cleanText;
}
