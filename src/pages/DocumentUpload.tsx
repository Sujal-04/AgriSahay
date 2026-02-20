import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { OCRService, ExtractedDocument } from "@/services/OCRService";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DocumentUpload() {
  const { t } = useLanguage();
  const [docs, setDocs] = useState<ExtractedDocument[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setProcessing(true);
    try {
      const result = await OCRService.processFile(file);
      setDocs((prev) => [...prev, result]);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="container px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{t.documents.title}</h1>
      <p className="text-muted-foreground mb-8">{t.documents.subtitle}</p>

      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className="border-2 border-dashed border-primary/40 rounded-2xl p-12 text-center cursor-pointer hover:border-primary transition-colors bg-card shadow-sm"
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

      {docs.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-heading font-bold text-foreground">{t.documents.extracted}</h2>
          {docs.map((doc, i) => (
            <div key={i} className="card-scheme border-border bg-card shadow-sm animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">{doc.fileName}</span>
                <Badge className="bg-success/10 text-success ml-auto">{doc.confidence}% confidence</Badge>
                <CheckCircle2 className="h-5 w-5 text-success" />
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
