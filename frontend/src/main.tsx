import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { queryClient } from './store/queryClient';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts';

createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </>
);
