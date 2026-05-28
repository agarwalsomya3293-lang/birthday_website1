import React from "react";
import { Hero } from "./Hero";
import { MemoriesGallery } from "./MemoriesGallery";
import { Timeline } from "./Timeline";
import { LoveCards } from "./LoveCards";
import { SecretLetter } from "./SecretLetter";
import { MemorySky } from "./MemorySky";
import { Countdown } from "./Countdown";
import { Ending } from "./Ending";

export const HtmlOverlay: React.FC = () => {
  return (
    <div className="w-full">
      {/* We add pointer-events-none to the wrapper to let scroll work on the Canvas, 
          but re-enable pointer-events-auto on interactive sections. */}
      
      <section className="h-screen w-full relative pointer-events-auto">
        <Hero />
      </section>

      <section className="h-screen w-full relative pointer-events-auto">
        <MemoriesGallery />
      </section>

      <section className="h-screen w-full relative pointer-events-auto">
        <Timeline />
      </section>

      <section className="h-screen w-full relative pointer-events-auto">
        <LoveCards />
      </section>

      <section className="h-screen w-full relative pointer-events-auto">
        <SecretLetter />
      </section>

      <section className="h-screen w-full relative pointer-events-auto">
        <MemorySky />
      </section>

      <section className="h-screen w-full relative pointer-events-auto">
        <Countdown />
      </section>

      <section className="h-screen w-full relative pointer-events-auto">
        <Ending />
      </section>
    </div>
  );
};
