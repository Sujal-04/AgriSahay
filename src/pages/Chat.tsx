import { useLanguage } from "@/contexts/LanguageContext";
import { ChatInterface } from "@/components/ChatInterface";
import { ProfileService } from "@/services/ProfileService";

const Chat = () => {
  const { t } = useLanguage();
  const profile = ProfileService.getProfile();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container px-4 py-6 max-w-4xl mx-auto h-[calc(100vh-4rem)]">
        <ChatInterface currentProfile={profile} />
      </div>
    </div>
  );
};

export default Chat;
