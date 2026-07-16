import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getToken } from './src/storage';
import { RootStackParamList } from './types';
import LoginScreen from './src/LoginScreen';
import DashboardScreen from './src/DashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Dashboard' | null>(null);
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Attempt to read the token from storage
        const token = await getToken('user_session_token');
        
        if (token) {
          setAuthToken(token);
          setInitialRoute('Dashboard');
        } else {
          setInitialRoute('Login');
        }
      } catch (e) {
        // Fallback safely to Login if reading from storage fails
        setInitialRoute('Login');
      }
    };

    checkSession();
  }, []);

  // Show a clean loading spinner while checking hardware keys on boot
  if (initialRoute === null) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#1a365d" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          initialParams={{ token: authToken }} // Pass down the found session token automatically
          options={{ 
            title: 'Terminal Dashboard',
            headerStyle: { backgroundColor: '#1a365d' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackVisible: false 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafc' }
});