function installAudioUnlock({
                                       audioEl,
                                       shouldPlay,          // () => boolean
                                       onUnlocked = null,   // optional callback when audio successfully starts
                                   }) {
    if (!audioEl) throw new Error("installAudioUnlock: audioEl missing");

    let armed = true;

    async function tryPlay() {
        if (!armed) return;
        if (typeof shouldPlay === "function" && !shouldPlay()) return;

        try {
            // make sure loop is on if you want it
            audioEl.loop = true;

            // attempt play
            await audioEl.play();

            // success -> disarm + remove listeners
            armed = false;
            remove();
            onUnlocked?.();
        } catch {
            // still blocked; wait for next gesture
        }
    }

    function remove() {
        window.removeEventListener("pointerdown", tryPlay);
        window.removeEventListener("touchstart", tryPlay);
        window.removeEventListener("keydown", tryPlay);
        window.removeEventListener("wheel", tryPlay);
    }

    // Install gesture listeners (reliable first)
    window.addEventListener("pointerdown", tryPlay, { passive: true });
    window.addEventListener("touchstart", tryPlay, { passive: true });
    window.addEventListener("keydown", tryPlay, { passive: true });

    // Optional: scroll/wheel (desktop). Not guaranteed but harmless.
    window.addEventListener("wheel", tryPlay, { passive: true });

    // Try immediately too (works if already unlocked / user-initiated navigation)
    tryPlay();

    // Return controls in case you want to re-arm later
    return {
        rearm() { armed = true; },
        remove,
        tryPlay,
    };
}


function installSequenceTrigger(sequence, onMatch) {
    const target = sequence.toLowerCase();
    let i = 0;

    window.addEventListener("keydown", (e) => {
        // Ignore modifier keys and non-character keys
        if (e.key.length !== 1) return;

        // Optional: ignore typing inside inputs/textareas/contenteditable
        const el = document.activeElement;
        if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
            return;
        }

        const k = e.key.toLowerCase();

        // Only care about letters for this trigger (optional)
        if (k < "a" || k > "z") {
            i = 0;
            return;
        }

        // Expected next char?
        if (k === target[i]) {
            i++;
            if (i === target.length) {
                i = 0;
                onMatch();
            }
            return;
        }

        // Wrong letter => immediate reset
        i = 0;

        // C right after mistake counts immediately
        if (k === target[0]) i = 1;
    });
}

export {installSequenceTrigger, installAudioUnlock};
