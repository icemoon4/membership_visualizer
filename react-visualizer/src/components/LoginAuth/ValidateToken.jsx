import axios from "axios";

export const validateToken = async (accessToken, setAccessToken) => {
  try {
    const response = await axios.get("/api/validate-token/", {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
      withCredentials: true, //to get the refresh token cookie
    });
    //console.log(response);
    return true;
  } catch (error) {
    //console.error("Invalid token:", error.response?.data || error.message);
    if (error.response?.status === 401 && setAccessToken) {
      try {
        const refreshResponse = await axios.post("api/validate-refresh-token/", {}, {
          withCredentials: true, //to check the contents of our refresh token cookie
        });

        setAccessToken(refreshResponse.data.access);
        return true;
      } 
      catch (refreshError){
        return false;
      }
    }
  }
};
