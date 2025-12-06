import { useAuth } from '@/hooks/useAuth';
import { useWebsocket } from '@/hooks/useWebsocket';
import { useNotification } from '../notification';

export default function WebsocketListener() {
  const { isLoggedIn } = useAuth();
  const { notify } = useNotification();

  useWebsocket({
    enabled: isLoggedIn,
    onReady: (msg) => {
      notify({
        message: `Document ${msg.title} (${msg.status}) is complete`,
        severity: 'success',
      });
    },
    onFailed: (msg) => {
      notify({
        message: `Document ${msg.title} failed: ${
          msg.error ?? 'Unknown error'
        }`,
        severity: 'error',
      });
    },
  });

  return null;
}
