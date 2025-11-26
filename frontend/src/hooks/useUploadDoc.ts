import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// API
import { documentsApi } from '@/apis/documents';

// TYPES
import { type Document } from '@/types/document/Document.type';
import { type PresignedData } from '@/types/document/PresignedData.type';
import { type UseUploadArgs } from '@/types/document/UseUploadArgs.type';

const uploadDocumentFn = async ({
  file,
  title,
}: UseUploadArgs): Promise<Document> => {
  const presignRes = await documentsApi.post('/presign-upload', {
    filename: file.name,
    mime_type: file.type,
  });

  const { url, key } = presignRes.data as PresignedData;

  await axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  const createDocRes = await documentsApi.post('/', {
    title,
    mime_type: file.type,
    storage_uri: key,
    byte_size: file.size,
  });

  return createDocRes.data as Document;
};

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocumentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
    },
  });
}
