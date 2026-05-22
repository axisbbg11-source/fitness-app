// ============================================================
//  repDetection.js  —  FitCoach AI  •  Forgiving Rep Engine
//  Philosophy: COUNT MORE, REJECT LESS, FEEL NATURAL
//  Built for UX, not biomechanics lab precision.
// ============================================================

// ── 1. PER-EXERCISE PROFILES ────────────────────────────────
// Each profile has LOOSE defaults intentionally.
// minRange = minimum ROM% of calibrated range to count (not absolute °)
// requiredFrames = how many frames angle must stay in zone
// minInterval = ms minimum between counted reps
// smoothAlpha = EMA weight (higher = more responsive, less smooth)
// peakBuffer = transition-band decay rate

export const REP_PROFILES = {
  // HOME
  'home-squat':            { requiredFrames:3, minInterval:600,  smoothAlpha:0.32, peakBuffer:2, minRomPct:0.40 },
  'home-pushup':           { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.38 },
  'home-jumpingjack':      { requiredFrames:2, minInterval:380,  smoothAlpha:0.46, peakBuffer:1, minRomPct:0.30 },
  'home-lunge':            { requiredFrames:3, minInterval:650,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.38 },
  'home-plank':            { requiredFrames:6, minInterval:1800, smoothAlpha:0.14, peakBuffer:4, minRomPct:0.20 },
  'home-burpees':          { requiredFrames:2, minInterval:750,  smoothAlpha:0.38, peakBuffer:1, minRomPct:0.42 },
  'home-mountainclimbers': { requiredFrames:2, minInterval:380,  smoothAlpha:0.46, peakBuffer:1, minRomPct:0.28 },
  'home-highknees':        { requiredFrames:2, minInterval:320,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.25 },
  'home-bicyclecrunches':  { requiredFrames:2, minInterval:480,  smoothAlpha:0.38, peakBuffer:1, minRomPct:0.30 },
  'home-wallsit':          { requiredFrames:6, minInterval:1800, smoothAlpha:0.13, peakBuffer:5, minRomPct:0.15 },
  'home-tricepdips':       { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.35 },
  'home-glutebridges':     { requiredFrames:3, minInterval:650,  smoothAlpha:0.28, peakBuffer:2, minRomPct:0.35 },
  'home-supermanhold':     { requiredFrames:5, minInterval:1400, smoothAlpha:0.16, peakBuffer:4, minRomPct:0.18 },
  'home-donkeykicks':      { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.35 },
  'home-inchworms':        { requiredFrames:3, minInterval:1000, smoothAlpha:0.24, peakBuffer:2, minRomPct:0.38 },
  'home-tuckjumps':        { requiredFrames:2, minInterval:580,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.38 },
  'home-plankjacks':       { requiredFrames:2, minInterval:400,  smoothAlpha:0.44, peakBuffer:1, minRomPct:0.25 },
  'home-skaterjumps':      { requiredFrames:2, minInterval:500,  smoothAlpha:0.40, peakBuffer:1, minRomPct:0.32 },
  'home-bearcrawl':        { requiredFrames:2, minInterval:550,  smoothAlpha:0.36, peakBuffer:2, minRomPct:0.28 },
  'home-vups':             { requiredFrames:3, minInterval:600,  smoothAlpha:0.32, peakBuffer:2, minRomPct:0.32 },
  'home-pikepushups':      { requiredFrames:3, minInterval:650,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.35 },
  'home-commandoplank':    { requiredFrames:3, minInterval:650,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.30 },
  'home-speedsquats':      { requiredFrames:2, minInterval:420,  smoothAlpha:0.44, peakBuffer:1, minRomPct:0.33 },
  'home-flutterkicks':     { requiredFrames:2, minInterval:300,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.22 },
  'home-reverselunge':     { requiredFrames:3, minInterval:650,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.38 },
  // GYM
  'gym-barbellsquat':      { requiredFrames:3, minInterval:750,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.42 },
  'gym-benchpress':        { requiredFrames:3, minInterval:700,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.38 },
  'gym-deadlift':          { requiredFrames:4, minInterval:1000, smoothAlpha:0.24, peakBuffer:3, minRomPct:0.45 },
  'gym-latpulldown':       { requiredFrames:3, minInterval:700,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.38 },
  'gym-bicepcurl':         { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.40 },
  'gym-shoulderpress':     { requiredFrames:3, minInterval:700,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.38 },
  'gym-legpress':          { requiredFrames:3, minInterval:750,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.40 },
  'gym-chestfly':          { requiredFrames:3, minInterval:700,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.35 },
  'gym-row':               { requiredFrames:3, minInterval:650,  smoothAlpha:0.28, peakBuffer:2, minRomPct:0.38 },
  'gym-triceppushdown':    { requiredFrames:3, minInterval:580,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.40 },
  'gym-legcurl':           { requiredFrames:3, minInterval:650,  smoothAlpha:0.28, peakBuffer:2, minRomPct:0.40 },
  'gym-legextension':      { requiredFrames:3, minInterval:650,  smoothAlpha:0.28, peakBuffer:2, minRomPct:0.40 },
  'gym-lateralraise':      { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.32 },
  'gym-facepull':          { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.32 },
  'gym-calfraise':         { requiredFrames:3, minInterval:550,  smoothAlpha:0.32, peakBuffer:2, minRomPct:0.28 },
  'gym-cablecrossover':    { requiredFrames:3, minInterval:650,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.35 },
  'gym-hacksquat':         { requiredFrames:3, minInterval:750,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.42 },
  'gym-romaniandeadlift':  { requiredFrames:4, minInterval:900,  smoothAlpha:0.24, peakBuffer:3, minRomPct:0.42 },
  'gym-inclinepress':      { requiredFrames:3, minInterval:700,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.35 },
  'gym-preachercurl':      { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.40 },
  'gym-skullcrusher':      { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.40 },
  'gym-hyperextension':    { requiredFrames:3, minInterval:750,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.38 },
  'gym-woodchopper':       { requiredFrames:3, minInterval:650,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.35 },
  'gym-farmerwalk':        { requiredFrames:4, minInterval:900,  smoothAlpha:0.20, peakBuffer:3, minRomPct:0.15 },
  'gym-shrug':             { requiredFrames:3, minInterval:500,  smoothAlpha:0.34, peakBuffer:2, minRomPct:0.22 },
  // YOGA
  'yoga-mountainpose':     { requiredFrames:7, minInterval:2800, smoothAlpha:0.11, peakBuffer:6, minRomPct:0.12 },
  'yoga-warrior1':         { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:5, minRomPct:0.15 },
  'yoga-downwarddog':      { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:5, minRomPct:0.15 },
  'yoga-treepose':         { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'yoga-cobrapose':        { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:5, minRomPct:0.15 },
  'yoga-warrior2':         { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:5, minRomPct:0.15 },
  'yoga-triangle':         { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:5, minRomPct:0.14 },
  'yoga-chair':            { requiredFrames:4, minInterval:1400, smoothAlpha:0.16, peakBuffer:4, minRomPct:0.18 },
  'yoga-crow':             { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'yoga-bridge':           { requiredFrames:4, minInterval:1400, smoothAlpha:0.16, peakBuffer:4, minRomPct:0.18 },
  'yoga-boat':             { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:5, minRomPct:0.15 },
  'yoga-catcow':           { requiredFrames:3, minInterval:1000, smoothAlpha:0.20, peakBuffer:3, minRomPct:0.18 },
  // CARDIO
  'cardio-jumpingjacks':   { requiredFrames:2, minInterval:380,  smoothAlpha:0.48, peakBuffer:1, minRomPct:0.28 },
  'cardio-highknees':      { requiredFrames:2, minInterval:320,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.25 },
  'cardio-buttkicks':      { requiredFrames:2, minInterval:320,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.25 },
  'cardio-mountainclimbers':{ requiredFrames:2, minInterval:380, smoothAlpha:0.48, peakBuffer:1, minRomPct:0.26 },
  'cardio-burpees':        { requiredFrames:2, minInterval:750,  smoothAlpha:0.38, peakBuffer:1, minRomPct:0.40 },
  'cardio-tuckjumps':      { requiredFrames:2, minInterval:550,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.36 },
  'cardio-boxjumps':       { requiredFrames:2, minInterval:700,  smoothAlpha:0.38, peakBuffer:1, minRomPct:0.38 },
  'cardio-skaterjumps':    { requiredFrames:2, minInterval:500,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.32 },
  'cardio-speedskaters':   { requiredFrames:2, minInterval:460,  smoothAlpha:0.44, peakBuffer:1, minRomPct:0.28 },
  'cardio-jumprope':       { requiredFrames:2, minInterval:260,  smoothAlpha:0.54, peakBuffer:1, minRomPct:0.20 },
  'cardio-stepups':        { requiredFrames:2, minInterval:600,  smoothAlpha:0.38, peakBuffer:1, minRomPct:0.32 },
  'cardio-sprintintervals':{ requiredFrames:2, minInterval:340,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.25 },
  'cardio-lateralshuffles':{ requiredFrames:2, minInterval:420,  smoothAlpha:0.46, peakBuffer:1, minRomPct:0.22 },
  'cardio-powerskips':     { requiredFrames:2, minInterval:550,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.32 },
  'cardio-broadjumps':     { requiredFrames:2, minInterval:800,  smoothAlpha:0.36, peakBuffer:1, minRomPct:0.40 },
  'cardio-splitjumps':     { requiredFrames:2, minInterval:600,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.36 },
  'cardio-squatjumps':     { requiredFrames:2, minInterval:600,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.35 },
  'cardio-clappushups':    { requiredFrames:2, minInterval:600,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.32 },
  'cardio-depthjumps':     { requiredFrames:2, minInterval:800,  smoothAlpha:0.36, peakBuffer:1, minRomPct:0.40 },
  'cardio-hurdlehops':     { requiredFrames:2, minInterval:560,  smoothAlpha:0.42, peakBuffer:1, minRomPct:0.32 },
  'cardio-shuttlerun':     { requiredFrames:2, minInterval:440,  smoothAlpha:0.46, peakBuffer:1, minRomPct:0.24 },
  'cardio-agilityladder':  { requiredFrames:2, minInterval:360,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.20 },
  'cardio-dotdrills':      { requiredFrames:2, minInterval:340,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.18 },
  // STRETCH
  'stretch-hamstring':     { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-quad':          { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-shoulder':      { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.10 },
  'stretch-catcow':        { requiredFrames:4, minInterval:1200, smoothAlpha:0.17, peakBuffer:3, minRomPct:0.15 },
  'stretch-forwardbend':   { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-butterfly':     { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-piriformis':    { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-hipflexor':     { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-neck':          { requiredFrames:6, minInterval:2200, smoothAlpha:0.10, peakBuffer:5, minRomPct:0.10 },
  'stretch-wrist':         { requiredFrames:5, minInterval:1800, smoothAlpha:0.12, peakBuffer:4, minRomPct:0.10 },
  'stretch-anklecircles':  { requiredFrames:4, minInterval:1400, smoothAlpha:0.14, peakBuffer:3, minRomPct:0.10 },
  'stretch-cobra':         { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-childspose':    { requiredFrames:7, minInterval:2800, smoothAlpha:0.10, peakBuffer:6, minRomPct:0.10 },
  'stretch-pigeon':        { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-figurefour':    { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-lunge':         { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:4, minRomPct:0.13 },
  'stretch-tricep':        { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.10 },
  'stretch-sidebend':      { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:4, minRomPct:0.11 },
  'stretch-spinaltwist':   { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:4, minRomPct:0.11 },
  'stretch-wallcalf':      { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.10 },
  'stretch-chestopener':   { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:4, minRomPct:0.11 },
  'stretch-foamroll':      { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:4, minRomPct:0.11 },
  'stretch-itband':        { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.10 },
  'stretch-frog':          { requiredFrames:6, minInterval:2200, smoothAlpha:0.11, peakBuffer:5, minRomPct:0.12 },
  'stretch-scorpion':      { requiredFrames:5, minInterval:1800, smoothAlpha:0.13, peakBuffer:4, minRomPct:0.13 },
  // STRENGTH
  'strength-gobletsquat':  { requiredFrames:3, minInterval:750,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.40 },
  'strength-pushupvariation':{ requiredFrames:3, minInterval:650, smoothAlpha:0.28, peakBuffer:2, minRomPct:0.35 },
  'strength-pullup':       { requiredFrames:3, minInterval:800,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.40 },
  'strength-kettlebellswing':{ requiredFrames:2, minInterval:580, smoothAlpha:0.34, peakBuffer:1, minRomPct:0.38 },
  'strength-overheadpress':{ requiredFrames:3, minInterval:700,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.35 },
  'strength-frontsquat':   { requiredFrames:3, minInterval:750,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.40 },
  'strength-sumodeadlift': { requiredFrames:4, minInterval:1000, smoothAlpha:0.24, peakBuffer:3, minRomPct:0.42 },
  'strength-renegaderow':  { requiredFrames:3, minInterval:750,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.35 },
  'strength-thruster':     { requiredFrames:3, minInterval:750,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.38 },
  'strength-turkishgetup': { requiredFrames:4, minInterval:1800, smoothAlpha:0.21, peakBuffer:3, minRomPct:0.35 },
  'strength-cleanandpress':{ requiredFrames:3, minInterval:1000, smoothAlpha:0.24, peakBuffer:2, minRomPct:0.42 },
  'strength-snatch':       { requiredFrames:3, minInterval:1000, smoothAlpha:0.24, peakBuffer:2, minRomPct:0.45 },
  'strength-weightedlunge':{ requiredFrames:3, minInterval:750,  smoothAlpha:0.27, peakBuffer:2, minRomPct:0.38 },
  'strength-farmercarry':  { requiredFrames:4, minInterval:900,  smoothAlpha:0.19, peakBuffer:3, minRomPct:0.14 },
  'strength-sledpush':     { requiredFrames:4, minInterval:900,  smoothAlpha:0.20, peakBuffer:3, minRomPct:0.15 },
  'strength-battleropes':  { requiredFrames:2, minInterval:320,  smoothAlpha:0.50, peakBuffer:1, minRomPct:0.20 },
  'strength-boxsquat':     { requiredFrames:3, minInterval:800,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.40 },
  'strength-zerchersquat': { requiredFrames:3, minInterval:800,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.40 },
  'strength-deficitdeadlift':{ requiredFrames:4, minInterval:1100, smoothAlpha:0.23, peakBuffer:3, minRomPct:0.44 },
  'strength-pausedbench':  { requiredFrames:4, minInterval:900,  smoothAlpha:0.24, peakBuffer:3, minRomPct:0.35 },
  'strength-rackpull':     { requiredFrames:4, minInterval:900,  smoothAlpha:0.24, peakBuffer:3, minRomPct:0.32 },
  'strength-pinpress':     { requiredFrames:4, minInterval:900,  smoothAlpha:0.24, peakBuffer:3, minRomPct:0.30 },
  'strength-bandedcurl':   { requiredFrames:3, minInterval:600,  smoothAlpha:0.30, peakBuffer:2, minRomPct:0.38 },
  'strength-chainsquat':   { requiredFrames:3, minInterval:800,  smoothAlpha:0.26, peakBuffer:2, minRomPct:0.40 },
  'strength-atlasstone':   { requiredFrames:3, minInterval:1300, smoothAlpha:0.21, peakBuffer:3, minRomPct:0.38 },
};

// ── 2. FALLBACK PROFILES BY CATEGORY × DIFFICULTY ──────────
export const FALLBACK_PROFILES = {
  Home:     { easy:{requiredFrames:3,minInterval:620,smoothAlpha:0.32,peakBuffer:2,minRomPct:0.35},
              medium:{requiredFrames:3,minInterval:580,smoothAlpha:0.34,peakBuffer:2,minRomPct:0.35},
              hard:{requiredFrames:2,minInterval:520,smoothAlpha:0.38,peakBuffer:1,minRomPct:0.35} },
  Gym:      { easy:{requiredFrames:3,minInterval:700,smoothAlpha:0.28,peakBuffer:2,minRomPct:0.38},
              medium:{requiredFrames:3,minInterval:700,smoothAlpha:0.27,peakBuffer:2,minRomPct:0.38},
              hard:{requiredFrames:3,minInterval:750,smoothAlpha:0.26,peakBuffer:2,minRomPct:0.40} },
  Yoga:     { easy:{requiredFrames:5,minInterval:1800,smoothAlpha:0.13,peakBuffer:5,minRomPct:0.12},
              medium:{requiredFrames:5,minInterval:1600,smoothAlpha:0.14,peakBuffer:4,minRomPct:0.14},
              hard:{requiredFrames:4,minInterval:1400,smoothAlpha:0.16,peakBuffer:4,minRomPct:0.16} },
  Cardio:   { easy:{requiredFrames:2,minInterval:400,smoothAlpha:0.46,peakBuffer:1,minRomPct:0.26},
              medium:{requiredFrames:2,minInterval:360,smoothAlpha:0.48,peakBuffer:1,minRomPct:0.26},
              hard:{requiredFrames:2,minInterval:330,smoothAlpha:0.50,peakBuffer:1,minRomPct:0.26} },
  Stretch:  { easy:{requiredFrames:6,minInterval:2200,smoothAlpha:0.11,peakBuffer:5,minRomPct:0.11},
              medium:{requiredFrames:5,minInterval:1800,smoothAlpha:0.13,peakBuffer:4,minRomPct:0.12},
              hard:{requiredFrames:5,minInterval:1600,smoothAlpha:0.14,peakBuffer:4,minRomPct:0.13} },
  Strength: { easy:{requiredFrames:3,minInterval:720,smoothAlpha:0.27,peakBuffer:2,minRomPct:0.36},
              medium:{requiredFrames:3,minInterval:750,smoothAlpha:0.26,peakBuffer:2,minRomPct:0.38},
              hard:{requiredFrames:3,minInterval:800,smoothAlpha:0.25,peakBuffer:2,minRomPct:0.40} },
};

export function getRepProfile(exercise) {
  if (!exercise) return { requiredFrames:3, minInterval:650, smoothAlpha:0.32, peakBuffer:2, minRomPct:0.35 };
  return (
    REP_PROFILES[exercise.id] ||
    FALLBACK_PROFILES[exercise.category]?.[exercise.difficulty] ||
    { requiredFrames:3, minInterval:650, smoothAlpha:0.32, peakBuffer:2, minRomPct:0.35 }
  );
}

// ── 3. FORGIVING ADAPTIVE SMOOTHER ─────────────────────────
// Key insight: large angle jumps = real movement, NOT noise.
// Track fast, filter slow wobble. Opposite of what most devs do.
export function adaptiveSmooth(prev, next, baseAlpha) {
  if (prev === null || prev === undefined) return next;
  const jump = Math.abs(next - prev);
  let alpha;
  if      (jump > 55) alpha = Math.min(0.75, baseAlpha * 2.6); // explosive movement — track it
  else if (jump > 35) alpha = Math.min(0.60, baseAlpha * 2.0);
  else if (jump > 20) alpha = Math.min(0.48, baseAlpha * 1.5);
  else if (jump > 10) alpha = Math.min(0.40, baseAlpha * 1.2);
  else                alpha = baseAlpha;                         // slow drift — smooth it
  return prev * (1 - alpha) + next * alpha;
}

// ── 4. ROM CALIBRATION STATE ────────────────────────────────
// Tracks each user's personal range-of-motion during first N reps.
// Once calibrated, thresholds adapt to THEIR body, not a textbook.
export function createRomCalibrator() {
  return {
    // Running stats
    peakAngle:  0,    // highest angle seen
    valleyAngle: 180, // lowest angle seen
    calibrated: false,
    calibrationReps: 0,
    CALIBRATION_WINDOW: 3, // reps before we lock thresholds

    // Expanded thresholds (more forgiving than textbook)
    downThreshold: null,
    upThreshold:   null,

    update(angle) {
      this.peakAngle   = Math.max(this.peakAngle,   angle);
      this.valleyAngle = Math.min(this.valleyAngle, angle);
    },

    onRepCounted() {
      this.calibrationReps++;
      if (!this.calibrated && this.calibrationReps >= this.CALIBRATION_WINDOW) {
        this._lock();
      }
    },

    _lock() {
      const rom = this.peakAngle - this.valleyAngle;
      if (rom < 8) return; // not enough signal yet

      // Forgiving split: user needs to reach 30% into their ROM from either end
      // (vs the old fixed absolute degree values)
      // We WIDEN by 10% beyond their observed extremes so partial reps count
      const widenedPeak   = this.peakAngle   + rom * 0.08;
      const widenedValley = this.valleyAngle - rom * 0.08;

      // upThreshold = 30% of ROM from top  → easy to reach "up" position
      // downThreshold = 30% of ROM from bottom → easy to reach "down" position
      this.upThreshold   = widenedPeak   - rom * 0.30;
      this.downThreshold = widenedValley + rom * 0.30;
      this.calibrated = true;
    },

    // How much ROM did user actually complete this cycle? (0–1)
    // Used to decide if partial rep counts.
    getRomCompletion(cycleMin, cycleMax) {
      const achievedRom  = cycleMax - cycleMin;
      const personalRom  = this.peakAngle - this.valleyAngle;
      if (personalRom < 5) return 0;
      return Math.min(1, achievedRom / personalRom);
    },

    reset() {
      this.peakAngle        = 0;
      this.valleyAngle      = 180;
      this.calibrated       = false;
      this.calibrationReps  = 0;
      this.downThreshold    = null;
      this.upThreshold      = null;
    },
  };
}

// ── 5. FORGIVING REP VALIDATOR ──────────────────────────────
// Called once per frame from onResults. Returns { counted: bool, debug: obj }
// Encapsulates all state so Dashboard.jsx stays clean.
export function createRepDetector(exercise, onRepCounted) {
  const profile    = getRepProfile(exercise);
  const calibrator = createRomCalibrator();

  // Mutable state (mirrors your existing refs — but bundled)
  let smoothed        = null;
  let isDown          = false;
  let downFrames      = 0;
  let upFrames        = 0;
  let lastRepTime     = 0;
  let cycleMin        = 180;
  let cycleMax        = 0;

  return {
    profile,
    calibrator,

    // ── Main entry: call with the RAW angle + exercise thresholds each frame
    processAngle(rawAngle, exerciseDownThresh, exerciseUpThresh) {
      if (rawAngle <= 0 || rawAngle > 360) return false;

      // Step 1 — Adaptive smoothing (fast for movement, slow for wobble)
      smoothed = adaptiveSmooth(smoothed, rawAngle, profile.smoothAlpha);
      const angle = smoothed;

      // Step 2 — Update calibration ROM
      calibrator.update(angle);

      // Step 3 — Resolve thresholds: use calibrated personal thresholds once
      //          available, else fall back to exercise defaults widened by 12%
      let downThresh, upThresh;
      if (calibrator.calibrated && calibrator.downThreshold !== null) {
        downThresh = calibrator.downThreshold;
        upThresh   = calibrator.upThreshold;
      } else {
        // Pre-calibration: widen factory thresholds by 12% of the gap
        const gap    = exerciseUpThresh - exerciseDownThresh;
        downThresh   = exerciseDownThresh + gap * 0.12;
        upThresh     = exerciseUpThresh   - gap * 0.12;
      }

      // Step 4 — Track cycle extremes
      cycleMin = Math.min(cycleMin, angle);
      cycleMax = Math.max(cycleMax, angle);

      // Step 5 — Zone detection with soft decay in transition band
      const FRAMES   = profile.requiredFrames;
      const P_BUFFER = profile.peakBuffer;

      if (angle < downThresh) {
        downFrames++;
        upFrames = Math.max(0, upFrames - 1);
      } else if (angle > upThresh) {
        upFrames++;
        downFrames = Math.max(0, downFrames - 1);
      } else {
        // Transition band — gentle decay, not hard reset
        // This is what makes slow/tired users' reps still register
        downFrames = Math.max(0, downFrames - P_BUFFER);
        upFrames   = Math.max(0, upFrames   - P_BUFFER);
      }

      // Step 6 — State machine: DOWN latch
      if (downFrames >= FRAMES && !isDown) {
        isDown     = true;
        downFrames = 0;
      }

      // Step 7 — State machine: UP = rep complete
      if (upFrames >= FRAMES && isDown) {
        const now         = Date.now();
        const elapsed     = now - lastRepTime;
        const romComplete = calibrator.getRomCompletion(cycleMin, cycleMax);
        const minRom      = profile.minRomPct;

        // ── Forgiving acceptance rules ──
        // Accept if EITHER timing AND rom both pass,
        // OR if rom is very good (generous user gets credit even if fast)
        const timingOk    = elapsed >= profile.minInterval;
        const romOk       = romComplete >= minRom;
        const romExcellent= romComplete >= minRom * 1.6; // great form = faster allowed

        if (timingOk && romOk) {
          // Standard accept
          this._countRep(now);
          return true;
        } else if (romExcellent && elapsed >= profile.minInterval * 0.65) {
          // Great ROM → allow 35% faster (rewarding good form)
          this._countRep(now);
          return true;
        } else if (timingOk && romComplete >= minRom * 0.72) {
          // Partial ROM but waited long enough → count it (body-type tolerance)
          this._countRep(now);
          return true;
        }
        // Otherwise: reset cycle but DON'T count (anti-bounce)
        if (elapsed >= profile.minInterval * 0.5) {
          isDown     = false;
          upFrames   = 0;
          cycleMin   = 180;
          cycleMax   = 0;
        }
      }

      return false;
    },

    _countRep(now) {
      isDown     = false;
      upFrames   = 0;
      lastRepTime= now;
      cycleMin   = 180;
      cycleMax   = 0;
      calibrator.onRepCounted();
      if (onRepCounted) onRepCounted();
    },

    reset() {
      smoothed    = null;
      isDown      = false;
      downFrames  = 0;
      upFrames    = 0;
      lastRepTime = 0;
      cycleMin    = 180;
      cycleMax    = 0;
      calibrator.reset();
    },

    getSmoothed() { return smoothed; },
  };
}