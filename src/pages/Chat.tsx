import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatService } from "@/services/ChatService";
import { FarmerProfile, SchemeRecommendation } from "@/types/farmer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2, Sprout, User, ChevronDown } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  schemes?: SchemeRecommendation[];
}

export default function Chat() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [collectedProfile, setCollectedProfile] = useState<Partial<FarmerProfile>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Welcome message
  useEffect(() => {
    setMessages([{ id: "welcome", role: "assistant", text: t.chat.welcome }]);
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  }, [language]);

  const processMessage = useCallback((userText: string) => {
    const userId = Date.now().toString();
    const userMsg: ChatMessage = { id: userId, role: "user", text: userText };
    setMessages(prev => [...prev, userMsg]);

    // Extract fields from text
    const extracted = ChatService.extractProfile(userText, language);
    const merged = ChatService.mergeProfiles(collectedProfile, extracted);
    setCollectedProfile(merged);

    setTimeout(() => {
      let reply: ChatMessage;

      if (ChatService.isProfileComplete(merged)) {
        const schemes = ChatService.getRecommendationsResponse(merged, language);
        const schemesText = schemes.map((s, i) =>
          `${i + 1}. ${s.scheme.name[language] || s.scheme.name.en} — ${t.recommendations.confidence}: ${s.confidenceScore}%`
        ).join("\n");

        reply = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: `${t.chat.foundSchemes}\n\n${schemesText}\n\n${t.chat.askMore}`,
          schemes,
        };
      } else {
        const missing = ChatService.getMissingFields(merged, language);
        reply = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: `${t.chat.noProfileDetected}\n\n${language === "en" ? "Still need" : language === "hi" ? "अभी भी चाहिए" : "अद्याप हवे"}: ${missing.join(", ")}`,
        };
      }

      setMessages(prev => [...prev, reply]);
      speak(reply.text);
    }, 500);
  }, [collectedProfile, language, t, speak]);

  const handleSend = () => {
    if (!input.trim()) return;
    processMessage(input.trim());
    setInput("");
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      processMessage(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <main className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3 flex items-center gap-2">
        <Sprout className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-heading font-bold text-foreground">{t.chat.title}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-2 max-w-[85%] md:max-w-[70%]`}>
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Sprout className="h-4 w-4 text-primary" />
                </div>
              )}
              <div>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                </div>

                {/* Scheme cards inside chat */}
                {msg.schemes && msg.schemes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.schemes.map((rec, i) => (
                      <div key={rec.scheme.id} className="bg-card border border-border rounded-xl p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-foreground">
                            #{i + 1} {rec.scheme.name[language] || rec.scheme.name.en}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            rec.confidenceScore >= 70
                              ? "bg-green-100 text-green-800"
                              : rec.confidenceScore >= 40
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {rec.confidenceScore}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {rec.scheme.description[language] || rec.scheme.description.en}
                        </p>
                        <p className="text-xs font-semibold text-primary">
                          {rec.scheme.benefits[language] || rec.scheme.benefits.en}
                        </p>
                        {rec.missingCriteria.length > 0 && (
                          <details className="mt-1">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              {t.recommendations.missing}
                            </summary>
                            <ul className="text-xs text-destructive mt-1 list-disc pl-4">
                              {rec.missingCriteria.map((m, j) => <li key={j}>{m}</li>)}
                            </ul>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TTS button for assistant messages */}
                {msg.role === "assistant" && (
                  <button onClick={() => speak(msg.text)} className="mt-1 text-muted-foreground hover:text-primary transition-colors">
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center mt-1">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card p-3">
        {listening && (
          <div className="text-center text-sm text-primary font-semibold mb-2 animate-pulse">
            🎤 {t.chat.listening}
          </div>
        )}
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Button
            size="icon"
            variant={listening ? "destructive" : "outline"}
            className="flex-shrink-0 h-12 w-12 rounded-xl"
            onClick={toggleVoice}
            title={listening ? "Stop" : "Voice input"}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.chat.placeholder}
            className="h-12 text-base rounded-xl"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0 h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </main>
  );
}
