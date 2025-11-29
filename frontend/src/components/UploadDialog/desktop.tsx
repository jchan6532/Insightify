import { useUploadDocument } from '@/hooks/useUploadDoc';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';

type UploadDocumentDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function UploadDocumentDialog({
  open,
  onClose,
}: UploadDocumentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const { mutate, isPending } = useUploadDocument();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (file && !title) setTitle(file.name);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    mutate(
      { file, title: title || file.name },
      {
        onSuccess: () => {
          setFile(null);
          setTitle('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (isPending) return;

    setFile(null);
    setTitle('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Button variant='outlined' component='label'>
              {file ? 'Change File' : 'Choose File'}
              <input
                hidden
                type='file'
                onChange={handleFileChange}
                accept='.pdf,.doc,.docx,.txt'
              />
            </Button>

            <TextField
              label='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={!file || isPending}
          >
            {isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
