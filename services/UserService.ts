/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-USER-LOGIC-SENTINEL
 */

import { UserProfile, SanitizedIdentity } from '../types.ts';
import * as dbService from './databaseService.ts';
import * as security from './securityService.ts';

/**
 * transformToShieldedProfile
 * @description Internal gate that performs an atomic PII transformation.
 * Ensures raw user data is cryptographically anchored before entering the persistence stream.
 */
const transformToShieldedProfile = (user: UserProfile): UserProfile => {
  return {
    ...user,
    id: security.vaultEncrypt(user.id),
    email: security.vaultEncrypt(user.email),
    membership: {
      ...user.membership,
      dbSynced: true
    }
  };
};

/**
 * saveUserRecord
 * @description Mediates the persistence of user identity data with mandatory PII isolation.
 * @security STRAT-SEC-001: Scrutinizes and shields PII at the service boundary.
 * @compliance GDPR-P3: Implements robust encryption for 'email' and 'id' fields.
 * @arch-drift-fix: Standardized UTC ISO-8601 timestamps and removed implicit 'any' usage.
 * @param user The raw UserProfile signature to anchor.
 */
export const saveUserRecord = async (user: UserProfile): Promise<boolean> => {
  // DRIFT-FIX: Explicit ISO-8601 string for global temporal consistency.
  const anchorTime = new Date().toISOString();

  // PII-ISOLATION: Shielding critical identity fragments before any logic processing.
  const secureProfile = transformToShieldedProfile(user);

  const sanitizedIdentity: SanitizedIdentity = {
    secureId: secureProfile.id,
    secureEmail: secureProfile.email,
    org: user.organization?.name || 'CITADEL_CORE',
    plan: user.membership.plan,
    timestamp: anchorTime,
  };

  // LOGGING: Only capture the shielded logic signature (first 12 chars) to prevent leak.
  console.debug(`ArchLens: Anchoring logical identity [${sanitizedIdentity.secureId.slice(0, 12)}...]`);

  try {
    // PERSISTENCE: Database layer receives a strictly typed, shielded profile.
    const success = await dbService.syncUserProfile(secureProfile);
    
    if (success) {
      console.info('ArchLens: Identity Anchor synchronized via SECURE_V1 Handshake.');
    }
    
    return success;
  } catch (error: unknown) {
    // DRIFT-FIX: Structural error handling prevents 'any' type leakage.
    const message = error instanceof Error ? error.message : "Unknown Strategic Breach";
    console.error(`ArchLens: Persistence Failure. Details: ${message}`);
    return false;
  }
};
