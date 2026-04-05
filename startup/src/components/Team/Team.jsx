import './Team.css';
import photo1 from '../../assets/images/team/photo_2026-03-12 18.07.18.jpeg';
import photo2 from '../../assets/images/team/photo_2026-03-12 18.10.07.jpeg';
import { TEAM_COPY } from '../../content/team';

export default function Team({ lang = 'ru' }) {
  const copy = TEAM_COPY[lang] || TEAM_COPY.ru;
  return (
    <section className="team" id="team">
      <div className="team__inner">
        <h2 className="team__title">{copy.title}</h2>
        <p className="team__lead">{copy.lead}</p>
        <p className="team__thesis">{copy.thesis}</p>
        <div className="team__grid">
          {TEAM_COPY.members.map((member, index) => {
            const photo = index === 0 ? photo1 : photo2;
            const name = lang === 'ru' ? member.nameRu : member.nameEn;
            return (
          <article key={member.id} className="team__card">
              <div className="team__photo">
                {photo ? (
                  <img src={photo} alt="" className="team__photo-img" />
                ) : (
                  <span className="team__photo-placeholder">
                    {lang === 'ru' ? 'Фото' : 'Photo'}
                  </span>
                )}
              </div>
              <h3 className="team__name">{name}</h3>
              <p className="team__credentials">{member.credentials}</p>
              <p className="team__description">{member.description}</p>
            </article>
          );
          })}
        </div>
      </div>
    </section>
  );
}
