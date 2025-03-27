import React, { FC, useEffect, useRef, useCallback, useMemo } from "react";
import styles from './Timer.module.scss';

interface ITimer {
  isPaused: boolean;
  minutes: number;
  seconds: number;
  isActive: boolean;
  onTimeEnd: () => void;
}

const Timer: FC<ITimer> = ({ isPaused, minutes, seconds, isActive, onTimeEnd }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioFiles = useMemo(() => [
    '/audio/track1.mp3',
    '/audio/track2.mp3',
    '/audio/track3.mp3',
  ], []);

  const getRandomAudio = useCallback((): string => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex];
  }, [audioFiles]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          if (audioRef.current) {
            audioRef.current.src = getRandomAudio();
            audioRef.current.play().catch((error: Error) => {
              console.log('Audio playback failed:', error);
            });
          }
          onTimeEnd();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, minutes, seconds, getRandomAudio, onTimeEnd]);

  return (
    <div className={styles.timer__display}>
      <h1 className={styles.timer__time}>
        {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </h1>
      <audio ref={audioRef} />
    </div>
  );
};

export default Timer;