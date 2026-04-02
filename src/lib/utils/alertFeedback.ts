type AlertSeverity = "critical" | "warning" | "blockage" | "announcement";

// ── iOS Safari audio context unlock ──────────────────────────────────
// The Web Audio API requires a user gesture on iOS Safari to unlock the
// AudioContext. We play a silent buffer on the first interaction so that
// subsequent programmatic playTone() calls work without a gesture.
let audioContextUnlocked = false;

function unlockAudioContext() {
    if (audioContextUnlocked) return;
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        audioContextUnlocked = true;
        // Remove listeners once unlocked
        document.removeEventListener("touchstart", unlockAudioContext);
        document.removeEventListener("click", unlockAudioContext);
    } catch {
        // Ignore — will retry on next interaction
    }
}

// Register unlock listeners
if (typeof document !== "undefined") {
    document.addEventListener("touchstart", unlockAudioContext, { once: false });
    document.addEventListener("click", unlockAudioContext, { once: false });
}

// Vibration patterns (in ms): [vibrate, pause, vibrate, ...]
const vibrationPatterns: Record<AlertSeverity, number[]> = {
    critical: [200, 100, 200, 100, 400],
    warning: [200, 100, 200],
    blockage: [150, 80, 150],
    announcement: [100],
};

// Tone configs: [frequency Hz, duration ms, repeat count]
const toneConfigs: Record<AlertSeverity, [number, number, number]> = {
    critical: [880, 150, 3],
    warning: [660, 200, 2],
    blockage: [550, 180, 2],
    announcement: [440, 250, 1],
};

function playTone(frequency: number, durationMs: number, count: number) {
    try {
        const ctx = new AudioContext();
        let startTime = ctx.currentTime;

        for (let i = 0; i < count; i++) {
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();

            oscillator.connect(gain);
            gain.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = "sine";

            // Fade out to avoid click
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(
                0.01,
                startTime + durationMs / 1000,
            );

            oscillator.start(startTime);
            oscillator.stop(startTime + durationMs / 1000);

            startTime += (durationMs + 100) / 1000; // gap between beeps
        }

        // Close context after all tones finish
        setTimeout(() => ctx.close(), count * (durationMs + 100) + 200);
    } catch {
        // Web Audio API not supported — silently skip
    }
}

function vibrate(pattern: number[]) {
    try {
        navigator.vibrate?.(pattern);
    } catch {
        // Vibration API not supported
    }
}

export function triggerAlertFeedback(severity: AlertSeverity) {
    const pattern = vibrationPatterns[severity] || vibrationPatterns.announcement;
    const tone = toneConfigs[severity] || toneConfigs.announcement;

    vibrate(pattern);
    playTone(...tone);
}
