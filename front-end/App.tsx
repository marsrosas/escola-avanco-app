import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator, { RootStackParamList } from './src/navigation/AppNavigator';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Login');

  useEffect(() => {
    async function checkAuth() {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');
      if (token && role === 'professor') {
        setInitialRoute('ProfessorHome');
      } else if (token && role === 'aluno') {
        setInitialRoute('StudentHome');
      } else {
        setInitialRoute('Login');
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return <AppNavigator initialRoute={initialRoute} />;
}



