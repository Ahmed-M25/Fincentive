<template>
    <div class="metrics-card">
      <h2>Stock Metrics</h2>
      <div class="metric">
        <span>Current Balance:</span>
        <span>{{ currentBalance }}</span>
      </div>
      <div class="metric">
        <span>% Profit:</span>
        <span>{{ percentProfit }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "MetricsCard",
    props: {
      currentBalance: {
        type: Number,
        required: true,
      },
      percentProfit: {
        type: Number,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .metrics-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin: 20px;
    width: 300px;
    text-align: center;
  }
  .metric {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
  </style>
  