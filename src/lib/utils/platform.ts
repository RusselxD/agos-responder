export type Platform = "android" | "ios" | "unknown";

interface NavigatorUAData {
    platform?: string;
    getHighEntropyValues?(hints: string[]): Promise<{
        platform?: string;
        platformVersion?: string;
    }>;
}

declare global {
    interface Navigator {
        userAgentData?: NavigatorUAData;
    }
}

/**
 * Detects the current platform for install prompts (Android PWA vs iOS Add to Home Screen).
 *
 * Heuristics:
 * - Android: UA contains "Android", or userAgentData.platform is "Android"
 * - iOS: UA contains iPhone/iPad/iPod, or iPad on iPadOS 13+ in "Request Desktop
 *   Website" mode (reports MacIntel + maxTouchPoints > 1)
 */
export function detectPlatform(): Platform {
    if (typeof navigator === "undefined" || typeof document === "undefined") {
        return "unknown";
    }

    const ua = navigator.userAgent ?? "";
    const platform = navigator.platform ?? "";

    if (isAndroid(ua)) {
        return "android";
    }

    if (isIos(ua, platform)) {
        return "ios";
    }

    return "unknown";
}

function isAndroid(ua: string): boolean {
    // User-Agent Client Hints (Chromium) - most reliable when available
    const uaData = navigator.userAgentData;
    if (uaData?.platform?.toLowerCase() === "android") {
        return true;
    }

    // Traditional UA patterns: Android devices, Kindle Silk (Android-based)
    return /Android|Silk\//i.test(ua);
}

function isIos(ua: string, platform: string): boolean {
    // User-Agent Client Hints (Chromium on iOS)
    const uaData = navigator.userAgentData;
    if (uaData?.platform?.toLowerCase() === "ios") {
        return true;
    }

    // iPhone, iPad, iPod – standard UA identifiers
    if (/iPhone|iPad|iPod/i.test(ua)) {
        return true;
    }

    // iPad on iPadOS 13+ in "Request Desktop Website" mode:
    // UA is spoofed to Mac (MacIntel) to get desktop sites,
    // but maxTouchPoints > 1 distinguishes from real Macs.
    if (
        platform === "MacIntel" &&
        typeof navigator.maxTouchPoints === "number" &&
        navigator.maxTouchPoints > 1
    ) {
        return true;
    }

    return false;
}
