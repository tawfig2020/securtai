/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-UPGRADE-MODAL-V16-CLEAN
 */

import React, { useState, useCallback } from 'react';
import { UserProfile, PlanType, PlanConfig } from '../types';
import { LockIcon, RocketIcon, ShieldIcon, BuildingIcon, CheckCircleIcon } from './Icons';
import { PLAN_CONFIGS } from '../constants';

interface UpgradeModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onUpgradeSuccess: (target: PlanType, paymentDetails: any) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, user, onClose, onUpgradeSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatedUpgrade = useCallback(() => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    
    // Simulate a secure logic handshake/transaction with minimal overhead
    setTimeout(() => {
      onUpgradeSuccess(selectedPlan.type, { simulated: true, txId: `TX-${Date.now()}` });
      setIsProcessing(false);
      setSelectedPlan(null);
    }, 1500);
  }, [selectedPlan, onUpgradeSuccess]);

  const handleReset = useCallback(() => {
    setSelectedPlan(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="bg-[#0d1117] border border-[#30363d] w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,1)] ring-1 ring-white/10 flex flex-col max-h-[90vh]">
        
        <div className="p-10 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]/50 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-2.5 h-2.5 rounded-full bg-[#2f81f7] animate-pulse" />
               <h2 className="text-[12px] font-black tracking-[0.4em] uppercase text-[#2f81f7]">Provision Strategic Tier</h2>
            </div>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">Upgrade <span className="text-[#2f81f7]">Vault</span></h3>
          </div>
          <button onClick={() => { handleReset(); onClose(); }} className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-[#484f58] hover:text-white text-2xl transition-all hover:scale-110 active:scale-95">×</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {!selectedPlan ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLAN_CONFIGS.map((config) => (
                <div 
                  key={config.type} 
                  className={`p-10 rounded-[3.5rem] border flex flex-col transition-all relative group overflow-hidden ${
                    user.membership.plan === config.type 
                      ? 'bg-[#2f81f711] border-[#2f81f7] scale-105 shadow-[0_0_50px_rgba(47,129,247,0.15)]' 
                      : 'bg-[#050505] border-[#30363d] hover:border-[#484f58] hover:bg-[#161b22]/20'
                  }`}
                >
                  {user.membership.plan === config.type && (
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-[#2f81f7]" />
                  )}
                  <div className="text-[#2f81f7] mb-8 group-hover:scale-110 transition-transform">
                    {config.type === 'Free' && <LockIcon className="w-10 h-10" />}
                    {config.type === 'Pro' && <RocketIcon className="w-10 h-10" />}
                    {config.type === 'Enterprise' && <BuildingIcon className="w-10 h-10" />}
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">{config.type}</h3>
                  <div className="text-5xl font-black text-white mb-10 italic tracking-tighter">
                    ${config.price}<span className="text-xs font-bold text-[#484f58] uppercase tracking-widest not-italic ml-2">/cycle</span>
                  </div>
                  <div className="flex-1 space-y-5 mb-14">
                    {config.features.map((f) => (
                      <div key={f} className="flex items-start gap-4 text-[11px] text-[#8b949e] font-black uppercase tracking-[0.1em] italic leading-tight">
                        <ShieldIcon className="w-3.5 h-3.5 text-[#2f81f7] shrink-0 mt-0.5" /> {f}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => { if (config.type !== 'Free') setSelectedPlan(config); }}
                    disabled={user.membership.plan === config.type}
                    className={`w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${
                      user.membership.plan === config.type 
                        ? 'bg-[#161b22] text-[#484f58] border border-white/5 cursor-not-allowed' 
                        : 'bg-white text-black hover:scale-105 active:scale-95 shadow-2xl shadow-white/5'
                    }`}
                  >
                    {user.membership.plan === config.type ? 'CURRENT TIER' : 'AUTHORIZE'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-6">
                <button 
                  onClick={handleReset}
                  className="text-[10px] font-black text-[#484f58] uppercase tracking-[0.4em] hover:text-[#2f81f7] transition-all flex items-center gap-2 mx-auto"
                >
                  <span className="text-lg leading-none">←</span> RE-EVALUATE OPTIONS
                </button>
                <div className="space-y-2">
                   <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Authorization Mesh</h3>
                   <p className="text-sm text-[#8b949e] font-medium italic">Establishing logical gateway for <strong>{selectedPlan.type} Edition</strong></p>
                </div>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] p-12 rounded-[4rem] space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none group-hover:rotate-6 transition-transform duration-[3000ms]">
                   <ShieldIcon className="w-48 h-48" />
                </div>
                <div className="flex justify-between items-center pb-8 border-b border-white/5">
                  <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em]">Resource Allocation Fee</span>
                  <span className="text-4xl font-black text-white italic tracking-tighter">${selectedPlan.price}.00</span>
                </div>
                
                <div className="relative z-10 space-y-6">
                  {isProcessing ? (
                    <div className="flex flex-col items-center py-10 space-y-6">
                       <div className="w-16 h-16 border-4 border-[#2f81f7]/10 border-t-[#2f81f7] rounded-full animate-spin" />
                       <div className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Syncing Ledger Invariants...</div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleSimulatedUpgrade}
                      className="w-full bg-[#2f81f7] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 shadow-2xl shadow-[#2f81f744] transition-all flex items-center justify-center gap-3"
                    >
                      AUTHORIZE VAULT ESCALATION <RocketIcon />
                    </button>
                  )}
                  
                  <div className="flex flex-col items-center gap-4 pt-4 opacity-60">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2 text-[9px] font-black text-[#3fb950] uppercase tracking-widest">
                          <ShieldIcon className="w-3.5 h-3.5" /> SECURE GATEWAY
                       </div>
                       <div className="w-px h-3 bg-[#30363d]" />
                       <div className="flex items-center gap-2 text-[9px] font-black text-[#2f81f7] uppercase tracking-widest">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> SOC2 VERIFIED
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-[10px] text-[#484f58] text-center font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
                By authorizing this escalation, you anchor your project state to high-fidelity AI guardrails and deep RAG synthesis.
              </p>
            </div>
          )}
        </div>
        
        <div className="px-10 py-8 bg-[#050505] text-center border-t border-white/5 shrink-0">
            <div className="flex items-center justify-center gap-8 text-[9px] text-[#484f58] font-black uppercase tracking-[0.4em]">
                <span>VAULT ID: {user.membership.signature.logicHash.slice(0, 12)}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#30363d]" />
                <span>ARCH-SENTINEL-ENCRYPTION-V3</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#30363d]" />
                <span>ZERO-TRUST GATEWAY</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
