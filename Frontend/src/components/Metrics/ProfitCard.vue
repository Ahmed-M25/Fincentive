<template>
  <div class="profit-card border border-gray-700 shadow-lg rounded-lg p-4 m-2 flex-1 text-center bg-gray-800 text-white">
    <h2 class="text-xl font-semibold mb-4">Percentage Profit</h2>
    <div class="metric">
      <span class="text-2xl font-bold">{{ percentProfit + "%" }}</span>
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
