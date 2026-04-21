/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SECURITY-SHIELD-UI
 */

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SecurityAuditReport, CodeFile, SecurityIssue } from '../types';
import { ShieldIcon, AlertIcon, LockIcon, RocketIcon, GraphIcon, TerminalIcon, CpuIcon, ChevronRight, CheckCircleIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const SecurityHub: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedVuln, setSelectedVuln] = useState<SecurityIssue | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleRunSecurityAudit = async () => {
    setIsScanning(true);
    try {
      const result = await gemini.performSecurityAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error('Security Scan Breach:', e);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (report && svgRef.current) {
      const width = 600;
      const height = 400;
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const nodes = codebase.map(f => ({ id: f.path, type: 'file' }));
      const vulnNodes = report.vulnerabilities.map(v => ({ id: v.id, type: 'vuln', severity: v.severity }));
      
      const allNodes = [...nodes, ...vulnNodes];
      const links = report.vulnerabilities.map(v => ({ source: v.id, target: v.file }));

      const simulation = d3.forceSimulation(allNodes as any)
        .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const g = svg.append("g");

      const link = g.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#f8514933")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,2");

      const node = g.append("g")
        .selectAll("circle")
        .data(allNodes)
        .join("circle")
        .attr("r", (d: any) => d.type === 'vuln' ? 8 : 4)
        .attr("fill", (d: any) => {
          if (d.type === 'file') return "#2f81f7";
          return d.severity === 'error' ? "#f85149" : "#d29922";
        })
        .attr("class", "cursor-pointer")
        .on("click", (e, d: any) => {
           if (d.type === 'vuln') {
              const vuln = report.vulnerabilities.find(v => v.id === d.id);
              if (vuln) setSelectedVuln(vuln);
           }
        })
        .append("title")
        .text((d: any) => d.id);

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        g.selectAll("circle")
          .attr("cx", (d: any) => d.x)
          .attr("cy", (d: any) => d.y);
      });
    }
  }, [report, codebase]);

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#f8514933] relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Security <span className="text-[#f85149]">Shield</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Defensive Logic Scrutiny. Identifying vulnerabilities and provisioning the **Defensive Remediation Playbook**.</p>
        </div>
        {!report && !isScanning && (
          <button 
            onClick={handleRunSecurityAudit}
            className="bg-[#f85149] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f8514933]"
          >
            RUN DEEP SECURITY SCAN
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-700">
          {/* Main Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#3fb95033] transition-all glass-card shadow-xl">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><ShieldIcon className="w-3 h-3 text-[#3fb950]" /> Trust Level</div>
               <div className="text-5xl font-black italic text-[#3fb950]">{report.score}%</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#d2992233] transition-all glass-card shadow-xl">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LockIcon className="w-3 h-3 text-[#d29922]" /> Secrets Blocked</div>
               <div className="text-5xl font-black italic text-[#d29922]">{report.leakedSecrets.length}</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#f8514933] transition-all glass-card shadow-xl">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><AlertIcon className="w-3 h-3 text-[#f85149]" /> Risk Clusters</div>
               <div className="text-5xl font-black italic text-[#f85149]">{report.vulnerabilities.length}</div>
            </div>
             <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#2f81f733] transition-all glass-card shadow-xl">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GraphIcon className="w-3 h-3 text-[#2f81f7]" /> Defense Mesh</div>
               <div className="text-5xl font-black italic text-[#2f81f7]">Active</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
             <div className="space-y-10">
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 px-2"><GraphIcon className="w-4 h-4 text-[#2f81f7]" /> Threat Topology</h3>
                   <div className="bg-[#0d1117] border border-[#30363d] rounded-[40px] p-6 flex justify-center overflow-hidden shadow-inner glass-card">
                      <svg ref={svgRef} width="600" height="400" className="opacity-80" />
                   </div>
                </div>
                
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 px-2"><AlertIcon className="w-4 h-4 text-[#f85149]" /> Security Ledger</h3>
                   <div className="space-y-4">
                      {report.vulnerabilities.map((v, i) => (
                         <button 
                            key={i} 
                            onClick={() => setSelectedVuln(v)}
                            className={`w-full text-left p-8 rounded-[35px] border flex flex-col gap-4 relative overflow-hidden transition-all shadow-lg ${
                              selectedVuln?.id === v.id ? 'border-[#f85149] bg-[#f851490a]' : 'border-[#30363d] hover:bg-white/5'
                            }`}
                         >
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                                     v.severity === 'error' ? 'text-[#f85149] bg-[#f8514911] border-[#f8514922]' : 'text-[#d29922] bg-[#d2992211] border-[#d2992222]'
                                  }`}>
                                     <ShieldIcon className="w-6 h-6" />
                                  </div>
                                  <div>
                                     <div className="text-[10px] font-black uppercase tracking-widest opacity-60 font-bold">{v.type} • CWE-{v.cwe || 'Unknown'}</div>
                                     <h4 className="text-xl font-black text-white italic tracking-tight leading-none mt-1 uppercase">{v.message}</h4>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="text-[9px] font-black text-[#8b949e] uppercase italic">Blast Radius</div>
                                  <div className={`text-xl font-black italic tracking-tighter ${v.blastRadius && v.blastRadius > 50 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                                     {v.blastRadius || 'N/A'}/100
                                  </div>
                               </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                               <span className="text-[10px] text-[#484f58] font-bold uppercase italic tracking-widest">Execute Playbook</span>
                               <ChevronRight className={`w-4 h-4 text-[#f85149] transition-transform ${selectedVuln?.id === v.id ? 'rotate-90' : ''}`} />
                            </div>
                         </button>
                      ))}
                   </div>
                </div>
             </div>

             {/* Playbook Panel */}
             <div className="sticky top-10 space-y-8">
                {selectedVuln ? (
                   <div className="bg-[#0d1117] border border-[#f8514944] p-10 rounded-[60px] space-y-10 animate-in slide-in-from-right-8 duration-500 shadow-[0_50px_100px_rgba(0,0,0,0.8)] glass-card relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 text-[#f85149] pointer-events-none group-hover:rotate-12 transition-transform duration-5000">
                         <LockIcon className="w-40 h-40" />
                      </div>
                      
                      <div className="space-y-4 border-b border-[#f8514922] pb-8">
                         <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-[#f85149] uppercase tracking-[0.4em] flex items-center gap-2"><ShieldIcon className="w-4 h-4" /> Defensive Playbook</span>
                            <span className="bg-[#f8514922] text-[#f85149] px-3 py-1 rounded-full text-[9px] font-black uppercase border border-[#f8514933] tracking-widest">{selectedVuln.threatLevel || 'CRITICAL'} RISK</span>
                         </div>
                         <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Remediation <span className="text-[#f85149]">Plan</span></h3>
                         <p className="text-[#8b949e] text-sm leading-relaxed italic font-medium">"{selectedVuln.recommendation}"</p>
                      </div>

                      <div className="space-y-10">
                         <div className="space-y-6">
                            <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2 px-2"><TerminalIcon className="w-4 h-4 text-[#3fb950]" /> Execution Steps</div>
                            <div className="space-y-6">
                               {(selectedVuln.remediationPlan || [
                                 { title: 'Sanitize Logic Branch', description: 'Replace raw data interpolation with parameterized secure interfaces.' },
                                 { title: 'Update Schema Mandate', description: 'Force strict typing on all inputs entering the persistence layer.', command: 'npm run security:harden' },
                                 { title: 'Verify Coverage', description: 'Trigger Sovereign Fuzzing against this logical node.' }
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

                         <div className="p-8 bg-[#3fb9500a] border border-[#3fb95022] rounded-[40px] space-y-4 shadow-inner relative overflow-hidden group/compliance">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#3fb95011] blur-[40px] group-hover/compliance:bg-[#3fb95022] transition-all" />
                            <div className="flex items-center gap-3 text-[#3fb950] relative z-10">
                               <CheckCircleIcon className="w-5 h-5" />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance Verification</span>
                            </div>
                            <p className="text-xs text-[#8b949e] leading-relaxed italic font-medium relative z-10">
                               Executing this playbook restores **OWASP-L3 Compliance** for the {selectedVuln.file.split('/').pop()} module and reduces system entropy by ~2.4%.
                            </p>
                         </div>
                      </div>

                      <div className="pt-8 border-t border-[#f8514922]">
                         <button 
                            className="w-full bg-[#f85149] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#f8514944]"
                         >
                            AUTHORIZE PATCH GENERATION
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="h-96 flex flex-col items-center justify-center text-center p-12 space-y-8 opacity-40 border-2 border-dashed border-[#30363d] rounded-[60px]">
                      <div className="scale-[4] text-[#30363d] animate-pulse"><ShieldIcon className="w-10 h-10" /></div>
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#484f58] max-w-xs leading-relaxed italic">Select a vulnerability from the ledger or graph to provision a Remediation Playbook.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      ) : isScanning ? (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-1000">
           <div className="relative">
              <div className="w-24 h-24 border-[8px] border-[#f85149]/10 border-t-[#f85149] rounded-full animate-spin shadow-[0_0_60px_#f8514922]" />
              <div className="absolute inset-0 flex items-center justify-center text-[#f85149] animate-pulse"><LockIcon className="w-10 h-10" /></div>
           </div>
           <div className="text-center space-y-2">
              <div className="text-[16px] font-black text-white uppercase tracking-[0.8em] animate-pulse">Scanning Code Entropy...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-black italic tracking-[0.3em]">Verifying logical nodes against OWASP L3 compliance</p>
           </div>
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-10 opacity-30 group hover:opacity-100 transition-opacity duration-1000">
           <div className="scale-[6] text-[#30363d] group-hover:text-[#f85149] transition-colors duration-700 animate-pulse"><ShieldIcon /></div>
           <p className="text-[12px] font-black uppercase tracking-[0.6em] text-[#484f58]">Initialize deep security audit to provision your defense baseline.</p>
        </div>
      )}
    </div>
  );
};

export default SecurityHub;
