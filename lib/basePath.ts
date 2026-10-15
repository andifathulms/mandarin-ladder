/** GitHub Pages base path (e.g. "/mandarin-ladder"); empty in dev. next/link adds it itself. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const withBase = (path: string) => `${BASE_PATH}${path}`;
