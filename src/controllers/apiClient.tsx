import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ QUAN TRỌNG: Thay đổi IP này
// - Nếu chạy máy ảo Android (Android Studio): dùng 'http://10.0.2.2:3000/api'
// - Nếu chạy iOS Simulator: dùng 'http://localhost:3000/api'
// - Nếu chạy trên điện thoại thật (Expo Go): dùng IP mạng LAN của máy tính (VD: 'http://192.168.1.15:3000/api')
const BASE_URL = 'http://10.0.2.2:3000/api';

const getHeaders = async (isFormData = false) => {
  const token = await AsyncStorage.getItem('@SportMaster:token');
  const headers: any = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  const json = await res.json();
  if (!res.ok) {
    // Ném lỗi với message tiếng Nga từ Backend (VD: 'Неверный email или пароль')
    throw new Error(json.message || json.errors?.[0] || 'Произошла ошибка на сервере');
  }
  return json;
};

export const apiClient = {
  get: async (endpoint: string) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'GET', headers });
    return handleResponse(res);
  },

  post: async (endpoint: string, body: any) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (endpoint: string, body: any) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  delete: async (endpoint: string) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE', headers });
    return handleResponse(res);
  },
};