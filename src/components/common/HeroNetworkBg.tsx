import React, { useEffect, useRef } from 'react';

interface NetworkBgProps {
  /** opacity multiplier 0-1 */
  intensity?: number;
  isDark?: boolean;
  className?: string;
}

/**
 * HeroNetworkBg
 * Renders a subtle canvas-based animated network of nodes + connecting lines
 * that reacts to mouse cursor position. Designed for the hero background.
 */
export const HeroNetworkBg: React.FC<NetworkBgProps> = ({
  intensity = 1,
  isDark = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const onResize = () => resize();
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', onMouseMove);

    const NODE_COUNT = 40;
    const LINK_DIST  = 150;
    const MOUSE_DIST = 130;

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  1.5 + Math.random() * 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodeCol = isDark
        ? `rgba(96,165,250,${0.5 * intensity})`
        : `rgba(37,99,235,${0.28 * intensity})`;
      const accentCol = isDark
        ? `rgba(129,140,248,${0.7 * intensity})`
        : `rgba(79,70,229,${0.5 * intensity})`;

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // Mouse attraction – subtle
        const mdx = mouseRef.current.x - n.x;
        const mdy = mouseRef.current.y - n.y;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_DIST && md > 0) {
          n.vx += (mdx / md) * 0.018;
          n.vy += (mdy / md) * 0.018;
        }

        // Speed clamp
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd > 0.9) { n.vx = (n.vx / spd) * 0.9; n.vy = (n.vy / spd) * 0.9; }
      });

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.18 * intensity;
            ctx.beginPath();
            ctx.strokeStyle = isDark ? `rgba(99,102,241,${alpha})` : `rgba(99,102,241,${alpha * 0.7})`;
            ctx.globalAlpha = 1;
            ctx.lineWidth   = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const mdx = mouseRef.current.x - n.x;
        const mdy = mouseRef.current.y - n.y;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        const isNearMouse = md < MOUSE_DIST;

        ctx.beginPath();
        ctx.arc(n.x, n.y, isNearMouse ? n.r * 1.6 : n.r, 0, Math.PI * 2);
        ctx.fillStyle = isNearMouse ? accentCol : nodeCol;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [isDark, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};
