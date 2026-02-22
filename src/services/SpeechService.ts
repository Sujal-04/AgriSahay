import { Language } from "@/types/farmer";

export class SpeechService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis;
      
      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  // Start listening for voice input
  startListening(language: Language, onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      onError?.("Speech recognition not supported in this browser");
      return;
    }

    const langCode = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
    this.recognition.lang = langCode;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError?.(event.error);
    };

    this.recognition.start();
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Speak text in selected language
  speak(text: string, language: Language): void {
    if (!this.synthesis) return;

    this.synthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    this.synthesis.speak(utterance);
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if speech recognition is supported
  isRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  // Check if speech synthesis is supported
  isSynthesisSupported(): boolean {
    return this.synthesis !== null;
  }
}

export const speechService = new SpeechService();
