"use client";

import { useEffect, useState } from "react";
import { useI18n, type Lang } from "../../lib/i18n";
import { getLocationQuery } from "../../lib/location";

interface HourSlot {
  time: string;
  temp: number;
  code: number;
  isDay: number;
  rain: number;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  description: string;
  code: number;
  chanceOfRain: number;
  hours: HourSlot[];
}

// Emoji mapping based on condition code; swaps sun-bearing icons at night.
function getWeatherEmoji(code: number, isDay: number = 1): string {
  const night = !isDay;
  if (code === 1000) return night ? "🌙" : "☀️";
  if ([1003, 1006, 1009].includes(code)) return night ? "☁️" : "⛅";
  if ([1030, 1135, 1147, 1036].includes(code)) return "🌫️";
  if ([1063, 1150, 1153, 1168, 1171].includes(code)) return night ? "🌧️" : "🌦️";
  if ([1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) return "🌧️";
  if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return "❄️";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈️";
  return night ? "☁️" : "🌤️";
}

function getDayName(
  dateStr: string,
  t: (key: string) => string,
  lang: Lang
): string {
  const date = new Date(dateStr + "T12:00:00"); // noon avoids timezone edge cases
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return t("week.today");
  if (date.toDateString() === tomorrow.toDateString()) return t("week.tomorrow");
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    weekday: "long",
  });
}

export function ForecastScene({ query, onResolved }: {query?: string; onResolved?: (location: string) => void } = {}) {
  const { t, lang } = useI18n();
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const q = await getLocationQuery(query);
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(q)}&days=7&lang=${lang}`
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const err: any = new Error(errData?.error?.message ?? "Forecast fetch failed");
          err.apiCode = errData?.error?.code; // 1006 = no matching location
          throw err;
        }
        const data = await res.json();
        setError(null);

        setCity(`${data.location.name}, ${data.location.country}`);
        onResolved?.(`${data.location.name}, ${data.location.country}`);

        const days: ForecastDay[] = data.forecast.forecastday.map((day: any) => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          description: day.day.condition.text,
          code: day.day.condition.code,
          chanceOfRain: day.day.daily_chance_of_rain,
          hours: day.hour.map((h: any) => ({
            time: h.time.split(" ")[1], // "2026-07-28 14:00" → "14:00"
            temp: h.temp_c,
            code: h.condition.code,
            isDay: h.is_day,
            rain: h.chance_of_rain,
          })),
        }));

        setForecast(days);
      } catch (err: any) {
        const notFound = err?.apiCode === 1006;
        setError(notFound ? t("errors.cityNotFound") : t("errors.generic"));
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, [query, lang]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-white opacity-60">{t("week.loading")}</p>
    </div>
  );

  // Only take over the whole screen if we've never loaded any forecast.
  if (error && forecast.length === 0) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="relative flex flex-col h-screen px-20 py-20 text-white">

      {/* Non-blocking error badge (e.g. city not found) — keeps the current forecast */}
      {error && (
        <div className="absolute top-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-red-300/40 bg-red-500/80 px-5 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 py-8">
        <h1 className="text-4xl font-bold">{city}</h1>
        <p className="mt-1 text-xs uppercase tracking-widest opacity-40">{t("week.tapHint")}</p>
      </div>

      {/* Forecast rows */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {forecast.map((day) => {
          const open = expandedDate === day.date;
          return (
            <div key={day.date}>
              <button
                onClick={() => setExpandedDate(open ? null : day.date)}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl transition hover:brightness-105"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
              >
                {/* Day name */}
                <span className="w-28 text-left font-medium text-lg">
                  {getDayName(day.date, t, lang)}
                </span>

                {/* Emoji + description */}
                <div className="flex items-center gap-3 flex-1 px-4">
                  <span className="text-2xl">{getWeatherEmoji(day.code)}</span>
                  <span className="text-sm opacity-60 capitalize">{day.description}</span>
                </div>

                {/* Rain chance */}
                {day.chanceOfRain > 0 && (
                  <span className="text-sm opacity-50 w-16 text-right">
                    💧 {day.chanceOfRain}%
                  </span>
                )}

                {/* Temp range */}
                <div className="flex gap-2 text-right w-24 justify-end">
                  <span className="font-bold">{Math.round(day.maxTemp)}°</span>
                  <span className="opacity-40">{Math.round(day.minTemp)}°</span>
                </div>

                {/* Expand indicator */}
                <span className={`ml-3 text-xs opacity-50 transition-transform ${open ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {/* Hourly strip for the selected day */}
              {open && (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
                  {day.hours.map((h) => (
                    <div
                      key={h.time}
                      className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 flex-shrink-0"
                      style={{ width: "68px", background: "rgba(255,255,255,0.06)" }}
                    >
                      <span className="text-xs opacity-50">{h.time}</span>
                      <span className="text-lg">{getWeatherEmoji(h.code, h.isDay)}</span>
                      <span className="text-sm font-bold">{Math.round(h.temp)}°</span>
                      {h.rain > 0 && <span className="text-[10px] opacity-40">💧{h.rain}%</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}