/**
 * Operator safety: typed confirmation for trash / erase / permanent delete.
 */
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export const TYPED_CONFIRM_DELETE = "DELETE";

export interface TypedConfirmationSpec {
  confirmation?: "none" | "typed";
}

export interface ConfirmDestructiveOptions {
  operation: string;
  resource: string;
  rowCount: number;
  skipConfirmation?: boolean;
  dryRun?: boolean;
  prompt?: (question: string) => Promise<string>;
  log?: (message: string) => void;
}

export function isTypedConfirmation(value: string, resource: string): boolean {
  const trimmed = value.trim();
  return trimmed === TYPED_CONFIRM_DELETE || trimmed === resource;
}

export function operationRequiresTypedConfirmation(
  spec: TypedConfirmationSpec | undefined,
): boolean {
  return spec?.confirmation === "typed";
}

export function formatTypedConfirmationPrompt(
  operation: string,
  resource: string,
  rowCount: number,
): string {
  return `This will ${operation} ${rowCount} ${resource} records. Type "${resource}" or "${TYPED_CONFIRM_DELETE}" to confirm: `;
}

export async function promptLine(question: string): Promise<string> {
  const rl = createInterface({ input, output });
  try {
    return await rl.question(question);
  } finally {
    rl.close();
  }
}

/**
 * Returns true when the operator confirmed (or confirmation is skipped).
 * Dry-run and --skip-confirmation never prompt.
 */
export async function confirmDestructiveOperation(
  options: ConfirmDestructiveOptions,
): Promise<boolean> {
  if (options.dryRun === true) {
    return true;
  }
  if (options.skipConfirmation === true) {
    options.log?.(
      "Skipping typed confirmation (--skip-confirmation). DANGEROUS — use only in automated scripts.",
    );
    return true;
  }
  const question = formatTypedConfirmationPrompt(
    options.operation,
    options.resource,
    options.rowCount,
  );
  const ask = options.prompt ?? promptLine;
  const answer = await ask(question);
  return isTypedConfirmation(answer, options.resource);
}
