import { Outlet } from 'react-router-dom';
import Topbar from '@/components/layout/TopBar';
import { useAuthHook } from '@/hooks/useAuthHook';
import Sidebar from '@/components/layout/SideBar';
import { CssBaseline } from '@mui/material';
import './layout.css';

export default function AppLayout() {
  const { isLoggedIn } = useAuthHook();
  return (
    <div>
      <CssBaseline />
      <div className='app'>
        {isLoggedIn && <Sidebar />}

        <main className='content'>
          {isLoggedIn && <Topbar />}

          <main>
            <Outlet />
          </main>
        </main>
      </div>
    </div>
  );
}
