import React,{useEffect, useMemo, useState, useRef, useCallback,memo} from 'react';
import { View, StyleSheet,Text,Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import {  } from 'react-native-worklets';
import { GestureDetector, Gesture} from 'react-native-gesture-handler';
import { COLORS } from '@constant/style';
import TrackPlayer, { Event, State, usePlaybackState, useProgress,useTrackPlayerEvents } from 'react-native-track-player';
import { TrackService } from '@services/trackplayer';
import { useSongStore } from '@store/songStore';
import { Song } from '@type/song';


// Define types for our props
type CustomSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  height?: number;
  thumbSize?: number;
  trackHeight?: number;
  initialValue?: number;
};

// Define context type for pan gesture
type PanContextType = {
  startX: number;
};
const events = [
  Event.PlaybackQueueEnded,
  Event.PlaybackActiveTrackChanged,
  Event.PlaybackState
]
const { width } = Dimensions.get('window');
const widthA = width - 48
const CustomSlider: React.FC<CustomSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  width = widthA,
  height = 40,
  thumbSize = 14,
  trackHeight = 3,
}) => {
  const isSlidingRef = useRef(false);
  const progress = useSharedValue(0);
  const [widthActive, setWidthActive] = useState(0);
  const { position: currentTime, duration,buffered } = useProgress(300);
  const id = useSongStore((state) => state.song.id);
  const setSongPlayer = useSongStore((state) => state.setSongPlay);
  // useEffect(() => {
  //   const listener = TrackPlayer.addEventListener(
  //     Event.PlaybackProgressUpdated,
  //     ({ position, duration }) => {
  //       if (duration > 0) {
  //         const newProgress = position / duration;
  //         // Animate mượt với linear easing
  //         progress.value = withTiming(newProgress, {
  //           duration: 200, // thời gian animation ngắn → mượt
  //           easing: Easing.linear,
  //         });
  //       }
  //     }
  //   );

  //   return () => listener.remove();
  // }, []);
  const prevTranslationX = useSharedValue(0);
  useEffect(() => {
    const update = async () =>{
    if (duration > 0 && !isSlidingRef.current) {
      const trackcurrent = await TrackPlayer.getActiveTrack()
      if(trackcurrent && trackcurrent.id != id){
        setSongPlayer(trackcurrent as Song)
      }
      const px = (currentTime / duration) * width;
      setWidthActive(px)
      progress.value = withTiming(px, {
        duration: 100,
        easing: Easing.linear,
      });
    }
    }
    update()
  }, [currentTime, duration]);
  const endGesture = async (newTime:number) => {
    isSlidingRef.current = false
    await TrackPlayer.seekTo(newTime);
    // cập nhật progress ngay lập tức để đồng bộ
  }
  const playerState = usePlaybackState();
  
const [trackTitle, setTrackTitle] = useState<string>();
    // do initial setup, set initial trackTitle..
   

  const setCurrentRef = (value:boolean) =>{
    isSlidingRef.current = value
  }
  // Pan gesture handler with proper typing
  const panGestureHandler = Gesture.Pan()
    .onBegin((event) => {
    // Tương đương ctx.startX = progress.value;
      prevTranslationX.value = event.x ;
      console.log("translationX:", event.x);
       runOnJS(setCurrentRef)(true);
    })
    .onUpdate((event) => {
      let newProgress = event.x;
      console.log("translationX:", event.translationX);
      
      newProgress = Math.max(0, Math.min(newProgress, width));
      progress.value = newProgress;
      runOnJS(setWidthActive)(newProgress);
      // runOnJS(setIsSliding)(true);
    })
    .onEnd((event) => {
      const percent = widthActive / width; // Tính phần trăm
      const time = percent * duration;
      progress.value = (time / duration) * width;
      runOnJS(endGesture)(time);
    })

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  
  const progressStyle = useAnimatedStyle(() => ({
    
    width: progress.value,
  }));
  const onTap = Gesture.Tap()
  .maxDistance(5) // 👈 chỉ coi là tap nếu ngón tay không dịch chuyển quá 5px
  .onEnd((event, success) => {
    if (!success) return; // nếu tap bị cancel bởi pan thì bỏ qua
      const tappedX = event.x; // vị trí người dùng nhấn trên thanh
      console.log('tapX',tappedX)
      // Tính phần trăm
      const percent = tappedX / (width); // thumbSize / 2 để căn giữa thumb
      // Tính thời gian tương ứng
      const newTime = percent * duration;
      progress.value = tappedX
      // Cập nhật currentTime (hoặc gọi seek)
      runOnJS(setWidthActive)(tappedX);
      runOnJS(endGesture)(newTime);
  })
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  const minutesCurrent = useMemo(()=>{
    return Math.floor((widthActive/width)*duration / 60);
  },[widthActive])
  const secondsCurrent = useMemo(()=>{
    return Math.round((widthActive/width)*duration % 60);
  },[widthActive])   
  const composed = Gesture.Exclusive(panGestureHandler, onTap);
 

    // do initial setup, set initial trackTitle..

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const {title} = track || {};
            setTrackTitle(title);
        }
    });

    const bufferedWidth = (buffered/duration)*width
  return (
    <>
    <View style={[styles.container, { width, height }]}>
      <Text>{trackTitle}</Text>
      <GestureDetector gesture={composed}>
        <Animated.View style={styles.tapArea}>
        <View style={[styles.track, { width: width, height: trackHeight }]}/>
          
          <Animated.View 
            style={[
              styles.progress, 
              { height: trackHeight }, 
              progressStyle
            ]} 
          />
          <Animated.View
            style={[
              styles.buffer,                // mới
              { height: trackHeight },
              { width: bufferedWidth },     // width dựa trên buffered position
            ]}
          />
            <Animated.View 
              style={[
                styles.thumb, 
                { 
                  width: thumbSize, 
                  height: thumbSize, 
                  borderRadius: thumbSize / 2,
                  left:-thumbSize / 2, // Center the thumb
                }, 
                thumbStyle
              ]} 
            />
         
        </Animated.View>
      </GestureDetector>
     
    </View>
    <View style={[styles.view_duration,{width:widthA}]}>
        <Text  style={[styles.text_info,]}>{(`${'0'+minutesCurrent}`).slice(-2)}:{(`${'0'+secondsCurrent}`).slice(-2)}</Text>
        <Text style={styles.text_info}>{(`${'0'+minutes}`).slice(-2)}:{(`${'0'+seconds}`).slice(-2)}</Text>
    </View>
    {/* <RotatingCover/> */}
    </>
  );
};
export default memo(CustomSlider);

const styles = StyleSheet.create({
  text_info:{
          color:COLORS.primaryWhiteHex,
          fontSize:12,
      },
      view_duration:{
      flexDirection:'row',
      width:'100%',
      alignItems:'center',
      justifyContent:'space-between',
      },
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    
  },
  buffer:{
 backgroundColor: '#afacacff',
    borderRadius: 5,
    position: 'absolute',
    left: 0,
  },
  track: {
    backgroundColor: '#7d7979ff',
    borderRadius: 5,
    position: 'absolute',
    left: 0,
  },
  tapArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  progress: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: 5,
    position: 'absolute',
    left: 0,
    zIndex:1,
  },
  thumb: {
    backgroundColor: COLORS.primaryWhiteHex,
    position: 'absolute',
    left: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  valueText: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
