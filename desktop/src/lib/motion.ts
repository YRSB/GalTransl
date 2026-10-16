import { useEffect, useState } from 'react';

/**
 * GalTransl Desktop — Motion Design Tokens & Utilities
 *
 * Single source of truth for animation durations, easings, and motion helpers.
 * CSS animations should reference these values via CSS custom properties
 * defined in tokens.css; JS-driven timers should import from here.
 */

// ── Durations ──────────────────────────────────────────
export const DUR = {
  /** Micro feedback (hover, press) */
  micro: 120,
  /** Fast transition (sidebar collapse, tab switch) */
  fast: 200,
  /** Standard enter/exit (page transition, card appear) */
  standard: 300,
  /** Emphasized motion (hero progress, launch charge) */
  emphasized: 500,
  /** Celebration / complex sequences */
  celebration: 800,
} as const;

// ── Easings ────────────────────────────────────────────
export const EASE = {
  /** Default ease for most UI transitions */
  default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  /** Deceleration (entering elements) */
  decel: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Acceleration (exiting elements) */
  accel: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Sharp — material-style standard */
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  /** Spring overshoot (celebrations, badge pop) */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Smooth bar fill */
  barFill: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

// ── Translate-page motion timing (JS-driven) ───────────
export const LAUNCH = {
  chargeMs: DUR.emphasized,
  blastMs: 600,
  particleCount: 12,
  particleDistanceMin: 30,
  particleDistanceMax: 80,
  rippleMs: 600,
  particleMs: 700,
} as const;

export const STRIP_BOOT = {
  scanMs: 500,
  glowMs: 800,
  totalMs: 1200,
} as const;

export const BAR_SURGE = {
  ms: 800,
} as const;

export const COMPLETE = {
  celebrateMs: 1200,
  barGlowMs: 800,
  badgePopMs: 600,
} as const;

/** How long a fresh success row stays highlighted */
export const FRESH_HIGHLIGHT_MS = 2200;

// ── reduced-motion helper ──────────────────────────────

/** Checks if the user or operating system requested reduced motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
}

/**
 * React hook observing the system reduced-motion preference.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

