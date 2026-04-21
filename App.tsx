/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-APP-ROOT-SENTINEL-V20-STABLE
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FilesIcon, GraphIcon, RocketIcon, LockIcon, ShieldIcon, 
  SearchIcon, AlertIcon, BuildingIcon, 
  UserIcon, LinkIcon, TerminalIcon, CpuIcon
} from './components/Icons.tsx';
import { MOCK_CODEBASE, ARCH_RULES, MOCK_ACTIVITY } from './constants.tsx';
import { 
  CodeFile, ImpactAnalysis, 
  MonitorLog, UserProfile, PlanType,
  PhantomStatus, PhantomExecutionResult, DeveloperPersona
} from './types.ts';

// Component Imports
import DependencyGraph from './components/DependencyGraph.tsx';
import Terminal from './components/Terminal.tsx';
import Dashboard from './components/Dashboard.tsx';
import LandingPage from './components/LandingPage.tsx';
import CodeEditor from './components/CodeEditor.tsx';
import SovereignVault from './components/SovereignVault.tsx';
import UpgradeModal from './components/UpgradeModal.tsx';
import SemanticSearch from './components/SemanticSearch.tsx';
import AuditView from './components/AuditView.tsx';
import RulesView from './components/RulesView.tsx';
import DependencyGuardian from './components/DependencyGuardian.tsx';
import DeveloperPersonaMirror from './components/DeveloperPersonaMirror.tsx';
import PhantomExecutionOverlay from './components/PhantomExecutionOverlay.tsx';
import PipelineView from './components/PipelineView.tsx';
import RefactoringHub from './components/RefactoringHub.tsx';
import ReliabilityHub from './components/ReliabilityHub.tsx';
import SecurityHub from './components/SecurityHub.tsx';
import SpecsView from './components/SpecsView.tsx';
import StrategicCitadel from './components/StrategicCitadel.tsx';
import StructuralForge from './components/StructuralForge.tsx';
import AcademyDrillsView from './components/AcademyDrillsView.tsx';

// Service Imports
import * as ragService from './services/ragService.ts';
import * as membershipService from './services/membershipService.ts';

type Tab = 'landing' | 'specs' | 'dashboard' | 'citadel' | 'saas' | 'search' | 'audit' | 'rules' | 'refactor' | 'security' | 'shield' | 'dna' | 'pulse' | 'pipeline' | 'vault' | 'explorer' | 'graph' | 'forge' | 'drills';

interface NavItem {
  id: Tab;
  icon: React.ReactNode;
  label: string;
  category: 'Intelligence' | 'Engineering' | 'Logic' | 'Tactical';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: <RocketIcon />, label: 'Strategic Center', category: 'Intelligence' },
  { id: 'citadel', icon: <BuildingIcon />, label: 'ADR Oversight', category: 'Intelligence' },
  { id: 'search', icon: <SearchIcon />, label: 'Semantic RAG', category: 'Intelligence' },
  { id: 'audit', icon: <AlertIcon />, label: 'Deep Scrutiny', category: 'Engineering' },
  { id: 'forge', icon: <CpuIcon />, label: 'Structural Forge', category: 'Engineering' },
  { id: 'rules', icon: <ShieldIcon />, label: 'Logic Invariants', category: 'Engineering' },
  { id: 'refactor', icon: <CpuIcon />, label: 'Refactoring Hub', category: 'Engineering' },
  { id: 'security', icon: <LinkIcon />, label: 'Supply Guardian', category: 'Engineering' },
  { id: 'shield', icon: <LockIcon className="text-[#f85149]" />, label: 'Security Shield', category: 'Engineering' },
  { id: 'dna', icon: <UserIcon />, label: 'Persona Mirror', category: 'Logic' },
  { id: 'drills', icon: <TerminalIcon />, label: 'Academy Drills', category: 'Logic' },
  { id: 'pulse', icon: <TerminalIcon />, label: 'Reliability Pulse', category: 'Logic' },
  { id: 'pipeline', icon: <GraphIcon className="opacity-50" />, label: 'Continuity Guard', category: 'Logic' },
  { id: 'vault', icon: <LockIcon />, label: 'Sovereign Vault', category: 'Logic' },
  { id: 'explorer', icon: <FilesIcon />, label: 'File Scrutiny', category: 'Tactical' },
  { id: 'graph', icon: <GraphIcon />, label: 'Logic Graph', category: 'Tactical' }
];

