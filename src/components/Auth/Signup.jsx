import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faHotel } from "@fortawesome/free-solid-svg-icons";
import { sendVerificationEmail, signupUser, db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // Name validation
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters!");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email!");
      setIsLoading(false);
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      setIsLoading(false);
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Firebase signup
    try {
      const userCredential = await signupUser(
        email.toLowerCase(),
        password,
        name.trim(),
      );
      const user = userCredential.user || userCredential;
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name.trim(),
            email: email.toLowerCase(),
            createdAt: new Date().toISOString(),
            role: "user", // default role
          });
          console.log("User added to Firestore!");
        } catch (err) {
          toast.error("Failed to save user info: " + err.message);
        }
        await sendVerificationEmail(user);
        toast.success(
          "Signup successful! Please verify your email before logging in.",
        );
        navigate("/login");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error(
          "Email already registered. Please login or use another email.",
        );
      } else {
        toast.error(err.message || "Signup failed. Please try again.");
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 md:px-8 md:py-16 transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-3 rounded-full">
            <FontAwesomeIcon icon={faHotel} className="text-white text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Join us and start booking amazing hotels
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 text-base md:text-lg"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 text-base md:text-lg"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 pr-12 text-base md:text-lg"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-all duration-300"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 text-base md:text-lg"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 text-base md:text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
