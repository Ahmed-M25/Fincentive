<template>
  <Line
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    style="width: 900px"
  />
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
            ticks: {
              color: '#ffffff',
            }
          },
          y: {
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
                backgroundColor: 'rgba(128, 0, 128, 0.2)',
                borderColor: 'rgba(128, 0, 128, 1)',
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
      return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.ticker}&outputsize=full&apikey=demo`;
    },
  },
  mounted() {
    this.rangeStockChart();
  },
};
</script>

<style scoped>
.line-chart {
  width: 100%;
  margin-top: 20px;
}
</style>
