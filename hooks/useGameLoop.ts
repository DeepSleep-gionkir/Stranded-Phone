import { useEffect, useRef } from 'react';
import { useGameState } from './useGameState';
import { WEATHER_EFFECTS } from '@/lib/constants';

const TICK_RATE_MS = 1000; // 1 second real time = 1 minute game time
const BASE_BATTERY_DRAIN = 0.1;

export const useGameLoop = () => {
  const { 
    setTime, 
    setBattery, 
    setSignal, 
    weather, 
    isFlashlightOn,
    battery 
  } = useGameState();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const { gameStatus } = useGameState.getState();
    if (gameStatus !== 'playing') return;
    if (battery <= 0) return;

    intervalRef.current = setInterval(() => {
      // Time progression (1 tick = 1 minute)
      setTime((prev) => prev + 1);

      // Battery drain logic
      setBattery((prev) => {
        let drain = 0.03; // Base drain per tick (reduced for longer playtime)
        if (isFlashlightOn) drain += 0.1; // Flashlight drains extra
        
        // Random extra drain based on weather
        if (weather === 'rain') drain += 0.02;
        if (weather === 'fog') drain += 0.01;

        // Brightness drain (Proportional to brightness)
        const { brightness } = useGameState.getState();
        // Base drain is 0.03. Brightness adds up to 0.05 at 100%.
        // At 10% brightness: +0.005
        // At 60% brightness: +0.03
        drain += brightness * 0.0005;

        const newBattery = Math.max(0, prev - drain);
        
        // Check for game over
        if (newBattery <= 0) {
          useGameState.getState().setGameStatus('lost', '배터리가 방전되어 통신이 두절되었습니다.');
        }
        
        return newBattery;
      });

      // Night Time Logic (20:00 - 06:00)
      const timeOfDay = useGameState.getState().time % 1440;
      const isNight = timeOfDay >= 1200 || timeOfDay < 360;

      if (isNight) {
        // Passive Sanity Drain at Night (Fear of Dark)
        // If flashlight is ON, sanity is protected
        if (!isFlashlightOn) {
           // Drain sanity slowly if in dark
           useGameState.getState().setSanity((prev) => Math.max(0, prev - 0.05));
        }
      }

      // Sanity check for Game Over
      if (useGameState.getState().sanity <= 0) {
        useGameState.getState().setGameStatus('lost', '정신력이 고갈되어 더 이상 이성을 유지할 수 없습니다. 당신은 어둠 속으로 사라졌습니다.');
      }

      // Signal decay logic (Signal is hard to keep)
      // If signal is high, it has a chance to drop
      setSignal((prev) => {
        if (prev > 1 && Math.random() > 0.8) { // Reduced decay chance (30% -> 20%)
          return prev - 1;
        }
        // Occasional random low signal (0-1)
        if (prev <= 1 && Math.random() > 0.9) {
          return Math.random() > 0.5 ? 1 : 0;
        }
        return prev;
      });

    }, TICK_RATE_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setTime, setBattery, setSignal, weather, isFlashlightOn, battery]);
};
