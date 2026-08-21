import * as p from "@clack/prompts";
import { WizardCancelled } from "./helpers.js";

export interface SelectOption<T> {
  value: T;
  label: string;
  hint?: string;
}

export interface WizardSelectOptions<T extends string> {
  message: string;
  options: SelectOption<T>[];
  initialValue?: T;
}

export interface WizardTextOptions {
  message: string;
  placeholder?: string;
  initialValue?: string;
  defaultValue?: string;
  validate?: (value: string) => string | undefined;
}

export interface WizardConfirmOptions {
  message: string;
  initialValue?: boolean;
}

export interface WizardSpinner {
  start: (msg?: string) => void;
  stop: (msg?: string) => void;
  message: (msg?: string) => void;
}

/**
 * Interactive surface used by the wizard. Tests inject a scripted implementation
 * so we never need a real TTY.
 */
export interface WizardUi {
  intro: (title?: string) => void;
  outro: (message?: string) => void;
  cancel: (message?: string) => void;
  select: <T extends string>(opts: WizardSelectOptions<T>) => Promise<T>;
  text: (opts: WizardTextOptions) => Promise<string>;
  confirm: (opts: WizardConfirmOptions) => Promise<boolean>;
  spinner: () => WizardSpinner;
  note: (message?: string, title?: string) => void;
  info: (message: string) => void;
  success: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

function unwrap<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Operation cancelled.");
    throw new WizardCancelled();
  }
  return value;
}

export function createClackUi(): WizardUi {
  return {
    intro: (title) => p.intro(title),
    outro: (message) => p.outro(message),
    cancel: (message) => p.cancel(message),
    async select<T extends string>(opts: WizardSelectOptions<T>): Promise<T> {
      const options = opts.options.map((option) => {
        if (option.hint === undefined) {
          return { value: option.value, label: option.label };
        }
        return { value: option.value, label: option.label, hint: option.hint };
      });
      const selectOpts: { message: string; options: typeof options; initialValue?: T } = {
        message: opts.message,
        options,
      };
      if (opts.initialValue !== undefined) {
        selectOpts.initialValue = opts.initialValue;
      }
      // clack's Option<T> conditional does not line up with exactOptionalPropertyTypes
      return unwrap(await p.select(selectOpts as never));
    },
    async text(opts: WizardTextOptions): Promise<string> {
      const textOpts: Parameters<typeof p.text>[0] = { message: opts.message };
      if (opts.placeholder !== undefined) {
        textOpts.placeholder = opts.placeholder;
      }
      if (opts.initialValue !== undefined) {
        textOpts.initialValue = opts.initialValue;
      }
      if (opts.defaultValue !== undefined) {
        textOpts.defaultValue = opts.defaultValue;
      }
      if (opts.validate !== undefined) {
        textOpts.validate = opts.validate;
      }
      // Empty Enter (placeholder-only prompts) is `undefined` from Clack, not "".
      return unwrap(await p.text(textOpts)) ?? "";
    },
    async confirm(opts: WizardConfirmOptions): Promise<boolean> {
      const confirmOpts: Parameters<typeof p.confirm>[0] = { message: opts.message };
      if (opts.initialValue !== undefined) {
        confirmOpts.initialValue = opts.initialValue;
      }
      return unwrap(await p.confirm(confirmOpts));
    },
    spinner: () => p.spinner(),
    note: (message, title) => p.note(message, title),
    info: (message) => p.log.info(message),
    success: (message) => p.log.success(message),
    warn: (message) => p.log.warn(message),
    error: (message) => p.log.error(message),
  };
}
