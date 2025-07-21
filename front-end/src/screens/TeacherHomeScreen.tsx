import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TeacherHomeScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('username').then(name => {
      if (name) setUsername(name);
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
        Boas-vindas, {username ? ` ${username}` : ''}!
      </Text>
      <Button title="Ver Aulas" onPress={() => navigation.navigate('Home' as never)} />
      <Button title="Criar Nova Aula" onPress={() => navigation.navigate('CreatePost' as never)} />
    </View>
  );
}