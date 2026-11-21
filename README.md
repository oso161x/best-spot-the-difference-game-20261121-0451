# Twin Garden — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/oso161x/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/oso161x/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A [make.fun](https://make.fun) entry for @kebomas786. A complete, original spot-the-difference
game that plays offline in a desktop browser from its own files — no library, no network.

## The game

Two near-identical pictures side by side. Click every difference before time runs out.

- **3 levels, 3 hand-painted scenes** (all drawn in code, no borrowed art):
  1. **Sunny Garden** — 7 differences, 90 seconds
  2. **Seaside Picnic** — 8 differences, 110 seconds
  3. **Starlight Camp** — 9 differences, 130 seconds
- **Found markers**: every difference you find gets a numbered gold ring on both panels.
- **Hints** (H key, 3 per level): pulses the next unfound difference on both panels.
- **Time pressure**: a wrong click costs 5 seconds and 25 points; a find is worth 100 points,
  plus a time bonus when the level clears. Stars (1–3) rate how fast you cleared it.
- **Feel**: a chime on each find, a buzz on a miss, a little arpeggio on a clear — tiny
  WebAudio blips, no audio files. M to mute, P to pause, R to retry, N for the next level.
- **Screens**: title, play, paused, level-clear (with stars), victory, and time-up.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output dir and writes `dossier.json`
with the kit's `vendor/makefun-game.ts`. Screenshots live in `screenshots/` (the first by
name is the cover): the title screen, mid-play with 3 of 7 found, a hint pulsing on level 2,
and level 3 cleared with three stars — all real renders of the game's own code, staged with
`?shot=title|play|hint|win&seed=1`.
