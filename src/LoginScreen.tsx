import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Navigate forward on the stack and pass the JWT along as route parameters
        navigation.replace('Dashboard', { token: data.token });
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Cannot reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moneris Terminal</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Terminal PIN"
        placeholderTextColor="#a0aec0"
        secureTextEntry
        keyboardType="numeric"
        value={pin}
        onChangeText={setPin}
        maxLength={4}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Authorize</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#1a365d' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 16, fontSize: 18, textAlign: 'center', marginBottom: 16, color: '#2d3748' },
  error: { color: '#fc8181', textAlign: 'center', marginBottom: 16, fontWeight: 'bold' },
  button: { backgroundColor: '#3182ce', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});