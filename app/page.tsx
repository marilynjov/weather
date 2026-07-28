"use client"
import { useState } from "react";
import { ColorfulMenu } from "./components/ColorfulMenu";
import { WeatherScene } from "./components/WeatherScene";
import { WeatherTitle } from "./components/WeatherTitle";
import { Footer } from "./components/Footer";
import { useI18n } from "./lib/i18n";

export default function Page() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [location, setLocation] = useState("");
  const [usedLocation, setUsedLocation] = useState("");
  return (
    <div className="relative">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
        <ColorfulMenu />
      </div>
      <div className="fixed top-10 right-20 z-50 backdrop-blur-2xl">
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
        className="w-38 h-10 px-5 rounded-full bg-white/50 text-black shadow-2xl border-white/40 outline-none focus:outline-none"></input>
      </div>
      <div className="w-screen overflow-hidden">
        <WeatherScene query={location} onResolved={setUsedLocation}/>
      </div>
      <div className="fixed top-13 left-25 z-50">
        <WeatherTitle src="/weather-title.png" alt="My Weather" />
      </div>

      <Footer location={usedLocation} />
    </div>
  );
}