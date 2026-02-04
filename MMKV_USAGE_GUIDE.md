# 📦 React Native MMKV - Hướng dẫn sử dụng

## ✅ Đã cài đặt
- **Package**: `react-native-mmkv` version **4.1.1**
- **Tương thích**: React Native 0.81.4 ✓

---

## 🚀 Cách sử dụng cơ bản

### 1️⃣ **Khởi tạo (Setup)**

```typescript
import { MMKV } from 'react-native-mmkv';

// Tạo instance mặc định
export const storage = new MMKV();

// Hoặc tạo với ID cụ thể
export const userStorage = new MMKV({
  id: 'user-storage',
  encryptionKey: 'your-encryption-key' // (Optional) Mã hóa dữ liệu
});
```

---

## 📝 API chính

### **Set (Lưu dữ liệu)**
```typescript
// String
storage.set('username', 'phamdai');

// Number
storage.set('age', 25);

// Boolean
storage.set('isLoggedIn', true);

// Object (phải stringify)
storage.set('user', JSON.stringify({ name: 'Dai', age: 25 }));
```

### **Get (Đọc dữ liệu)**
```typescript
// String
const username = storage.getString('username'); // 'phamdai'

// Number
const age = storage.getNumber('age'); // 25

// Boolean
const isLoggedIn = storage.getBoolean('isLoggedIn'); // true

// Object (phải parse)
const userStr = storage.getString('user');
const user = userStr ? JSON.parse(userStr) : null;
```

### **Delete (Xóa)**
```typescript
storage.delete('username');
```

### **Contains (Kiểm tra tồn tại)**
```typescript
if (storage.contains('username')) {
  console.log('Username exists!');
}
```

### **Clear All (Xóa tất cả)**
```typescript
storage.clearAll();
```

### **Get All Keys**
```typescript
const allKeys = storage.getAllKeys();
console.log(allKeys); // ['username', 'age', 'isLoggedIn', ...]
```

---

## 🔄 So sánh với AsyncStorage

| AsyncStorage | MMKV |
|-------------|------|
| `AsyncStorage.setItem('key', 'value')` | `storage.set('key', 'value')` |
| `AsyncStorage.getItem('key')` | `storage.getString('key')` |
| `AsyncStorage.removeItem('key')` | `storage.delete('key')` |
| `AsyncStorage.clear()` | `storage.clearAll()` |
| `AsyncStorage.getAllKeys()` | `storage.getAllKeys()` |

---

## 🎯 Migration từ AsyncStorage

### **Trước (AsyncStorage):**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set
await AsyncStorage.setItem('token', 'abc123');

// Get
const token = await AsyncStorage.getItem('token');

// Remove
await AsyncStorage.removeItem('token');
```

### **Sau (MMKV):**
```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Set (Synchronous - Nhanh hơn!)
storage.set('token', 'abc123');

// Get (Synchronous)
const token = storage.getString('token');

// Remove
storage.delete('token');
```

---

## ⚡ Ưu điểm của MMKV

1. **Nhanh hơn 30x** so với AsyncStorage
2. **Synchronous** - không cần async/await
3. **Hỗ trợ encryption** - bảo mật dữ liệu
4. **Type-safe** với TypeScript
5. **Cross-platform** - iOS & Android

---

## 💡 Ví dụ thực tế

### **Auth Token Storage**
```typescript
// src/utils/storage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const authStorage = {
  setToken: (token: string) => storage.set('auth_token', token),
  getToken: () => storage.getString('auth_token'),
  removeToken: () => storage.delete('auth_token'),
  isAuthenticated: () => storage.contains('auth_token'),
};

// Sử dụng
import { authStorage } from './utils/storage';

authStorage.setToken('your-jwt-token');
const token = authStorage.getToken();
```

### **User Preferences**
```typescript
interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  notifications: boolean;
}

export const prefsStorage = {
  set: (prefs: UserPreferences) => {
    storage.set('preferences', JSON.stringify(prefs));
  },
  get: (): UserPreferences | null => {
    const data = storage.getString('preferences');
    return data ? JSON.parse(data) : null;
  },
};
```

---

## 🔐 Encryption (Mã hóa)

```typescript
import { MMKV } from 'react-native-mmkv';

// Tạo storage với encryption
const secureStorage = new MMKV({
  id: 'secure-storage',
  encryptionKey: 'my-secret-key-12345', // Nên lấy từ Keychain
});

// Sử dụng như bình thường
secureStorage.set('sensitive-data', 'password123');
```

---

## 📚 Tài liệu

- **GitHub**: https://github.com/mrousavy/react-native-mmkv
- **Docs**: https://github.com/mrousavy/react-native-mmkv/blob/main/README.md

---

## ⚙️ Build lại app

Sau khi cài đặt, cần build lại:

```bash
# Android
npm run android

# iOS (nếu dùng)
cd ios && pod install && cd ..
npm run ios
```

---

**Chúc bạn code vui vẻ! 🚀**
