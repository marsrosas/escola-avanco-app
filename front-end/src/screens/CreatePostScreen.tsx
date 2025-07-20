import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPost } from '../services/postService';
import { useNavigation } from '@react-navigation/native';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title || !description || !subject) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado');
        navigation.navigate('Login' as never);
        return;
      }

      const novoPost = { title, description, subject };
      await createPost(novoPost, token);

      Alert.alert('Sucesso', 'Postagem criada com sucesso!');
      navigation.navigate('Home' as never);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar postagem');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título da Aula</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o título da aula"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição da aula"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Matéria / Disciplina</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a matéria"
        value={subject}
        onChangeText={setSubject}
      />

      <Button title="Criar Postagem" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 8,
    padding: 10,
    borderRadius: 6,
  },
});

