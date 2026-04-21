/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { LegalAuditReport, CodeFile } from '../types';
import { ShieldIcon, LockIcon, AlertIcon, LinkIcon, RocketIcon, BuildingIcon, GlobeIcon, CheckCircleIcon, ChevronRight, TerminalIcon, CpuIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
  onDrillDown?: (path: string, line?: number) => void;
}

const LegalSentinel: React.FC<Props> = ({ codebase, onDrillDown }) => {
  const [report, setReport] = useState<LegalAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

  const handleRunLegalAudit = async () => {
    setIsAuditing(true);
    setSelectedIncident(null);
    try {
      const result = await gemini.performLegalAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#020202] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#d2992233] relative">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#30363d] pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-[#d2992211] text-[#d29922] px-4 py-1 rounded-full border border-[#d2992233] text-[10px] font-black uppercase tracking-[0.3em]">Jurisprudence Engine</div>
             <div className="bg-[#050505] text-[#8b949e] px-4 py-1 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-[0.3em]">IP Watch Active</div>
          </div>
          <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Legal <span className="text-[#d29922]">Sentinel</span></h2>
          <p className="text-[#8b949e] max-w-3xl font-medium mt-6 italic text-lg leading-relaxed">Automated IP Pedigree Scrutiny. Select an incident to view the **Remediation Blueprint**.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleRunLegalAudit}
            className="bg-[#d29922] text-black px-12 py-5 rounded-[40px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#d2992233]"
          >
            SCRUTINIZE JURISPRUDENCE
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group glass-card shadow-2xl">
               <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] flex items-center gap-3"><BuildingIcon className="text-[#3fb950]" /> IP Health</div>
               <div className="text-6xl font-black italic text-[#3fb950] tracking-tighter">{report.ipHealthScore}%</div>
            </div>
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group glass-card shadow-2xl">
               <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] flex items-center gap-3"><ShieldIcon className="text-[#2f81f7]" /> Regulatory</div>
               <div className="text-6xl font-black italic text-[#2f81f7] tracking-tighter">{report.regulatoryComplianceScore}%</div>
            </div>
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group glass-card shadow-2xl">
               <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] flex items-center gap-3"><AlertIcon className="text-[#f85149]" /> IP Risks</div>
               <div className="text-6xl font-black italic text-[#f85149] tracking-tighter">{report.contaminationIncidents.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
             <div className="space-y-8">
                <h3 className="text-[14px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 px-4"><LinkIcon className="w-5 h-5 text-[#d29922]" /> Risk Ledger</h3>
                <div className="space-y-4">
                   {report.contaminationIncidents.map((incident, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedIncident(incident)}
                        className={`w-full text-left p-8 rounded-[45px] border flex flex-col gap-4 relative overflow-hidden transition-all shadow-xl ${
                          selectedIncident === incident ? 'border-[#d29922] bg-[#d299220a]' : 'border-[#30363d] hover:bg-white/5'
                        }`}
                      >
                         <div className="flex justify-between items-start">
                            <div className="space-y-1">
                               <div className="text-[11px] font-black text-[#f85149] uppercase tracking-widest bg-[#f8514911] px-3 py-1 rounded border border-[#f8514922] inline-block mb-3">IP Leak: {incident.pedigree.matchedLicense}</div>
                               <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{incident.file.split('/').pop()}</h4>
                            </div>
                            <div className="text-right">
                               <div className="text-[9px] font-black text-[#8b949e] uppercase">Similarity</div>
                               <div className="text-xl font-black italic text-[#f85149]">{incident.pedigree.similarityScore}%</div>
                            </div>
                         </div>
                         <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] text-[#484f58] font-bold uppercase italic tracking-widest">Provision Remediation Blueprint</span>
                            <ChevronRight className={`w-4 h-4 text-[#d29922] transition-transform ${selectedIncident === incident ? 'rotate-90' : ''}`} />
                         </div>
                      </button>
                   ))}
                </div>
             </div>

             {/* Legal Remediation Blueprint Panel */}
             <div className="sticky top-10 space-y-8">
                {selectedIncident ? (
                   <div className="bg-[#0d1117] border border-[#d2992244] p-10 rounded-[60px] space-y-10 animate-in slide-in-from-right-8 duration-500 shadow-2xl glass-card relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 text-[#d29922] pointer-events-none group-hover:rotate-12 transition-transform duration-5000">
                         <CpuIcon className="w-40 h-40" />
                      </div>
                      
                      <div className="space-y-4 border-b border-[#d2992222] pb-8">
                         <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-[#d29922] uppercase tracking-[0.4em] flex items-center gap-2"><LockIcon /> Clean-Room Playbook</span>
                         </div>
                         <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Remediation <span className="text-[#d29922]">Strategy</span></h3>
                         <p className="text-[#8b949e] text-sm leading-relaxed italic font-medium">"Logic block in **{selectedIncident.file}** matches restricted source in **{selectedIncident.pedigree.matchedSource}**. Legal immunity requires a clean-room abstraction."</p>
                      </div>

                      <div className="space-y-10">
                         <div className="space-y-6">
                            <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2 px-2"><TerminalIcon className="w-4 h-4 text-[#3fb950]" /> Execution Steps</div>
                            <div className="space-y-6">
                               {(selectedIncident.remediationPlan || [
                                 { title: 'De-compile Pattern', description: 'Strip logic down to primitive requirements to break semantic similarity.' },
                                 { title: 'Abstract Interface', description: 'Replace concrete implementation with a compliant generic interface.', command: 'archlens-cli ip-wipe --file ' + selectedIncident.file },
                                 { title: 'Verify Pedigree', description: 'Re-scan with Jurisprudence engine to confirm clean-room compliance.' }
                               ]).map((step, idx) => (
                                  <div key={idx} className="flex gap-6 items-start group">
                                     <div className="w-9 h-9 rounded-full bg-[#d2992211] text-[#d29922] flex items-center justify-center border border-[#d2992222] font-black text-sm shrink-0 mt-1 shadow-inner group-hover:bg-[#d29922] group-hover:text-black transition-all">{idx + 1}</div>
                                     <div className="space-y-1">
                                        <div className="text-[14px] font-black text-white uppercase italic tracking-tight group-hover:text-[#d29922] transition-colors">{step.title}</div>
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

                      <div className="pt-8 border-t border-[#d2992222] flex gap-4">
                         <button 
                            onClick={() => onDrillDown?.(selectedIncident.file, selectedIncident.line)}
                            className="flex-1 bg-white text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
                         >
                            OPEN IN CITADEL
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="h-96 flex flex-col items-center justify-center text-center p-12 space-y-8 opacity-40 border-2 border-dashed border-[#30363d] rounded-[60px]">
                      <div className="scale-[4] text-[#30363d] animate-pulse"><BuildingIcon className="w-10 h-10" /></div>
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#484f58] max-w-xs leading-relaxed italic">Select an IP incident to provision a Jurisprudence Playbook.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      ) : isAuditing ? (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-10">
           <div className="relative">
              <div className="w-24 h-24 border-[10px] border-[#d29922]/10 border-t-[#d29922] rounded-full animate-spin shadow-[0_0_60px_#d2992211]" />
              <div className="absolute inset-0 flex items-center justify-center text-[#d29922] animate-pulse"><BuildingIcon className="w-8 h-8" /></div>
           </div>
           <div className="text-center space-y-3">
              <p className="text-[18px] font-black text-white uppercase tracking-[0.8em] animate-pulse">Hashing Jurisprudence Data...</p>
              <p className="text-[11px] text-[#484f58] uppercase font-black tracking-[0.4em]">Verifying logic against 450,000 regulatory mandates</p>
           </div>
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-10 opacity-30 group hover:opacity-100 transition-opacity duration-1000">
           <div className="scale-[6] text-[#30363d] group-hover:text-[#d29922] transition-colors duration-700"><BuildingIcon /></div>
           <p className="text-[12px] font-black uppercase tracking-[0.6em] text-[#484f58]">Initialize Legal Audit to anchor IP baseline.</p>
        </div>
      )}
    </div>
  );
};

export default LegalSentinel;
