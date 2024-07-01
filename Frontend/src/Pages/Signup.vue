<template>
  <auth-form title="Sign Up" buttonText="Sign Up" :onSubmit="handleSignup" />
</template>

<script>
import AuthForm from "../components/AuthForm.vue";

export default {
  name: "Signup",
  components: {
    AuthForm,
  },
  methods: {
    async handleSignup(email, password) {
      // Handle login logic
      await this.$store.dispatch("signup", { 
        email: email,
        password: password,
      });
      console.log("Signup:", email, password);
      this.$router.push({ name: 'Login' });
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
