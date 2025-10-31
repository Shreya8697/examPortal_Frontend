import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveUserdetail } from "../Redux/loginSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../fireBase";

function Login({ onClose, onLoginSuccess, onSwitchToSignup, onSwitchToForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureLoading, setSecureLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const dispatch = useDispatch();

  /* -------------------- Manual Email Login -------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: "error", text: "Please enter email and password" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/auth/manual/login`,
        { email, password }
      );

      if (res.data.status === 1) {
        handleLoginSuccess(res.data.user);
      } else {
        setMessage({ type: "error", text: res.data.message || "Invalid credentials" });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- Google Login -------------------- */
  const handleGoogleLogin = async () => {
    try {
      setSecureLoading(true);
      setMessage({ type: "", text: "" });

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send Google login token/email to backend
      const token = await user.getIdToken();
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/auth/google/login`,
        { email: user.email, token }
      );

      if (res.data.status === 1) {
        handleLoginSuccess(res.data.user);
      } else {
        setMessage({ type: "error", text: res.data.message || "Google login failed" });
        setSecureLoading(false);
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      setMessage({
        type: "error",
        text: "Google sign-in failed. Please try again.",
      });
      setSecureLoading(false);
    }
  };

  /* -------------------- Shared Success Handler -------------------- */
  const handleLoginSuccess = (user) => {
    setSecureLoading(true);
    setTimeout(() => {
      setSecureLoading(false);
      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      dispatch(saveUserdetail({ user }));
      if (onLoginSuccess) onLoginSuccess(user);
      setTimeout(() => onClose?.(), 1000);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-xs sm:max-w-sm rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col gap-4"
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
          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-500 text-xs">Sign in to continue your exam preparation</p>
        </div>

        {/* Secure Loader Overlay */}
        {secureLoading && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 rounded-2xl">
            <div className="secure-spinner mb-3"></div>
            <p className="text-gray-700 font-medium text-xs tracking-wide">
              Authenticating securely...
            </p>
          </div>
        )}

        {/* Message */}
        {message.text && (
          <div
            className={`p-2 rounded-lg text-xs font-medium animate-fade-in ${
              message.type === "error"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          type="button"
          disabled={secureLoading}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {secureLoading ? "Please wait..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gray-300"></div>
          <span className="absolute bg-white px-2 text-xs text-gray-500">Or with email</span>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => {
                  onClose?.();
                  onSwitchToForgotPassword?.();
                }}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? "Signing in..." : "Sign in to your account"}
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="text-center text-xs text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose?.();
              onSwitchToSignup?.();
            }}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
