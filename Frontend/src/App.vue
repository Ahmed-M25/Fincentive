<template>
  <div id="app">
    <div id="container">
      <h1>Stock Market</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-control">
          <input type="text" placeholder="Enter Ticker" v-model="token" />
          <button type="submit" @click="updateTicker">Search Stock</button>
        </div>
      </form>
      <div class="period">
        <button @click="setTime('Max')">Max</button>
        <button @click="setTime('Year')">Past Year</button>
        <button @click="setTime('Month')">Past Month</button>
      </div>
      <LineChart :ticker="ticker" :period="duration" />
      <div class="metrics-container">
        <BalanceCard :currentBalance="currentBalance" />
        <ProfitCard :percentProfit="percentProfit" />
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from "./components/LineChart.vue";
import BalanceCard from "./Metrics/BalanceCard.vue";
import ProfitCard from "./Metrics/ProfitCard.vue";

export default {
  name: "App",
  components: { LineChart, BalanceCard, ProfitCard },
  data() {
    return {
      token: '',
      ticker: 'IBM',
      duration: 'Max',
      currentBalance: 10000,  // Example initial balance
      percentProfit: 5,  // Example initial profit percentage
    };
  },
  methods: {
    updateTicker() {
      this.ticker = this.token;
      // Simulate updating metrics based on the new ticker
      this.updateMetrics();
    },
    setTime(period) {
      this.duration = period;
      // Simulate updating metrics based on the new period
      this.updateMetrics();
    },
    updateMetrics() {
      // Replace this with actual logic to update current balance and profit
      // For now, it just sets random values for demonstration
      this.currentBalance = Math.floor(Math.random() * 20000) + 5000;
      this.percentProfit = (Math.random() * 100).toFixed(2);
    },
  },
};
</script>

<style scoped>

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.2);
}

.form-control {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.form-control input[type="text"] {
  width: 300px;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #333333;
  border-radius: 5px;
  margin-right: 10px;
  background-color: #1e1e1e;
  color: #ffffff;
}

.form-control button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #6200ea;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-control button:hover {
  background-color: #3700b3;
}

.period {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.period button {
  width: 120px;
  background-color: #333333;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
}

.period button:hover {
  background-color: #555555;
}

.metrics-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}
</style>
