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
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{t("about.title")}</h1>
          <p className="mt-6 text-lg leading-relaxed opacity-90">
            {t("about.intro")}
          </p>
        </motion.div>

        <div className="mt-14 grid w-full max-w-3xl gap-5 sm:grid-cols-3">
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
                <h2 className="text-lg font-semibold">{t(item.titleKey)}</h2>
                <p className="mt-2 text-sm leading-relaxed opacity-90">
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
          className="mt-14 text-sm uppercase tracking-widest opacity-60"
        >
          {t("about.madeWith")}
        </motion.p>
      </div>
      <div className="fixed top-13 left-25 z-50">
        <WeatherTitle src="/weather-title.png" alt="My Weather" />
      </div>
      <Footer location={t("footer.notUsedHere")} />
      
    </div>
  );
}
