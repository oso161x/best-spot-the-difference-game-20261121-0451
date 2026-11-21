// The game state and its rules: screens, levels, clicks, hints, timer and score.
// A click on either panel is tested against the level's differences; a hit marks the spot
// on BOTH panels, a miss costs time and points, and finding them all clears the level.
import { LEVELS, PANEL_LEFT, PANEL_RIGHT, PANEL, SCORE_FIND, SCORE_WRONG, SCORE_HINT, WRONG_TIME } from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_VICTORY = 'victory';
export const SCREEN_OVER = 'over';

export const EVENT_NONE = 0;
export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_LEVEL_DONE = 4;
export const EVENT_OVER = 8;

export function createWorld(seed) {
  const state = {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    score: 0,
    best: 0,
    timeLeft: LEVELS[0].time,
    hintsLeft: LEVELS[0].hints,
    hintAt: null,
    hintUntil: 0,
    wrongAt: null,
    wrongUntil: 0,
    elapsed: 0,
    foundFlash: 0,
    message: '',
    levelScore: 0,
    stars: 0,
    seed,
  };

  function level() {
    return LEVELS[state.levelIndex];
  }
  function differences() {
    return SCENES[level().scene].differences;
  }
  function foundCount() {
    return state.found.size;
  }
  function totalCount() {
    return differences().length;
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.timeLeft = level().time;
    state.hintsLeft = level().hints;
    state.hintAt = null;
    state.wrongAt = null;
    state.elapsed = 0;
    state.levelScore = 0;
    state.message = '';
    state.screen = SCREEN_PLAY;
  }

  function startGame() {
    state.score = 0;
    startLevel(0);
  }

  /** Which panel (0 left, 1 right) and scene point a canvas point is on, or null. */
  function panelAt(x, y) {
    for (let i = 0; i < 2; i += 1) {
      const origin = i === 0 ? PANEL_LEFT : PANEL_RIGHT;
      if (x >= origin.x && x < origin.x + PANEL.width && y >= origin.y && y < origin.y + PANEL.height) {
        return { panel: i, px: x - origin.x, py: y - origin.y };
      }
    }
    return null;
  }

  /** A click on the play screen. Returns an event flag for sounds. */
  function click(x, y) {
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    const hit = panelAt(x, y);
    if (!hit) return EVENT_NONE;
    const diffs = differences();
    for (let i = 0; i < diffs.length; i += 1) {
      const d = diffs[i];
      if (state.found.has(d.id)) continue;
      const dx = hit.px - d.x;
      const dy = hit.py - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found.add(d.id);
        state.score += SCORE_FIND;
        state.levelScore += SCORE_FIND;
        state.foundFlash = 1;
        state.message = d.label;
        state.hintAt = null;
        if (state.found.size === diffs.length) {
          const bonus = Math.round(state.timeLeft) * 10;
          state.score += bonus;
          state.levelScore += bonus;
          const ratio = state.timeLeft / level().time;
          state.stars = ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
          state.screen = state.levelIndex + 1 >= LEVELS.length ? SCREEN_VICTORY : SCREEN_LEVEL_DONE;
          if (state.screen === SCREEN_VICTORY && state.score > state.best) state.best = state.score;
          return EVENT_FOUND | EVENT_LEVEL_DONE;
        }
        return EVENT_FOUND;
      }
    }
    state.score = Math.max(0, state.score - SCORE_WRONG);
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME);
    state.wrongAt = { x, y };
    state.wrongUntil = state.elapsed + 0.7;
    state.message = 'Not a difference — minus 5 seconds';
    return EVENT_WRONG;
  }

  /** Spend a hint: pulse the next unfound difference for a few seconds. */
  function useHint() {
    if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return false;
    const next = differences().find((d) => !state.found.has(d.id));
    if (!next) return false;
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - SCORE_HINT);
    state.hintAt = next;
    state.hintUntil = state.elapsed + 3;
    state.message = 'Hint: follow the pulsing circle';
    return true;
  }

  function nextLevel() {
    startLevel(state.levelIndex + 1);
  }

  function togglePause() {
    if (state.screen === SCREEN_PLAY) state.screen = SCREEN_PAUSED;
    else if (state.screen === SCREEN_PAUSED) state.screen = SCREEN_PLAY;
  }

  function step(dt) {
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    state.elapsed += dt;
    state.timeLeft -= dt;
    if (state.foundFlash > 0) state.foundFlash = Math.max(0, state.foundFlash - dt * 3);
    if (state.hintAt && state.elapsed > state.hintUntil) state.hintAt = null;
    if (state.wrongAt && state.elapsed > state.wrongUntil) state.wrongAt = null;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = SCREEN_OVER;
      return EVENT_OVER;
    }
    return EVENT_NONE;
  }

  return {
    state, level, differences, foundCount, totalCount,
    startGame, startLevel, click, useHint, nextLevel, togglePause, step, panelAt,
  };
}
