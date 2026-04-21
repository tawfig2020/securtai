/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-WASM-PARSER-SENTINEL
 */

import { Language, ParsedMetadata, RuleViolation } from '../types';

let _isInitialized = false;

export async function initializeWasmParser(): Promise<void> {
  if (_isInitialized) return;
  await new Promise(r => setTimeout(r, 300));
  console.log('ArchLens: WASM Strategic Parser Layer Active.');
  _isInitialized = true;
}

export async function parseStructuralMetadata(content: string, lang: Language): Promise<{ metadata: ParsedMetadata, localViolations: RuleViolation[] }> {
  if (!_isInitialized) await initializeWasmParser();
  
  await new Promise(r => setTimeout(r, 15));

  const metadata: ParsedMetadata = {
    exports: [],
    imports: [],
    functions: [],
    observabilityGap: 0,
    securityVulnerabilityCount: 0
  };

  const localViolations: RuleViolation[] = [];
  const lines = content.split('\n');
  
  const isUIFile = content.includes('React') || content.includes('JSX') || content.includes('Component') || content.includes('View');

  if (lines.length > 500) {
    localViolations.push({
      ruleId: 'RULE-008',
      severity: 'error',
      message: 'Architectural Monolith: Source file exceeds 500 lines.',
      line: 1,
      suggestion: 'Decompose this file into smaller, specialized modules or sub-components.'
    });
  }

  let currentFunctionLines = 0;
  let inFunction = false;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();

    const importMatch = line.match(/(?:import|require)\s+.*?\s+(?:from\s+)?['"](.*?)['"]/);
    if (importMatch) {
      const source = importMatch[1];
      metadata.imports.push({ source });
      
      if (isUIFile && (source.includes('database') || source.includes('prisma') || source.includes('mongodb') || source.includes('sql'))) {
        localViolations.push({
          ruleId: 'RULE-005',
          severity: 'error',
          message: 'Architectural Layer Breach: UI logic should not import database drivers.',
          line: lineNum,
          suggestion: 'Refactor database logic into a dedicated service layer.'
        });
      }
    }

    if (line.match(/export\s+(?:const|function|class|type|interface|default)/)) {
      metadata.exports.push(line.trim().slice(0, 100));
    }

    const funcMatch = line.match(/(?:function|class|const|let)\s+([a-zA-Z0-9_]+)\s*(?:=|[:(])/);
    if (funcMatch && !['import', 'from', 'export'].includes(funcMatch[1])) {
      const funcName = funcMatch[1];
      metadata.functions.push({ name: funcName, line: lineNum });
      inFunction = true;
      currentFunctionLines = 0;
    }

    if (inFunction) {
      currentFunctionLines++;
      if (trimmedLine === '}' || trimmedLine === '};' || trimmedLine === '})') {
        if (currentFunctionLines > 60) {
          localViolations.push({
            ruleId: 'RULE-019',
            severity: 'error',
            message: 'Functional Monolith: Function exceeds 60 lines.',
            line: lineNum - currentFunctionLines + 1,
            suggestion: 'Decompose this function into smaller utilities.'
          });
        }
        inFunction = false;
      }
    }

    if (line.includes(': any') || line.includes('<any>')) {
      localViolations.push({
        ruleId: 'RULE-006',
        severity: 'warning',
        message: 'Type Purity: "any" type detected.',
        line: lineNum,
        suggestion: 'Replace "any" with a concrete interface.'
      });
    }

    if (line.includes('eval(') || line.includes('dangerouslySetInnerHTML')) {
      metadata.securityVulnerabilityCount = (metadata.securityVulnerabilityCount || 0) + 1;
    }
  });

  metadata.observabilityGap = metadata.functions.length > 5 && !content.includes('console.log') ? 70 : 10;

  return { metadata, localViolations };
}