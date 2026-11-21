// The three scenes, painted fresh in code (flat illustration style, no borrowed art).
// Every scene paints the same picture twice: variant 0 is the original, variant 1 has the
// differences applied. Each difference is data: an id, a label, a hit zone (x, y, r in the
// scene's own 600x680 space) and an alter() that repaints just that spot for variant 1.
// Flat colours are deliberate: an erased element is repainted with the exact background colour.

const SKY_GARDEN = '#8ec9ee';
const GRASS = '#7cc46a';
const GRASS_DARK = '#63aa52';
const SKY_SEA = '#aee3f5';
const SEA = '#3fa7c4';
const SAND = '#f2d492';
const SKY_NIGHT = '#1b2a52';
const GROUND_NIGHT = '#234534';

export function circle(ctx, x, y, r, fill, stroke, lw) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.stroke(); }
}

export function ellipse(ctx, x, y, rx, ry, fill, stroke, lw) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.stroke(); }
}

export function rr(ctx, x, y, w, h, r, fill, stroke, lw) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.stroke(); }
}

export function poly(ctx, points, fill, stroke, lw) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.stroke(); }
}

export function star(ctx, cx, cy, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x, y, 42 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 30 * s, y + 6 * s, 26 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 32 * s, y + 6 * s, 28 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function flower(ctx, x, y, petal) {
  ctx.strokeStyle = '#2f7d32';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 34);
  ctx.stroke();
  ctx.fillStyle = '#2f9e44';
  ctx.beginPath();
  ctx.ellipse(x - 10, y + 22, 12, 6, -0.5, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 5; i += 1) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 11, y + Math.sin(a) * 11, 8, petal);
  }
  circle(ctx, x, y, 8, '#f5b301');
}

