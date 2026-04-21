/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-RAG-ENGINE-SENTINEL-V2
 */

import { 
  CodeFile, DependencyNode, DependencyLink, ImpactAnalysis, 
  ToxicityMetrics, ParsedMetadata, Language 
} from "../types.ts";
import * as gemini from "./geminiService.ts";
import { initializeWasmParser, parseStructuralMetadata } from "./wasmParserService.ts";

let _isIndexing = false;
const _metadataCache = new Map<string, { hash: string, timestamp: string, dependencies: string[] }>();

function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function calculateToxicity(file: CodeFile, metadata: ParsedMetadata): ToxicityMetrics {
  let leakage = 0;
  const isUI = file.path.includes('components') || file.path.includes('View');
  const importsDB = metadata.imports?.some((i: { source: string }) => i.source.includes('database') || i.source.includes('db') || i.source.includes('connection'));
  if (isUI && importsDB) leakage += 40;

  const entanglement = (metadata.imports?.length || 0) / (metadata.exports?.length || 1);

  return {
    godObjectProbability: file.content.length > 5000 ? 80 : 20,
    logicLeakageCount: leakage > 0 ? 1 : 0,
    cyclicDepth: 0,
    entanglementFactor: entanglement,
    redundancyFactor: 0,
    observabilityGap: metadata.observabilityGap || 0,
    dependencyRiskScore: metadata.dependencyRiskScore || 0,
    cloudSecurityGap: metadata.cloudSecurityGap || 0,
    securityVulnerabilityCount: metadata.securityVulnerabilityCount || 0
  };
}

export async function indexCodebase(files: CodeFile[], onProgress?: (p: number, msg: string) => void) {
  if (_isIndexing) return;
  _isIndexing = true;

  try {
    await initializeWasmParser();

    const nodes: DependencyNode[] = [];
    const links: DependencyLink[] = [];

    const CHUNK_SIZE = 3;
    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      const chunk = files.slice(i, i + CHUNK_SIZE);
      
      await Promise.all(chunk.map(async (file) => {
        const currentHash = generateContentHash(file.content);
        const cached = _metadataCache.get(file.path);

        if (!(cached && cached.hash === currentHash)) {
          try {
            const { metadata: structuralMetadata } = await parseStructuralMetadata(file.content, file.language as Language);
            const result = await gemini.indexFile(file);

            file.metadata = { ...structuralMetadata, ...result.metadata };
            file.tier = result.tier;
            file.toxicity = calculateToxicity(file, file.metadata);

            _metadataCache.set(file.path, {
              hash: currentHash,
              // DRIFT-FIX: ISO string for metadata tracking
              timestamp: new Date().toISOString(),
              dependencies: file.metadata.imports?.map((imp: { source: string }) => imp.source) || []
            });
          } catch (e) {
            console.error(`ArchLens Indexing Error: ${file.path}`, e);
          }
        }

        nodes.push({
          id: file.path,
          label: file.name,
          type: 'file',
          group: file.language === 'typescript' ? 1 : 2,
          tier: file.tier || 'Implementation',
          toxicity: file.toxicity?.godObjectProbability || 0,
          intent: file.metadata?.architecturalIntent || 'Implementation core',
          criticality: file.tier === 'Architectural' ? 100 : 30
        });

        if (file.metadata?.imports) {
          file.metadata.imports.forEach((imp: { source: string }) => {
            const target = files.find(f => f.path.includes(imp.source))?.path;
            if (target) {
              links.push({ source: file.path, target, relationship: 'import' });
            }
          });
        }
      }));

      if (onProgress) {
        onProgress(((i + chunk.length) / files.length) * 100, `Syncing knowledge Layer... [${Math.min(i + chunk.length, files.length)}/${files.length}]`);
      }
    }

    return { nodes, links };
  } finally {
    _isIndexing = false;
  }
}

export function getImpactWindow(targetPath: string, allFiles: CodeFile[]): CodeFile[] {
  const impactSet = new Set([targetPath]);
  return allFiles.filter(f => impactSet.has(f.path));
}

export async function validateProposedChange(file: CodeFile, newContent: string, windowFiles: CodeFile[], rules: unknown): Promise<ImpactAnalysis> {
  const { localViolations } = await parseStructuralMetadata(newContent, file.language as Language);
  const [base, tests] = await Promise.all([
    gemini.analyzeCodeImpact(file.name, newContent, rules as any),
    gemini.runSimulatedTestSuite(windowFiles, newContent)
  ]);
  return { ...base, ruleViolations: [...localViolations, ...base.ruleViolations], testValidation: tests };
}

export async function searchCodebase(query: string, codebase: CodeFile[]) {
  return gemini.performSemanticSearch(query, codebase);
}
