import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://localhost:5000/api/auth";

const supabase = {
  auth: {
    signUp: async ({ email, password }) => {
      console.log('Attempting Supabase Sign Up:', email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { data: { user: { email } }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      console.log('Attempting Supabase Sign In:', email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (email !== "" && password !== "") {
        return { data: { session: true }, error: null };
      }
      return { data: null, error: { message: 'Invalid credentials' } };
    },
  },
};

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isSigningIn, setIsSigningIn] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setIsSigningIn(false);
    } else {
      setIsSigningIn(true);
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard/tripplan/home");
    } catch (error) {
      console.log(error);
      setMessage("Google Login Failed");
    }
  };

  
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending reset link]");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (isForgotPassword) {
      return handleForgotSubmit(e);
    }

    setLoading(true);
    setMessage('');

    try {
      if (isSigningIn) {
        const { data, error } =
          await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;

        if (data.session) {
          const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
          localStorage.setItem("token", res.data.token);
          if (res.data.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }

          setMessage('Sign In Successful! Redirecting...');
          setTimeout(() => {
            navigate("/dashboard/tripplan/home");
          }, 1000);
        }
      } else {
        await supabase.auth.signUp({ email, password });
        await axios.post(`${API_URL}/api/auth/signup`, { fullName, email, password });

        setMessage('Sign Up Successful! Redirecting to Sign In...');
        setTimeout(() => {
          setIsSigningIn(true);
          setMessage('');
          navigate("/auth?mode=signin");
        }, 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message
          ? `Error: ${error.response.data.message}`
          : `Error: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto p-8 border border-gray-200 rounded-xl shadow-lg bg-white space-y-6 w-full">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-600">Travel Planner</h1>
          <p className="text-gray-500 text-sm">
            Welcome to your travel planning platform
          </p>
        </div>
        {!isForgotPassword && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Authentication</h2>
            <p className="text-gray-500 text-sm text-center">
              Sign in to your account or create a new one
            </p>

            <div className="flex bg-gray-100 rounded-md p-0.5 border border-gray-200">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md ${isSigningIn ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                onClick={() => {
                  setIsSigningIn(true);
                  setIsForgotPassword(false); // Reset forgot state
                  setMessage('');
                  navigate("/auth?mode=signin");
                }}
              >
                Sign In
              </button>

              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md ${!isSigningIn ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                onClick={() => {
                  setIsSigningIn(false);
                  setIsForgotPassword(false); // Reset forgot state
                  setMessage('');
                  navigate("/auth?mode=signup");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* ✅ Forgot Password Title */}
        {isForgotPassword && (
          <h2 className="text-xl font-semibold text-center">Reset Your Password</h2>
        )}
        {!isForgotPassword && (
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-black rounded-lg py-3 px-4 font-semibold text-lg hover:bg-gray-100 transition duration-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
              alt="Google Logo"
              className="w-6 h-6"
            />
            <span>Continue with Google</span>
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSigningIn && !isForgotPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Fullname"
                required
                className="mt-1 w-full px-3 py-3 border rounded-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="mt-1 w-full px-3 py-3 border rounded-md "
            />
          </div>

          
          {!isForgotPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="mt-1 w-full px-3 py-3 border rounded-md"
              />
            </div>
          )}

          {isSigningIn && !isForgotPassword && (
            <div className='mb-4'>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-700 text-sm hover:underline"
              >
                Forget Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold"
          >
            {loading
              ? 'Processing...'
              : isForgotPassword
                ? 'Send Reset Link'
                : isSigningIn
                  ? 'Sign In'
                  : 'Create Account'}
          </button>
          {isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-center text-gray-500 text-sm hover:underline"
            >
              Back to Login
            </button>
          )}
        </form>

        {message && (
          <p className={`text-center text-sm ${message.includes('Error') || message.includes('നിലവിലില്ല') ? 'text-red-600' : 'text-green-600'
            }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}   