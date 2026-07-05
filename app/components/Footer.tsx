"use client";

import { useEffect, useState } from "react";

// Mountain + lake footer image.
// The image (public/footer.png, 1281x405) is mountains on top, a teal lake on
// the bottom ~33%. It's pulled UP into the scene so only the mountain peaks
// poke above the fold; scrolling down reveals the lake. Below the image we
// continue the same lake color (#338596) as a solid panel holding the footer
// columns, so the water appears to extend into the content.
const LAKE = "#338596";

const MADE_BY_ME = ["Sunny", "Cloudy", "Rain", "Storm", "Night"];

export function Footer({ location }: { location?: string }) {
  const [today, setToday] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Compute the date on the client to avoid a server/client hydration mismatch
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <footer className="relative z-40 -mt-[21.25vw] w-full select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/footer.png" alt="" className="pointer-events-none block w-full" />

      {/* Teal panel continuing the lake, holding the footer columns */}
      <div style={{ backgroundColor: LAKE }} className="w-full text-white">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-8 pb-10 -mt-[6vw] text-center place-items-center sm:grid-cols-3">
          

          {/* Column 2 — session info */}
          {/* <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">
              This session
            </h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <span className="opacity-60">Date:</span> {today || "—"}
              </li>
              <li>
                <span className="opacity-60">Location used:</span>{" "}
                {location || "Detecting…"}
              </li>
            </ul>
          </div> */}

          {/* Column 3 — legal + feedback */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">
              Privacy &amp; feedback
            </h4>
            <div className="flex flex-col items-center gap-2 text-sm">
              <button
                onClick={() => setShowPrivacy((v) => !v)}
                className="underline-offset-4 hover:underline"
              >
                Privacy policy
              </button>
              <a
                href="mailto:armandoestruwu@gmail.com?subject=My%20Weather%20feedback"
                className="rounded-full bg-white/20 px-4 py-2 font-medium transition hover:bg-white/30"
              >
                Send feedback
              </a>
            </div>
          </div>

          {/* Column 1 — brand + 3D objects made by me */}
          <div>
            <h3 className="mb-3 text-lg font-bold tracking-wide">My Weather</h3>
            <p className="text-sm opacity-80">
              A personal project built with React, Next.js &amp; Spline.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider opacity-70">
              3D objects made by me
            </p>
            <p className="mt-1 text-sm opacity-80">{MADE_BY_ME.join(" · ")}</p>
          </div>

          {/* Column 4 — social links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">
              Connect
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="https://github.com/marilynjov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 opacity-90 transition hover:opacity-100"
              >
                <GithubIcon />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/marilyn-stephany-joven"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 opacity-90 transition hover:opacity-100"
              >
                <LinkedinIcon />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Expandable privacy statement */}
        {showPrivacy && (
          <div className="mx-auto max-w-6xl px-8 pb-8">
            <div className="rounded-2xl bg-white/10 p-5 text-sm leading-relaxed opacity-90">
              <p className="mb-2 font-semibold">Location &amp; privacy</p>
              <p>
                To show local weather, this site requests your approximate
                location. If you allow it, your browser shares GPS coordinates;
                if you don&apos;t, an IP-based estimate is used instead. Your
                coordinates are sent only to WeatherAPI to fetch the forecast —
                they are never stored on our servers, saved, or shared with
                anyone else. You can revoke location access at any time in your
                browser settings.
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-white/15 py-4 text-center text-xs opacity-70">
          © {new Date().getFullYear()} Marilyn Joven · Weather data by WeatherAPI
        </div>
      </div>
    </footer>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
