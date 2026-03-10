import './Team.css';

/**
 * Команда — почему именно мы способны это построить.
 * Платформенная разработка, XR/wearable, продуктовая логика, опыт внедрения.
 */
const TEAM = {
  title: 'Команда',
  lead: 'Сочетание ключевых компетенций: платформенная разработка, экспертиза в XR и wearable, продуктовая логика и опыт движения к реальному внедрению.',
  thesis: 'У нас есть и техническое понимание, и практический опыт, и продуктовая логика.',
  members: [
    {
      id: '1',
      name: 'Имя',
      credentials: 'Регалии, роль',
      description: 'Краткое описание и ключевые компетенции. Текст добавите позже.',
    },
    {
      id: '2',
      name: 'Имя',
      credentials: 'Регалии, роль',
      description: 'Краткое описание и ключевые компетенции. Текст добавите позже.',
    },
  ],
};

export default function Team() {
  return (
    <section className="team">
      <div className="team__inner">
        <h2 className="team__title">{TEAM.title}</h2>
        <p className="team__lead">{TEAM.lead}</p>
        <p className="team__thesis">{TEAM.thesis}</p>
        <div className="team__grid">
          {TEAM.members.map((member) => (
            <article key={member.id} className="team__card">
              <div className="team__photo">
                <span className="team__photo-placeholder">Фото</span>
              </div>
              <h3 className="team__name">{member.name}</h3>
              <p className="team__credentials">{member.credentials}</p>
              <p className="team__description">{member.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
