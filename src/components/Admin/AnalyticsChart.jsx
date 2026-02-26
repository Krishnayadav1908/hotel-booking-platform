import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AnalyticsChart = ({ bookings, users, revenue }) => {
  const data = {
    labels: ["Bookings", "Users", "Revenue"],
    datasets: [
      {
        label: "Count",
        data: [bookings, users, revenue],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(16, 185, 129, 0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Admin Analytics" },
    },
  };
  return (
    <div className="w-full max-w-xl mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
};

export default AnalyticsChart;
