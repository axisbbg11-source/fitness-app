import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];

    // Dark theme matching FitCoach AI — orange + teal + dark neutrals
    const COLORS = [
      "#e8500a", "#c94209", "#a33208",   // oranges
      "#1dbe7a", "#0f8a57", "#13c075",   // teals
      "#2a2c2e", "#3a3c3e", "#444648",   // dark neutrals
    ];

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function mkParticle() {
      const angle = Math.random() * Math.PI * 2;
      const spd   = 0.15 + Math.random() * 0.4;
      return {
        x:           Math.random() * canvas.width,
        y:           Math.random() * canvas.height,
        z:           Math.random() * 800 + 100,
        vx:          Math.cos(angle) * spd,
        vy:          Math.sin(angle) * spd,
        vz:          (Math.random() - 0.5) * 0.6,
        color:       COLORS[Math.floor(Math.random() * COLORS.length)],
        baseSize:    1.0 + Math.random() * 2.2,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    }

    function init(count = 120) {
      particles = Array.from({ length: count }, mkParticle);
    }

    function project(x, y, z) {
      const fov   = 600;
      const scale = fov / (fov + z);
      return {
        sx:    canvas.width  / 2 + (x - canvas.width  / 2) * scale,
        sy:    canvas.height / 2 + (y - canvas.height / 2) * scale,
        scale,
      };
    }

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.sort((a, b) => b.z - a.z);

      // connections
      for (let i = 0; i < particles.length; i++) {
        const a  = particles[i];
        const pa = project(a.x, a.y, a.z);

        for (let j = i + 1; j < particles.length; j++) {
          const b  = particles[j];
          const pb = project(b.x, b.y, b.z);
          const dx = pa.sx - pb.sx;
          const dy = pa.sy - pb.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const alpha   = (1 - dist / 85) * 0.15 * pa.scale;
            const isOrange = a.color.startsWith("#e8") || a.color.startsWith("#c9") || a.color.startsWith("#a3");
            ctx.strokeStyle = isOrange
              ? `rgba(232,80,10,${alpha})`
              : `rgba(29,190,122,${alpha})`;
            ctx.lineWidth = 0.5 * pa.scale;
            ctx.beginPath();
            ctx.moveTo(pa.sx, pa.sy);
            ctx.lineTo(pb.sx, pb.sy);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const p of particles) {
        const { sx, sy, scale } = project(p.x, p.y, p.z);
        const pulse = 1 + 0.25 * Math.sin(frame * 0.035 + p.pulseOffset);
        const size  = p.baseSize * scale * pulse;

        // mouse repulsion
        const dx = sx - mouseRef.current.x;
        const dy = sy - mouseRef.current.y;
        const md = Math.sqrt(dx * dx + dy * dy);
        if (md < 90) {
          p.vx += (dx / md) * 0.12;
          p.vy += (dy / md) * 0.12;
        }

        // soft glow
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 3.5);
        grd.addColorStop(0,   p.color + "bb");
        grd.addColorStop(0.4, p.color + "33");
        grd.addColorStop(1,   p.color + "00");
        ctx.beginPath();
        ctx.arc(sx, sy, size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "dd";
        ctx.fill();

        // move + dampen
        p.x  += p.vx;  p.y  += p.vy;  p.z  += p.vz;
        p.vx *= 0.992; p.vy *= 0.992;

        // wrap
        if (p.x < 0)            p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0)            p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        if (p.z < 50)           p.z = 900;
        if (p.z > 950)          p.z = 100;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const onResize = () => resize();
    const onMove   = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave  = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        0,
        display:       "block",
      }}
    />
  );
}