<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-lg w-full h-96">
    <Line
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      class="w-full h-full"
    />
  </div>
</template>

<script>
import axios from "axios";
import { Line } from "vue-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export default {
  name: "LineChart",
  components: { Line },
  props: {
    ticker: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{ 
          label: `${this.ticker} Stock Price`,
          backgroundColor: 'rgba(128, 0, 128, 0.2)',
          borderColor: 'rgba(128, 0, 128, 1)',
          data: [] 
        }],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: "x", // or 'y' for vertical panning or 'xy' for both
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              drag: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "x", // or 'y' for vertical zooming or 'xy' for both
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: '#6b7280',
            },
            ticks: {
              color: '#ffffff',
            }
          },
          y: {
            grid: {
              color: '#6b7280',
            },
            ticks: {
              color: '#ffffff',
            }
          }
        }
      },
      stockMarketHistory: [],
    };
  },
  watch: {
    ticker: "rangeStockChart",
    period: "rangeStockChart",
  },
  methods: {
    rangeStockChart() {
      axios
        .get(this.apiLink)
        .then((response) => {
          this.stockMarketHistory = response.data["Time Series (Daily)"];
          const labels = [];
          const data = [];

          for (const date in this.stockMarketHistory) {
            let openPrice = this.stockMarketHistory[date]["1. open"];
            if (this.period === "Max") {
              labels.unshift(date);
              data.unshift(openPrice);
            } else if (this.period === "Year") {
              if (new Date(date).getFullYear() > new Date().getFullYear() - 1) {
                labels.unshift(date);
                data.unshift(openPrice);
              }
            } else if (this.period === "Month") {
              const currentDate = new Date();
              const dataDate = new Date(date);
              if (
                dataDate.getFullYear() === currentDate.getFullYear() &&
                dataDate.getMonth() === currentDate.getMonth()
              ) {
                labels.unshift(date);
                data.unshift(openPrice);
              }
            }
          }

          this.chartData = {
            labels: labels,
            datasets: [
              {
                label: `${this.ticker} Stock Price`,
                backgroundColor: 'rgba(70, 130, 180, 0.2)',
                borderColor: 'rgba(70, 130, 180, 1)',
                data: data,
              },
            ],
          };
        })
        .catch((error) => {
          console.error("Error fetching stock market history:", error);
        });
    },
  },
  computed: {
    apiLink() {
      const apiKey = import.meta.env.VUE_APP_API_KEY;
      return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.ticker}&outputsize=full&apikey=${apiKey}`;
    },
  },
  mounted() {
    this.rangeStockChart();
  },
};
</script>
