import { Button, Box, Typography, Paper, TextField } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import goolgeLogo from '@/assets/google-logo.svg';
import { useState } from 'react';

export function Login() {
  const {
    signUpWithEmailPassword,
    loginWithGooglePopup,
    loginWithEmailPassword,
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignupWithEmailPassword = async () => {
    if (!email || !password) return;
    await signUpWithEmailPassword(email, password);
    navigate('/');
  };

  const handleLoginWithEmailPassword = async () => {
    if (!email || !password) return;
    await loginWithEmailPassword(email, password);
    navigate('/');
  };

  const handleGoogleLogin = async () => {
    await loginWithGooglePopup();
    navigate('/');
  };

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        padding={10}
      >
        <Typography variant='h1' textAlign='center' fontWeight={600} pt={20}>
          Login
        </Typography>
        <br />
        <br />
        <br />

        <Paper
          elevation={5}
          sx={{
            p: 4,
            width: 360,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 2,
          }}
        >
          {/* Email */}
          <TextField
            label='Email'
            type='email'
            fullWidth
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <TextField
            label='Password'
            type='password'
            fullWidth
            variant='outlined'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit button */}
          <Button
            variant='contained'
            size='large'
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleLoginWithEmailPassword}
          >
            Sign In
          </Button>

          <Button
            variant='text'
            size='large'
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleSignupWithEmailPassword}
          >
            Create Account
          </Button>
        </Paper>
        <br />
        <br />
        <Paper elevation={10} sx={{ borderRadius: 5 }}>
          <Button
            variant='contained'
            className='button-style'
            startIcon={<img height='48' alt='Google logo' src={goolgeLogo} />}
            onClick={handleGoogleLogin}
            sx={{ height: 80, width: 80, pl: 3.5, borderRadius: 5 }}
          />{' '}
        </Paper>
      </Box>
    </>
  );
}
