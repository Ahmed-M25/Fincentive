export default {
  async login(context, payload) {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(responseData.message || "Failed to Authenticate. Check your login details");
      throw error;
    }

    console.log(responseData);
    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn,
    });
  },

  async signup(context, payload) {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(responseData.message || "Failed to Authenticate");
      throw error;
    }

    const backendResponse = await fetch('http://localhost:3000/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseId: responseData.localId,
        email: payload.email,
      }),
    });

    if (!backendResponse.ok) {
      const error = new Error('Failed to create user in the database.');
      throw error;
    }


    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn,
    });
  },

  logout(context) {
    context.commit("setUser", {
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  }
};
