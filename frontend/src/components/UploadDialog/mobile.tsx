import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, type ChangeEvent, type FormEvent, forwardRef } from 'react';
import type { TransitionProps } from '@mui/material/transitions';
import { useUploadDocument } from '@/hooks/useUploadDoc';

type UploadDocumentDialogMobileProps = {
  open: boolean;
  onClose: () => void;
};

const MobileTransition = forwardRef(function MobileTransition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function UploadDocumentDialogMobile({
  open,
  onClose,
}: UploadDocumentDialogMobileProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const { mutate, isPending } = useUploadDocument();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !title) setTitle(f.name);
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
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      TransitionComponent={MobileTransition}
      PaperProps={{
        sx: {
          mt: 'auto',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 1.5,
            pb: 1,
          }}
        >
          Upload document
          <IconButton onClick={handleClose} size='small'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 2, pt: 0 }}>
          <Stack spacing={2} mt={1}>
            <Button variant='outlined' component='label' fullWidth>
              {file ? 'Change file' : 'Choose file'}
              <input
                hidden
                type='file'
                onChange={handleFileChange}
                accept='.pdf,.doc,.docx,.txt'
              />
            </Button>

            {file && (
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                Selected: {file.name}
              </div>
            )}

            <TextField
              label='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
          <Button onClick={handleClose} disabled={isPending} fullWidth>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={!file || isPending}
            fullWidth
          >
            {isPending ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
