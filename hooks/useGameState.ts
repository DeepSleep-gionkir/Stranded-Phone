import { create } from 'zustand';
import { GameState, INITIAL_STATE, Message, Weather, ITEMS, ExplorationLog } from '@/lib/constants';

interface GameActions {
  setBattery: (value: number | ((prev: number) => number)) => void;
  setSignal: (value: number | ((prev: number) => number)) => void;
  setSanity: (value: number | ((prev: number) => number)) => void;
  setTime: (value: number | ((prev: number) => number)) => void;
  setWeather: (weather: Weather) => void;
  toggleFlashlight: () => void;
  addMessage: (message: Message) => void;
  markMessageRead: (id: string) => void;
  addToInventory: (item: string) => void;
  resetGame: () => void;
  setGameStatus: (status: 'playing' | 'won' | 'lost', reason?: string) => void;
  setHasSeenIntro: (seen: boolean) => void;
  setBrightness: (value: number) => void;
  addExplorationLog: (log: ExplorationLog) => void;
  useItem: (itemId: string) => void;
}

import { persist, createJSONStorage } from 'zustand/middleware';

export const useGameState = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      gameStatus: 'playing',
      gameOverReason: null,

      setBattery: (value) => set((state) => ({
        battery: typeof value === 'function' ? Math.max(0, Math.min(100, value(state.battery))) : Math.max(0, Math.min(100, value))
      })),

      setSignal: (value) => set((state) => ({ 
        signal: typeof value === 'function' ? Math.max(0, Math.min(4, value(state.signal))) : Math.max(0, Math.min(4, value)) 
      })),

      setSanity: (value) => set((state) => ({
        sanity: typeof value === 'function' ? Math.max(0, Math.min(100, value(state.sanity))) : Math.max(0, Math.min(100, value))
      })),

      setTime: (value) => set((state) => ({
        time: typeof value === 'function' ? value(state.time) : value
      })),

      setWeather: (weather) => set(() => ({ weather })),

      toggleFlashlight: () => set((state) => ({ isFlashlightOn: !state.isFlashlightOn })),

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

      markMessageRead: (id) => set((state) => ({
        messages: state.messages.map((msg) => msg.id === id ? { ...msg, read: true } : msg)
      })),

      addToInventory: (item) => set((state) => ({ inventory: [...state.inventory, item] })),

      resetGame: () => set(() => ({ ...INITIAL_STATE, gameStatus: 'playing', gameOverReason: null, hasSeenIntro: false })),

      setGameStatus: (status, reason) => set(() => ({ gameStatus: status, gameOverReason: reason || null })),

      setHasSeenIntro: (seen) => set(() => ({ hasSeenIntro: seen })),

      setBrightness: (value) => set(() => ({ brightness: Math.max(10, Math.min(100, value)) })),

      addExplorationLog: (log) => set((state) => ({ 
        explorationLog: [log, ...state.explorationLog].slice(0, 50) // Keep last 50 logs
      })),

      useItem: (itemId: string) => set((state) => {
        const item = ITEMS[itemId];
        if (!item) return state;

        // Apply effects
        let newBattery = state.battery;
        let newSanity = state.sanity;
        let newSignal = state.signal;
        let newTime = state.time;
        let newGameStatus = state.gameStatus;
        let newGameOverReason = state.gameOverReason;

        if (item.effect) {
          if (item.effect.battery) newBattery = Math.min(100, Math.max(0, newBattery + item.effect.battery));
          if (item.effect.sanity) newSanity = Math.min(100, Math.max(0, newSanity + item.effect.sanity));
          if (item.effect.signal) newSignal = Math.min(4, Math.max(0, newSignal + item.effect.signal));
          if (item.effect.time) newTime += item.effect.time;
        }

        // Special Item Logic (Endings)
        if (itemId === 'small_boat') {
          newGameStatus = 'won';
          newGameOverReason = '작은 보트를 타고 무인도를 탈출했습니다! 며칠 간의 표류 끝에 지나가던 어선에 구조되었습니다.';
        }
        if (itemId === 'flare_gun') {
          newGameStatus = 'won';
          newGameOverReason = '하늘 높이 조명탄을 쏘아 올렸습니다. 인근을 지나던 헬기가 불빛을 보고 당신을 구조하러 왔습니다!';
        }

        // Remove from inventory if consumable
        const newInventory = item.isConsumable 
          ? state.inventory.filter((id, index) => index !== state.inventory.indexOf(itemId)) // Remove only one instance
          : state.inventory;

        return {
          battery: newBattery,
          sanity: newSanity,
          signal: newSignal,
          time: newTime,
          inventory: newInventory,
          gameStatus: newGameStatus,
          gameOverReason: newGameOverReason,
        };
      }),
    }),
    {
      name: 'stranded-phone-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
