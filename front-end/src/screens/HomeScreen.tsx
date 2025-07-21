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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPosts } from '../services/postService';

interface Post {
  id: number;
  title: string;
  description: string;
  subject: string;
  author: string;
  createdAt: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [search, setSearch] = useState('');

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login' as never);
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

  // Filtra os posts conforme o texto digitado
  const filteredPosts = posts.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase())
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

      <Button title="Criar Nova Aula" onPress={() => navigation.navigate('CreatePost' as never)} />
      <View style={{ marginVertical: 8 }} />
      <Button title="Sair" onPress={handleLogout} />

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
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



