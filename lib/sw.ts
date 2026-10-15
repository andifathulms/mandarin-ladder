import { withBase } from './basePath';

/** Registers the service worker in production only. */
export function registerServiceWorker() {
  if (process.env.NODE_ENV !== 'production') return;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register(withBase('/sw.js'), { scope: withBase('/') }).catch(() => {});
}
