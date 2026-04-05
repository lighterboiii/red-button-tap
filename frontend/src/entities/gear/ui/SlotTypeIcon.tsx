import type { GearSlot } from '../model/types';

type Props = {
  slot: GearSlot;
  className?: string;
};

const vb = '0 0 32 32';

const svgProps = {
  viewBox: vb,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
  focusable: false as const,
};

/** Детализированные фэнтези-иконки типа предмета */
export function SlotTypeIcon({ slot, className }: Props) {
  switch (slot) {
    case 'head':
      return (
        <svg {...svgProps} className={className}>
          {/* Купол шлема */}
          <path
            d="M11 15.5c0-5 2.5-8.5 5-8.5s5 3.5 5 8.5v1.5"
            strokeWidth={1.35}
          />
          {/* Обод / загнутый край */}
          <path d="M9.5 16.5c0 3.5 2.5 6 5.5 6h2c3 0 5.5-2.5 5.5-6" strokeWidth={1.35} />
          {/* Забрало / линия визора */}
          <path d="M10 17.5h12" strokeWidth={1.15} opacity={0.85} />
          {/* Носовой гребень */}
          <path d="M15.5 18v4.5" strokeWidth={1.2} />
          {/* Щёчные пластины */}
          <path d="M10.5 18.5c-1 1.5-1 3.5 0 5" strokeWidth={1.1} />
          <path d="M21.5 18.5c1 1.5 1 3.5 0 5" strokeWidth={1.1} />
          {/* Заклёпки */}
          <circle cx="12" cy="13" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="20" cy="13" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'sword':
      return (
        <svg {...svgProps} className={className}>
          {/* Клинок — ромбовидный силуэт, анфас */}
          <path d="M16 3l3 4-1 11-2 2.5-2-2.5-1-11 3-4z" strokeWidth={1.6} />
          <path d="M16 7v11" strokeWidth={0.85} opacity={0.35} />
          {/* Крестовина */}
          <path d="M8 19.5h16" strokeWidth={2.5} strokeLinecap="square" />
          {/* Обмотка рукояти */}
          <path d="M14 20.5v5M18 20.5v5" strokeWidth={1.55} />
          <circle cx="16" cy="27.5" r="2.5" strokeWidth={1.5} />
        </svg>
      );
    case 'shield':
      return (
        <svg {...svgProps} className={className}>
          {/* Контур щита */}
          <path
            d="M16 3.5L6.5 8v9.5c0 5.5 3.5 10.5 9.5 12.5 6-2 9.5-7 9.5-12.5V8L16 3.5z"
            strokeWidth={1.4}
          />
          {/* Внутренний скос / ребро */}
          <path d="M16 7v17" strokeWidth={1} opacity={0.5} />
          {/* Усиление / босс */}
          <ellipse cx="16" cy="13" rx="3.5" ry="4" strokeWidth={1.1} opacity={0.75} />
          {/* Заклёпки по краю */}
          <circle cx="11" cy="9" r="0.65" fill="currentColor" stroke="none" />
          <circle cx="21" cy="9" r="0.65" fill="currentColor" stroke="none" />
          <circle cx="9" cy="16" r="0.65" fill="currentColor" stroke="none" />
          <circle cx="23" cy="16" r="0.65" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'shoulders':
      return (
        <svg {...svgProps} className={className}>
          {/* Линия плеч */}
          <path d="M6 14h20" strokeWidth={1} opacity={0.3} />
          {/* Левый сполер: характерный выпуклый наплечник */}
          <path
            d="M4.5 11.5C4.5 8 8 5.5 12 7c2 1 3 3.5 2.5 6-.5 3-3 5.5-6 6.5-3-1-4-4.5-4-8z"
            strokeWidth={1.6}
          />
          <path d="M5 14.5l1.5 4" strokeWidth={1.15} opacity={0.55} />
          {/* Правый */}
          <path
            d="M27.5 11.5C27.5 8 24 5.5 20 7c-2 1-3 3.5-2.5 6 .5 3 3 5.5 6 6.5 3-1 4-4.5 4-8z"
            strokeWidth={1.6}
          />
          <path d="M27 14.5l-1.5 4" strokeWidth={1.15} opacity={0.55} />
          <circle cx="9.5" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="22.5" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'chest':
      return (
        <svg {...svgProps} className={className}>
          {/* Пластина анфас: верх шире (плечи), один клин вниз — без лишних линий */}
          <path
            d="M11 9.5h10l3 8.5-7 8-7-8 1-8.5z"
            strokeWidth={1.65}
            fill="currentColor"
            fillOpacity={0.15}
          />
        </svg>
      );
    case 'jewelry':
      return (
        <svg {...svgProps} className={className}>
          {/* Огранка камня */}
          <path
            d="M16 4.5l4.5 6.5-4.5 7-4.5-7 4.5-6.5z"
            strokeWidth={1.35}
            fill="currentColor"
            fillOpacity={0.1}
          />
          {/* Грани */}
          <path d="M16 4.5v13M12 11h8M13.5 8.5h5" strokeWidth={1} opacity={0.5} />
          {/* Оправа кольца */}
          <ellipse cx="16" cy="22" rx="7" ry="4.5" strokeWidth={1.35} />
          <path d="M9 22.5c0 2 3 3.5 7 3.5s7-1.5 7-3.5" strokeWidth={1.15} opacity={0.55} />
          <path d="M14 9l2 3" strokeWidth={0.85} opacity={0.38} />
        </svg>
      );
  }
}
