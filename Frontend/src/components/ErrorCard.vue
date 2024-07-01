<template>
    <div class="error-card">
      <div class="error-card-content">
        <p>{{ message }}</p>
        <button @click="$emit('close')">Close</button>
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
  
  <style scoped>
  .error-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  color: #000;
  padding: 40px; /* Increased padding */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px; /* Increased width */
  max-width: 80%; /* Ensure it doesn't overflow on small screens */
}

.error-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

p {
  font-size: 1.5rem; /* Increased font size */
  text-align: center;
}

button {
  margin-top: 20px; /* Increased margin-top */
  padding: 15px 30px; /* Increased padding */
  font-size: 1.2rem; /* Increased font size */
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
  