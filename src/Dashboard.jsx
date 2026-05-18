import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "./components";

/* ─────────────────────────────────────────
   ALL DASHBOARD CSS (scoped inside component)
───────────────────────────────────────── */
const DASHBOARD_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&family=Space+Mono:wght@400;700&display=swap');

:root {
  --white: #fff;
  --bg: #f5f5f0;
  --card: #fff;
  --border: #e8e8e3;
  --text: #1a1a1a;
  --muted: #888880;
  --accent: #ff4d00;
  --accent2: #00b894;
  --accent3: #0984e3;
  --warn: #fdcb6e;
  --danger: #d63031;
  --shadow: 0 2px 20px rgba(0,0,0,.07);
  --shadow-lg: 0 8px 40px rgba(0,0,0,.12);
  --radius: 16px;
  --radius-sm: 10px;
  --font: 'DM Sans', sans-serif;
  --font-display: 'Syne', sans-serif;
  --font-mono: 'Space Mono', monospace;
}

.dashboard-root * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
.dashboard-root { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; position: relative; }

/* LOADING */
#loadScreen { position: fixed; inset: 0; background: var(--white); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; z-index: 9999; transition: opacity .5s; }
#loadScreen.out { opacity: 0; pointer-events: none; }
.load-logo { font-family: var(--font-display); font-size: 2rem; font-weight: 800; }
.load-logo span { color: var(--accent); }
.load-bar-wrap { width: 200px; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-top: 12px; }
.load-bar { height: 100%; width: 0%; background: var(--accent); border-radius: 2px; transition: width .4s ease; }
.load-msg { font-size: .8rem; color: var(--muted); letter-spacing: .05em; }

