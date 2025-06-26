import axios from 'redaxios';

export const validateToken = async (accessToken, refreshToken, setRefreshToken, setAccessToken) => {
  try {
    const response = await axios.get("/api/validate-token/", {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
      withCredentials: false, //to get the refresh token cookie
    });
    //console.log(response);
    return true;
  } catch (error) {
    //console.error("Invalid token:", error.response?.data || error.message);
    if (error.response?.status === 401 && setAccessToken) {
      try {
        const refreshResponse = await axios.post("api/validate-refresh-token/", {refresh: refreshToken}, {
          withCredentials: false, //to check the contents of our refresh token cookie
        });

        setRefreshToken(refreshResponse.data.access);
        return true;
      } 
      catch (refreshError){
        return false;
      }
    }
  }
};
