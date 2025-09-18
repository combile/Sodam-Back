import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PopulationData {
  region: string;
  population: number;
}

interface PopulationChartProps {
  data: PopulationData[];
}

const PopulationChart: React.FC<PopulationChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.region),
    datasets: [
      {
        label: "인구수",
        data: data.map((item) => item.population),
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "지역별 주거인구 현황",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `인구수: ${context.parsed.y.toLocaleString()}명`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString() + "명";
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px", margin: "20px 0" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PopulationChart;
