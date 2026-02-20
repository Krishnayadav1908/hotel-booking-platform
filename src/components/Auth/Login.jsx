import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import {
  signInWithGoogle,
  signInWithFacebook,
  sendResetPasswordEmail,
} from "../../services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faHotel } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast.success("Login successful!");
      navigate("/");
    }

    setIsLoading(false);
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) navigate("/");
    } catch {
      toast.error("Google login failed");
    }
    setIsLoading(false);
  }

  async function handleFacebookLogin() {
    setIsLoading(true);
    try {
      const user = await signInWithFacebook();
      if (user) navigate("/");
    } catch {
      toast.error("Facebook login failed");
    }
    setIsLoading(false);
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    try {
      await sendResetPasswordEmail(resetEmail);
      toast.success("Password reset email sent!");
      setShowReset(false);
      setResetEmail("");
    } catch {
      toast.error("Failed to send reset email");
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-3 rounded-full">
            <FontAwesomeIcon icon={faHotel} className="text-white text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Sign in to continue booking hotels
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white pr-12"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold"
            type="button"
          >
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            type="button"
          >
            Continue with Facebook
          </button>
        </div>

        {/* Forgot Password */}
        <div className="mt-3 text-right">
          <button
            type="button"
            className="text-sm text-purple-600 hover:underline"
            onClick={() => setShowReset(!showReset)}
          >
            Forgot Password?
          </button>
        </div>

        {showReset && (
          <form onSubmit={handleResetPassword} className="mt-3 space-y-2">
            <input
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 rounded"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
