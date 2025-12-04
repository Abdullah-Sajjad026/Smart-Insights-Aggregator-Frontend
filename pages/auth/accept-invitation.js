import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useAcceptInvitationMutation } from '../../modules/auth/apis/accept-invitation';
import { toast } from 'react-toastify';

export default function AcceptInvitation() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const acceptInvitationMutation = useAcceptInvitationMutation({
    onSuccess: (data) => {
      setSuccess(true);
      const { token: authToken, userId, email, fullName, role, expiresAt } = data;

      // Store token
      localStorage.setItem('token', authToken);

      // Store full user info
      const userInfo = {
        userId,
        email,
        fullName,
        role,
        expiresAt,
      };
      localStorage.setItem('user', JSON.stringify(userInfo));

      toast.success(`Welcome to SmartInsights, ${fullName}!`);

      // Redirect to homepage which will handle role-based redirection
      setTimeout(() => {
        router.push('/');
      }, 1500);
    },
    onError: () => {
      // Error is already handled by the mutation (shows toast)
      setError('Failed to accept invitation. Please check your information and try again.');
    },
  });

  useEffect(() => {
    if (!token && router.isReady) {
      setError('Invalid invitation link');
    }
  }, [token, router.isReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    acceptInvitationMutation.mutate({
      invitationToken: token,
      password,
      confirmPassword,
    });
  };

  if (!router.isReady) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 450,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Welcome to SmartInsights
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Set your password to complete your registration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account activated successfully! Redirecting...
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={acceptInvitationMutation.isLoading}
              helperText="Minimum 6 characters"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={acceptInvitationMutation.isLoading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={acceptInvitationMutation.isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {acceptInvitationMutation.isLoading ? <CircularProgress size={24} /> : 'Set Password & Continue'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
