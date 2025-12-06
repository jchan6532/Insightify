import { useRef, useEffect } from 'react';
import { type DocumentMessage } from '@/types/document/DocumentMessage.type';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;

type WebSocketProps = {
  enabled: boolean;
  onReady?: (msg: DocumentMessage) => void;
  onFailed?: (msg: DocumentMessage) => void;
};

export function useWebsocket({ enabled, onReady, onFailed }: WebSocketProps) {
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      websocketRef.current?.close();
      websocketRef.current = null;
      return;
    }

    const websocket = new WebSocket(`${WEBSOCKET_URL}/websockets/documents`);
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log('web socket connected');
    };

    websocket.onmessage = (event) => {
      const data: DocumentMessage = JSON.parse(event.data);
      if (data.status === 'READY') onReady?.(data);
      else if (data.status === 'FAILED') onFailed?.(data);
    };

    websocket.onerror = (err) => {
      console.error('web socket error:', err);
    };

    websocket.onclose = () => {
      console.log('web socket closed');
    };

    return () => {
      websocketRef.current?.close();
      websocketRef.current = null;
    };
  }, [enabled, onReady, onFailed]);
}
