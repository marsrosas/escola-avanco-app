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
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateAluno } from '../services/adminService';

const { width, height } = Dimensions.get('window');

interface Aluno {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditAlunoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { aluno } = route.params as { aluno: Aluno };

  const [username, setUsername] = useState(aluno.username);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username) {
      Alert.alert('Erro', 'O nome de usuário é obrigatório');
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password && password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        navigation.navigate('Login' as never);
        return;
      }

      const updateData: { username: string; password?: string } = { username };
      if (password) {
        updateData.password = password;
      }

      await updateAluno(token, aluno._id, updateData);
      Alert.alert('Sucesso', 'Aluno atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
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
          Editar <Text style={{ color: '#222' }}>Aluno</Text>
        </Text>
        
        <Text style={styles.subtitle}>
          Atualize as informações do aluno
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome de usuário"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nova Senha (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite uma nova senha (deixe vazio para manter)"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {password ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Nova Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a nova senha novamente"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, loading && styles.buttonDisabled]} 
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Aluno criado em: {new Date(aluno.createdAt).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.infoText}>
            Última atualização: {new Date(aluno.updatedAt).toLocaleDateString('pt-BR')}
          </Text>
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
    minHeight: height * 0.6
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
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  infoContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
});
