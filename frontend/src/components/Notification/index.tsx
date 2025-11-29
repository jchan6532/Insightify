import { Snackbar, Alert, type AlertColor } from '@mui/material';

type NotificationProps = {
  message: string;
  severity: AlertColor;
  open: boolean;
  handleClose: () => void;
};

export default function Notification({
  message,
  severity,
  open,
  handleClose,
}: NotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClick={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} variant='filled'>
        {message}
      </Alert>
    </Snackbar>
  );
}
