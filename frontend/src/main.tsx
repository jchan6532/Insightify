import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/store/queryClient';
import { AuthProvider } from '@/contexts/auth';
import { NotificationProvider } from './contexts/notification';
import WebsocketListener from './contexts/websocketListener';
import { Router } from '@/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <WebsocketListener />
          <RouterProvider router={Router} />
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </>
);
