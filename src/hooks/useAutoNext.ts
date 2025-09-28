import TrackPlayer, { Event } from 'react-native-track-player';
import { useEffect } from 'react';
import { REPEAT_ALL, REPEAT_ONE, useSongStore } from '@store/songStore';
import { TrackService } from '@services/trackplayer';

export function useAutoNext() {
  useEffect(() => {
    console.log('useAutoNext: Listener đăng ký'); // Xác nhận useEffect chạy
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async (event) => {
        console.log('PlaybackActiveTrackChanged triggered:', event); // Log sự kiện
        if (event.track === null) {
          const { repeat } = useSongStore.getState();
          console.log('Repeat mode:', repeat); // Log repeat mode
          if (repeat === REPEAT_ONE) {
            console.log('Repeating current track');
            await TrackService.repeatCurrent();
          }
        } else {
          console.log('Setting active song:', event.track);
          await TrackService.setSongActiveStore();
        }
      }
    );

    return () => {
      console.log('useAutoNext: Listener gỡ bỏ');
      listener.remove();
    };
  }, []);
}

export function useQueueEnd() {
  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      async () => {
        await TrackService.handleQueueEnded();
      }
    );

    return () => listener.remove();
  }, []);
}
