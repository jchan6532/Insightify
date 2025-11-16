import { Button } from '@mui/material';
import { useAuthHook } from '@/hooks/useAuthHook';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { loginWithGooglePopup } = useAuthHook();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await loginWithGooglePopup();
    navigate('/');
  };

  return (
    <>
      <h1>Login</h1>
      <Button variant='contained' onClick={handleGoogleLogin}>
        sign in with google
      </Button>
    </>
  );
}
