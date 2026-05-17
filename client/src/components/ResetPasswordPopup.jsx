import React, { useState } from 'react';
import './ResetPasswordPopup.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPasswordPopup = ({ setShowReset }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRequestReset = async () => {
    if (!email) return toast.error("Email required");

    try {
      const res = await axios.post('/api/users/request-reset', { email });
      if (res.data.token) {
        toast.success("Reset token generated (check email in production)");
        setStep(2);
      } else {
        toast.error("Error sending reset email");
      }
    } catch (err) {
      toast.error("Email not found or server error");
    }
  };

  const handleResetPassword = async () => {
    if (!token || !newPassword) return toast.error("All fields required");

    try {
      await axios.post('/api/users/reset-password', { token, newPassword });
      toast.success("Password reset successful");
      setShowReset(false);
    } catch (err) {
      toast.error("Invalid or expired token");
    }
  };

  return (
    <div className="reset-popup">
      <div className="reset-popup-container">
        <h2>Password Reset</h2>
        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleRequestReset}>Request Reset</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
        <p onClick={() => setShowReset(false)} style={{ marginTop: "1rem", cursor: "pointer" }}>
          Close
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPopup;
