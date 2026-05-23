/**
 * repDetection.js — Production-Grade Adaptive Rep Detector
 *
 * Architecture:
 * - Exponential Moving Average (EMA) smoothing, never blocks
 * - 4-phase state machine: IDLE → DESCENDING → BOTTOM → ASCENDING
 * - Calibration runs as a passive observer, NEVER mutates thresholds during a rep
 * - Thresholds only update between reps (in IDLE phase), preventing mid-rep corruption
 * - Fatigue tracked via rolling baseline, never triggers re-calibration
 * - All methods are synchronous and O(1) — safe inside rAF
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const EMA_ALPHA        = 0.25;   // Smoothing factor (0.1 = very smooth, 0.4 = responsive)
const DEBOUNCE_FRAMES  = 6;      // Min frames between rep counts (~240ms at 25fps)
const CALIB_REPS       = 3;      // Reps to observe before personalizing thresholds
const CALIB_MARGIN     = 12;     // Degrees of margin added inward from observed extremes
const FATIGUE_WINDOW   = 8;      // Rolling window size for ROM tracking
const FATIGUE_THRESH   = 0.72;   // ROM drops below 72% of baseline = fatigue

// Phase constants
const PHASE = {
  IDLE:       'IDLE',
  DESCENDING: 'DESCENDING',
  BOTTOM:     'BOTTOM',
  ASCENDING:  'ASCENDING',
};

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * createRepDetector(exercise)
 *
 * Returns a detector instance. All state is in plain objects/numbers — no React,
 * no closures that capture stale refs, no async.
 *
 * @param {object} exercise  - { downThreshold, upThreshold, ... }
 * @returns {object}         - detector API
 */
