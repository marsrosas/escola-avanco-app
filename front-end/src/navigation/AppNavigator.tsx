import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CreatePost: undefined;
  EditPost: { post: Post }; // <-- Adicione esta linha
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type Post = {
  id: number;
  title: string;
  description: string;
  subject: string;
  author: string;
  createdAt: string;
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Escola Avanço' }} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Criar Aula' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
