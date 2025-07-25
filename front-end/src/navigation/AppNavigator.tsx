import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import TeacherHomeScreen from '../screens/TeacherHomeScreen';
import StudentHomeScreen from '../screens/StudentHomeScreen';
import ProfessoresListScreen from '../screens/ProfessoresListScreen';
import CreateProfessorScreen from '../screens/CreateProfessorScreen';
import EditProfessorScreen from '../screens/EditProfessorScreen';
import AlunosListScreen from '../screens/AlunosListScreen';
import CreateAlunoScreen from '../screens/CreateAlunoScreen';
import EditAlunoScreen from '../screens/EditAlunoScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CreatePost: undefined;
  EditPost: { post: Post };
  ProfessorHome: undefined;
  StudentHome: undefined;
  ProfessoresList: undefined;
  CreateProfessor: undefined;
  EditProfessor: { professor: Professor };
  AlunosList: undefined;
  CreateAluno: undefined;
  EditAluno: { aluno: Aluno };
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

type Professor = {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type Aluno = {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Escola Avanço' }} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Criar Aula' }} />
        <Stack.Screen name="ProfessorHome" component={TeacherHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentHome" component={StudentHomeScreen} options={{ headerShown: false }} />
        
        {/* Telas Administrativas - Professores */}
        <Stack.Screen 
          name="ProfessoresList" 
          component={ProfessoresListScreen} 
          options={{ title: 'Professores' }} 
        />
        <Stack.Screen 
          name="CreateProfessor" 
          component={CreateProfessorScreen} 
          options={{ title: 'Novo Professor' }} 
        />
        <Stack.Screen 
          name="EditProfessor" 
          component={EditProfessorScreen} 
          options={{ title: 'Editar Professor' }} 
        />
        
        {/* Telas Administrativas - Alunos */}
        <Stack.Screen 
          name="AlunosList" 
          component={AlunosListScreen} 
          options={{ title: 'Alunos' }} 
        />
        <Stack.Screen 
          name="CreateAluno" 
          component={CreateAlunoScreen} 
          options={{ title: 'Novo Aluno' }} 
        />
        <Stack.Screen 
          name="EditAluno" 
          component={EditAlunoScreen} 
          options={{ title: 'Editar Aluno' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
