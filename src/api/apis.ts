import { authClient, publicClient } from './clients';

class apis {
  static loginUser = (username: string, password: string) => {
    return publicClient.post<{
      access_token: string;
      refresh_token: string;
    }>('/login', { username, password });
  };

  static refreshToken = (refreshToken: string) => {
    return publicClient.post<{
      access_token: string;
    }>('/refresh', { refresh_token: refreshToken });
  };

  static getUserProfile = () => {
    return authClient.get<{ name: string }>('/user/profile');
  };
}

export default apis;
