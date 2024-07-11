<template>
  <div id="Dashboard" class="flex flex-col items-center justify-center w-full h-full min-h-screen bg-gray-900 text-white">
    <div class="card-container bg-gray-800 p-6 rounded-3xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative min-h-screen flex flex-col justify-center">
      <div class="flex items-center justify-start">
        <h1 class="text-3xl border-l-4 border-[#22A6FF] pl-4 font-headline font-bold">Fincentive</h1>
        <div class="ml-auto">
          <a href="/home" class="px-2 py-1 text-m hover:underline">home</a>
          <button @click="logout" class="px-2 py-1 text-m bg-gray-800 rounded hover:underline">Logout</button>
        </div>
      </div>
      <div class="cards-container flex flex-col justify-center items-center xl:flex-row flex-wrap space-x-10 mt-4 w-full">
        <BalanceCard :currentBalance="currentBalance" :percentProfit="percentProfit" class="w-1/4" />
        <!-- <ProfitCard :percentProfit="percentProfit" class="w-1/4" /> -->
        <StockValue :stockValue="stockValue" class="w-1/4"/>
        <div class="trade-section bg-gray-700 p-4 rounded-lg shadow-lg w-[300px] h-[250px]">
          <div class="flex justify-between items-center mb-4">
            <div class="text-white font-semibold">Trade Stocks</div>
          </div>
          <div class="flex-grow"></div>
          <div class="flex mt-[15%] items-center mb-2">
            <label for="shares" class="mr-2">Shares:</label>
            <input
              type="number"
              v-model="shares"
              id="shares"
              class="w-16 p-1 text-sm border-2 border-gray-700 rounded bg-gray-800 text-white"
              min="1"
            />
          </div>
          <div class="flex space-x-2 mt-auto">
            <button @click="buyShares" class="flex-1 px-2 py-1 text-sm bg-sky-600 rounded hover:bg-sky-700">Buy</button>
            <button @click="sellShares" class="flex-1 px-2 py-1 text-sm bg-cyan-600 rounded hover:bg-cyan-700">Sell</button>
          </div>
        </div>
      </div>
      <div class="w-full relative">
        <LineChart :ticker="ticker" :period="duration" class="w-full bg-gray-700 p-2 rounded" />
        <div class="period flex space-x-2 absolute left-24 top-4">
          <button @click="setTime('Max')" class="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-800">Max</button>
          <button @click="setTime('Year')" class="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-800">Past Year</button>
          <button @click="setTime('Month')" class="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-800">Past Month</button>
        </div>
        <form @submit.prevent="handleSubmit" class="absolute top-4 right-4 flex space-x-2">
          <input
            type="text"
            placeholder="Enter Ticker"
            v-model="ticker"
            class="w-40 p-1 text-sm border-2 border-gray-700 rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            @click="updateTicker"
            class="px-2 py-1 text-sm bg-sky-600 rounded hover:bg-sky-700"
          >
            Search Stock
          </button>
      </form>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import LineChart from "../components/LineChart.vue";
import BalanceCard from "../components/Metrics/BalanceCard.vue";
import StockValue from "../components/Metrics/StockValue.vue";

export default {
  name: "App",
  components: { LineChart, BalanceCard, StockValue },
  data() {
    return {
      ticker: 'IBM',
      shares: 1,
      duration: 'Max',
      currentBalance: 0, // replace later
      percentProfit: 5, // replace later
      stockValue: 300 // replace later
    };
  },
  computed: {
    ...mapGetters('auth', ['token'])
  },
  mounted() {
    this.fetchBalance();
  },
  methods: {
    async fetchBalance() {
      try {
        const idToken = this.token;

        if (!idToken) {
          throw new Error("ID token is missing");
        }

        const response = await fetch('http://localhost:3000/api/balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebaseIdToken: idToken
          })
        });

        if (response.ok) {
          const data = await response.json();
          this.currentBalance = data.balance;
        } else {
          console.error('Error fetching balance');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    updateTicker() {
      this.updateMetrics();
    },
    setTime(period) {
      this.duration = period;
      this.updateMetrics();
    },
    updateMetrics() { // add logic later
      // this.currentBalance = Math.floor(Math.random() * 20000) + 5000;
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

        const response = await fetch('http://localhost:3000/api/transaction', {
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
          await this.fetchBalance();
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
      this.$router.push('/');
    }
  },
};
</script>