import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { documentsApi } from '@/apis/documents';
import { type Document } from './useDocs';

type PresignedData = {
  url: string;
  key: string;
};

type UploadArgs = {
  file: File;
  title: string | null;
};

const uploadDocumentFn = async ({
  file,
  title,
}: UploadArgs): Promise<Document> => {
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
