<template>
  <div id="Dashboard" class="flex flex-col items-center justify-center w-full h-full min-h-screen bg-gray-900 text-white">
    <button @click="logout" class="absolute top-4 right-4 px-4 py-2 text-lg bg-red-600 rounded hover:bg-red-700">Logout</button>
    <h1 class="text-4xl font-bold text-center mb-8">Fincentive</h1>
    <form @submit.prevent="handleSubmit" class="mb-6">
      <div class="form-control flex items-center justify-center space-x-4">
        <input
          type="text"
          placeholder="Enter Ticker"
          v-model="ticker"
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
      <div class="metrics-container flex flex-col iterms-center justify-center w-1/3 p-4">
        <BalanceCard :currentBalance="currentBalance" />
        <ProfitCard :percentProfit="percentProfit" />
        <StockValue :stockValue="stockValue" />
      </div>
      <LineChart :ticker="ticker" :period="duration" class=" bg-gray-800 p-4 rounded" />
      <div class="flex items-center justify-center w-1/4">
        <div class="trade-section ml-6 mt-6 p-4 bg-gray-800 rounded shadow-lg">
          <h2 class="text-xl font-bold mb-4 text-center">Trade</h2>
          <div class="flex items-center mb-4">
            <label for="shares" class="mr-4">Shares:</label>
            <input
              type="number"
              v-model="shares"
              id="shares"
              class="w-24 p-2 text-lg border-2 border-gray-700 rounded bg-gray-800 text-white"
              min="1"
            />
          </div>
          <div class="flex space-x-4">
            <button @click="buyShares" class="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-700">Buy</button>
            <button @click="sellShares" class="flex-1 px-4 py-2 bg-red-600 rounded hover:bg-red-700">Sell</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LineChart from "../components/LineChart.vue";
import BalanceCard from "../components/Metrics/BalanceCard.vue";
import ProfitCard from "../components/Metrics/ProfitCard.vue";
import StockValue from "../components/Metrics/StockValue.vue";

export default {
  name: "App",
  components: { LineChart, BalanceCard, ProfitCard, StockValue },
  data() {
    return {
      ticker: 'IBM',
      shares: 1,
      duration: 'Max',
      currentBalance: 10000, // replace later
      percentProfit: 5, // replace later
      stockValue: 300 // replace later
    };
  },
  computed: {
    ...mapGetters('auth', ['token']) // Ensure 'token' getter is mapped from the 'auth' module
  },
  methods: {
    updateTicker() {
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
    async buyShares() {
      await this.recordTransaction('buy');
      console.log(`Buying ${this.shares} shares of ${this.ticker}`);
      console.log(this.token);
    },
    async sellShares() {
      await this.recordTransaction('sell');
      console.log(`Selling ${this.shares} shares of ${this.ticker}`);
    },
    async recordTransaction(type) {
      try {
        const idToken = this.token;

        if (!idToken) {
          throw new Error("ID token is missing");
        }

        const response = await fetch('http://localhost:3000/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebaseIdToken: idToken,
            ticker: this.ticker,
            shares: this.shares,
            type: type
          })
        });

        if (response.ok) {
          console.log('Transaction recorded');
          this.updateMetrics();
        } else {
          console.error('Error recording transaction');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
};
</script>