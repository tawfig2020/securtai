/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { AuditReport, CodeFile, AnalysisRule, AuditIssue } from '../types';
import { ShieldIcon, AlertIcon, RocketIcon, GraphIcon, TerminalIcon, CpuIcon, ChevronRight } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
  rules: AnalysisRule[];
  onAuditStarted: (credits: number) => void;
  onDrillDown?: (path: string, line?: number) => void;
}

const AuditView: React.FC<Props> = ({ codebase, rules, onAuditStarted, onDrillDown }) => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);

  const handleStartAudit = async () => {
    setIsAuditing(true);
    onAuditStarted(50);
    try {
      const result = await gemini.performCodebaseAudit(codebase, rules);
      if (result.issues) {
        result.issues = result.issues.map((issue: AuditIssue, idx: number) => ({
          ...issue,
          file: codebase[idx % codebase.length].path,
          line: 1
        }));
      }
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 relative selection:bg-[#f8514933]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#30363d] pb-10 gap-6">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Deep <span className="text-[#f85149]">Audit</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4">Structural Scrutiny. Flagging Monoliths, Cycles, and God Objects. Select an issue to view the <strong>Strategic Remediation Blueprint</strong>.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleStartAudit}
            className="bg-[#f85149] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f8514933]"
          >
            SCAN MONOLITH RISKS
          </button>
        )}
      </header>

      {report && (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-8 group hover:border-[#f8514933] transition-all shadow-2xl glass-card">
               <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4 text-[#f85149]" /> Structural Toxicity
               </h3>
               <div className="flex items-center gap-10">
                  <div className="relative w-32 h-32">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="#30363d" strokeWidth="12" fill="transparent" />
                        <circle cx="64" cy="64" r="58" stroke="#f85149" strokeWidth="12" fill="transparent" 
                                strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - (report.toxicity?.godObjectProbability || 0) / 100)} className="transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white">{report.toxicity?.godObjectProbability || 0}%</div>
                  </div>
                  <div className="flex-1 space-y-2">
                     <div className="text-xl font-black text-white italic uppercase tracking-tighter">Complexity Trap</div>
                     <p className="text-sm text-[#8b949e] leading-relaxed italic font-medium">System logic is concentrating in too few nodes. Architectural failure probability is **High**.</p>
                  </div>
               </div>
            </div>
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 flex flex-col justify-center glass-card shadow-2xl">
               <div className="flex justify-between items-center text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                  <span>Spaghetti Factor</span>
                  <span className="text-[#f85149] font-mono">{report.toxicity?.cyclicDepth || 0} Cycles Detected</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                  <span>Logic Leakage</span>
                  <span className="text-[#d29922] font-mono">{report.toxicity?.logicLeakageCount || 0} Domain Bleeds</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                  <span>Entanglement</span>
                  <span className="text-[#2f81f7] font-mono">{report.toxicity?.entanglementFactor?.toFixed(2) || '0.00'}</span>
               </div>
               <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="text-[9px] font-black text-[#484f58] uppercase tracking-[0.3em] italic">Calculated against Sovereign Logic Graph</div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
             {/* Issue List */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 px-4"><AlertIcon className="w-4 h-4 text-[#f85149]" /> Findings Ledger</h3>
                <div className="grid grid-cols-1 gap-4">
                   {report.issues.map((issue) => (
                      <button 
                        key={issue.id} 
                        onClick={() => setSelectedIssue(issue)}
                        className={`w-full text-left bg-[#161b22] border p-8 rounded-[35px] space-y-4 transition-all group relative overflow-hidden shadow-xl ${
                          selectedIssue?.id === issue.id ? 'border-[#f85149] bg-[#f851490a]' : 'border-[#30363d] hover:border-[#f8514966]'
                        }`}
                      >
                         <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-[#f85149] uppercase bg-[#f8514911] px-3 py-1 rounded border border-[#f8514922]">{issue.category}</span>
                              {issue.file && <span className="text-[9px] text-[#484f58] font-mono uppercase tracking-widest font-bold">{issue.file}</span>}
                            </div>
                         </div>
                         <h4 className="text-xl font-black text-white italic leading-tight group-hover:text-[#f85149] transition-colors">{issue.message}</h4>
                         <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] text-[#484f58] font-bold uppercase italic">Scrutinize Strategy</span>
                            <ChevronRight className={`w-4 h-4 text-[#f85149] transition-transform ${selectedIssue?.id === issue.id ? 'rotate-90' : ''}`} />
                         </div>
                      </button>
                   ))}
                </div>
             </div>

             {/* Blueprint Panel */}
             <div className="sticky top-10 space-y-8">
                {selectedIssue ? (
                   <div className="bg-[#0d1117] border border-[#f8514944] p-10 rounded-[60px] space-y-10 animate-in slide-in-from-right-8 duration-500 shadow-[0_50px_100px_rgba(0,0,0,0.8)] glass-card relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 text-[#f85149] pointer-events-none group-hover:rotate-12 transition-transform duration-5000">
                         <CpuIcon className="w-40 h-40" />
                      </div>
                      
                      <div className="space-y-4 border-b border-[#f8514922] pb-8">
                         <div className="text-[11px] font-black text-[#f85149] uppercase tracking-[0.4em] flex items-center gap-2"><RocketIcon className="w-4 h-4" /> Resolution Strategy</div>
                         <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Strategic <span className="text-[#f85149]">Blueprint</span></h3>
                         <p className="text-[#8b949e] text-sm leading-relaxed italic font-medium">"{selectedIssue.recommendation}"</p>
                      </div>

                      <div className="space-y-8">
                         <div className="space-y-4">
                            <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GraphIcon className="w-4 h-4 text-[#2f81f7]" /> Corrective Pattern</div>
                            <div className="bg-[#050505] p-6 rounded-3xl border border-white/5 flex items-center gap-5 group hover:border-[#2f81f744] transition-all cursor-default shadow-inner">
                               <div className="w-14 h-14 rounded-2xl bg-[#2f81f711] text-[#2f81f7] flex items-center justify-center border border-[#2f81f733] shadow-inner">
                                  <ShieldIcon className="w-6 h-6" />
                               </div>
                               <div>
                                  <div className="text-xl font-black text-white italic uppercase tracking-tight">{selectedIssue.architecturalPattern || 'Modular Isolation'}</div>
                                  <div className="text-[9px] text-[#484f58] font-bold uppercase tracking-widest">Recommended Logical Refactor</div>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2 px-2"><TerminalIcon className="w-4 h-4 text-[#3fb950]" /> Implementation Steps</div>
                            <div className="space-y-6">
                               {(selectedIssue.remediationPlan || [
                                 { title: 'Isolate Fragment', description: 'Extract coupled logic into a pure utility outside the component scope.' },
                                 { title: 'Invert Control', description: 'Apply the Strategy pattern to handle conditional logic branches.', command: 'npm run refactor:strategy' },
                                 { title: 'Verify Integrity', description: 'Re-run the structural audit to ensure circularity has been neutralized.' }
                               ]).map((step, idx) => (
                                  <div key={idx} className="flex gap-6 items-start group">
                                     <div className="w-9 h-9 rounded-full bg-[#f8514911] text-[#f85149] flex items-center justify-center border border-[#f8514922] font-black text-sm shrink-0 mt-1 shadow-inner group-hover:bg-[#f85149] group-hover:text-white transition-all">{idx + 1}</div>
                                     <div className="space-y-1">
                                        <div className="text-[14px] font-black text-white uppercase italic tracking-tight group-hover:text-[#f85149] transition-colors">{step.title}</div>
                                        <p className="text-[13px] text-[#8b949e] leading-relaxed font-medium italic">{step.description}</p>
                                        {step.command && (
                                           <div className="mt-4 bg-[#050505] p-4 rounded-xl border border-white/5 font-mono text-[11px] text-[#3fb950] overflow-x-auto shadow-inner">
                                              $ {step.command}
                                           </div>
                                        )}
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-[#f8514922] flex gap-4">
                         <button 
                            onClick={() => selectedIssue.file && onDrillDown?.(selectedIssue.file, selectedIssue.line)}
                            className="flex-1 bg-white text-black py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                         >
                            OPEN SOURCE IN CITADEL
                         </button>
                         <button className="px-8 bg-[#161b22] text-[#8b949e] border border-white/5 rounded-[2rem] hover:text-white transition-all group">
                            <GraphIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="h-96 flex flex-col items-center justify-center text-center p-12 space-y-8 opacity-40 border-2 border-dashed border-[#30363d] rounded-[60px]">
                      <div className="scale-[4] text-[#30363d] animate-pulse"><TerminalIcon /></div>
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#484f58] max-w-xs leading-relaxed italic">Select a finding to provision the Strategic Remediation Pathway.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {isAuditing && (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-1000">
           <div className="relative">
              <div className="w-24 h-24 border-[8px] border-[#f85149]/10 border-t-[#f85149] rounded-full animate-spin shadow-[0_0_60px_#f8514922]" />
              <div className="absolute inset-0 flex items-center justify-center text-[#f85149] animate-pulse"><CpuIcon className="w-10 h-10" /></div>
           </div>
           <div className="text-center space-y-2">
              <p className="text-[16px] font-black text-white uppercase tracking-[0.8em] animate-pulse">Running Structural Scrutiny...</p>
              <p className="text-[10px] text-[#484f58] uppercase font-black tracking-[0.3em]">Decoding Logical Interdependencies and Spaghetti Factor</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AuditView;
