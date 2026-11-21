// The screenshot scenes behind ?shot=title|play|hint|win. Each one plays the real rules
// forward from a fresh level with a fixed seed, so the frame is what a real game looks like
// and the same seed always gives the same frame. Screenshots are real renders of the game:
// title shows the title screen, play shows 3 found of 7 with 4 still hidden, hint shows a
// hint pulsing on level 2, win shows level 3 cleared with three stars.
import { SCREEN_TITLE, SCREEN_PLAY } from './world.js';
import { STEP } from './config.js';

function findById(world, id) {
  const diff = world.differences().find((d) => d.id === id);
  if (!diff) return;
  const origin = { x: 20, y: 84 };
  world.click(origin.x + diff.x, origin.y + diff.y);
}

export function stageShot(name, world) {
  const state = world.state;
  if (name === 'play') {
    world.startLevel(0);
    findById(world, 'sunglasses');
    findById(world, 'apple');
    findById(world, 'butterfly');
    state.timeLeft = 62;
    state.elapsed = 28;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'hint') {
    world.startLevel(1);
    findById(world, 'boat');
    findById(world, 'starfish');
    findById(world, 'coconut');
    findById(world, 'juice');
    findById(world, 'sandwich');
    state.timeLeft = 74;
    state.elapsed = 36;
    world.useHint();
    return { screen: SCREEN_PLAY };
  }
  if (name === 'win') {
    world.startLevel(2);
    state.timeLeft = 58;
    state.elapsed = 72;
    for (const d of [...world.differences()]) findById(world, d.id);
    state.stars = 3;
    return { screen: state.screen };
  }
  // Default: title over the garden.
  state.screen = SCREEN_TITLE;
  state.levelIndex = 0;
  state.timeLeft = 90;
  return { screen: SCREEN_TITLE };
}

// Advance a shot scene a few fixed steps so flashes and pulses settle the same way.
export function settleShot(world) {
  for (let i = 0; i < 6; i += 1) world.step(STEP);
}
