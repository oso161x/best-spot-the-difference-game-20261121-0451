// Shared constants for Twin Garden: canvas size, panel geometry, levels and tuning.
// The game is one 1280x800 canvas: a HUD bar on top, two 600x680 scene panels below.
export const VIEW = { width: 1280, height: 800 };
export const HUD = { height: 72 };
export const PANEL = { width: 600, height: 680, top: 84, gap: 40, margin: 20 };
export const PANEL_LEFT = { x: PANEL.margin, y: PANEL.top };
export const PANEL_RIGHT = { x: PANEL.margin + PANEL.width + PANEL.gap, y: PANEL.top };

export const STEP = 1 / 60;
export const BEST_KEY = 'twin-garden-best';

// One entry per level: name, time limit, hints and the scene that paints it.
export const LEVELS = [
  { scene: 'garden', name: 'Sunny Garden', time: 90, hints: 3 },
  { scene: 'seaside', name: 'Seaside Picnic', time: 110, hints: 3 },
  { scene: 'camp', name: 'Starlight Camp', time: 130, hints: 3 },
];

export const SCORE_FIND = 100;
export const SCORE_WRONG = 25;
export const SCORE_HINT = 50;
export const WRONG_TIME = 5;

// Canvas palette: warm cream frame, deep teal HUD, gold markers.
export const COLORS = {
  frame: '#fff6e3',
  hud: '#123f3c',
  hudText: '#fff6e3',
  gold: '#f5b301',
  goldDark: '#b97e00',
  red: '#e5484d',
  green: '#2f9e44',
  panelBorder: '#123f3c',
};
