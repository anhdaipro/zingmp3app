import { useSongStore } from '@store/songStore';
import { Song } from '@type/song';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
  Track
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  }
  catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  }
  finally {
    return isSetup;
  }
}

export async function addTracks() {
  await TrackPlayer.add([
    {
      id: '1',
      url: 'https://a128-z3.zmdcdn.me/9f2287bc5af0f660324dcba7df809b0c?authen=exp=1757822826~acl=/9f2287bc5af0f660324dcba7df809b0c*~hmac=0a5cf4cd0376c7cc46be4f62a21d0769',
      title: 'Fluidity',
      artist: 'tobylane',
      duration: 60,
    }
  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  // Play khi nhấn nút play từ notification / lock screen
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
    console.log('RemotePlay');
  });

  // Pause khi nhấn nút pause
  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
    console.log('RemotePause');
  });

  // Stop khi nhấn nút stop
  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
    console.log('RemoteStop');
  });

  // Next track
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try {
      await TrackPlayer.skipToNext();
      console.log('Skipped to next track');
    } catch {
      console.log('No next track');
    }
  });

  // Previous track
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      await TrackPlayer.skipToPrevious();
      console.log('Skipped to previous track');
    } catch {
      console.log('No previous track');
    }
  });

  // Seek to position
  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    await TrackPlayer.seekTo(event.position);
    console.log(`Seeked to ${event.position}`);
  });

  // Optional: handle custom events
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
    try {
      // Thử next
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    } catch (e) {
      // Nếu hết queue → quay lại bài đầu tiên
      const queue = await TrackPlayer.getQueue();
      if (queue.length > 0) {
        await TrackPlayer.skip(0);
        await TrackPlayer.play();
      }
    }
    console.log('Queue ended');
  });

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
    console.log(123444)
    if (event.index != null) {
      const track = await TrackPlayer.getTrack(event.index);
      if(track){
        useSongStore.getState().setSongPlay(track as Song);
      }
    }
  });
}
export const updateTrackUrl = async (trackId:string, newUrl:string) => {
  const queue = await TrackPlayer.getQueue();
  const index = queue.findIndex(song => song.id == trackId);
  console.log(index)
  TrackPlayer.skip(index)
};
export const addTrackToStart = async (newTrack:Track) => {
  const queue = await TrackPlayer.getQueue();
  // Chèn track mới vào đầu
  const newQueue = [newTrack, ...queue];

  // Xóa playlist cũ
  await TrackPlayer.reset();

  // Thêm playlist mới
  await TrackPlayer.add(newQueue);
  TrackPlayer.skip(0)
};