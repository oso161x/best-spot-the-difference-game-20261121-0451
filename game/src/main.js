// Boot and the one loop: input is read on every pointer or key event, the world advances in
// fixed 1/60 s steps (several in a slow frame, none in a fast one), and the renderer paints
// what is there. The game moves between title, play, paused, level-done, victory and over.
// ?seed=N fixes the level layout. ?shot=title|play|hint|win (with &seed=N) stages that scene
// instead of running the loop, paints it twice and sets window.__shotReady for a screenshot.
import { BEST_KEY, STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld, SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL_DONE, SCREEN_VICTORY, SCREEN_OVER, EVENT_FOUND, EVENT_WRONG, EVENT_LEVEL_DONE, EVENT_OVER } from './world.js';
import { createInput, ACTION_PAUSE, ACTION_HINT, ACTION_CONFIRM, ACTION_RESTART, ACTION_NEXT } from './input.js';
import { createAudio } from './audio.js';
import { createRenderer } from './render.js';
import { stageShot, settleShot } from './shots.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

world.state.best = readBest();

function announce() {
  const s = world.state;
  const line = s.screen === SCREEN_PLAY
    ? `Level ${s.levelIndex + 1}, ${world.foundCount()} of ${world.totalCount()} differences found, ${Math.ceil(s.timeLeft)} seconds left, score ${s.score}.`
    : s.screen === SCREEN_TITLE
      ? 'Twin Garden spot the difference. Press Enter or click Play to start.'
      : s.message;
  status.textContent = line;
}

function onEvent(event) {
  if (event & EVENT_FOUND) audio.found();
  if (event & EVENT_WRONG) audio.wrong();
  if (event & EVENT_LEVEL_DONE) audio.win();
  if (event & EVENT_OVER) audio.over();
  if (world.state.screen === SCREEN_VICTORY) saveBest(world.state.score);
  announce();
}

function runShot(name) {
  const scene = stageShot(name, world);
  settleShot(world);
  let painted = 0;
  function paint() {
    renderer.draw(world);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
  return scene;
}

function onClick(x, y) {
  audio.unlock();
  const s = world.state;
  if (s.screen === SCREEN_TITLE) {
    audio.click();
    world.startGame();
    announce();
    return;
  }
  if (s.screen === SCREEN_LEVEL_DONE) {
    audio.click();
    world.nextLevel();
    announce();
    return;
  }
  if (s.screen === SCREEN_VICTORY || s.screen === SCREEN_OVER) {
    audio.click();
    world.startGame();
    announce();
    return;
  }
  onEvent(world.click(x, y));
}

function onAction(action) {
  const s = world.state;
  if (action === 'mute') {
    audio.toggleMute();
    return;
  }
  if (action === ACTION_PAUSE) {
    world.togglePause();
    announce();
    return;
  }
  if (action === ACTION_HINT) {
    if (world.useHint()) audio.hint();
    announce();
    return;
  }
  if (action === ACTION_RESTART) {
    if (s.screen === SCREEN_OVER || s.screen === SCREEN_VICTORY) world.startGame();
    else if (s.screen === SCREEN_PLAY) world.startLevel(s.levelIndex);
    announce();
    return;
  }
  if (action === ACTION_NEXT && s.screen === SCREEN_LEVEL_DONE) {
    world.nextLevel();
    announce();
    return;
  }
  if (action === ACTION_CONFIRM) {
    if (s.screen === SCREEN_TITLE) world.startGame();
    else if (s.screen === SCREEN_LEVEL_DONE) world.nextLevel();
    else if (s.screen === SCREEN_VICTORY || s.screen === SCREEN_OVER) world.startGame();
    announce();
  }
}

createInput(canvas, { onClick, onAction });

if (shot) {
  runShot(shot);
} else {
  let last = performance.now();
  function frame(now) {
    const delta = Math.min(MAX_FRAME, (now - last) / 1000);
    last = now;
    let left = delta;
    while (left > 0) {
      const dt = Math.min(STEP, left);
      const event = world.step(dt);
      if (event) onEvent(event);
      left -= dt;
    }
    renderer.draw(world);
    requestAnimationFrame(frame);
  }
  renderer.draw(world);
  requestAnimationFrame(frame);
}
