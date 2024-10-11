import { DeviceEventEmitter } from 'react-native';
import apis from '../api/apis';
import Storage from './storage';

class TokenManager {
  private static storage = new Storage<{
    access_token: string;
    refresh_token: string;
  }>('token');

  static async saveTokens(tokens: {
    access_token: string;
    refresh_token: string;
  }) {
    return this.storage.setItem(tokens);
  }

  static async generateAccessToken() {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      await this.logout();
      return null;
    }

    try {
      const { data } = await apis.refreshToken(refreshToken);
      await this.saveTokens({
        access_token: data.access_token,
        refresh_token: refreshToken,
      });
      return data.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      await this.logout();
      return null;
    }
  }

  static async logout() {
    await this.storage.removeItem();
    DeviceEventEmitter.emit('logout');
  }

  static async getAccessToken() {
    const tokens = await this.storage.getItem();
    return tokens?.access_token;
  }

  static async getRefreshToken() {
    const tokens = await this.storage.getItem();
    return tokens?.refresh_token;
  }
}

export default TokenManager;
