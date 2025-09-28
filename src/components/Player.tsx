import React,{useRef,memo} from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
const MusicPlayer: React.FC = () => {
  return (
      <View></View>
  );
};

const styles = StyleSheet.create({
  container: {

    alignItems: 'center',
    padding: 20,
  },
  video: {
    width: 0, // Không hiển thị video (chỉ phát âm thanh)
    height: 0,
  },
  text_info: {
    color: '#fff',
   
  }

});

export default memo(MusicPlayer);