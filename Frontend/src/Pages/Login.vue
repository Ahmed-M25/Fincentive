<template>
  <div class="login">
    <auth-form title="Login" buttonText="Login" :onSubmit="handleLogin" />
    <error-card
      v-if="errorMessage"
      :message="errorMessage"
      @close="errorMessage = null"
    />
  </div>
</template>

<script>
import AuthForm from "../components/AuthForm.vue";
import ErrorCard from '../components/ErrorCard.vue'

export default {
  name: "Login",
  components: {
    AuthForm,
    ErrorCard
  },

  data() {
    return {
      errorMessage: null,
    };
  },

  methods: {
    async handleLogin(email, password) {
      // Handle login logic
      try {
        await this.$store.dispatch("login", {
          email: email,
          password: password,
        });
        console.log("Login:", email, password);
        this.errorMessage = null;
        this.$router.push({ name: 'Dashboard' });
      } catch (error) {
        this.errorMessage = "Invalid login details. Please try again.";
        console.error("Login failed:", error);
      }
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #121212;
  color: #ffffff;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 1rem;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #333333;
  border-radius: 5px;
  background-color: #1e1e1e;
  color: #ffffff;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #6200ea;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3700b3;
}
</style>
