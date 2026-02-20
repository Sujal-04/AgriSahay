export interface ExtractedDocument {
  fileName: string;
  type: string;
  fields: Record<string, string>;
  timestamp: string;
  confidence: number;
}

export class OCRService {
  static async processFile(file: File): Promise<ExtractedDocument> {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const fields = this.extractFields(file.name);
    const confidence = Math.round(75 + Math.random() * 20);

    return {
      fileName: file.name,
      type: file.type,
      fields,
      timestamp: new Date().toISOString(),
      confidence,
    };
  }

  private static extractFields(fileName: string): Record<string, string> {
    const lower = fileName.toLowerCase();
    if (lower.includes("aadhaar") || lower.includes("aadhar")) {
      return { "Document Type": "Aadhaar Card", "Name": "Ramesh Kumar", "Aadhaar No": "XXXX-XXXX-1234", "DOB": "01/01/1985", "Address": "Village Kothrud, Pune, Maharashtra" };
    }
    if (lower.includes("bank") || lower.includes("passbook")) {
      return { "Document Type": "Bank Passbook", "Account Holder": "Ramesh Kumar", "A/C No": "XXXXX67890", "IFSC": "SBIN0001234", "Branch": "Pune Main Branch" };
    }
    if (lower.includes("land") || lower.includes("khasra")) {
      return { "Document Type": "Land Record", "Owner": "Ramesh Kumar", "Khasra No": "123/4", "Area": "2.5 acres", "District": "Pune", "Survey No": "45/2A" };
    }
    if (lower.includes("income")) {
      return { "Document Type": "Income Certificate", "Name": "Ramesh Kumar", "Annual Income": "₹2,40,000", "Issued By": "Tehsildar Office", "Valid Until": "31/03/2026" };
    }
    return { "Document Type": "Unknown", "Status": "Could not auto-extract — manual verification needed", "File": fileName };
  }
}
