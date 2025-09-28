import {View,StyleSheet, Image,Text, Animated } from 'react-native';
import React, { useEffect,useRef, memo } from 'react';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming,useAnimatedProps , Easing,useDerivedValue, cancelAnimation } from "react-native-reanimated";
import { useSongStore } from '../store/songStore';
import { useControlStore } from '../store/controlStore';
import { COLORS } from '@constant/style';
interface Props{
  page:number;
}
export const RotatingCover:React.FC<Props> = memo(({page}) => {
    const image_cover  = useSongStore((state) => state.song.image_cover);
    const pageAcitive = useControlStore(state=>state.page);
    const spinValue = useRef<Animated.Value>(new Animated.Value(0)).current;
    const loopAnim = useRef<Animated.CompositeAnimation | null>(null);
    const song = useSongStore((state) => state.song);
    useEffect(() => {
      if(page == pageAcitive){
        loopAnim.current = Animated.loop(
          Animated.timing(spinValue, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
          easing: Easing.linear,
          })
        )
        loopAnim.current.start();
      }
      return () => {
        // Dọn dẹp khi component unmount
        loopAnim.current?.stop()
      };
    }, [pageAcitive]);
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const animatedStyle = () => {
        return {
          transform: [
            { rotate: spin },
          ],
        };
      };
      console.log(123)
  return (
    <Animated.View style={[styles.circle, animatedStyle()]}>
        <Image source={{ uri: image_cover }} style={styles.img} resizeMode="cover" />
    </Animated.View>
  );
});
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        alignItems:'center',
        borderRadius: 10,
        gap:12,
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
  });