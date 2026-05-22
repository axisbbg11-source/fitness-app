// src/poseLoader.js

let poseInstance = null;
let cameraLoaded = false;

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

  if (!window.Pose) {
    await loadScriptOnce('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
  }

  const Pose = window.Pose;
  if (!Pose) throw new Error('MediaPipe Pose failed to load.');

  poseInstance = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });
  poseInstance.setOptions({
    modelComplexity: 0,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  return poseInstance;
};

export const loadCameraUtils = async () => {
  if (cameraLoaded) return;
  if (!window.Camera) {
    await loadScriptOnce('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
  }
  cameraLoaded = true;
};