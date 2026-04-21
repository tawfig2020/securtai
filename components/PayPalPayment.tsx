/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-PAYMENT-GATEWAY-DEACTIVATED
 */

import React from 'react';
import { PlanConfig } from '../types';
import { ShieldIcon, AlertIcon } from './Icons';

interface Props {
  plan: PlanConfig;
  onSuccess: (details: any) => void;
  onError: (err: any) => void;
}

/**
 * PayPalPayment (DEACTIVATED)
 * @description This gateway is currently inactive to prevent configuration collisions.
 */
const PayPalPayment: React.FC<Props> = ({ plan }) => {
  return (
    <div className="w-full p-8 bg-[#f851490a] border border-[#f8514933] rounded-[2rem] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
       <div className="p-4 bg-[#f8514911] rounded-2xl text-[#f85149] border border-[#f8514922]">
          <AlertIcon className="w-8 h-8" />
       </div>
       <div className="space-y-2">
          <div className="text-[12px] font-black text-[#f85149] uppercase tracking-[0.3em]">Gateway Inactive</div>
          <p className="text-xs text-[#8b949e] font-medium italic leading-relaxed">
             The external payment mesh for <strong>{plan.type} Edition</strong> is currently restricted. Please use Simulated Authorization.
          </p>
       </div>
       <div className="flex items-center gap-3 pt-4 border-t border-[#f8514911] w-full justify-center">
          <ShieldIcon className="w-3 h-3 text-[#f85149]" />
          <span className="text-[9px] font-black text-[#484f58] uppercase tracking-widest">Sovereign Mode Engaged</span>
       </div>
    </div>
  );
};

export default PayPalPayment;
