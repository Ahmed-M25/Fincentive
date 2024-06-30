<template>
    <div class="profit-card">
      <h2>% Profit</h2>
      <div class="metric">
        <span>{{ percentProfit }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProfitCard",
    props: {
      percentProfit: {
        type: Number,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .profit-card {
    border: 1px solid #444444;
    border-radius: 10px;
    padding: 20px;
    margin: 20px;
    flex: 1;
    text-align: center;
    background-color: #1e1e1e;
    color: #ffffff;
  }
  </style>
  