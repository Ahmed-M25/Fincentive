<template>
  <div class="bg-gray-700 p-4 rounded-lg shadow-lg w-80">
    <div class="flex justify-between items-center mb-4">
      <div class="text-white font-semibold">Current Balance</div>
      <div class="text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
      </div>
    </div>
    <div class="text-4xl font-bold text-sky-400 mb-4">{{ currentBalance + "$" }}</div>
    <hr class="mb-4 border-[#D9D9D9] opacity[0.1]">
    <div class="relative pt-1">
      <div class="flex mb-2 items-center justify-between">
        <div class="text-xs font-semibold text-white">Percentage Profit</div>
        <div class="text-xs font-semibold text-white">{{ percentProfit + "%" }}</div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
        <div :style="{ width: percentProfit + '%' }" class="shadow-none max-w-[100%] flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "BalanceCard",
    props: {
      percentProfit: {
        type: Number,
        required: true,
      },
      currentBalance: {
        type: Number,
        required: true,
      },
  },
};
</script>