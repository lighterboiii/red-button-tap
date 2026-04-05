import './CTA.css';
import { CTA_COPY } from '../../content/cta';

export default function CTABlock({ lang = 'ru' }) {
  const copy = CTA_COPY[lang] || CTA_COPY.ru;
  return (
    <section className="cta" id="cta">
      <div className="cta__inner">
        <div className="cta__content">
          <h2 className="cta__title">{copy.title}</h2>
          <p className="cta__lead">{copy.lead}</p>
          <p className="cta__thesis">{copy.thesis}</p>
          <a href="mailto:hello@xrable.com" className="cta__button">
            {copy.primaryButton}
          </a>
        </div>
        <div className="cta__video">
          <h3 className="cta__video-heading">{copy.videoHeading}</h3>
          {CTA_COPY.videoSrc ? (
            <div className="cta__video-wrap">
              <iframe
                src={`${CTA_COPY.videoSrc}?skinColor=ffffff`}
                title="XRABLE product overview"
                className="cta__iframe"
                style={{ border: 'none' }}
                allow="clipboard-write; autoplay"
                webkitAllowFullScreen
                mozallowfullscreen
                allowFullScreen
              />
            </div>
          ) : (
            <div className="cta__video-placeholder">Oops, video not found</div>
          )}
        </div>
      </div>
    </section>
  );
}
