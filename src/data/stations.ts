// Source of truth for which cities Green Titans is live in. Today this is a
// hand-maintained list; once there's a backend this becomes an API response
// and nothing else in the Network screen needs to change.
export type Station = {
    id: string;
    name: string;
    // Position as a percentage of the map SVG's viewBox (0-100), so pins stay
    // correctly placed regardless of screen size.
    x: number;
    y: number;
    launched: boolean;   // true = pin shows on the map right now
    launchDate?: string; // ISO date, optional, shown as a tooltip/label later
  };
  
  export const STATIONS: Station[] = [
    { id: 'astana', name: 'Astana', x: 54, y: 32, launched: true, launchDate: '2025-11-01' },
    { id: 'karaganda', name: 'Karaganda', x: 50, y: 42, launched: true, launchDate: '2025-12-15' },
    { id: 'almaty', name: 'Almaty', x: 66, y: 78, launched: true, launchDate: '2026-01-20' },
    // Add the next city here with launched: false, then flip it to true
    // (and fill in launchDate) the day it actually goes live.
    // { id: 'shymkent', name: 'Shymkent', x: 44, y: 86, launched: false },
  ];
  