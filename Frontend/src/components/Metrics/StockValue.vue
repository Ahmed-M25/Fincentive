<template>
    <div class="stock-value-card border border-gray-700 shadow-lg rounded-lg p-4 m-2 flex-1 text-center bg-gray-700 text-white">
      <h2 class="text-xl font-semibold mb-4">Stock Value</h2>
      <div class="metric">
        <span class="text-2xl font-bold">{{ stockValue + "$" }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StockValue",
    props: {
      stockValue: {
        type: Number,
        required: true,
      },
    },
  };
  </script>
  