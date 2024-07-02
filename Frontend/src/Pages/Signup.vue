<template>
  <div class="signup">
    <div class="flex items-center justify-center min-h-screen bg-gray-900">
      <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-100">
          Sign Up
        </h2>
        <auth-form v-if="!isLoading"
          title="Sign Up"
          buttonText="Sign Up"
          :onSubmit="handleSignup"
        />
        <LoadingSpinner v-else></LoadingSpinner>
      </div>
    </div>
  </div>
</template>

<script>
import AuthForm from "../components/AuthForm.vue";
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: "Signup",
  components: {
    AuthForm,
    LoadingSpinner
  },
  data() {
    return {
      isLoading: false
    };
  },

  methods: {
    async handleSignup(email, password) {
      // Handle Signup logic
      this.isLoading = true;
      try{
        await this.$store.dispatch("signup", {
          email: email,
          password: password,
        });
        console.log("Signup:", email, password);
        this.$router.push({ name: 'Login' });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<!-- <style scoped>
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
</style> -->
