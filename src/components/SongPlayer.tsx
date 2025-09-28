import {View,StyleSheet,Text,Dimensions,LayoutChangeEvent } from 'react-native';
import React, {useState,memo,useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, 
    Extrapolate,
    withSpring,
    runOnJS,
    runOnUI,
    interpolate, } from "react-native-reanimated";
import { useSongStore } from '../store/songStore';
import { PlayerControls } from './PlayerControls';
import CustomSlider  from './CustomSlider';
import { RotatingCover } from './RotatingCover';
import { PanGestureHandler,GestureDetector, Gesture } from 'react-native-gesture-handler';
import SongLyrics from './SongLyric';
import { Indicator } from './Indicator';
import { useControlStore } from '../store/controlStore';
import { COLORS, FONTSIZE } from '@constant/style';
import { SongInfo } from './SongInfo';
import { Event, useTrackPlayerEvents } from 'react-native-track-player';
import { TrackService } from '@services/trackplayer';
const { width } = Dimensions.get('window');
const titles = ['Bài Hát','Ca sĩ', 'Lời bài hát'];
const events = [
  Event.PlaybackQueueEnded,
  Event.PlaybackActiveTrackChanged
]
export const SongPlayer = () =>{
    // Dùng useAnimatedProps để tránh truy cập trực tiếp vào giá trị sharedValue
    const [index, setIndex] = useState(0); // 0: Component 1, 1: Component 2
    const translateX = useSharedValue(0);
    const song = useSongStore((state) => state.song);
    const setPage = useControlStore(state=>state.setPage)
    const heights = useSharedValue<number[]>([]);
    // useTrackPlayerEvents(events, (event) => {
    //   console.log(12344)
    //     if (event.type == Event.PlaybackQueueEnded) {
    //       TrackService.handleQueueEnded()
    //     }
    //     if (event.type == Event.PlaybackActiveTrackChanged) {
    //       TrackService.handleTrackChange(event)
    //     }
    //   });
   console.log(song)
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        flexDirection: 'row',
        alignItems:'flex-start',
        width: width * titles.length,
      }));
      
      // Indicator style
      const indicator1Style = useAnimatedStyle(() => ({
        width: interpolate(translateX.value, [-width, 0], [20, 40]),
        backgroundColor: '#fff',
      }));
    
      const indicator2Style = useAnimatedStyle(() => ({
        width: interpolate(translateX.value, [-width, 0], [40, 20]),
        backgroundColor: '#fff',
      }));
      const panParent = Gesture.Pan()
          .onUpdate((event) => {
          // Allow some movement while keeping the current position as base
          if((event.translationX > 0 && index == 0) || (event.translationX < 0 && index == titles.length-1)){
            return;
          }
          translateX.value = index * -width + event.translationX;
        })
        .onEnd((event) => {
          let indexChoice = event.translationX < -50 ? index +1 : index -1;
          indexChoice = Math.max(0, Math.min(indexChoice,titles.length - 1))
          indexChoice = Math.max(0, Math.min(indexChoice, titles.length - 1));
          runOnJS(setIndex)(indexChoice);
          runOnJS(setPage)(indexChoice);
          translateX.value = withSpring(indexChoice*-width);
        })
      const title = titles[index];
      const updateHeight = (index: number, height: number) => {
        runOnUI(() => {
          const newHeights = [...heights.value];
          newHeights[index] = height;
          heights.value = newHeights;
        })();
      };
      const onLayoutPage = (index: number) => (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        
        updateHeight(index, height);
      };
      const animatedHeight = useAnimatedStyle(() => {
       
        if (heights.value.length < 2) return {};
      
        const inputRange = heights.value.map((_, i) => i * -width);
        const outputRange = heights.value;
        return {
          height: interpolate(
            translateX.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        };
      });
    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>{title}</Text>
            {/* Indicator */}
            <View style={styles.indicatorContainer}>
            {/* <Animated.View style={[styles.indicator, indicator1Style]} />
            <Animated.View style={[styles.indicator, indicator2Style]} /> */}
              {titles.map((item, number) =>(
                <Indicator key={number} index={number}  width={width} translateX={translateX} />
              ))}
            </View>
            <View >
              <Animated.View style={[{ overflow: 'hidden' }, animatedHeight]}>
            <GestureDetector  gesture={panParent}>
            <Animated.View style={[animatedStyle]}>
              {/* Component 1 */}
              <View onLayout={onLayoutPage(0)} style={styles.page}>
                  <RotatingCover page={0}/>
                  <View style={{alignItems:'center',gap:6}}>
                      <Text style={styles.text_title}>{song.name}</Text>
                      <Text style={styles.text_info}>{song.artist_name}</Text>
                  </View>
              </View>
              {/* Component 2 */}
              <View onLayout={onLayoutPage(1)} style={styles.page}>
                  <SongInfo/>
              </View>
            {/* Component 3 */}
            <View onLayout={onLayoutPage(2)} style={styles.page}>
              <View style={{alignItems:'center',gap:6}}>
                  <Text style={styles.text_title}>{song.name}</Text>
                  <Text style={styles.text_info}>{song.artist_name}</Text>
              </View> 
              <SongLyrics
                panParent={panParent}
              />
            </View>
            </Animated.View>
            </GestureDetector>
            </Animated.View>
            </View>
            <View style={{gap:6,alignItems:'center'}}>
                <CustomSlider/>
            </View>
            <PlayerControls/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        borderRadius: 10,
        gap:12,
    },
    page: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        gap:24,
      },
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
    circle: {
    width: 200,
    height: 200,
    borderRadius: '50%',
    backgroundColor: "blue",
    overflow: "hidden",
    },
    img:{
        width:'100%',
        height:'100%',
       
    },
    slider: {
        width: '100%',
        height:2,
        marginTop: 10,
      },
    text_title:{
        fontSize:FONTSIZE.size_16,
        color:COLORS.primaryWhiteHex,
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 20,
        color:COLORS.primaryWhiteHex,
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 10,
      },
      indicator: {
        height: 4,
        borderRadius: 2,
      },
  });