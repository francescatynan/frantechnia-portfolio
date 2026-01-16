"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    if (prefersReduced.matches || coarsePointer.matches) {
      dot.style.display = "none";
      return;
    }

    gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 1 });

    const setX = gsap.quickSetter(dot, "x", "px");
    const setY = gsap.quickSetter(dot, "y", "px");

    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...position };
    let rafId = 0;

    const render = () => {
      position.x += (target.x - position.x) * 0.28;
      position.y += (target.y - position.y) * 0.28;
      setX(position.x);
      setY(position.y);
      rafId = window.requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const hoverSelector = "a, button, [data-cursor='hover']";
    const isHoverTarget = (el: EventTarget | null) =>
      el instanceof Element && el.closest(hoverSelector);

    const handleOver = (event: PointerEvent) => {
      if (isHoverTarget(event.target)) {
        gsap.to(dot, { scale: 1.8, duration: 0.2, ease: "power2.out" });
      }
    };

    const handleOut = (event: PointerEvent) => {
      if (isHoverTarget(event.target) && !isHoverTarget(event.relatedTarget)) {
        gsap.to(dot, { scale: 1, duration: 0.2, ease: "power2.out" });
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("pointerout", handleOut, { passive: true });
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />;
}
