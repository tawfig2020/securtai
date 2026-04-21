/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SENTINEL-PROTOCOL-V2-SECURE
 */

import { GoogleGenAI, Type } from "@google/genai";
import { 
  ImpactAnalysis, CodeFile, RuleViolation, 
  ParsedMetadata, IndexTier,
  AuditReport, AnalysisRule, CloudAuditReport,
  DependencyAuditReport, RuntimeTarget, DeveloperPersona,
  DriftAnalysisResult, DueDiligenceReport, FairnessReport,
  ImmuneReport, SignalDensityReport, ROIIntegrityReport,
  LegalAuditReport, LibraryAnalysis, RedundancyReport,
  SocraticChallenge, ProductivityAuditReport, 
  SyntheticFix, ReliabilityReport, PerformanceAuditReport,
  SecurityAuditReport, StrategicOversightReport,
  DestructionSentinelReport, ContextConfidenceReport,
  StructuralAuditReport, FederatedAuditReport
} from "../types.ts";

/**
 * robustParse
 * @description Robustly parses JSON from model responses, ensuring no 'any' leakage.
 */
function robustParse<T>(text: string | undefined): T {
  if (!text) return {} as T;
  try {
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("ArchLens: Strategic Parser Breach. Malformed JSON intercepted.", e);
    return {} as T;
  }
}

/**
 * withRetry
 * @description Higher-order retry logic with strict function typing.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    const isRateLimit = error instanceof Error && error.message.includes('429');
    if (retries > 0 && isRateLimit) {
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Generates a high-level architectural summary of a file.
 */
export async function summarizeFileLogic(file: CodeFile): Promise<string> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Lead Architect. Provide a concise architectural summary of the following file. 
      Focus on: Primary Responsibility, Key Design Patterns, and Strategic Risks.
      FILE: ${file.path}
      CONTENT:
      ${file.content.slice(0, 10000)}`,
      config: {
        maxOutputTokens: 500,
        temperature: 0.2,
      }
    });
    return response.text || "Unable to synthesize briefing for this node.";
  });
}

export async function performCodebaseAudit(codebase: CodeFile[], rules: AnalysisRule[]): Promise<AuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute deep structural remediation audit. RULES: ${JSON.stringify(rules)}.`,
      config: {
        maxOutputTokens: 16384,
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  message: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  architecturalPattern: { type: Type.STRING },
                  remediationPlan: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        command: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            toxicity: {
              type: Type.OBJECT,
              properties: {
                godObjectProbability: { type: Type.NUMBER },
                cyclicDepth: { type: Type.NUMBER },
                logicLeakageCount: { type: Type.NUMBER },
                entanglementFactor: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    });
    return robustParse<AuditReport>(response.text);
  });
}

export async function performLegalAudit(codebase: CodeFile[]): Promise<LegalAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform IP and Regulatory Audit.`,
      config: {
        maxOutputTokens: 16384,
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ipHealthScore: { type: Type.NUMBER },
            regulatoryComplianceScore: { type: Type.NUMBER },
            contaminationIncidents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  pedigree: {
                    type: Type.OBJECT,
                    properties: {
                      matchedLicense: { type: Type.STRING },
                      similarityScore: { type: Type.NUMBER },
                      matchedSource: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return robustParse<LegalAuditReport>(response.text);
  });
}

export async function performSecurityAudit(codebase: CodeFile[]): Promise<SecurityAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform high-fidelity security audit.`,
      config: {
        maxOutputTokens: 16384,
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  message: { type: Type.STRING },
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  recommendation: { type: Type.STRING }
                }
              }
            },
            leakedSecrets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  redactedValue: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return robustParse<SecurityAuditReport>(response.text);
  });
}

export async function indexFile(file: CodeFile): Promise<{ metadata: ParsedMetadata, tier: IndexTier, criticality: number }> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze file for ArchLens RAG. FILE: ${file.path}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metadata: {
              type: Type.OBJECT,
              properties: {
                exports: { type: Type.ARRAY, items: { type: Type.STRING } },
                architecturalIntent: { type: Type.STRING }
              }
            },
            tier: { type: Type.STRING },
            criticality: { type: Type.NUMBER }
          }
        }
      }
    });
    return robustParse<{ metadata: ParsedMetadata, tier: IndexTier, criticality: number }>(response.text);
  });
}

