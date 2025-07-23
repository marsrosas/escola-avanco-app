import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPosts, deletePost, updatePost } from '../services/postService';

interface Post {
  id: number;
  title: string;
  description: string;
  subject: string;
  author: string;
  createdAt: string;
}

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  
  // Estados para edição
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSubject, setEditSubject] = useState('');

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('username');
    navigation.navigate('Login');
  }

  function handleEdit(post: Post) {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setEditSubject(post.subject);
    setEditModalVisible(true);
  }

  function handleDelete(postId: number) {
    setPostToDelete(postId);
    setDeleteModalVisible(true);
  }

  async function confirmDelete() {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setPosts(posts.filter(p => p.id !== postToDelete));
        setDeleteModalVisible(false);
        setPostToDelete(null);
        Alert.alert('Sucesso', 'Aula excluída com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro ao excluir aula');
      }
    }
  }

  async function handleUpdatePost() {
    if (!editTitle || !editDescription || !editSubject) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (selectedPost) {
      try {
        const updatedPost = {
          title: editTitle,
          description: editDescription,
          subject: editSubject
        };
        
        await updatePost(selectedPost.id, updatedPost);
        
        // Atualizar a lista local
        setPosts(posts.map(post => 
          post.id === selectedPost.id 
            ? { ...post, ...updatedPost }
            : post
        ));
        
        setEditModalVisible(false);
        Alert.alert('Sucesso', 'Aula atualizada com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro ao atualizar aula');
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro ao buscar postagens');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('role').then(r => setRole(r || ''));
    AsyncStorage.getItem('username').then(u => setUsername(u || ''));
  }, []);

  const filteredPosts = posts.filter(
    (item) =>
      (item.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (item.subject?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (item.author?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todas as Aulas</Text>

      <TextInput
        placeholder="Buscar por título, matéria ou autor"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {role === 'professor' && (
        <TouchableOpacity style={styles.postButton} onPress={() => navigation.navigate('CreatePost')}>
          <Text style={styles.postButtonText}>+ Postar Aula</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma aula encontrada.</Text>}
        renderItem={({ item }: { item: Post }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubject}>{item.subject} • {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.cardAuthor}>Autor: {item.author}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#1E40AF' }]}
                onPress={() => {
                  setSelectedPost(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.actionButtonText}>Detalhes</Text>
              </TouchableOpacity>
              {role === 'professor' && item.author === username && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#22C55E' }]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.actionButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      />

      {/* Modal de Edição */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.modalTitle}>Editar Aula</Text>
            
            <Text style={styles.inputLabel}>Título da Aula</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite o título da aula"
              value={editTitle}
              onChangeText={setEditTitle}
            />
            
            <Text style={styles.inputLabel}>Matéria</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite a matéria"
              value={editSubject}
              onChangeText={setEditSubject}
            />
            
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Digite a descrição da aula"
              value={editDescription}
              onChangeText={setEditDescription}
              multiline={true}
              numberOfLines={4}
            />
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={handleUpdatePost}
              >
                <Text style={styles.modalSaveButtonText}>SALVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.modalTitle}>Excluir Aula</Text>
            <Text style={styles.deleteModalText}>
              Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.
            </Text>
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.modalDeleteButtonText}>EXCLUIR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedPost?.title}</Text>
            <Text style={styles.modalSubject}>{selectedPost?.subject} • {selectedPost && new Date(selectedPost.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.modalAuthor}>Autor: {selectedPost?.author}</Text>
            <Text style={styles.modalDescription}>{selectedPost?.description}</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d184e',
    padding: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 18,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a1a1aa',
  },
  postButton: {
    backgroundColor: '#312e81',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#a1a1aa',
    alignSelf: 'flex-end',
    width: 80,
  },
  logoutButtonText: {
    color: '#b91c1c',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6d184e',
    marginBottom: 4,
  },
  cardSubject: {
    color: '#6d184e',
    marginBottom: 4,
    fontWeight: '600',
  },
  cardAuthor: {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(109, 24, 78, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#f7eaea',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d184e',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubject: {
    color: '#6d184e',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  modalAuthor: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 24,
    textAlign: 'justify',
  },
  modalCloseButton: {
    backgroundColor: '#6d184e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  
  // Estilos para Modal de Edição
  editModalContent: {
    backgroundColor: '#f7eaea',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6d184e',
    marginBottom: 8,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6d184e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#6d184e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#6d184e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Estilos para Modal de Exclusão
  deleteModalContent: {
    backgroundColor: '#f7eaea',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalDeleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});



