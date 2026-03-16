import { useEffect, useRef } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let targetX = -100, targetY = -100;
    let x = -100,       y = -100;
    let vx = 0,         vy = 0;
    let rafId: number;

    // Spring stiffness — how hard it pulls toward the cursor
    const stiffness = 0.1;
    // Damping — how much velocity is preserved each frame (closer to 1 = bouncier)
    const damping = 0.72;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // Spring force toward target
      vx = (vx + (targetX - x) * stiffness) * damping;
      vy = (vy + (targetY - y) * stiffness) * damping;

      x += vx;
      y += vy;

      dot.style.transform = `translate(${x}px, ${y}px)`;
      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "var(--accent)",
        pointerEvents: "none",
        zIndex: 9999,
        translate: "-50% -50%",
        opacity: 0.75,
      }}
    />
  );
}
