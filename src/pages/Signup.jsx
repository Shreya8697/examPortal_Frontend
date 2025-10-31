import React, { useEffect, useState } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../fireBase";

function Signup({ onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const BaseUrl = import.meta.env.VITE_BASE_URL;
  // console.log("BaseUrl:", BaseUrl);

  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ---------------- GOOGLE SIGNUP ---------------- */
  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);

      // Sign in with Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const payload = {
        firstname: user.displayName?.split(" ")[0] || "",
        lastname: user.displayName?.split(" ")[1] || "",
        email: user.email,
        googleId: user.uid,
        signupMethod: "google",
      };

      // Try to register only. If already registered -> show message (do NOT auto-login).
      const res = await axios.post(`http://192.168.0.109:8000/website/auth/google-register`, payload);

      // On successful registration, store user (if server returns user) and notify.
      if (res?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        // fallback store basic payload so app doesn't break (optional)
        localStorage.setItem("user", JSON.stringify(payload));
      }

      setMessage("Signup successful via Google!");
      // reload to reflect logged-in status
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      // If server says already registered, show a friendly message and DO NOT auto-login
      const serverMsg = err?.response?.data?.message;
      if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("already registered")) {
        setMessage("You are already registered. Please login.");
      } else if (err?.code === "auth/popup-closed-by-user") {
        // Common Firebase popup cancellation
        setMessage("Google sign-in was cancelled.");
      } else {
        setMessage(serverMsg || err?.message || "Google Sign-in failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- GENERAL FUNCTIONS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "First name is required.";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email.";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await axios.post(`${BaseUrl}/website/auth/otp-send`, { email: formData.email });
      setMessage("OTP sent! Check your email.");
      setOtpSent(true);
      setFormData((prev) => ({ ...prev, otp: "" })); // Clear OTP input
      // reset resend timer
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      await axios.post(`${BaseUrl}/website/auth/otp-send`, { email: formData.email });
      setMessage("OTP resent! Check your email.");
      setResendTimer(60);
      setCanResend(false);
      setFormData((prev) => ({ ...prev, otp: "" })); // Clear OTP input
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
    if (!formData.otp.trim()) {
      setErrors({ otp: "OTP is required." });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseUrl}/website/auth/otp-verify`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("Signup successful!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- OTP TIMER ---------------- */
  useEffect(() => {
    if (!otpSent) return;
    if (resendTimer === 0) return setCanResend(true);

    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpSent, resendTimer]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-[95%] sm:w-[80%] md:w-[60%] lg:w-[40%] rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-lg transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Create Your Account</h2>
          <p className="text-gray-500 text-xs">Start your exam preparation journey</p>
        </div>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isLoading ? "Please wait..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gray-300"></div>
          <span className="absolute bg-white px-2 text-xs text-gray-500">Or with email</span>
        </div>

        {/* Form Sections */}
        {!otpSent ? (
          <>
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                <input
                  name="firstname"
                  value={formData.firstname}
                  placeholder="Enter first name"
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.firstname ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.firstname && <p className="text-xs text-red-600 mt-1">{errors.firstname}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  name="lastname"
                  value={formData.lastname}
                  placeholder="Enter last name"
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.lastname ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.lastname && <p className="text-xs text-red-600 mt-1">{errors.lastname}</p>}
              </div>
            </div>

            {/* Email and Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                value={formData.email}
                placeholder="Enter email"
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Enter phone number"
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Enter password"
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm password"
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">OTP</label>
              <div className="relative">
                <input
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className={`w-full border rounded-lg p-2 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.otp ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  onClick={canResend ? handleResendOtp : undefined}
                  disabled={!canResend || isLoading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium px-1 py-0.5 rounded transition-all ${canResend ? "text-blue-600 hover:text-blue-800 cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
                >
                  {canResend ? "Resend" : `${resendTimer}s`}
                </button>
              </div>
              {errors.otp && <p className="text-xs text-red-600 mt-1">{errors.otp}</p>}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </>
        )}

        {/* Message */}
        {message && (
          <p className={`text-center text-xs font-medium ${message.toLowerCase().includes("success") || message.includes("Login") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        {/* Switch to Login */}
        <p className="text-center text-xs text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => {
              onClose?.();
              onSwitchToLogin?.();
            }}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            Login now
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
