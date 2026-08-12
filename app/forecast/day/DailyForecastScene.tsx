"use client";

import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { WeatherScene, getObjectFromCode } from "../../components/WeatherScene";
import { getLocationQuery } from "../../lib/location";
import { useI18n } from "../../lib/i18n";


function getWeatherEmoji(code: number, isDay: number = 1): string {
  const night = !isDay;
  if (code === 1000) return night ? "🌙" : "☀️";                       // clear: moon at night
  if ([1003, 1006, 1009].includes(code)) return night ? "☁️" : "⛅";  // cloudy: no sun at night
  if ([1030, 1135, 1147, 1036].includes(code)) return "🌫️";
  if ([1063, 1150, 1153, 1168, 1171].includes(code)) return night ? "🌧️" : "🌦️"; // patchy rain
  if ([1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) return "🌧️";
  if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return "❄️";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈️";
  return night ? "☁️" : "🌤️";                                        // fallback: cloud at night
}

interface HourSlot {
  time: string;       
  temp: number;
  code: number;
  isDay: number;
  rain: number;      
  windKph: number;
  windDir: string;
  objectName: string;
}

const ALL_OBJECTS = ["Sun", "Rain", "Cloudy", "SunRain", "Snow", "Storm", "Night"];

export function DailyForecastScene({ query, onResolved }:{query?: string; onResolved?: (location: string) => void}) {
  const { t, lang } = useI18n();
  const [hours, setHours] = useState<HourSlot[]>([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Which timeline edges have hidden chips → only fade those sides
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  // Spline
  const splineRef = useRef<any>(null);
  const [sceneReady, setSceneReady] = useState(false);

  // Drag state
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Fetch hourly data
  useEffect(() => {
    async function fetchHourly() {
      try {
        const q = await getLocationQuery(query);
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(q)}&days=1&lang=${lang}`
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

        const rawHours = data.forecast.forecastday[0].hour;
        const slots: HourSlot[] = rawHours.map((h: any) => {
          const code = h.condition.code;
          const isDay = h.is_day;
          return {
            time: h.time.split(" ")[1],     // "2026-06-13 14:00" → "14:00"
            temp: h.temp_c,
            code,
            isDay,
            rain: h.chance_of_rain,
            windKph: h.wind_kph,
            windDir: h.wind_dir,
            objectName: getObjectFromCode(code, isDay),
          };
        });

        setHours(slots);

        // Start at current hour
        const currentHour = new Date().getHours();
        setActiveIndex(Math.min(currentHour, slots.length - 1));
      } catch (err: any) {
        const notFound = err?.apiCode === 1006;
        setError(notFound ? t("errors.cityNotFound") : t("errors.generic"));
      } finally {
        setLoading(false);
      }
    }
    fetchHourly();
  }, [query, lang]);

  // Apply correct Spline object when active slot or scene changes
  useEffect(() => {
    if (sceneReady && splineRef.current && hours[activeIndex]) {
      applyWeather(splineRef.current, hours[activeIndex].objectName);
    }
  }, [sceneReady, activeIndex, hours]);

  // Scroll timeline to active index
  useEffect(() => {
    if (!trackRef.current || hours.length === 0) return;
    const slotWidth = 100; // px, matches w-24 below
    trackRef.current.scrollTo({
      left: activeIndex * slotWidth - trackRef.current.clientWidth / 2 + slotWidth / 2,
      behavior: "smooth",
    });
  }, [activeIndex]);

  // Track whether each edge has hidden chips so we only fade scrollable sides
  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    });
  }

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [hours]);

  function applyWeather(splineApp: any, targetName: string) {
    ALL_OBJECTS.forEach((name) => {
      const obj = splineApp.findObjectByName(name);
      if (!obj) return;
      obj.visible = name === targetName;
      if (name === targetName) {
        obj.traverse?.((child: any) => { child.visible = true; });
        obj.emitEvent("start");
      } else {
        obj.traverse?.((child: any) => { child.visible = false; });
      }
    });
  }

  function onSplineLoad(splineApp: any) {
    splineRef.current = splineApp;
    setSceneReady(true);
  }

  // Drag handlers
  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }

  function onMouseUp() { isDragging.current = false; }

  // Touch handlers
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!trackRef.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }

  const active = hours[activeIndex];

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-white text-lg">
      {t("common.loading")}
    </div>
  );

  // Only take over the whole screen if we've never loaded any data.
  if (error && hours.length === 0) return (
    <div className="flex items-center justify-center h-screen text-red-400">
      {error}
    </div>
  );

  return (
    <div className="relative flex flex-col text-white md:h-screen">

      {/* Non-blocking error badge (e.g. city not found) — keeps the current day */}
      {error && (
        <div className="absolute top-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-red-300/40 bg-red-500/80 px-5 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
          {error}
        </div>
      )}

      {/* WeatherScene takes the full screen and updates with active hour */}
      <div className="relative md:flex-1">
        {active && (
          <WeatherScene
            overrideData={{
              temp: active.temp,
              feelsLike: active.temp,        // hourly API doesn't return feelslike, use temp as fallback
              description: t(`obj.${active.objectName}`),
              code: active.code,
              isDay: active.isDay,
              humidity: 0,                   // not in hourly slot — add if you want
              windKph: active.windKph,
              windDir: active.windDir,
              uv: 0,
              city,
              country: "",
              localTime: active.time,
            }}
          />
        )}
      </div>

      {/* Timeline — in the column on mobile, pinned to the bottom on desktop */}
      <div className="text-shadow-soft relative py-6 md:absolute md:bottom-6 md:py-0 left-0 right-0 px-4 z-50">
        <p className="text-shadow-soft text-sm uppercase tracking-widest text-white mb-3 px-2">
          {t("daily.drag")}
        </p>
        <div
          ref={trackRef}
          className="flex gap-2 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{
            scrollbarWidth: "none",
            // Fade only the sides that still have hidden chips (not the true start/end)
            WebkitMaskImage: `linear-gradient(to right, ${edges.atStart ? "black" : "transparent"} 0, black 6%, black 94%, ${edges.atEnd ? "black" : "transparent"} 100%)`,
            maskImage: `linear-gradient(to right, ${edges.atStart ? "black" : "transparent"} 0, black 6%, black 94%, ${edges.atEnd ? "black" : "transparent"} 100%)`,
          }}
          onScroll={updateEdges}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          {hours.map((slot, i) => (
            <button
              key={slot.time}
              onClick={() => setActiveIndex(i)}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl flex-shrink-0 transition-all duration-300"
              style={{
                width: "88px",
                background: i === activeIndex ? "rgba(31,109,146,0.78)" : "rgba(31,109,146,0.42)",
                border: i === activeIndex ? "1px solid rgba(255,255,255,0.75)" : "1px solid rgba(255,255,255,0.30)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <span className="text-sm text-white">{slot.time}</span>
              <span className="text-xl">{getWeatherEmoji(slot.code, slot.isDay)}</span>
              <span className="text-base font-bold text-white">{Math.round(slot.temp)}°</span>
              {slot.rain > 0 && <span className="text-xs text-white">💧{slot.rain}%</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}