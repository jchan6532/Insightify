import { useQuery } from '@tanstack/react-query';

// API
import { usersApi } from '@/apis/users';

// TYPES
import { type DocumentList } from '@/types/document/DocumentList.interface';
import { type UseDocumentOptions } from '@/types/document/UseDocumentOptions.type';

const fetchDocuments = async (
  options: UseDocumentOptions
): Promise<DocumentList> => {
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
};

export function useDocuments(options: UseDocumentOptions = {}) {
  const {
    statusFilter = null,
    mimeTypeFilter = null,
    skip = 0,
    limit = null,
  } = options;

  return useQuery({
    queryKey: [
      'documents',
      {
        statusFilter,
        mimeTypeFilter,
        skip,
        limit,
      },
    ],
    queryFn: () => fetchDocuments(options),
    staleTime: 5 * 60 * 1000,
  });
}
