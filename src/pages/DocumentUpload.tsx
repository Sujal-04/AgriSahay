import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtractedDoc {
  fileName: string;
  type: string;
  fields: Record<string, string>;
}

const simulateOCR = (fileName: string): Record<string, string> => {
  const lower = fileName.toLowerCase();
  if (lower.includes("aadhaar") || lower.includes("aadhar")) {
    return { "Document Type": "Aadhaar Card", "Name": "Ramesh Kumar", "Aadhaar No": "XXXX-XXXX-1234", "DOB": "01/01/1985" };
  }
  if (lower.includes("bank") || lower.includes("passbook")) {
    return { "Document Type": "Bank Passbook", "Account Holder": "Ramesh Kumar", "A/C No": "XXXXX67890", "IFSC": "SBIN0001234" };
  }
  if (lower.includes("land") || lower.includes("khasra")) {
    return { "Document Type": "Land Record", "Owner": "Ramesh Kumar", "Khasra No": "123/4", "Area": "2.5 acres", "District": "Pune" };
  }
  return { "Document Type": "Unknown", "Status": "Could not extract — please verify manually", "File": fileName };
};

export default function DocumentUpload() {
  const { t } = useLanguage();
  const [docs, setDocs] = useState<ExtractedDoc[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setProcessing(true);
    setTimeout(() => {
      const fields = simulateOCR(file.name);
      setDocs((prev) => [...prev, { fileName: file.name, type: file.type, fields }]);
      setProcessing(false);
    }, 1500);
  };

  return (
    <main className="container px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{t.documents.title}</h1>
      <p className="text-muted-foreground mb-8">{t.documents.subtitle}</p>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className="border-2 border-dashed border-primary/40 rounded-2xl p-12 text-center cursor-pointer hover:border-primary transition-colors bg-card"
      >
        {processing ? (
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
        ) : (
          <Upload className="h-12 w-12 mx-auto text-primary mb-4" />
        )}
        <p className="text-lg font-semibold text-foreground">
          {processing ? t.documents.processing : t.documents.upload}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{t.documents.uploadHint}</p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Results */}
      {docs.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-heading font-bold text-foreground">{t.documents.extracted}</h2>
          {docs.map((doc, i) => (
            <div key={i} className="card-scheme border-border bg-card animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">{doc.fileName}</span>
                <CheckCircle2 className="h-5 w-5 text-success ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(doc.fields).map(([key, val]) => (
                  <div key={key} className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground font-semibold">{key}</div>
                    <div className="text-sm font-bold text-foreground">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {docs.length === 0 && !processing && (
        <p className="text-center text-muted-foreground mt-8">{t.documents.noDocuments}</p>
      )}
    </main>
  );
}
