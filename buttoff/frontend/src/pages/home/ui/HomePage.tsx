import { useState } from 'react';
import { useGearDressing } from '@features/gear-dressing';
import { useTelegramWebApp } from '@features/telegram-web-app';
import { GearBottomSection, type GearBottomTab } from '@widgets/gear-bottom-section';
import { TapPanel } from '@widgets/tap-panel';

export function HomePage() {
  const gear = useGearDressing();
  const tg = useTelegramWebApp();
  const [bottomTab, setBottomTab] = useState<GearBottomTab>('slots');

  const displayName = tg.user
    ? [tg.user.first_name, tg.user.last_name].filter(Boolean).join(' ') || tg.user.username || undefined
    : undefined;

  return (
    <main className={`home-page ${bottomTab === 'character' ? 'home-page--character' : ''}`}>
      {bottomTab === 'slots' ? (
        <div className="home-page__scroll">
          <div className="home-page__tap">
            <TapPanel onTakeDrop={gear.applyTapDrop} onSkipDrop={() => undefined} />
          </div>
        </div>
      ) : null}
      <GearBottomSection
        gear={gear}
        tab={bottomTab}
        onTabChange={setBottomTab}
        avatarUrl={tg.user?.photo_url}
        displayName={displayName ?? null}
      />
    </main>
  );
}
