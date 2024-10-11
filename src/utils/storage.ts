import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage<T> {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  setItem = (value: T) => {
    return AsyncStorage.setItem(this.key, JSON.stringify(value));
  };

  getItem = async (): Promise<T | null> => {
    const value = await AsyncStorage.getItem(this.key);
    return value ? JSON.parse(value) : null;
  };

  removeItem = () => {
    return AsyncStorage.removeItem(this.key);
  };
}

export default Storage;