export async function analyzeCodeImpact(fileName: string, content: string, rules: AnalysisRule[]): Promise<ImpactAnalysis> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze impact for ${fileName}.`,
      config: {
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            affectedNodes: { type: Type.ARRAY, items: { type: Type.STRING } },
            rationale: { type: Type.STRING }
          }
        }
      }
    });
    return robustParse<ImpactAnalysis>(response.text);
  });
}

export async function runSimulatedTestSuite(files: CodeFile[], proposal: string): Promise<unknown> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform test scrutiny.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<unknown>(response.text);
  });
}

export async function performSemanticSearch(query: string, codebase: CodeFile[]): Promise<unknown> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform semantic search: "${query}".`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<unknown>(response.text);
  });
}

export async function generateSyntheticFix(file: CodeFile, violation: RuleViolation, codebase: CodeFile[], personaType: string): Promise<SyntheticFix> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate fix for: ${violation.message}.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<SyntheticFix>(response.text);
  });
}

export async function performCloudInfrastructureAudit(codebase: CodeFile[]): Promise<CloudAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audit cloud infra.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<CloudAuditReport>(response.text);
  });
}

export async function performDependencySupplyChainAudit(codebase: CodeFile[], runtime: RuntimeTarget): Promise<DependencyAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audit supply chain.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<DependencyAuditReport>(response.text);
  });
}

export async function compareCodebaseVersions(old: string, current: string, path: string): Promise<DriftAnalysisResult> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Compare versions for ${path}.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<DriftAnalysisResult>(response.text);
  });
}

export async function performDueDiligenceAudit(codebase: CodeFile[]): Promise<DueDiligenceReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform due diligence.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<DueDiligenceReport>(response.text);
  });
}

export async function performFairnessAudit(codebase: CodeFile[]): Promise<FairnessReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform ethics audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<FairnessReport>(response.text);
  });
}

export async function performImmuneAudit(codebase: CodeFile[]): Promise<ImmuneReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform immunity audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<ImmuneReport>(response.text);
  });
}

export async function performSignalAudit(codebase: CodeFile[]): Promise<SignalDensityReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze signal density.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<SignalDensityReport>(response.text);
  });
}

export async function performROIIntegrityAudit(codebase: CodeFile[]): Promise<ROIIntegrityReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform ROI integrity audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<ROIIntegrityReport>(response.text);
  });
}

export async function analyzeLibraryInvariants(packageName: string, version: string, rules: AnalysisRule[]): Promise<LibraryAnalysis> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze ${packageName}@${version}.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<LibraryAnalysis>(response.text);
  });
}

export async function performRedundancyAudit(codebase: CodeFile[]): Promise<RedundancyReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform redundancy audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<RedundancyReport>(response.text);
  });
}

export async function generateSocraticChallenge(file: CodeFile, persona: DeveloperPersona): Promise<SocraticChallenge> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate challenge for ${file.path}.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<SocraticChallenge>(response.text);
  });
}

export async function performProductivityAudit(codebase: CodeFile[]): Promise<ProductivityAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit productivity.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<ProductivityAuditReport>(response.text);
  });
}

export async function performReliabilityAudit(codebase: CodeFile[]): Promise<ReliabilityReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform reliability audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<ReliabilityReport>(response.text);
  });
}

export async function performPerformanceAudit(codebase: CodeFile[]): Promise<PerformanceAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform scale/perf audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<PerformanceAuditReport>(response.text);
  });
}

export async function performStrategicOversight(codebase: CodeFile[]): Promise<StrategicOversightReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform oversight.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<StrategicOversightReport>(response.text);
  });
}

export async function performDestructionAudit(codebase: CodeFile[]): Promise<DestructionSentinelReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Scan destruction risk.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<DestructionSentinelReport>(response.text);
  });
}

export async function performContextConfidenceAudit(codebase: CodeFile[]): Promise<ContextConfidenceReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit confidence.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<ContextConfidenceReport>(response.text);
  });
}

export async function performStructuralAudit(codebase: CodeFile[]): Promise<StructuralAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform structural audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<StructuralAuditReport>(response.text);
  });
}

export async function performFederatedMeshAudit(files: CodeFile[]): Promise<FederatedAuditReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform Mesh Audit.`,
      config: { responseMimeType: "application/json" }
    });
    return robustParse<FederatedAuditReport>(response.text);
  });
}
