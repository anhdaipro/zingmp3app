import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetToLogin } from './resetLogin';
// import { resetToLogin } from '@navigation/RootNavigation';
export const baseURL = 'http://10.0.2.2:3000/api'
const axiosInstance = axios.create({
  baseURL: baseURL, // Đổi thành URL backend của bạn
});

// Hàm kiểm tra token hết hạn
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (token && isTokenExpired(token)) {
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const response = await axios.post('http://localhost:3000/api/refresh', { refreshToken });
          const { accessToken } = response.data;

          await AsyncStorage.setItem('token', accessToken);
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error('Làm mới token thất bại:', error);
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('refreshToken');
          
        }
      } else {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        resetToLogin();  // điều hướng về Login khi refresh token hết hạn
        return Promise.reject(new Error('Refresh token expired'));
      }
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
   (error) => {
      return Promise.reject(error);
    }
);

export default axiosInstance;