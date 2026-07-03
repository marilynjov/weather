"use client";

import { ColorfulMenu } from "../components/ColorfulMenu";
import { motion } from "framer-motion";
import { Boxes, Atom, Triangle } from "lucide-react";
import { WeatherTitle } from "../components/WeatherTitle";

const tech = [
  {
    icon: Atom,
    title: "React & Next.js",
    description:
      "Built with React and the Next.js App Router, using client components and hooks to fetch live weather data.",
  },
  {
    icon: Boxes,
    title: "Spline Animations",
    description:
      "The interactive 3D weather scenes are designed in Spline and react to real conditions — sun, rain, snow, storms and night.",
  },
  {
    icon: Triangle,
    title: "Deployed on Vercel",
    description:
      "Continuously deployed to Vercel, so every push ships straight to production.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden text-white">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
        <ColorfulMenu />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="max-w-2xl text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">About</h1>
          <p className="mt-6 text-lg leading-relaxed opacity-90">
            This is a personal React project — a playful weather app that pairs
            live forecasts with animated 3D scenes. It was a chance to explore
            Spline animations and modern Next.js together.
          </p>
        </motion.div>

        <div className="mt-14 grid w-full max-w-3xl gap-5 sm:grid-cols-3">
          {tech.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="rounded-3xl border border-white/40 bg-white/20 p-6 text-left shadow-2xl backdrop-blur-2xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-white/30 p-3">
                  <Icon className="size-6" />
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed opacity-90">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 text-sm uppercase tracking-widest opacity-60"
        >
          Made with React · Next.js · Spline · Vercel
        </motion.p>
      </div>
      <div className="fixed top-13 left-25 z-50">
        <WeatherTitle src="/weather-title.png" alt="My Weather" />
      </div>
    </div>
  );
}
