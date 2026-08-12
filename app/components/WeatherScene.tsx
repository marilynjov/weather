"use client";

import { useRef, useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { getLocationQuery } from "../lib/location";
import { useI18n } from "../lib/i18n";

// Retry a fetch to ride out transient network blips. A bare "Failed to fetch"
// TypeError means the request never completed (offline moment, blocked, etc.).
async function fetchWithRetry(url: string, attempts = 2): Promise<Response> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetch(url);
    } catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  throw new Error("unreachable");
}

// Match these EXACTLY to your object names in Spline
const ALL_OBJECTS = ["Sun", "Rain", "Cloudy", "SunRain", "Snow", "Storm", "Night"];

// Spline objects that are safe to show at night (no sun baked into the asset).
// Sun, SunRain, Cloudy and Storm all contain a sun, so at night they fall back
// to the moon ("Night"). Add "Storm" here if your Storm asset has no sun.
const NIGHT_ALLOWED = ["Night", "Rain", "Snow"];

export function getObjectFromCode(code: number, isDay: number): string {
  const obj = pickObject(code, isDay);
  // At night, block any sun-bearing object and show the moon instead.
  if (!isDay && !NIGHT_ALLOWED.includes(obj)) return "Night";
  return obj;
}

function pickObject(code: number, isDay: number): string {
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
  // Called with the resolved "City, Country" once weather is fetched
  onResolved?: (location: string) => void;
}
export function WeatherScene({ overrideData, query, onResolved }: WeatherSceneProps) {
  const { t, lang } = useI18n();
  const splineRef = useRef<any>(null);
  // Tracks whether we've ever successfully loaded weather, so a failed search
  // keeps the previous scene instead of resetting to a fallback.
  const hasDataRef = useRef(false);
  const [activeObject, setActiveObject] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The 3D scene is desktop-only; on mobile we skip Spline and just show data.
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    setMounted(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showSpline = mounted && !isMobile;

  useEffect(() => {
    if (overrideData) return;

    async function fetchWeather() {
      try {
        const q = await getLocationQuery(query);
        const res = await fetchWithRetry(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(q)}&lang=${lang}`
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          // WeatherAPI code 1006 = "No matching location found"
          const err: any = new Error(errData?.error?.message ?? "Weather fetch failed");
          err.apiCode = errData?.error?.code;
          throw err;
        }
        const data = await res.json();
        const code: number = data.current.condition.code;
        const isDay: number = data.current.is_day;

        const objectName = getObjectFromCode(code, isDay);
        console.log(
          `Weather @ ${data.location.name} (${data.location.localtime}) →`,
          data.current.condition.text,
          "| code:", code,
          "| is_day:", isDay,
          "| object:", objectName
        );

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
        setError(null);
        hasDataRef.current = true;
        onResolved?.(`${data.location.name}, ${data.location.country}`);
      } catch (err: any) {
        console.error("Weather error:", err.message);
        const notFound = err?.apiCode === 1006;
        setError(notFound ? t("errors.cityNotFound") : t("errors.generic"));
        // Only fall back to a default scene on the very first load; a failed
        // search after we already have weather keeps the current scene.
        if (!hasDataRef.current) setActiveObject("Sun");
      }
    }

    fetchWeather();
  }, [query, overrideData, lang]);

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
    <div className="relative flex w-full flex-col md:block md:h-screen">
      {showSpline && !sceneReady && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <p className="text-white text-lg">{t("common.loading")}</p>
        </div>
      )}

      {weatherData && (isMobile || sceneReady) && (
        <div className="text-shadow-soft relative z-10 order-1 flex flex-col items-center px-6 pt-10 pb-6 text-center md:absolute md:left-0 md:top-0 md:order-none md:h-screen md:items-start md:justify-center md:px-30 md:py-0 md:text-left">


            {/* Location */}
            <p className="text-lg md:text-xl uppercase tracking-widest text-white">{weatherData.city}, {weatherData.country}</p>

            {/* Main temp */}
            <h1 className="text-7xl md:text-9xl font-bold text-white">{Math.round(weatherData.temp)}°C</h1>
            <p className="capitalize text-xl md:text-2xl text-white">{weatherData.description}</p>

            {/* Feels like */}
            <p className="text-lg text-white">{t("weather.feelsLike", { temp: Math.round(weatherData.feelsLike) })}</p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 mt-5 text-base text-white md:justify-start">
            <div>
                <p className="uppercase tracking-wider text-sm text-white">{t("weather.humidity")}</p>
                <p className="text-xl">{weatherData.humidity}%</p>
            </div>
            <div>
                <p className="uppercase tracking-wider text-sm text-white">{t("weather.wind")}</p>
                <p className="text-xl">{weatherData.windKph} km/h {weatherData.windDir}</p>
            </div>
            <div>
                <p className="uppercase tracking-wider text-sm text-white">{t("weather.uv")}</p>
                <p className="text-xl">{weatherData.uv}</p>
            </div>
            </div>

            {/* Local time */}
            <p className="text-sm text-white mt-2">{weatherData.localTime}</p>
        </div>
        )}

      {error && (
        <div className="absolute top-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-red-300/40 bg-red-500/80 px-5 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
          {error}
        </div>
      )}

      {/* 3D scene — desktop only. On mobile it's skipped entirely (Spline's
          camera is framed for wide screens and looks oversized on phones). */}
      {showSpline && (
        <div className="absolute inset-0 z-0 md:h-screen">
          <Spline
            scene="https://prod.spline.design/1v-Ckv8X81GI80su/scene.splinecode"
            onLoad={onLoad}
          />
        </div>
      )}
    </div>
  );
}