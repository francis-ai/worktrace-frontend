import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [openPwdModal, setOpenPwdModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const token = localStorage.getItem('token');

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.user.name);   // ✅ Correct structure from backend
        setEmail(res.data.user.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setSnackbar({ open: true, severity: 'error', message: 'Failed to load profile.' });
      }
    };
    fetchProfile();
  }, [token]);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setSnackbar({ open: true, severity: 'error', message: 'Name cannot be empty.' });
      return;
    }

    try {
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, severity: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Profile update error:', error);
      setSnackbar({ open: true, severity: 'error', message: 'Failed to update profile.' });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setSnackbar({ open: true, severity: 'error', message: 'Please fill in all fields.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setSnackbar({ open: true, severity: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPwd.length < 6) {
      setSnackbar({ open: true, severity: 'error', message: 'Password should be at least 6 characters.' });
      return;
    }

    try {
      await axios.put(
        'http://localhost:5000/api/auth/profile/change-password',
        { currentPassword: currentPwd, newPassword: newPwd },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, severity: 'success', message: 'Password changed successfully!' });
      handleClosePwdModal();
    } catch (error) {
      console.error('Password change error:', error);
      setSnackbar({ open: true, severity: 'error', message: error.response?.data?.message || 'Password change failed.' });
    }
  };

  const handleOpenPwdModal = () => setOpenPwdModal(true);
  const handleClosePwdModal = () => {
    setOpenPwdModal(false);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" mb={3}>My Profile</Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        fullWidth
        margin="normal"
        disabled
      />

      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpenPwdModal}>
        Change Password
      </Button>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSaveProfile}>Save Changes</Button>
      </Box>

      {/* Password Modal */}
      <Dialog open={openPwdModal} onClose={handleClosePwdModal}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="dense"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="dense"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePwdModal}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword}>Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
