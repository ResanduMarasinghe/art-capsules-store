import { useEffect, useRef } from 'react';

// Draws random batik-style curves and shapes
function drawBatik(ctx, width, height, color = '#111', lineCount = 18) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = 0.13;
  ctx.lineCap = 'round';
  for (let i = 0; i < lineCount; i++) {
    ctx.beginPath();
    // Random start/end points
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    // Random control points for curve
    const cx1 = Math.random() * width;
    const cy1 = Math.random() * height;
    const cx2 = Math.random() * width;
    const cy2 = Math.random() * height;
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 + Math.random() * 2.5;
    ctx.stroke();
    // Optionally add random dots
    if (Math.random() > 0.7) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        2 + Math.random() * 3,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.09;
      ctx.fill();
      ctx.globalAlpha = 0.13;
    }
  }
}

const BatikBackground = ({ width = 1200, height = 900, color = '#111', style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawBatik(ctx, width, height, color);
  }, [width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export default BatikBackground;
