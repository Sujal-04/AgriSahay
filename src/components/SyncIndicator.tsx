import { useState, useEffect } from "react";
import { ProfileService } from "@/services/ProfileService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Cloud, CloudOff, Check } from "lucide-react";

export function SyncIndicator() {
  const { t } = useLanguage();
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    setLastSync(ProfileService.getLastSyncTime());
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Refresh sync time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(ProfileService.getLastSyncTime());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
      {online ? (
        <>
          <Cloud className="h-3.5 w-3.5 text-success" />
          <span className="hidden sm:inline">Online</span>
        </>
      ) : (
        <>
          <CloudOff className="h-3.5 w-3.5 text-warning" />
          <span className="hidden sm:inline">Offline</span>
        </>
      )}
      {lastSync && (
        <>
          <Check className="h-3 w-3 text-success" />
          <span className="hidden sm:inline">Saved {formatTime(lastSync)}</span>
        </>
      )}
    </div>
  );
}
