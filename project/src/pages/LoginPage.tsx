import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiLock } from "react-icons/fi";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      if (response.data.success) {
        if (response.data.match) {
          localStorage.setItem("userName", email.split("@")[0]);
          navigate("/dashboard");
        } else {
          setPasswordError("Incorrect email or password");
        }
      } else {
        setPasswordError("Email is not registered");
      }
    } catch (error) {
      setPasswordError("Invalid email or password");
    }
  };

  const handleGoogleSignUp = () => {
    // Simulate sign-up with Google, then redirect to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white px-6 py-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="flex items-center justify-center my-3">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-32 sm:w-40 md:w-48 lg:w-56"
          />
        </div>
        <h2 className="text-lg font-bold text-gray-700 text-center">Log in to your account</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">Please enter your details.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full mt-2 border text-gray-700 text-sm py-2 px-4 rounded-md focus:ring-2 focus:ring-purple-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="off"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••"
              className={`w-full mt-2 border text-gray-700 text-sm py-2 px-4 rounded-md focus:ring-2 focus:ring-purple-500 ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="off"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="flex justify-between items-center text-sm sm:text-base">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-gray-700">Remember for 30 days</label>
            </div>
            <Link to="/forgot-password" className="text-purple-600 hover:text-purple-500 flex items-center">
              <FiLock className="mr-1" /> Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-[#463C6F] text-white text-sm py-2 px-4 rounded-md hover:bg-[#574D84] transition-all duration-200"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full border border-gray-300 text-gray-700 text-sm py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center transition-all duration-200"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
            />
            Sign up with Google
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-purple-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
