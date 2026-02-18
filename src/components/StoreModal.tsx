'use client';

import { useState } from 'react';
import { Store } from '@/types';
import { X, ExternalLink, MapPin, Instagram, Clock, Tag } from 'lucide-react';
import { InstagramEmbed } from './InstagramEmbed';

interface StoreModalProps {
  store: Store;
  onClose: () => void;
}

export function StoreModal({ store, onClose }: StoreModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900">{store.name}</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Source: {store.source}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Summary / Info */}
          <div className="space-y-4">
             <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
               {store.content}
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {store.address && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                    <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">住所</p>
                      <p className="text-sm font-bold text-slate-700">{store.address}</p>
                    </div>
                  </div>
                )}
                {store.businessHours && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                    <Clock size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">営業時間</p>
                      <p className="text-sm font-bold text-slate-700">{store.businessHours}</p>
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* Instagram Embed (Task #6) */}
          {store.source === 'instagram' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <Instagram size={14} />
                Original Post
              </div>
              <InstagramEmbed url={store.sourceUrl} />
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 flex flex-col gap-3">
             <a 
               href={store.sourceUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
             >
               元投稿で詳しく見る
               <ExternalLink size={18} />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
