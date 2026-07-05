"use client";

import { useEffect, useState } from "react";

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  description: string;
  code: number;
  chanceOfRain: number;
}

// Simple emoji mapping based on condition code
function getWeatherEmoji(code: number, chanceOfRain: number): string {
  if (code === 1000) return "☀️";
  if ([1003, 1006, 1009].includes(code)) return "⛅";
  if ([1030, 1135, 1147, 1036].includes(code)) return "🌫️";
  if ([1063, 1150, 1153, 1168, 1171].includes(code)) return "🌦️";
  if ([1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) return "🌧️";
  if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return "❄️";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈️";
  return "🌤️";
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00"); // noon avoids timezone edge cases
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function ForecastScene({ onResolved }: { onResolved?: (location: string) => void } = {}) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=Bogota&days=7`
        );
        if (!res.ok) throw new Error("Forecast fetch failed");
        const data = await res.json();

        setCity(`${data.location.name}, ${data.location.country}`);
        onResolved?.(`${data.location.name}, ${data.location.country}`);

        const days: ForecastDay[] = data.forecast.forecastday.map((day: any) => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          description: day.day.condition.text,
          code: day.day.condition.code,
          chanceOfRain: day.day.daily_chance_of_rain,
        }));

        setForecast(days);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-white opacity-60">Loading forecast...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen px-20 py-20 text-white">
      
      {/* Header */}
      <div className="mb-8 py-5">
        <h1 className="text-4xl font-bold">{city}</h1>
      </div>

      {/* Forecast rows */}
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {forecast.map((day, i) => (
          <div
            key={day.date}
            className="flex items-center justify-between px-6 py-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
          >
            {/* Day name */}
            <span className="w-28 font-medium text-lg">
              {getDayName(day.date)}
            </span>

            {/* Emoji + description */}
            <div className="flex items-center gap-3 flex-1 px-4">
              <span className="text-2xl">{getWeatherEmoji(day.code, day.chanceOfRain)}</span>
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
          </div>
        ))}
      </div>

      {/* Note if only 3 days returned (free plan) */}
      {forecast.length < 7 && (
        <p className="text-xs opacity-30 text-center mt-4">
          {forecast.length}-day forecast (free plan limit)
        </p>
      )}
    </div>
  );
}