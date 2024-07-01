<template>
    <div class="balance-card">
      <h2>Current Balance</h2>
      <div class="metric">
        <span>{{ currentBalance }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BalanceCard",
    props: {
      currentBalance: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .balance-card {
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
  