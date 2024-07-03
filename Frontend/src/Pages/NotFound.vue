<template>
    <div class="not-found flex items-center justify-center h-screen bg-gray-900 text-white">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4">404</h1>
        <p class="text-xl mb-4">Oops! The page you are looking for does not exist.</p>
        <router-link to="/" class="text-purple-600 hover:underline">Go back to Home</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  