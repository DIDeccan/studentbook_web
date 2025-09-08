import { Bar } from 'react-chartjs-2';

const ChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        barThickness: 20, // Adjust as needed
        borderRadius: 5, // For rounded corners
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
    },
    scales: {
      x: {
        beginAtZero: false,
        max: 35, // Adjust based on your max value
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
            display: false, // Show vertical grid lines
            drawBorder: false,
        }
      },
      y: {
        grid: {
            display: false, // Hide horizontal grid lines
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default ChartComponent