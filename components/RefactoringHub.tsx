/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { RocketIcon, ShieldIcon, AlertIcon, CpuIcon, LinkIcon, LockIcon, ChevronRight, CheckCircleIcon, TerminalIcon } from './Icons';
import { SyntheticFix, RuleViolation } from '../types';

interface Props {
  suggestions: { violation: RuleViolation; fix?: SyntheticFix; category?: 'Security' | 'Structural' | 'Legal' }[];
  onApplyFix: (violation: RuleViolation, fix: SyntheticFix) => void;
  onGenerateFix: (violation: RuleViolation) => void;
  isProcessing: boolean;
}

const RefactoringHub: React.FC<Props> = ({ suggestions, onApplyFix, onGenerateFix, isProcessing }) => {
  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#2f81f733]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Remediation <span className="text-[#3fb950]">Hub</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">The Unified Triage Center. Priority resolution for Security, Legal, and Structural risks across the fleet.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#3fb95011] border border-[#3fb95033] px-8 py-4 rounded-[30px] flex flex-col items-end">
              <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest">Global Fix Queue</div>
              <div className="text-2xl font-black text-white italic">{suggestions.length} Tasks</div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Fix Queue */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 px-4"><TerminalIcon className="text-[#3fb950]" /> Active Triage Queue</h3>
            
            {suggestions.length === 0 ? (
               <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40 border-2 border-dashed border-[#30363d] rounded-[60px]">
                  <div className="scale-[3] text-[#30363d]"><CheckCircleIcon /></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">All logical nodes are compliant.</p>
               </div>
            ) : (
               <div className="space-y-6">
                  {suggestions.map((s, i) => (
                     <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[40px] flex flex-col gap-10 hover:border-white/10 transition-all relative group overflow-hidden shadow-2xl glass-card">
                        <div className={`absolute left-0 top-0 w-1.5 h-full ${
                          s.category === 'Security' ? 'bg-[#f85149]' : s.category === 'Legal' ? 'bg-[#d29922]' : 'bg-[#3fb950]'
                        }`}></div>
                        
                        <div className="flex flex-col lg:flex-row gap-10">
                           <div className="lg:w-1/3 space-y-4 text-left">
                              <div className="flex items-center gap-3">
                                 <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                                    s.category === 'Security' ? 'text-[#f85149] bg-[#f8514911] border-[#f8514922]' :
                                    s.category === 'Legal' ? 'text-[#d29922] bg-[#d2992211] border-[#d2992222]' :
                                    'text-[#3fb950] bg-[#3fb95011] border-[#3fb95022]'
                                 }`}>{s.violation.ruleId}</span>
                                 <span className="text-[9px] font-black text-[#484f58] uppercase font-mono">{s.violation.file?.split('/').pop()}</span>
                              </div>
                              <h4 className="text-xl font-black text-white italic tracking-tight uppercase">{s.violation.message}</h4>
                              <p className="text-[11px] text-[#8b949e] leading-relaxed italic">"{s.violation.suggestion}"</p>
                           </div>

                           <div className="flex-1">
                              {s.fix ? (
                                 <div className="bg-[#0d1117] p-6 rounded-3xl border border-white/5 space-y-6 animate-in slide-in-from-right-4 shadow-inner">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                       <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest flex items-center gap-2">
                                          <CpuIcon className="w-4 h-4" /> Atomic Remediation ({s.fix.safetyScore}% Safety)
                                       </div>
                                       <button 
                                          onClick={() => onApplyFix(s.violation, s.fix!)}
                                          className="bg-[#3fb950] text-white px-6 py-2.5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#3fb95022]"
                                       >
                                          DEPLOY PATCH
                                       </button>
                                    </div>
                                    <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 font-mono text-[11px] text-[#c9d1d9] whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar shadow-inner">
                                       {s.fix.diff}
                                    </div>
                                    <div className="flex items-start gap-4">
                                       <div className="text-[#3fb950] pt-1"><RocketIcon className="w-4 h-4" /></div>
                                       <div className="text-[10px] text-[#8b949e] font-medium leading-relaxed italic">
                                          <span className="text-white font-bold block mb-1">REASONING:</span>
                                          {s.fix.explanation}
                                       </div>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#30363d] rounded-[30px] p-12 space-y-6 group-hover:border-[#3fb95044] transition-all">
                                    <p className="text-[11px] font-black text-[#484f58] uppercase tracking-[0.4em]">Synthetic Resolution Available</p>
                                    <button 
                                       onClick={() => onGenerateFix(s.violation)}
                                       disabled={isProcessing}
                                       className="bg-white text-black px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                                    >
                                       {isProcessing ? 'SYNTHESIZING...' : 'PROPOSE ATOMIC FIX'}
                                    </button>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Strategic Insights */}
         <div className="space-y-8">
            <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[60px] space-y-10 relative overflow-hidden group shadow-2xl glass-card">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3fb950] group-hover:rotate-12 transition-transform duration-1000">
                  <ShieldIcon className="w-40 h-40" />
               </div>
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter underline decoration-[#3fb950] decoration-8 underline-offset-[16px]">Impact Analysis</h3>
               
               <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                     <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em]">Resolution ROI</div>
                     <div className="bg-[#0d1117] p-6 rounded-3xl border border-white/5 space-y-6">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Technical Debt Reduction</span>
                           <span className="text-[#3fb950] font-black font-mono">14.2h</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Compliance Uplift</span>
                           <span className="text-[#2f81f7] font-black font-mono">+28%</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Risk Neutralization</span>
                           <span className="text-[#f85149] font-black font-mono">HIGH</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em]">Constitution Health</div>
                     <div className="relative h-48 w-full bg-[#050505] rounded-3xl border border-white/5 flex items-center justify-center p-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3fb9500a] to-transparent" />
                        <div className="text-center relative z-10 space-y-2">
                           <div className="text-5xl font-black italic text-white tracking-tighter">92.4%</div>
                           <div className="text-[9px] font-black text-[#3fb950] uppercase tracking-widest">System Integrity Baseline</div>
                        </div>
                        {/* Fake data bars */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-1 opacity-20">
                           {Array.from({length: 20}).map((_, i) => (
                              <div key={i} className="bg-[#3fb950] w-1.5" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                     <div className="flex items-center gap-3 text-[#3fb950]">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Predictive Testing Active</span>
                     </div>
                     <p className="text-[11px] text-[#484f58] italic leading-relaxed mt-4 font-bold uppercase">
                        Every fix is verified against the Sovereign Logic Graph before deployment.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RefactoringHub;
