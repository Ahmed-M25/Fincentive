<template>
  <div id="container">
    <h1>Stock Market</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-control">
        <label for="Ticker">Ticker </label>
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
  </div>
</template>

<script>
import LineChart from "./components/LineChart.vue";
import Nav from './components/Nav.vue';
export default {
  name: "App",
  components: { LineChart, Nav },
  data() {
    return {
      token: '',
      ticker: 'IBM',
      duration: 'Max',
    };
  },
  methods: {
    updateTicker() {
      this.ticker = this.token;
    },
    setTime(period){
      this.duration = period;
    }
  }
};
</script>

<style scoped>
h1 {
  line-height: 1.5;
  width: auto;
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}
.form-control {
  margin-left: 50px;
}

.period{ 
  display: flex;
  justify-content: space-evenly;
  margin-top: 10px;
}
.period button{
  width: 100px;
}
</style>

