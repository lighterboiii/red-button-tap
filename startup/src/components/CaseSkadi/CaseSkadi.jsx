import { useState, useEffect } from 'react';
import './CaseSkadi.css';
import { CASE_SKADI_COPY } from '../../content/caseSkadi';

import caseImg1 from '../../assets/images/cases/case1.jpg';
import caseImg2 from '../../assets/images/cases/case2.jpg';
import caseImg3 from '../../assets/images/cases/case3.jpg';

const CASE_IMAGES = [caseImg1, caseImg2, caseImg3];
const AUTOPLAY_MS = 4500;
const SLIDER_ITEMS = [...CASE_IMAGES, CASE_IMAGES[0]];

export default function CaseSkadi({ lang = 'ru' }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [noTransition, setNoTransition] = useState(false);
  const CASE_SKADI = CASE_SKADI_COPY[lang] || CASE_SKADI_COPY.ru;
  const displayIndex = slideIndex % CASE_IMAGES.length;

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i < CASE_IMAGES.length ? i + 1 : i));
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, []);

  const handleTrackTransitionEnd = () => {
    if (slideIndex === CASE_IMAGES.length) {
      setNoTransition(true);
      setSlideIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoTransition(false));
      });
    }
  };

  const goToSlide = (i) => {
    setSlideIndex(i);
  };

  return (
    <section className="case-skadi" id="case">
      <div className="case-skadi__wrap">
        <div className="case-skadi__inner">
          <p className="case-skadi__eyebrow">{CASE_SKADI.eyebrow}</p>
          <h2 className="case-skadi__title">{CASE_SKADI.title}</h2>
          <p className="case-skadi__lead">{CASE_SKADI.lead}</p>
          {CASE_SKADI.body.map((point) => (
            <p key={point} className="case-skadi__body">
              {point}
            </p>
          ))}
          {CASE_SKADI.thesis.map((line) => (
            <p key={line} className="case-skadi__thesis">
              {line}
            </p>
          ))}
        </div>
        <div className="case-skadi__media">
          <div
            className="case-skadi__slider-track"
            style={{
              transform: `translateX(-${slideIndex * 100}%)`,
              transition: noTransition ? 'none' : undefined,
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {SLIDER_ITEMS.map((src, i) => (
              <div key={i} className="case-skadi__slide">
                <img src={src} alt="" className="case-skadi__img" />
              </div>
            ))}
          </div>
          {CASE_IMAGES.length > 1 && (
            <div className="case-skadi__slider-footer">
              <div className="case-skadi__dots" aria-hidden>
                {CASE_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`case-skadi__dot ${i === displayIndex ? 'case-skadi__dot--active' : ''}`}
                    onClick={() => goToSlide(i)}
                    aria-label={lang === 'ru' ? `Слайд ${i + 1}` : `Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
