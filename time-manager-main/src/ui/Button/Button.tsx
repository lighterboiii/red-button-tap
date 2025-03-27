import { FC } from "react";
import styles from './Button.module.scss';

interface IBtn {
  text: string;
  handleClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: FC<IBtn> = ({ text, handleClick, disabled, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={handleClick}
      className={styles.button}
      disabled={disabled}
    >
      {text}
    </button>
  )
};

export default Button;