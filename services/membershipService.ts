import { UserProfile, PlanType, BillingEvent } from '../types.ts';

export async function hydrateFromDatabase(email: string): Promise<boolean> {
  // Simulated DB hydration
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
}

export function deductTokens(user: UserProfile, action: string): UserProfile {
  const cost = 5; // Fixed cost for simplicity
  if (user.membership.tokens.total - user.membership.tokens.consumed < cost) {
    throw new Error("Insufficient ArchLens Tokens. Vault Lock engaged.");
  }
  return {
    ...user,
    membership: {
      ...user.membership,
      tokens: {
        ...user.membership.tokens,
        consumed: user.membership.tokens.consumed + cost,
        // DRIFT-FIX: ISO-8601 replaces Date.now()
        lastUpdated: new Date().toISOString()
      }
    }
  };
}

export function processTierUpgrade(user: UserProfile, tier: PlanType): UserProfile {
  const tokenLimits = { Free: 100, Pro: 1000, Enterprise: 10000 };
  return {
    ...user,
    membership: {
      ...user.membership,
      plan: tier,
      tokens: {
        ...user.membership.tokens,
        total: tokenLimits[tier]
      }
    }
  };
}

export function validateTierAccess(user: UserProfile, requiredTier: PlanType): boolean {
  const tiers: PlanType[] = ['Free', 'Pro', 'Team', 'Enterprise'];
  return tiers.indexOf(user.membership.plan) >= tiers.indexOf(requiredTier);
}

export function calculateDaysRemaining(expiryDate: string): number {
  const expiry = new Date(expiryDate).getTime();
  const now = new Date().getTime();
  const diff = expiry - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getLedger(): BillingEvent[] {
  // Standardizing legacy offsets to ISO format
  const getOffsetISO = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
  const getOffsetHoursISO = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

  return [
    {
      id: 'TX-9901',
      userEmail: 'dev@globovill.com',
      type: 'TOKEN_REPLENISHMENT',
      amount: 49.00,
      currency: 'USD',
      timestamp: getOffsetISO(2),
      status: 'success',
      credits: 1000,
      description: 'Pro Tier Logic Credits Allocated',
      ledgerSignature: 'AL-SEC-TX-PRO-7712-A09'
    },
    {
      id: 'TX-8821',
      userEmail: 'dev@globovill.com',
      type: 'AUDIT_CONSUMPTION',
      amount: 0,
      currency: 'USD',
      timestamp: getOffsetISO(1),
      status: 'success',
      credits: -50,
      description: 'Deep Audit: src/services/AuthService.ts',
      ledgerSignature: 'AL-SEC-TX-AUD-1123-B42'
    },
    {
      id: 'TX-7732',
      userEmail: 'dev@globovill.com',
      type: 'DNA_SYNC',
      amount: 0,
      currency: 'USD',
      timestamp: getOffsetHoursISO(4),
      status: 'success',
      credits: -10,
      description: 'Developer DNA Logical Mirroring',
      ledgerSignature: 'AL-SEC-TX-DNA-9901-C15'
    }
  ];
}
