import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.25.61.227:3000/api';

export async function getPosts() {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createPost(post: any, token: string) {
  const response = await axios.post(`${API_URL}/posts`, post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}









