import { InjectionToken } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Configuration for the app theme system.
 * Kept as a non-class dependency so it can be swapped per environment
 * without touching ThemeService.
 */
export interface ThemeConfig {
  /** Hour (0-23) at which the light theme starts when guessing by time. */
  dayStartHour: number;
  /** Hour (0-23) at which the dark theme starts when guessing by time. */
  dayEndHour: number;
  /** Media query used to read the system colour-scheme preference. */
  darkMediaQuery: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  dayStartHour: 7,
  dayEndHour: 19,
  darkMediaQuery: '(prefers-color-scheme: dark)',
};

export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG');
