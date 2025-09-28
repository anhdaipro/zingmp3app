import { useEffect } from 'react';
import TrackPlayer, {
  Event,
  State as TrackPlayerState,
  Track,
  Capability,
} from 'react-native-track-player';
import { usePlayerStore, PlayerState } from '@store/usePlayerStore';

function trackStateToString(state: TrackPlayerState): PlayerState['playbackState'] {
  switch (state) {
    case TrackPlayerState.Playing: return 'playing';
    case TrackPlayerState.Paused: return 'paused';
    case TrackPlayerState.Buffering: return 'buffering';
    case TrackPlayerState.Stopped: return 'stopped';
    case TrackPlayerState.Ready: return 'ready';
    case TrackPlayerState.None: return 'none';
    default:
      console.warn(`Unknown state: ${state}`);
      return 'none';
  }
}

export function useTrackPlayerSync() {
  const {
    setCurrentTrack, setPlaybackState, setCurrentPosition,
    setDuration, setVolume, setSubscriptionsInitialized, setError,
  } = usePlayerStore();

  useEffect(() => {
    const setup = async () => {
      setError(null);
      try {
         await TrackPlayer.setupPlayer();
        const activeTrack: Track | undefined = await TrackPlayer.getActiveTrack();
        const progress = await TrackPlayer.getProgress();
        const volume = await TrackPlayer.getVolume();
        const playbackState = await TrackPlayer.getPlaybackState();

        setCurrentTrack(activeTrack?.id ?? null);
        setCurrentPosition(progress.position);
        setDuration(progress.duration);
        setVolume(volume);
        setPlaybackState(trackStateToString(playbackState.state));
        setSubscriptionsInitialized(true);
      } catch (error: any) {
        console.error("TrackPlayer setup error:", error);
        setError(`Init error: ${error.message || 'Unknown'}`);
        setSubscriptionsInitialized(false);
      }
    };

    setup();

    const subs = [
      TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (data) => {
        try {
          setCurrentTrack(data.track?.id ?? null);
          setError(null);
          console.log(233)
        } catch (e: any) {
          setError(`Track change error: ${e.message}`);
        }
      }),
      TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
        try {
            console.log(233)
          setPlaybackState(trackStateToString(state));
        } catch (e: any) {
          setError(`State error: ${e.message}`);
        }
      }),
      TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, ({ position, duration }) => {
        setCurrentPosition(position);
        console.log(233)
        setDuration(duration);
      }),
      TrackPlayer.addEventListener(Event.PlaybackError, (err) => {
        setError(`Playback error: ${err.message || err.code}`);
        setPlaybackState('stopped');
      }),
    ];

    return () => {
      subs.forEach((sub) => sub.remove());
      setSubscriptionsInitialized(false);
      setError(null);
    };
  }, [
    setCurrentTrack, setPlaybackState, setCurrentPosition,
    setDuration, setVolume, setSubscriptionsInitialized, setError,
  ]);
}
export async function setupTrackPlayer() {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });
  } catch (error) {
    console.error('TrackPlayer setup failed:', error);
  }
}