import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    specialChar: false,
  });

  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "password") {
      setPasswordValidations({
        length: value.length >= 6,
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }

    if (name === "name" && value && !validateName(value)) {
      setErrors(prev => ({ ...prev, name: "Name should contain only alphabets" }));
    }
    if (name === "email" && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: "Invalid email format" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Required field validation
    if (!formData.name) newErrors.name = "Name is required";
    else if (!validateName(formData.name)) newErrors.name = "Name should contain only alphabets";
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Check if email already exists
      const checkResponse = await axios.get('http://localhost:3001/users', {
        params: { email: formData.email }
      });

      if (checkResponse.data.length > 0) {
        setErrors({ email: "Email already registered" });
        return;
      }

      // Register user
      const response = await axios.post('http://localhost:3001/users', formData);
      
      if (response.status === 201) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setFormData({ name: "", email: "", password: "" });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
      console.error(error);
    }
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

        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-700 text-center">
          Create an account
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 text-center">
          Start your 30-day free trial.
        </p>

        {successMessage && (
          <div className="text-green-600 text-center mb-4">{successMessage}</div>
        )}
        {errors.submit && (
          <div className="text-red-600 text-center mb-4">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-2 border border-gray-300 text-gray-700 text-sm sm:text-base py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-2 border border-gray-300 text-gray-700 text-sm sm:text-base py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full mt-2 border border-gray-300 text-gray-700 text-sm sm:text-base py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <div className="text-sm mt-1 space-y-2">
              {[
                { valid: passwordValidations.length, text: "Must be at least 6 characters" },
                { valid: passwordValidations.specialChar, text: "Must contain one special character" },
              ].map(({ valid, text }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${valid ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}>
                    <svg className={`w-3 h-3 ${valid ? "text-white" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className={valid ? "text-gray-800" : "text-gray-500"}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#463C6F] text-white text-sm sm:text-base py-2 px-4 rounded-md hover:bg-[#574D84] transition-all duration-200"
          >
            Get started
          </button>
        </form>

        <button className="w-full mt-4 bg-white border border-gray-300 text-gray-700 text-sm sm:text-base py-2 px-4 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
          />
          <span>Sign up with Google</span>
        </button>

        <p className="mt-4 text-center text-sm sm:text-base text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;