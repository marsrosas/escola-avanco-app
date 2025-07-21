import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import TeacherHomeScreen from './src/screens/TeacherHomeScreen';
import StudentHomeScreen from './src/screens/StudentHomeScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Postagens' }} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Nova Postagem' }} />
        <Stack.Screen name="ProfessorHome" component={TeacherHomeScreen} options={{ title: 'Professor' }} />
        <Stack.Screen name="StudentHome" component={StudentHomeScreen} options={{ title: 'Aluno' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



