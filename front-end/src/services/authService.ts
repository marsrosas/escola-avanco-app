import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // Funciona para todos
});

export async function login(username: string, password: string) {
  try {
    const response = await api.post('/login', { username, password }); // <-- Corrigido aqui
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
  }
}
