import { useRef, useCallback, useState } from 'react';
import {
  getVoiceConfig,
  inRange,
  pickRandom,
  MILESTONE_CUES,
  ENCOURAGEMENT_CUES,
  START_CUES,
  COMPLETE_CUES,
} from './voiceCoaching';

export default function useVoiceCoach({ isPremium }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const isEnabledRef = useRef(false); // FIX 1: ref to avoid stale closure

  const lastSpeakTimeRef      = useRef(0);
  const lastEncouragementRef  = useRef(0);
  const lastFormTipRef        = useRef(0);
  const inDownPositionRef     = useRef(false);
  const downFramesRef         = useRef(0);
  const upFramesRef           = useRef(0);
  const holdStartRef          = useRef(0);
  const lastHoldCueRef        = useRef(0);
  const prevRepCountRef       = useRef(0);
  const voicesLoadedRef       = useRef(false);
  const preferredVoiceRef     = useRef(null);

  const REQUIRED_FRAMES   = 4;
  const HIGH_MIN_INTERVAL = 700;
  const LOW_MIN_INTERVAL  = 3000;
  const FORM_TIP_INTERVAL = 8;
  const HOLD_CUE_INTERVAL = 4000;

  const loadVoices = useCallback(() => {
    if (voicesLoadedRef.current) return;
    const voices = window.speechSynthesis?.getVoices() || [];
    if (voices.length > 0) {
      preferredVoiceRef.current = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
         v.name.includes('Samantha') ||
         v.name.includes('Daniel') ||
         v.name.includes('Microsoft'))
      ) || voices.find(v => v.lang.startsWith('en')) || null;
      voicesLoadedRef.current = true;
    }
  }, []);

  // FIX 1: speak uses isEnabledRef.current instead of isEnabled state
  const speak = useCallback((text, priority = 'low') => {
    if (!isEnabledRef.current || !isPremium) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const now = Date.now();
    const minInterval = priority === 'high' ? HIGH_MIN_INTERVAL : LOW_MIN_INTERVAL;
    if (now - lastSpeakTimeRef.current < minInterval) return;

    loadVoices();

    try {
      if (priority === 'high') {
        window.speechSynthesis.cancel();
      } else if (window.speechSynthesis.speaking) {
        return;
      }

      lastSpeakTimeRef.current = now;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate   = 1.05;
      utterance.pitch  = 1.0;
      utterance.volume = 1.0;
      utterance.lang   = 'en-US';
      if (preferredVoiceRef.current) utterance.voice = preferredVoiceRef.current;
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.error('Speech error:', e.error);
        }
      };
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Voice error:', err);
    }
  }, [isPremium, loadVoices]); // FIX 1: removed isEnabled from deps

  const toggle = useCallback(() => {
    if (!isPremium) return false;
    setIsEnabled(prev => {
      const next = !prev;
      isEnabledRef.current = next; // FIX 1: keep ref in sync
      if (next) {
        const trySpeak = () => {
          loadVoices();
          const u = new SpeechSynthesisUtterance('Voice coach ready!');
          u.rate = 1.1; u.volume = 1.0; u.lang = 'en-US';
          if (preferredVoiceRef.current) u.voice = preferredVoiceRef.current;
          window.speechSynthesis?.speak(u);
        };
        if ((window.speechSynthesis?.getVoices() || []).length > 0) {
          trySpeak();
        } else if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = trySpeak;
        }
      } else {
        window.speechSynthesis?.cancel();
      }
      return next;
    });
  }, [isPremium, loadVoices]); // FIX 5: removed isEnabled from deps

  const reset = useCallback(() => {
    inDownPositionRef.current    = false;
    downFramesRef.current        = 0;
    upFramesRef.current          = 0;
    holdStartRef.current         = 0;
    lastHoldCueRef.current       = 0;
    prevRepCountRef.current      = 0;
    lastEncouragementRef.current = 0;
    lastFormTipRef.current       = 0;
  }, []);

  const onStart = useCallback(() => {
    reset();
    setTimeout(() => {
      speak(pickRandom(START_CUES), 'high');
    }, 1500);
  }, [reset, speak]);

  const onComplete = useCallback(() => {
    speak(pickRandom(COMPLETE_CUES), 'high');
    reset();
  }, [speak, reset]);

  // FIX 4: onAngle is now stable — speak no longer depends on isEnabled state
  const onAngle = useCallback((angle, exercise, repCount) => {
    if (!isEnabledRef.current || !isPremium || !exercise || angle <= 0) return;

    const config = getVoiceConfig(exercise.id);
    const now = Date.now();

    if (config.isHold) {
      const goodForm = inRange(angle, config.holdRange);
      if (goodForm) {
        if (holdStartRef.current === 0) holdStartRef.current = now;
        const heldFor = now - holdStartRef.current;
        if (heldFor > 1000 && now - lastHoldCueRef.current > HOLD_CUE_INTERVAL) {
          lastHoldCueRef.current = now;
          speak(pickRandom(config.holdCue), 'high');
        }
      } else {
        holdStartRef.current = 0;
      }
      return;
    }

    const { downRange, upRange, goDownCue, goUpCue, formTips } = config;

    if (inRange(angle, downRange)) {
      downFramesRef.current++;
      upFramesRef.current = Math.max(0, upFramesRef.current - 2);
    } else if (inRange(angle, upRange)) {
      upFramesRef.current++;
      downFramesRef.current = Math.max(0, downFramesRef.current - 2);
    } else {
      downFramesRef.current = Math.max(0, downFramesRef.current - 1);
      upFramesRef.current   = Math.max(0, upFramesRef.current - 1);
    }

    if (downFramesRef.current >= REQUIRED_FRAMES && !inDownPositionRef.current) {
      inDownPositionRef.current = true;
      downFramesRef.current = 0;
      speak(pickRandom(goUpCue), 'high');
    }

    if (upFramesRef.current >= REQUIRED_FRAMES && inDownPositionRef.current) {
      inDownPositionRef.current = false;
      upFramesRef.current = 0;
      speak(pickRandom(goDownCue), 'high');
    }

    if (repCount !== prevRepCountRef.current) {
      prevRepCountRef.current = repCount;

      const milestone = MILESTONE_CUES[repCount];
      if (milestone) {
        setTimeout(() => speak(pickRandom(milestone), 'high'), 400);
        return;
      }

      if (repCount > 0 && repCount % 7 === 0 && repCount !== lastEncouragementRef.current) {
        lastEncouragementRef.current = repCount;
        speak(pickRandom(ENCOURAGEMENT_CUES), 'low');
        return;
      }

      if (repCount > 0 && repCount % FORM_TIP_INTERVAL === 0 &&
          repCount !== lastFormTipRef.current && formTips?.length) {
        lastFormTipRef.current = repCount;
        speak(pickRandom(formTips), 'low');
      }
    }
  }, [isPremium, speak]); // FIX 4: stable — no isEnabled state dep

  return {
    isEnabled,
    toggle,
    reset,
    onStart,
    onComplete,
    onAngle,
    speak,
  };
}