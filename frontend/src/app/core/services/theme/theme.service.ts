import { effect, inject, Injectable, signal } from '@angular/core';
import { THEME_CONFIG, Theme } from './theme.config';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly config = inject(THEME_CONFIG);

  /** Current theme. Drives the DOM via the effect below. */
  readonly theme = signal<Theme>(this.guessFromTime());

  constructor() {
    // Truly reactive: the effect reads theme(), so any signal update re-applies it.
    effect(() => this.applyToDom(this.theme()));
    this.initSystemSync();
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private applyToDom(theme: Theme): void {
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      /* ignore when DOM not available (SSR) */
    }
  }

  private guessFromTime(): Theme {
    try {
      const h = new Date().getHours();
      return h >= this.config.dayStartHour && h < this.config.dayEndHour ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }

  /** Sync with the system preference and keep listening for changes. */
  private initSystemSync(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mq = window.matchMedia(this.config.darkMediaQuery);
    this.theme.set(mq.matches ? 'dark' : 'light');

    try {
      mq.addEventListener('change', (ev: MediaQueryListEvent) => {
        this.theme.set(ev.matches ? 'dark' : 'light');
      });
    } catch {
      /* older browsers without addEventListener on MediaQueryList */
    }
  }
}
