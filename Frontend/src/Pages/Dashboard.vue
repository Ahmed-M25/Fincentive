<template>
  <div id="Dashboard" class="flex flex-col items-center justify-center w-full h-full min-h-screen bg-gray-900 text-white">
    <h1 class="text-4xl font-bold text-center mb-8">Fincentive</h1>
    <form @submit.prevent="handleSubmit" class="mb-6">
      <div class="form-control flex items-center justify-center space-x-4">
        <input
          type="text"
          placeholder="Enter Ticker"
          v-model="token"
          class="w-72 p-2 text-lg border-2 border-gray-700 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          @click="updateTicker"
          class="px-4 py-2 text-lg bg-purple-600 rounded hover:bg-purple-700"
        >
          Search Stock
        </button>
      </div>
    </form>
    <div class="period flex space-x-4 mb-6">
      <button @click="setTime('Max')" class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">Max</button>
      <button @click="setTime('Year')" class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">Past Year</button>
      <button @click="setTime('Month')" class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">Past Month</button>
    </div>
    <div class="main-content flex w-full h-full max-w-7xl">
      <div class="metrics-container flex flex-col  w-1/4 p-4">
        <BalanceCard :currentBalance="currentBalance" />
        <ProfitCard :percentProfit="percentProfit" />
        <StockValue :stockValue="stockValue" />
      </div>
      <LineChart :ticker="ticker" :period="duration" class="w-3/4 bg-gray-800 p-4 rounded" />
    </div>
  </div>
</template>

<script>
import LineChart from "../components/LineChart.vue";
import BalanceCard from "../components/Metrics/BalanceCard.vue";
import ProfitCard from "../components/Metrics/ProfitCard.vue";
import StockValue from "../components/Metrics/StockValue.vue";

export default {
  name: "App",
  components: { LineChart, BalanceCard, ProfitCard, StockValue },
  data() {
    return {
      token: '',
      ticker: 'IBM',
      duration: 'Max',
      currentBalance: 10000, // replace later
      percentProfit: 5, // replace later
      stockValue: 300 // replace later
    };
  },
  methods: {
    updateTicker() {
      this.ticker = this.token;
      this.updateMetrics();
    },
    setTime(period) {
      this.duration = period;
      this.updateMetrics();
    },
    updateMetrics() { // add logic later
      this.currentBalance = Math.floor(Math.random() * 20000) + 5000;
      this.percentProfit = parseFloat((Math.random() * 100).toFixed(2));
      this.stockValue = Math.floor(Math.random() * 20000) + 5000;
    },
  },
};
</script>
