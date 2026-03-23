import { useState, useEffect } from "react";
import { User, Mail, Calendar, Lock, Settings } from "lucide-react";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <User className="w-16 h-16 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-700">Please log in to view your profile</h2>
            </div>
        );
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage("");

        if (newPassword !== confirmPassword) {
            setPasswordMessage("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage("New password must be at least 6 characters.");
            return;
        }

        setPasswordLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/update-password", {
                email: user.email,
                currentPassword,
                newPassword,
            });

            setPasswordMessage(res.data.message || "Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setPasswordMessage(error.response?.data?.message || "Failed to update password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                <p className="text-gray-500 mt-2">Manage your account details and preferences.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-blue-100 shadow-md text-5xl font-bold uppercase">
                            {(user.displayName || user.fullName || user.name || user.email || "U").charAt(0)}
                        </div>
                    )}
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Active User
                    </span>
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <User size={16} /> Full Name
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium">
                                {user.displayName || user.fullName || user.name || "N/A"}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Mail size={16} /> Email Address
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium">
                                {user.email || "N/A"}
                            </div>
                        </div>

                        {/* Join Date Field (Mock since it's from localstorage usually) */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Calendar size={16} /> Account Information
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 text-sm">
                                Signed in securely via {user.photoURL ? 'Google Authentication' : 'Email & Password'}.
                            </div>
                        </div>

                    </div>

                    {/* Settings / Security Section */}
                    {/* Only show password change if user signed in with email (has no photoURL typically indicating Google login) */}
                    {!user.photoURL && (
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <Settings size={20} className="text-gray-500" /> Security Settings
                            </h3>

                            <form onSubmit={handlePasswordChange} className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4">
                                <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                    <Lock size={16} /> Change Password
                                </h4>

                                <div className="space-y-3">
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Current Password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {passwordMessage && (
                                    <div className={`p-3 rounded-lg text-sm font-medium ${passwordMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {passwordMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
