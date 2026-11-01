"use client";

import React, { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  phase: number;
  speed: number;
  colorType: "aubergine" | "marigold" | "icesilver";
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number; // 0.3 (far) to 2.5 (near)
  size: number;
  color: string;
  speedY: number;
  phase: number;
}

export function LiquidGlassBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Mouse & physics tracking with fluid parallax
    const mouse = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.4,
      targetX: window.innerWidth * 0.5,
      targetY: window.innerHeight * 0.4,
      vx: 0,
      vy: 0,
      isMoving: false,
      lastMoveTime: performance.now(),
    };

    // Responsive sizing clamped for max 120fps GPU performance
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Track cursor movement
    let moveTimeout: ReturnType<typeof setTimeout> | null = null;
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isMoving = true;
      mouse.lastMoveTime = performance.now();

      if (moveTimeout) clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        mouse.isMoving = false;
      }, 150);

      // Spawn subtle Marigold & Ice Silver ripples on cursor glide
      if (Math.random() > 0.65 && ripples.length < 12) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 14,
          maxRadius: Math.random() * 110 + 75,
          alpha: 0.45,
          speed: 1.8,
        });
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isMoving = true;
        mouse.lastMoveTime = performance.now();
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Create 3D Liquid Blobs
    const blobCount = 9;
    const blobs: Blob[] = [];
    const colorTypes: ("aubergine" | "marigold" | "icesilver")[] = [
      "aubergine",
      "marigold",
      "icesilver",
      "aubergine",
      "marigold",
      "aubergine",
      "icesilver",
      "marigold",
      "aubergine",
    ];

    for (let i = 0; i < blobCount; i++) {
      const angle = (i / blobCount) * Math.PI * 2;
      const baseR = Math.min(width, height) * (0.16 + Math.random() * 0.12);
      blobs.push({
        x: width * 0.5 + Math.cos(angle) * (width * 0.25),
        y: height * 0.5 + Math.sin(angle) * (height * 0.25),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: baseR,
        baseRadius: baseR,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012,
        colorType: colorTypes[i % colorTypes.length],
      });
    }

    // 3D Parallax Floating Particles (Micro-prisms & Glass Dust)
    const particleCount = 28;
    const particles: Particle3D[] = [];
    const particleColors = [
      "rgba(234, 170, 0, 0.35)",  // Marigold
      "rgba(58, 15, 52, 0.22)",   // Aubergine
      "rgba(221, 227, 232, 0.6)", // Ice Silver
      "rgba(255, 255, 255, 0.7)", // Pure Glass Highlight
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.4 + Math.random() * 1.8, // 3D depth multiplier
        size: 1.5 + Math.random() * 3.5,
        color: particleColors[i % particleColors.length],
        speedY: 0.2 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const ripples: Ripple[] = [];
    let time = 0;

    const render = (currentTime: number) => {
      time += 0.014;

      // Update smoothed cursor position with fluid interpolation
      const easing = 0.065;
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;
      mouse.vx = dx * easing;
      mouse.vy = dy * easing;
      mouse.x += mouse.vx;
      mouse.y += mouse.vy;

      // Idle gentle wander
      const idleTime = currentTime - mouse.lastMoveTime;
      if (idleTime > 3000) {
        const wanderSpeed = 0.0008;
        const wanderX = width * 0.5 + Math.sin(currentTime * wanderSpeed) * (width * 0.22);
        const wanderY = height * 0.45 + Math.sin(currentTime * wanderSpeed * 2) * (height * 0.15);
        mouse.targetX += (wanderX - mouse.targetX) * 0.02;
        mouse.targetY += (wanderY - mouse.targetY) * 0.02;
      }

      // Base background: Crisp Ice Silver metallic gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#F7F9FB");
      bgGrad.addColorStop(0.4, "#EDF1F5");
      bgGrad.addColorStop(0.85, "#DDE3E8");
      bgGrad.addColorStop(1, "#CCD5DC");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 1: Flowing 3D Liquid Waves with Caustics ---
      ctx.save();
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseHeight = height * (0.32 + w * 0.28);
        const amp = 36 + w * 22;
        const freq = 0.0018 - w * 0.0003;
        const waveTime = time * (0.8 + w * 0.4);

        ctx.moveTo(0, height);
        ctx.lineTo(0, baseHeight);

        for (let x = 0; x <= width; x += 18) {
          const distToMouse = Math.hypot(x - mouse.x, baseHeight - mouse.y);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 380);
          const cursorOffset = Math.sin(distToMouse * 0.03 - time * 2) * 26 * mouseInfluence;

          const y =
            baseHeight +
            Math.sin(x * freq + waveTime) * amp +
            Math.cos(x * freq * 1.5 - waveTime * 0.8) * (amp * 0.4) +
            cursorOffset;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, baseHeight - amp, 0, height);
        if (w === 0) {
          waveGrad.addColorStop(0, "rgba(255, 255, 255, 0.65)");
          waveGrad.addColorStop(0.4, "rgba(58, 15, 52, 0.06)");
          waveGrad.addColorStop(1, "rgba(221, 227, 232, 0.15)");
        } else if (w === 1) {
          waveGrad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
          waveGrad.addColorStop(0.35, "rgba(234, 170, 0, 0.07)");
          waveGrad.addColorStop(1, "rgba(58, 15, 52, 0.04)");
        } else {
          waveGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
          waveGrad.addColorStop(0.5, "rgba(221, 227, 232, 0.35)");
          waveGrad.addColorStop(1, "rgba(234, 170, 0, 0.04)");
        }
        ctx.fillStyle = waveGrad;
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // --- LAYER 2: Moving 3D Liquid Blobs interacting with cursor ---
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        b.phase += b.speed;
        b.radius = b.baseRadius + Math.sin(b.phase + time) * (b.baseRadius * 0.14);

        const dxM = mouse.x - b.x;
        const dyM = mouse.y - b.y;
        const distM = Math.hypot(dxM, dyM);

        if (distM < 500) {
          const force = (1 - distM / 500) * 0.018;
          b.vx += dxM * force;
          b.vy += dyM * force;
          b.vx += -dyM * force * 0.65;
          b.vy += dxM * force * 0.65;
        }

        b.vx *= 0.94;
        b.vy *= 0.94;
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = height + b.radius;
        if (b.y > height + b.radius) b.y = -b.radius;

        ctx.save();
        const radGrad = ctx.createRadialGradient(
          b.x - b.radius * 0.25,
          b.y - b.radius * 0.25,
          b.radius * 0.05,
          b.x,
          b.y,
          b.radius
        );

        if (b.colorType === "aubergine") {
          radGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
          radGrad.addColorStop(0.35, "rgba(58, 15, 52, 0.08)");
          radGrad.addColorStop(0.75, "rgba(58, 15, 52, 0.04)");
          radGrad.addColorStop(1, "rgba(221, 227, 232, 0)");
        } else if (b.colorType === "marigold") {
          radGrad.addColorStop(0, "rgba(255, 255, 255, 0.65)");
          radGrad.addColorStop(0.4, "rgba(234, 170, 0, 0.12)");
          radGrad.addColorStop(0.8, "rgba(234, 170, 0, 0.04)");
          radGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        } else {
          radGrad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
          radGrad.addColorStop(0.5, "rgba(221, 227, 232, 0.25)");
          radGrad.addColorStop(1, "rgba(221, 227, 232, 0)");
        }

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- LAYER 3: 3D Floating Parallax Particles & Micro-Prisms ---
      ctx.save();
      const cursorShiftX = (mouse.x - width * 0.5) / (width * 0.5);
      const cursorShiftY = (mouse.y - height * 0.5) / (height * 0.5);

      for (let p = 0; p < particles.length; p++) {
        const pt = particles[p];
        pt.phase += 0.015;
        pt.y -= pt.speedY * pt.z;

        // Reset particle when it floats past top
        if (pt.y < -20) {
          pt.y = height + 20;
          pt.x = Math.random() * width;
        }

        // Apply 3D parallax offset proportional to z-depth
        const parallaxX = pt.x - cursorShiftX * (pt.z * 22) + Math.sin(pt.phase) * (pt.z * 4);
        const parallaxY = pt.y - cursorShiftY * (pt.z * 18);

        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, pt.size * pt.z * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 6 * pt.z;
        ctx.fill();

        // 3D specular sparkle on near particles
        if (pt.z > 1.2) {
          ctx.beginPath();
          ctx.arc(parallaxX - 1, parallaxY - 1, (pt.size * pt.z * 0.7) * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fill();
        }
      }
      ctx.restore();

      // --- LAYER 4: Interactive Liquid Ripples ---
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rp = ripples[r];
        rp.radius += rp.speed;
        rp.alpha *= 0.965;

        if (rp.alpha <= 0.01 || rp.radius >= rp.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(234, 170, 0, ${rp.alpha * 0.55})`;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = "rgba(234, 170, 0, 0.4)";
        ctx.shadowBlur = 8;
        ctx.stroke();

        if (rp.radius > 20) {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.radius * 0.75, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(221, 227, 232, ${rp.alpha * 0.5})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
        ctx.restore();
      }

      // --- LAYER 5: Dynamic Cursor-Anchored 3D Liquid Lens ---
      ctx.save();
      const orbRadius = 72 + Math.hypot(mouse.vx, mouse.vy) * 2.5;

      const cursorHalo = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        orbRadius * 1.8
      );
      cursorHalo.addColorStop(0, "rgba(255, 255, 255, 0.55)");
      cursorHalo.addColorStop(0.35, "rgba(234, 170, 0, 0.18)");
      cursorHalo.addColorStop(0.7, "rgba(58, 15, 52, 0.08)");
      cursorHalo.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = cursorHalo;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, orbRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Liquid glass lens body
      const lensGrad = ctx.createRadialGradient(
        mouse.x - orbRadius * 0.3,
        mouse.y - orbRadius * 0.3,
        orbRadius * 0.05,
        mouse.x,
        mouse.y,
        orbRadius
      );
      lensGrad.addColorStop(0, "rgba(255, 255, 255, 0.88)");
      lensGrad.addColorStop(0.3, "rgba(246, 248, 250, 0.55)");
      lensGrad.addColorStop(0.75, "rgba(221, 227, 232, 0.38)");
      lensGrad.addColorStop(0.95, "rgba(255, 255, 255, 0.82)");
      lensGrad.addColorStop(1, "rgba(234, 170, 0, 0.22)");

      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Specular glint
      ctx.beginPath();
      ctx.arc(
        mouse.x - orbRadius * 0.35,
        mouse.y - orbRadius * 0.35,
        orbRadius * 0.16,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowColor = "rgba(234, 170, 0, 0.75)";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (moveTimeout) clearTimeout(moveTimeout);
    };
  }, []);

  return (
    <>
      {/* 3D Liquid Glass Interactive Canvas with Hardware Containment */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
        style={{
          contain: "strict",
          willChange: "transform",
        }}
      />

      {/* Frosted Glass Overlay for tangible liquid glass refraction */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 backdrop-blur-[1.5px] bg-gradient-to-b from-white/30 via-transparent to-[#DDE3E8]/35"
      />
    </>
  );
}
