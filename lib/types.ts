export type PdfQrStatus = "active" | "disabled" | "expired";

export type PdfQrCode = {
  id: string;
  user_id: string;
  token: string;
  title: string;
  description: string | null;
  expires_at: string | null;
  password_hash: string | null;
  status: PdfQrStatus;
  qr_color: string;
  qr_background: string;
  qr_size: number;
  created_at: string;
  updated_at: string;
};

export type PdfDocument = {
  id: string;
  qr_code_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  sort_order: number;
  created_at: string;
};

export type PdfQrWithDocuments = PdfQrCode & {
  documents: PdfDocument[];
  total_scans?: number;
  last_scan_at?: string | null;
};
