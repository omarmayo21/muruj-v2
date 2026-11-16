/**
 * Unit options now live in src/config/site.ts → `unitOptions` (single place to edit).
 * This file re-exports them for backwards compatibility.
 */
import { unitOptions } from './site';

export const UNIT_OPTIONS = unitOptions;
export const ALL_UNIT_VALUES = unitOptions.map((o) => o.value);
