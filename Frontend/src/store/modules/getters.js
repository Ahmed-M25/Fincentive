export default {
  token(state) {
    return state.token;
  },
  userId(state) {
    return state.userId;
  },
  isLoggedIn(state) {
    return !!state.token;
  }
};
