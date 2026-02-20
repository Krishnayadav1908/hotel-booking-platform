import React, { useState } from "react";

export default function Demo2FA() {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState(0); // 0: off, 1: enter phone, 2: enter OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState(false);

  function handleEnable() {
    setStep(1);
  }

  function handleSendOtp(e) {
    e.preventDefault();
    if (!phone.match(/^\d{10}$/)) {
      alert("Enter valid 10-digit phone number");
      return;
    }
    setStep(2);
    // In real app, send OTP here
    alert("Demo: OTP sent! (Use 123456)");
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    if (otp === "123456") {
      setEnabled(true);
      setSuccess(true);
      setStep(0);
    } else {
      alert("Invalid OTP. Try 123456 for demo.");
    }
  }

  function handleDisable() {
    setEnabled(false);
    setSuccess(false);
    setPhone("");
    setOtp("");
    setStep(0);
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        Two-Factor Authentication (2FA) Demo
      </h2>
      {enabled ? (
        <div>
          <p className="text-green-600 font-semibold mb-2">2FA Enabled</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleDisable}
          >
            Disable 2FA
          </button>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <label className="block">
            Enter Phone Number:
            <input
              type="tel"
              className="border rounded px-2 py-1 w-full mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send OTP
          </button>
        </form>
      ) : step === 2 ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <label className="block">
            Enter OTP (Demo: 123456):
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
          >
            Verify OTP
          </button>
        </form>
      ) : (
        <div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleEnable}
          >
            Enable 2FA
          </button>
          {success && (
            <p className="text-green-600 mt-4">2FA enabled successfully!</p>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4">
        * Demo only. In production, OTP will be sent via Firebase/Twilio.
      </p>
    </div>
  );
}
