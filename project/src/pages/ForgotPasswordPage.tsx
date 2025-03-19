import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password reset logic here
    alert('Password reset instructions sent to your email');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center mb-6">
        <div className="flex items-center my-1">
        <img src="/logo.svg" alt="Logo" className="w-30 h-10 flex items-center justify-center "   />
        {/* <span className="ml-2 text-l font-bold  flex items-center justify-center ">NexaAdmin</span> */}
      </div>
        </div>
        <h2 className="text-xl font-bold text-gray-600 my-1 flex items-center justify-center">Forgot password?</h2>
        <p className="text-gray-600 text-sm mb-6 flex items-center justify-center">No worries, we'll send you reset instructions.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-3 border border-gray-300 text-gray-700 py-1 px-2 mt-2 rounded-md flex items-center justify-center hover:border-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#463C6F] text-white py-2 px-4 rounded-md hover:bg-[#574D84] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Reset password
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-purple-600 hover:text-purple-500 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;