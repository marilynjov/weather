"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";


export function WeatherTitle({
  src = "/weather-title.png",
  alt = "My Weather",
}: {
  src?: string;
  alt?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance: inflate in and drop with a bounce
      gsap.set(imgRef.current, { opacity: 0, scale: 0.6, y: -40, rotateX: 60 });

      const tl = gsap.timeline({ delay: 0.3, onComplete: floatImage });
      tl.to(imgRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: "elastic.out(1, 0.6)",
      });

      // After landing, drift and wobble forever like a tethered balloon
      function floatImage() {
        gsap.to(imgRef.current, {
          y: "-=12",
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(imgRef.current, {
          rotation: 2,
          rotateY: 6,
          transformOrigin: "50% 120%", // pivot below, like hanging from a string
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none select-none"
      style={{ perspective: "800px" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="h-auto w-64 max-w-[70vw]"
        style={{ transformStyle: "preserve-3d" }}
      />
    </div>
  );
}
