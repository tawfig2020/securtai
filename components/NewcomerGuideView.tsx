/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { NewcomerGuide } from '../types';
import { LightbulbIcon, ShieldIcon, GraphIcon, RocketIcon, UserIcon, LinkIcon, BuildingIcon } from './Icons';

interface Props {
  guide: NewcomerGuide | null;
  isLoading: boolean;
  fileName?: string;
}

const NewcomerGuideView: React.FC<Props> = ({ guide, isLoading, fileName }) => {
  const isCitadelRoot = fileName?.toLowerCase() === 'app.tsx' || fileName?.toLowerCase().includes('citadel');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 animate-pulse bg-[#0d1117] h-full">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-xl bg-[#161b22]" />
           <div className="h-4 bg-[#161b22] rounded w-3/4" />
        </div>
        <div className="h-32 bg-[#161b22] rounded-3xl" />
        <div className="h-40 bg-[#161b22] rounded-3xl" />
      </div>
    );
  }

  if (!guide) return (
    <div className="p-10 text-center space-y-4">
       <div className="text-[#30363d] scale-[2]"><GraphIcon /></div>
       <p className="text-[10px] font-black text-[#484f58] uppercase tracking-widest">Select a file to load Architectural Briefing</p>
    </div>
  );

  return (
    <div className={`flex flex-col h-full overflow-hidden border-l border-[#30363d] bg-[#0d1117] shadow-2xl selection:bg-[#2f81f733] transition-all duration-1000 ${
      isCitadelRoot ? 'ring-2 ring-inset ring-[#d2992222] bg-[#0d1117]' : ''
    }`}>
      <div className={`p-6 border-b border-[#30363d] flex justify-between items-center shrink-0 ${
        isCitadelRoot ? 'bg-[#d299220a]' : 'bg-[#161b22]/30'
      }`}>
        <div className={`flex items-center gap-3 ${isCitadelRoot ? 'text-[#d29922]' : 'text-[#2f81f7]'}`}>
          <div className={`p-2 rounded-xl border ${
            isCitadelRoot ? 'bg-[#d2992215] border-[#d2992233]' : 'bg-[#2f81f715] border-[#2f81f733]'
          }`}>
             {isCitadelRoot ? <BuildingIcon /> : <LightbulbIcon />}
          </div>
          <div>
             <h3 className="text-[11px] font-black uppercase tracking-widest">{isCitadelRoot ? 'Sovereign Root Briefing' : 'Peer Mentorship'}</h3>
             <p className="text-[9px] text-[#8b949e] uppercase font-bold tracking-tight">{isCitadelRoot ? 'Citadel Core Analysis' : 'Collective Memory Mode'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Role & Summary */}
        <section className="space-y-3">
          <h4 className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
            isCitadelRoot ? 'text-[#d29922]' : 'text-[#8b949e]'
          }`}>
             <LinkIcon /> High-Level Role
          </h4>
          <p className="text-[12px] text-[#c9d1d9] leading-relaxed font-medium">
             {guide.roleSummary}
          </p>
        </section>

        {/* Collective Memory: Evolution */}
        <section className={`p-5 rounded-[28px] border space-y-3 ${
          isCitadelRoot ? 'bg-[#d2992208] border-[#d2992222]' : 'bg-gradient-to-br from-[#d2992205] to-[#d2992215] border-[#d2992222]'
        }`}>
           <h4 className="text-[9px] font-black text-[#d29922] uppercase tracking-[0.2em] flex items-center gap-2">
              <UserIcon /> {isCitadelRoot ? 'Rational Invariants' : 'Collective Memory'}
           </h4>
           <p className="text-[11px] text-[#8b949e] leading-relaxed italic font-medium">
              "{guide.evolutionContext}"
           </p>
        </section>

        {/* Integration Patterns */}
        <section className="space-y-4">
          <h4 className="text-[9px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Integration Footprint</h4>
          <div className="grid gap-2">
            {guide.usagePatterns.map((p, i) => (
              <div key={i} className={`flex gap-3 items-start p-3 border rounded-2xl transition-all ${
                isCitadelRoot ? 'bg-[#161b22]/50 border-[#d2992211] hover:border-[#d2992233]' : 'bg-[#161b22]/50 border-white/5 hover:border-[#2f81f733]'
              }`}>
                 <div className={isCitadelRoot ? 'text-[#d29922]' : 'text-[#2f81f7]'}><GraphIcon /></div>
                 <span className="text-[11px] text-[#8b949e] font-medium leading-tight">{p}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Proactive Suggestions */}
        <section className="space-y-4 pt-6 border-t border-[#30363d]">
           <h4 className="text-[9px] font-black text-[#3fb950] uppercase tracking-[0.2em] flex items-center gap-2">
              <RocketIcon /> Proactive Suggestions
           </h4>
           <div className="space-y-3">
              {guide.proactiveSuggestions?.map((s, i) => (
                <div key={i} className="text-[11px] text-[#c9d1d9] p-3 bg-[#3fb9500a] border border-[#3fb95022] rounded-2xl flex gap-3 italic">
                   <span className="text-[#3fb950] font-black">→</span> {s}
                </div>
              ))}
           </div>
        </section>

        {/* Impact Warning */}
        <section className={`space-y-2 p-5 rounded-[28px] border ${
          isCitadelRoot ? 'bg-[#f8514911] border-[#f8514933]' : 'bg-[#f8514905] border-[#f8514922]'
        }`}>
           <div className="flex items-center gap-2 text-[#f85149]">
              <ShieldIcon />
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">Blast Radius Coefficient</h4>
           </div>
           <p className={`text-[11px] leading-relaxed italic ${isCitadelRoot ? 'text-white font-bold' : 'text-[#8b949e]'}`}>
             {isCitadelRoot ? `ROOT AUTHORITY BREACH: ${guide.impactSummary}` : guide.impactSummary}
           </p>
        </section>
      </div>

      <div className="p-6 border-t border-[#30363d] bg-[#161b22]/30 shrink-0">
         <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl bg-[#050505] border flex items-center justify-center ${
              isCitadelRoot ? 'text-[#d29922] border-[#d2992222]' : 'text-[#2f81f7] border-white/5'
            }`}>
               <RocketIcon />
            </div>
            <div>
               <div className="text-[10px] font-black text-white uppercase tracking-tighter">AI Mentor Ready</div>
               <div className="text-[9px] text-[#3fb950] uppercase font-black">Sync Frequency: Real-Time</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default NewcomerGuideView;
