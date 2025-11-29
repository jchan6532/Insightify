import { Outlet } from 'react-router-dom';
import Topbar from '@/components/layout/TopBar';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/SideBar';
import { CssBaseline, Fab } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import './layout.css';
import { ColorModeContext, useMode } from '@/contexts';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadDocumentDialog from '../UploadDialog/desktop';

export default function AppLayout() {
  const { isLoggedIn } = useAuth();
  const [theme, colorMode] = useMode();
  const [openUpload, setOpenUpload] = useState<boolean>(false);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          {isLoggedIn && <Sidebar />}

          <main className='content'>
            {isLoggedIn && <Topbar />}
            <Outlet />
            {isLoggedIn && (
              <>
                <Fab
                  color='primary'
                  sx={{ position: 'fixed', bottom: 24, right: 24 }}
                  onClick={() => setOpenUpload(true)}
                >
                  <CloudUploadIcon />
                </Fab>

                <UploadDocumentDialog
                  open={openUpload}
                  onClose={() => setOpenUpload(false)}
                />
              </>
            )}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
