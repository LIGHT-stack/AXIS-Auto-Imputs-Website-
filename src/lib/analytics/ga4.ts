export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: url });
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
