import axios from 'axios';
import TokenManager from '../utils/token-manager';

export const publicClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const authClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

authClient.interceptors.request.use(async (config) => {
  const accessToken = await TokenManager.getAccessToken();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

authClient.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401) {
    try {
      const token = await TokenManager.generateAccessToken();
      if (token) {
        error.config.headers.set('Authorization', `Bearer ${token}`);
        return axios(error.config);
      } else {
        await TokenManager.logout();
        return Promise.reject(error);
      }
    } catch (error) {
      await TokenManager.logout();
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});
