<template>
  <div id="Dashboard" class="flex flex-col items-center justify-center w-full h-full min-h-screen bg-gray-900 text-white">
    <div class="card-container bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
      <button @click="logout" class="absolute top-2 right-2 px-2 py-1 text-sm bg-red-600 rounded hover:bg-red-700">Logout</button>
      <h1 class="text-2xl font-bold text-center mb-4">Fincentive</h1>
      <form @submit.prevent="handleSubmit" class="mb-4">
        <div class="form-control flex items-center justify-center space-x-2">
          <input
            type="text"
            placeholder="Enter Ticker"
            v-model="ticker"
            class="w-40 p-1 text-sm border-2 border-gray-700 rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            @click="updateTicker"
            class="px-2 py-1 text-sm bg-purple-600 rounded hover:bg-purple-700"
          >
            Search Stock
          </button>
        </div>
      </form>
      <div class="period flex space-x-2 mb-4">
        <button @click="setTime('Max')" class="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-800">Max</button>
        <button @click="setTime('Year')" class="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-800">Past Year</button>
        <button @click="setTime('Month')" class="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-800">Past Month</button>
      </div>
      <div class="cards-container flex justify-center space-x-2 mb-4 w-full">
        <BalanceCard :currentBalance="currentBalance" class="w-1/4" />
        <ProfitCard :percentProfit="percentProfit" class="w-1/4" />
        <StockValue :stockValue="stockValue" class="w-1/4" />
        <div class="trade-section border border-gray-700 shadow-lg rounded-lg p-2 flex-1 text-center bg-gray-800 text-white w-1/4">
          <h2 class="text-lg font-bold mb-2 text-center">Trade</h2>
          <div class="flex items-center mb-2">
            <label for="shares" class="mr-2">Shares:</label>
            <input
              type="number"
              v-model="shares"
              id="shares"
              class="w-16 p-1 text-sm border-2 border-gray-700 rounded bg-gray-800 text-white"
              min="1"
            />
          </div>
          <div class="flex space-x-2">
            <button @click="buyShares" class="flex-1 px-2 py-1 text-sm bg-green-600 rounded hover:bg-green-700">Buy</button>
            <button @click="sellShares" class="flex-1 px-2 py-1 text-sm bg-red-600 rounded hover:bg-red-700">Sell</button>
          </div>
        </div>
      </div>
      <div class="w-full">
        <LineChart :ticker="ticker" :period="duration" class="w-full bg-gray-700 p-2 rounded" />
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
    ...mapGetters('auth', ['token'])
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