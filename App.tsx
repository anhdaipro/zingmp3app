import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();
import { SafeAreaView } from 'react-native-safe-area-context';
import SignupScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import { TabNavigator } from './src/navigation/TabNavigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { enableScreens } from 'react-native-screens';  // Thêm dòng này
import { ModalProvider } from './src/context/modalContext';

import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import { useEffect } from 'react';
import { setupTrackPlayer, useTrackPlayerSync } from '@hooks/useTrackPlayerSync';
import { usePlayerStore } from '@store/usePlayerStore';
import { setupPlayer } from '@services/playbackService';
import { useSongs } from '@hooks/queries/useSong';
enableScreens();
const events = [Event.PlaybackState, Event.PlaybackError, Event.PlaybackActiveTrackChanged]
const queryClient = new QueryClient();
const App = () => {
 
 const { playbackState, currentTrackId, currentPosition, duration, error, subscriptionsInitialized } = usePlayerStore();
 console.log(currentPosition)
  return (
    
      <ModalProvider>
      <NavigationContainer>
        {/* Bọc trong Provider để chia sẻ dữ liệu toàn cục (nếu có sử dụng context) */}
        
          {/* SafeAreaView giúp ứng dụng tránh bị che khuất bởi notch hoặc các yếu tố trên màn hình */}
          <SafeAreaView style={{ flex: 1 }}>
            {/* Định nghĩa các màn hình với Stack Navigator */}
            <Stack.Navigator>
            <Stack.Screen name="Home" component={TabNavigator} 
              options={{headerShown:false}}
              />
              <Stack.Screen name="Signup" component={SignupScreen} 
              options={{title:'Đăng ký'}}
              />
              <Stack.Screen name="Login" component={LoginScreen} 
              options={{title:'Đăng nhập'}}
              />
            
            </Stack.Navigator>
          </SafeAreaView>
      </NavigationContainer>
      </ModalProvider>
   
  );
};

export default App;