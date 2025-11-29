import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// API
import { documentsApi } from '@/apis/documents';

// TYPES
import { type Document } from '@/types/document/Document.type';
import { type PresignedData } from '@/types/document/PresignedData.type';
import { type UseUploadArgs } from '@/types/document/UseUploadArgs.type';

import { useNotification } from '@/contexts/notification';

const uploadDocumentFn = async ({
  file,
  title,
}: UseUploadArgs): Promise<Document> => {
  const presignRes = await documentsApi.post('/presign-upload', {
    filename: file.name,
    mime_type: file.type,
  });

  const { url, key } = presignRes.data as PresignedData;

  try {
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error) {
    const e = error as Error;
    e.name = 'S3UploadError';
    throw e;
  }

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
  const { notify } = useNotification();

  return useMutation({
    mutationFn: uploadDocumentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      notify({
        message: 'Document uploaded successfully',
        severity: 'success',
      });
    },
    onError: (error: unknown) => {
      let message = 'Failed to upload document, Please try again';

      if (error instanceof Error) {
        if (error.name === 'S3UploadError') {
          message =
            'Failed to upload file to storage, Check your network and try again';
        }
      }

      notify({ message, severity: 'error' });
    },
  });
}
