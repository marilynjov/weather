"use client"

import { useState } from 'react';
import { ColorfulMenu } from '../../components/ColorfulMenu';
import { DailyForecastScene } from './DailyForecastScene';
import { WeatherTitle } from '@/app/components/WeatherTitle';
import { Footer } from '@/app/components/Footer';
import { useI18n } from '@/app/lib/i18n';

export default function DayForecastPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [location, setLocation] = useState("")
  const [usedLocation, setUsedLocation] = useState("")
  return (
    <div className="relative flex flex-col md:block">

      {/* Title — centered in column on mobile, fixed corner on desktop */}
      <div className="flex justify-center pt-6 md:fixed md:top-13 md:left-25 md:z-50 md:pt-0">
        <WeatherTitle src="/weather-title.png" alt="My Weather" />
      </div>

      {/* Menu — self-positioning */}
      <ColorfulMenu />

      {/* City search */}
      <div className="flex justify-center px-6 pb-2 md:fixed md:top-10 md:right-20 md:z-50 md:px-0 md:pb-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLocation(input);
            }
          }}
          placeholder={t("common.city")}
        className="w-full max-w-xs md:w-38 h-10 px-5 rounded-full bg-white/50 text-black shadow-2xl border-white/40 outline-none focus:outline-none"></input>
      </div>

      <div className="w-full overflow-x-hidden">
        <DailyForecastScene query={location} onResolved={setUsedLocation}/>
      </div>

      <Footer location={usedLocation} />

    </div>
  );
}