function drawDuck(ctx, x, y, dir) {
  ellipse(ctx, x, y, 26, 16, '#ffffff', '#d8dee9', 2);
  circle(ctx, x + 20 * dir, y - 12, 11, '#ffffff', '#d8dee9', 2);
  poly(ctx, [[x + 28 * dir, y - 14], [x + 40 * dir, y - 10], [x + 28 * dir, y - 6]], '#f08c00');
  circle(ctx, x + 22 * dir, y - 15, 2, '#222222');
  ctx.strokeStyle = '#7fb3d5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 34, y + 12, 12, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 34, y + 12, 12, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

// ---------------------------------------------------------------- garden
function paintGarden(ctx) {
  ctx.fillStyle = SKY_GARDEN;
  ctx.fillRect(0, 0, 600, 680);
  // Sun with a smile.
  circle(ctx, 92, 92, 52, '#ffd93b', '#e8a800', 4);
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.strokeStyle = '#ffd93b';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(92 + Math.cos(a) * 60, 92 + Math.sin(a) * 60);
    ctx.lineTo(92 + Math.cos(a) * 76, 92 + Math.sin(a) * 76);
    ctx.stroke();
  }
  circle(ctx, 76, 86, 5, '#333333');
  circle(ctx, 108, 86, 5, '#333333');
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(92, 100, 14, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  cloud(ctx, 300, 82, 1);
  cloud(ctx, 486, 62, 0.8);
  cloud(ctx, 200, 152, 0.7);
  // Bird in the sky.
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(420, 140);
  ctx.quadraticCurveTo(430, 128, 440, 140);
  ctx.quadraticCurveTo(450, 128, 460, 140);
  ctx.stroke();
  // Hills.
  ctx.fillStyle = GRASS;
  ctx.beginPath();
  ctx.moveTo(0, 470);
  ctx.quadraticCurveTo(150, 400, 320, 460);
  ctx.quadraticCurveTo(460, 510, 600, 450);
  ctx.lineTo(600, 680);
  ctx.lineTo(0, 680);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = GRASS_DARK;
  ctx.beginPath();
  ctx.moveTo(0, 560);
  ctx.quadraticCurveTo(200, 500, 420, 560);
  ctx.quadraticCurveTo(520, 590, 600, 560);
  ctx.lineTo(600, 680);
  ctx.lineTo(0, 680);
  ctx.closePath();
  ctx.fill();
  // Pond with a duck.
  ellipse(ctx, 462, 622, 92, 30, '#5db9e8', '#3f8fbf', 3);
  drawDuck(ctx, 462, 616, -1);
  // House.
  ctx.fillStyle = '#fff3d6';
  ctx.fillRect(330, 330, 190, 150);
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 3;
  ctx.strokeRect(330, 330, 190, 150);
  poly(ctx, [[312, 336], [425, 252], [538, 336]], '#e5484d', '#a52a2a', 4);
  rr(ctx, 396, 400, 56, 80, 6, '#8a5a2b', '#5d3a17', 3);
  circle(ctx, 442, 442, 4, '#f5b301');
  rr(ctx, 348, 356, 44, 44, 4, '#33507a', '#8a6d3b', 3);
  rr(ctx, 458, 356, 44, 44, 4, '#33507a', '#8a6d3b', 3);
  // Path stones from the door.
  ctx.fillStyle = '#d9c9a3';
  [[424, 492], [412, 522], [436, 552], [424, 584], [440, 616]].forEach(([x, y]) => ellipse(ctx, x, y, 20, 9, '#d9c9a3'));
  // Tree with apples.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(76, 330, 30, 150);
  circle(ctx, 90, 300, 66, '#2f9e44', '#237a34', 3);
  circle(ctx, 52, 330, 42, '#37b24d', '#237a34', 3);
  circle(ctx, 130, 330, 42, '#37b24d', '#237a34', 3);
  circle(ctx, 62, 282, 9, '#e5484d');
  circle(ctx, 118, 268, 9, '#e5484d');
  circle(ctx, 92, 316, 9, '#e5484d');
  circle(ctx, 140, 306, 9, '#e5484d');
  circle(ctx, 52, 330, 9, '#e5484d');
  // Fence.
  ctx.fillStyle = '#ffffff';
  for (let x = 8; x < 600; x += 34) {
    ctx.fillRect(x, 500, 16, 46);
    poly(ctx, [[x, 500], [x + 8, 488], [x + 16, 500]], '#ffffff');
  }
  ctx.fillRect(0, 516, 600, 8);
  // Flower bed.
  flower(ctx, 60, 640, '#e5484d');
  flower(ctx, 130, 652, '#ff8fb3');
  flower(ctx, 200, 640, '#e5484d');
  flower(ctx, 270, 652, '#9775fa');
  flower(ctx, 560, 648, '#ff8fb3');
  // Butterfly.
  ctx.fillStyle = '#9775fa';
  ellipse(ctx, 246, 206, 12, 18, '#9775fa');
  ellipse(ctx, 268, 206, 12, 18, '#9775fa');
  ellipse(ctx, 250, 226, 9, 13, '#b197fc');
  ellipse(ctx, 264, 226, 9, 13, '#b197fc');
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(257, 200);
  ctx.lineTo(257, 216);
  ctx.stroke();
}

const GARDEN_DIFFS = [
  { id: 'sunglasses', label: 'the sun wears sunglasses', x: 92, y: 92, r: 52,
    alter(ctx) { rr(ctx, 58, 76, 30, 16, 6, '#222222'); rr(ctx, 96, 76, 30, 16, 6, '#222222'); ctx.strokeStyle = '#222222'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(88, 84); ctx.lineTo(96, 84); ctx.stroke(); } },
  { id: 'cloud', label: 'a cloud is missing', x: 300, y: 82, r: 46,
    alter(ctx) { ctx.fillStyle = SKY_GARDEN; ctx.fillRect(238, 54, 132, 58); } },
  { id: 'window', label: 'a window is lit', x: 370, y: 378, r: 30,
    alter(ctx) { rr(ctx, 348, 356, 44, 44, 4, '#ffd93b'); ctx.strokeStyle = '#8a6d3b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(370, 356); ctx.lineTo(370, 400); ctx.moveTo(348, 378); ctx.lineTo(392, 378); ctx.stroke(); } },
  { id: 'apple', label: 'an apple is missing', x: 118, y: 268, r: 16,
    alter(ctx) { circle(ctx, 118, 268, 11, '#2f9e44'); } },
  { id: 'flower', label: 'a flower changed colour', x: 200, y: 640, r: 24,
    alter(ctx) { for (let i = 0; i < 5; i += 1) { const a = (i * Math.PI * 2) / 5 - Math.PI / 2; circle(ctx, 200 + Math.cos(a) * 11, 640 + Math.sin(a) * 11, 8, '#9775fa'); } } },
  { id: 'butterfly', label: 'the butterfly is gone', x: 257, y: 210, r: 26,
    alter(ctx) { ctx.fillStyle = SKY_GARDEN; ctx.beginPath(); ctx.arc(257, 210, 30, 0, Math.PI * 2); ctx.fill(); } },
  { id: 'duck', label: 'the duck faces the other way', x: 462, y: 616, r: 34,
    alter(ctx) { ellipse(ctx, 462, 622, 92, 30, '#5db9e8', '#3f8fbf', 3); drawDuck(ctx, 462, 616, 1); } },
];

// ---------------------------------------------------------------- seaside
function paintSeaside(ctx) {
  ctx.fillStyle = SKY_SEA;
  ctx.fillRect(0, 0, 600, 680);
  circle(ctx, 520, 84, 48, '#ffd93b', '#e8a800', 4);
  cloud(ctx, 150, 80, 0.9);
  cloud(ctx, 380, 130, 0.7);
  // Sea.
  ctx.fillStyle = SEA;
  ctx.fillRect(0, 250, 600, 180);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  [300, 340, 380].forEach((y, i) => {
    ctx.beginPath();
    for (let x = 0; x <= 600; x += 20) ctx.quadraticCurveTo(x + 10, y - 8 + (i % 2) * 4, x + 20, y);
    ctx.stroke();
  });
  // Boat on the horizon.
  poly(ctx, [[104, 296], [124, 252], [124, 296]], '#ffffff', '#999999', 2);
  poly(ctx, [[130, 296], [150, 262], [150, 296]], '#ffe066', '#999999', 2);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(120, 296, 6, 12);
  ellipse(ctx, 126, 308, 34, 10, '#a52a2a');
  // Sand.
  ctx.fillStyle = SAND;
  ctx.fillRect(0, 430, 600, 250);
  ctx.fillStyle = '#e5c078';
  for (let i = 0; i < 12; i += 1) circle(ctx, 40 + i * 52, 452 + (i % 3) * 14, 3, '#e5c078');
  // Palm tree.
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(486, 520);
  ctx.quadraticCurveTo(500, 420, 478, 330);
  ctx.stroke();
  ctx.strokeStyle = '#2f9e44';
  ctx.lineWidth = 12;
  const fronds = [[420, 300], [540, 296], [446, 268], [512, 262], [478, 246]];
  fronds.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(478, 330);
    ctx.quadraticCurveTo(478 + (x - 478) * 0.6, 330 + (y - 330) * 0.6 - 26, x, y);
    ctx.stroke();
  });
  circle(ctx, 470, 336, 10, '#6b4423');
  circle(ctx, 488, 342, 10, '#6b4423');
  circle(ctx, 478, 352, 10, '#6b4423');
  // Umbrella.
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(170, 540);
  ctx.lineTo(170, 380);
  ctx.stroke();
  const canopy = ['#e5484d', '#ffffff', '#e5484d', '#ffffff', '#e5484d', '#ffffff'];
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = canopy[i];
    ctx.beginPath();
    ctx.moveTo(170, 430);
    ctx.arc(170, 430, 110, Math.PI + (i * Math.PI) / 6, Math.PI + ((i + 1) * Math.PI) / 6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#a52a2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(170, 430, 110, Math.PI, 0);
  ctx.stroke();
  circle(ctx, 170, 366, 8, '#f5b301');
  // Picnic blanket.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(220, 560, 210, 96);
  ctx.fillStyle = '#e5484d';
  for (let y = 0; y < 4; y += 1) for (let x = 0; x < 7; x += 1) {
    if ((x + y) % 2 === 0) ctx.fillRect(220 + x * 30, 560 + y * 24, 30, 24);
  }
  // Basket, sandwich, juice, apple on the blanket.
  rr(ctx, 240, 596, 64, 40, 8, '#a67c37', '#7a4a21', 3);
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(272, 596, 22, Math.PI, 0);
  ctx.stroke();
  poly(ctx, [[330, 620], [360, 596], [390, 620]], '#f5d9a0', '#c9a25e', 2);
  poly(ctx, [[336, 616], [360, 600], [384, 616]], '#7cc46a');
  rr(ctx, 396, 592, 18, 34, 4, '#dff3ff', '#7fb3d5', 2);
  ctx.fillStyle = '#ff8f1f';
  ctx.fillRect(398, 604, 14, 20);
  circle(ctx, 342, 580, 12, '#e5484d');
  // Crab.
  circle(ctx, 522, 600, 26, '#ff7043', '#d84315', 3);
  circle(ctx, 500, 586, 12, '#ff7043', '#d84315', 3);
  circle(ctx, 544, 586, 12, '#ff7043', '#d84315', 3);
  circle(ctx, 512, 576, 3, '#222222');
  circle(ctx, 532, 576, 3, '#222222');
  ctx.strokeStyle = '#d84315';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(500, 612); ctx.lineTo(478, 622);
  ctx.moveTo(544, 612); ctx.lineTo(566, 622);
  ctx.stroke();
  // Starfish.
  star(ctx, 92, 622, 22, '#ff8f1f');
  circle(ctx, 92, 622, 4, '#d84315');
  // Beach ball.
  circle(ctx, 430, 622, 26, '#ffffff', '#999999', 2);
  ctx.fillStyle = '#4dabf7';
  ctx.beginPath();
  ctx.moveTo(430, 622);
  ctx.arc(430, 622, 26, -Math.PI / 2, Math.PI / 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e5484d';
  ctx.beginPath();
  ctx.moveTo(430, 622);
  ctx.arc(430, 622, 26, Math.PI / 6, Math.PI * 0.83);
  ctx.closePath();
  ctx.fill();
  // Bucket and spade.
  poly(ctx, [[316, 606], [344, 606], [338, 640], [322, 640]], '#4dabf7', '#2b6cb0', 3);
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(352, 596);
  ctx.lineTo(372, 636);
  ctx.stroke();
  poly(ctx, [[366, 632], [382, 632], [374, 650]], '#f5b301');
}

const SEASIDE_DIFFS = [
  { id: 'boat', label: 'the boat is gone', x: 126, y: 290, r: 36,
    alter(ctx) { ctx.fillStyle = SEA; ctx.fillRect(88, 244, 80, 72); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(92, 300); ctx.quadraticCurveTo(110, 292, 128, 300); ctx.quadraticCurveTo(146, 308, 164, 300); ctx.stroke(); } },
  { id: 'umbrella', label: 'an umbrella stripe changed colour', x: 170, y: 400, r: 26,
    alter(ctx) { ctx.fillStyle = '#4dabf7'; ctx.beginPath(); ctx.moveTo(170, 430); ctx.arc(170, 430, 110, Math.PI + Math.PI / 6, Math.PI + (2 * Math.PI) / 6); ctx.closePath(); ctx.fill(); } },
  { id: 'starfish', label: 'the starfish is gone', x: 92, y: 622, r: 26,
    alter(ctx) { circle(ctx, 92, 622, 26, SAND); } },
  { id: 'coconut', label: 'a coconut is missing', x: 478, y: 352, r: 14,
    alter(ctx) { circle(ctx, 478, 352, 12, '#7a4a21'); } },
  { id: 'ball', label: 'the beach ball changed colour', x: 430, y: 622, r: 26,
    alter(ctx) { ctx.fillStyle = '#9775fa'; ctx.beginPath(); ctx.moveTo(430, 622); ctx.arc(430, 622, 26, Math.PI / 6, Math.PI * 0.83); ctx.closePath(); ctx.fill(); } },
  { id: 'juice', label: 'the juice glass is half empty', x: 405, y: 609, r: 20,
    alter(ctx) { ctx.fillStyle = '#dff3ff'; ctx.fillRect(398, 594, 14, 10); } },
  { id: 'sandwich', label: 'someone took a bite', x: 360, y: 608, r: 24,
    alter(ctx) { circle(ctx, 384, 620, 10, SAND); circle(ctx, 388, 612, 7, SAND); } },
  { id: 'bucket', label: 'the bucket tipped over', x: 330, y: 622, r: 26,
    alter(ctx) { ctx.fillStyle = SAND; ctx.fillRect(306, 596, 80, 56); ctx.save(); ctx.translate(330, 628); ctx.rotate(1.35); poly(ctx, [[-16, -18], [16, -18], [12, 16], [-12, 16]], '#4dabf7', '#2b6cb0', 3); ctx.restore(); } },
];

// ---------------------------------------------------------------- camp
function paintCamp(ctx) {
  ctx.fillStyle = SKY_NIGHT;
  ctx.fillRect(0, 0, 600, 680);
  // Stars.
  const stars = [[60, 70], [150, 40], [240, 90], [330, 50], [430, 90], [520, 50], [90, 160], [200, 140], [300, 170], [470, 150], [560, 120], [40, 240], [540, 220]];
  stars.forEach(([x, y]) => { star(ctx, x, y, 7, '#ffffff'); });
  star(ctx, 350, 110, 9, '#ffd93b');
  // Moon.
  circle(ctx, 500, 90, 44, '#fff3b0', '#e8d27a', 3);
  circle(ctx, 484, 78, 9, '#e8d27a');
  circle(ctx, 514, 102, 7, '#e8d27a');
  // Mountains.
  poly(ctx, [[0, 420], [140, 260], [300, 420]], '#2b3a67');
  poly(ctx, [[220, 420], [380, 240], [560, 420]], '#31427a');
  poly(ctx, [[340, 282], [380, 240], [420, 282]], '#ffffff');
  poly(ctx, [[0, 420], [600, 420], [600, 680], [0, 680]], '#1c2f22');
  // Pine trees.
  function pine(x, y, s) {
    poly(ctx, [[x - 44 * s, y], [x, y - 90 * s], [x + 44 * s, y]], '#43a047');
    poly(ctx, [[x - 36 * s, y - 48 * s], [x, y - 130 * s], [x + 36 * s, y - 48 * s]], '#43a047');
    ctx.fillStyle = '#5d3a17';
    ctx.fillRect(x - 6 * s, y, 12 * s, 22 * s);
  }
  pine(90, 500, 1);
  pine(180, 520, 0.8);
  pine(540, 510, 0.9);
  ctx.fillStyle = GROUND_NIGHT;
  ctx.fillRect(0, 500, 600, 180);
  // Tent.
  poly(ctx, [[250, 560], [350, 420], [450, 560]], '#ff7043', '#d84315', 4);
  poly(ctx, [[322, 560], [350, 486], [378, 560]], '#5d3a17');
  ctx.strokeStyle = '#d84315';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(350, 420);
  ctx.lineTo(350, 392);
  ctx.stroke();
  poly(ctx, [[350, 392], [382, 400], [350, 410]], '#ffd93b');
  // Owl on a branch.
  ctx.strokeStyle = '#5d3a17';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(60, 400);
  ctx.lineTo(160, 388);
  ctx.stroke();
  ellipse(ctx, 110, 366, 26, 32, '#8a5a2b', '#5d3a17', 3);
  circle(ctx, 100, 352, 10, '#ffffff');
  circle(ctx, 122, 352, 10, '#ffffff');
  circle(ctx, 100, 352, 4, '#222222');
  circle(ctx, 122, 352, 4, '#222222');
  poly(ctx, [[108, 368], [114, 376], [108, 382]], '#f5b301');
  // Campfire.
  circle(ctx, 300, 610, 8, '#9c9c9c');
  circle(ctx, 330, 616, 8, '#9c9c9c');
  circle(ctx, 270, 616, 8, '#9c9c9c');
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(282, 606); ctx.lineTo(318, 596);
  ctx.moveTo(318, 606); ctx.lineTo(282, 596);
  ctx.stroke();
  ctx.fillStyle = '#ff8f1f';
  ctx.beginPath();
  ctx.moveTo(300, 592);
  ctx.quadraticCurveTo(272, 560, 288, 530);
  ctx.quadraticCurveTo(300, 548, 306, 528);
  ctx.quadraticCurveTo(318, 552, 322, 534);
  ctx.quadraticCurveTo(332, 566, 316, 592);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.moveTo(300, 592);
  ctx.quadraticCurveTo(288, 570, 296, 552);
  ctx.quadraticCurveTo(306, 566, 312, 552);
  ctx.quadraticCurveTo(314, 574, 308, 592);
  ctx.closePath();
  ctx.fill();
  // Marshmallow stick.
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(392, 640);
  ctx.lineTo(360, 576);
  ctx.stroke();
  circle(ctx, 358, 570, 11, '#ffffff', '#d8dee9', 2);
  // Lantern on a stick.
  ctx.strokeStyle = '#5d3a17';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(470, 560);
  ctx.lineTo(470, 480);
  ctx.stroke();
  rr(ctx, 452, 480, 36, 44, 8, '#ffd93b', '#8a6d3b', 3);
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.arc(470, 502, 26, 0, Math.PI * 2);
  ctx.fill();
  // Sleeping bag and backpack.
  rr(ctx, 500, 620, 76, 34, 16, '#4dabf7', '#2b6cb0', 3);
  rr(ctx, 170, 600, 56, 48, 10, '#e5484d', '#a52a2a', 3);
  rr(ctx, 184, 616, 28, 18, 4, '#ffd93b');
}

const CAMP_DIFFS = [
  { id: 'shooting-star', label: 'a shooting star appears', x: 250, y: 210, r: 26,
    alter(ctx) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(210, 190); ctx.lineTo(290, 226); ctx.stroke(); star(ctx, 292, 227, 9, '#ffffff'); } },
  { id: 'owl-eyes', label: 'the owl fell asleep', x: 111, y: 356, r: 26,
    alter(ctx) { circle(ctx, 100, 352, 11, '#8a5a2b'); circle(ctx, 122, 352, 11, '#8a5a2b'); ctx.strokeStyle = '#222222'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(100, 354, 6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(122, 354, 6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); } },
  { id: 'tent-door', label: 'the tent door is open', x: 350, y: 524, r: 26,
    alter(ctx) { poly(ctx, [[330, 560], [350, 496], [370, 560]], '#1b2a52'); } },
  { id: 'flames', label: 'the fire lost its yellow heart', x: 304, y: 560, r: 22,
    alter(ctx) { ctx.fillStyle = '#ff8f1f'; ctx.beginPath(); ctx.moveTo(300, 592); ctx.quadraticCurveTo(288, 570, 296, 552); ctx.quadraticCurveTo(306, 566, 312, 552); ctx.quadraticCurveTo(314, 574, 308, 592); ctx.closePath(); ctx.fill(); } },
  { id: 'lantern', label: 'the lantern went out', x: 470, y: 502, r: 26,
    alter(ctx) { rr(ctx, 452, 480, 36, 44, 8, '#8a6d3b'); } },
  { id: 'marshmallow', label: 'the marshmallow is gone', x: 358, y: 570, r: 18,
    alter(ctx) { circle(ctx, 358, 570, 13, GROUND_NIGHT); } },
  { id: 'pine', label: 'a pine tree turned autumn orange', x: 180, y: 460, r: 40,
    alter(ctx) { poly(ctx, [[142, 522], [180, 446], [218, 522]], '#e8590c'); poly(ctx, [[148, 484], [180, 414], [212, 484]], '#e8590c'); } },
  { id: 'backpack', label: 'the backpack patch changed colour', x: 198, y: 625, r: 20,
    alter(ctx) { rr(ctx, 184, 616, 28, 18, 4, '#2f9e44'); } },
  { id: 'snowcap', label: 'the snowcap melted', x: 380, y: 262, r: 26,
    alter(ctx) { poly(ctx, [[340, 282], [380, 240], [420, 282]], '#31427a'); } },
];

// ---------------------------------------------------------------- registry
export const SCENES = {
  garden: { paint: paintGarden, differences: GARDEN_DIFFS },
  seaside: { paint: paintSeaside, differences: SEASIDE_DIFFS },
  camp: { paint: paintCamp, differences: CAMP_DIFFS },
};

/** Paint one panel of a scene: variant 0 original, variant 1 with differences. */
export function paintPanel(ctx, sceneId, variant) {
  const scene = SCENES[sceneId];
  scene.paint(ctx);
  if (variant === 1) {
    for (const diff of scene.differences) diff.alter(ctx);
  }
}
