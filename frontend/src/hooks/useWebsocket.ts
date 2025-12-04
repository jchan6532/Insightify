import { useRef, useEffect } from 'react';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;

type DocumentMessage = {
  doc_id: string;
  title: string;
  status: 'READY' | 'FAILED';
  error?: string;
};

type Props = {
  onReady?: (msg: DocumentMessage) => void;
  onFailed?: (msg: DocumentMessage) => void;
};

export function useWebsocket({ onReady, onFailed }: Props) {
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
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
  }, [onReady, onFailed]);
}
