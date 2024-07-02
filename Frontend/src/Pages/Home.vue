<template>
  <div class="home min-h-screen flex flex-col bg-cover bg-center text-white bg-hero">
    <header class="home-header flex justify-between items-center p-5 bg-gray-900 bg-opacity-80">
      <div class="title text-xl font-bold">Welcome to Fincentive</div>
      <div class="auth-buttons flex gap-4">
        <button @click="goToLogin" class="px-4 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded">Login</button>
        <button @click="goToSignup" class="px-4 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded">Sign Up</button>
      </div>
    </header>
    <main class="home-main flex-1 flex flex-col justify-center items-center p-5 text-center">
      <h1 class="text-4xl font-bold mb-5 text-shadow-md">Fincentive</h1>
      <p class="text-lg max-w-xl leading-relaxed">Track your stocks and manage your investments with ease. Stay updated with the latest market trends and make informed decisions.</p>
    </main>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
    goToSignup() {
      this.$router.push({ name: 'Signup' });
    },
  },
};
</script>

<style scoped>
.text-shadow-md {
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.2);
}
</style>
