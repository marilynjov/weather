"use client";

import { useRef, useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";

// Match these EXACTLY to your object names in Spline
const ALL_OBJECTS = ["Sun", "Rain", "Cloud", "Snow", "Storm"];

// WeatherAPI condition codes → your Spline object name
// Full code list: https://www.weatherapi.com/docs/weather_conditions.json
function getObjectFromCode(code: number): string {
  if (code === 1000) return "Sun";                          // Sunny / Clear
  if ([1003, 1006, 1009].includes(code)) return "Cloud";   // Partly/Mostly/Overcast
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return "Rain";
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return "Snow";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "Storm"; // Thunderstorm
  if ([1030, 1135, 1147].includes(code)) return "Cloud";   // Mist/Fog → Cloud
  return "Sun"; // fallback
}

interface WeatherData {
  temp: number;
  description: string;
  code: number;
}

export default function WeatherScene() {
  const splineRef = useRef<any>(null);
  const [activeObject, setActiveObject] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=Bogota`
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error?.message ?? "Weather fetch failed");
        }
        const data = await res.json();
        const code: number = data.current.condition.code;
        const objectName = getObjectFromCode(code);

        setWeatherData({
          temp: data.current.temp_c,
          description: data.current.condition.text,
          code,
        });
        setActiveObject(objectName);
      } catch (err: any) {
        console.error("Weather error:", err.message);
        setError(err.message ?? "Could not load weather.");
        setActiveObject("Sun");
      }
    }

    fetchWeather();
  }, []);

  useEffect(() => {
    if (sceneReady && activeObject && splineRef.current) {
      applyWeather(splineRef.current, activeObject);
    }
  }, [sceneReady, activeObject]);

  function applyWeather(splineApp: any, targetName: string) {
    ALL_OBJECTS.forEach((name) => {
      const obj = splineApp.findObjectByName(name);
      if (!obj) {
        console.warn(`Spline object "${name}" not found — check the name in Spline editor`);
        return;
      }
      if (name === targetName) {
        obj.visible = true;
        obj.emitEvent("start");
      } else {
        obj.visible = false;
      }
    });
  }

  function onLoad(splineApp: any) {
    splineRef.current = splineApp;
    setSceneReady(true);
  }

  return (
    <div className="relative w-screen h-screen">
      {!sceneReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <p className="text-white text-lg">Loading...</p>
        </div>
      )}

      {weatherData && sceneReady && (
        <div className="absolute top-5 left-5 z-10 text-white drop-shadow-lg">
          <h1 className="text-6xl font-bold">{Math.round(weatherData.temp)}°C</h1>
          <p className="capitalize mt-1">{weatherData.description}</p>
        </div>
      )}

      {error && (
        <p className="absolute top-5 left-5 z-10 text-red-400">{error}</p>
      )}

      <Spline
        scene="https://prod.spline.design/1v-Ckv8X81GI80su/scene.splinecode"
        onLoad={onLoad}
      />
    </div>
  );
}