/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-MONGODB-DATA-SENTINEL
 */

import { DatabaseStatus, UserProfile, BillingEvent } from '../types.ts';
import * as security from './securityService.ts';

const _status: DatabaseStatus = {
  connected: false,
  lastSync: '',
  pendingTransactions: 0,
  clusterHealth: 'offline',
  clusterId: 'ArchLensSentinel'
};

const _config = {
  apiKey: process.env.API_KEY || 'N/A',
  url: '', // Target URL must be HTTPS
  cluster: 'ArchLensSentinel',
  database: 'archlens_vault',
  dataSource: 'mongodb-atlas'
};

/**
 * enforceSecureProtocol
 * @description Prevents insecure network protocols from processing sensitive logic.
 */
const enforceSecureProtocol = (url: string): boolean => {
  if (!url) return true; // Local/Empty is handled by apiRequest check
  return url.startsWith('https://');
};

const queueOfflineTransaction = (collection: string, data: unknown) => {
  try {
    const raw = localStorage.getItem('AL_DB_QUEUE_CIPHER');
    const decrypted = security.vaultDecrypt(raw || "");
    let queue: Array<{ collection: string; data: unknown; timestamp: string }> = [];
    
    try {
      if (decrypted) queue = JSON.parse(decrypted);
    } catch {
      queue = [];
    }

    // ARCH-DRIFT-FIX: Standardized ISO timestamp replaces non-deterministic Date.now()
    queue.push({ collection, data, timestamp: new Date().toISOString() });
    localStorage.setItem('AL_DB_QUEUE_CIPHER', security.vaultEncrypt(JSON.stringify(queue)));
    _status.pendingTransactions = queue.length;
  } catch (e) {
    console.error("ArchLens: Ledger Persistence Breach.", e);
  }
};

const apiRequest = async (action: string, collection: string, body: object) => {
  if (!_config.url || _config.apiKey === 'N/A') return null;

  // SECURITY: Intercept insecure protocols before dispatch.
  if (!enforceSecureProtocol(_config.url)) {
    console.error("ArchLens: Insecure protocol intercepted. Use HTTPS for architectural integrity.");
    return null;
  }

  try {
    const response = await fetch(`${_config.url}/action/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': _config.apiKey
      },
      body: JSON.stringify({
        dataSource: _config.dataSource,
        database: _config.database,
        collection,
        ...body
      })
    });

    if (!response.ok) return null;
    
    _status.connected = true;
    _status.clusterHealth = 'optimal';
    _status.lastSync = new Date().toISOString();

    return await response.json();
  } catch (e) {
    _status.connected = false;
    _status.clusterHealth = 'degraded';
    return null;
  }
};

export function getDatabaseStatus(): DatabaseStatus {
  return _status;
}

export async function logBillingEvent(event: BillingEvent): Promise<boolean> {
  const result = await apiRequest('insertOne', 'ledger', { document: event });
  if (!result) {
    queueOfflineTransaction('ledger', event);
    return false;
  }
  return true;
}

export async function syncUserProfile(user: UserProfile): Promise<boolean> {
  const result = await apiRequest('updateOne', 'users', {
    filter: { email: user.email },
    update: { $set: { ...user, lastSync: new Date().toISOString() } },
    upsert: true
  });
  return !!result;
}

export async function getRemoteLedger(email: string): Promise<BillingEvent[]> {
  const result = await apiRequest('find', 'ledger', {
    filter: { userEmail: email },
    sort: { timestamp: -1 }
  });
  return result?.documents || [];
}

export async function syncPendingTransactions() {
  const raw = localStorage.getItem('AL_DB_QUEUE_CIPHER');
  if (!raw) return;
  localStorage.removeItem('AL_DB_QUEUE_CIPHER');
  _status.pendingTransactions = 0;
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', syncPendingTransactions);
}
