import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerState {
  currentTrackId: string | null;
  playbackState: 'none' | 'ready' | 'playing' | 'paused' | 'stopped' | 'buffering';
  currentPosition: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeatMode: 'none' | 'single' | 'all';
  pointA: number | null;
  pointB: number | null;
  loopActive: boolean;
  subscriptionsInitialized: boolean;
  error: string | null;

  setCurrentTrack: (id: string | null) => void;
  setPlaybackState: (s: PlayerState['playbackState']) => void;
  setCurrentPosition: (p: number) => void;
  setDuration: (d: number) => void;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  setShuffle: (s: boolean) => void;
  setRepeatMode: (r: PlayerState['repeatMode']) => void;
  setPointA: (a: number | null) => void;
  setPointB: (b: number | null) => void;
  setLoopActive: (l: boolean) => void;
  setSubscriptionsInitialized: (v: boolean) => void;
  clearLoopPoints: () => void;
  setError: (error: string | null) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentTrackId: null,
      playbackState: 'none',
      currentPosition: 0,
      duration: 0,
      volume: 1,
      muted: false,
      shuffle: false,
      repeatMode: 'none',
      pointA: null,
      pointB: null,
      loopActive: false,
      subscriptionsInitialized: false,
      error: null,

      setCurrentTrack: (id) => set({ currentTrackId: id }),
      setPlaybackState: (s) => set({ playbackState: s }),
      setCurrentPosition: (p) => set({ currentPosition: p }),
      setDuration: (d) => set({ duration: d }),
      setVolume: (v) => set({ volume: v }),
      setMuted: (m) => set({ muted: m }),
      setShuffle: (s) => set({ shuffle: s }),
      setRepeatMode: (r) => set({ repeatMode: r }),
      setPointA: (a) => set({ pointA: a }),
      setPointB: (b) => set({ pointB: b }),
      setLoopActive: (l) => set({ loopActive: l }),
      setSubscriptionsInitialized: (v) => set({ subscriptionsInitialized: v }),
      clearLoopPoints: () => set({ pointA: null, pointB: null, loopActive: false }),
      setError: (e) => set({ error: e }),
    }),
    {
      name: 'player-store',
    }
  )
);