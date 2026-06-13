import React, { useState } from 'react';
import { Contact, Review } from '../types';
import { Language, TRANSLATIONS } from '../localization';
import {
  CheckCircle2, X, Phone, Clock, MapPin, User, Tag,
  ShieldAlert, Layers, AlertCircle, Trash2, Edit3
} from 'lucide-react';

interface ApprovalsTabProps {
  contacts: Contact[];
  onApproveContact: (id: string) => void;
  onRejectContact: (id: string) => void;
  onEditContact: (contact: Contact) => void;
  language: Language;
}

export default function ApprovalsTab({
  contacts,
  onApproveContact,
  onRejectContact,
  onEditContact,
  language
}: ApprovalsTabProps) {
  const pendingContacts = contacts.filter(c => c.isPendingApproval);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <ShieldAlert size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base tracking-tight">
                {language === 'mr' ? 'प्रलंबित मंजुरी' : 'Pending Approvals'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mr' 
                  ? 'शेजाऱ्यांनी सुचवलेले संपर्क तपासा आणि मंजूर करा'
                  : 'Review and approve contacts suggested by neighbors'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
            pendingContacts.length > 0 
              ? 'bg-red-100 text-red-600 border border-red-200' 
              : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
          }`}>
            {pendingContacts.length > 0 
              ? `${pendingContacts.length} ${language === 'mr' ? 'प्रलंबित' : 'Pending'}`
              : language === 'mr' ? 'सर्व मंजूर' : 'All Clear'}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {pendingContacts.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h3 className="font-black text-slate-800 text-base mb-2">
            {language === 'mr' ? 'कोणतेही प्रलंबित संपर्क नाहीत!' : 'No Pending Contacts!'}
          </h3>
          <p className="text-slate-400 text-sm">
            {language === 'mr' 
              ? 'सर्व सुचवलेले संपर्क तपासले गेले आहेत.'
              : 'All suggested contacts have been reviewed. Great job!'}
          </p>
        </div>
      )}

      {/* Pending Contacts List */}
      {pendingContacts.length > 0 && (
        <div className="space-y-4">
          {pendingContacts.map((contact) => (
            <div key={contact.id} className="bg-white border-2 border-amber-200 rounded-2xl overflow-hidden shadow-xs">
              
              {/* Pending Banner */}
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle size={13} className="text-amber-600" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                    {language === 'mr' ? 'मंजुरी प्रलंबित आहे' : 'Pending Deployer Approval'}
                  </span>
                </div>
                <span className="text-[10px] text-amber-500 font-semibold">
                  {language === 'mr' ? 'शेजाऱ्याने सुचवलेले' : 'Suggested by Neighbor'}
                </span>
              </div>

              {/* Contact Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      {contact.image ? (
                        <img src={contact.image} alt={contact.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-sm font-black text-slate-600">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">{contact.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {contact.subcategory}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold capitalize">
                          {contact.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-2 mb-4">
                  {contact.details && (
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <Tag size={12} className="text-slate-400 mt-0.5 shrink-0" />
                      <span>{contact.details}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone size={12} className="text-slate-400 shrink-0" />
                    <span className="font-semibold">{contact.phone}</span>
                  </div>
                  {contact.hours && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock size={12} className="text-slate-400 shrink-0" />
                      <span>{contact.hours}</span>
                    </div>
                  )}
                  {contact.address && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span>{contact.address}</span>
                    </div>
                  )}
                </div>

                {/* Review if any */}
                {contact.reviews && contact.reviews.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {language === 'mr' ? 'सबमिट नोट' : 'Submission Note'}
                    </p>
                    <p className="text-xs text-slate-600 italic">"{contact.reviews[0].comment}"</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onApproveContact(contact.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm shadow-emerald-100"
                  >
                    <CheckCircle2 size={14} />
                    {language === 'mr' ? 'मंजूर करा' : 'Approve'}
                  </button>
                  <button
                    onClick={() => onEditContact(contact)}
                    className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Edit3 size={14} />
                    {language === 'mr' ? 'संपादित करा' : 'Edit'}
                  </button>
                  <button
                    onClick={() => onRejectContact(contact.id)}
                    className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                    {language === 'mr' ? 'नाकारा' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
