<template>
  <div class="auth-form">
    <form @submit.prevent="handleSubmit">
      <div>
        <label class="block text-gray-400 text-sm font-bold mb-2" for="email"
          >Email</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          id="email"
          v-model="email"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-400 text-sm font-bold mb-2" for="password"
          >Password</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" class="text-white text-decoration-line: underline">
          Signup
        </button>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus: shadow-outline"
        >
          {{ buttonText }}
        </button>
      </div>
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

