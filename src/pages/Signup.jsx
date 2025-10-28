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
    otp: "",
  });

  const BaseUrl = import.meta.env.VITE_BASE_URL;

  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ------------------------------------------------------------------
     🔹 GOOGLE SIGNUP / LOGIN
  ------------------------------------------------------------------ */
  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const payload = {
        firstname: user.displayName?.split(" ")[0] || "",
        lastname: user.displayName?.split(" ")[1] || "",
        email: user.email,
        googleId: user.uid,
        signupMethod: "google",
      };

      // 🔹 1. Try registration first
      let res;
      try {
        res = await axios.post(`${BaseUrl}/website/auth/google-register`, payload);
      } catch (err) {
        // If already exists, just login
        if (err.response?.data?.message?.includes("already registered")) {
          res = await axios.post(`${BaseUrl}/website/auth/google/login`, {
            email: user.email,
          });
        } else {
          throw err;
        }
      }

      // 🔹 2. Store user and show success
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("Login successful via Google!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Google Sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------
     🔹 EMAIL + OTP SIGNUP FLOW
  ------------------------------------------------------------------ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "First name required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalid";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number required";
    if (!formData.password) newErrors.password = "Password required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!otpSent && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await axios.post(`${BaseUrl}/website/auth/otp-send`, {
        email: formData.email,
      });
      setMessage("OTP sent! Check your email.");
      setOtpSent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      await axios.post(`${BaseUrl}/website/auth/otp-send`, {
        email: formData.email,
      });
      setMessage("OTP resent! Check your email.");
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp.trim()) {
      setErrors({ otp: "OTP required" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseUrl}/website/auth/otp-verify`, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        otp: formData.otp,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("Signup successful!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------
     🔹 OTP RESEND TIMER
  ------------------------------------------------------------------ */
  useEffect(() => {
    let interval;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  /* ------------------------------------------------------------------
     🔹 UI
  ------------------------------------------------------------------ */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg sm:max-w-md overflow-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">×</button>

        <div className="bg-gradient-to-r from-blue-600 to-yellow-500 p-5 text-center rounded-t-xl">
          <h2 className="text-white text-2xl sm:text-3xl font-semibold">Create Your Account</h2>
          <p className="text-indigo-100 mt-1 text-sm sm:text-base">Start your exam preparation journey</p>
        </div>

        <div className="p-5">
          {/* GOOGLE SIGNUP BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition shadow-sm mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? "Please wait..." : "Continue with Google"}
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full h-px bg-gray-300"></div>
            <span className="absolute bg-white px-3 text-sm text-gray-500">Or with email</span>
          </div>

          {/* EMAIL + OTP FORM */}
          {!otpSent ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label>First Name</label>
                  <input name="firstname" value={formData.firstname} onChange={handleChange}
                    className={`w-full border ${errors.firstname ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`} />
                  {errors.firstname && <p className="text-xs text-red-600">{errors.firstname}</p>}
                </div>
                <div>
                  <label>Last Name</label>
                  <input name="lastname" value={formData.lastname} onChange={handleChange}
                    className={`w-full border ${errors.lastname ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`} />
                  {errors.lastname && <p className="text-xs text-red-600">{errors.lastname}</p>}
                </div>
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange}
                  className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`} />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              <div className="mb-3">
                <label>Contact Number</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                  className={`w-full border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`} />
                {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`} />
                  {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                </div>
                <div>
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    className={`w-full border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`} />
                  {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label className="block mb-1">OTP</label>
                <div className="relative">
                  <input
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`w-full border ${errors.otp ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 pr-24`}
                    placeholder="Enter OTP"
                  />
                  <div
                    onClick={canResend && !isLoading ? handleResendOtp : undefined}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-1 rounded cursor-pointer select-none
                      ${canResend && !isLoading ? "text-blue-600 hover:text-blue-800" : "text-gray-400 cursor-not-allowed"}`}
                  >
                    {canResend ? "Resend" : `${resendTimer}s`}
                  </div>
                </div>
                {errors.otp && <p className="text-xs text-red-600 mt-1">{errors.otp}</p>}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                {isLoading ? "Verifying..." : "Verify & Create Account"}
              </button>
            </>
          )}

          {message && (
            <p className={`text-center mt-3 ${message.includes("success") || message.includes("Login") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose?.();
                onSwitchToLogin?.();
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
