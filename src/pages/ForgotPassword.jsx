import React, { useState } from "react";
import axios from "axios";

function ForgotPassword({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 📩 Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your registered email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/auth/reset-otp-send`,
        { email }
      );

      if (res.data.status === 1) {
        alert("OTP sent to your email");
        setEmailDisabled(true);   // ✅ Disable email field
        setIsOtpSent(true);       // ✅ Show OTP + Password fields
      } else {
        alert(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Step 2: Reset Password
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/auth/reset-password`,
        { email, otp, newPassword }
      );

      if (res.data.status === 1) {
        alert(res.data.message);
        onClose();
        onSwitchToLogin?.(); // 👈 Forgot se direct Login modal open
      } else {
        alert(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-yellow-600 p-6 text-center rounded-t-xl">
          <h2 className="text-white text-2xl font-semibold">Reset Password</h2>
          <p className="text-indigo-100 mt-2">
            Enter your email to receive an OTP
          </p>
        </div>

        <div className="p-8">
          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailDisabled}
            />
          </div>

          {/* Send OTP Button */}
          {!isOtpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading || emailDisabled} // ✅ Prevent double click
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {/* OTP + New Password Fields */}
          {isOtpSent && (
            <>
              <div className="mb-5 mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="Enter the 5-digit OTP"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
