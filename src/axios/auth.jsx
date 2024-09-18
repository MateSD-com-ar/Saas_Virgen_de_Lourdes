import axios from "axios";
import { url } from "../utils/utils";

export const authLogin = async (username, password) => {
  try {
    const response = await axios.post(`${url}api/auth/login`, {
      username,
      password,
    });
    return response.data; // Return the response data instead of the entire response object
  } catch (error) {
    throw new Error("Failed to authenticate: " + error.message); // Throw an error for any failures
  }
};

export const authRegister = async (name, username, password) => {
  try {
    const response = await axios.post(`${url}api/auth/register`,
      { name, username, password },  // Pass parameters as an object
      { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
    return response.data; // Return the response data instead of the entire response object
  } catch (error) {
    throw new Error("Failed to register: " + error.message); // Throw an error for any failures
  }
};
