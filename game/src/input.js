// Mouse and keyboard input: clicks go to the world, keys drive pause, hints and restarts.
export const ACTION_PAUSE = 'pause';
export const ACTION_HINT = 'hint';
export const ACTION_CONFIRM = 'confirm';
export const ACTION_RESTART = 'restart';
export const ACTION_NEXT = 'next';

export function createInput(canvas, handlers) {
  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    const point = canvasPoint(event);
    handlers.onClick(point.x, point.y);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'p' || key === 'escape') handlers.onAction(ACTION_PAUSE);
    else if (key === 'h') handlers.onAction(ACTION_HINT);
    else if (key === 'enter' || key === ' ') handlers.onAction(ACTION_CONFIRM);
    else if (key === 'r') handlers.onAction(ACTION_RESTART);
    else if (key === 'n') handlers.onAction(ACTION_NEXT);
    else if (key === 'm') handlers.onAction('mute');
  });
}
