export type DocumentMessage = {
  doc_id: string;
  title: string;
  status: 'READY' | 'FAILED';
  error?: string;
};
