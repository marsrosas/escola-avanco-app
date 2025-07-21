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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator'; // ajuste o caminho se necessário
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPosts, deletePost } from '../services/postService';

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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('username');
    navigation.navigate('Login' as never);
  }

  function handleEdit(post: Post) {
    navigation.navigate('EditPost', { post });
  }

  async function handleDelete(postId: number) {
    Alert.alert(
      'Excluir Aula',
      'Tem certeza que deseja excluir esta aula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId); // Implemente no seu postService
              setPosts(posts.filter(p => p.id !== postId));
              Alert.alert('Aula excluída com sucesso!');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao excluir aula');
            }
          }
        }
      ]
    );
  }

  useEffect(() => {
    async function fetchData() {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login' as never);
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

  // Filtro seguro para busca
  const filteredPosts = posts.filter(
    (item) =>
      (item.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (item.subject?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (item.author?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Aulas</Text>

      <TextInput
        placeholder="Buscar por título, matéria ou autor"
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 6,
          padding: 8,
          marginBottom: 16,
        }}
      />

      {role === 'professor' && (
        <Button title="Criar Nova Aula" onPress={() => navigation.navigate('CreatePost')} />
      )}
      <View style={{ marginVertical: 8 }} />
      <Button title="Sair" onPress={handleLogout} />

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma aula encontrada.</Text>}
        renderItem={({ item }: { item: Post }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ color: '#666' }}>{item.subject} • {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={{ fontStyle: 'italic', color: '#888' }}>Autor: {item.author}</Text>
            <TouchableOpacity
              style={{
                marginTop: 8,
                backgroundColor: '#2196F3',
                padding: 8,
                borderRadius: 4,
                alignSelf: 'flex-start'
              }}
              onPress={() => {
                setSelectedPost(item);
                setModalVisible(true);
              }}
            >
              <Text style={{ color: '#fff' }}>Detalhes</Text>
            </TouchableOpacity>
            {role === 'professor' && item.author === username && (
              <>
                <Button title="Editar" onPress={() => handleEdit(item)} />
                <Button title="Excluir" onPress={() => handleDelete(item.id)} />
              </>
            )}
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 8,
            width: '85%'
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedPost?.title}</Text>
            <Text style={{ color: '#666', marginBottom: 8 }}>{selectedPost?.subject} • {selectedPost && new Date(selectedPost.createdAt).toLocaleDateString()}</Text>
            <Text style={{ fontStyle: 'italic', color: '#888', marginBottom: 8 }}>Autor: {selectedPost?.author}</Text>
            <Text style={{ marginBottom: 16 }}>{selectedPost?.description}</Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}



