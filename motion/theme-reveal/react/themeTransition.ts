import type { ThemePreference } from './theme';
import { chooseTheme } from './theme';
import '../theme-reveal.js';
import './themeTransition.css';

type ThemeAPI = { switchTheme: (theme: ThemePreference, origin?: HTMLElement | null, options?: { apply: (value: ThemePreference) => void }) => Promise<void> };
/** The portable controller owns the reversible snapshot pair; the app owns persistence. */
export function transitionTheme(theme: ThemePreference, element?: HTMLElement | null) {
  return (globalThis as typeof globalThis & { SwThemeReveal: ThemeAPI }).SwThemeReveal.switchTheme(theme, element, { apply: chooseTheme });
}
