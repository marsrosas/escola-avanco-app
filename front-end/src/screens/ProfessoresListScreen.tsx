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
import { getProfessores, deleteProfessor, updateProfessor, createProfessor } from '../services/adminService';

const { width, height } = Dimensions.get('window');

type ProfessoresListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfessoresList'>;

interface Professor {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfessoresListScreen() {
  const navigation = useNavigation<ProfessoresListScreenNavigationProp>();
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para modais
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [professorToDelete, setProfessorToDelete] = useState<string | null>(null);
  
  // Estados para formulários
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const loadProfessores = async (page = 1) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        navigation.navigate('Login');
        return;
      }

      const data = await getProfessores(token, page, 10);
      setProfessores(data.professores);
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
    loadProfessores();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfessores(1);
  };

  const handleDelete = (professor: Professor) => {
    setProfessorToDelete(professor._id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (professorToDelete) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        await deleteProfessor(token, professorToDelete);
        setProfessores(professores.filter(p => p._id !== professorToDelete));
        setDeleteModalVisible(false);
        setProfessorToDelete(null);
        Alert.alert('Sucesso', 'Professor excluído com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message);
      }
    }
  };

  const handleEdit = (professor: Professor) => {
    setSelectedProfessor(professor);
    setFormUsername(professor.username);
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

      const newProfessor = await createProfessor(token, { username: formUsername, password: formPassword });
      setProfessores([...professores, newProfessor]);
      setCreateModalVisible(false);
      Alert.alert('Sucesso', 'Professor criado com sucesso!');
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

    if (selectedProfessor) {
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

        await updateProfessor(token, selectedProfessor._id, updateData);
        
        // Atualizar a lista local
        setProfessores(professores.map(professor => 
          professor._id === selectedProfessor._id 
            ? { ...professor, username: formUsername }
            : professor
        ));
        
        setEditModalVisible(false);
        Alert.alert('Sucesso', 'Professor atualizado com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message);
      } finally {
        setFormLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderProfessor = ({ item }: { item: Professor }) => (
    <View style={styles.professorCard}>
      <View style={styles.professorInfo}>
        <Text style={styles.professorName}>{item.username}</Text>
        <Text style={styles.professorDate}>
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
          onPress={() => currentPage > 1 && loadProfessores(currentPage - 1)}
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
          onPress={() => currentPage < totalPages && loadProfessores(currentPage + 1)}
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
        <Text style={styles.loadingText}>Carregando professores...</Text>
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
          Gerenciar <Text style={{ color: '#222' }}>Professores</Text>
        </Text>
        
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>+ Novo Professor</Text>
        </TouchableOpacity>

        <View style={styles.listContainer}>
          {professores.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum professor encontrado</Text>
          ) : (
            <FlatList
              data={professores}
              renderItem={renderProfessor}
              keyExtractor={(item) => item._id}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {renderPagination()}
      </View>

      {/* Modal de Criar Professor */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Professor</Text>
            
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

      {/* Modal de Editar Professor */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Professor</Text>
            
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
              Tem certeza que deseja excluir este professor?
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
  professorCard: {
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
  professorInfo: {
    flex: 1,
  },
  professorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  professorDate: {
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
