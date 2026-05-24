// src/poseLoader.js

let poseInstance = null;
let cameraLoaded = false;
let warmUpDone = false;
let initPromise = null; // prevents duplicate concurrent inits

export const loadScriptOnce = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const timeout = setTimeout(() => reject(new Error('Script load timeout')), 15000);
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => { clearTimeout(timeout); resolve(); };
    script.onerror = () => { clearTimeout(timeout); reject(new Error(`Failed to load ${src}`)); };
    document.head.appendChild(script);
  });
};

export const getPoseInstance = async () => {
  if (poseInstance) return poseInstance;

  // If already initializing, wait for that promise instead of double-init
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!window.Pose) {
      await loadScriptOnce('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
    }
    const Pose = window.Pose;
    if (!Pose) throw new Error('MediaPipe Pose failed to load.');

    poseInstance = new Pose({
     locateFile: (file) => `/mediapipe-pose/${file}`
    });
    poseInstance.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return poseInstance;
  })();

  return initPromise;
};

export const loadCameraUtils = async () => {
  if (cameraLoaded) return;
  if (!window.Camera) {
    await loadScriptOnce('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
  }
  cameraLoaded = true;
};

/**
 * Call this once on app startup (e.g. inside Dashboard useEffect).
 * It loads the pose script AND forces MediaPipe to download + compile
 * its WASM/model files by sending a blank canvas frame.
 * By the time the user taps an exercise, everything is already in memory.
 */
export const preloadPose = async () => {
  if (warmUpDone) return;
  try {
    const pose = await getPoseInstance();

    // Set a no-op results handler for warm-up
    pose.onResults(() => {});

    // Send a tiny blank canvas to force WASM + model download NOW
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    await pose.send({ image: canvas });

    warmUpDone = true;
  } catch (e) {
    // Warm-up failure is non-fatal — app still works, just slower on first use
    console.warn('Pose preload failed (non-fatal):', e);
  }
};