const NAV_CATEGORIES = ['Intelligence', 'Engineering', 'Logic', 'Tactical'];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('landing');
  const [codebase, setCodebase] = useState<CodeFile[]>(MOCK_CODEBASE);
  const [selectedFile, setSelectedFile] = useState<CodeFile>(MOCK_CODEBASE[0]);
  const [impactData, setImpactData] = useState<ImpactAnalysis | null>(null);
  const [logs, setLogs] = useState<MonitorLog[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSyncingPersona, setIsSyncingPersona] = useState(false);
  const [phantomStatus] = useState<PhantomStatus>('idle');
  const [phantomResult] = useState<PhantomExecutionResult | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user_sentinel_001',
    name: 'Architect Rivera',
    email: 'architect@globovill.com',
    membership: { 
      plan: 'Enterprise',
      status: 'Active',
      signature: {
        logicHash: 'ARCHLENS_SENTINEL_PROVENANCE_V6_MASTER',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
        verifiedBy: 'ArchLens-Core-Citadel'
      },
      tokens: { total: 10000, consumed: 120, reserved: 0, lastUpdated: new Date().toISOString() },
      billingCycleStart: new Date().toISOString(),
      billingCycleEnd: new Date(Date.now() + 25 * 86400000).toISOString(),
      autoRenew: true,
      lastPaymentId: 'PAY-8812',
      unlockedFeatures: ['Deep_RAG', 'Socratic_Mentorship', 'Supply_Guardian', 'Federated_Governance']
    },
    runtimeTarget: 'Cloudflare_Workers'
  });

  const persona = useMemo<DeveloperPersona>(() => ({
    type: 'Senior Architect',
    traits: ['Functional Logic', 'Zero-Trust Context', 'Modular Purity'],
    philosophy: 'Code is a persistent state of architectural sovereignty.',
    preferredPatterns: ['Repository', 'Strategy', 'Observer'],
    lastSync: new Date().toLocaleTimeString(),
    syncStatus: 'synced'
  }), []);

  const triggerIndexing = useCallback(async (filesToIndex: CodeFile[]) => {
    let active = true;
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'RAG_SYNC', details: `Commencing Sovereign Intake of ${filesToIndex.length} logic nodes...`, level: 'info' }]);
    
    const result = await ragService.indexCodebase(filesToIndex, (p: number, msg: string) => {
      if (active) setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'RAG_SYNC', details: msg, level: 'info' }]);
    });

    if (result && active) {
      setNodes(result.nodes);
      setLinks(result.links);
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'RAG_SYNC', details: `Logic Graph stabilized. ${result.nodes.length} nodes integrated.`, level: 'success' }]);
    }
    return () => { active = false; };
  }, []);

  useEffect(() => {
    async function startup() {
       setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'CITADEL_ACTIVE', details: 'Establishing zero-trust logic perimeter...', level: 'info' }]);
       await membershipService.hydrateFromDatabase(currentUser.email);
       triggerIndexing(codebase);
    }
    startup();
  }, [codebase, currentUser.email, triggerIndexing]);

  const handleCodebaseImported = useCallback((newFiles: CodeFile[]) => {
    setCodebase(newFiles);
    setSelectedFile(newFiles[0]);
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'CITADEL_IMPORT', details: `Foreign repository detected. Re-anchoring knowledge layer...`, level: 'warning' }]);
  }, []);

  const handleDrillDown = useCallback((path: string) => {
    const file = codebase.find(f => f.path === path);
    if (file) {
      setSelectedFile(file);
      setActiveTab('explorer');
    }
  }, [codebase]);

  const handleCodeChange = useCallback(async (content: string) => {
    const updatedFile = { ...selectedFile, content, lastModified: new Date().toISOString() };
    setSelectedFile(updatedFile);
    setCodebase(prev => prev.map(f => f.path === updatedFile.path ? updatedFile : f));
    const impactWindow = ragService.getImpactWindow(updatedFile.path, codebase);
    const analysis = await ragService.validateProposedChange(selectedFile, content, impactWindow, ARCH_RULES);
    setImpactData(analysis);
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'IMPACT_ANALYSIS', details: `Analysis complete for ${selectedFile.name}. Score: ${analysis.score}%`, level: analysis.safe ? 'success' : 'warning' }]);
  }, [selectedFile, codebase]);

  const handleUpgradeSuccess = useCallback((plan: PlanType) => {
    const updatedUser = membershipService.processTierUpgrade(currentUser, plan);
    setCurrentUser(updatedUser);
    setIsUpgradeModalOpen(false);
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'VAULT_ESCALATION', details: `Subscription escalated to ${plan} tier. Logic credits provisioned.`, level: 'success' }]);
  }, [currentUser]);

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onGetStarted={() => setActiveTab('dashboard')} onViewSpecs={() => setActiveTab('specs')} />;
      case 'specs':
        return <SpecsView onBack={() => setActiveTab('landing')} onInitialize={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <Dashboard 
          stats={{ creditsUsed: currentUser.membership.tokens.consumed, requestsUsed: 0, activeViolations: 2 }} 
          rules={ARCH_RULES} 
          user={currentUser} 
          activities={MOCK_ACTIVITY} 
          sandboxes={[]} 
          onNavigate={(t) => setActiveTab(t)} 
          onUpgrade={() => setIsUpgradeModalOpen(true)}
          onCodebaseImported={handleCodebaseImported}
        />;
      case 'citadel':
        return <StrategicCitadel codebase={codebase} />;
      case 'search':
        return <SemanticSearch codebase={codebase} onNavigateToFile={handleDrillDown} />;
      case 'audit':
        return <AuditView codebase={codebase} rules={ARCH_RULES} onAuditStarted={() => undefined} onDrillDown={handleDrillDown} />;
      case 'rules':
        return <RulesView rules={ARCH_RULES} codebase={codebase} activeViolations={impactData?.ruleViolations || []} onTriggerFix={() => undefined} />;
      case 'refactor':
        return <RefactoringHub suggestions={[]} onApplyFix={() => undefined} onGenerateFix={() => undefined} isProcessing={false} />;
      case 'security':
        return <DependencyGuardian codebase={codebase} runtime={currentUser.runtimeTarget} />;
      case 'shield':
        return <SecurityHub codebase={codebase} />;
      case 'dna':
        return <DeveloperPersonaMirror persona={persona} onSync={() => setIsSyncingPersona(true)} isSyncing={isSyncingPersona} />;
      case 'pulse':
        return <ReliabilityHub codebase={codebase} />;
      case 'pipeline':
        return <PipelineView isActive={true} />;
      case 'vault':
        return <SovereignVault user={currentUser} onUpgrade={() => setIsUpgradeModalOpen(true)} />;
      case 'explorer':
        return <CodeEditor file={selectedFile} violations={impactData?.ruleViolations || []} onTriggerFix={() => undefined} onApplySyntheticFix={() => undefined} onCodeChange={handleCodeChange} />;
      case 'graph':
        return <DependencyGraph nodes={nodes} links={links} onNodeClick={handleDrillDown} />;
      case 'forge':
        return <StructuralForge codebase={codebase} />;
      case 'drills':
        return <AcademyDrillsView selectedFile={selectedFile} persona={persona} />;
      default:
        return <LandingPage onGetStarted={() => setActiveTab('dashboard')} onViewSpecs={() => setActiveTab('specs')} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#e6edf3] font-sans selection:bg-[#2f81f733]">
      {activeTab !== 'landing' && activeTab !== 'specs' && (
        <aside className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0 z-50">
          <div className="p-6 border-b border-[#30363d]">
            <div className="flex items-center gap-3 text-white font-black italic tracking-tighter">
              <ShieldIcon className="text-[#2f81f7]" />
              <span>ARCHLENS <span className="text-[#2f81f7]">STRATEGIC</span></span>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar">
            {NAV_CATEGORIES.map(cat => (
              <div key={cat} className="space-y-2">
                <div className="px-6 text-[10px] font-black text-[#484f58] uppercase tracking-[0.2em]">{cat}</div>
                <div className="space-y-1">
                  {NAV_ITEMS.filter(i => i.category === cat).map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-bold transition-all border-l-2 ${
                        activeTab === item.id 
                          ? 'bg-[#2f81f711] text-white border-[#2f81f7]' 
                          : 'text-[#8b949e] border-transparent hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className={activeTab === item.id ? 'text-[#2f81f7]' : ''}>{item.icon}</div>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="p-6 border-t border-[#30363d] bg-[#161b22]/30">
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full bg-[#2f81f7] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/50"
            >
              UPGRADE VAULT
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {renderActiveContent()}
        
        {activeTab !== 'landing' && activeTab !== 'specs' && (
          <Terminal 
            logs={logs} 
            impactData={impactData} 
            activeFix={null} 
            onApplyFix={() => undefined} 
            onDrillDown={handleDrillDown} 
          />
        )}
      </main>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        user={currentUser} 
        onClose={() => setIsUpgradeModalOpen(false)} 
        onUpgradeSuccess={handleUpgradeSuccess} 
      />
      
      <PhantomExecutionOverlay status={phantomStatus} result={phantomResult} />
    </div>
  );
}

export default App;