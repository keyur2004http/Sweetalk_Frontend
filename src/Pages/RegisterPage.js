import React, { useState } from 'react';
import { registerUser } from '../Service/api';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '', general: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = { username: '', email: '', password: '', general: '' };
    let hasError = false;

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      hasError = true;
      
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerUser({ username, email, password,firstname,lastname });
      navigate('/');
    } catch (err) {
      newErrors.general = 'Registration failed. Please try again.';
      setErrors(newErrors);
    }
  };

 return(<div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
        
        <div className="w-full p-8 flex flex-col justify-center bg-white">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Join our community today.</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded animate-pulse">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleRegister} autoComplete="off" className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.username ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500 font-medium">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.username ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter Your First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.username ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter Your Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
            >
              Get Started
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
