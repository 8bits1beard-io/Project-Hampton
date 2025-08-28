/**
 * Sound Effects Module
 * Handles all audio feedback for user actions
 */

export class SoundEffects {
    constructor() {
        this.enabled = this.loadPreference();
        this.volume = 0.3;
        this.sounds = this.initializeSounds();
    }

    loadPreference() {
        const saved = localStorage.getItem('soundEnabled');
        return saved === null ? true : saved === 'true';
    }

    initializeSounds() {
        // Using Web Audio API to generate sounds programmatically
        // This avoids needing external audio files
        return {
            xp: () => this.playXPSound(),
            achievement: () => this.playAchievementSound(),
            complete: () => this.playCompleteSound(),
            levelUp: () => this.playLevelUpSound(),
            click: () => this.playClickSound(),
            error: () => this.playErrorSound(),
            success: () => this.playSuccessSound()
        };
    }

    createAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    playTone(frequency, duration, type = 'sine', volumeMultiplier = 1) {
        if (!this.enabled) return;

        try {
            const context = this.createAudioContext();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(this.volume * volumeMultiplier, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + duration);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    }

    playSequence(notes, duration = 0.1) {
        if (!this.enabled) return;

        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playTone(note, duration);
            }, index * duration * 1000);
        });
    }

    // XP Gain Sound - Rising chime
    playXPSound() {
        this.playSequence([523, 659, 784], 0.1); // C, E, G
    }

    // Achievement Unlock - Triumphant fanfare
    playAchievementSound() {
        this.playSequence([
            523, 523, 523, 659, 784, 784, 784, 880
        ], 0.15); // C, C, C, E, G, G, G, A
    }

    // Module Complete - Success chord
    playCompleteSound() {
        // Play multiple tones simultaneously for a chord
        this.playTone(523, 0.5); // C
        this.playTone(659, 0.5); // E
        this.playTone(784, 0.5); // G
        this.playTone(1047, 0.5); // High C
    }

    // Level Up - Epic ascending scale
    playLevelUpSound() {
        this.playSequence([
            262, 330, 392, 523, 659, 784, 1047, 1319
        ], 0.08); // C major scale ascending
    }

    // Click Sound - Simple tick
    playClickSound() {
        this.playTone(1000, 0.05, 'square', 0.5);
    }

    // Error Sound - Low buzz
    playErrorSound() {
        this.playTone(150, 0.2, 'sawtooth', 0.5);
    }

    // Success Sound - Pleasant ding
    playSuccessSound() {
        this.playSequence([880, 1047], 0.1); // A, High C
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled.toString());
        
        if (this.enabled) {
            this.playClickSound();
        }
        
        return this.enabled;
    }

    // Set volume (0-1)
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        localStorage.setItem('soundVolume', this.volume.toString());
    }

    // Play a custom melody (for fun Easter eggs)
    playMelody(melody) {
        if (!this.enabled) return;

        const noteMap = {
            'C': 261.63,
            'C#': 277.18,
            'D': 293.66,
            'D#': 311.13,
            'E': 329.63,
            'F': 349.23,
            'F#': 369.99,
            'G': 392.00,
            'G#': 415.30,
            'A': 440.00,
            'A#': 466.16,
            'B': 493.88,
            'C2': 523.25
        };

        const notes = melody.map(note => noteMap[note] || 440);
        this.playSequence(notes, 0.2);
    }

    // Easter egg songs
    playVictoryTheme() {
        // Final Fantasy victory fanfare simplified
        this.playMelody(['G', 'G', 'G', 'G', 'D#', 'F', 'G', 'F', 'G']);
    }

    playMarioTheme() {
        // Super Mario Bros coin sound
        this.playSequence([988, 1319], 0.1);
    }

    playZeldaSecret() {
        // Zelda secret discovery
        this.playMelody(['G', 'F#', 'D#', 'A', 'G#', 'E', 'G', 'C2']);
    }
}

// Export singleton instance
export const soundEffects = new SoundEffects();