import {View, Text, StyleSheet, TouchableOpacity,Image, Animated} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from "@constant/style";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Thay đổi tên Icon theo bộ bạn chọn
import { REPEAT_ALL, REPEAT_NONE, REPEAT_ONE, useSongStore } from '../store/songStore';
import { useShallow } from 'zustand/shallow';
import React from 'react';
import { TrackService } from '@services/trackplayer';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
export const PlayerControls = React.memo(() => { 
     const{play, setPlay, setRepeat, setShuffle, shuffle, repeat} = useSongStore(useShallow((state) => ({
        play:state.play,
        setPlay:state.setPlay,
        setRepeat:state.setRepeat,
        setShuffle:state.setShuffle,
        shuffle:state.shuffle,
        repeat:state.repeat
      }))
    );   
   
    const handleRepeat = () =>{
        let repeatUpdate = REPEAT_NONE
        switch (repeat) {
            case REPEAT_ALL:
                repeatUpdate = REPEAT_ONE
                break;
            case REPEAT_ONE:
                repeatUpdate = REPEAT_NONE
                break;
            default:
                repeatUpdate = REPEAT_ALL
                break;
        }
        setRepeat(repeatUpdate)
    }
    return (
    <View style={[styles.container]}>
        <View style={styles.row}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShuffle(!shuffle)}>
                <Ionicons 
                    name='shuffle'
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => TrackService.prevTrack()}>
                <Ionicons 
                    name='play-skip-back'
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => TrackService.togglePlayback()}>
                <Ionicons 
                    name={!play ? 'play' : 'pause'}
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => TrackService.nextTrack()}>
                <Ionicons 
                    name='play-skip-forward'
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleRepeat()}>
                <MaterialCommunityIcons 
                    name={repeat === REPEAT_ONE ? 'repeat-once' : 'repeat'}
                    size={30}
                    color={repeat === REPEAT_NONE ? COLORS.primaryWhiteHex : COLORS.primaryPurpage}
                />
            </TouchableOpacity>
        </View>
    </View>
    )
})

const styles = StyleSheet.create({
	container: {
		width: '100%',
        paddingHorizontal:24,
        marginTop:24
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
})