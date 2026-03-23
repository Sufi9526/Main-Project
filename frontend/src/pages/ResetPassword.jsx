import React, { useState } from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// നിങ്ങളുടെ Backend URL ശ്രദ്ധിക്കുക
const API_URL = "http://localhost:5000/api/auth";

export default function ResetPassword() {
  const { token } = useParams(); // URL-ൽ നിന്നുള്ള രഹസ്യ ടോക്കൺ എടുക്കുന്നു
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // പാസ്‌വേഡുകൾ മാച്ച് ചെയ്യുന്നുണ്ടോ എന്ന് നോക്കുന്നു
    if (password !== confirmPassword) {
      return setMessage("Error: Passwords do not match!");
    }

    setLoading(true);
    setMessage('');

    try {
      // ബാക്ക് എൻഡിലെ reset-password/:token റൂട്ടിലേക്ക് പുതിയ പാസ്‌വേഡ് അയക്കുന്നു
      const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      
      setMessage(res.data.message);
      
      // പാസ്‌വേഡ് മാറിക്കഴിഞ്ഞാൽ 2 സെക്കൻഡ് കഴിഞ്ഞ് ലോഗിൻ പേജിലേക്ക് വിടുന്നു
      setTimeout(() => {
        navigate("/auth?mode=signin");
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto p-8 border border-gray-200 rounded-xl shadow-lg bg-white space-y-6 w-full">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-blue-600">Set New Password</h2>
          <p className="text-gray-500 text-sm">നിങ്ങളുടെ പുതിയ പാസ്‌വേഡ് താഴെ നൽകുക</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="mt-1 w-full px-3 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="mt-1 w-full px-3 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>

        {message && (
          <p className={`text-center text-sm p-2 rounded ${
            message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}