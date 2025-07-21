import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/authService';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const data = await login(email, password);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('role', data.user.role);
      await AsyncStorage.setItem('username', data.user.username);

      if (data.user.role === 'professor') {
        navigation.replace('ProfessorHome');
      } else if (data.user.role === 'aluno') {
        navigation.replace('StudentHome');
      } else {
        navigation.replace('Home');
      }
    } catch (err: any) {
      Alert.alert('Erro de login', err.message || 'Falha ao entrar');
    }
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#6d184e',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <View style={{
        backgroundColor: '#f7eaea',
        borderRadius: 16,
        padding: 28,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 4
      }}>
        <Image
          source={require('../../assets/logo-avanco.png')}
          style={{ width: 64, height: 64, marginBottom: 12 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6d184e', marginBottom: 2 }}>
          Escola <Text style={{ color: '#222' }}>Avanço</Text>
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>Login</Text>
        <Text style={{ color: '#444', marginBottom: 18, textAlign: 'center' }}>
          Entre com sua conta para conferir o blog da Escola!
        </Text>
        <View style={{ width: '100%', marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Nome de usuário</Text>
          <TextInput
            placeholder="Digite seu usuário"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 6,
              padding: 10,
              backgroundColor: '#fff',
              marginBottom: 12
            }}
          />
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 6,
              padding: 10,
              backgroundColor: '#fff',
              marginBottom: 18
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#6d184e',
            borderRadius: 6,
            paddingVertical: 12,
            width: '100%',
            alignItems: 'center'
          }}
          onPress={handleLogin}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

