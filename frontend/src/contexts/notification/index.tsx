import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { type AlertColor } from '@mui/material';
import Notification from '@/components/Notification';

type NotificationPayload = {
  message: string;
  severity?: AlertColor;
};

type NotificationContextValue = {
  notify: ({ message, severity }: NotificationPayload) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const notify = useCallback(
    ({ message, severity = 'info' }: NotificationPayload) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    },
    []
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {open && (
        <Notification
          message={message}
          severity={severity}
          open={open}
          handleClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error('useNotification must be used inside NotificationProvider');
  return ctx;
}
