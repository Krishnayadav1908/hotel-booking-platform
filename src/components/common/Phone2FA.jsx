import React, { useState } from "react";
import { sendPhoneOtp, verifyPhoneOtp } from "../../services/firebase";

export default function Phone2FA() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(0); // 0: enter phone, 1: enter OTP
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Firebase expects phone in +91XXXXXXXXXX format
      if (!phone.match(/^\+\d{10,15}$/)) {
        setError("Enter phone in +91XXXXXXXXXX format");
        setLoading(false);
        return;
      }
      const result = await sendPhoneOtp(phone);
      setConfirmationResult(result);
      setStep(1);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyPhoneOtp(confirmationResult, otp);
      setSuccess(true);
      setStep(0);
    } catch (err) {
      setError("Invalid OTP or expired. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        Phone OTP (2FA) - Firebase Live
      </h2>
      <div id="recaptcha-container"></div>
      {success ? (
        <div className="text-green-600 font-semibold">
          Phone verified! 2FA enabled.
        </div>
      ) : step === 0 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <label className="block">
            Enter Phone Number:
            <input
              type="tel"
              className="border rounded px-2 py-1 w-full mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +919876543210"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <label className="block">
            Enter OTP:
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mt-1"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      )}
      <p className="text-xs text-gray-500 mt-4">
        * Live Firebase OTP. Use valid phone number. reCAPTCHA required.
      </p>
    </div>
  );
}
