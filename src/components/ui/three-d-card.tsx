"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ThreeDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  perspective?: number;
  depth?: number;
  containerClassName?: string;
}

export function ThreeDCard({
  children,
  className,
  containerClassName,
  maxTilt = 8,
  scale = 1.018,
  glare = true,
  perspective = 1100,
  depth,
  ...props
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  // Target values based on pointer
  const target = useRef({
    rx: 0,
    ry: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  // Current interpolated values for 120fps buttery smoothness
  const current = useRef({
    rx: 0,
    ry: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const updateCardTransform = useCallback(() => {
    if (!cardRef.current) return;

    // Linear interpolation (lerp)
    const factor = isHovered ? 0.12 : 0.08;
    current.current.rx += (target.current.rx - current.current.rx) * factor;
    current.current.ry += (target.current.ry - current.current.ry) * factor;
    current.current.glareX += (target.current.glareX - current.current.glareX) * factor;
    current.current.glareY += (target.current.glareY - current.current.glareY) * factor;
    current.current.glareOpacity += (target.current.glareOpacity - current.current.glareOpacity) * factor;

    const currentScale = isHovered ? scale : 1;
    cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${current.current.rx.toFixed(
      2
    )}deg) rotateY(${current.current.ry.toFixed(2)}deg) scale3d(${currentScale}, ${currentScale}, 1)`;

    // Update CSS custom property for glare position
    if (glare) {
      cardRef.current.style.setProperty("--glare-x", `${current.current.glareX.toFixed(1)}%`);
      cardRef.current.style.setProperty("--glare-y", `${current.current.glareY.toFixed(1)}%`);
      cardRef.current.style.setProperty(
        "--glare-opacity",
        `${current.current.glareOpacity.toFixed(2)}`
      );
    }

    // Keep animating if not close to target
    const diff =
      Math.abs(target.current.rx - current.current.rx) +
      Math.abs(target.current.ry - current.current.ry) +
      Math.abs(target.current.glareOpacity - current.current.glareOpacity);

    if (diff > 0.005 || isHovered) {
      rafId.current = requestAnimationFrame(updateCardTransform);
    } else {
      rafId.current = null;
    }
  }, [isHovered, maxTilt, scale, glare, perspective]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalize coordinates (-1 to 1)
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Invert X/Y for realistic 3D rotation
    target.current.rx = -normY * maxTilt;
    target.current.ry = normX * maxTilt;
    target.current.glareX = (x / rect.width) * 100;
    target.current.glareY = (y / rect.height) * 100;
    target.current.glareOpacity = 0.55;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateCardTransform);
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    target.current.glareOpacity = 0.55;
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateCardTransform);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    target.current.rx = 0;
    target.current.ry = 0;
    target.current.glareOpacity = 0;
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateCardTransform);
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      className={cn("perspective-1100 relative", containerClassName)}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={cn(
          "relative preserve-3d transition-shadow duration-300 ease-out will-change-transform",
          isHovered &&
          "shadow-[0_24px_50px_-8px_rgba(58,15,52,0.16),0_10px_24px_-4px_rgba(234,170,0,0.12)] border-accent-400/60",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          ...props.style,
        }}
        {...props}
      >
        {children}

        {/* Dynamic Specular Glass Light Flare */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-30"
            style={{
              opacity: "var(--glare-opacity, 0)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle 320px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.45), rgba(234, 170, 0, 0.15) 30%, transparent 65%)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

