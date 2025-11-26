import { type DocumentSource } from './DocumentSource.type';
import { type DocumentStatus } from './DocumentStatus.type';

export interface Document {
  id: string;
  user_id: string;
  title: string | null;
  mime_type: string;
  byte_size: number | null;
  storage_uri: string;
  source: DocumentSource;
  status: DocumentStatus;
  checksum: string | null;
  created_at: string;
  updated_at: string;
}
