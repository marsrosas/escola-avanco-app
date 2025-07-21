import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StudentHomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Bem-vindo, Aluno!</Text>
      <Button title="Ver Aulas" onPress={() => navigation.navigate('Home' as never)} />
      </View>
    );
  }