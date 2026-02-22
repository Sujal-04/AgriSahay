import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatService } from "@/services/ChatService";
import { FarmerProfile, SchemeRecommendation, Language } from "@/types/farmer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2, Sprout, User, X, MessageCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  schemes?: SchemeRecommendation[];
}

const langLabels = { en: "EN", hi: "हिं", mr: "मरा" } as const;

export function ChatWidget() {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [collectedProfile, setCollectedProfile] = useState<Partial<FarmerProfile>>({});
  const [unread, setUnread] = useState(1); // welcome = 1 unread
  const [hasOpened, setHasOpened] = useState(false);
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
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text: userText };
    setMessages(prev => [...prev, userMsg]);

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
      if (!open) setUnread(prev => prev + 1);
      speak(reply.text);
    }, 500);
  }, [collectedProfile, language, t, speak, open]);

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

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    setHasOpened(true);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center transition-transform duration-200 hover:scale-110 ${!hasOpened ? "animate-bounce" : ""}`}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-5 right-5 z-50 w-[340px] sm:w-[360px] h-[480px] rounded-2xl shadow-2xl border border-border bg-background flex flex-col overflow-hidden animate-scale-in"
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm font-heading font-bold text-primary-foreground">{t.chat.title}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Language toggle */}
              <div className="flex rounded-md border border-primary-foreground/30 overflow-hidden mr-1">
                {(Object.keys(langLabels) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                      language === lang
                        ? "bg-secondary text-secondary-foreground"
                        : "text-primary-foreground/70 hover:bg-primary-foreground/10"
                    }`}
                  >
                    {langLabels[lang]}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex gap-1.5 max-w-[90%]">
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Sprout className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className={`rounded-2xl px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    }`}>
                      <p className="whitespace-pre-line text-xs leading-relaxed">{msg.text}</p>
                    </div>

                    {msg.schemes && msg.schemes.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.schemes.map((rec, i) => (
                          <div key={rec.scheme.id} className="bg-card border border-border rounded-lg p-2 shadow-sm">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-foreground truncate mr-1">
                                #{i + 1} {rec.scheme.name[language] || rec.scheme.name.en}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                rec.confidenceScore >= 70
                                  ? "bg-green-100 text-green-800"
                                  : rec.confidenceScore >= 40
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {rec.confidenceScore}%
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-2">
                              {rec.scheme.description[language] || rec.scheme.description.en}
                            </p>
                            <p className="text-[10px] font-semibold text-primary mt-0.5">
                              {rec.scheme.benefits[language] || rec.scheme.benefits.en}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.role === "assistant" && (
                      <button onClick={() => speak(msg.text)} className="mt-0.5 text-muted-foreground hover:text-primary transition-colors">
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                      <User className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-card p-2 flex-shrink-0">
            {listening && (
              <div className="text-center text-xs text-primary font-semibold mb-1.5 animate-pulse">
                🎤 {t.chat.listening}
              </div>
            )}
            <div className="flex gap-1.5">
              <Button
                size="icon"
                variant={listening ? "destructive" : "outline"}
                className="flex-shrink-0 h-10 w-10 rounded-lg"
                onClick={toggleVoice}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t.chat.placeholder}
                className="h-10 text-sm rounded-lg"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                size="icon"
                className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
