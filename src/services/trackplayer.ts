import { REPEAT_ALL, REPEAT_ONE, useSongStore } from "@store/songStore";
import { Song } from "@type/song";
import TrackPlayer, { Event, PlaybackActiveTrackChangedEvent, PlaybackTrackChangedEvent, State, Track } from "react-native-track-player";

class TrackServiceClass {
    async getTrackActive(){
        return await TrackPlayer.getActiveTrack()
    }
    async setSongActiveStore() {
    const track = await TrackPlayer.getActiveTrack();
    if (track) {
      // Tạo object mới để Zustand detect change
      useSongStore.getState().setSongPlay({ ...track } as Song);
    }
  }

    async togglePlayback(){
        try {
            const currentState = await TrackPlayer.getState();
            console.log(currentState)
            if (currentState == State.Playing) {
            await TrackPlayer.pause();
                useSongStore.getState().setPlay(false);
            } else if(currentState != State.Error) {
                await TrackPlayer.play();
                useSongStore.getState().setPlay(true);
            }
        } catch (error) {
            console.log(error)
        }
    }
     async repeatCurrent() {
        const index = await TrackPlayer.getActiveTrackIndex();
        if (index && index >= 0) {
            await TrackPlayer.skip(index);
            await TrackPlayer.play();
        }
    }
    async handleQueueEnded() {
        const mode = useSongStore.getState().repeat;
        if (mode == REPEAT_ONE) {
            await this.repeatCurrent();
        } else{
            await this.nextTrack();
        }
    }
    // Lắng nghe track active change → quản lý repeatOne / repeatAll
    async handleTrackChange(event: PlaybackTrackChangedEvent) {
        console.log(123445)
        if (event.nextTrack === null) {
            // Không còn bài active → queue hết
            const { repeat } = useSongStore.getState();
            if (repeat === REPEAT_ONE) {
            await this.repeatCurrent(); // lặp lại bài hiện tại
            } else {
            // repeat off → không làm gì
            }
        } else {
            // track active thay đổi → update store
            await this.setSongActiveStore();
        }
    }
    async nextTrack() {
        const index = await TrackPlayer.getActiveTrackIndex();
        const queue = await TrackPlayer.getQueue();
        const { shuffle, repeat } = useSongStore.getState();
        if (!queue.length) return;
        if (shuffle) {
            const randomIndex = Math.floor(Math.random() * queue.length);
            await TrackPlayer.skip(randomIndex);
        } else if (index === queue.length - 1) {
        if (repeat === REPEAT_ALL) {
            await TrackPlayer.skip(0); // quay lại bài đầu
        } else {
            return; // hết nhạc, không phát nữa
        }
        } else {
            await TrackPlayer.skipToNext();
        }
        await this.setSongActiveStore();
    }

    // Prev track hỗ trợ shuffle
    async prevTrack() {
        const index = await TrackPlayer.getActiveTrackIndex();
        const queue = await TrackPlayer.getQueue();
        const { shuffle, repeat } = useSongStore.getState();
        if (!queue.length) return;
        if (shuffle) {
        const randomIndex = Math.floor(Math.random() * queue.length);
        await TrackPlayer.skip(randomIndex);
        } else if (index == 0) {
        if (repeat === REPEAT_ALL) {
            await TrackPlayer.skip(queue.length - 1); // quay lại bài cuối
        } else {
            return; // đang đầu, không làm gì
        }
        } else {
        await TrackPlayer.skipToPrevious();
        }
        await this.setSongActiveStore();
    }
}
export const TrackService = new TrackServiceClass();