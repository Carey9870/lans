// types/gazette-notices.ts
export type GazetteNotice = {
  id: number;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type GazetteResource = {
  id: number;
  notice_id: number;
  type: "image" | "document";
  filename: string;
  original_name: string;
  url: string;
  display_order: number;
};

export type GazetteNoticeWithResources = GazetteNotice & {
  resources: GazetteResource[];
};

