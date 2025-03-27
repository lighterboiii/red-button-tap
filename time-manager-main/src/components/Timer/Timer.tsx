import { FC, useEffect, useState } from "react";
import styles from './Timer.module.scss';

interface ITimer {
  time: number | null;
  isPaused: boolean;
}

const Timer: FC<ITimer> = ({ time, isPaused }) => {
  const [minutes, setMinutes] = useState(Math.floor(time! / 60));
  const [seconds, setSeconds] = useState(time! % 60);
  console.log(seconds);
  console.log(minutes);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
          } else {
            setMinutes(prevState => prevState - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(prevState => prevState - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [minutes, seconds, isPaused]);

  return (
    <div className={styles.timer}>
      <h1 className={styles.timer__time}>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</h1>
    </div>
  )
};

export default Timer;