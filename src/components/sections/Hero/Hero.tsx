import type { HeroProps } from "./Hero.types";
import { HeroPill } from "./components/HeroPill";
import { HeroButton } from "./components/HeroButton";

import bonotechHeroBg1 from "@/assets/bonotech-hero-bg-1.png";

export function Hero({
  pillText = "POWERED BY SPEED",
  title = "Enterprise\nSoftware Development",
  subtitle = "AI- Native, Expert-Led, Market-Ready Product Development",
  ctaLabel = "Book a free consultation with us today",
  ctaHref = "#contact",
}: HeroProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[823px] w-full overflow-hidden bg-[#020914] text-white max-lg:min-h-[720px] max-sm:min-h-[680px]"
    >
      <img
        src={bonotechHeroBg1}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.12)_43%,rgba(0,0,0,0)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[823px] w-full max-w-[1200px] flex-col justify-center px-0 pt-[122px] max-xl:px-6 max-lg:min-h-[720px] max-lg:items-center max-lg:text-center max-sm:min-h-[680px] max-sm:px-5 max-sm:pt-24">
        <div className="mt-[64px] flex max-w-[980px] flex-col items-start max-lg:mt-0 max-lg:items-center">
          {/* <HeroPill text={pillText} /> */}

          <h1
            id="hero-heading"
            className="mt-[20px] whitespace-pre-line font-display text-[80px] font-semibold leading-[1.15] tracking-[0] text-white max-lg:text-[64px] max-sm:text-[44px]"
          >
            {title}
          </h1>

          <p className="mt-[10px] font-body text-[18px] font-normal leading-[1.5] tracking-[0] text-white max-sm:text-[16px]">
            {subtitle}
          </p>

          <div className="mt-[33px]">
            <HeroButton label={ctaLabel} href={ctaHref} />
          </div>
        </div>
      </div>
    </section>
  );
}
