import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/apis/users';

export type DocumentStatus = 'pending' | 'processing' | 'ready' | 'failed';
export type DocumentSource = 'upload';

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

export interface DocumentList {
  documents: Document[];
  total: number;
}

type UseDocumentOptions = {
  statusFilter?: string | null;
  mimeTypeFilter?: string | null;
  skip?: number;
  limit?: number;
};

async function fetchDocuments(
  options: UseDocumentOptions
): Promise<DocumentList> {
  const { statusFilter, mimeTypeFilter, skip = 0, limit } = options;

  const res = await usersApi.get<DocumentList>(`/documents`, {
    params: {
      status_filter: statusFilter ?? undefined,
      mime_type_filter: mimeTypeFilter ?? undefined,
      skip,
      limit,
    },
  });

  return res.data as DocumentList;
}

export function useDocuments(options: UseDocumentOptions = {}) {
  return useQuery({
    queryKey: ['documents', options],
    queryFn: () => fetchDocuments(options),
    staleTime: 5 * 60 * 1000,
  });
}
