"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "es";

// Flat key → string dictionaries. Use {var} placeholders for interpolation.
const DICT: Record<Lang, Record<string, string>> = {
  en: {
    "nav.home": "Weather",
    "nav.forecast": "Forecast",
    "nav.about": "About",
    "nav.day-forecast": "Day",
    "nav.week-forecast": "Week",

    "common.loading": "Loading...",
    "common.city": "City...",
    "errors.cityNotFound": "City not found — try another search.",
    "errors.generic": "Couldn't load weather. Please try again.",

    "weather.feelsLike": "Feels like {temp}°C",
    "weather.humidity": "Humidity",
    "weather.wind": "Wind",
    "weather.uv": "UV Index",

    "daily.drag": "Drag to explore the day",

    "week.loading": "Loading forecast...",
    "week.today": "Today",
    "week.tomorrow": "Tomorrow",
    "week.tapHint": "Tap a day to see it hour by hour",

    "footer.brandDesc": "A personal project built with React, Next.js & Spline.",
    "footer.objectsMadeByMe": "3D objects made by me",
    "footer.thisSession": "This session",
    "footer.date": "Date:",
    "footer.locationUsed": "Location used:",
    "footer.detecting": "Detecting…",
    "footer.notUsedHere": "Not used on this page",
    "footer.privacyFeedback": "Privacy & feedback",
    "footer.privacyPolicy": "Privacy policy",
    "footer.sendFeedback": "Send feedback",
    "footer.connect": "Connect",
    "footer.privacyTitle": "Location & privacy",
    "footer.privacyBody":
      "To show local weather, this site requests your approximate location. If you allow it, your browser shares GPS coordinates; if you don't, an IP-based estimate is used instead. Your coordinates are sent only to WeatherAPI to fetch the forecast — they are never stored on our servers, saved, or shared with anyone else. You can revoke location access at any time in your browser settings.",
    "footer.rights": "Weather data by WeatherAPI",

    "about.title": "About",
    "about.intro":
      "This is a personal React project — a playful weather app that pairs live forecasts with animated 3D scenes. It was a chance to explore Spline animations and modern Next.js together.",
    "about.reactTitle": "React & Next.js",
    "about.reactDesc":
      "Built with React and the Next.js App Router, using client components and hooks to fetch live weather data.",
    "about.splineTitle": "Spline Animations",
    "about.splineDesc":
      "The interactive 3D weather scenes are designed in Spline and react to real conditions — sun, rain, snow, storms and night.",
    "about.vercelTitle": "Deployed on Vercel",
    "about.vercelDesc":
      "Continuously deployed to Vercel, so every push ships straight to production.",
    "about.madeWith": "Made with React · Next.js · Spline · Vercel",
  },
  es: {
    "nav.home": "Clima",
    "nav.forecast": "Pronóstico",
    "nav.about": "Acerca de",
    "nav.day-forecast": "Día",
    "nav.week-forecast": "Semana",

    "common.loading": "Cargando...",
    "common.city": "Ciudad...",
    "errors.cityNotFound": "Ciudad no encontrada — prueba otra búsqueda.",
    "errors.generic": "No se pudo cargar el clima. Inténtalo de nuevo.",

    "weather.feelsLike": "Sensación de {temp}°C",
    "weather.humidity": "Humedad",
    "weather.wind": "Viento",
    "weather.uv": "Índice UV",

    "daily.drag": "Arrastra para explorar el día",

    "week.loading": "Cargando pronóstico...",
    "week.today": "Hoy",
    "week.tomorrow": "Mañana",
    "week.tapHint": "Toca un día para verlo hora por hora",

    "footer.brandDesc": "Un proyecto hecho con React, Next.js y Spline.",
    "footer.objectsMadeByMe": "Objetos 3D hechos por mí",
    "footer.thisSession": "Esta sesión",
    "footer.date": "Fecha:",
    "footer.locationUsed": "Ubicación usada:",
    "footer.detecting": "Detectando…",
    "footer.notUsedHere": "No se usa en esta página",
    "footer.privacyFeedback": "Privacidad y comentarios",
    "footer.privacyPolicy": "Política de privacidad",
    "footer.sendFeedback": "Enviar comentarios",
    "footer.connect": "Conecta",
    "footer.privacyTitle": "Ubicación y privacidad",
    "footer.privacyBody":
      "Para mostrar el clima local, este sitio solicita tu ubicación aproximada. Si lo permites, tu navegador comparte las coordenadas GPS; si no, se usa una estimación basada en la IP. Tus coordenadas se envían únicamente a WeatherAPI para obtener el pronóstico — nunca se almacenan en nuestros servidores, ni se guardan ni se comparten con nadie. Puedes revocar el acceso a la ubicación en cualquier momento desde la configuración de tu navegador.",
    "footer.rights": "Datos del clima por WeatherAPI",

    "about.title": "Acerca de",
    "about.intro":
      "Este es un proyecto personal en React — una app del clima divertida que combina pronósticos en vivo con escenas 3D animadas. Fue una oportunidad para explorar las animaciones de Spline junto con Next.js moderno.",
    "about.reactTitle": "React y Next.js",
    "about.reactDesc":
      "Hecho con React y el App Router de Next.js, usando componentes de cliente y hooks para obtener datos del clima en vivo.",
    "about.splineTitle": "Animaciones de Spline",
    "about.splineDesc":
      "Las escenas 3D interactivas están diseñadas en Spline y reaccionan a las condiciones reales — sol, lluvia, nieve, tormentas y noche.",
    "about.vercelTitle": "Desplegado en Vercel",
    "about.vercelDesc":
      "Desplegado continuamente en Vercel, así que cada push llega directo a producción.",
    "about.madeWith": "Hecho con React · Next.js · Spline · Vercel",
  },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Load the saved choice (or the browser's language) after mount to keep the
  // server-rendered markup and first client render in sync (both "en").
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    const initial: Lang =
      saved ?? (navigator.language.toLowerCase().startsWith("es") ? "es" : "en");
    setLangState(initial);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let str = DICT[lang][key] ?? DICT.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

// Small EN / ES pill toggle.
export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/30 p-1 text-sm font-medium shadow-2xl backdrop-blur-2xl">
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 uppercase transition ${
            lang === l ? "bg-white/70 text-black" : "text-black/60 hover:text-black"
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
