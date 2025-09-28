import TrackPlayer from "react-native-track-player";
import { useSongStore } from "../../store/songStore";
import { Song } from "../../types/song";
import { useLyrics, useStreaming } from "../queries/useSong";
import { addTrackToStart, updateTrackUrl } from "@services/playbackService";

export const useSongAction = (song: Song) => {
    const {data:res} = useLyrics(song.id)
    const {setSongPlay} = useSongStore()
    const setSongActive = async () => {
      const queue = await TrackPlayer.getQueue();
      const songExist = queue.find(item=>item.id = song.id)
      setSongPlay(song, false)
      if(songExist){
        updateTrackUrl(song.id, song.url)
      }else{
        const track = {...song, url: song.url}
        addTrackToStart(track)
      }
      
    };
    const setLyrics = () => {
        if (!res.lyrics && res.sentences) return;    
        const songUpdate = { ...song, lyrics: res.lyrics,sentences:res.sentences };
        console.log(songUpdate)
        setSongPlay(songUpdate);
    }
    return { setSongActive,setLyrics };
  };