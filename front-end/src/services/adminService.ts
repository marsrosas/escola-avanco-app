import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/admin';

// ==================== PROFESSORES ====================

export const getProfessores = async (token: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar professores');
  }
};

export const getProfessor = async (token: string, id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professores/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar professor');
  }
};

export const createProfessor = async (token: string, professorData: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/professores`, professorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar professor');
  }
};

export const updateProfessor = async (token: string, id: string, professorData: { username: string; password?: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/professores/${id}`, professorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar professor');
  }
};

export const deleteProfessor = async (token: string, id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/professores/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir professor');
  }
};

// ==================== ALUNOS ====================

export const getAlunos = async (token: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alunos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar alunos');
  }
};

export const getAluno = async (token: string, id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alunos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar aluno');
  }
};

export const createAluno = async (token: string, alunoData: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/alunos`, alunoData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar aluno');
  }
};

export const updateAluno = async (token: string, id: string, alunoData: { username: string; password?: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/alunos/${id}`, alunoData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar aluno');
  }
};

export const deleteAluno = async (token: string, id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/alunos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir aluno');
  }
};
