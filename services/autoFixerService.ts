import { CodeFile, RuleViolation, SyntheticFix, DeveloperPersona } from '../types.ts';
import * as gemini from './geminiService.ts';

const _activeFixes = new Map<string, any>();
let _isProcessing = false;

const getViolationKey = (file: CodeFile, violation: RuleViolation): string => {
  return `${file.path}:${violation.ruleId}:${violation.line}`;
};

export async function provideCodeActions(
  file: CodeFile, 
  violation: RuleViolation, 
  codebase: CodeFile[], 
  persona?: DeveloperPersona,
  onUpdate?: () => void
): Promise<SyntheticFix | null> {
  const key = getViolationKey(file, violation);
  _activeFixes.set(key, { status: 'generating' });
  if (onUpdate) onUpdate();

  try {
    _isProcessing = true;
    const fix = await gemini.generateSyntheticFix(file, violation, codebase, persona?.type || 'Senior');
    _activeFixes.set(key, { fix, status: 'ready' });
    if (onUpdate) onUpdate();
    return fix;
  } catch (e) {
    _activeFixes.set(key, { status: 'error' });
    if (onUpdate) onUpdate();
    return null;
  } finally {
    _isProcessing = false;
  }
}

export function isAutoFixerProcessing(): boolean {
  return _isProcessing;
}