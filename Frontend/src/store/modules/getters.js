export default {
    userId(state) {
        return state.userId;
    },

    isLoggenIn(state) {
        return !!state.token;
    }
};