export function createRepDetector(exercise) {
  // ── Initial thresholds from exercise definition ──────────────────────────
  let downThreshold = exercise?.downThreshold ?? 100;
  let upThreshold   = exercise?.upThreshold   ?? 160;

  // ── EMA state ────────────────────────────────────────────────────────────
  let smoothedAngle  = null;

  // ── Rep state machine ─────────────────────────────────────────────────────
  let phase          = PHASE.IDLE;
  let debounceCount  = 0;
  let totalReps      = 0;

  // ── Calibration state (passive observer) ─────────────────────────────────
  // Calibration ONLY samples angles. It never calls into the rep detector.
  // Threshold updates are queued and applied only when phase === IDLE.
  const calib = {
    active:          true,    // Still collecting data
    repsObserved:    0,
    sessionMin:      Infinity,
    sessionMax:      -Infinity,
    pendingDown:     null,    // Queued threshold update (applied at next IDLE)
    pendingUp:       null,
  };

  // ── Fatigue tracking ──────────────────────────────────────────────────────
  const fatigue = {
    baselineROM:  null,       // Set after calibration completes
    romHistory:   [],         // Rolling window of per-rep ROM values
    currentRepMin: Infinity,
    currentRepMax: -Infinity,
    fatigued:     false,
  };

  // ─── Internal helpers ─────────────────────────────────────────────────────

  function applyEMA(raw) {
    if (smoothedAngle === null) {
      smoothedAngle = raw;
      return raw;
    }
    smoothedAngle = EMA_ALPHA * raw + (1 - EMA_ALPHA) * smoothedAngle;
    return smoothedAngle;
  }

  /**
   * Apply any pending threshold updates.
   * Called only when phase transitions TO IDLE, so never mid-rep.
   */
  function flushPendingThresholds() {
    if (calib.pendingDown !== null) {
      downThreshold = calib.pendingDown;
      calib.pendingDown = null;
    }
    if (calib.pendingUp !== null) {
      upThreshold = calib.pendingUp;
      calib.pendingUp = null;
    }
  }

  /**
   * Record a completed rep's ROM for fatigue tracking.
   */
  function recordRepROM() {
    const rom = fatigue.currentRepMax - fatigue.currentRepMin;
    if (rom <= 0) return;

    // Set baseline from first post-calibration rep
    if (fatigue.baselineROM === null && calib.repsObserved >= CALIB_REPS) {
      fatigue.baselineROM = rom;
    }

    fatigue.romHistory.push(rom);
    if (fatigue.romHistory.length > FATIGUE_WINDOW) {
      fatigue.romHistory.shift();
    }

    // Reset per-rep tracking
    fatigue.currentRepMin = Infinity;
    fatigue.currentRepMax = -Infinity;
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * processAngle(rawAngle) — call every frame from rAF
   *
   * Returns an object:
   * {
   *   counted:          boolean  — true if a rep was just completed
   *   smoothed:         number   — EMA-smoothed angle
   *   phase:            string   — current phase
   *   calibStatus:      object   — { active, repsObserved, justCompleted }
   *   fatigueStatus:    object   — { fatigued, romRatio }
   * }
   */
  function processAngle(rawAngle) {
    if (rawAngle <= 0 || rawAngle > 360) {
      return { counted: false, smoothed: smoothedAngle ?? rawAngle, phase, calibStatus: getCalibStatus(), fatigueStatus: getFatigueStatus() };
    }

    const angle = applyEMA(rawAngle);

    // ── Calibration: passive sampling ─────────────────────────────────────
    if (calib.active) {
      if (angle < calib.sessionMin) calib.sessionMin = angle;
      if (angle > calib.sessionMax) calib.sessionMax = angle;
    }

    // ── Fatigue: per-rep angle tracking ───────────────────────────────────
    if (angle < fatigue.currentRepMin) fatigue.currentRepMin = angle;
    if (angle > fatigue.currentRepMax) fatigue.currentRepMax = angle;

    // ── Debounce countdown ────────────────────────────────────────────────
    if (debounceCount > 0) debounceCount--;

    // ── 4-phase state machine ─────────────────────────────────────────────
    let counted = false;

    switch (phase) {
      case PHASE.IDLE:
        // Apply any pending threshold changes here (safe point)
        flushPendingThresholds();
        // Start descending if angle drops below downThreshold
        if (angle < downThreshold) {
          phase = PHASE.DESCENDING;
        }
        break;

      case PHASE.DESCENDING:
        // Track the bottom
        if (angle >= downThreshold) {
          // Bounced back up without reaching proper bottom — return to IDLE
          phase = PHASE.IDLE;
        } else if (angle < downThreshold - 5) {
          // Definitively at bottom
          phase = PHASE.BOTTOM;
        }
        break;

      case PHASE.BOTTOM:
        // Wait for ascending
        if (angle > downThreshold + 5) {
          phase = PHASE.ASCENDING;
        }
        break;

      case PHASE.ASCENDING:
        if (angle >= upThreshold && debounceCount === 0) {
          // ── Rep completed ───────────────────────────────────────────────
          counted = true;
          totalReps++;
          debounceCount = DEBOUNCE_FRAMES;

          recordRepROM();

          // ── Calibration: count this rep ─────────────────────────────────
          if (calib.active) {
            calib.repsObserved++;

            if (calib.repsObserved >= CALIB_REPS) {
              calib.active = false;

              // Queue threshold update — will apply at next IDLE (safe)
              const rom = calib.sessionMax - calib.sessionMin;
              if (rom > 20) { // Sanity check: ignore tiny ROM
                calib.pendingDown = calib.sessionMin + CALIB_MARGIN;
                calib.pendingUp   = calib.sessionMax - CALIB_MARGIN;
              }
            }
          }

          // Transition back to IDLE
          phase = PHASE.IDLE;

        } else if (angle < downThreshold) {
          // Dropped back down — double rep motion, go back to BOTTOM
          phase = PHASE.BOTTOM;
        }
        break;
    }

    // ── Fatigue evaluation (only after baseline is set) ───────────────────
    if (fatigue.baselineROM !== null && fatigue.romHistory.length >= 3) {
      const recentAvg = fatigue.romHistory.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const ratio = recentAvg / fatigue.baselineROM;
      fatigue.fatigued = ratio < FATIGUE_THRESH;
    }

    return {
      counted,
      smoothed: angle,
      phase,
      calibStatus:   getCalibStatus(),
      fatigueStatus: getFatigueStatus(),
    };
  }

  function getCalibStatus() {
    return {
      active:         calib.active,
      repsObserved:   calib.repsObserved,
      justCompleted:  !calib.active && calib.pendingDown === null && calib.repsObserved === CALIB_REPS,
      learnedMin:     calib.sessionMin === Infinity ? null : calib.sessionMin,
      learnedMax:     calib.sessionMax === -Infinity ? null : calib.sessionMax,
    };
  }

  function getFatigueStatus() {
    if (fatigue.baselineROM === null || fatigue.romHistory.length < 3) {
      return { fatigued: false, romRatio: null, romHistory: [] };
    }
    const recentAvg = fatigue.romHistory.slice(-3).reduce((a, b) => a + b, 0) / 3;
    return {
      fatigued:   fatigue.fatigued,
      romRatio:   recentAvg / fatigue.baselineROM,
      romHistory: [...fatigue.romHistory],
    };
  }

  function getSmoothed() { return smoothedAngle; }

  function getCurrentThresholds() {
    return { downThreshold, upThreshold };
  }

  function reset() {
    smoothedAngle   = null;
    phase           = PHASE.IDLE;
    debounceCount   = 0;
    totalReps       = 0;
    calib.active         = true;
    calib.repsObserved   = 0;
    calib.sessionMin     = Infinity;
    calib.sessionMax     = -Infinity;
    calib.pendingDown    = null;
    calib.pendingUp      = null;
    fatigue.baselineROM  = null;
    fatigue.romHistory   = [];
    fatigue.currentRepMin = Infinity;
    fatigue.currentRepMax = -Infinity;
    fatigue.fatigued     = false;
    // Restore original exercise thresholds
    downThreshold = exercise?.downThreshold ?? 100;
    upThreshold   = exercise?.upThreshold   ?? 160;
  }

return {
  processAngle,
  reset,

  getCalibStatus: () => calibration,
};
}