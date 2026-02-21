/** Display modes that indicate the PWA is running as an installed app. */
const INSTALLED_DISPLAY_MODES = [
    "standalone",
    "fullscreen",
    "minimal-ui",
] as const;

/**
 * Detects whether the app is running as an installed PWA (standalone, fullscreen,
 * or minimal-ui) vs in a browser tab.
 *
 * Heuristics (SSR-safe, robust across browsers):
 * - display-mode media queries: standalone, fullscreen, minimal-ui
 * - navigator.standalone: legacy iOS Safari, true when launched from home screen
 * - document.referrer: android-app:// indicates Trusted Web Activity (TWA)
 */
export function isPwaInstalled(): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return false;
    }

    const nav = navigator;
    const doc = document;

    // iOS Safari (pre-15.4): standalone when launched from home screen
    if ("standalone" in nav && nav.standalone === true) {
        return true;
    }

    // Android TWA / Trusted Web Activity: launched from native shell
    if (doc.referrer?.includes("android-app://")) {
        return true;
    }

    // Standard display-mode media queries (Chrome, Firefox, Edge, Safari 15.4+)
    for (const mode of INSTALLED_DISPLAY_MODES) {
        if (window.matchMedia(`(display-mode: ${mode})`).matches) {
            return true;
        }
    }

    return false;
}
