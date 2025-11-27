import { Card, CardContent, CardHeader, Typography } from '@mui/material';

import { type Document } from '@/types/document/Document.type';

type DocumentCardProps = {
  document: Document;
};

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card variant='outlined' sx={{ height: '100%' }}>
      <CardHeader
        title={document.title || '(Untitled Document)'}
        subheader={document.mime_type}
        sx={{ pb: 0 }}
      />

      <CardContent>
        <Typography variant='body2'>
          Status: <strong>{document.status}</strong>
        </Typography>

        {document.byte_size != null && (
          <Typography variant='body2'>
            Size: {(document.byte_size / 1024).toFixed(1)} KB
          </Typography>
        )}

        <Typography variant='caption' color='text.secondary'>
          Created: {new Date(document.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
