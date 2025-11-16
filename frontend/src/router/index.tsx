// src/router.tsx
import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '@/components/layout';
import Home from '@/routes/home';
import { Login } from '@/routes/auth';
import Profile from '@/routes/profile';
import Documents from '@/routes/documents';
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
        path: 'profile',
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
      {
        path: 'documents',
        element: (
          <Protected>
            <Documents />
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
