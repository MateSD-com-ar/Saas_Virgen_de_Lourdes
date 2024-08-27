import axios from "axios";

export const authLogin = async (username, password) => {
  try {
    const response = await axios.post(`https://minimarket-virgen-lourdes-backend.onrender.com/api/auth/login`, {
      username,
      password,
    });
    return response.data; // Return the response data instead of the entire response object
  } catch (error) {
    throw new Error("Failed to authenticate: " + error.message); // Throw an error for any failures
  }
};
