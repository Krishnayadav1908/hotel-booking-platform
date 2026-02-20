import React, { useState } from "react";

const PaymentDemo = ({ amount, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1500); // Simulate payment delay
  };

  return (
    <form onSubmit={handlePayment} className="mt-4">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <input
          type="text"
          className="w-full border px-2 py-1 rounded"
          placeholder="1234 5678 9012 3456"
          required
          maxLength={19}
        />
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Expiry</label>
          <input
            type="text"
            className="w-full border px-2 py-1 rounded"
            placeholder="MM/YY"
            required
            maxLength={5}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            type="password"
            className="w-full border px-2 py-1 rounded"
            placeholder="123"
            required
            maxLength={4}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={processing}
        className="w-full bg-green-600 text-white py-2 rounded mt-2 font-semibold disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

export default PaymentDemo;
