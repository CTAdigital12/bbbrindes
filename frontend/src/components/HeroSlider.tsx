"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { img } from "@/lib/asset";
import { WA, type HeroSlide } from "@/data/home-joy";

// Slider do hero (identidade Joy): autoplay 6s, dots com barra de progresso,
// setas prev/next e troca de tema dark/cream por slide (classe cream-on no
// slider). Espelha slShow/slStep/countdown de autoplay do mockup. Pausa no
// hover. prefers-reduced-motion e tratado pelo joy.css.
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (i: number) => setIdx(((i % n) + n) % n);
  const step = (d: number) => setIdx((p) => (((p + d) % n) + n) % n);

  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  const creamOn = slides[idx]?.theme === "cream";

  return (
    <div
      className={`slider${creamOn ? " cream-on" : ""}${paused ? " paused" : ""}`}
      id="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((m, i) => (
        <div className={`slide ${m.theme}${i === idx ? " on" : ""}`} key={m.key}>
          <picture>
            <source
              media="(max-width:760px)"
              srcSet={img(`/img/banners/home-hero-mobile-${m.key}.webp`)}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bg" src={img(`/img/banners/home-hero-${m.key}.webp`)} alt="" />
          </picture>
          <div className="ov anim">
            <span className="tag">
              <Icon name={m.icon} />
              {m.tag}
            </span>
            <h2 dangerouslySetInnerHTML={{ __html: m.title }} />
            <p dangerouslySetInnerHTML={{ __html: m.sub }} />
            <div className="ctas">
              <Link className="btn btn-cta" href={m.href}>
                {m.cta}
                <Icon name="arrow-right" />
              </Link>
              <a
                className={`btn ${m.theme === "cream" ? "btn-ghost" : "btn-ghost-w"}`}
                href={WA}
                target="_blank"
                rel="noopener"
              >
                <Icon name="brand-whatsapp" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      ))}

      <div className="sl-nav">
        {slides.map((m, i) => (
          <button
            key={m.key}
            className={i === idx ? "on" : ""}
            onClick={() => go(i)}
            aria-label={`Banner ${i + 1}`}
          >
            <i />
          </button>
        ))}
      </div>

      <div className="sl-arrows">
        <button onClick={() => step(-1)} aria-label="Anterior">
          <Icon name="chevron-left" />
        </button>
        <button onClick={() => step(1)} aria-label="Próximo">
          <Icon name="chevron-right" />
        </button>
      </div>
    </div>
  );
}
