import React, { useContext, useState } from "react";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [providerId, setProviderId] = useState("");

  React.useEffect(() => {
    if (
      auth.currentUser &&
      auth.currentUser.providerData &&
      auth.currentUser.providerData.length > 0
    ) {
      setProviderId(auth.currentUser.providerData[0].providerId);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("No user found.");
      return;
    }
    try {
      await updateProfile(auth.currentUser, { displayName });
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("No user found.");
      return;
    }
    if (providerId !== "password") {
      toast.error(
        "Password change only works for email/password accounts. Your provider: " +
          providerId,
      );
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!currentPassword) {
      toast.error("Enter your current password.");
      return;
    }
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated!");
      setNewPassword("");
      setCurrentPassword("");
      setShowPassword(false);
    } catch (error) {
      alert("Password update error: " + (error?.message || "Unknown error"));
      console.error(
        "Password update error:",
        error,
        error?.code,
        error?.message,
      );
      toast.error(
        "Failed to update password: " +
          (error?.message || "Check your current password."),
      );
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 
    bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div
        className="
        w-full max-w-md
        bg-white dark:bg-black/40
        backdrop-blur-lg
        border border-gray-200 dark:border-white/10
        rounded-2xl shadow-xl
        p-8
      "
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          User Profile
        </h2>

        {/* Show provider info and warning if not email/password */}
        <div className="mb-2 text-xs text-gray-500 text-center">
          Auth Provider: <span className="font-mono">{providerId}</span>
          {providerId && providerId !== "password" && (
            <span className="text-red-500 ml-2">
              (Password change not supported for this provider)
            </span>
          )}
        </div>
        {editMode ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              // If password fields are filled, try password change first
              if (showPassword && (currentPassword || newPassword)) {
                await handlePasswordChange(e);
              } else {
                await handleSave(e);
              }
            }}
            className="space-y-5"
          >
            <div>
              <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                className="
                  w-full px-4 py-2 rounded-lg
                  border border-gray-300 dark:border-white/20
                  bg-white dark:bg-white/10
                  text-gray-800 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  transition
                "
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                className="
                  w-full px-4 py-2 rounded-lg
                  border border-gray-300 dark:border-white/20
                  bg-gray-100 dark:bg-white/5
                  text-gray-500 dark:text-gray-400
                  cursor-not-allowed
                "
                value={email}
                disabled
              />
            </div>

            {/* Change Password Section */}
            <div>
              <button
                type="button"
                className="bg-purple-500 text-white px-4 py-2 rounded mb-2"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Cancel Password Change" : "Change Password"}
              </button>
              {showPassword && (
                <div className="mt-2">
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition mb-2"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition mb-2"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-pink-600 text-white px-4 py-2 rounded"
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="submit"
                className="
                  bg-gradient-to-r from-purple-600 to-pink-600
                  text-white px-5 py-2 rounded-lg
                  hover:shadow-lg hover:shadow-purple-500/40
                  transition duration-300
                "
              >
                {showPassword ? "Update Password" : "Save"}
              </button>

              <button
                type="button"
                className="
                  px-5 py-2 rounded-lg
                  border border-gray-300 dark:border-white/20
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-white/10
                  transition
                "
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{displayName || "Not set"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{email}</span>
            </div>

            <div className="text-center pt-6">
              <button
                className="
                  bg-gradient-to-r from-purple-600 to-pink-600
                  text-white px-6 py-2 rounded-lg
                  hover:shadow-lg hover:shadow-purple-500/40
                  transition duration-300
                "
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
