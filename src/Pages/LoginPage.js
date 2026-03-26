import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../Service/api';

function LoginPage() {
  


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '', general: '' });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = { username: '', password: '', general: '' };
    let hasError = false;

    if (!username.trim()) {
      newErrors.username = "Username is required.";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

   try {
  const res = await loginUser({ username, password });

  localStorage.setItem("token", res.token);
  localStorage.setItem("username", res.username);
  localStorage.setItem("userId", res.userId);
    console.log(res.token)
  navigate("/homepage");
} catch (error) {
  setErrors({ ...newErrors, general: "Invalid username or password." });
}
  };

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, []);

  return (<div className="min-h-screen flex items-center justify-center bg-slate-900  p-5">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[550px]">
  

        {/* Right Side Form */}
        <div className="w-full  p-8  flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off" className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.username ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500 font-medium">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
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

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="font-bold text-red-500 hover:text-red-600 transition-colors">
                Forgot Password?
              </a>
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                New User? Register
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
