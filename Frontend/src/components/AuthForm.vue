<template>
  <div class="auth-form">
    <h1>{{ title }}</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">{{ buttonText }}</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AuthForm",
  props: {
    title: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      // Handle login/Signup logic
      this.onSubmit(this.email, this.password);
    },
  },
};
</script>

<style scoped>
.auth-form {
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
