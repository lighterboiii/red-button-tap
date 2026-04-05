import { type ComponentProps } from 'react';
import { CharacterPanel } from '@widgets/character-panel';
import { GearSlotStrip } from './GearSlotStrip';

type Gear = ComponentProps<typeof CharacterPanel>['gear'];

export type GearBottomTab = 'slots' | 'character';

type Props = {
  gear: Gear;
  tab: GearBottomTab;
  onTabChange: (tab: GearBottomTab) => void;
  avatarUrl?: string | null;
  displayName?: string | null;
};

export function GearBottomSection({ gear, tab, onTabChange, avatarUrl, displayName }: Props) {

  return (
    <div className={`gear-dock ${tab === 'character' ? 'gear-dock--character-full' : ''}`}>
      <div className="gear-dock__content">
        <div
          id="gear-panel-slots"
          role="tabpanel"
          aria-labelledby="gear-tab-slots"
          hidden={tab !== 'slots'}
          className="gear-dock__panel gear-dock__panel--slots"
        >
          <GearSlotStrip equipped={gear.equipped} />
        </div>

        <div
          id="gear-panel-character"
          role="tabpanel"
          aria-labelledby="gear-tab-character"
          hidden={tab !== 'character'}
          className="gear-dock__panel gear-dock__panel--character"
        >
          <CharacterPanel gear={gear} avatarUrl={avatarUrl} displayName={displayName} />
        </div>
      </div>

      <div className="gear-dock__tabs" role="tablist" aria-label="Нижняя панель">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'slots'}
          id="gear-tab-slots"
          aria-controls="gear-panel-slots"
          className={`gear-dock__tab ${tab === 'slots' ? 'gear-dock__tab--active' : ''}`}
          onClick={() => onTabChange('slots')}
        >
          Кнопка
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'character'}
          id="gear-tab-character"
          aria-controls="gear-panel-character"
          className={`gear-dock__tab ${tab === 'character' ? 'gear-dock__tab--active' : ''}`}
          onClick={() => onTabChange('character')}
        >
          Персонаж
        </button>
      </div>
    </div>
  );
}
