"use client";

import { useRef, useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { getLocationQuery } from "../lib/location";

// Match these EXACTLY to your object names in Spline
const ALL_OBJECTS = ["Sun", "Rain", "Cloudy", "SunRain", "Snow", "Storm", "Night"];

export function getObjectFromCode(code: number, isDay: number): string {
  // Clear — depends on day or night
  if (code === 1000) return isDay ? "Sun" : "Night";

  // Cloudy (same day or night, clouds hide the difference)
  if ([1003, 1006, 1009].includes(code)) return "Cloudy";
  if ([1030, 1135, 1147].includes(code)) return "Cloudy";

  // SunRain only makes sense during the day, at night just show Rain
  if ([1063, 1150, 1153, 1168, 1171].includes(code)) return isDay ? "SunRain" : "Rain";

  // Rain
  if ([1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) return "Rain";

  // Snow
  if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return "Snow";

  // Storm
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "Storm";

  if ([1030, 1135, 1147, 1036].includes(code)) return isDay ? "Cloudy" : "Night";


  return isDay ? "Sun" : "Night"; // fallback
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  code: number;
  humidity: number;
  windKph: number;
  windDir: string;
  uv: number;
  city: string;
  country: string;
  localTime: string;
  isDay: number;
}

interface WeatherSceneProps {
  // If provided, skips fetching and uses this data directly
  overrideData?: Partial<WeatherData>;
  query?: string;
}
export function WeatherScene({ overrideData, query }: WeatherSceneProps) {
  const splineRef = useRef<any>(null);
  const [activeObject, setActiveObject] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (overrideData) return;

    async function fetchWeather() {
      try {
        const q = await getLocationQuery(query);
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(q)}`
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error?.message ?? "Weather fetch failed");
        }
        const data = await res.json();
        console.log("Weather condition code:", data.current.condition.code, "|", data.current.condition.text);  // ADD THIS
        const code: number = data.current.condition.code;
        const isDay: number = data.current.is_day;

        const objectName = getObjectFromCode(code, isDay);

        setWeatherData({
            temp: data.current.temp_c,
            feelsLike: data.current.feelslike_c,
            description: data.current.condition.text,
            code,
            isDay,
            humidity: data.current.humidity,
            windKph: data.current.wind_kph,
            windDir: data.current.wind_dir,
            uv: data.current.uv,
            city: data.location.name,
            country: data.location.country,
            localTime: data.location.localtime,
        });
        setActiveObject(objectName);
      } catch (err: any) {
        console.error("Weather error:", err.message);
        setError(err.message ?? "Could not load weather.");
        setActiveObject("Sun");
      }
    }

    fetchWeather();
  }, [query, overrideData]);

  useEffect(() => {
    if (!overrideData) return;
    const merged: WeatherData = {
      temp: 0, feelsLike: 0, description: "", code: 1000, isDay: 1,
      humidity: 0, windKph: 0, windDir: "", uv: 0,
      city: "", country: "", localTime: "",
      ...overrideData,
    };
    setWeatherData(merged);
    setActiveObject(getObjectFromCode(merged.code, merged.isDay));
  }, [query, overrideData]);

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

    setTimeout(() => {
        setSceneReady(true);
    }, 500);
    }

  return (
    <div className="relative w-screen h-screen">
      {!sceneReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <p className="text-white text-lg">Loading...</p>
        </div>
      )}

      {weatherData && sceneReady && (
        <div className="absolute left-0 top-0 z-10 h-screen flex flex-col justify-center px-30">

            
            {/* Location */}
            <p className="text-lg uppercase tracking-widest opacity-70">{weatherData.city}, {weatherData.country}</p>
            
            {/* Main temp */}
            <h1 className="text-8xl font-bold">{Math.round(weatherData.temp)}°C</h1>
            <p className="capitalize text-xl opacity-80">{weatherData.description}</p>
            
            {/* Feels like */}
            <p className="text-base opacity-60">Feels like {Math.round(weatherData.feelsLike)}°C</p>

            {/* Stats row */}
            <div className="flex gap-6 mt-4 text-sm opacity-70">
            <div>
                <p className="uppercase tracking-wider text-xs opacity-60">Humidity</p>
                <p className="text-lg">{weatherData.humidity}%</p>
            </div>
            <div>
                <p className="uppercase tracking-wider text-xs opacity-60">Wind</p>
                <p className="text-lg">{weatherData.windKph} km/h {weatherData.windDir}</p>
            </div>
            <div>
                <p className="uppercase tracking-wider text-xs opacity-60">UV Index</p>
                <p className="text-lg">{weatherData.uv}</p>
            </div>
            </div>

            {/* Local time */}
            <p className="text-xs opacity-40 mt-2">{weatherData.localTime}</p>
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