/* NAV */
nav { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 14px; height: 54px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; gap: 8px; }
.nav-logo { font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; white-space: nowrap; }
.nav-logo span { color: var(--accent); }
.nav-right { display: flex; align-items: center; gap: 7px; flex-wrap: nowrap; }
.lang-toggle { display: flex; background: var(--bg); border-radius: 20px; padding: 3px; border: 1px solid var(--border); }
.lang-btn { padding: 4px 9px; border-radius: 16px; font-size: .7rem; font-weight: 600; border: none; cursor: pointer; background: transparent; color: var(--muted); font-family: var(--font); transition: all .2s; }
.lang-btn.active { background: var(--white); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,.1); }
.streak-badge { display: flex; align-items: center; gap: 4px; background: #fff8f5; border: 1px solid #ffd4c2; border-radius: 20px; padding: 4px 9px; font-size: .7rem; font-weight: 600; color: var(--accent); white-space: nowrap; }
.diet-nav-btn { background: var(--accent2); color: #fff; border: none; padding: 6px 11px; border-radius: 20px; font-size: .75rem; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap; }
.diet-nav-btn:hover { background: #27ae60; }

/* ── PREMIUM NAV BUTTON ── */
.premium-nav-btn {
  display: flex; align-items: center; gap: 5px;
  background: linear-gradient(135deg, #54535b, #879ca4);
  color: #fff; border: none; padding: 6px 13px;
  border-radius: 20px; font-size: .75rem; font-weight: 700;
  cursor: pointer; font-family: var(--font);
  box-shadow: 0 4px 14px rgba(117, 108, 105, 0.35);
  transition: all .2s; white-space: nowrap;
}
.premium-nav-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,77,0,.45); }
.premium-nav-btn:active { transform: translateY(0); }

/* LAYOUT */
.app-layout { display: grid; grid-template-columns: 1fr 310px; gap: 14px; padding: 14px; max-width: 1120px; margin: 0 auto; }

/* VIDEO SECTION */
.video-section { display: flex; flex-direction: column; gap: 11px; }
.exercise-selector { display: flex; gap: 7px; flex-wrap: wrap; }
.ex-btn { padding: 7px 13px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--white); font-family: var(--font); font-size: .78rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 5px; }
.ex-btn:hover { border-color: var(--accent); color: var(--accent); }
.ex-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 4px 12px rgba(131, 111, 95, 0.3); }
.difficulty-selector { display: flex; gap: 7px; flex-wrap: wrap; }
.diff-btn { padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--white); font-family: var(--font); font-size: .76rem; font-weight: 700; color: var(--muted); cursor: pointer; transition: all .25s; display: flex; align-items: center; gap: 5px; }
.diff-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,.08); }
.diff-btn.active { color: #fff; border-color: transparent; }
#diff-easy.active { background: linear-gradient(135deg,#00b894,#00cec9); box-shadow: 0 5px 18px rgba(0,184,148,.35); }
#diff-medium.active { background: linear-gradient(135deg,#fdcb6e,#f39c12); box-shadow: 0 5px 18px rgba(243,156,18,.35); }
#diff-hard.active { background: linear-gradient(135deg,#ff4d4d,#d63031); box-shadow: 0 5px 18px rgba(214,48,49,.35); }

/* VIDEO CARD */
.video-card { background: #574d4d; border-radius: var(--radius); overflow: hidden; position: relative; aspect-ratio: 4/3; box-shadow: var(--shadow-lg); min-height: 220px; }
video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
canvas { position: absolute; inset: 0; width: 100%; height: 100%; transform: scaleX(-1); }

/* HUD */
.hud-topleft { position: absolute; top: 11px; left: 11px; z-index: 10; display: flex; flex-direction: column; gap: 6px; }
.hud-badge { background: rgba(184,122,122,0.65); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.12); border-radius: 7px; padding: 5px 9px; color: #fff; font-size: .65rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.hud-badge.live { border-color: rgba(0,200,100,.4); color: #39ff14; }
.hud-badge.live::before { content: '● '; }
.hud-topright { position: absolute; top: 11px; right: 11px; z-index: 10; }
.form-score-wrap { background: rgba(0,0,0,.65); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.12); border-radius: 9px; padding: 7px 11px; display: flex; align-items: center; gap: 7px; color: #fff; }
.form-score-label { font-size: .58rem; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: .08em; }
.form-score-val { font-size: 1.05rem; font-weight: 700; color: var(--accent2); transition: color .3s; }
.form-score-val.perfect { color: #14ffff; }
.form-score-val.low { color: var(--warn); }

/* COACH OVERLAY */
#coachOverlay { position: absolute; bottom: 68px; left: 10px; right: 10px; z-index: 15; pointer-events: none; display: none; }
#coachOverlayBubble { background: rgba(0,0,0,.75); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.15); border-radius: 11px; padding: 9px 13px; color: #fff; font-size: .78rem; line-height: 1.5; }
#coachOverlayHindi { color: var(--accent); font-size: .7rem; margin-top: 3px; }

/* REP OVERLAY */
.rep-overlay { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; pointer-events: none; }
.rep-big { font-family: var(--font-display); font-size: 4rem; font-weight: 800; color: #fff; text-shadow: 0 4px 20px rgba(0,0,0,.5); line-height: 1; transition: transform .15s; }
.rep-big.bump { transform: scale(1.4); }
.rep-label { font-size: .7rem; font-weight: 600; color: rgba(255,255,255,.7); letter-spacing: .1em; text-transform: uppercase; }

/* START OVERLAY */
#startOverlay { position: absolute; inset: 0; background: rgba(0,0,0,.8); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; z-index: 20; backdrop-filter: blur(4px); border-radius: var(--radius); }
#startOverlay h2 { color: #fff; font-family: var(--font-display); font-size: 1.35rem; text-align: center; }
#startOverlay p { color: rgba(255,255,255,.6); font-size: .8rem; text-align: center; padding: 0 16px; }

/* BUTTONS */
.btn-primary { padding: 11px 26px; background: var(--accent); color: #fff; border: none; border-radius: 30px; font-family: var(--font); font-size: .88rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 18px rgba(255,77,0,.4); transition: all .2s; touch-action: manipulation; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(255,77,0,.5); }
.btn-primary:active { transform: translateY(0); }
.btn-secondary { padding: 8px 14px; background: var(--white); color: var(--text); border: 1.5px solid var(--border); border-radius: 9px; font-family: var(--font); font-size: .8rem; font-weight: 600; cursor: pointer; transition: all .2s; touch-action: manipulation; }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger { padding: 8px 14px; background: #fff0f0; color: var(--danger); border: 1.5px solid #ffc0c0; border-radius: 9px; font-family: var(--font); font-size: .8rem; font-weight: 600; cursor: pointer; transition: all .2s; touch-action: manipulation; }
.btn-danger:hover { background: var(--danger); color: #fff; }

/* COUNTDOWN */
#countdownOverlay { display: none; position: absolute; inset: 0; background: rgba(0,0,0,.88); align-items: center; justify-content: center; z-index: 25; flex-direction: column; gap: 9px; }
#countdownOverlay.show { display: flex; }
.countdown-num { font-family: var(--font-display); font-size: 6.5rem; font-weight: 800; color: #fff; animation: cPop .8s ease; }
@keyframes cPop { 0% { transform: scale(1.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.countdown-text { color: rgba(255,255,255,.7); font-size: .9rem; font-weight: 600; }

/* CONTROLS */
.controls-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.sets-control { display: flex; align-items: center; gap: 6px; margin-left: auto; font-size: .8rem; color: var(--muted); }
.sets-num { font-weight: 700; color: var(--text); font-size: .92rem; background: var(--white); border: 1.5px solid var(--border); border-radius: 7px; padding: 4px 9px; }
.sets-btn { width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--white); cursor: pointer; font-size: .95rem; font-weight: 700; color: var(--text); display: flex; align-items: center; justify-content: center; transition: all .15s; touch-action: manipulation; }
.sets-btn:hover { border-color: var(--accent); color: var(--accent); }
#errorBanner { display: none; background: #fff0f0; border: 1px solid #ffcdd2; color: var(--danger); padding: 9px 13px; border-radius: var(--radius-sm); font-size: .78rem; font-weight: 500; }

/* RIGHT PANEL */
.right-panel { display: flex; flex-direction: column; gap: 12px; }
.panel-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; box-shadow: var(--shadow); }
.panel-title { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); margin-bottom: 11px; }

/* STATS */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.stat-item { background: var(--bg); border-radius: var(--radius-sm); padding: 9px; display: flex; flex-direction: column; gap: 2px; }
.stat-item-label { font-size: .63rem; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }
.stat-item-val { font-size: 1.45rem; font-weight: 700; font-family: var(--font-display); color: var(--text); }
.stat-item-val.accent { color: var(--accent); }
.stat-item-val.green { color: var(--accent2); }

/* SET DOTS */
.set-dots { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.set-dot { width: 9px; height: 9px; border-radius: 50%; border: 2px solid var(--border); background: transparent; transition: all .3s; }
.set-dot.done { background: var(--accent2); border-color: var(--accent2); }
.set-dot.active { background: var(--accent); border-color: var(--accent); animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }

/* AI COACH */
.coach-box { display: flex; gap: 9px; align-items: flex-start; }
.coach-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,var(--accent),#ff8c42); display: flex; align-items: center; justify-content: center; font-size: .95rem; flex-shrink: 0; }
.coach-bubble { background: var(--bg); border-radius: 0 11px 11px 11px; padding: 9px 11px; font-size: .8rem; line-height: 1.5; color: var(--text); flex: 1; border: 1px solid var(--border); }
.coach-bubble .hindi { font-size: .72rem; color: var(--accent); margin-top: 3px; font-weight: 500; }
.auto-diff-badge { display: inline-flex; align-items: center; gap: 4px; background: linear-gradient(135deg,#6c5ce7,#a29bfe); color: #fff; border-radius: 11px; padding: 3px 9px; font-size: .65rem; font-weight: 700; margin-top: 7px; letter-spacing: .04em; }

/* FORM FEEDBACK */
.feedback-box { background: #f0faf5; border: 1px solid #b2dfdb; border-radius: var(--radius-sm); padding: 9px 11px; font-size: .8rem; color: #2d6a4f; font-weight: 500; line-height: 1.5; min-height: 48px; transition: all .3s; }
.feedback-box.warn { background: #fff8e1; border-color: #ffe082; color: #7b5800; }
.feedback-box.error { background: #fff0f0; border-color: #ffcdd2; color: #c62828; }
.feedback-box.perfect { background: #e8f8e8; border-color: #4caf50; color: #1b5e20; }

/* JOINT ANGLES */
.progress-wrap { display: flex; flex-direction: column; gap: 7px; }
.progress-row { display: flex; align-items: center; gap: 7px; }
.progress-label { font-size: .72rem; font-weight: 600; width: 68px; }
.progress-bar { flex: 1; height: 6px; background: var(--bg); border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
.progress-fill { height: 100%; border-radius: 3px; transition: width .4s ease; }
.progress-val { font-size: .7rem; color: var(--muted); width: 30px; text-align: right; }

/* HISTORY */
.history-list { display: flex; flex-direction: column; gap: 6px; }
.history-item { display: flex; align-items: center; gap: 7px; padding: 7px 9px; background: var(--bg); border-radius: var(--radius-sm); font-size: .78rem; }
.history-icon { width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: .9rem; }
.history-info { flex: 1; }
.history-name { font-weight: 600; }
.history-detail { color: var(--muted); font-size: .7rem; }
.history-reps { font-weight: 700; font-family: var(--font-display); color: var(--accent); }

/* DIET PLAN */
.diet-plan-text { font-size: .8rem; line-height: 1.65; color: var(--text); white-space: pre-wrap; }
.spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; margin-right: 5px; vertical-align: middle; }
@keyframes spin { to { transform: rotate(360deg); } }

/* REST TIMER */
#restTimer { display: none; position: fixed; bottom: 18px; right: 18px; background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 13px 16px; box-shadow: var(--shadow-lg); z-index: 200; text-align: center; min-width: 120px; }
#restTimer.show { display: block; animation: sUp .3s ease; }
@keyframes sUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.rest-label { font-size: .65rem; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: .1em; }
.rest-count { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--accent3); line-height: 1; }
.rest-sub { font-size: .65rem; color: var(--muted); }

/* CELEBRATION */
.celebration { position: fixed; inset: 0; pointer-events: none; z-index: 500; display: none; }
.celebration.show { display: block; }
.confetti-piece { position: absolute; border-radius: 2px; animation: cFall 2s ease forwards; }
@keyframes cFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

/* DIET MODAL */
.diet-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.72); z-index: 1000; align-items: center; justify-content: center; padding: 12px; }
.diet-modal.show { display: flex; }
.diet-modal-content { background: var(--bg); border-radius: 15px; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; padding: 18px; position: relative; }
.diet-modal-close { position: absolute; top: 11px; right: 12px; background: none; border: none; color: var(--muted); font-size: 1.3rem; cursor: pointer; line-height: 1; }
.diet-modal-title { font-size: 1rem; font-weight: 700; margin-bottom: 13px; color: var(--accent); }
.diet-input-label { display: block; margin-bottom: 5px; font-weight: 600; font-size: .83rem; }
.diet-textarea { width: 100%; height: 105px; padding: 9px 11px; border: 2px solid var(--border); border-radius: 9px; background: var(--white); color: var(--text); font-size: .88rem; resize: vertical; margin-bottom: 9px; font-family: var(--font); }
.diet-textarea:focus { border-color: var(--accent); outline: none; }
.diet-presets { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
.diet-preset-btn { background: var(--white); border: 1px solid var(--border); padding: 5px 9px; border-radius: 14px; font-size: .76rem; cursor: pointer; transition: all .2s; font-family: var(--font); }
.diet-preset-btn:hover { border-color: var(--accent); color: var(--accent); }
.diet-analyze-btn { width: 100%; padding: 12px; font-size: .9rem; margin-bottom: 12px; }
.diet-results { background: var(--white); border-radius: 11px; padding: 13px; border: 1px solid var(--border); }
.diet-result-title { font-size: .9rem; font-weight: 700; margin-bottom: 9px; color: var(--accent); }
.diet-macros { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin-bottom: 11px; }
.diet-macro { text-align: center; padding: 8px 3px; background: var(--bg); border-radius: 7px; }
.diet-macro-val { font-size: 1rem; font-weight: 700; display: block; }
.diet-macro-label { font-size: .64rem; color: var(--muted); }
.diet-macro.cal .diet-macro-val { color: #e74c3c; }
.diet-macro.pro .diet-macro-val { color: #3498db; }
.diet-macro.carb .diet-macro-val { color: #f39c12; }
.diet-macro.fat .diet-macro-val { color: #9b59b6; }
.diet-suggestion { background: var(--bg); padding: 10px; border-radius: 7px; margin-top: 7px; font-size: .82rem; line-height: 1.5; }
.diet-suggestion-hi { color: var(--muted); font-style: italic; margin-top: 3px; }
.diet-loading { text-align: center; padding: 22px; color: var(--muted); }

/* ══════════════════════════════════════════
   PAYMENT MODAL — UPI ONLY
══════════════════════════════════════════ */
.pay-backdrop {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,.8); z-index: 3000;
  align-items: center; justify-content: center;
  padding: 16px; backdrop-filter: blur(8px);
}
.pay-backdrop.show { display: flex; }

.pay-modal {
  width: 100%; max-width: 480px;
  border-radius: 22px; overflow: hidden;
  animation: payUp .3s cubic-bezier(.22,1,.36,1);
  box-shadow: 0 40px 100px rgba(0,0,0,.7);
  position: relative; background: #0f1117;
}
@keyframes payUp {
  from { transform: translateY(24px) scale(.97); opacity: 0; }
  to   { transform: translateY(0)    scale(1);   opacity: 1; }
}

/* Header strip */
.pay-header {
  background: linear-gradient(135deg, #1a1500 0%, #2a1800 100%);
  border-bottom: 1px solid #2a2200;
  padding: 22px 24px 18px;
  display: flex; align-items: flex-start; justify-content: space-between;
}
.pay-header-left {}
.pay-header-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,77,0,.15); border: 1px solid rgba(255,77,0,.3);
  color: #ff8c42; font-size: 10px; font-weight: 700;
  padding: 3px 9px; border-radius: 20px; margin-bottom: 8px;
  letter-spacing: .08em; text-transform: uppercase;
}
.pay-header-title {
  font-family: var(--font-display); font-size: 22px;
  font-weight: 800; color: #e8eaf6; line-height: 1.1;
}
.pay-header-title span { color: #ff4d00; }
.pay-header-price {
  margin-top: 6px; display: flex; align-items: baseline; gap: 6px;
}
.pay-price-main {
  font-family: var(--font-mono); font-size: 30px;
  font-weight: 700; color: #fff; letter-spacing: -1px;
}
.pay-price-was {
  font-size: 13px; color: #4a5270;
  text-decoration: line-through; font-family: var(--font-mono);
}
.pay-price-save {
  font-size: 11px; font-weight: 700; color: #4ade80;
  background: #0d2a1a; border: 1px solid #1a5c35;
  padding: 2px 7px; border-radius: 10px;
}

/* Plan toggle */
.pay-plan-toggle {
  display: flex; gap: 8px; margin-top: 14px;
}
.pay-plan-opt {
  flex: 1; padding: 9px 10px; border-radius: 10px;
  border: 1.5px solid #2a2200; background: #1a1400;
  cursor: pointer; font-family: var(--font); transition: all .2s;
  text-align: center;
}
.pay-plan-opt.active {
  border-color: #ff4d00; background: #2a1000;
}
.pay-plan-opt-name {
  font-size: 11px; font-weight: 700;
  color: #8892b0; text-transform: uppercase; letter-spacing: .06em;
}
.pay-plan-opt.active .pay-plan-opt-name { color: #ff8c42; }
.pay-plan-opt-price {
  font-size: 16px; font-weight: 700; color: #c9d1e0;
  font-family: var(--font-mono); margin-top: 2px;
}
.pay-plan-opt.active .pay-plan-opt-price { color: #fff; }
.pay-plan-opt-desc { font-size: 10px; color: #4a5270; margin-top: 1px; }

/* Body */
.pay-body { padding: 22px 24px; }

/* UPI apps row */
.pay-upi-apps {
  display: flex; gap: 8px; margin-bottom: 20px;
}
.pay-upi-app {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 5px; padding: 10px 6px; border-radius: 12px;
  border: 1.5px solid #1e2130; background: #1a1d28;
  cursor: pointer; transition: all .2s; font-family: var(--font);
}
.pay-upi-app:hover { border-color: #ff4d00; background: #1e1a14; }
.pay-upi-app.active { border-color: #ff4d00; background: #1e1a14; }
.pay-upi-app-icon { font-size: 22px; line-height: 1; }
.pay-upi-app-name { font-size: 10px; font-weight: 600; color: #8892b0; }
.pay-upi-app.active .pay-upi-app-name { color: #ff8c42; }

/* Section label */
.pay-section-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .12em; color: #4a5270; margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.pay-section-label::after {
  content: ''; flex: 1; height: 1px; background: #1e2130;
}

/* Fields */
.pay-field-group { margin-bottom: 14px; }
.pay-field-label {
  font-size: 11px; color: #6b7280; margin-bottom: 6px;
  display: block; letter-spacing: .04em; font-weight: 600;
}
.pay-field-input {
  width: 100%; background: #13161f; border: 1.5px solid #1e2130;
  border-radius: 10px; padding: 12px 14px; color: #c9d1e0;
  font-size: 14px; font-family: var(--font); outline: none;
  transition: border-color .2s, background .2s;
}
.pay-field-input:focus { border-color: #ff4d00; background: #1a1400; }
.pay-field-input::placeholder { color: #3b4466; }
.pay-field-input-wrap { position: relative; }
.pay-field-suffix {
  position: absolute; right: 13px; top: 50%;
  transform: translateY(-50%); font-size: 12px;
  color: #4a5270; font-weight: 600; pointer-events: none;
}
.pay-field-row { display: flex; gap: 10px; }
.pay-field-row .pay-field-group { flex: 1; }

/* Coupon */
.pay-coupon-wrap { display: flex; gap: 8px; }
.pay-coupon-wrap .pay-field-input { flex: 1; }
.pay-apply-btn {
  background: #1e2130; color: #c9d1e0; font-weight: 700;
  font-size: 12px; padding: 12px 16px; border: 1.5px solid #2a2d3e;
  border-radius: 10px; cursor: pointer; font-family: var(--font);
  transition: all .2s; white-space: nowrap;
}
.pay-apply-btn:hover { border-color: #ff4d00; color: #ff4d00; }
.pay-coupon-msg { font-size: 11px; margin-top: 5px; font-weight: 600; }
.pay-coupon-msg.ok  { color: #4ade80; }
.pay-coupon-msg.err { color: #f87171; }

/* What you get */
.pay-perks {
  background: #13161f; border: 1px solid #1e2130;
  border-radius: 12px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 8px;
  margin-bottom: 18px;
}
.pay-perk {
  display: flex; align-items: center; gap: 9px;
  font-size: 12px; color: #8892b0;
}
.pay-perk-icon {
  width: 22px; height: 22px; border-radius: 6px;
  background: rgba(255,77,0,.12); border: 1px solid rgba(255,77,0,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; flex-shrink: 0;
}

/* Pay button */
.pay-now-btn {
  width: 100%; background: #ff4d00; color: #fff;
  font-size: 15px; font-weight: 700; font-family: var(--font);
  padding: 15px; border: none; border-radius: 12px;
  cursor: pointer; box-shadow: 0 6px 24px rgba(255,77,0,.45);
  transition: background .2s, transform .12s;
  position: relative; overflow: hidden; letter-spacing: .02em;
}
.pay-now-btn:hover { background: #e03d00; }
.pay-now-btn:active { transform: scale(.98); }
.pay-now-btn.loading .pay-btn-text { opacity: 0; }
.pay-now-btn .pay-spinner {
  display: none; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%); width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: spin .6s linear infinite;
}
.pay-now-btn.loading .pay-spinner { display: block; }
.pay-secure-note {
  text-align: center; margin-top: 11px;
  font-size: 11px; color: #3b4466;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}

/* Close */
.pay-close-btn {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255,255,255,.07); border: none;
  color: #6b7280; font-size: 13px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s; flex-shrink: 0;
}
.pay-close-btn:hover { background: rgba(255,255,255,.15); color: #e8eaf6; }

/* Success */
.pay-success {
  display: none; position: absolute; inset: 0;
  background: #0f1117; border-radius: 22px;
  align-items: center; justify-content: center;
  flex-direction: column; gap: 14px; z-index: 10; padding: 32px;
}
.pay-success.show { display: flex; }
.pay-success-circle {
  width: 72px; height: 72px; background: #0d2a1a;
  border: 2px solid #4ade80; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 30px; animation: popIn .4s ease;
}
@keyframes popIn {
  0% { transform: scale(.5); opacity: 0; }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.pay-success-title { font-size: 22px; font-weight: 800; color: #e8eaf6; font-family: var(--font-display); text-align: center; }
.pay-success-sub { font-size: 13px; color: #5c6480; text-align: center; line-height: 1.6; max-width: 280px; }
.pay-success-cta {
  margin-top: 8px; padding: 12px 28px;
  background: linear-gradient(180deg, #111 0%, #1a1a1a 100%);
  border-radius: 30px; font-family: var(--font);
  font-size: 14px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 18px rgba(103, 92, 92, 0.45); transition: all .2s;
}
.pay-success-cta:hover { background: #e03d00; transform: translateY(-1px); }

/* RESPONSIVE */
@media(max-width:860px) {
  .app-layout { grid-template-columns: 1fr; }
  .right-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
  #coachOverlay { display: block; }
  .video-card { aspect-ratio: 3/4; }
  .pay-modal { flex-direction: column; max-height: 95vh; overflow-y: auto; }
  .pay-left { width: 100%; flex-direction: row; flex-wrap: wrap; padding: 18px; gap: 12px; }
  .pay-amount-box { flex: 1; min-width: 180px; }
  .pay-methods { flex-direction: row; }
  .pay-plan-box { display: none; }
}
@media(max-width:560px) {
  nav { height: 50px; }
  .nav-logo { font-size: .95rem; }
  .diet-nav-btn { padding: 5px 9px; font-size: .7rem; }
  .streak-badge { padding: 3px 7px; font-size: .66rem; }
  .premium-nav-btn { padding: 5px 10px; font-size: .68rem; }
  .app-layout { padding: 9px; gap: 9px; }
  .right-panel { grid-template-columns: 1fr; gap: 9px; }
  .video-card { aspect-ratio: 9/14; }
  .rep-big { font-size: 3.2rem; }
  .controls-bar { flex-wrap: wrap; gap: 6px; }
  .sets-control { margin-left: 0; width: 100%; justify-content: flex-end; }
  .diet-macros { grid-template-columns: repeat(2,1fr); }
  #coachOverlay { display: block; }
  .pay-right { padding: 18px 16px; }
  .pay-field-row { flex-direction: column; gap: 0; }
}
@media(min-width:861px) {
  #coachOverlay { display: none !important; }
}
`;

/* ─────────────────────────────────────────
   EXERCISE CONFIG  (unchanged)
───────────────────────────────────────── */
const EX = {
  squat: {
    name: "Squat", emoji: "🏋️", downAngle: 100, upAngle: 160,
    coach: {
      en: ["Great squat! Back straight.", "Go lower — full depth!", "Excellent form!", "Push through your heels!", "Knees track over toes!"],
      hi: ["शानदार स्क्वाट!", "और नीचे जाएं!", "बेहतरीन फॉर्म!", "एड़ी से धक्का दें!", "घुटने पंजों पर रखें!"]
    },
    tips: { en: "Feet shoulder-width apart. Back straight. Thighs parallel to floor.", hi: "पैर कंधे चौड़ाई पर। पीठ सीधी। जांघ जमीन के समानांतर।" },
    formCheck(a) {
      const k = a.knee;
      if (k == null) return null;
      if (k > 168) return { type: "ok", en: "✅ Good standing — start going down", hi: "✅ तैयार — नीचे जाएं", score: 65 };
      if (k < 80) return { type: "perfect", en: "💚 Perfect deep squat!", hi: "💚 शानदार गहरी स्क्वाट!", score: 100 };
      if (k < 110) return { type: "perfect", en: "✅ Excellent squat depth!", hi: "✅ बेहतरीन गहराई!", score: 97 };
      if (k < 130) return { type: "ok", en: "✅ Good — go a bit lower", hi: "✅ थोड़ा और नीचे", score: 82 };
      if (k < 150) return { type: "warn", en: "⚠️ Lower until thighs are parallel", hi: "⚠️ जांघ जमीन के समानांतर तक", score: 60 };
      return { type: "ok", en: "✅ Coming down — control it", hi: "✅ नीचे आ रहे हैं", score: 72 };
    }
  },
  pushup: {
    name: "Push-up", emoji: "💪", downAngle: 90, upAngle: 160,
    coach: {
      en: ["Great push-up! Core tight!", "Lower your chest fully!", "Solid form!", "Keep body in a line!", "Elbows at 45°!"],
      hi: ["शानदार पुश-अप!", "छाती और नीचे!", "बेहतरीन!", "शरीर सीधा रखें!", "कोहनी 45° पर!"]
    },
    tips: { en: "Hands shoulder-width. Body straight. Lower chest to floor.", hi: "हाथ कंधे चौड़ाई पर। शरीर सीधा। छाती जमीन तक।" },
    formCheck(a) {
      const e = a.elbow;
      if (e == null) return null;
      if (e > 158) return { type: "ok", en: "✅ Top position — go down", hi: "✅ ऊपर — नीचे जाएं", score: 70 };
      if (e < 88) return { type: "perfect", en: "💚 Full depth — excellent!", hi: "💚 पूरी गहराई!", score: 100 };
      if (e < 110) return { type: "perfect", en: "✅ Great depth!", hi: "✅ बेहतरीन गहराई!", score: 95 };
      if (e < 130) return { type: "ok", en: "✅ Good — keep core tight", hi: "✅ कोर टाइट रखें", score: 82 };
      return { type: "ok", en: "✅ Going down — controlled", hi: "✅ नीचे जाएं", score: 74 };
    }
  },
  jumpingjack: {
    name: "Jumping Jack", emoji: "⭐", downAngle: 30, upAngle: 140,
    coach: {
      en: ["Arms fully overhead!", "Keep the rhythm!", "Great cardio!", "Land softly!", "Full range!"],
      hi: ["हाथ पूरे ऊपर!", "लय बनाएं!", "बेहतरीन कार्डियो!", "हल्के उतरें!", "पूरी रेंज!"]
    },
    tips: { en: "Arms fully overhead. Feet wide on jump. Land softly.", hi: "हाथ सिर के ऊपर। कूद में पैर चौड़े।" },
    formCheck(a) {
      const s = a.shoulder;
      if (s == null) return null;
      if (s > 125) return { type: "perfect", en: "💚 Arms high — perfect!", hi: "💚 हाथ ऊपर — बेहतरीन!", score: 98 };
      if (s > 90)  return { type: "ok",      en: "✅ Good — get arms higher",  hi: "✅ हाथ और ऊपर",             score: 80 };
      return { type: "ok", en: "✅ Keep rhythm!", hi: "✅ लय बनाएं!", score: 72 };
    }
  },
  lunge: {
    name: "Lunge", emoji: "🦵", downAngle: 90, upAngle: 160,
    coach: {
      en: ["Back knee near floor!", "Front knee behind toes!", "Great balance!", "Alternate legs!", "Deep lunge!"],
      hi: ["पिछला घुटना जमीन के पास!", "अगला घुटना पंजों के पीछे!", "बेहतरीन बैलेंस!", "पैर बदलें!", "गहरा लंज!"]
    },
    tips: { en: "Step forward, lower back knee toward floor. Front knee over ankle.", hi: "आगे कदम रखें, पिछला घुटना जमीन की ओर।" },
    formCheck(a) {
      const k = a.knee;
      if (k == null) return null;
      if (k < 95)  return { type: "perfect", en: "💚 Deep lunge — excellent!", hi: "💚 गहरा लंज!",    score: 100 };
      if (k < 120) return { type: "ok",      en: "✅ Good lunge depth",        hi: "✅ अच्छा लंज",    score: 85  };
      if (k < 145) return { type: "warn",    en: "⚠️ Lower for full range",    hi: "⚠️ और नीचे जाएं", score: 62  };
      return { type: "ok", en: "✅ Going down", hi: "✅ नीचे जाएं", score: 68 };
    }
  }
};

const DIFF = {
  easy:   { downOff: 50, upOff: 50, moveThr: 0.004, stabFr: 1 },
  medium: { downOff: 28, upOff: 28, moveThr: 0.006, stabFr: 2 },
  hard:   { downOff: 14, upOff: 14, moveThr: 0.009, stabFr: 3 }
};
const CAL_PER_REP = { squat: 0.32, pushup: 0.28, jumpingjack: 0.15, lunge: 0.30 };

/* ─────────────────────────────────────────
   TTS HELPERS
───────────────────────────────────────── */
const ttsQ_arr = [];
let tts_speaking = false;

function procTTS() {
  if (tts_speaking || !ttsQ_arr.length) return;
  tts_speaking = true;
  const { text, l } = ttsQ_arr.shift();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = l; u.rate = 1.1; u.volume = 0.9;
  u.onend = () => { tts_speaking = false; procTTS(); };
  u.onerror = () => { tts_speaking = false; procTTS(); };
  try { window.speechSynthesis.speak(u); } catch (e) { tts_speaking = false; }
}
function pushTTS(text, lc) {
  if (!window.speechSynthesis || !text) return;
  if (ttsQ_arr.length >= 2) ttsQ_arr.length = 0;
  ttsQ_arr.push({ text: String(text), l: lc });
  procTTS();
}
function speakDirect(text, lc) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  ttsQ_arr.length = 0; tts_speaking = false;
  setTimeout(() => { ttsQ_arr.push({ text: String(text), l: lc }); procTTS(); }, 80);
}

/* ─────────────────────────────────────────
   ANGLE CALC
───────────────────────────────────────── */
function ang3(A, B, C) {
  const ab = { x: A.x - B.x, y: A.y - B.y }, cb = { x: C.x - B.x, y: C.y - B.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const mag = Math.sqrt(ab.x ** 2 + ab.y ** 2) * Math.sqrt(cb.x ** 2 + cb.y ** 2);
  if (!mag) return 0;
  return Math.round(Math.acos(Math.min(1, Math.max(-1, dot / mag))) * 180 / Math.PI);
}

/* ─────────────────────────────────────────
   PAYMENT MODAL — UPI ONLY
───────────────────────────────────────── */
const PLANS = {
  yearly:  { label: "Yearly",  price: 999,  was: 1659, desc: "Save 40%", perMonth: "₹83/mo" },
  monthly: { label: "Monthly", price: 149,  was: null,  desc: "Billed monthly", perMonth: "₹149/mo" },
};
const COUPONS = { FIT20: 0.20, COACH10: 0.10, TRAIN15: 0.15 };
const UPI_APPS = [
  { id: "gpay",    icon: "G",  label: "GPay",    color: "#4285f4" },
  { id: "phonepe", icon: "₱",  label: "PhonePe", color: "#5f259f" },
  { id: "paytm",   icon: "P",  label: "Paytm",   color: "#00baf2" },
  { id: "bhim",    icon: "B",  label: "BHIM",     color: "#007bff" },
];

function PaymentModal({ isOpen, onClose }) {
  const [plan,       setPlan]      = useState("yearly");
  const [upiApp,     setUpiApp]    = useState("gpay");
  const [upiId,      setUpiId]     = useState("");
  const [fullName,   setFullName]  = useState("");
  const [email,      setEmail]     = useState("");
  const [mobile,     setMobile]    = useState("");
  const [coupon,     setCoupon]    = useState("");
  const [couponMsg,  setCouponMsg] = useState(null);
  const [discount,   setDiscount]  = useState(0);
  const [loading,    setLoading]   = useState(false);
  const [success,    setSuccess]   = useState(false);

  const base  = PLANS[plan].price;
  const final = Math.round(base * (1 - discount));

  function applyCoupon() {
    const key = coupon.trim().toUpperCase();
    const d   = COUPONS[key];
    if (d) { setDiscount(d); setCouponMsg({ type: "ok",  text: `✓ ${d * 100}% off applied!` }); }
    else   { setDiscount(0); setCouponMsg({ type: "err", text: "Invalid coupon code."        }); }
  }

  function handlePay() {
    if (!fullName.trim())  { alert("Please enter your full name.");  return; }
    if (!email.trim() || !email.includes("@")) { alert("Please enter a valid email."); return; }
    if (!mobile.trim() || mobile.replace(/\D/g,"").length < 10) { alert("Please enter a valid 10-digit mobile number."); return; }
    if (!upiId.trim() || !upiId.includes("@")) { alert("Please enter a valid UPI ID (e.g. name@upi)."); return; }
    setLoading(true);
    // 👉 Wire Razorpay / your payment gateway here
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2400);
  }

  function handleClose() {
    setSuccess(false); setLoading(false);
    setFullName(""); setEmail(""); setMobile(""); setUpiId("");
    setCoupon(""); setCouponMsg(null); setDiscount(0);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="pay-backdrop show" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="pay-modal">

        {/* ── Header ── */}
        <div className="pay-header">
          <div className="pay-header-left">
            <div className="pay-header-badge">⚡ FitCoach AI Premium</div>
            <div className="pay-header-title">Unlock <span>Everything</span></div>

            {/* Plan toggle */}
            <div className="pay-plan-toggle">
              {Object.entries(PLANS).map(([key, p]) => (
                <button key={key} className={`pay-plan-opt${plan === key ? " active" : ""}`} onClick={() => { setPlan(key); setDiscount(0); setCouponMsg(null); }}>
                  <div className="pay-plan-opt-name">{p.label}</div>
                  <div className="pay-plan-opt-price">₹{p.price}</div>
                  <div className="pay-plan-opt-desc">{p.desc}</div>
                </button>
              ))}
            </div>

            <div className="pay-header-price" style={{ marginTop: "12px" }}>
              <span className="pay-price-main">₹{final}</span>
              {PLANS[plan].was && discount === 0 && (
                <span className="pay-price-was">₹{PLANS[plan].was}</span>
              )}
              {discount > 0 && (
                <span className="pay-price-was">₹{base}</span>
              )}
              {(PLANS[plan].was || discount > 0) && (
                <span className="pay-price-save">
                  {discount > 0 ? `${discount * 100}% OFF` : "40% OFF"}
                </span>
              )}
            </div>
          </div>
          <button className="pay-close-btn" onClick={handleClose}>✕</button>
        </div>

        {/* ── Body ── */}
        <div className="pay-body" style={{ overflowY: "auto", maxHeight: "65vh" }}>

          {/* What you get */}
          <div className="pay-section-label">What's included</div>
          <div className="pay-perks">
            {[
              { icon: "🤖", text: "Unlimited AI coaching & form feedback" },
              { icon: "🍱", text: "Personalised diet plans after every session" },
              { icon: "📊", text: "Advanced analytics & joint-angle tracking" },
              { icon: "🔥", text: "Auto-difficulty upgrades & streak rewards" },
            ].map(({ icon, text }) => (
              <div key={text} className="pay-perk">
                <div className="pay-perk-icon">{icon}</div>
                {text}
              </div>
            ))}
          </div>

          {/* UPI App select */}
          <div className="pay-section-label">Pay via UPI</div>
          <div className="pay-upi-apps">
            {UPI_APPS.map(({ id, icon, label, color }) => (
              <button key={id} className={`pay-upi-app${upiApp === id ? " active" : ""}`} onClick={() => setUpiApp(id)}>
                <div className="pay-upi-app-icon"
                  style={{ width: 32, height: 32, borderRadius: 8, background: color,
                           display:"flex", alignItems:"center", justifyContent:"center",
                           color:"#fff", fontWeight:700, fontSize:14 }}>
                  {icon}
                </div>
                <div className="pay-upi-app-name">{label}</div>
              </button>
            ))}
          </div>

          {/* Personal details */}
          <div className="pay-section-label">Your details</div>

          <div className="pay-field-group">
            <label className="pay-field-label">Full Name</label>
            <input className="pay-field-input" placeholder="Rahul Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="pay-field-row">
            <div className="pay-field-group">
              <label className="pay-field-label">Email Address</label>
              <input className="pay-field-input" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="pay-field-group">
              <label className="pay-field-label">Mobile Number</label>
              <div className="pay-field-input-wrap">
                <input className="pay-field-input" placeholder="9876543210" maxLength={10}
                  value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g,""))}
                  style={{ paddingLeft: "38px" }} />
                <span className="pay-field-suffix" style={{ left: 13, right: "auto" }}>+91</span>
              </div>
            </div>
          </div>

          {/* UPI ID */}
          <div className="pay-section-label">UPI details</div>
          <div className="pay-field-group">
            <label className="pay-field-label">UPI ID</label>
            <div className="pay-field-input-wrap">
              <input
                className="pay-field-input"
                placeholder={upiApp === "gpay" ? "name@okicici" : upiApp === "phonepe" ? "number@ybl" : upiApp === "paytm" ? "number@paytm" : "number@upi"}
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ paddingRight: "60px" }}
              />
              <span className="pay-field-suffix">Verify</span>
            </div>
            <div style={{ fontSize: "11px", color: "#3b4466", marginTop: "5px" }}>
              A payment request will be sent to your {UPI_APPS.find(a => a.id === upiApp)?.label} app
            </div>
          </div>

          {/* Coupon */}
          <div className="pay-field-group">
            <label className="pay-field-label">Coupon Code <span style={{ color: "#3b4466", fontWeight: 400 }}>(optional)</span></label>
            <div className="pay-coupon-wrap">
              <input className="pay-field-input" placeholder="e.g. FIT20" value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()} />
              <button className="pay-apply-btn" onClick={applyCoupon}>Apply</button>
            </div>
            {couponMsg && <div className={`pay-coupon-msg ${couponMsg.type}`}>{couponMsg.text}</div>}
          </div>

          {/* Order summary row */}
          <div style={{
            background: "#13161f", border: "1px solid #1e2130", borderRadius: "10px",
            padding: "12px 14px", marginBottom: "16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "12px", color: "#8892b0", fontWeight: 600 }}>
                FitCoach AI Premium · {PLANS[plan].label}
              </div>
              <div style={{ fontSize: "10px", color: "#4a5270", marginTop: "2px" }}>
                {PLANS[plan].perMonth} · Auto-renews · Cancel anytime
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 700, color: "#fff" }}>
              ₹{final}
            </div>
          </div>

          {/* Pay button */}
          <button className={`pay-now-btn${loading ? " loading" : ""}`} onClick={handlePay} disabled={loading}>
            <span className="pay-btn-text">
              Pay ₹{final} via {UPI_APPS.find(a => a.id === upiApp)?.label}
            </span>
            <div className="pay-spinner"></div>
          </button>

          <div className="pay-secure-note">
            🔒 256-bit SSL · RBI-compliant · Powered by Razorpay
          </div>
        </div>

        {/* ── Success ── */}
        <div className={`pay-success${success ? " show" : ""}`}>
          <div className="pay-success-circle">✓</div>
          <div className="pay-success-title">You're Premium! 🎉</div>
          <div className="pay-success-sub">
            Payment of ₹{final} received.<br />
            All features unlocked. Receipt sent to {email || "your email"}.
          </div>
          <button className="pay-success-cta" onClick={handleClose}>Start Training →</button>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DASHBOARD COMPONENT
───────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────
  const [currentExercise, setCurrentExercise] = useState("squat");
  const [lang, setLangState]                  = useState("en");
  const [difficulty, setDifficultyState]      = useState("easy");
  const [sets, setSets]                       = useState(3);
  const [setsCompleted, setSetsCompleted]     = useState(0);
  const [reps, setReps]                       = useState(0);
  const [totalReps, setTotalReps]             = useState(0);
  const [calories, setCalories]               = useState(0);
  const [isRunning, setIsRunning]             = useState(false);
  const [showStop, setShowStop]               = useState(false);
  const [loadProgress, setLoadProgress]       = useState(0);
  const [loadMsg, setLoadMsg]                 = useState("Initializing…");
  const [loadVisible, setLoadVisible]         = useState(true);
  const [loadOut, setLoadOut]                 = useState(false);
  const [streak, setStreak]                   = useState(parseInt(localStorage.getItem("fitStreak") || "0"));
  const [formScore, setFormScoreState]        = useState("—");
  const [formScoreClass, setFormScoreClass]   = useState("form-score-val");
  const [coachMsg, setCoachMsgState]          = useState("Start your workout and I'll guide you!");
  const [coachHindi, setCoachHindiState]      = useState("वर्कआउट शुरू करें!");
  const [feedbackClass, setFeedbackClass]     = useState("feedback-box");
  const [feedbackText, setFeedbackText]       = useState("Stand in front of camera for real-time feedback.");
  const [kneeVal, setKneeVal]                 = useState("—");
  const [kneeW, setKneeW]                     = useState(0);
  const [hipVal, setHipVal]                   = useState("—");
  const [hipW, setHipW]                       = useState(0);
  const [shoulderVal, setShoulderVal]         = useState("—");
  const [shoulderW, setShoulderW]             = useState(0);
  const [historyLog, setHistoryLog]           = useState([]);
  const [dietPlanMsg, setDietPlanMsg]         = useState("Complete a set, then get your personalized diet plan.");
  const [dietBtnText, setDietBtnText]         = useState("🍽 Get Diet Plan");
  const [dietBtnDisabled, setDietBtnDisabled] = useState(false);
  const [dietModalOpen, setDietModalOpen]     = useState(false);
  const [dietInput, setDietInput]             = useState("");
  const [dietResults, setDietResults]         = useState(null);
  const [dietLoading, setDietLoading]         = useState(false);
  const [autoDiffVisible, setAutoDiffVisible] = useState(false);
  const [statTime, setStatTime]               = useState("0:00");
  const [restVisible, setRestVisible]         = useState(false);
  const [restCount, setRestCount]             = useState(30);
  const [celebVisible, setCelebVisible]       = useState(false);
  const [confetti, setConfetti]               = useState([]);
  const [startOverlayMode, setStartOverlayMode] = useState("start");
  const [completeSummary, setCompleteSummary] = useState("");
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [countdownNum, setCountdownNum]       = useState(3);
  const [liveVisible, setLiveVisible]         = useState(false);
  const [repBig, setRepBig]                   = useState(0);
  const [repBump, setRepBump]                 = useState(false);
  const [errorMsg, setErrorMsg]               = useState("");

  // ── PAYMENT STATE ──────────────────────
  const [paymentOpen, setPaymentOpen]         = useState(false);

  // ── Refs ────────────────────────────────
  const videoRef         = useRef(null);
  const canvasRef        = useRef(null);
  const poseRef          = useRef(null);
  const cameraRef        = useRef(null);
  const timerRef         = useRef(null);
  const restIvRef        = useRef(null);
  const workoutStartRef  = useRef(null);
  const isRunningRef     = useRef(false);
  const currentExRef     = useRef("squat");
  const langRef          = useRef("en");
  const difficultyRef    = useRef("easy");
  const setsRef          = useRef(3);
  const setsCompletedRef = useRef(0);
  const repsRef          = useRef(0);
  const totalRepsRef     = useRef(0);
  const caloriesRef      = useRef(0);
  const posePhaseRef     = useRef("up");
  const movingDownRef    = useRef(false);
  const movingUpRef      = useRef(false);
  const prevHipYRef      = useRef(null);
  const stableFramesRef  = useRef(0);
  const lastRepTSRef     = useRef(0);
  const formScoreHistRef = useRef([]);
  const smBuf            = useRef({ knee: [], elbow: [], shoulder: [], hip: [] });
  const lastCoachSpeakRef = useRef(0);
  const userOverrideDiffRef = useRef(false);
  const historyLogRef    = useRef([]);

  // ── Sync refs ───────────────────────────
  useEffect(() => { currentExRef.current   = currentExercise; }, [currentExercise]);
  useEffect(() => { langRef.current        = lang;            }, [lang]);
  useEffect(() => { difficultyRef.current  = difficulty;      }, [difficulty]);
  useEffect(() => { setsRef.current        = sets;            }, [sets]);
  useEffect(() => { setsCompletedRef.current = setsCompleted; }, [setsCompleted]);
  useEffect(() => { isRunningRef.current   = isRunning;       }, [isRunning]);

  // ── Inject CSS ───────────────────────────
  useEffect(() => {
    const tag = document.createElement("style");
    tag.id = "dashboard-css";
    tag.textContent = DASHBOARD_CSS;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  // ── MediaPipe CDN scripts ────────────────
  useEffect(() => {
    const scripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
    ];
    const loaded = [];
    scripts.forEach((src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement("script");
        s.src = src; s.crossOrigin = "anonymous";
        document.head.appendChild(s);
        loaded.push(s);
      }
    });
    return () => loaded.forEach((s) => s.remove());
  }, []);

  // ── Init ─────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoadMsg("Loading AI model…"); setLoadProgress(25);
      try { buildPose(); setLoadMsg("MediaPipe ready…"); } catch (e) { console.warn("Pose deferred:", e); }
      await new Promise((r) => setTimeout(r, 700));
      setLoadProgress(100); setLoadMsg("Ready!");
      setLoadOut(true);
      setTimeout(() => setLoadVisible(false), 500);
    })();
    // eslint-disable-next-line
  }, []);

  // ── Helpers ──────────────────────────────
  function smooth(type, val) {
    const b = smBuf.current[type]; b.push(val);
    if (b.length > 6) b.shift();
    return b.reduce((a, v) => a + v, 0) / b.length;
  }
  function clearSmooth() { Object.keys(smBuf.current).forEach((k) => (smBuf.current[k] = [])); }

  function buildPose() {
    // eslint-disable-next-line no-undef
    const pose = new Pose({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}` });
    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, enableSegmentation: false, minDetectionConfidence: 0.55, minTrackingConfidence: 0.55 });
    pose.onResults(onResults);
    poseRef.current = pose;
  }

  function onResults(res) {
    if (!res || !isRunningRef.current) return;
    const vid = videoRef.current, cv = canvasRef.current;
    if (!vid || !cv) return;
    const W = vid.videoWidth || 640, H = vid.videoHeight || 480;
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    ctx.save(); ctx.clearRect(0, 0, W, H); ctx.drawImage(res.image, 0, 0, W, H);
    if (res.poseLandmarks) {
      const lm = res.poseLandmarks;
      const fs = parseInt(document.getElementById("formScoreEl")?.textContent) || 0;
      const sc = fs >= 95 ? "#39ff14" : fs >= 80 ? "#00b894" : fs >= 60 ? "#fdcb6e" : "#ff4d4d";
      // eslint-disable-next-line no-undef
      drawConnectors(ctx, lm, POSE_CONNECTIONS, { color: sc, lineWidth: 4 });
      // eslint-disable-next-line no-undef
      drawLandmarks(ctx, lm, { color: "#ffffff", lineWidth: 1, radius: 5 });
      const lH = lm[23], rH = lm[24];
      if (lH && rH) {
        const hy = (lH.y + rH.y) / 2;
        if (prevHipYRef.current !== null) {
          const dy = hy - prevHipYRef.current, thr = DIFF[difficultyRef.current].moveThr;
          movingDownRef.current = dy > thr; movingUpRef.current = dy < -thr;
        }
        prevHipYRef.current = hy;
      }
      if (Math.abs(lm[11].x - lm[12].x) < 0.07) {
        setCoachMsg("Turn slightly sideways for better tracking", "बेहतर ट्रैकिंग के लिए थोड़ा मुड़ें");
      }
      if (detectRep(lm)) countRep();
    }
    ctx.restore();
  }

  function detectRep(lm) {
    if (!lm || lm.length < 29) return false;
    const ex = EX[currentExRef.current], D = DIFF[difficultyRef.current];
    let angles = {}, track = 0, detected = false;
    const vis = lm[11].visibility > 0.55 && lm[12].visibility > 0.55 && lm[23].visibility > 0.55 && lm[24].visibility > 0.55;
    if (!vis) return false;

    if (currentExRef.current === "squat" || currentExRef.current === "lunge") {
      const kL = ang3(lm[23], lm[25], lm[27]), kR = ang3(lm[24], lm[26], lm[28]);
      track = smooth("knee", (kL + kR) / 2); angles.knee = track;
      angles.hip = smooth("hip", ang3(lm[11], lm[23], lm[25]));
      updateJoints(track, angles.hip, null);
    } else if (currentExRef.current === "pushup") {
      const eL = ang3(lm[11], lm[13], lm[15]), eR = ang3(lm[12], lm[14], lm[16]);
      track = smooth("elbow", (eL + eR) / 2); angles.elbow = track;
      angles.shoulder = smooth("shoulder", ang3(lm[13], lm[11], lm[23]));
      updateJoints(track, null, angles.shoulder);
    } else if (currentExRef.current === "jumpingjack") {
      const sL = ang3(lm[13], lm[11], lm[23]), sR = ang3(lm[14], lm[12], lm[24]);
      track = smooth("shoulder", (sL + sR) / 2); angles.shoulder = track;
      updateJoints(null, null, track);
    }

    const fb = ex.formCheck(angles);
    if (fb) {
      setFeedbackClass("feedback-box" + (fb.type === "warn" ? " warn" : fb.type === "perfect" ? " perfect" : fb.type === "error" ? " error" : ""));
      setFeedbackText(langRef.current === "hi" ? fb.hi : fb.en);
      doSetFormScore(fb.score || 70);
      if (!userOverrideDiffRef.current) autoDiff(fb.score || 70);
    }

    if (posePhaseRef.current === "up" && track < ex.downAngle + D.downOff && movingDownRef.current) {
      stableFramesRef.current++;
      if (stableFramesRef.current >= D.stabFr) { posePhaseRef.current = "down"; stableFramesRef.current = 0; doTtsQ(langRef.current === "hi" ? "नीचे जाएं" : "Go down"); }
    } else if (posePhaseRef.current === "down" && track > ex.upAngle - D.upOff && movingUpRef.current) {
      stableFramesRef.current++;
      if (stableFramesRef.current >= D.stabFr) { posePhaseRef.current = "up"; detected = true; stableFramesRef.current = 0; doTtsQ(langRef.current === "hi" ? "ऊपर जाएं" : "Go up"); }
    } else {
      if (stableFramesRef.current > 0) stableFramesRef.current = Math.max(0, stableFramesRef.current - 1);
    }

    if (detected) {
      const now = Date.now();
      if (now - lastRepTSRef.current < 450) return false;
      lastRepTSRef.current = now;
    }
    return detected;
  }

  function doSetFormScore(score) {
    setFormScoreState(score + "%");
    setFormScoreClass("form-score-val" + (score >= 95 ? " perfect" : score < 60 ? " low" : ""));
  }

  function autoDiff(score) {
    formScoreHistRef.current.push(score);
    if (formScoreHistRef.current.length > 18) formScoreHistRef.current.shift();
    if (formScoreHistRef.current.length < 12) return;
    const avg = formScoreHistRef.current.reduce((a, b) => a + b, 0) / formScoreHistRef.current.length;
    let nd = difficultyRef.current;
    if (avg >= 95 && difficultyRef.current === "easy") nd = "medium";
    else if (avg >= 95 && difficultyRef.current === "medium") nd = "hard";
    else if (avg < 52 && difficultyRef.current === "hard") nd = "medium";
    else if (avg < 52 && difficultyRef.current === "medium") nd = "easy";
    if (nd !== difficultyRef.current) {
      doSetDifficulty(nd, false);
      formScoreHistRef.current = [];
      const up = avg >= 95;
      const msgE = up ? `🤖 Auto-upgraded to ${nd}! Great form!` : `🤖 Adjusted to ${nd} — focus on form`;
      const msgH = up ? `🤖 ${nd} मोड — शानदार फॉर्म!` : `🤖 ${nd} मोड — फॉर्म पर ध्यान दें`;
      setCoachMsg(msgE, msgH);
      speakDirect(langRef.current === "hi" ? msgH : msgE, langRef.current === "hi" ? "hi-IN" : "en-US");
      setAutoDiffVisible(true);
      setTimeout(() => setAutoDiffVisible(false), 4000);
    }
  }

  function updateJoints(knee, hip, shoulder) {
    if (knee     != null) { setKneeVal(Math.round(knee) + "°");     setKneeW(Math.min(100, (knee / 180) * 100));         }
    if (hip      != null) { setHipVal(Math.round(hip) + "°");       setHipW(Math.min(100, (hip / 180) * 100));           }
    if (shoulder != null) { setShoulderVal(Math.round(shoulder) + "°"); setShoulderW(Math.min(100, (shoulder / 180) * 100)); }
  }

  function countRep() {
    repsRef.current++; totalRepsRef.current++; caloriesRef.current += CAL_PER_REP[currentExRef.current];
    setReps(repsRef.current); setTotalReps(totalRepsRef.current); setCalories(Math.round(caloriesRef.current));
    setRepBig(repsRef.current); setRepBump(true);
    setTimeout(() => setRepBump(false), 200);
    speakRep(repsRef.current);
    if (repsRef.current % 5 === 0 || Math.random() < 0.20) {
      const ex = EX[currentExRef.current];
      const i = Math.floor(Math.random() * ex.coach.en.length);
      setCoachMsg(ex.coach.en[i], ex.coach.hi[i]);
      setTimeout(() => doTtsQ(langRef.current === "hi" ? ex.coach.hi[i] : ex.coach.en[i]), 600);
    }
  }

  function doTtsQ(text) { if (!isRunningRef.current) return; pushTTS(text, langRef.current === "hi" ? "hi-IN" : "en-US"); }
  function doSpeak(text) {
    if (!isRunningRef.current) return;
    const now = Date.now();
    if (now - lastCoachSpeakRef.current < 800) return;
    lastCoachSpeakRef.current = now;
    pushTTS(text, langRef.current === "hi" ? "hi-IN" : "en-US");
  }
  function speakRep(n) {
    const hi = ["","एक","दो","तीन","चार","पांच","छह","सात","आठ","नौ","दस","ग्यारह","बारह","तेरह","चौदह","पंद्रह","सोलह","सत्रह","अठारह","उन्नीस","बीस"];
    doTtsQ(langRef.current === "hi" ? (n <= 20 ? hi[n] : n.toString()) : n.toString());
  }
  function setCoachMsg(en, hi) {
    const m = langRef.current === "hi" ? hi : en;
    const s = langRef.current === "en" ? hi : en;
    setCoachMsgState(m); setCoachHindiState(s);
  }

  // ── Workout Controls ─────────────────────
  async function startWorkout() {
    try {
      const t = await navigator.mediaDevices.getUserMedia({ video: true });
      t.getTracks().forEach((tr) => tr.stop());
    } catch (e) {
      showErr("Camera access denied. Please allow camera in browser settings and reload.");
      return;
    }
    await doCountdown(3);
    isRunningRef.current = true; setIsRunning(true);
    workoutStartRef.current = Date.now();
    posePhaseRef.current = "up"; repsRef.current = 0; prevHipYRef.current = null;
    stableFramesRef.current = 0; formScoreHistRef.current = []; clearSmooth();
    lastCoachSpeakRef.current = 0;
    setReps(0); setRepBig(0);
    setLiveVisible(true); setShowStop(true); setStartOverlayMode("hidden");
    if (!poseRef.current) buildPose();
    // eslint-disable-next-line no-undef
    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (isRunningRef.current && poseRef.current) {
          try { await poseRef.current.send({ image: videoRef.current }); } catch (e) { }
        }
      },
      width: 640, height: 480
    });
    try {
      await cameraRef.current.start();
    } catch (e) {
      isRunningRef.current = false; setIsRunning(false);
      showErr("Could not start camera: " + e.message);
      setLiveVisible(false); setShowStop(false); setStartOverlayMode("start");
      return;
    }
    timerRef.current = setInterval(() => {
      if (!workoutStartRef.current) return;
      const e = Math.floor((Date.now() - workoutStartRef.current) / 1000);
      setStatTime(`${Math.floor(e / 60)}:${(e % 60).toString().padStart(2, "0")}`);
    }, 1000);
    updateStreak();
    const ex = EX[currentExRef.current];
    setCoachMsg(`Let's do ${setsRef.current} sets of ${ex.name}! ${ex.tips.en}`, `${setsRef.current} सेट ${ex.name}! ${ex.tips.hi}`);
    speakDirect(langRef.current === "hi" ? "शुरू करें!" : "Let's go!", langRef.current === "hi" ? "hi-IN" : "en-US");
  }

  function stopWorkout() {
    isRunningRef.current = false; setIsRunning(false);
    clearInterval(timerRef.current);
    if (cameraRef.current) { try { cameraRef.current.stop(); } catch (e) { } cameraRef.current = null; }
    try { if (videoRef.current?.srcObject) { videoRef.current.srcObject.getTracks().forEach((t) => t.stop()); videoRef.current.srcObject = null; } } catch (e) { }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    ttsQ_arr.length = 0; tts_speaking = false;
    setLiveVisible(false); setShowStop(false);
    doLogHistory(); doCelebrate();
    setCompleteSummary(`Total: ${totalRepsRef.current} reps · ${Math.round(caloriesRef.current)} cal · ${setsCompletedRef.current} sets`);
    setStartOverlayMode("complete");
  }

  function resetRepsAction() {
    repsRef.current = 0; posePhaseRef.current = "up"; stableFramesRef.current = 0;
    movingDownRef.current = false; movingUpRef.current = false; clearSmooth();
    setReps(0); setRepBig(0);
  }

  function nextSet() {
    if (!isRunningRef.current) return;
    doLogHistory();
    setsCompletedRef.current++; setSetsCompleted(setsCompletedRef.current);
    if (setsCompletedRef.current >= setsRef.current) {
      setCoachMsg("All sets done! 🎉", "सभी सेट पूरे! 🎉");
      speakDirect(langRef.current === "hi" ? "शानदार! सभी सेट पूरे!" : "All sets complete!", langRef.current === "hi" ? "hi-IN" : "en-US");
      stopWorkout(); return;
    }
    resetRepsAction(); startRest(30);
    setCoachMsg(`Set ${setsCompletedRef.current} done! Rest 30s.`, `सेट ${setsCompletedRef.current} पूरा! 30 सेकंड आराम।`);
  }

  function resetAll() {
    repsRef.current = 0; totalRepsRef.current = 0; setsCompletedRef.current = 0;
    caloriesRef.current = 0; formScoreHistRef.current = [];
    setReps(0); setRepBig(0); setTotalReps(0); setSetsCompleted(0);
    setCalories(0); setStatTime("0:00"); setFormScoreState("—"); setFormScoreClass("form-score-val");
    historyLogRef.current = []; setHistoryLog([]);
    setCoachMsg("Start your workout!", "वर्कआउट शुरू करें!");
    setStartOverlayMode("start");
  }

  function doCountdown(from) {
    return new Promise((res) => {
      setCountdownVisible(true); setCountdownNum(from);
      speakDirect(from.toString(), langRef.current === "hi" ? "hi-IN" : "en-US");
      let n = from;
      const iv = setInterval(() => {
        n--;
        if (n <= 0) { clearInterval(iv); setCountdownVisible(false); res(); }
        else { setCountdownNum(n); speakDirect(n.toString(), langRef.current === "hi" ? "hi-IN" : "en-US"); }
      }, 1000);
    });
  }

  function startRest(secs) {
    isRunningRef.current = false; setIsRunning(false);
    setRestVisible(true); setRestCount(secs);
    if (restIvRef.current) clearInterval(restIvRef.current);
    let r = secs;
    restIvRef.current = setInterval(() => {
      r--; setRestCount(r);
      if (r <= 3 && r > 0) speakDirect(r.toString(), langRef.current === "hi" ? "hi-IN" : "en-US");
      if (r <= 0) {
        clearInterval(restIvRef.current); setRestVisible(false);
        isRunningRef.current = true; setIsRunning(true);
        posePhaseRef.current = "up"; stableFramesRef.current = 0; clearSmooth();
        speakDirect(langRef.current === "hi" ? "जारी रखें!" : "Go again!", langRef.current === "hi" ? "hi-IN" : "en-US");
        setCoachMsg(`Set ${setsCompletedRef.current + 1} — Let's go!`, `सेट ${setsCompletedRef.current + 1} — चलो!`);
      }
    }, 1000);
  }

  function updateStreak() {
    const td = new Date().toDateString();
    const lastDate = localStorage.getItem("fitLastDate") || "";
    let s = parseInt(localStorage.getItem("fitStreak") || "0");
    if (lastDate !== td) { s++; localStorage.setItem("fitStreak", s); localStorage.setItem("fitLastDate", td); setStreak(s); }
  }

  function doCelebrate() {
    const cols = ["#ff4d00", "#00b894", "#0984e3", "#fdcb6e", "#e17055", "#6c5ce7"];
    const pieces = Array.from({ length: 65 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * -10,
      bg: cols[Math.floor(Math.random() * cols.length)],
      delay: Math.random() * 1.5, dur: 1.5 + Math.random(),
      w: 6 + Math.random() * 8, h: 6 + Math.random() * 8,
      radius: Math.random() > 0.5 ? "50%" : "2px"
    }));
    setConfetti(pieces); setCelebVisible(true);
    setTimeout(() => { setCelebVisible(false); setConfetti([]); }, 3200);
  }

  function doLogHistory() {
    if (!repsRef.current) return;
    const ex = EX[currentExRef.current];
    const item = { ...ex, reps: repsRef.current, set: setsCompletedRef.current + 1 };
    historyLogRef.current.push(item);
    setHistoryLog([...historyLogRef.current]);
  }

  function showErr(msg) { setErrorMsg(msg); setTimeout(() => setErrorMsg(""), 7000); }

  function doSelectExercise(ex) {
    setCurrentExercise(ex); currentExRef.current = ex;
    posePhaseRef.current = "up"; stableFramesRef.current = 0;
    movingDownRef.current = false; movingUpRef.current = false;
    repsRef.current = 0; formScoreHistRef.current = []; clearSmooth();
    setReps(0); setRepBig(0);
    setCoachMsg(EX[ex].tips.en, EX[ex].tips.hi);
    setFeedbackText(langRef.current === "hi" ? EX[ex].tips.hi : EX[ex].tips.en);
    if (isRunningRef.current) doSpeak(`${EX[ex].name} selected`);
  }

  function doSetLang(l) { setLangState(l); langRef.current = l; doSelectExercise(currentExRef.current); }

  function doSetDifficulty(lvl, byUser = true) {
    setDifficultyState(lvl); difficultyRef.current = lvl;
    if (byUser) { userOverrideDiffRef.current = true; formScoreHistRef.current = []; }
    if (byUser) {
      const msgs = {
        easy:   { en: "Easy mode — great for beginners!",  hi: "ईज़ी मोड!" },
        medium: { en: "Medium mode — push harder!",        hi: "मीडियम मोड!" },
        hard:   { en: "Hard mode — grind time!",           hi: "हार्ड मोड!" }
      };
      setCoachMsg(msgs[lvl].en, msgs[lvl].hi);
      if (isRunningRef.current) doSpeak(lvl + " mode");
    }
  }

  function doChangeSets(d) { const ns = Math.max(1, Math.min(10, setsRef.current + d)); setsRef.current = ns; setSets(ns); }

  function addPreset(f) { setDietInput((prev) => (prev ? prev + ", " + f : f)); }

  async function analyzeDiet() {
    if (!dietInput.trim()) { alert(lang === "hi" ? "कृपया खाने का नाम लिखें" : "Please enter what you ate"); return; }
    setDietLoading(true); setDietResults(null);
    const prompt = `You are a nutrition expert. Analyze these Indian meals: "${dietInput.trim()}"
Calories burned in this workout: ~${Math.round(caloriesRef.current)} kcal (${currentExRef.current}, ${difficultyRef.current} difficulty, ${totalRepsRef.current} total reps).
Return ONLY valid JSON, no markdown:
{"calories":<number>,"protein":<grams>,"carbs":<grams>,"fat":<grams>,"suggestionEn":"<2-sentence recommendation>","suggestionHi":"<same in Hindi>","goalProtein":<recommended daily protein grams>,"goalCalories":<recommended daily calories>}`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 400, messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      let data;
      try {
        const raw = (d?.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
        data = JSON.parse(raw);
      } catch (e) {
        data = { calories: 650, protein: 28, carbs: 75, fat: 18, suggestionEn: "Good meal! Ensure adequate protein for muscle recovery.", suggestionHi: "अच्छा भोजन! प्रोटीन जरूरी है।", goalProtein: 120, goalCalories: 2200 };
      }
      setDietResults(data);
      speakDirect(data.suggestionEn, "en-US");
    } catch (err) {
      setDietResults({ error: true });
    } finally {
      setDietLoading(false);
    }
  }

  async function getDietPlan() {
    setDietBtnDisabled(true); setDietBtnText("Generating…");
    setDietPlanMsg("Crafting your personalized plan…");
    const ex = EX[currentExRef.current];
    const prompt = `Sports nutritionist. Create a practical 1-day diet plan for someone who did ${setsCompletedRef.current || 1} sets of ${ex.name} (${difficultyRef.current}). Total reps: ${totalRepsRef.current}. Burned: ~${Math.round(caloriesRef.current)} kcal.\nFormat:\n🌅 Breakfast: ...\n🍎 Pre-workout: ...\n🍱 Lunch: ...\n💪 Post-workout: ...\n🌙 Dinner: ...\nUnder 100 words. Specific foods. End with one Hindi tip sentence.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 350, messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      setDietPlanMsg(d?.content?.[0]?.text || "Could not generate. Please try again.");
    } catch (e) {
      setDietPlanMsg("❌ Network error. Check your connection.");
    } finally {
      setDietBtnDisabled(false); setDietBtnText("↺ Regenerate Plan");
    }
  }

  const dots = Array.from({ length: sets }, (_, i) => ({
    id: i,
    cls: "set-dot" + (i < setsCompleted ? " done" : i === setsCompleted ? " active" : "")
  }));

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div className="dashboard-root">
  {/* ── 3D AI PARTICLE BACKGROUND ── */}
  <ParticleBackground />

  {/* ── CONTENT WRAPPER (sits above particles) ── */}
  <div style={{ position: "relative", zIndex: 1 }}>

  {/* LOAD SCREEN */}
  {loadVisible && (
        <div id="loadScreen" className={loadOut ? "out" : ""}>
          <div className="load-logo">Fit<span>Coach</span> AI</div>
          <div className="load-bar-wrap">
            <div className="load-bar" style={{ width: loadProgress + "%" }}></div>
          </div>
          <div className="load-msg">{loadMsg}</div>
        </div>
      )}

      {/* CELEBRATION */}
      <div className={`celebration${celebVisible ? " show" : ""}`}>
        {confetti.map((p) => (
          <div key={p.id} className="confetti-piece" style={{
            left: p.left + "%", top: p.top + "%", background: p.bg,
            animationDelay: p.delay + "s", animationDuration: p.dur + "s",
            width: p.w + "px", height: p.h + "px", borderRadius: p.radius
          }} />
        ))}
      </div>

      {/* REST TIMER */}
      <div id="restTimer" className={restVisible ? "show" : ""}>
        <div className="rest-label">Rest</div>
        <div className="rest-count">{restCount}</div>
        <div className="rest-sub">seconds left</div>
      </div>

      {/* ── NAV ── */}
      <nav>
        <div className="nav-logo">Fit<span>Coach</span> AI</div>
        <div className="nav-right">
          {/* 🌟 PREMIUM BUTTON — opens payment modal */}
          <button className="premium-nav-btn" onClick={() => setPaymentOpen(true)}>
            ⚡Premium
          </button>
          <button className="diet-nav-btn" onClick={() => setDietModalOpen(true)}>🥗 Diet</button>
          <div className="lang-toggle">
            <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => doSetLang("en")}>EN</button>
            <button className={`lang-btn${lang === "hi" ? " active" : ""}`} onClick={() => doSetLang("hi")}>हि</button>
          </div>
          <div className="streak-badge">🔥 {streak}d</div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="app-layout">

        {/* LEFT */}
        <div className="video-section">
          <div className="exercise-selector">
            {[["squat","🏋️","Squats"],["pushup","💪","Push-ups"],["jumpingjack","⭐","Jacks"],["lunge","🦵","Lunges"]].map(([key,icon,label]) => (
              <button key={key} className={`ex-btn${currentExercise === key ? " active" : ""}`} onClick={() => doSelectExercise(key)}>
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="difficulty-selector">
            {[["easy","🟢","Easy"],["medium","🟡","Medium"],["hard","🔴","Hard"]].map(([lvl,icon,label]) => (
              <button key={lvl} className={`diff-btn${difficulty === lvl ? " active" : ""}`} onClick={() => doSetDifficulty(lvl, true)} id={`diff-${lvl}`}>
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="video-card">
            <video ref={videoRef} playsInline muted></video>
            <canvas ref={canvasRef}></canvas>

            <div id="coachOverlay">
              <div id="coachOverlayBubble">
                <div>{coachMsg}</div>
                <div id="coachOverlayHindi">{coachHindi}</div>
              </div>
            </div>

            <div className="hud-topleft">
              {liveVisible && <div className="hud-badge live">LIVE</div>}
              <div className="hud-badge">{EX[currentExercise].name.toUpperCase()}</div>
            </div>

            <div className="hud-topright">
              <div className="form-score-wrap">
                <div>
                  <div className="form-score-label">Form</div>
                  <div className={formScoreClass} id="formScoreEl">{formScore}</div>
                </div>
              </div>
            </div>

            <div className="rep-overlay">
              <div className={`rep-big${repBump ? " bump" : ""}`}>{repBig}</div>
              <div className="rep-label">REPS</div>
            </div>

            {startOverlayMode !== "hidden" && (
              <div id="startOverlay">
                {startOverlayMode === "start" ? (
                  <>
                    <h2>Ready to Train? 💪</h2>
                    <p>Allow camera access and start your workout</p>
                    <button className="btn-primary" onClick={startWorkout}>▶ Start Workout</button>
                  </>
                ) : (
                  <>
                    <h2>Workout Complete! 🎉</h2>
                    <p>{completeSummary}</p>
                    <button className="btn-primary" onClick={resetAll}>↺ New Workout</button>
                  </>
                )}
              </div>
            )}

            <div id="countdownOverlay" className={countdownVisible ? "show" : ""}>
              <div className="countdown-num">{countdownNum}</div>
              <div className="countdown-text">Get in position!</div>
            </div>
          </div>

          <div className="controls-bar">
            <button className="btn-secondary" onClick={resetRepsAction}>↺ Reset</button>
            <button className="btn-secondary" onClick={nextSet}>✓ Next Set</button>
            {showStop && <button className="btn-danger" onClick={stopWorkout}>■ Stop</button>}
            <div className="sets-control">
              Sets:
              <button className="sets-btn" onClick={() => doChangeSets(-1)}>−</button>
              <span className="sets-num">{sets}</span>
              <button className="sets-btn" onClick={() => doChangeSets(1)}>+</button>
            </div>
          </div>

          {errorMsg && <div id="errorBanner" style={{ display: "block" }}>⚠ {errorMsg}</div>}
        </div>

        {/* RIGHT */}
        <div className="right-panel">

          {/* Stats */}
          <div className="panel-card">
            <div className="panel-title">Session Stats</div>
            <div className="stats-grid">
              <div className="stat-item"><div className="stat-item-label">Reps</div><div className="stat-item-val accent">{totalReps}</div></div>
              <div className="stat-item"><div className="stat-item-label">Sets Done</div><div className="stat-item-val">{setsCompleted} / {sets}</div></div>
              <div className="stat-item"><div className="stat-item-label">Calories</div><div className="stat-item-val green">{calories}</div></div>
              <div className="stat-item"><div className="stat-item-label">Time</div><div className="stat-item-val">{statTime}</div></div>
            </div>
            <div style={{ marginTop: "11px" }}>
              <div className="panel-title" style={{ marginBottom: "6px" }}>Set Progress</div>
              <div className="set-dots">{dots.map((d) => <div key={d.id} className={d.cls}></div>)}</div>
            </div>
          </div>

          {/* AI Coach */}
          <div className="panel-card">
            <div className="panel-title">🤖 AI Coach</div>
            <div className="coach-box">
              <div className="coach-avatar">🏋️</div>
              <div className="coach-bubble">
                <span>{coachMsg}</span>
                <div className="hindi">{coachHindi}</div>
              </div>
            </div>
            {autoDiffVisible && <div className="auto-diff-badge">🤖 Auto-difficulty active</div>}
          </div>

          {/* Diet Plan */}
          <div className="panel-card">
            <div className="panel-title">🍏 Diet Plan</div>
            <div className="coach-box" style={{ marginBottom: "9px" }}>
              <div className="coach-avatar">🥗</div>
              <div className="coach-bubble">
                <div className="diet-plan-text">{dietPlanMsg}</div>
              </div>
            </div>
            <button className="btn-secondary" onClick={getDietPlan} disabled={dietBtnDisabled} style={{ width: "100%" }}>
              {dietBtnDisabled ? <><span className="spinner"></span>Generating…</> : dietBtnText}
            </button>
          </div>

          {/* Form Feedback */}
          <div className="panel-card">
            <div className="panel-title">📐 Form Feedback</div>
            <div className={feedbackClass}>{feedbackText}</div>
            <div style={{ marginTop: "11px" }}>
              <div className="panel-title" style={{ marginBottom: "6px" }}>Joint Angles</div>
              <div className="progress-wrap">
                {[
                  { label: "Knee",     val: kneeVal,     w: kneeW,     color: "var(--accent2)" },
                  { label: "Hip",      val: hipVal,      w: hipW,      color: "var(--accent3)" },
                  { label: "Shoulder", val: shoulderVal, w: shoulderW, color: "var(--warn)"    },
                ].map(({ label, val, w, color }) => (
                  <div key={label} className="progress-row">
                    <span className="progress-label">{label}</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: w + "%", background: color }}></div></div>
                    <span className="progress-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* History */}
          <div className="panel-card">
            <div className="panel-title">📋 Today's Log</div>
            <div className="history-list">
              {historyLog.length === 0 ? (
                <div style={{ color: "var(--muted)", fontSize: ".78rem", textAlign: "center", padding: "12px 0" }}>No exercises logged yet</div>
              ) : historyLog.map((item, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-icon" style={{ background: "#fff8f5" }}>{item.emoji}</div>
                  <div className="history-info">
                    <div className="history-name">{item.name}</div>
                    <div className="history-detail">Set {item.set}</div>
                  </div>
                  <div className="history-reps">{item.reps}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* DIET MODAL */}
      <div className={`diet-modal${dietModalOpen ? " show" : ""}`}>
        <div className="diet-modal-content">
          <button className="diet-modal-close" onClick={() => setDietModalOpen(false)}>✕</button>
          <div className="diet-modal-title">🥗 Diet Notes & AI Analysis</div>
          <label className="diet-input-label">What did you eat today?</label>
          <textarea className="diet-textarea" placeholder="e.g., 2 rotis, dal, rice, apple, 1 glass milk, 2 eggs..." value={dietInput} onChange={(e) => setDietInput(e.target.value)} />
          <div className="diet-presets">
            {[["+ Roti-Dal","2 rotis, dal, rice"],["+ Eggs","2 eggs, toast"],["+ Fruits","1 apple, banana"],["+ Chicken","chicken 100g, salad"],["+ Yogurt","yogurt, nuts, seeds"],["+ Oats","1 cup oats, milk"]].map(([label,val]) => (
              <button key={label} className="diet-preset-btn" onClick={() => addPreset(val)}>{label}</button>
            ))}
          </div>
          <button className="btn-primary diet-analyze-btn" onClick={analyzeDiet}>🔍 Analyze Nutrition</button>
          {(dietLoading || dietResults) && (
            <div className="diet-results">
              {dietLoading && <div className="diet-loading">{lang === "hi" ? "🤔 AI विश्लेषण कर रहा है..." : "🤔 Analyzing your meals..."}</div>}
              {dietResults && !dietResults.error && (
                <>
                  <div className="diet-result-title">📊 {lang === "hi" ? "पोषण विश्लेषण" : "Nutrition Analysis"}</div>
                  <div className="diet-macros">
                    <div className="diet-macro cal"><span className="diet-macro-val">{dietResults.calories}</span><span className="diet-macro-label">{lang === "hi" ? "कैलोरी" : "Cal"}</span></div>
                    <div className="diet-macro pro"><span className="diet-macro-val">{dietResults.protein}g</span><span className="diet-macro-label">{lang === "hi" ? "प्रोटीन" : "Protein"}</span></div>
                    <div className="diet-macro carb"><span className="diet-macro-val">{dietResults.carbs}g</span><span className="diet-macro-label">{lang === "hi" ? "कार्ब्स" : "Carbs"}</span></div>
                    <div className="diet-macro fat"><span className="diet-macro-val">{dietResults.fat}g</span><span className="diet-macro-label">{lang === "hi" ? "वसा" : "Fat"}</span></div>
                  </div>
                  {dietResults.goalProtein && <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: "8px" }}>🎯 Daily goal: ~{dietResults.goalCalories} cal · {dietResults.goalProtein}g protein</div>}
                  <div className="diet-suggestion">
                    <div><strong>{lang === "hi" ? "सुझाव" : "Suggestion"}:</strong> {dietResults.suggestionEn}</div>
                    <div className="diet-suggestion-hi">{dietResults.suggestionHi}</div>
                  </div>
                </>
              )}
              {dietResults?.error && <div className="diet-suggestion" style={{ color: "#e74c3c" }}>❌ {lang === "hi" ? "नेटवर्क त्रुटि" : "Network error — check connection"}</div>}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PAYMENT MODAL — rendered here, always mounted
      ══════════════════════════════════════════ */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
      />
</div>
    </div>
  );
}