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
      <p className="text-white text-lg">{t("week.loading")}</p>
    </div>
  );

  // Only take over the whole screen if we've never loaded any forecast.
  if (error && forecast.length === 0) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="relative flex flex-col px-6 py-10 text-white md:h-screen md:px-20 md:py-20">

      {/* Non-blocking error badge (e.g. city not found) — keeps the current forecast */}
      {error && (
        <div className="absolute top-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-red-300/40 bg-red-500/80 px-5 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="text-shadow-soft mb-8 py-8">
        <h1 className="text-5xl font-bold text-white">{city}</h1>
        <p className="mt-1 text-sm uppercase tracking-widest text-white">{t("week.tapHint")}</p>
      </div>

      {/* Forecast rows */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {forecast.map((day) => {
          const open = expandedDate === day.date;
          return (
            <div key={day.date}>
              <button
                onClick={() => setExpandedDate(open ? null : day.date)}
                className="w-full flex items-center justify-between px-4 py-4 rounded-2xl transition hover:brightness-110 md:px-6"
                style={{
                  background: "rgba(31,109,146,0.42)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              >
                {/* Day name */}
                <span className="w-16 shrink-0 text-left text-base font-medium text-white md:w-28 md:text-xl">
                  {getDayName(day.date, t, lang)}
                </span>

                {/* Emoji + description */}
                <div className="flex min-w-0 flex-1 items-center gap-2 px-2 md:gap-3 md:px-4">
                  <span className="text-3xl">{getWeatherEmoji(day.code)}</span>
                  <span className="truncate text-base capitalize text-white hidden sm:inline">{day.description}</span>
                </div>

                {/* Rain chance */}
                {day.chanceOfRain > 0 && (
                  <span className="hidden text-base text-white w-16 text-right sm:inline">
                    💧 {day.chanceOfRain}%
                  </span>
                )}

                {/* Temp range */}
                <div className="flex shrink-0 gap-2 text-right w-20 justify-end text-lg md:w-24">
                  <span className="font-bold text-white">{Math.round(day.maxTemp)}°</span>
                  <span className="text-white">{Math.round(day.minTemp)}°</span>
                </div>

                {/* Expand indicator */}
                <span className={`ml-3 text-sm text-white transition-transform ${open ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {/* Hourly strip for the selected day */}
              {open && (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
                  {day.hours.map((h) => (
                    <div
                      key={h.time}
                      className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl flex-shrink-0 transition-all duration-300"
                      style={{
                        width: "88px",
                        background: "rgba(31,109,146,0.42)",
                        border: "1px solid rgba(255,255,255,0.30)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                      }}
                    >
                      <span className="text-sm text-white">{h.time}</span>
                      <span className="text-xl">{getWeatherEmoji(h.code, h.isDay)}</span>
                      <span className="text-base font-bold text-white">{Math.round(h.temp)}°</span>
                      {h.rain > 0 && <span className="text-xs text-white">💧{h.rain}%</span>}
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