import { create } from 'zustand';

interface AudioStore {
  analyser: AnalyserNode | null;
  setAnalyser: (analyser: AnalyserNode) => void;
  audioData: Uint8Array;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  // Get current average frequency for reactivity
  getAudioIntensity: () => number;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  analyser: null,
  setAnalyser: (analyser) => set({ analyser }),
  audioData: new Uint8Array(128),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  getAudioIntensity: () => {
    const state = get();
    if (!state.analyser || !state.isPlaying) return 0;
    // @ts-ignore
    state.analyser.getByteFrequencyData(state.audioData);
    let sum = 0;
    for (let i = 0; i < state.audioData.length; i++) {
      sum += state.audioData[i];
    }
    return sum / (state.audioData.length * 255); // Returns 0 to 1
  }
}));

interface AppState {
  currentSection: number;
  setCurrentSection: (section: number) => void;
  giftsOpened: number;
  incrementGiftsOpened: () => void;
  showGiftOverlay: boolean;
  setShowGiftOverlay: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSection: 0,
  setCurrentSection: (section) => set({ currentSection: section }),
  giftsOpened: 0,
  incrementGiftsOpened: () => set((state) => ({ giftsOpened: state.giftsOpened + 1 })),
  showGiftOverlay: false,
  setShowGiftOverlay: (show) => set({ showGiftOverlay: show })
}));
