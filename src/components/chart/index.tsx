import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAppSelector } from "../../shared/hooks/redux-hook";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

function LineChart() {
  const chart = useAppSelector((state) => state.chart);

  const data = {
    labels: chart.label,
    datasets: [
      {
        fill: true,
        data: chart.data,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className={`mt-4 ${chart.data.length > 0 ? "" : "hidden"}`}>
      <div className="my-4 flex flex-col md:flex-row md:justify-between">
        <h2 className="text-2xl">Historical Chart (100D)</h2>
        <h2 className="text-2xl">{chart.name}</h2>
      </div>
      <Line className="max-h-[24rem]" data={data} options={options} />
    </div>
  );
}

export default LineChart;
