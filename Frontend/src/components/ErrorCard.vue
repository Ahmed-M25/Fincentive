<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
      <div class="flex flex-col items-center">
        <p class="text-lg text-red-400">{{ message }}</p>
        <button @click="$emit('close')" class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
};
</script>