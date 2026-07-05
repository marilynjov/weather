"use client"

import { useState } from 'react';
import { WeatherTitle } from '@/app/components/WeatherTitle';
import { ColorfulMenu } from '../../components/ColorfulMenu';
import { ForecastScene } from './ForecastScene';
import { Footer } from '@/app/components/Footer';

export default function ForecastPage() {
  const [usedLocation, setUsedLocation] = useState("");
  return (
    <div className="relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
        <ColorfulMenu />
      </div>
      <div className="fixed top-10 right-20 z-50 backdrop-blur-2xl">
        <input id="location" type="text" placeholder="City..." className="w-38 h-10 px-5 rounded-full bg-white/50 text-black shadow-2xl border-white/40 outline-none focus:outline-none"></input>
      </div>
      <div className="w-screen overflow-hidden">
        <ForecastScene onResolved={setUsedLocation} />
      </div>
      <div className="fixed top-13 left-25 z-50">
        <WeatherTitle src="/weather-title.png" alt="My Weather" />
      </div>

      <Footer location={usedLocation} />

    </div>
  );
}
