/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrackPlayer from  'react-native-track-player';
import {playbackService} from './src/services/playbackService'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
const WrapperApp = () => {
    return(
    <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
        <App />
        </QueryClientProvider>
    </GestureHandlerRootView>
    )
    
}
AppRegistry.registerComponent(appName, () => WrapperApp);
TrackPlayer.registerPlaybackService(() => playbackService);
