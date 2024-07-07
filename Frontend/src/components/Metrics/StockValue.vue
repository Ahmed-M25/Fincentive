<template>
    <div class="bg-gray-700 p-4 rounded-lg shadow-lg w-80">
    <div class="flex justify-between items-center mb-4">
      <div class="text-white font-semibold">Stock Value</div>
    </div>
    <div class="text-4xl font-bold text-sky-400 mb-4">{{ stockValue + "$" }}</div>
    <hr class="mb-4 border-[#D9D9D9] opacity[0.1]">
    <div class="flex items-center">
      <div class="flex-1">
        <div class="text-xl font-semibold text-sky-400">60 <span class="text-white text-sm">Shares</span></div>
        <div class="text-xl font-semibold text-sky-400">7 <span class="text-white text-sm">Stocks</span></div>
      </div>
      <div class="w-24 h-24">
        <DoughnutChart :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>

  </template>
  
<script>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
export default {
  name: "StockValue",
  components: {
    DoughnutChart: Doughnut
  },
  props: {
    stockValue: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      chartData: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          label: 'Goal',
          data: [62, 38], // 62% completed, 38% remaining
          backgroundColor: ['#4A90E2', '#E0E0E0'],
          hoverBackgroundColor: ['#4A90E2', '#E0E0E0'],
          borderWidth: 0
        }]
      },
      chartOptions: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      }
    };
  }
};
</script>
  