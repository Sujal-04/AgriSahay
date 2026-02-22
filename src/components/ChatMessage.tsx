import { ChatMessage as ChatMessageType } from "@/services/ChatService";
import { useLanguage } from "@/contexts/LanguageContext";
import { SchemeCard } from "./SchemeCard";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { language } = useLanguage();
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-4`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? "bg-primary" : "bg-secondary"
      }`}>
        {isUser ? <User className="w-5 h-5 text-primary-foreground" /> : <Bot className="w-5 h-5 text-secondary-foreground" />}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted text-foreground rounded-tl-none"
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.schemes && message.schemes.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.schemes.map((rec) => (
              <SchemeCard key={rec.scheme.id} recommendation={rec} compact />
            ))}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {message.timestamp.toLocaleTimeString(language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
