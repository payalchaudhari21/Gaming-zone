import React, { useEffect, useState, useRef } from 'react';

const CursorTail = () => {
  const [enabled, setEnabled] = useState(true);
  const trailCount = 8;
  const dotsRef = useRef([]);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const dotCoords = useRef(Array.from({ length: trailCount }, () => ({ x: 0, y: 0 })));
  const requestRef = useRef();

  useEffect(() => {
    // Check if user prefers reduced motion or is on mobile/touch
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    
    if (reducedMotion || isTouch) {
      setEnabled(false);
      return;
    }

    const handleMouseMove = (e) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updateTrail = () => {
      let targetX = mouseCoords.current.x;
      let targetY = mouseCoords.current.y;

      dotCoords.current.forEach((dot, index) => {
        // Easing trail: lower index = faster follow, higher index = lag tail
        const ease = 0.16 + (index * 0.03); 
        dot.x += (targetX - dot.x) * ease;
        dot.y += (targetY - dot.y) * ease;

        const el = dotsRef.current[index];
        if (el) {
          el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) scale(${1 - index * 0.1})`;
        }

        targetX = dot.x;
        targetY = dot.y;
      });

      requestRef.current = requestAnimationFrame(updateTrail);
    };

    requestRef.current = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!enabled) return null;

  // Custom colors transitioning from cyan to purple/pink
  const colors = [
    'var(--accent-cyan)',
    '#00d2ff',
    '#00a8ff',
    '#70a1ff',
    'var(--accent-purple)',
    '#a55eea',
    '#ff007a',
    'var(--accent-pink)',
  ];

  return (
    <>
      {Array.from({ length: trailCount }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (dotsRef.current[index] = el)}
          style={{
            position: 'fixed',
            top: -6,
            left: -6,
            width: index === 0 ? 12 : 8,
            height: index === 0 ? 12 : 8,
            borderRadius: '50%',
            backgroundColor: colors[index],
            boxShadow: `0 0 10px ${colors[index]}, 0 0 20px ${colors[index]}`,
            pointerEvents: 'none',
            zIndex: 99999,
            opacity: 1 - index * 0.12,
            transition: 'opacity 0.1s ease',
            willChange: 'transform',
          }}
        />
      ))}
    </>
  );
};

export default CursorTail;
