import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
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

  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Aulas</Text>

      <Button title="Criar Nova Aula" onPress={() => navigation.navigate('CreatePost' as never)} />
      <View style={{ marginVertical: 8 }} />
      <Button title="Sair" onPress={handleLogout} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Post }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ color: '#666' }}>{item.subject} • {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text>{item.description}</Text>
            <Text style={{ fontStyle: 'italic', color: '#888' }}>Autor: {item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}



