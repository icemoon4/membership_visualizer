import axios from "axios";

export const validateToken = async (token) => {
  try {
    const response = await axios.get(
      "/api/validate-token/",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response);
    return true;
  } catch (error) {
    console.error("Invalid token:", error.response?.data || error.message);
    return false;
  }
};
