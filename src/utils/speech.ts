// Clean Web Speech API helper for reading out wisdom

export class WisdomSpeaker {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static isSpeaking: boolean = false;

  public static speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;

    this.stop();

    // Clean markdown formatting if any
    const cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // slightly deliberate, scholarly pace
    utterance.pitch = 1.0;

    // Pick suitable voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('ur')) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public static speaking(): boolean {
    return this.isSpeaking;
  }
}
