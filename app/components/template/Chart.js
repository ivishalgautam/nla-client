"use client";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, // Rename the imported Chart
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";

const Chart = ({ points }) => {
  console.log(points);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});
  // Sample data for the chart
  useEffect(() => {
    setChartData({
      labels: [...points],
      datasets: [
        {
          label: "Example Data",
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(75,192,192,0.4)",
          hoverBorderColor: "rgba(75,192,192,1)",
          data: [...points],
        },
      ],
    });

    setChartOptions({
      scales: {
        y: {
          type: "linear", // Use 'linear' scale for the y-axis if needed
          beginAtZero: true,
        },
        x: {
          type: "category", // Use 'category' scale for the x-axis
          // Configure the x-axis as needed
        },
      },
    });
  }, [points]);

  return (
    <div className="chart">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default Chart;
