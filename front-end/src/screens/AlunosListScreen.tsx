import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAlunos, deleteAluno, updateAluno, createAluno } from '../services/adminService';

const { width, height } = Dimensions.get('window');

type AlunosListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AlunosList'>;

interface Aluno {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AlunosListScreen() {
  const navigation = useNavigation<AlunosListScreenNavigationProp>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para modais
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [alunoToDelete, setAlunoToDelete] = useState<string | null>(null);
  
  // Estados para formulários
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const loadAlunos = async (page = 1) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        navigation.navigate('Login');
        return;
      }

      const data = await getAlunos(token, page, 10);
      setAlunos(data.alunos);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlunos();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAlunos(1);
  };

  const handleDelete = (aluno: Aluno) => {
    setAlunoToDelete(aluno._id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (alunoToDelete) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        await deleteAluno(token, alunoToDelete);
        setAlunos(alunos.filter(a => a._id !== alunoToDelete));
        setDeleteModalVisible(false);
        setAlunoToDelete(null);
        Alert.alert('Sucesso', 'Aluno excluído com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message);
      }
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setFormUsername(aluno.username);
    setFormPassword('');
    setFormConfirmPassword('');
    setEditModalVisible(true);
  };

  const handleCreate = () => {
    setFormUsername('');
    setFormPassword('');
    setFormConfirmPassword('');
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = async () => {
    if (!formUsername || !formPassword || !formConfirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (formPassword !== formConfirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (formPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setFormLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        return;
      }

      const newAluno = await createAluno(token, { username: formUsername, password: formPassword });
      
      // Garantir que o objeto tem as propriedades necessárias com valores válidos
      const alunoFormatted = {
        _id: newAluno._id || newAluno.id || Math.random().toString(),
        username: newAluno.username || formUsername,
        role: newAluno.role || 'student',
        createdAt: newAluno.createdAt || new Date().toISOString(),
        updatedAt: newAluno.updatedAt || new Date().toISOString(),
      };
      
      setAlunos([...alunos, alunoFormatted]);
      setCreateModalVisible(false);
      Alert.alert('Sucesso', 'Aluno criado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!formUsername) {
      Alert.alert('Erro', 'O nome de usuário é obrigatório');
      return;
    }

    if (formPassword && formPassword !== formConfirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (formPassword && formPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (selectedAluno) {
      setFormLoading(true);

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado');
          return;
        }

        const updateData: { username: string; password?: string } = { username: formUsername };
        if (formPassword) {
          updateData.password = formPassword;
        }

        await updateAluno(token, selectedAluno._id, updateData);
        
        // Atualizar a lista local
        setAlunos(alunos.map(aluno => 
          aluno._id === selectedAluno._id 
            ? { ...aluno, username: formUsername }
            : aluno
        ));
        
        setEditModalVisible(false);
        Alert.alert('Sucesso', 'Aluno atualizado com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message);
      } finally {
        setFormLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Data não disponível';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const renderAluno = ({ item }: { item: Aluno }) => (
    <View style={styles.alunoCard}>
      <View style={styles.alunoInfo}>
        <Text style={styles.alunoName}>{item.username}</Text>
        <Text style={styles.alunoDate}>
          Criado em: {formatDate(item.createdAt)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={() => currentPage > 1 && loadAlunos(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}>
            Anterior
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.pageInfo}>
          {currentPage} de {totalPages}
        </Text>
        
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
          onPress={() => currentPage < totalPages && loadAlunos(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButtonText, currentPage === totalPages && styles.pageButtonTextDisabled]}>
            Próxima
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6d184e" />
        <Text style={styles.loadingText}>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo-avanco.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>
          Gerenciar <Text style={{ color: '#222' }}>Alunos</Text>
        </Text>
        
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>+ Novo Aluno</Text>
        </TouchableOpacity>

        <View style={styles.listContainer}>
          {alunos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum aluno encontrado</Text>
          ) : (
            <FlatList
              data={alunos}
              renderItem={renderAluno}
              keyExtractor={(item) => item._id}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {renderPagination()}
      </View>

      {/* Modal de Criar Aluno */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Aluno</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nome de usuário"
              value={formUsername}
              onChangeText={setFormUsername}
              autoCapitalize="words"
              editable={!formLoading}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Senha (mín. 6 caracteres)"
              value={formPassword}
              onChangeText={setFormPassword}
              secureTextEntry
              editable={!formLoading}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Confirmar senha"
              value={formConfirmPassword}
              onChangeText={setFormConfirmPassword}
              secureTextEntry
              editable={!formLoading}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setCreateModalVisible(false)}
                disabled={formLoading}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSubmitButton} 
                onPress={handleCreateSubmit}
                disabled={formLoading}
              >
                <Text style={styles.modalSubmitButtonText}>
                  {formLoading ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Editar Aluno */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Aluno</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nome de usuário"
              value={formUsername}
              onChangeText={setFormUsername}
              autoCapitalize="words"
              editable={!formLoading}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nova senha (deixe vazio para manter)"
              value={formPassword}
              onChangeText={setFormPassword}
              secureTextEntry
              editable={!formLoading}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Confirmar nova senha"
              value={formConfirmPassword}
              onChangeText={setFormConfirmPassword}
              secureTextEntry
              editable={!formLoading}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setEditModalVisible(false)}
                disabled={formLoading}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSubmitButton} 
                onPress={handleEditSubmit}
                disabled={formLoading}
              >
                <Text style={styles.modalSubmitButtonText}>
                  {formLoading ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmar Exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalText}>
              Tem certeza que deseja excluir este aluno?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalDeleteButton} 
                onPress={confirmDelete}
              >
                <Text style={styles.modalDeleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d184e',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    minHeight: height,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f7eaea',
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#f7eaea',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  createButtonText: {
    color: '#6d184e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    backgroundColor: '#f7eaea',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    minHeight: 300,
  },
  alunoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  alunoInfo: {
    flex: 1,
  },
  alunoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  alunoDate: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#6d184e',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  pageButton: {
    backgroundColor: '#f7eaea',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: '#6d184e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pageButtonTextDisabled: {
    color: '#999',
  },
  pageInfo: {
    color: '#f7eaea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6d184e',
  },
  loadingText: {
    color: '#f7eaea',
    fontSize: 16,
    marginTop: 16,
  },
  // Estilos dos modais
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f7eaea',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6d184e',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#6d184e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalDeleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
