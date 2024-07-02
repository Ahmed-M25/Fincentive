<template>
    <div class="home">
      <header class="home-header">
        <div class="title">Welcome to Fincentive</div>
        <div class="auth-buttons">
          <button @click="goToLogin">Login</button>
          <button @click="goToSignup">Sign Up</button>
        </div>
      </header>
      <main class="home-main">
        <h1 class="text-3xl font-bold">Fincentive</h1>
        <p>Track your stocks and manage your investments with ease. Stay updated with the latest market trends and make informed decisions.</p>
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
  .home {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background: url('../assets/StockBg.png');
    background-size: cover;
    color: #ffffff;
  }
  
  .home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: rgba(30, 30, 30, 0.8);
}
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .auth-buttons {
    display: flex;
    gap: 10px;
  }
  
  .auth-buttons button {
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #6200ea;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .auth-buttons button:hover {
    background-color: #3700b3;
  }
  
  .home-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
  }
  
  .home-main h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.2);
  }
  
  .home-main p {
    font-size: 1.2rem;
    max-width: 600px;
    line-height: 1.5;
  }
  </style>
  