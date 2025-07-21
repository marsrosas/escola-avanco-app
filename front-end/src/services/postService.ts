import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // ou o IP do seu backend
});

export async function getPosts() {
  const token = await AsyncStorage.getItem('token');
  const response = await api.get('/posts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createPost(post: any, token: string) {
  const response = await api.post('/posts', post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deletePost(postId: number) {
  const token = await AsyncStorage.getItem('token');
  await api.delete(`/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}









