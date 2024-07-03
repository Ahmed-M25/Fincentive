<template>
  <div class="login">
    <div class="flex items-center justify-center min-h-screen bg-gray-900">
      <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-100">Login</h2>
        <auth-form v-if="!isLoading" title="Login" buttonText="Login" :onSubmit="handleLogin" />
        <LoadingSpinner v-else></LoadingSpinner>
        <error-card
          v-if="errorMessage"
          :message="errorMessage"
          @close="errorMessage = null"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AuthForm from "../components/AuthForm.vue";
import ErrorCard from "../components/ErrorCard.vue";
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: "Login",
  components: {
    AuthForm,
    ErrorCard,
    LoadingSpinner
  },

  data() {
    return {
      errorMessage: null,
      isLoading: false
    };
  },

  methods: {
    async handleLogin(email, password) {
      // Handle login logic
      this.isLoading = true;
      try {
        await this.$store.dispatch("auth/login", {
          email: email,
          password: password,
        });
        this.errorMessage = null;
        this.$router.push('/dashboard');
      } catch (error) {
        this.errorMessage = "Invalid login details. Please try again.";
        console.error("Login failed:", error);
      } finally {
          this.isLoading = false;
      }
    },
  },
};
</script>