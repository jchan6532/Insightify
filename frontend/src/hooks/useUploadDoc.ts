import axios from 'axios';
import { documentsApi } from '@/apis/documents';

type UploadResult = {
  documentId: string;
};

type PresignedData = {
  url: string;
  key: string;
};

export function useUploadDocument() {
  const uploadDocument = async (
    file: File,
    title: string
  ): Promise<UploadResult> => {
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

    const createRes = await documentsApi.post('/', {
      title,
      mime_type: file.type,
      storage_uri: key,
      byte_size: file.size,
    });

    return { documentId: createRes.data.id as string };
  };

  return { uploadDocument };
}
