import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FarmerProfile } from "@/types/farmer";
import { indianStates, cropOptions } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultProfile: FarmerProfile = {
  name: "",
  state: "",
  district: "",
  landSize: 0,
  landType: "rainfed",
  crops: [],
  annualIncome: 0,
  category: "general",
  irrigationAvailable: false,
  bankLinked: false,
};

export default function Profile() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem("krishi-profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof FarmerProfile>(key: K, val: FarmerProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    localStorage.setItem("krishi-profile", JSON.stringify(profile));
    setSaved(true);
    toast({ title: t.profile.saved });
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCrop = (crop: string) => {
    update("crops", profile.crops.includes(crop) ? profile.crops.filter((c) => c !== crop) : [...profile.crops, crop]);
  };

  return (
    <main className="container px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{t.profile.title}</h1>
      <p className="text-muted-foreground mb-8">{t.profile.subtitle}</p>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label className="text-base font-semibold">{t.profile.name}</Label>
          <Input
            value={profile.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-2 h-14 text-lg bg-card"
          />
        </div>

        {/* State */}
        <div>
          <Label className="text-base font-semibold">{t.profile.state}</Label>
          <Select value={profile.state} onValueChange={(v) => update("state", v)}>
            <SelectTrigger className="mt-2 h-14 text-lg bg-card">
              <SelectValue placeholder={t.selectState} />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div>
          <Label className="text-base font-semibold">{t.profile.district}</Label>
          <Input
            value={profile.district}
            onChange={(e) => update("district", e.target.value)}
            className="mt-2 h-14 text-lg bg-card"
          />
        </div>

        {/* Land Size */}
        <div>
          <Label className="text-base font-semibold">{t.profile.landSize}</Label>
          <Input
            type="number"
            value={profile.landSize || ""}
            onChange={(e) => update("landSize", Number(e.target.value))}
            className="mt-2 h-14 text-lg bg-card"
          />
        </div>

        {/* Land Type */}
        <div>
          <Label className="text-base font-semibold">{t.profile.landType}</Label>
          <Select value={profile.landType} onValueChange={(v: any) => update("landType", v)}>
            <SelectTrigger className="mt-2 h-14 text-lg bg-card">
              <SelectValue placeholder={t.selectLandType} />
            </SelectTrigger>
            <SelectContent>
              {(["irrigated", "rainfed", "dryland", "wetland"] as const).map((lt) => (
                <SelectItem key={lt} value={lt}>
                  {t.landTypes[lt]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Crops */}
        <div>
          <Label className="text-base font-semibold">{t.profile.crops}</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {cropOptions.map((crop) => (
              <button
                key={crop}
                onClick={() => toggleCrop(crop)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  profile.crops.includes(crop)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Annual Income */}
        <div>
          <Label className="text-base font-semibold">{t.profile.annualIncome}</Label>
          <Input
            type="number"
            value={profile.annualIncome || ""}
            onChange={(e) => update("annualIncome", Number(e.target.value))}
            className="mt-2 h-14 text-lg bg-card"
          />
        </div>

        {/* Category */}
        <div>
          <Label className="text-base font-semibold">{t.profile.category}</Label>
          <Select value={profile.category} onValueChange={(v: any) => update("category", v)}>
            <SelectTrigger className="mt-2 h-14 text-lg bg-card">
              <SelectValue placeholder={t.selectCategory} />
            </SelectTrigger>
            <SelectContent>
              {(["general", "sc", "st", "obc", "minority"] as const).map((c) => (
                <SelectItem key={c} value={c}>
                  {t.categories[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between bg-card rounded-xl p-4 border">
          <Label className="text-base font-semibold">{t.profile.irrigationAvailable}</Label>
          <Switch
            checked={profile.irrigationAvailable}
            onCheckedChange={(v) => update("irrigationAvailable", v)}
          />
        </div>

        <div className="flex items-center justify-between bg-card rounded-xl p-4 border">
          <Label className="text-base font-semibold">{t.profile.bankLinked}</Label>
          <Switch
            checked={profile.bankLinked}
            onCheckedChange={(v) => update("bankLinked", v)}
          />
        </div>

        <Button onClick={handleSave} className="btn-rural w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg">
          {saved && <CheckCircle2 className="mr-2 h-5 w-5" />}
          {saved ? t.profile.saved : t.profile.save}
        </Button>
      </div>
    </main>
  );
}
