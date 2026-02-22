import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatService, ChatMessage as ChatMessageType } from "@/services/ChatService";
import { speechService } from "@/services/SpeechService";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface ChatInterfaceProps {
  currentProfile?: any;
}

export function ChatInterface({ currentProfile }: ChatInterfaceProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add greeting message on mount
    if (messages.length === 0) {
      const greeting: ChatMessageType = {
        id: "greeting",
        role: "assistant",
        content: t.chat.greeting,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = ChatService.addUserMessage(inputValue);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      const response = await ChatService.processMessage(inputValue, language, currentProfile);
      setMessages((prev) => [...prev, response]);

      // Speak the response if TTS is enabled
      if (isSpeaking) {
        speechService.speak(response.content, language);
      }
    } catch (error) {
      toast.error("Failed to process message");
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleVoiceInput = () => {
    if (!speechService.isRecognitionSupported()) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening(
        language,
        (text) => {
          setInputValue(text);
          setIsListening(false);
          toast.success("Voice input captured");
        },
        (error) => {
          setIsListening(false);
          toast.error(`Voice input error: ${error}`);
        }
      );
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      toast.success("Text-to-speech enabled");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary">
        <h2 className="text-lg font-bold text-primary-foreground">{t.chat.title}</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleSpeaking}
          className="text-primary-foreground hover:bg-primary-foreground/10"
          title={isSpeaking ? "Disable TTS" : "Enable TTS"}
        >
          {isSpeaking ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isProcessing && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
              <p className="text-sm text-muted-foreground">{t.chat.processing}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Example questions (show only if no messages yet) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">{t.chat.exampleQuestions}</p>
          <div className="space-y-1">
            {[t.chat.example1, t.chat.example2, t.chat.example3].map((example, idx) => (
              <button
                key={idx}
                onClick={() => setInputValue(example)}
                className="block w-full text-left text-xs bg-muted hover:bg-muted/80 rounded-lg px-3 py-2 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? t.chat.listening : t.chat.placeholder}
            disabled={isProcessing || isListening}
            className="flex-1"
          />
          <Button
            size="icon"
            variant={isListening ? "destructive" : "outline"}
            onClick={handleVoiceInput}
            disabled={isProcessing}
            title={isListening ? t.chat.stopVoice : t.chat.startVoice}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
