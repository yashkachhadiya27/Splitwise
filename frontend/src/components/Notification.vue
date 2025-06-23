<template>
  <div v-if="notification" :class="['notification', notification.type]">
    <p>{{ notification.message }}</p>
    <button @click="closeNotification">&times;</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notification: null,
    };
  },
  methods: {
    showNotification(message, type = 'info') {
      this.notification = { message, type };
      setTimeout(() => {
        this.closeNotification();
      }, 5000); // Automatically close after 5 seconds
    },
    closeNotification() {
      this.notification = null;
    },
  },
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

.success {
  background-color: #4caf50;
  color: #fff;
}

.error {
  background-color: #f44336;
  color: #fff;
}

.info {
  background-color: #2196f3;
  color: #fff;
}

.notification p {
  margin: 0;
}

.notification button {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
