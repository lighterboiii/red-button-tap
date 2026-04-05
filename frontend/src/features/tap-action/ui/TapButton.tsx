type Props = {
  disabled: boolean;
  rolling: boolean;
  onTap: () => void;
};

export function TapButton({ disabled, rolling, onTap }: Props) {
  return (
    <button
      type="button"
      className={`tap-button ${rolling ? 'tap-button--rolling' : ''}`}
      disabled={disabled}
      onClick={onTap}
      aria-busy={rolling}
      aria-label={rolling ? 'Ожидание' : 'Нажать'}
    >
      <span className="tap-button__inner">
        <span className="tap-button__nudge">
          <span className="tap-button__glow" aria-hidden />
          <span className="tap-button__fill" aria-hidden />
        </span>
      </span>
    </button>
  );
}
