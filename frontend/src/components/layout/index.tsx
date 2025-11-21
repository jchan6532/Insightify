import { Outlet } from 'react-router-dom';
import Topbar from '@/components/layout/TopBar';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/SideBar';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import './layout.css';
import { ColorModeContext, useMode } from '@/contexts';

export default function AppLayout() {
  const { isLoggedIn } = useAuth();
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          {isLoggedIn && <Sidebar />}

          <main className='content'>
            {isLoggedIn && <Topbar />}
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
