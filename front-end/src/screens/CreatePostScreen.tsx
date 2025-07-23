import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPost } from '../services/postService';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1,
        backgroundColor: '#6d184e',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20
      }}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo-avanco.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>
          Nova <Text style={{ color: '#222' }}>Aula</Text>
        </Text>
        
        <Text style={styles.subtitle}>
          Crie uma nova aula para compartilhar conhecimento
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título da Aula</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o título da aula"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Matéria / Disciplina</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Matemática, História, Português..."
              placeholderTextColor="#999"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o conteúdo da aula, objetivos e tópicos que serão abordados..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Criar Aula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7eaea',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: height * 0.7
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d184e',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22
  },
  formContainer: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6d184e',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

