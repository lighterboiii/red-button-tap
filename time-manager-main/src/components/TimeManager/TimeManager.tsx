import React, { FC, useState, useEffect } from 'react';
import styles from './TimeManager.module.scss';
import Timer from '../Timer/Timer';

const TimeManager: FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isMinutes, setIsMinutes] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleStart = (): void => {
    if (inputValue !== '') {
      const numValue = parseInt(inputValue) || 0;
      const totalSeconds = isMinutes ? numValue * 60 : numValue;
      setMinutes(Math.floor(totalSeconds / 60));
      setSeconds(totalSeconds % 60);
      setIsActive(true);
      setInputValue('');
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setMinutes(0);
    setSeconds(0);
    setIsPaused(false);
    setInputValue('');
  };

  const handlePause = (): void => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            setIsPaused(false);
          } else {
            setMinutes(prev => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(prev => prev - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, minutes, seconds]);

  const handleTimeEnd = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  return (
    <div className={styles.timeManager}>
      <div className={styles.timeManager__container}>
        <div className={styles.timeManager__mode_switch}>
          <button
            className={`${styles.timeManager__button} ${isMinutes ? styles['timeManager__button--active'] : ''}`}
            onClick={() => setIsMinutes(true)}
            disabled={isActive}
          >
            Минуты
          </button>
          <button
            className={`${styles.timeManager__button} ${!isMinutes ? styles['timeManager__button--active'] : ''}`}
            onClick={() => setIsMinutes(false)}
            disabled={isActive}
          >
            Секунды
          </button>
        </div>

        <div className={styles.timeManager__controls}>
          <input
            type="number"
            className={styles.timeManager__input}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isMinutes ? "Введите минуты" : "Введите секунды"}
            disabled={isActive}
          />
          <button
            className={styles.timeManager__button}
            onClick={handleStart}
            disabled={isActive || !inputValue}
          >
            Старт
          </button>
          <button
            className={styles.timeManager__button}
            onClick={handlePause}
            disabled={!isActive}
          >
            {isPaused ? 'Продолжить' : 'Пауза'}
          </button>
          <button
            className={styles.timeManager__button}
            onClick={handleReset}
            disabled={!isActive && minutes === 0 && seconds === 0}
          >
            Сброс
          </button>
        </div>

        {isActive || (minutes > 0 || seconds > 0) ? (
          <Timer
            minutes={minutes}
            seconds={seconds}
            isPaused={isPaused}
            isActive={isActive}
            onTimeEnd={handleTimeEnd}
          />
        ) : (
          <div className={styles.timeManager__info}>
            Введите время и нажмите "Старт" для запуска таймера
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeManager;
