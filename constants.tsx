import { CodeFile, Activity, PlanConfig, AnalysisRule } from './types.ts';

export const MOCK_CODEBASE: CodeFile[] = [
  {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    lastModified: '2025-01-22T08:00:00Z',
    content: `{
  "name": "arch-sentinel-citadel",
  "version": "2.5.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lodash": "4.17.15",
    "fs-extra": "^11.2.0",
    "archlens-phantom-scanner": "1.0.0",
    "axios": "0.19.0"
  }
}`
  },
  {
    path: 'src/App.tsx',
    name: 'App.tsx',
    language: 'typescript',
    lastModified: '2025-01-20T10:00:00Z',
    content: `import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';

export const App = () => {
  const [active, setActive] = useState(true);
  return (
    <div className="app-container">
      <Dashboard status={active} />
    </div>
  );
};`
  },
  {
    path: 'src/services/LegacyProcessor.ts',
    name: 'LegacyProcessor.ts',
    language: 'typescript',
    lastModified: '2025-01-10T09:00:00Z',
    content: `/**
 * @license
 * Institutional Legacy Logic. This file contains "stiff" patterns that resist extension.
 */
export const processReport = (type: string, data: any) => {
  // STIFFNESS RISK: Massive conditional chain instead of Strategy pattern
  if (type === 'PDF') {
    console.log('Generating PDF...');
  } else if (type === 'JSON') {
    console.log('Generating JSON...');
  } else if (type === 'CSV') {
    console.log('Generating CSV...');
  } else if (type === 'XML') {
    console.log('Generating XML...');
  } else {
    throw new Error('Unsupported format');
  }

  const config = (window as any).GLOBAL_CONFIG;
  if (config.isVerbose) {
    console.log('Processed data:', data);
  }
};`
  },
  {
    path: 'src/services/UserService.ts',
    name: 'UserService.ts',
    language: 'typescript',
    lastModified: '2025-01-18T12:00:00Z',
    content: `/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems.
 */
import { UserProfile } from '../types.ts';
import { dbService } from './databaseService.ts';

/**
 * Mediates the persistence of user identity data with PII stripping.
 */
export const saveUserRecord = async (user: UserProfile) => {
  const sanitized = { email: user.email, timestamp: Date.now() };
  return await dbService.syncUserProfile(user);
};`
  },
  {
    path: 'src/components/Dashboard.tsx',
    name: 'Dashboard.tsx',
    language: 'typescript',
    lastModified: '2025-01-21T14:30:00Z',
    content: `import React, { useMemo, useEffect } from 'react';
import { SandboxInstance } from '../types.ts';

/**
 * Dashboard implementation with memoization and leak protection.
 */
export const Dashboard = ({ sandboxes }: { sandboxes: SandboxInstance[] }) => {
  const efficiency = useMemo(() => sandboxes.map(s => s.computeLoad), [sandboxes]);
  
  useEffect(() => {
    const id = setInterval(() => console.log('Pulse...'), 5000);
    return () => clearInterval(id);
  }, []);

  return <div className="p-4 bg-black text-white">Citadel Ready</div>;
};`
  }
];

export const ARCH_RULES: AnalysisRule[] = [
  { id: 'RULE-001', name: 'Circular Dependency Prevention', severity: 'error' },
  { id: 'RULE-003', name: 'Prop Drilling Detection', severity: 'warning' },
  { id: 'RULE-005', name: 'Layer Isolation: UI -> DB leakage', severity: 'error' },
  { id: 'RULE-006', name: 'Type Purity: Strict "any" avoidance', severity: 'warning' },
  { id: 'RULE-008', name: 'Architectural Monolith Prevention', severity: 'error' },
  { id: 'RULE-011', name: 'Naming: camelCase Standards', severity: 'info' },
  { id: 'RULE-014', name: 'Documentation: JSDoc Provenance', severity: 'info' },
  { id: 'RULE-016', name: 'Logic Depth: Nesting Limitation', severity: 'warning' },
  { id: 'RULE-019', name: 'Functional Monolith Prevention', severity: 'error' }
];

export const MOCK_ACTIVITY: Activity[] = [
  { id: 'ACT-001', user: 'Alex Rivera', action: 'Deployed Sentinel-V2 to Production', timestamp: '2 mins ago', impact: 'positive' },
  { id: 'ACT-002', user: 'System', action: 'Structural Audit: Identified Stiff Pattern in LegacyProcessor.ts', timestamp: '1 hour ago', impact: 'negative' }
];

export const PLAN_CONFIGS: PlanConfig[] = [
  { 
    type: 'Free', price: 0, limits: { credits: 100, apiRequests: 1000 },
    features: ['100 Tokens / Cycle', 'Static Graph', 'Basic Sentinel']
  },
  { 
    type: 'Pro', price: 49, limits: { credits: 1000, apiRequests: 10000 },
    features: ['1,000 Tokens / Cycle', 'Dynamic RAG', 'Advanced Guardrails']
  },
  { 
    type: 'Enterprise', price: 499, limits: { credits: 10000, apiRequests: 100000 },
    features: ['Unlimited Tokens', 'Custom Logic Registry', 'Priority AI Models']
  }
];

export const MOCK_TEAM = [
  { id: 'TM-001', name: 'Alex Rivera', role: 'Architect', status: 'online' }
];

export const GITHUB_ACTION_YAML = `name: ArchLens Continuity Guard

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  architectural-audit:
    name: Deep Scrutiny & Invariant Enforcement
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Sovereign Codebase
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Initialize ArchLens Sentinel
        uses: archlens/sentinel-action@v2.5
        with:
          api-key: \${{ secrets.ARCHLENS_API_KEY }}
          mode: 'blocking'
          enforce-hard-mandates: true
          audit-level: 'Deep'
          threshold-severity: 'error'

      - name: Verify Logic Sovereignty
        run: |
          archlens-cli audit --tier Architectural --output-format sarif > archlens-results.sarif

      - name: Upload Security Results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: archlens-results.sarif
          category: 'ArchLens Invariants'
`;