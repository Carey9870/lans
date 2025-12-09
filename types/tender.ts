// types/tender.ts
export type Tender = {
  id: number;
  tender_no: string;
  description: string;
  start_date: string; // YYYY-MM-DD
  closing_datetime: string; // ISO string
  document_path: string | null;
  document_size: number | null;
  document_name: string | null;
  document_mime_type: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  seconds_until_close?: number;
};

