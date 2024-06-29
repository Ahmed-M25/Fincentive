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
        datasets: [{ data: [40, 20, 12] }],
      },
      chartOptions: {
        responsive: true,
        backgroundColor: "#f87979",
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
      },
      // ticker: "IBM",
      stockMarketHistory: [],
      stockMarketHistoryDates: [],
      stockMarketHistoryEpochDates: [],
      stockMarketHistoryPrices: [],
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
          this.stockMarketHistory = response.data;
          const labels = [];
          const data = [];
          console.log(this.ticker);
          console.log(this.stockMarketHistory["Time Series (Daily)"]);
          // console.log(this.stockMarketHistory)
          for (const property in this.stockMarketHistory[
            "Time Series (Daily)"
          ]) {
            let openPrice =
              this.stockMarketHistory["Time Series (Daily)"][property][
                "1. open"
              ];
            if (this.period === "Max") {
              labels.unshift(property);
              data.unshift(openPrice);
            } else if (this.period === "Year") {
                if (property.split("-")[0] > 2022) {
                  labels.unshift(property);
                  data.unshift(openPrice);
                }
            } else{
              if(property.split("-")[1] > 5 && property.split("-")[0] == 2024) {
                labels.unshift(property);
                data.unshift(openPrice);
              }
            }
          }

          this.chartData = {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: "#f87979",
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
  created() {
    console.log(this.apiLink);
  },
};
</script>
