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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAlunos, deleteAluno } from '../services/adminService';

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

  const handleDelete = async (aluno: Aluno) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o aluno "${aluno.username}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) return;

              await deleteAluno(token, aluno._id);
              Alert.alert('Sucesso', 'Aluno excluído com sucesso!');
              loadAlunos(currentPage);
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (aluno: Aluno) => {
    navigation.navigate('EditAluno', { aluno });
  };

  const handleCreate = () => {
    navigation.navigate('CreateAluno');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
});
