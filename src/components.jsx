'use client';

import { useEffect, useRef } from 'react';

// ==================== ADVANCED 3D AI PARTICLE SYSTEM ====================
// 6 Layers: Floating Orbs, Network Nodes, DNA Helix, Pulse Waves, Shooting Streaks, Neural Firing
// BLACK BACKGROUND

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouch = (e) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const isMobile = window.innerWidth < 768;

    // ─── Layer 1: Floating Orbs ───
    const orbCount = isMobile ? 4 : 8;
    const orbs = [];
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 80 + 40,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.04 + 0.02,
        pulseSpeed: Math.random() * 0.002 + 0.001,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // ─── Layer 2: Network Particles ───
    const particleCount = isMobile ? 35 : 70;
    const maxDist = isMobile ? 100 : 140;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // ─── Layer 3: DNA Helix ───
    const dnaCount = isMobile ? 20 : 40;
    const dnaParticles = [];
    for (let i = 0; i < dnaCount; i++) {
      dnaParticles.push({
        t: i / dnaCount,
        phase: i * 0.3,
        speed: 0.003,
      });
    }

    // ─── Layer 4: Pulse Waves ───
    const pulseWaves = [];
    let lastPulseTime = 0;

    // ─── Layer 5: Shooting Streaks ───
    const streaks = [];
    const streakCount = isMobile ? 2 : 4;

    const animate = () => {
      const now = Date.now();
      timeRef.current += 0.016;
      const t = timeRef.current;

      // BLACK background clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ═══════════════════════════════════════════
      // LAYER 1: FLOATING ORBS
      // ═══════════════════════════════════════════
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        const dx = mouseRef.current.x - orb.x;
        const dy = mouseRef.current.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300 && dist > 0) {
          orb.vx += (dx / dist) * 0.005;
          orb.vy += (dy / dist) * 0.005;
        }
        orb.vx *= 0.998;
        orb.vy *= 0.998;

        const pulse = 1 + Math.sin(t * orb.pulseSpeed * 60 + orb.pulsePhase) * 0.3;
        const r = orb.radius * pulse;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
        gradient.addColorStop(0, `rgba(255, 112, 67, ${orb.opacity * 1.5})`);
        gradient.addColorStop(0.4, `rgba(255, 112, 67, ${orb.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 112, 67, 0)');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // ═══════════════════════════════════════════
      // LAYER 2: NETWORK PARTICLES
      // ═══════════════════════════════════════════
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;

        const pulse = 1 + Math.sin(t * 2 + p.pulsePhase) * 0.3;
        const sz = p.size * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, sz * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 112, 67, ${p.opacity * 0.08})`;
        ctx.fill();
      }

      // Network connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Mouse-to-particle connections
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouseRef.current.x;
        const dy = particles[i].y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(255, 112, 67, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // ═══════════════════════════════════════════
      // LAYER 3: DNA HELIX
      // ═══════════════════════════════════════════
      const helixX = canvas.width * 0.88;
      const helixH = canvas.height + 200;
      const helixAmplitude = isMobile ? 25 : 40;

      for (let i = 0; i < dnaParticles.length; i++) {
        const dp = dnaParticles[i];
        dp.phase += dp.speed;

        const y = dp.t * helixH + (t * 15 % helixH / dnaCount);
        const yPos = ((y % helixH) + helixH) % helixH;
        const angle = dp.phase + t * 0.8;

        const x1 = helixX + Math.sin(angle) * helixAmplitude;
        const x2 = helixX + Math.sin(angle + Math.PI) * helixAmplitude;
        const z1 = Math.cos(angle);
        const z2 = Math.cos(angle + Math.PI);

        const s1Size = 2 + z1 * 1;
        const s1Opacity = 0.2 + (z1 + 1) * 0.15;
        ctx.beginPath();
        ctx.arc(x1, yPos, Math.max(0.5, s1Size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 112, 67, ${s1Opacity})`;
        ctx.fill();

        const s2Size = 2 + z2 * 1;
        const s2Opacity = 0.2 + (z2 + 1) * 0.15;
        ctx.beginPath();
        ctx.arc(x2, yPos, Math.max(0.5, s2Size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 255, ${s2Opacity})`;
        ctx.fill();

        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, yPos);
          ctx.lineTo(x2, yPos);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(s1Opacity, s2Opacity) * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // ═══════════════════════════════════════════
      // LAYER 4: PULSE WAVES
      // ═══════════════════════════════════════════
      if (now - lastPulseTime > 4000) {
        pulseWaves.push({
          x: canvas.width * (0.2 + Math.random() * 0.6),
          y: canvas.height * (0.2 + Math.random() * 0.6),
          radius: 0,
          maxRadius: Math.max(canvas.width, canvas.height) * 0.4,
          opacity: 0.08,
          born: now,
        });
        lastPulseTime = now;
      }

      for (let i = pulseWaves.length - 1; i >= 0; i--) {
        const pw = pulseWaves[i];
        const age = (now - pw.born) / 1000;
        pw.radius = age * 80;
        pw.opacity = 0.08 * (1 - pw.radius / pw.maxRadius);

        if (pw.radius > pw.maxRadius) {
          pulseWaves.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(pw.x, pw.y, pw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 112, 67, ${pw.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ═══════════════════════════════════════════
      // LAYER 5: SHOOTING STREAKS
      // ═══════════════════════════════════════════
      if (streaks.length < streakCount && Math.random() < 0.005) {
        const startX = Math.random() * canvas.width;
        streaks.push({
          x: startX,
          y: -10,
          vx: (Math.random() - 0.3) * 3,
          vy: Math.random() * 4 + 3,
          length: Math.random() * 60 + 30,
          opacity: Math.random() * 0.3 + 0.1,
          life: 1,
        });
      }

      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.008;

        if (s.life <= 0 || s.y > canvas.height + 50) {
          streaks.splice(i, 1);
          continue;
        }

        const tailX = s.x - s.vx * s.length / s.vy;
        const tailY = s.y - s.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, 'rgba(255, 112, 67, 0)');
        gradient.addColorStop(1, `rgba(255, 200, 150, ${s.opacity * s.life})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.life * 0.5})`;
        ctx.fill();
      }

      // ═══════════════════════════════════════════
      // LAYER 6: NEURAL FIRING NODES
      // ═══════════════════════════════════════════
      const neuralCount = isMobile ? 8 : 15;
      for (let i = 0; i < neuralCount; i++) {
        const nx = (Math.sin(t * 0.3 + i * 1.7) * 0.4 + 0.5) * canvas.width;
        const ny = (Math.cos(t * 0.2 + i * 2.3) * 0.4 + 0.5) * canvas.height;
        const fire = Math.sin(t * 3 + i * 0.8);

        if (fire > 0.8) {
          const flashIntensity = (fire - 0.8) * 5;
          ctx.beginPath();
          ctx.arc(nx, ny, 6 * flashIntensity, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 112, 67, ${0.15 * flashIntensity})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(nx, ny, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 200, 150, ${0.4 * flashIntensity})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#000000',
      }}
      aria-hidden="true"
    />
  );
}