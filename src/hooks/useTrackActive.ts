import { useEffect, useState } from "react";
import TrackPlayer, { Track,useTrackPlayerEvents,Event } from "react-native-track-player";

export function useActiveTrack() {
  const [track, setTrack] = useState<Track | undefined>();

  // Lấy track đang active khi mount
  useEffect(() => {
    TrackPlayer.getActiveTrack().then(setTrack);
  }, []);

  // Lắng nghe event khi active track thay đổi
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.track) {
      setTrack(event.track); // cập nhật state -> trigger re-render
    } else {
      setTrack(undefined);
    }
  });

  return track;
}