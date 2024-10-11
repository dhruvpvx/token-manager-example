import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  DeviceEventEmitter,
} from 'react-native';
import apis from './src/api/apis';
import TokenManager from './src/utils/token-manager';

interface User {
  name: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('logout', () => {
      setUser(null);
    });
    return () => subscription.remove();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await apis.loginUser(username, password);
      await TokenManager.saveTokens(data);
      const user = await apis.getUserProfile();
      setUser(user.data);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await TokenManager.logout();
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
