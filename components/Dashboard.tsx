import React, { useMemo, useEffect, useRef, useState } from 'react';
import { DashboardStats, AnalysisRule, UserProfile, Activity, PlanType, SandboxInstance, DepartmentSector, CodeFile } from '../types';
import { RocketIcon, AlertIcon, ShieldIcon, BuildingIcon, ChevronRight, GlobeIcon, LockIcon, FilesIcon, CpuIcon, LightbulbIcon, TerminalIcon } from './Icons';
import { PLAN_CONFIGS } from '../constants';

interface Props {
  stats: DashboardStats;
  rules: AnalysisRule[];
  user: UserProfile;
  activities: Activity[];
  sandboxes: SandboxInstance[];
  onNavigate: (tab: any) => void;
  onUpgrade?: (plan: PlanType) => void;
  onDrillDown?: (path: string, line?: number) => void;
  onCodebaseImported?: (files: CodeFile[]) => void;
}

const Dashboard: React.FC<Props> = ({ stats, user, onNavigate, onUpgrade, activities = [], sandboxes = [], onCodebaseImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [intelligenceStream, setIntelligenceStream] = useState<string[]>([
    "Analyzing 'src/services/UserService.ts' for PII isolation compliance...",
    "Detected 14% logic overlap between Auth and Session handlers.",
    "Sovereign RAG layer updated: New ADR pattern identified in Ledger core.",
    "Predictive stress simulation: Shipping service capacity at 82% threshold."
  ]);

  // Simulate a live intelligence stream
  useEffect(() => {
    const interval = setInterval(() => {
      const insights = [
        "Intelligence Update: Refactoring proposal generated for 'LegacyProcessor.ts'.",
        "Sentinel Alert: Unverified dependency 'lodash-patch-v1' blocked.",
        "DNA Sync: Aligning RAG context with Architect Rivera's latest patterns.",
        "Strategic Oversight: Breaking change risk detected in Payments API contract."
      ];
      const newInsight = insights[Math.floor(Math.random() * insights.length)];
      setIntelligenceStream(prev => [newInsight, ...prev.slice(0, 3)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !onCodebaseImported) return;

    const importedFiles: CodeFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.match(/\.(ts|tsx|js|jsx|py|java|json|tf|dockerfile)$/i)) {
        const content = await file.text();
        importedFiles.push({
          path: file.webkitRelativePath || file.name,
          name: file.name,
          content: content,
          language: file.name.split('.').pop() || 'text',
          lastModified: new Date(file.lastModified).toISOString()
        });
      }
    }

    if (importedFiles.length > 0) {
      onCodebaseImported(importedFiles);
    }
  };

  const currentPlanConfig = useMemo(() => 
    PLAN_CONFIGS.find(p => p.type === user.membership.plan) || PLAN_CONFIGS[0]
  , [user.membership.plan]);

  const sectors: DepartmentSector[] = useMemo(() => [
    { id: 'sec-1', name: 'Accounts Core', integrityScore: 98, activeViolations: 0, leadArchitect: 'R. Rivera' },
    { id: 'sec-2', name: 'Payments Gateway', integrityScore: 94, activeViolations: 1, leadArchitect: 'M. Chen' },
    { id: 'sec-3', name: 'Shipping Edge', integrityScore: 82, activeViolations: 4, leadArchitect: 'D. Smith' },
  ], []);

  const personaColor = useMemo(() => {
     if (user.membership.plan === 'Enterprise') return 'text-[#d29922]';
     if (user.membership.plan === 'Pro' || user.membership.plan === 'Team') return 'text-[#3fb950]';
     return 'text-[#2f81f7]';
  }, [user.membership.plan]);

  return (
    <div className="flex-1 bg-[#020202] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#2f81f733] border-t border-white/5 relative">
      {/* Strategic Background Elements */}
      <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none">
        <BuildingIcon className="w-96 h-96" />
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase glow-text-blue">
               {user.membership.plan} Control
            </h1>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] ${personaColor} animate-pulse-sentinel`}>
               <ShieldIcon className="w-3 h-3" /> Squadron Protocol Active
            </div>
          </div>
          <p className="text-[#8b949e] font-medium italic text-lg">Multi-departmental architectural command for <span className="text-white font-bold">{user.organization?.name || 'Enterprise Engineering'}</span></p>
        </div>
        <div className="flex gap-4">
           <input type="file" ref={fileInputRef} className="hidden" webkitdirectory="" directory="" multiple onChange={handleFileChange} />
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="bg-[#2f81f711] text-[#2f81f7] border border-[#2f81f744] px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#2f81f722] transition-all flex items-center gap-3"
           >
             <FilesIcon className="w-4 h-4" /> IMPORT REPOSITORY
           </button>
           <button onClick={() => onUpgrade?.('Enterprise')} className="bg-white text-black px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10">ESCALATE ORG UNITS</button>
        </div>
      </header>

      {/* NOVELTY: Intelligence as a Service - Live HUD */}
      <div className="bg-[#161b22] border border-[#2f81f733] rounded-[3rem] p-1 shadow-[0_0_50px_#2f81f70a] relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2f81f7] to-transparent animate-pulse" />
         <div className="bg-[#050505] rounded-[2.8rem] p-8 flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-1/3 space-y-4">
               <div className="flex items-center gap-3 text-[#2f81f7]">
                  <CpuIcon className="w-5 h-5 animate-spin-slow" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">Intelligence Ledger</span>
               </div>
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Cognitive <span className="text-[#2f81f7]">Synthesis</span> Feed</h3>
               <p className="text-xs text-[#8b949e] font-medium italic">Continuous RAG background processing. Identifying strategic drift in real-time.</p>
            </div>
            <div className="flex-1 space-y-3">
               {intelligenceStream.map((insight, idx) => (
                  <div key={idx} className={`flex items-center gap-5 p-4 bg-[#161b22]/50 border border-white/5 rounded-2xl transition-all duration-1000 ${idx === 0 ? 'scale-105 border-[#2f81f744] bg-[#2f81f705]' : 'opacity-40 scale-95'}`}>
                     <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#2f81f7] animate-pulse' : 'bg-[#30363d]'}`} />
                     <span className={`text-[12px] font-mono tracking-tight ${idx === 0 ? 'text-white font-bold' : 'text-[#8b949e]'}`}>
                        <span className="text-[#484f58] mr-4">[{new Date().toLocaleTimeString()}]</span>
                        {insight}
                     </span>
                  </div>
               ))}
            </div>
            <div className="lg:w-1/4">
               <button className="w-full bg-[#2f81f711] text-[#2f81f7] border border-[#2f81f733] py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2f81f7] hover:text-white transition-all group/btn">
                  OPEN STRATEGIC CONSOLE <ChevronRight className="inline w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {[
          { label: 'Global Knowledge RAG', val: `${stats.creditsUsed || 0} / ${currentPlanConfig.limits.credits}`, color: personaColor, icon: <RocketIcon />, tab: 'vault', desc: 'Enterprise wide index depth' },
          { label: 'Org-wide Integrity', val: '92%', color: 'text-[#3fb950]', icon: <GlobeIcon />, tab: 'dna', desc: 'Cross-department sync factor' },
          { label: 'Unchecked Breaches', val: `${stats.activeViolations || 0}`, color: (stats.activeViolations || 0) > 0 ? 'text-[#f85149]' : 'text-[#3fb950]', icon: <AlertIcon />, tab: 'audit', desc: 'Blocked PRs in fleet' },
          { label: 'Audit Provenance', val: '100%', color: 'text-[#2f81f7]', icon: <LockIcon />, tab: 'citadel', desc: 'ADR Compliance Score' }
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.tab as any)}
            className="p-10 rounded-[3rem] relative group overflow-hidden border border-white/5 bg-[#161b22]/30 text-left hover:border-[#2f81f766] transition-all hover:translate-y-[-4px] glass-card"
          >
             <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#2f81f722] to-transparent" />
             <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest mb-6 flex items-center gap-3 group-hover:text-white transition-colors">
                <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
                {stat.label}
             </div>
             <div className={`text-3xl font-black italic tracking-tighter ${stat.color} mb-2`}>{stat.val}</div>
             <p className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest">{stat.desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-6 relative z-10">
         <div className="flex justify-between items-center px-4">
            <h3 className="text-[15px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
               <BuildingIcon className="w-5 h-5 text-[#2f81f7]" /> Sector Sovereignty HUD
            </h3>
            <span className="text-[10px] font-black text-[#484f58] uppercase italic">Monitoring independent codebases</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectors.map(sector => (
               <div key={sector.id} className="bg-[#0d1117] border border-[#30363d] p-8 rounded-[3.5rem] space-y-6 group hover:border-[#2f81f744] transition-all shadow-xl shadow-black/80 glass-card">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{sector.name}</h4>
                        <div className="text-[9px] font-bold text-[#484f58] uppercase">Lead: {sector.leadArchitect}</div>
                     </div>
                     <div className={`w-3 h-3 rounded-full animate-pulse ${sector.integrityScore > 90 ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                        <span>Integrity Score</span>
                        <span className={sector.integrityScore > 90 ? 'text-[#3fb950]' : 'text-[#f85149]'}>{sector.integrityScore}%</span>
                     </div>
                     <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div 
                           className={`h-full transition-all duration-1000 ${sector.integrityScore > 90 ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} 
                           style={{ width: `${sector.integrityScore}%` }} 
                        />
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-2">
                        <span className="text-[#484f58]">Active Violations</span>
                        <span className={sector.activeViolations > 0 ? 'text-[#f85149]' : 'text-[#3fb950]'}>{sector.activeViolations}</span>
                     </div>
                  </div>
                  <button className="w-full bg-white/5 text-[#8b949e] py-3 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] group-hover:bg-[#2f81f7] group-hover:text-white transition-all flex items-center justify-center gap-2">
                     Examine Sector <ChevronRight className="w-3 h-3" />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
