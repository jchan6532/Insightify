// src/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout';
import Home from '@/routes/home';
import { Login } from '@/routes/auth';
import { Protected } from '@/components/auth/protected';
import { RedirectAuth } from '@/components/auth/redirectAuth';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },
      {
        path: 'login',
        element: (
          <RedirectAuth>
            <Login />
          </RedirectAuth>
        ),
      },
    ],
  },
]);
