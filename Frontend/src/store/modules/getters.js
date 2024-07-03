export default {
    userId(state) {
      return state.userId;
    },
    isLoggedIn(state) {
      return !!state.token;
    },
  };
  