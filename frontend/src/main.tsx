import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Router } from '@/router';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={Router} />
      </AuthProvider>
    </QueryClientProvider>
  </>
);
