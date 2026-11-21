// Everything the player sees: the HUD, the two panels, found markers, hint pulse,
// wrong-click flash, and the title / pause / level-done / victory / game-over screens.
import { VIEW, HUD, PANEL, PANEL_LEFT, PANEL_RIGHT, COLORS, LEVELS } from './config.js';
import { paintPanel } from './scenes.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED, SCREEN_LEVEL_DONE, SCREEN_VICTORY, SCREEN_OVER } from './world.js';

function text(ctx, str, x, y, size, color, weight, align) {
  ctx.font = `${weight || 700} ${size}px system-ui, -apple-system, 'Segoe UI', sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function panelPath(ctx, origin) {
  ctx.beginPath();
  ctx.roundRect(origin.x, origin.y, PANEL.width, PANEL.height, 16);
}

function drawPanel(ctx, world, origin, variant) {
  const { state } = world;
  const level = world.level();
  ctx.save();
  panelPath(ctx, origin);
  ctx.clip();
  ctx.translate(origin.x, origin.y);
  paintPanel(ctx, level.scene, variant);
  ctx.restore();
  panelPath(ctx, origin);
  ctx.strokeStyle = COLORS.panelBorder;
  ctx.lineWidth = 5;
  ctx.stroke();
  // Panel tag.
  ctx.fillStyle = COLORS.hud;
  ctx.beginPath();
  ctx.roundRect(origin.x + 12, origin.y + 12, 44, 44, 10);
  ctx.fill();
  text(ctx, variant === 0 ? 'A' : 'B', origin.x + 34, origin.y + 35, 26, '#ffffff', 800);
}

function drawMarkers(ctx, world) {
  const { state } = world;
  const diffs = world.differences();
  let n = 0;
  for (const d of diffs) {
    if (!state.found.has(d.id)) continue;
    n += 1;
    for (const origin of [PANEL_LEFT, PANEL_RIGHT]) {
      const cx = origin.x + d.x;
      const cy = origin.y + d.y;
      const pulse = 1 + 0.12 * Math.sin(state.elapsed * 6);
      ctx.beginPath();
      ctx.arc(cx, cy, (d.r + 8) * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, d.r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - d.r - 16, 13, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.gold;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      text(ctx, String(n), cx, cy - d.r - 15, 15, '#123f3c', 800);
    }
  }
}

function drawHint(ctx, world) {
  const { state } = world;
  if (!state.hintAt) return;
  const d = state.hintAt;
  const alpha = 0.55 + 0.45 * Math.sin(state.elapsed * 8);
  for (const origin of [PANEL_LEFT, PANEL_RIGHT]) {
    const cx = origin.x + d.x;
    const cy = origin.y + d.y;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(cx, cy, d.r + 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(cx, cy, d.r + 22, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }
}

function drawWrong(ctx, world) {
  const { state } = world;
  if (!state.wrongAt) return;
  const { x, y } = state.wrongAt;
  ctx.save();
  ctx.strokeStyle = COLORS.red;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 14); ctx.lineTo(x + 14, y + 14);
  ctx.moveTo(x + 14, y - 14); ctx.lineTo(x - 14, y + 14);
  ctx.stroke();
  ctx.restore();
}

function drawHud(ctx, world) {
  const { state } = world;
  const level = world.level();
  ctx.fillStyle = COLORS.hud;
  ctx.fillRect(0, 0, VIEW.width, HUD.height);
  text(ctx, `LEVEL ${state.levelIndex + 1} · ${level.name}`, 24, 26, 22, COLORS.hudText, 800, 'left');
  text(ctx, `Found ${world.foundCount()} / ${world.totalCount()}`, 24, 54, 17, '#bfe3d0', 600, 'left');
  // Timer bar.
  const barX = 470;
  const barW = 340;
  const ratio = Math.max(0, state.timeLeft / level.time);
  ctx.fillStyle = '#0b2b29';
  ctx.beginPath();
  ctx.roundRect(barX, 18, barW, 20, 10);
  ctx.fill();
  ctx.fillStyle = ratio > 0.5 ? '#2f9e44' : ratio > 0.25 ? '#f5b301' : '#e5484d';
  ctx.beginPath();
  ctx.roundRect(barX, 18, Math.max(20, barW * ratio), 20, 10);
  ctx.fill();
  text(ctx, `${Math.ceil(state.timeLeft)}s`, barX + barW / 2, 29, 16, '#ffffff', 800);
  text(ctx, `SCORE ${state.score}`, 850, 26, 22, COLORS.hudText, 800, 'left');
  text(ctx, `Hints ${state.hintsLeft}  (H)`, 850, 54, 16, '#ffd93b', 700, 'left');
  text(ctx, `BEST ${Math.max(state.best, state.score)}`, 1080, 26, 22, COLORS.hudText, 800, 'left');
  text(ctx, 'P pause · M sound', 1080, 54, 16, '#bfe3d0', 600, 'left');
}

function drawMessage(ctx, world) {
  const { state } = world;
  if (!state.message) return;
  text(ctx, state.message, VIEW.width / 2, 784, 17, '#123f3c', 600);
}

function dim(ctx) {
  ctx.fillStyle = 'rgba(10, 30, 28, 0.72)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
}

function card(ctx, w, h) {
  const x = (VIEW.width - w) / 2;
  const y = (VIEW.height - h) / 2;
  ctx.fillStyle = COLORS.frame;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 24);
  ctx.fill();
  ctx.strokeStyle = COLORS.hud;
  ctx.lineWidth = 4;
  ctx.stroke();
  return { x, y };
}

function drawTitle(ctx, world) {
  const { state } = world;
  ctx.fillStyle = '#123f3c';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // A quiet garden behind the title: paint level 1 dimmed.
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.translate(PANEL_LEFT.x, PANEL_LEFT.y);
  paintPanel(ctx, 'garden', 0);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.translate(PANEL_RIGHT.x, PANEL_RIGHT.y);
  paintPanel(ctx, 'garden', 1);
  ctx.restore();
  dim(ctx);
  const { x, y } = card(ctx, 760, 480);
  text(ctx, '🔍 TWIN GARDEN', x + 380, y + 78, 54, '#123f3c', 800);
  text(ctx, 'Spot the Difference', x + 380, y + 136, 30, '#b97e00', 700);
  text(ctx, 'Two pictures, side by side — almost the same.', x + 380, y + 205, 21, '#333333', 600);
  text(ctx, 'Click every difference you can find before time runs out.', x + 380, y + 238, 21, '#333333', 600);
  text(ctx, '3 levels · 7 + 8 + 9 differences · H for a hint · P to pause', x + 380, y + 290, 19, '#555555', 600);
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.roundRect(x + 260, y + 330, 240, 64, 32);
  ctx.fill();
  text(ctx, '▶  PLAY', x + 380, y + 363, 28, '#123f3c', 800);
  if (state.best > 0) text(ctx, `Best score: ${state.best}`, x + 380, y + 430, 20, '#555555', 700);
}

function drawStars(ctx, cx, y, stars) {
  for (let i = 0; i < 3; i += 1) {
    const x = cx + (i - 1) * 70;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let k = 0; k < 10; k += 1) {
      const rad = k % 2 === 0 ? 26 : 12;
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = i < stars ? COLORS.gold : '#d8dee9';
    ctx.fill();
    ctx.strokeStyle = '#b97e00';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

function drawLevelDone(ctx, world) {
  const { state } = world;
  dim(ctx);
  const { x, y } = card(ctx, 620, 420);
  text(ctx, 'LEVEL CLEAR!', x + 310, y + 70, 44, '#123f3c', 800);
  drawStars(ctx, x + 310, y + 150, state.stars);
  text(ctx, `Found all ${world.totalCount()} differences`, x + 310, y + 210, 22, '#333333', 600);
  text(ctx, `Level score  +${state.levelScore}`, x + 310, y + 252, 24, '#b97e00', 800);
  text(ctx, `Total score  ${state.score}`, x + 310, y + 288, 22, '#333333', 700);
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.roundRect(x + 190, y + 322, 240, 60, 30);
  ctx.fill();
  text(ctx, 'NEXT LEVEL  ▶', x + 310, y + 353, 24, '#123f3c', 800);
}

function drawVictory(ctx, world) {
  const { state } = world;
  dim(ctx);
  const { x, y } = card(ctx, 680, 440);
  text(ctx, '🎉 YOU FOUND THEM ALL!', x + 340, y + 72, 40, '#123f3c', 800);
  text(ctx, 'Every difference in all three scenes — sharp eyes!', x + 340, y + 130, 22, '#333333', 600);
  text(ctx, `FINAL SCORE  ${state.score}`, x + 340, y + 200, 30, '#b97e00', 800);
  if (state.score >= state.best && state.score > 0) text(ctx, '★ New best score! ★', x + 340, y + 248, 24, '#e5484d', 800);
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.roundRect(x + 220, y + 300, 240, 60, 30);
  ctx.fill();
  text(ctx, 'PLAY AGAIN  ↻', x + 340, y + 331, 24, '#123f3c', 800);
  text(ctx, 'Press R to play again', x + 340, y + 400, 18, '#555555', 600);
}

function drawOver(ctx, world) {
  const { state } = world;
  dim(ctx);
  const { x, y } = card(ctx, 620, 420);
  text(ctx, "TIME'S UP!", x + 310, y + 80, 48, '#e5484d', 800);
  text(ctx, `You found ${world.foundCount()} of ${world.totalCount()} differences`, x + 310, y + 150, 22, '#333333', 600);
  text(ctx, `Score  ${state.score}`, x + 310, y + 196, 24, '#333333', 700);
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.roundRect(x + 190, y + 250, 240, 60, 30);
  ctx.fill();
  text(ctx, 'TRY AGAIN  ↻', x + 310, y + 281, 24, '#123f3c', 800);
  text(ctx, 'Press R to retry this level', x + 310, y + 360, 18, '#555555', 600);
}

function drawPaused(ctx) {
  dim(ctx);
  const { x, y } = card(ctx, 480, 240);
  text(ctx, 'PAUSED', x + 240, y + 90, 44, '#123f3c', 800);
  text(ctx, 'Press P to keep hunting', x + 240, y + 160, 20, '#555555', 600);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  function draw(world) {
    const { state } = world;
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);
    ctx.fillStyle = COLORS.frame;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    if (state.screen === SCREEN_TITLE) {
      drawTitle(ctx, world);
      return;
    }
    drawHud(ctx, world);
    drawPanel(ctx, world, PANEL_LEFT, 0);
    drawPanel(ctx, world, PANEL_RIGHT, 1);
    if (state.screen === SCREEN_PLAY || state.screen === SCREEN_PAUSED) {
      drawMarkers(ctx, world);
      drawHint(ctx, world);
      drawWrong(ctx, world);
      drawMessage(ctx, world);
    }
    if (state.screen === SCREEN_PAUSED) drawPaused(ctx);
    else if (state.screen === SCREEN_LEVEL_DONE) drawLevelDone(ctx, world);
    else if (state.screen === SCREEN_VICTORY) drawVictory(ctx, world);
    else if (state.screen === SCREEN_OVER) drawOver(ctx, world);
  }
  return { draw };
}
