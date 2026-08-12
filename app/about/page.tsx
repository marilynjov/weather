"use client";

import { ColorfulMenu } from "../components/ColorfulMenu";
import { motion } from "framer-motion";
import { Boxes, Atom, Triangle } from "lucide-react";
import { WeatherTitle } from "../components/WeatherTitle";
import { Footer } from "../components/Footer";
import { useI18n } from "../lib/i18n";

const tech = [
  { icon: Atom, titleKey: "about.reactTitle", descKey: "about.reactDesc" },
  { icon: Boxes, titleKey: "about.splineTitle", descKey: "about.splineDesc" },
  { icon: Triangle, titleKey: "about.vercelTitle", descKey: "about.vercelDesc" },
];

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-white md:block">

      {/* Title — centered in column on mobile, fixed corner on desktop */}
      <div className="flex justify-center pt-6 md:fixed md:top-13 md:left-25 md:z-50 md:pt-0">
        <WeatherTitle src="/weather-title.png" alt="My Weather" />
      </div>

      {/* Menu — self-positioning */}
      <ColorfulMenu />

      <div className="flex flex-col items-center justify-center px-6 py-16 md:min-h-screen md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-shadow-soft max-w-2xl text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{t("about.title")}</h1>
          <p className="mt-6 text-xl leading-relaxed text-white">
            {t("about.intro")}
          </p>
        </motion.div>

        <div className="text-shadow-soft mt-14 grid w-full max-w-3xl gap-5 sm:grid-cols-3">
          {tech.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.titleKey}
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
                <h2 className="text-xl font-semibold text-white">{t(item.titleKey)}</h2>
                <p className="mt-2 text-base leading-relaxed text-white">
                  {t(item.descKey)}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-shadow-soft mt-14 text-base uppercase tracking-widest text-white"
        >
          {t("about.madeWith")}
        </motion.p>
      </div>
      <Footer location={t("footer.notUsedHere")} />
      
    </div>
  );
}
