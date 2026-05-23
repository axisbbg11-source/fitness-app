import React, { useState, useRef, useEffect, useCallback } from 'react';

import {
  Home as HomeIcon,
  Dumbbell,
  Flower2,
  Bike,
  StretchHorizontal,
  Zap,
  Lock,
  Crown,
  Square,
  Bot,
  Utensils,
  Microscope,
  Flame,
  Activity,
  Timer,
  RotateCcw,
  ChevronRight,
  Sparkles,
  User,
  Target,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Shield,
  Smartphone,
  Brain,
  Camera,
  Cpu,
  Loader2,
  Volume2,
  VolumeX,
  Mic,
  Trophy,
  CalendarDays,
  FlameKindling,
  Edit3,
  BarChart3,
} from 'lucide-react';
import exercises, { categories } from './data/exercises';
import ParticleBackground from './components';
import { createRepDetector } from './repDetection.js';
import { useAuth } from './AuthContext';
import { useNavigate , Navigate } from 'react-router-dom';
import useVoiceCoach from './useVoiceCoach';
import PrivacyPopup from './PrivacyPopup';
import { getPoseInstance, loadCameraUtils } from './poseLoader';
// ==================== LOADING TIPS ====================

const LOADING_TIPS = [
  { icon: Flame, text: 'Tip: Stay hydrated during your workout!' },
  { icon: Activity, text: 'Tip: Focus on form over speed for better results.' },
  { icon: Timer, text: 'Tip: Rest 30-60 seconds between sets.' },
  { icon: Target, text: 'Tip: Set realistic goals to stay motivated.' },
  { icon: Zap, text: 'Tip: Consistency beats intensity every time.' },
  { icon: Dumbbell, text: 'Tip: Warm up for 5 minutes before starting.' },
];

const LOADING_STEPS = [
  { key: 'camera', label: 'Accessing Camera', icon: Camera },
  { key: 'model', label: 'Loading AI Model', icon: Cpu },
  { key: 'detect', label: 'Detecting Pose', icon: Brain },
  { key: 'ready', label: 'Ready to Go!', icon: CheckCircle2 },
];

// ==================== CATEGORY ICONS MAP ====================
const categoryIcons = {
  Home: HomeIcon,
  Gym: Dumbbell,
  Yoga: Flower2,
  Cardio: Bike,
  Stretch: StretchHorizontal,
  Strength: Zap,
};

// ==================== PER-REP CALORIE SYSTEM ====================
const CALORIES_PER_REP = {
  'home-squat': 0.80, 'home-pushup': 0.64, 'home-jumpingjack': 0.70,
  'home-lunge': 0.75, 'home-plank': 0.05, 'home-burpees': 1.60,
  'home-mountainclimbers': 0.90, 'home-highknees': 0.85, 'home-bicyclecrunches': 0.50,
  'home-wallsit': 0.05, 'home-tricepdips': 0.60, 'home-glutebridges': 0.45,
  'home-supermanhold': 0.05, 'home-donkeykicks': 0.45, 'home-inchworms': 0.70,
  'home-tuckjumps': 1.40, 'home-plankjacks': 0.80, 'home-skaterjumps': 1.10,
  'home-bearcrawl': 0.85, 'home-vups': 0.60, 'home-pikepushups': 0.70,
  'home-commandoplank': 0.50, 'home-speedsquats': 0.90, 'home-flutterkicks': 0.35,
  'home-reverselunge': 0.75,
  'gym-barbellsquat': 1.00, 'gym-benchpress': 0.80, 'gym-deadlift': 1.20,
  'gym-latpulldown': 0.60, 'gym-bicepcurl': 0.35, 'gym-shoulderpress': 0.60,
  'gym-legpress': 0.80, 'gym-chestfly': 0.55, 'gym-row': 0.70,
  'gym-triceppushdown': 0.30, 'gym-legcurl': 0.45, 'gym-legextension': 0.40,
  'gym-lateralraise': 0.30, 'gym-facepull': 0.30, 'gym-calfraise': 0.25,
  'gym-cablecrossover': 0.55, 'gym-hacksquat': 0.90, 'gym-romaniandeadlift': 1.00,
  'gym-inclinepress': 0.70, 'gym-preachercurl': 0.35, 'gym-skullcrusher': 0.40,
  'gym-hyperextension': 0.35, 'gym-woodchopper': 0.55, 'gym-farmerwalk': 0.60,
  'gym-shrug': 0.30,
  'yoga-mountainpose': 0.03, 'yoga-warrior1': 0.06, 'yoga-downwarddog': 0.06,
  'yoga-treepose': 0.04, 'yoga-cobrapose': 0.04, 'yoga-warrior2': 0.06,
  'yoga-triangle': 0.05, 'yoga-chair': 0.08, 'yoga-crow': 0.10,
  'yoga-bridge': 0.05, 'yoga-boat': 0.07, 'yoga-camel': 0.06,
  'yoga-pigeon': 0.04, 'yoga-catcow': 0.04, 'yoga-childspose': 0.03,
  'yoga-forwardfold': 0.04, 'yoga-halfmoon': 0.06, 'yoga-lordofdance': 0.07,
  'yoga-eagle': 0.05, 'yoga-wheel': 0.10, 'yoga-plow': 0.05,
  'yoga-fish': 0.04, 'yoga-seatedtwist': 0.04, 'yoga-hero': 0.03,
  'yoga-staffpose': 0.03,
  'cardio-jumpingjacks': 0.70, 'cardio-highknees': 0.90, 'cardio-buttkicks': 0.80,
  'cardio-mountainclimbers': 0.90, 'cardio-burpees': 1.60, 'cardio-tuckjumps': 1.40,
  'cardio-boxjumps': 1.50, 'cardio-skaterjumps': 1.10, 'cardio-speedskaters': 1.10,
  'cardio-jumprope': 0.15, 'cardio-stepups': 0.60, 'cardio-sprintintervals': 1.20,
  'cardio-lateralshuffles': 0.70, 'cardio-powerskips': 1.30, 'cardio-broadjumps': 1.40,
  'cardio-splitjumps': 1.50, 'cardio-staggeredpushups': 0.90, 'cardio-plyopushups': 1.00,
  'cardio-squatjumps': 1.30, 'cardio-clappushups': 1.10, 'cardio-depthjumps': 1.60,
  'cardio-hurdlehops': 1.40, 'cardio-shuttlerun': 1.10, 'cardio-agilityladder': 0.90,
  'cardio-dotdrills': 0.80,
  'stretch-hamstring': 0.03, 'stretch-quad': 0.03, 'stretch-shoulder': 0.03,
  'stretch-catcow': 0.04, 'stretch-forwardbend': 0.03, 'stretch-butterfly': 0.03,
  'stretch-piriformis': 0.02, 'stretch-hipflexor': 0.03, 'stretch-neck': 0.02,
  'stretch-wrist': 0.02, 'stretch-anklecircles': 0.02, 'stretch-cobra': 0.03,
  'stretch-childspose': 0.02, 'stretch-pigeon': 0.03, 'stretch-figurefour': 0.03,
  'stretch-lunge': 0.05, 'stretch-tricep': 0.03, 'stretch-sidebend': 0.03,
  'stretch-spinaltwist': 0.03, 'stretch-wallcalf': 0.03, 'stretch-chestopener': 0.03,
  'stretch-foamroll': 0.04, 'stretch-itband': 0.03, 'stretch-frog': 0.03,
  'stretch-scorpion': 0.04,
  'strength-gobletsquat': 0.90, 'strength-pushupvariation': 0.70, 'strength-pullup': 1.00,
  'strength-kettlebellswing': 1.10, 'strength-overheadpress': 0.60, 'strength-frontsquat': 1.00,
  'strength-sumodeadlift': 1.20, 'strength-renegaderow': 0.90, 'strength-thruster': 1.10,
  'strength-turkishgetup': 0.80, 'strength-cleanandpress': 1.30, 'strength-snatch': 1.40,
  'strength-weightedlunge': 0.80, 'strength-farmercarry': 0.60, 'strength-sledpush': 1.50,
  'strength-battleropes': 1.20, 'strength-boxsquat': 1.00, 'strength-zerchersquat': 1.00,
  'strength-deficitdeadlift': 1.30, 'strength-pausedbench': 0.80, 'strength-rackpull': 1.10,
  'strength-pinpress': 0.70, 'strength-bandedcurl': 0.35, 'strength-chainsquat': 1.10,
  'strength-atlasstone': 1.40,
};

function getCalPerRep(exercise) {
  if (!exercise) return 0.5;
  if (CALORIES_PER_REP[exercise.id]) return CALORIES_PER_REP[exercise.id];
  const fallbacks = {
    Home: { easy: 0.5, medium: 0.7, hard: 1.2 },
    Gym: { easy: 0.4, medium: 0.6, hard: 0.9 },
    Yoga: { easy: 0.03, medium: 0.06, hard: 0.10 },
    Cardio: { easy: 0.6, medium: 0.9, hard: 1.4 },
    Stretch: { easy: 0.02, medium: 0.04, hard: 0.06 },
    Strength: { easy: 0.5, medium: 0.8, hard: 1.2 },
  };
  return fallbacks[exercise.category]?.[exercise.difficulty] || 0.5;
}

// ==================== DAILY TARGET SYSTEM ====================
const DAILY_TARGET_KEY = 'fitcoach-daily-targets';
const DAILY_PROGRESS_KEY = 'fitcoach-daily-progress';
const STREAK_KEY = 'fitcoach-streak';
const DEFAULT_TARGETS = { calories: 300, workoutMin: 30, reps: 50 };

function getTodayKey() { return new Date().toISOString().split('T')[0]; }

function loadDailyTargets() {
  if (typeof window === 'undefined') return DEFAULT_TARGETS;
  try { const raw = localStorage.getItem(DAILY_TARGET_KEY); return raw ? { ...DEFAULT_TARGETS, ...JSON.parse(raw) } : DEFAULT_TARGETS; }
  catch { return DEFAULT_TARGETS; }
}
function saveDailyTargets(targets) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(DAILY_TARGET_KEY, JSON.stringify(targets)); } catch {}
}
function loadDailyProgress() {
  const today = getTodayKey();
  const def = { date: today, calories: 0, workoutSeconds: 0, reps: 0, workoutsCompleted: 0 };
  if (typeof window === 'undefined') return def;
  try { const raw = localStorage.getItem(DAILY_PROGRESS_KEY); if (raw) { const data = JSON.parse(raw); if (data.date === today) return data; } return def; }
  catch { return def; }
}
function saveDailyProgress(progress) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(progress)); } catch {}
}
function loadStreak() {
  if (typeof window === 'undefined') return { current: 0, best: 0, lastActiveDate: '' };
  try { const raw = localStorage.getItem(STREAK_KEY); if (raw) return JSON.parse(raw); } catch {}
  return { current: 0, best: 0, lastActiveDate: '' };
}
function saveStreak(streak) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(streak)); } catch {}
}
function updateStreakOnActivity() {
  const today = getTodayKey();
  const streak = loadStreak();
  if (streak.lastActiveDate === today) return streak;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  const newCurrent = streak.lastActiveDate === yesterdayKey ? streak.current + 1 : 1;
  const newStreak = { current: newCurrent, best: Math.max(newCurrent, streak.best), lastActiveDate: today };
  saveStreak(newStreak); return newStreak;
}
function loadWeeklyProgress() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
    if (i === 0) { const progress = loadDailyProgress(); result.push({ day: dayName, calories: progress.calories }); }
    else { try { const raw = localStorage.getItem(`fitcoach-weekly-${key}`); if (raw) { const data = JSON.parse(raw); result.push({ day: dayName, calories: data.calories || 0 }); } else { result.push({ day: dayName, calories: 0 }); } } catch { result.push({ day: dayName, calories: 0 }); } }
  }
  return result;
}
function saveToWeeklyHistory(progress) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`fitcoach-weekly-${progress.date}`, JSON.stringify({ calories: progress.calories, reps: progress.reps, workoutSeconds: progress.workoutSeconds })); } catch {}
}

// ==================== PROGRESS RING ====================
function ProgressRing({ progress, size, strokeWidth, color, bgColor }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-700 ease-out" />
    </svg>
  );
}

// ==================== ANGLE CALCULATION ====================
function getAngle3(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}
function isLandmarkVisible(lm, threshold = 0.4) { return (lm.visibility ?? 0) >= threshold; }

function calculateSingleSideAngle(landmarks, trackJoint, side) {
  const s = side === 'left' ? 0 : 1;
  const shoulder = landmarks[11+s], elbow = landmarks[13+s], wrist = landmarks[15+s];
  const hip = landmarks[23+s], knee = landmarks[25+s], ankle = landmarks[27+s], foot = landmarks[31+s];
  const lS = landmarks[11], rS = landmarks[12], lH = landmarks[23], rH = landmarks[24];
  switch (trackJoint) {
    case 'knee': if (!isLandmarkVisible(hip)||!isLandmarkVisible(knee)||!isLandmarkVisible(ankle)) return {angle:180,valid:false}; return {angle:getAngle3(hip,knee,ankle),valid:true};
    case 'hip': if (!isLandmarkVisible(shoulder)||!isLandmarkVisible(hip)||!isLandmarkVisible(knee)) return {angle:180,valid:false}; return {angle:getAngle3(shoulder,hip,knee),valid:true};
    case 'elbow': if (!isLandmarkVisible(shoulder)||!isLandmarkVisible(elbow)||!isLandmarkVisible(wrist)) return {angle:180,valid:false}; return {angle:getAngle3(shoulder,elbow,wrist),valid:true};
    case 'shoulder': if (!isLandmarkVisible(hip)||!isLandmarkVisible(shoulder)||!isLandmarkVisible(elbow)) return {angle:180,valid:false}; return {angle:getAngle3(hip,shoulder,elbow),valid:true};
    case 'ankle': if (!isLandmarkVisible(knee)||!isLandmarkVisible(ankle)||!isLandmarkVisible(foot)) return {angle:180,valid:false}; return {angle:getAngle3(knee,ankle,foot),valid:true};
    case 'spine': {
      const mS={x:(lS.x+rS.x)/2,y:(lS.y+rS.y)/2}, mH={x:(lH.x+rH.x)/2,y:(lH.y+rH.y)/2};
      if (!isLandmarkVisible(lS)||!isLandmarkVisible(rS)||!isLandmarkVisible(lH)||!isLandmarkVisible(rH)) return {angle:180,valid:false};
      const dx=mH.x-mS.x, dy=mH.y-mS.y;
      return {angle:180-Math.abs(Math.atan2(dx,dy)*(180/Math.PI)),valid:true};
    }
    default: return {angle:180,valid:false};
  }
}

function calculateAngle(landmarks, trackJoint) {
  if (trackJoint === 'spine') { const r=calculateSingleSideAngle(landmarks,trackJoint,'left'); return {angle:r.angle,confidence:r.valid?1.0:0.0}; }
  const lR=calculateSingleSideAngle(landmarks,trackJoint,'left');
  const rR=calculateSingleSideAngle(landmarks,trackJoint,'right');
  if (lR.valid && rR.valid) {
    const lV=landmarks[11]?.visibility??0.5, rV=landmarks[12]?.visibility??0.5, tV=lV+rV;
    return {angle:lR.angle*(tV>0?lV/tV:0.5)+rR.angle*(tV>0?rV/tV:0.5),confidence:1.0};
  }
  if (lR.valid) return {angle:lR.angle,confidence:0.7};
  if (rR.valid) return {angle:rR.angle,confidence:0.7};
  return {angle:180,confidence:0};
}

// ==================== BACKEND API ====================
const BACKEND_URL = 'https://fitness-app-50ze.onrender.com';

// ==================== PAYMENT MODAL ====================
const UPI_APPS = [
  { name: 'Google Pay', id: 'gpay', color: '#4285F4' },
  { name: 'PhonePe', id: 'phonepe', color: '#5F259F' },
  { name: 'Paytm', id: 'paytm', color: '#00BAF2' },
  { name: 'BHIM', id: 'bhim', color: '#005A84' },
];

function PaymentModal({ isOpen, onClose, onUpgrade }) {
  const [step, setStep] = useState(1);
  const [isYearly, setIsYearly] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');

  if (!isOpen) return null;

  const basePrice = isYearly ? 999 : 99;
  const finalPrice = couponApplied ? Math.round(basePrice * 0.5) : basePrice;
  const priceLabel = isYearly ? '₹999/yr' : '₹99/mo';
  const finalPriceLabel = couponApplied ? `₹${finalPrice}/${isYearly ? 'yr' : 'mo'}` : priceLabel;

  const validateInfo = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g,''))) return 'Valid 10-digit mobile number required';
    return '';
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (coupon.toLowerCase() === 'fitcoach50') { setCouponApplied(true); }
    else if (coupon.trim()) { setCouponApplied(false); setCouponError('Invalid coupon code'); }
  };

  const handleNext = () => {
    if (step === 1) { setStep(2); }
    else if (step === 2) { const err = validateInfo(); if (err) { setApiError(err); return; } setApiError(''); setStep(3); }
  };

  const handleBack = () => { setApiError(''); if (step > 1) setStep(step - 1); };

  const handleSimulatedPayment = async () => {
    const err = !upiId.trim() || !/^[\w.-]+@[\w]+$/.test(upiId) ? 'Valid UPI ID required (e.g. name@upi)' : '';
    if (err) { setApiError(err); return; }
    setApiError(''); setProcessing(true);
    setTimeout(async () => {
      setProcessing(false);
      setStep(4);
      localStorage.setItem('fitcoach-premium','true');
      try {
        await fetch(`${BACKEND_URL}/api/set-premium`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: 'simulated-payment' }),
        });
      } catch {}
      onUpgrade();
    }, 2000);
  };

  const handleClose = () => {
    if (step === 4) { setStep(1); setFullName(''); setEmail(''); setPhone(''); setAge(''); setGender(''); setFitnessGoal(''); setUpiId(''); setSelectedUpiApp(''); setCoupon(''); setCouponApplied(false); setCouponError(''); setApiError(''); setProcessing(false); }
    onClose();
  };

  const steps = [{num:1,label:'Plan'},{num:2,label:'Details'},{num:3,label:'Payment'}];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      
       style={{
  background:
    'linear-gradient(135deg, rgba(8,12,20,0.98) 0%, rgba(4,8,16,0.99) 100%)',
  border: '1px solid rgba(0,207,255,0.18)',
  boxShadow: '0 0 40px rgba(0,207,255,0.08)',
  scrollbarWidth: 'thin',
}}
>
        {/* CLOSE BUTTON */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
      >
        ✕
      </button>

        {step < 4 && (
          <div className="px-8 pt-6 pb-2">
            <div className="flex items-center justify-between mb-1">
              {steps.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s.num ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,207,255,0.3)]' : 'bg-white/10 text-gray-500'}`}>
                      {step > s.num ? <CheckCircle2 size={14} /> : s.num}
                    </div>
                    <span className={`text-xs font-semibold ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${step > s.num ? 'bg-cyan-400/70' : 'bg-white/10'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        <div className="px-8 pb-8">
          {step === 1 && (
            <div className="text-center">
              <div className="flex justify-center mb-3"><Crown size={44} className="text-yellow-400" /></div>
              <h2 className="text-2xl font-bold text-white mb-1">Unlock FitCoach Pro</h2>
              <p className="text-gray-400 text-sm mb-5">Get unlimited access to all premium features</p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[{icon:Dumbbell,text:'150+ Exercises'},{icon:Bot,text:'AI Form Coaching'},{icon:Volume2,text:'AI Voice Coach'},{icon:Utensils,text:'Custom Diet Plans'},{icon:Sparkles,text:'No Ads'}].map((f) => (
                  <div key={f.text} className="bg-white/5 rounded-xl p-2.5 flex items-center gap-2">
                    <f.icon size={16} className="text-cyan-300" />
                    <span className="text-white text-xs font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className={`text-sm font-semibold ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                <button onClick={() => setIsYearly(!isYearly)} className="relative w-12 h-6 rounded-full cursor-pointer transition-colors" style={{ backgroundColor: isYearly ? '#4FD1FF' : '#374151',
boxShadow: isYearly
  ? '0 0 18px rgba(79,209,255,0.45)'
  : 'none' }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ left: isYearly ? '1.6rem' : '0.125rem' }} />
                </button>
                <span className={`text-sm font-semibold ${isYearly ? 'text-white' : 'text-gray-500'}`}>Yearly</span>
                {isYearly && <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Save 16%</span>}
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="text-3xl font-extrabold text-white">
                  {couponApplied && <span className="text-gray-500 line-through text-lg mr-2">{priceLabel}</span>}
                  {finalPriceLabel}
                </div> 
                {couponApplied && <p className="text-green-400 text-xs mt-1 font-semibold">50% OFF applied with FITCOACH50</p>}
              </div> 
              <div className="flex gap-2 mb-5">
                <input type="text" placeholder="Coupon code" value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponError(''); if (couponApplied) setCouponApplied(false); }}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" />
                <button className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 cursor-pointer transition-colors" onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponError && <p className="text-red-400 text-xs mb-3 -mt-3">{couponError}</p>}
              <button
  onClick={handleNext}
  className="w-full py-3.5 rounded-xl text-cyan-100 font-semibold text-base cursor-pointer transition-all border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 hover:shadow-[0_0_25px_rgba(0,207,255,0.35)] backdrop-blur-md flex items-center justify-center gap-2 mt-4"
>
  Continue <ArrowRight size={16} />
</button>

            </div>

          )}
          {step === 2 && (
            
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-sky-300/70/20 flex items-center justify-center"><User size={16} className="text-sky-300" /></div>
                <div><h3 className="text-lg font-bold text-white">Your Details</h3><p className="text-gray-400 text-xs">Required for subscription activation</p></div>
              </div>
              <div className="space-y-3">
              
                <div><label className="text-gray-300 text-xs font-semibold mb-1 block">Full Name <span className="text-sky-300">*</span></label><input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /></div>
                <div><label className="text-gray-300 text-xs font-semibold mb-1 block">Email <span className="text-sky-300">*</span></label><input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /></div>
                <div><label className="text-gray-300 text-xs font-semibold mb-1 block">Phone Number <span className="text-sky-300">*</span></label><input type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g,'').slice(0,10))} className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-gray-300 text-xs font-semibold mb-1 block">Age</label><input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value.replace(/[^\d]/g,'').slice(0,3))} className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /></div>
                  <div><label className="text-gray-300 text-xs font-semibold mb-1 block">Gender</label><select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors appearance-none cursor-pointer" style={{ colorScheme: 'dark' }}><option value="" className="bg-[#1a1a2e]">Select</option><option value="male" className="bg-[#1a1a2e]">Male</option><option value="female" className="bg-[#1a1a2e]">Female</option><option value="other" className="bg-[#1a1a2e]">Other</option></select></div>
                </div>
                <div><label className="text-gray-300 text-xs font-semibold mb-1 block">Fitness Goal</label><select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors appearance-none cursor-pointer" style={{ colorScheme: 'dark' }}><option value="" className="bg-[#1a1a2e]">Select your goal</option><option value="weight-loss" className="bg-[#1a1a2e]">Weight Loss</option><option value="muscle-gain" className="bg-[#1a1a2e]">Muscle Gain</option><option value="flexibility" className="bg-[#1a1a2e]">Flexibility</option><option value="general" className="bg-[#1a1a2e]">General Fitness</option></select></div>
              </div>
              {apiError && <p className="text-red-400 text-xs mt-3">{apiError}</p>}
              <div className="flex gap-3 mt-5">
                <button onClick={handleBack} className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm cursor-pointer hover:bg-white/20 transition-colors flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
                <button onClick={handleNext} className="flex-1 py-3 rounded-xl text-white font-bold text-sm cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(79,209,255,0.4)] flex items-center justify-center gap-2" style={{ backgroundColor: '#25a5a8' }}>Continue to Payment <ArrowRight size={14} /></button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-sky-300/70/20 flex items-center justify-center"><CreditCard size={16} className="text-sky-300" /></div>
                <div><h3 className="text-lg font-bold text-white">UPI Payment</h3><p className="text-gray-400 text-xs">Pay securely with UPI</p></div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h4 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-300">FitCoach Pro ({isYearly ? 'Yearly' : 'Monthly'})</span><span className="text-white font-semibold">{priceLabel}</span></div>
                  {couponApplied && <div className="flex justify-between"><span className="text-green-400">Coupon (FITCOACH50)</span><span className="text-green-400 font-semibold">-₹{basePrice - finalPrice}</span></div>}
                  <div className="border-t border-white/10 pt-2 flex justify-between"><span className="text-white font-bold">Total</span><span className="text-sky-300 font-extrabold text-lg">₹{finalPrice}</span></div>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-gray-300 text-xs font-semibold mb-2 block">Choose UPI App</label>
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) => (
                    <button key={app.id} onClick={() => { setSelectedUpiApp(app.id); if (!upiId) setUpiId(`yourname@${app.id}`); }}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-pointer transition-all border ${selectedUpiApp === app.id ? 'border-[#4FD1FF] bg-sky-300/70/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <Smartphone size={18} style={{ color: app.color }} />
                      <span className="text-white text-[10px] font-medium">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4"><label className="text-gray-300 text-xs font-semibold mb-1 block">UPI ID <span className="text-sky-300">*</span></label><input type="text" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /></div>
              <div className="flex items-center gap-2 mb-3 bg-green-400/5 rounded-xl p-3"><Shield size={14} className="text-green-400 shrink-0" /><p className="text-green-400/80 text-[10px] leading-relaxed">Your payment is secured with bank-grade encryption. We never store your UPI PIN.</p></div>
              {apiError && <p className="text-red-400 text-xs mb-3">{apiError}</p>}
              <div className="flex gap-3">
                <button onClick={handleBack} className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm cursor-pointer hover:bg-white/20 transition-colors flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
                <button onClick={handleSimulatedPayment} disabled={processing} className="flex-1 py-3 rounded-xl text-white font-bold text-sm cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(79,209,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ backgroundColor: '#4FD1FF' }}>
                  {processing ? <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</> : `Pay ₹${finalPrice} via UPI`}
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4"><div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center"><CheckCircle2 size={40} className="text-green-400" /></div></div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Pro!</h2>
              <p className="text-gray-400 text-sm mb-5">Your subscription is now active. Enjoy unlimited access!</p>
              <div className="bg-white/5 rounded-xl p-4 mb-5 text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Plan</span><span className="text-white font-semibold">{isYearly ? 'Yearly' : 'Monthly'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Amount Paid</span><span className="text-sky-300 font-bold">₹{finalPrice}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Name</span><span className="text-white font-semibold">{fullName}</span></div>
              </div>
              <button onClick={handleClose} className="w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(79,209,255,0.4)]" style={{ backgroundColor: '#4FD1FF' }}>Start Training</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN DASHBOARD ====================
export default function Dashboard() {
  const { user, loading, logout } = useAuth();

if (loading) {
  return (
    <div className="h-screen flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

if (!user) {
  return <Navigate to="/login" replace />;
}
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedCategory, setSelectedCategory] = useState('Home');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [timer, setTimer] = useState('Preparing...');
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [coachFeedback, setCoachFeedback] = useState('');
  const [currentAngles, setCurrentAngles] = useState({});
  const [cameraError, setCameraError] = useState('');
  const [modelLoading, setModelLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingTip, setLoadingTip] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [dietPlan, setDietPlan] = useState('');
  const [dietLoading, setDietLoading] = useState(false);
  const [mealInput, setMealInput] = useState('');
  const [dietAnalysis, setDietAnalysis] = useState(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [dailyTargets, setDailyTargets] = useState(DEFAULT_TARGETS);
  const [dailyProgress, setDailyProgress] = useState({ date: getTodayKey(), calories: 0, workoutSeconds: 0, reps: 0, workoutsCompleted: 0 });
  const [streak, setStreak] = useState({ current: 0, best: 0, lastActiveDate: '' });
  const [weeklyData, setWeeklyData] = useState([]);
  const [editingTargets, setEditingTargets] = useState(false);
  const [editCalTarget, setEditCalTarget] = useState('300');
  const [editMinTarget, setEditMinTarget] = useState('30');
  const [editRepTarget, setEditRepTarget] = useState('50');

  // ── Refs ──────────────────────────────────────────────────
  const videoRef          = useRef(null);
  const canvasRef         = useRef(null);
  const poseReadyRef      = useRef(false);
  const workoutStartRef   = useRef(0);
  const repCountRef       = useRef(0);
  const calibrationRef = useRef({
  calibrated: false,
  repsObserved: 0,
  learnedMin: null,
  learnedMax: null,
});
  const timerIntervalRef  = useRef(null);
  const cameraInstanceRef = useRef(null);
  const poseInstanceRef   = useRef(null);
  const goodFormCountRef  = useRef(0);
  const lastDiffSuggRef   = useRef(0);
  const modelLoadingRef   = useRef(false);
  const loadingStepRef    = useRef(0);
  const onResultsRef      = useRef(null);
  const smoothedAngleRef  = useRef(null); // kept for voice coach compatibility
  const caloriesBurnedRef = useRef(0);
  const isWorkingOutRef   = useRef(false);
  const currentExerciseRef= useRef(null);
  const animationFrameRef = useRef(null);
  const tipIntervalRef    = useRef(null);
  const lastUIUpdateRef   = useRef(0);
  const feedbackThrottleRef = useRef(0);
  // ── NEW: forgiving rep detector instance ──────────────────
  const repDetectorRef    = useRef(null);

  // ── Voice Coach Hook ──────────────────────────────────────
  const voiceCoach = useVoiceCoach({ isPremium });
  const voiceCoachOnAngle    = voiceCoach.onAngle;
  const voiceCoachOnStart    = voiceCoach.onStart;
  const voiceCoachOnComplete = voiceCoach.onComplete;

  // Keep currentExerciseRef in sync
  useEffect(() => { currentExerciseRef.current = currentExercise; }, [currentExercise]);

  const filteredExercises = exercises.filter((ex) => {
    const catMatch = ex.category === selectedCategory;
    const diffMatch = difficultyFilter === 'All' || ex.difficulty === difficultyFilter.toLowerCase();
    return catMatch && diffMatch;
  });

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); }, []);

  useEffect(() => {
    const init = async () => {
      const targets = loadDailyTargets();
      const progress = loadDailyProgress();
      const streakData = loadStreak();
      const weekly = loadWeeklyProgress();
      setDailyTargets(targets); setDailyProgress(progress); setStreak(streakData); setWeeklyData(weekly);
      setEditCalTarget(String(targets.calories)); setEditMinTarget(String(targets.workoutMin)); setEditRepTarget(String(targets.reps));
      if (user?.uid) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/check-premium`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid }),
          });
          const data = await res.json();
          if (data.isPremium) setIsPremium(true);
        } catch {
          const localPremium = localStorage.getItem('fitcoach-premium');
          if (localPremium === 'true') setIsPremium(true);
        }
      }
    };
    init();
  }, [user]);

  const saveTargetEdits = useCallback(() => {
    const newTargets = { calories: parseInt(editCalTarget)||300, workoutMin: parseInt(editMinTarget)||30, reps: parseInt(editRepTarget)||50 };
    setDailyTargets(newTargets); saveDailyTargets(newTargets); setEditingTargets(false); showToast('Daily targets updated!');
  }, [editCalTarget, editMinTarget, editRepTarget, showToast]);

  const updateDailyProgress = useCallback((calories, workoutSeconds, reps, incrementWorkout = false) => {
    setDailyProgress(prev => {
      const updated = { date: getTodayKey(), calories: Math.max(prev.calories, calories), workoutSeconds: Math.max(prev.workoutSeconds, workoutSeconds), reps: Math.max(prev.reps, reps), workoutsCompleted: prev.workoutsCompleted + (incrementWorkout ? 1 : 0) };
      saveDailyProgress(updated); saveToWeeklyHistory(updated); return updated;
    });
    setStreak(prev => { const updated = updateStreakOnActivity(); return updated.lastActiveDate === prev.lastActiveDate ? prev : updated; });
    setWeeklyData(loadWeeklyProgress());
  }, []);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    return `${Math.floor(totalSec/60)}:${String(totalSec%60).padStart(2,'0')}`;
  };

  const checkAutoDifficulty = useCallback((exercise, currentRepCount, angle) => {
    if (!exercise) return;
    const idealAngle = exercise.form[0]?.ideal || 90;
    if (Math.abs(angle - idealAngle) < 20) goodFormCountRef.current++;
    if (currentRepCount > 0 && currentRepCount % 5 === 0 && currentRepCount !== lastDiffSuggRef.current) {
      lastDiffSuggRef.current = currentRepCount;
      if (goodFormCountRef.current >= 10 && exercise.difficulty !== 'hard') {
        const next = exercise.difficulty === 'easy' ? 'medium' : 'hard';
        showToast(`Great form! Consider trying ${next} difficulty`);
      }
    }
  }, [showToast]);

  // ==================== onResults ====================
// ═══════════════════════════════════════════════════════════════════
// SECTION A — Replace your <canvas> line (inside camera JSX block)
// ═══════════════════════════════════════════════════════════════════

// OLD:
// <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

// NEW:
// <canvas
//   ref={canvasRef}
//   className="absolute top-0 left-0 w-full h-full"
//   style={{ transform: 'scaleX(-1)', pointerEvents: 'none' }}
// />


// ═══════════════════════════════════════════════════════════════════
// SECTION B — Complete fixed onResults (replace your entire onResults)
// ═══════════════════════════════════════════════════════════════════

const onResults = useCallback((results) => {
  const currentExercise = currentExerciseRef.current;
  if (!results.poseLandmarks || results.poseLandmarks.length < 33 || !currentExercise) return;

  if (modelLoadingRef.current) {
    modelLoadingRef.current = false;
    setModelLoading(false);
    setLoadingStep(4);
    setTimeout(() => setLoadingStep(0), 800);
  }

  const landmarks = results.poseLandmarks;

  if (!poseReadyRef.current) {
    poseReadyRef.current = true;
    workoutStartRef.current = Date.now();
    setTimer('0:00');
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - workoutStartRef.current;
      setTimer(formatTime(elapsed));
      updateDailyProgress(caloriesBurnedRef.current, Math.floor(elapsed / 1000), repCountRef.current);
    }, 1000);
  }

  // ── Draw skeleton ──────────────────────────────────────────────
  // NOTE: canvas has scaleX(-1) applied via style, so we draw in
  // ORIGINAL (unmirrored) coordinate space — no x-flip needed here.
  const canvas = canvasRef.current;
  const video  = videoRef.current;
  if (canvas && video) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const vw = video.videoWidth  || 640;
      const vh = video.videoHeight || 480;
      if (canvas.width  !== vw) canvas.width  = vw;
      if (canvas.height !== vh) canvas.height = vh;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw in original coordinate space (canvas CSS handles the mirror)
      const px = (lm) => lm.x * canvas.width;
      const py = (lm) => lm.y * canvas.height;

      const connectionGroups = [
        { pairs: [[11,13],[13,15]], color: '#00ff88' },
        { pairs: [[12,14],[14,16]], color: '#00ccff' },
        { pairs: [[11,12]],        color: '#ffaa00' },
        { pairs: [[11,23],[12,24],[23,24]], color: '#4FD1FF' },
        { pairs: [[23,25],[25,27]], color: '#00ff88' },
        { pairs: [[24,26],[26,28]], color: '#00ccff' },
      ];

      connectionGroups.forEach(({ pairs, color }) => {
        pairs.forEach(([a, b]) => {
          const lmA = landmarks[a], lmB = landmarks[b];
          if (!lmA || !lmB || (lmA.visibility ?? 0) < 0.4 || (lmB.visibility ?? 0) < 0.4) return;
          const opacity = Math.min(1, (((lmA.visibility ?? 0) + (lmB.visibility ?? 0)) / 2) * 1.2);
          ctx.beginPath();
          ctx.moveTo(px(lmA), py(lmA));
          ctx.lineTo(px(lmB), py(lmB));
          ctx.strokeStyle = color;
          ctx.lineWidth   = 3;
          ctx.globalAlpha = opacity * 0.85;
          ctx.lineCap     = 'round';
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      });

      const majorJoints = new Set([11,12,13,14,15,16,23,24,25,26,27,28]);
      landmarks.forEach((lm, i) => {
        const vis = lm.visibility ?? 0;
        if (vis < 0.4) return;
        const isMajor = majorJoints.has(i);
        ctx.beginPath();
        ctx.arc(px(lm), py(lm), isMajor ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle   = isMajor ? '#00ff88' : `rgba(255,255,255,${vis * 0.8})`;
        ctx.globalAlpha = vis;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }
  }

  // ── Angle ──────────────────────────────────────────────────────
  const { angle: rawAngle, confidence } = calculateAngle(landmarks, currentExercise.track);
  const formConfidence =
    confidence * ((landmarks[11]?.visibility || 0) + (landmarks[12]?.visibility || 0)) / 2;

  if (!repDetectorRef.current) {
    repDetectorRef.current = createRepDetector(currentExercise, null);
  }

  const detector = repDetectorRef.current;
  const { counted, smoothed, calibStatus, fatigueStatus } = detector.processAngle(rawAngle);

  // Update calibrationRef for the angle tile display
  calibrationRef.current = {
    calibrated:    !calibStatus.active,
    repsObserved:  calibStatus.repsObserved,
    learnedMin:    calibStatus.learnedMin,
    learnedMax:    calibStatus.learnedMax,
  };

  // Save calibration to localStorage ONLY once when it completes (not every frame)
  if (!calibStatus.active && calibStatus.repsObserved >= 3) {
    try {
      localStorage.setItem(
        `calibration_${currentExercise.id}`,
        JSON.stringify(calibrationRef.current)
      );
    } catch(e) {}
  }

  // ── UI angle display (throttled 100ms) ────────────────────────
  if (rawAngle > 0 && rawAngle <= 360) {
    const displayAngle = detector?.getSmoothed?.() ?? rawAngle;
    if (Date.now() - lastUIUpdateRef.current > 100) {
      lastUIUpdateRef.current = Date.now();
      setCurrentAngles(prev => ({ ...prev, [currentExercise.track]: Math.round(displayAngle) }));
      currentExercise.form.forEach((f) => {
        if (f.joint !== currentExercise.track && f.joint !== 'back') {
          const fR = calculateAngle(landmarks, f.joint);
          if (fR.angle > 0 && fR.angle <= 360) {
            setCurrentAngles(prev => ({ ...prev, [f.joint]: Math.round(fR.angle) }));
          }
        }
      });
    }
  }
 // ── Voice coach (once per frame) ──
    voiceCoachOnAngle(smoothed,currentExercise,repCountRef.current);

    // ── Count rep ──
    if(counted&&formConfidence>0.65){
      const newCount=repCountRef.current+1;
      repCountRef.current=newCount;
      setRepCount(newCount);
      const currentCals=Math.round(newCount*getCalPerRep(currentExercise));
      caloriesBurnedRef.current=currentCals;
      setCaloriesBurned(currentCals);
      checkAutoDifficulty(currentExercise,newCount,smoothed);
    }
  if (confidence < 0.3 || rawAngle <= 0 || rawAngle > 360) return;
  // ── AI feedback (throttled 700ms) ─────────────────────────────
  const now = Date.now();
  if (!feedbackThrottleRef.current || now - feedbackThrottleRef.current > 700) {
    feedbackThrottleRef.current = now;

    if (!calibStatus.active && calibStatus.repsObserved >= 3) {
      setCoachFeedback(
        `AI calibrated ✓ ROM: ${Math.round(calibStatus.learnedMin)}° → ${Math.round(calibStatus.learnedMax)}°`
      );
    }

    if (fatigueStatus.fatigued && fatigueStatus.romRatio != null) {
      const percent = Math.round(fatigueStatus.romRatio * 100);
      setCoachFeedback(
        `You're getting tired — maintain full range (${percent}% ROM)`
      );
      if (voiceCoach?.speak) {
        voiceCoach.speak('You are getting tired. Focus on full range of motion.');
      }
    }
  }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [checkAutoDifficulty, updateDailyProgress, voiceCoachOnAngle]);

  onResultsRef.current = onResults;
  const stopWorkout = useCallback(() => {

  // Stop workout loop
  isWorkingOutRef.current = false;

  // Update UI
  setIsWorkingOut(false);

  // Stop animation frame
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }

  // Stop camera
  if (cameraInstanceRef.current) {
    cameraInstanceRef.current.stop();
    cameraInstanceRef.current = null;
  }

  // Clear workout intervals
  try { if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); } } catch (e) {}
  timerIntervalRef.current = null;
  try { if (tipIntervalRef.current) { clearInterval(tipIntervalRef.current); } } catch (e) {}
  tipIntervalRef.current = null;

  console.log("Workout stopped");

}, []);

  // Cleanup on unmount — ensure all timers and streams are stopped
  useEffect(() => {
    return () => {
      try { stopWorkout(); } catch (e) {}
    };
  }, [stopWorkout]);

  const startWorkout = useCallback(async (exerciseParam) => {
    const exercise = exerciseParam || currentExerciseRef.current;
    const savedCalibration = localStorage.getItem(
  `calibration_${exercise.id}`
);

let calibrationData = null;

if (savedCalibration) {
  calibrationData = JSON.parse(savedCalibration);
}
    if (isWorkingOutRef.current) return;
    if (!exercise) return;

    // ── Reset all counters ────────────────────────────────
    setRepCount(0); repCountRef.current = 0; poseReadyRef.current = false;
    goodFormCountRef.current = 0; lastDiffSuggRef.current = 0;
    setTimer('Preparing...'); setCaloriesBurned(0); caloriesBurnedRef.current = 0;
    setCoachFeedback(''); setCurrentAngles({}); setCameraError('');
    setModelLoading(true); modelLoadingRef.current = true; setLoadingStep(1); loadingStepRef.current = 1;
    setLoadingTip(Math.floor(Math.random() * LOADING_TIPS.length));
    setCoachFeedback(exercise.form.map(f => `• ${f.rule}`).join('\n'));

    // ── Init forgiving detector for this exercise ─────────
    if (repDetectorRef.current) repDetectorRef.current.reset();
    repDetectorRef.current =
  createRepDetector(exercise, calibrationData);

    isWorkingOutRef.current = true;
    setIsWorkingOut(true);
    voiceCoachOnStart();

    tipIntervalRef.current = setInterval(() => setLoadingTip(prev => (prev+1) % LOADING_TIPS.length), 3000);

    try {
      setLoadingStep(2); loadingStepRef.current = 2;
// Load Pose Instance
await loadCameraUtils();

if (!poseInstanceRef.current) {
  poseInstanceRef.current = await getPoseInstance();

  poseInstanceRef.current.onResults((results) => {
    if (onResultsRef.current) {
      onResultsRef.current(results);
    }
  });

  console.log('Pose instance loaded!');
}
setLoadingStep(3);
loadingStepRef.current = 3;

await new Promise(resolve => setTimeout(resolve, 300));

const videoEl = videoRef.current;

  if (!videoEl) {
  setCameraError('Camera element not available.');
  isWorkingOutRef.current = false;
  setIsWorkingOut(false);
  setModelLoading(false);
  modelLoadingRef.current = false;
  setLoadingStep(0);
  try { clearInterval(tipIntervalRef.current); } catch (e) {}
  tipIntervalRef.current = null;
  return;
}

// ── Camera Setup ─────────────────────────────
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480, facingMode: 'user' },
    audio: false,
  });

  videoEl.srcObject = stream;

  await new Promise((resolve, reject) => {
    videoEl.onloadedmetadata = async () => {
      try {
        if (canvasRef.current) {
          canvasRef.current.width = videoEl.videoWidth || 640;
          canvasRef.current.height = videoEl.videoHeight || 480;
        }

        await videoEl.play();
        // remove handler to avoid retained references
        try { videoEl.onloadedmetadata = null; } catch (e) {}
        resolve();
      } catch (err) {
        try { videoEl.onloadedmetadata = null; } catch (e) {}
        reject(err);
      }
    };
  });

  cameraInstanceRef.current = {
    stop: () => {
      stream.getTracks().forEach(t => t.stop());
      videoEl.srcObject = null;
    }
  };

} catch (camErr) {
  setCameraError('Camera access denied. Please allow camera and try again.');

  isWorkingOutRef.current = false;
  setIsWorkingOut(false);

  setModelLoading(false);
  modelLoadingRef.current = false;

  setLoadingStep(0);

  try { clearInterval(tipIntervalRef.current); } catch (e) {}
  tipIntervalRef.current = null;

  return;
}

// ── Frame Processing ─────────────────────────
let lastFrameTime = 0;

async function processFrame(timestamp) {
  if (!isWorkingOutRef.current) return;

if (timestamp - lastFrameTime < 40) {
    animationFrameRef.current = requestAnimationFrame(processFrame);
    return;
  }

  lastFrameTime = timestamp;

  if (
    videoRef.current &&
    poseInstanceRef.current &&
    videoRef.current.readyState >= 2
  ) {
    try {
      await poseInstanceRef.current.send({
        image: videoRef.current
      });
    } catch (e) {
      console.error('Pose send error:', e);
      await new Promise(r => setTimeout(r, 50));
    }
  }

  if (isWorkingOutRef.current) {
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }
}

animationFrameRef.current =
  requestAnimationFrame(processFrame);

// ── Finish Loading ───────────────────────────
setModelLoading(false);
modelLoadingRef.current = false;

setLoadingStep(4);

setTimeout(() => setLoadingStep(0), 800);

  try { clearInterval(tipIntervalRef.current); } catch (e) {}
  tipIntervalRef.current = null;

} catch (err) {
  console.error('Workout start failed:', err);

  setCameraError(
    'Failed to start camera. Please allow camera access and try again.'
  );

  isWorkingOutRef.current = false;

  setIsWorkingOut(false);

  setModelLoading(false);

  modelLoadingRef.current = false;

  setLoadingStep(0);

  try { clearInterval(tipIntervalRef.current); } catch (e) {}
  tipIntervalRef.current = null;
}

}, [voiceCoachOnStart]);

  // ==================== DIET PLAN ====================
  const getDietPlan = async () => {
    setDietLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/diet-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: currentExercise?.name || 'exercise',
          difficulty: currentExercise?.difficulty || 'easy',
          repCount: repCount || 10,
          caloriesBurned: caloriesBurned || 100,
        }),
      });
      const data = await res.json();
      if (data.error) { setDietPlan('AI service error: ' + data.error); }
      else { setDietPlan(data.result || 'Could not generate diet plan. Please try again.'); }
    } catch { setDietPlan('Failed to generate diet plan. Check your internet connection and try again.'); }
    setDietLoading(false);
  };

  const analyzeDiet = async () => {
    if (!mealInput.trim()) return;
    setAnalyzeLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze-meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meals: mealInput }),
      });
      const data = await res.json();
      if (data.error) {
        setDietAnalysis({ calories:0, protein:0, carbs:0, fat:0, suggestionEn:'Could not analyze. Try again.', suggestionHi:'विश्लेषण नहीं हो पाया।', goalProtein:120, goalCalories:2200 });
      } else {
        setDietAnalysis({ ...data, goalProtein:120, goalCalories:2200 });
      }
    } catch {
      setDietAnalysis({ calories:0, protein:0, carbs:0, fat:0, suggestionEn:'Could not analyze. Check your connection.', suggestionHi:'विश्लेषण नहीं हो पाया।', goalProtein:120, goalCalories:2200 });
    }
    setAnalyzeLoading(false);
  };

  const handleExerciseClick = (exercise) => {
    if (exercise.premium && !isPremium) { setShowPaymentModal(true); return; }
    setCurrentExercise(exercise);
    currentExerciseRef.current = exercise;
    voiceCoach.reset();
    startWorkout(exercise);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'bg-green-400/15 text-green-400';
      case 'medium': return 'bg-yellow-400/15 text-yellow-400';
      case 'hard': return 'bg-red-400/15 text-red-400';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  const getCategoryIcon = (category, size=16, className) => {
    const Icon = categoryIcons[category] || HomeIcon;
    return <Icon size={size} className={className} />;
  };

  const getAngleDisplay = () => {
    if (!currentExercise) return '--';
    const val = currentAngles[currentExercise.track];
    return val != null && val > 0 && val <= 360 ? `${val}°` : '--';
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <ParticleBackground />
      <PrivacyPopup />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40"
        style={{ background:'rgba(10,10,30,0.97)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.06)', boxShadow:'0 2px 16px rgba(0,0,0,0.4)', paddingTop:'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-300/70/20 flex items-center justify-center"><Dumbbell size={18} className="text-sky-300" /></div>
            <h1 className="text-lg font-extrabold tracking-tight" style={{ background: 'linear-gradient(90deg, #4FD1FF, #ff9a76)', WebkitBackgroundClip: 'text', color:'transparent', fontFamily:'Syne, DM Sans, sans-serif' }}>FitCoach AI</h1>
            {isPremium && <span className="text-[9px] font-bold bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Crown size={8} /> PRO</span>}
          </div>
          <div className="flex items-center gap-2">
            {!isPremium && (
              <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-white cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(79,209,255,0.3)]" style={{ backgroundColor:'#2f86a5' }}>
                <Crown size={11} /> Pro
              </button>
            )}
            <button onClick={async () => {
              isWorkingOutRef.current = false;
              if (cameraInstanceRef.current) cameraInstanceRef.current.stop();
              try { await logout(); } catch(e) {}
              navigate('/login');
            }} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-white/60 hover:text-red-400 bg-white/5 border border-white/10 hover:border-red-500/30 cursor-pointer transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
            {user?.photoURL && <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-white/10" />}
          </div>
        </div>
        <div className="px-4 pb-2">
          <div className="flex items-center rounded-2xl p-1 w-full" style={{ background:'rgba(255,255,255,0.06)' }}>
            {[{key:'workout',label:'Workout',icon:Dumbbell},{key:'diet',label:'Diet',icon:Utensils}].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-300 ${activeTab===tab.key ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                style={activeTab===tab.key ? { background:'linear-gradient(135deg, #4FD1FF, #ff9a76)', boxShadow:'0 2px 12px rgba(79,209,255,0.35)' } : {}}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 overscroll-contain" style={{ paddingTop:'100px', paddingBottom:'4rem', WebkitOverflowScrolling:'touch' }}>

        {/* ==================== WORKOUT TAB ==================== */}
        {activeTab === 'workout' && (
          <div className="space-y-4 px-3 pt-3 pb-8">
            {!isWorkingOut ? (
              <>
                {/* Daily Target */}
                <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-300/70/20 flex items-center justify-center"><Trophy size={16} className="text-sky-300" /></div>
                      <div><h2 className="text-white font-bold text-sm leading-tight">Daily Target</h2><p className="text-gray-400 text-[10px]">Today's Progress</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-sky-300/70/10 rounded-lg px-2 py-1"><FlameKindling size={12} className="text-orange-400" /><span className="text-orange-300 text-[10px] font-bold">{streak.current}d</span></div>
                      <button onClick={() => { const reset={date:getTodayKey(),calories:0,workoutSeconds:0,reps:0,workoutsCompleted:0}; setDailyProgress(reset); saveDailyProgress(reset); saveToWeeklyHistory(reset); setWeeklyData(loadWeeklyProgress()); showToast('Daily progress reset!'); }} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center cursor-pointer transition-colors"><RotateCcw size={14} className="text-red-400" /></button>
                      <button onClick={() => { setEditCalTarget(String(dailyTargets.calories)); setEditMinTarget(String(dailyTargets.workoutMin)); setEditRepTarget(String(dailyTargets.reps)); setEditingTargets(!editingTargets); }} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"><Edit3 size={14} className="text-gray-400" /></button>
                    </div>
                  </div>
                  <div className="px-5 pb-4 flex items-center justify-around">
                    <div className="flex flex-col items-center">
                      <div className="relative"><ProgressRing progress={(dailyProgress.calories/dailyTargets.calories)*100} size={68} strokeWidth={5} color="#4FD1FF" bgColor="rgba(79,209,255,0.15)" /><div className="absolute inset-0 flex items-center justify-center"><Flame size={16} className="text-sky-300" /></div></div>
                      <div className="mt-1.5 text-center"><div className="text-white font-extrabold text-base leading-tight">{dailyProgress.calories}</div><div className="text-gray-500 text-[9px]">/ {dailyTargets.calories} kcal</div></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative"><ProgressRing progress={(Math.floor(dailyProgress.workoutSeconds/60)/dailyTargets.workoutMin)*100} size={68} strokeWidth={5} color="#22c55e" bgColor="rgba(34,197,94,0.15)" /><div className="absolute inset-0 flex items-center justify-center"><Timer size={16} className="text-green-400" /></div></div>
                      <div className="mt-1.5 text-center"><div className="text-white font-extrabold text-base leading-tight">{Math.floor(dailyProgress.workoutSeconds/60)}</div><div className="text-gray-500 text-[9px]">/ {dailyTargets.workoutMin} min</div></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative"><ProgressRing progress={(dailyProgress.reps/dailyTargets.reps)*100} size={68} strokeWidth={5} color="#4FD1FF" bgColor="rgba(79,209,255,0.15)" /><div className="absolute inset-0 flex items-center justify-center"><RotateCcw size={16} className="text-blue-400" /></div></div>
                      <div className="mt-1.5 text-center"><div className="text-white font-extrabold text-base leading-tight">{dailyProgress.reps}</div><div className="text-gray-500 text-[9px]">/ {dailyTargets.reps} reps</div></div>
                    </div>
                  </div>
                  <div className="mx-5 mb-4">
                    <div className="flex items-center gap-1.5 mb-2"><BarChart3 size={12} className="text-gray-500" /><span className="text-gray-400 text-[10px] font-semibold">This Week</span></div>
                    <div className="flex items-end gap-1.5 h-12">
                      {weeklyData.map((d, i) => {
                        const maxCal = Math.max(...weeklyData.map(w => w.calories), dailyTargets.calories);
                        const height = maxCal > 0 ? Math.max(4,(d.calories/maxCal)*48) : 4;
                        const isToday = i === weeklyData.length-1;
                        return (
                          <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full rounded-sm transition-all duration-500" style={{ height:`${height}px`, backgroundColor:isToday?'#4FD1FF':d.calories>0?'rgba(79,209,255,0.3)':'rgba(255,255,255,0.08)' }} />
                            <span className={`text-[8px] ${isToday?'text-sky-300 font-bold':'text-gray-500'}`}>{d.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {editingTargets && (
                    <div className="mx-5 mb-4 bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-2"><CalendarDays size={14} className="text-sky-300" /><span className="text-white text-sm font-bold">Set Your Targets</span></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><label className="text-gray-400 text-[10px] font-semibold mb-1 block">Calories</label><input type="number" value={editCalTarget} onChange={(e) => setEditCalTarget(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-white/10 text-white text-sm text-center outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /><span className="text-gray-500 text-[9px]">kcal</span></div>
                        <div><label className="text-gray-400 text-[10px] font-semibold mb-1 block">Workout</label><input type="number" value={editMinTarget} onChange={(e) => setEditMinTarget(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-white/10 text-white text-sm text-center outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /><span className="text-gray-500 text-[9px]">minutes</span></div>
                        <div><label className="text-gray-400 text-[10px] font-semibold mb-1 block">Reps</label><input type="number" value={editRepTarget} onChange={(e) => setEditRepTarget(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-white/10 text-white text-sm text-center outline-none border border-white/10 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" /><span className="text-gray-500 text-[9px]">reps</span></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingTargets(false)} className="flex-1 py-2 rounded-lg bg-white/10 text-gray-400 text-xs font-semibold cursor-pointer hover:bg-white/15 transition-colors">Cancel</button>
                        <button onClick={saveTargetEdits} className="flex-1 py-2 rounded-lg text-white text-xs font-bold cursor-pointer transition-all" style={{ backgroundColor:'#4FD1FF' }}>Save Targets</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category filters */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${selectedCategory===cat ? 'bg-sky-400/15 text-sky-200 border border-sky-300/30 shadow-[0_0_12px_rgba(79,209,255,0.25)]shadow-md' : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/10'}`}>
                      {React.createElement(categoryIcons[cat]||HomeIcon, { size:14 })} {cat}
                    </button>
                  ))}
                </div>

                {/* Difficulty filters */}
                <div className="flex gap-2 flex-wrap">
                  {['All','Easy','Medium','Hard'].map((d) => (
                    <button key={d} onClick={() => setDifficultyFilter(d)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${difficultyFilter===d ? 'bg-sky-300/70/80 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/15 border border-white/10'}`}>
                      {d}
                    </button>
                  ))}
                </div>

                {!isPremium && (
                  <div className="rounded-xl py-2.5 px-3 flex items-center gap-2" style={{ background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                    <Crown size={18} className="text-yellow-400 shrink-0" />
                    <p className="text-white text-xs font-semibold flex-1 min-w-0">Unlock 150+ Exercises & AI Coaching</p>
                    <button onClick={() => setShowPaymentModal(true)} className="px-3 py-1.5 rounded-lg text-white font-bold text-[10px] cursor-pointer transition-all whitespace-nowrap flex items-center gap-1 shrink-0" style={{ backgroundColor:'#2f86a5' }}><Sparkles size={10} /> Pro</button>
                  </div>
                )}

                {/* Exercise grid */}
                <div className="grid grid-cols-2 gap-3">
                  {filteredExercises.map((ex) => (
                    <button key={ex.id} onClick={() => handleExerciseClick(ex)}
                      className={`relative p-3 rounded-xl text-left cursor-pointer transition-all active:scale-[0.97] ${ex.premium&&!isPremium?'opacity-80':''} bg-white/5 border border-white/10 hover:border-[#4FD1FF]/50 hover:bg-white/10`}>
                      {ex.premium && !isPremium && <div className="absolute top-2 right-2 flex items-center gap-0.5"><Lock size={10} className="text-gray-400" /><span className="text-[10px] font-bold text-sky-300 bg-sky-300/70/10 px-1.5 py-0.5 rounded-full">PRO</span></div>}
                      {ex.premium && isPremium && <div className="absolute top-2 right-2 flex items-center gap-0.5"><Crown size={10} className="text-yellow-400" /><span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-full">PRO</span></div>}
                      <div className="mb-0.5 text-sky-300">{getCategoryIcon(ex.category, 18)}</div>
                      <div className="font-semibold text-xs text-white leading-tight pr-7">{ex.name}</div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${getDifficultyColor(ex.difficulty)}`}>{ex.difficulty.charAt(0).toUpperCase()+ex.difficulty.slice(1)}</span>
                        <span className="text-[9px] text-gray-500">~{Math.round(getCalPerRep(ex)*10)}k/10r</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Camera + skeleton */}
                <div className="relative rounded-xl overflow-hidden" style={{ background:'#1a1a2e' }}>
                  <div className="relative w-full" style={{ minHeight:'200px' }}>
                    <video ref={videoRef} className="w-full h-auto rounded-xl" style={{ transform:'scaleX(-1)', maxHeight:'40vh', objectFit:'cover' }} autoPlay playsInline muted />
                     <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" style={{ transform: 'scaleX(-1)', pointerEvents: 'none' }} />
                    {(modelLoading || loadingStep === 4) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]/90 backdrop-blur-md z-10">
                        <div className="text-center px-4 max-w-xs">
                          <div className="relative mx-auto w-20 h-20 mb-5">
                            <div className="absolute inset-0 rounded-full bg-sky-300/70/20 animate-ping" style={{ animationDuration:'2s' }} />
                            <div className="absolute inset-2 rounded-full bg-sky-300/70/30 animate-pulse" />
                            <div className="absolute inset-3 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                              {loadingStep===4 ? <CheckCircle2 size={28} className="text-green-400 animate-bounce" /> : <Brain size={28} className="text-sky-300" />}
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-white font-bold text-base mb-1">{loadingStep===4?'Ready!':LOADING_STEPS[Math.min(loadingStep,3)-1]?.label||'Initializing...'}</p>
                            <p className="text-gray-400 text-xs">{loadingStep===4?'AI coach is watching your form':'Setting up your AI workout coach'}</p>
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-5">
                            {LOADING_STEPS.map((step, i) => (
                              <div key={step.key} className="flex items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${loadingStep>i+1||loadingStep===4?'bg-green-500/20 text-green-400':loadingStep===i+1?'bg-sky-300/70/20 text-sky-300 scale-110':'bg-white/5 text-gray-500'}`}>
                                  {loadingStep>i+1||loadingStep===4?<CheckCircle2 size={14}/>:loadingStep===i+1?<Loader2 size={14} className="animate-spin"/>:<step.icon size={12}/>}
                                </div>
                                {i < LOADING_STEPS.length-1 && <div className={`w-4 h-0.5 mx-1 rounded-full transition-all duration-500 ${loadingStep>i+1?'bg-green-500/50':'bg-white/10'}`} />}
                              </div>
                            ))}
                          </div>
                          {loadingStep < 4 && (
                            <div className="bg-white/5 rounded-xl px-4 py-2.5 flex items-center gap-2" key={loadingTip}>
                              {React.createElement(LOADING_TIPS[loadingTip]?.icon||Flame, { size:14, className:'text-sky-300 shrink-0' })}
                              <span className="text-gray-300 text-xs text-left">{LOADING_TIPS[loadingTip]?.text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]">
                        <div className="text-center p-6"><Activity size={40} className="text-gray-500 mx-auto mb-3" /><p className="text-white font-semibold mb-1">Camera Error</p><p className="text-gray-400 text-sm">{cameraError}</p></div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1 min-w-0">
                      <span className="text-sky-300 shrink-0">{getCategoryIcon(currentExercise?.category||'Home', 12)}</span>
                      <span className="text-white font-bold text-xs truncate">{currentExercise?.name}</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${getDifficultyColor(currentExercise?.difficulty||'easy')}`}>{currentExercise?.difficulty?.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><RotateCcw size={9} /> Reps</div>
                    <div className="text-2xl font-extrabold text-sky-300">{repCount}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><Timer size={9} /> Time</div>
                    <div className="text-xl font-extrabold text-white">{timer}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><Flame size={9} /> Calories</div>
                    <div className="text-2xl font-extrabold text-green-400">{caloriesBurned}</div>
                    <div className="text-[9px] text-gray-500">{repCount>0?`~${(caloriesBurned/repCount).toFixed(1)} kcal/rep`:''}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><Activity size={9} /> Angle</div>
                    <div className="text-2xl font-extrabold text-white">{getAngleDisplay()}</div>
                    <div className="text-[9px] text-green-400">
  {calibrationRef.current.calibrated
    ? 'AI Personalized'
    : `Learning... ${calibrationRef.current.repsObserved}/3`}
</div>
                    <div className="text-[9px] text-gray-500">{currentExercise?.track||''}</div>
                  </div>
                </div>

                {/* AI Coach Feedback */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bot size={16} className="text-sky-300" />
                    <h3 className="font-bold text-xs text-white">AI Coach</h3>
                    {isPremium && <span className="text-[9px] font-bold text-sky-300 bg-sky-300/70/10 px-1.5 py-0.5 rounded-full">LIVE</span>}
                  </div>
                  <p className="text-xs text-gray-300 whitespace-pre-line">{coachFeedback || 'Start moving to get feedback...'}</p>
                  {!isPremium && <button onClick={() => setShowPaymentModal(true)} className="mt-1.5 text-[10px] text-sky-300 font-semibold hover:underline cursor-pointer flex items-center gap-0.5">Unlock AI Coaching <ChevronRight size={10} /></button>}
                </div>

                {/* Voice Coach Toggle */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${voiceCoach.isEnabled ? 'bg-sky-300/70/10' : 'bg-white/10'}`}>
                        {voiceCoach.isEnabled ? <Volume2 size={16} className="text-sky-300" /> : <VolumeX size={16} className="text-gray-400" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white">Voice Coach</span>
                          {!isPremium && <span className="flex items-center gap-0.5 text-[9px] font-bold text-sky-300 bg-sky-300/70/10 px-1 py-0.5 rounded-full"><Lock size={7} /> PRO</span>}
                        </div>
                        <span className="text-[10px] text-gray-500">{voiceCoach.isEnabled ? 'Active - range-based cues' : 'Tap to enable'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { if (!isPremium) { setShowPaymentModal(true); return; } voiceCoach.toggle(); }}
                      className={`relative w-11 h-6 rounded-full cursor-pointer transition-all`}
                      style={{ backgroundColor: voiceCoach.isEnabled ? '#4FD1FF' : '#374151' }}>
                      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                        style={{ left: voiceCoach.isEnabled ? '1.2rem' : '0.125rem' }} />
                    </button>
                  </div>
                  {voiceCoach.isEnabled && (
                    <div className="mt-2 flex items-center gap-1.5 bg-green-400/10 rounded-lg p-1.5">
                      <Mic size={10} className="text-green-400" />
                      <span className="text-[10px] text-green-400 font-medium">Voice active - precise angle-range cues enabled</span>
                    </div>
                  )}
                  {!isPremium && (
                    <div className="mt-2 flex items-center gap-1.5 bg-yellow-400/5 rounded-lg p-1.5">
                      <Crown size={10} className="text-yellow-400" />
                      <span className="text-[10px] text-yellow-400/80">Upgrade to Pro for AI voice coaching</span>
                    </div>
                  )}
                </div>
                <button
  onClick={stopWorkout}
  className="w-full py-3.5 rounded-2xl text-red-100 font-medium text-sm cursor-pointer transition-all border border-red-300/20 bg-red-500/10 hover:bg-red-500/15 hover:shadow-[0_0_18px_rgba(255,80,80,0.28)] backdrop-blur-md flex items-center justify-center gap-2"
>
  <Square size={16} />
  Stop Workout
</button>
              </>
            )}
          </div>
        )}

        {/* ==================== DIET TAB ==================== */}
        {activeTab === 'diet' && (
          <div className="space-y-4 px-3 pt-3 pb-8">
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="px-5 pt-5 pb-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-300/70/20 flex items-center justify-center"><Utensils size={16} className="text-sky-300" /></div>
                <h2 className="text-sm font-bold text-white">Diet Plan Generator</h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 px-5">Get a personalized diet plan based on your workout session.</p>
              {currentExercise && (
                <div className="flex items-center gap-2 mb-4 mx-5 bg-white/5 rounded-xl p-3">
                  <span className="text-sky-300">{getCategoryIcon(currentExercise.category, 16)}</span>
                  <span className="text-sm font-medium text-gray-300">{currentExercise.name}</span>
                  <span className="text-xs text-gray-500">- {repCount} reps - {caloriesBurned} kcal burned</span>
                </div>
              )}
              <div className="px-5 pb-5">
                <button onClick={getDietPlan} disabled={dietLoading} className="w-full py-3 rounded-xl text-white font-bold text-base cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ backgroundColor:'#217999' }}>
                  {dietLoading ? <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating Plan...</> : <><Utensils size={16} /> Get Diet Plan</>}
                </button>
              </div>
              {dietPlan && (
                <div className="mx-5 mb-5 bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white mb-2">Your Diet Plan</h3>
                  <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{dietPlan}</div>
                </div>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="flex items-center gap-2 mb-3 px-5 pt-5">
                <div className="w-8 h-8 rounded-lg bg-sky-300/70/20 flex items-center justify-center"><Microscope size={16} className="text-sky-300" /></div>
                <h2 className="text-sm font-bold text-white">Analyze Your Diet</h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 px-5">Enter your meals to get a detailed nutritional breakdown.</p>
              <div className="px-5">
                <textarea value={mealInput} onChange={(e) => setMealInput(e.target.value)} placeholder="e.g., 2 roti, dal, rice, curd, 1 banana..."
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-gray-500 outline-none resize-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10 transition-colors" rows={3} />
              </div>
              <div className="px-5 pb-5">
                <button onClick={analyzeDiet} disabled={analyzeLoading||!mealInput.trim()} className="w-full mt-3 py-3 rounded-xl text-white font-bold text-base cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ backgroundColor:'#217999' }}>
                  {analyzeLoading ? <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Analyzing...</> : <><Microscope size={16} /> Analyze Diet</>}
                </button>
              </div>
              {dietAnalysis && (
                <div className="mt-4 space-y-4 px-5 pb-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-400/10 rounded-lg p-2.5 text-center"><div className="text-[10px] text-orange-400 mb-0.5">Calories</div><div className="text-base font-extrabold text-orange-300">{dietAnalysis.calories}</div><div className="text-[9px] text-orange-400/70">kcal</div></div>
                    <div className="bg-green-400/10 rounded-lg p-2.5 text-center"><div className="text-[10px] text-green-400 mb-0.5">Protein</div><div className="text-base font-extrabold text-green-300">{dietAnalysis.protein}g</div></div>
                    <div className="bg-blue-400/10 rounded-lg p-2.5 text-center"><div className="text-[10px] text-blue-400 mb-0.5">Carbs</div><div className="text-base font-extrabold text-blue-300">{dietAnalysis.carbs}g</div></div>
                    <div className="bg-yellow-400/10 rounded-lg p-2.5 text-center"><div className="text-[10px] text-yellow-400 mb-0.5">Fat</div><div className="text-base font-extrabold text-yellow-300">{dietAnalysis.fat}g</div></div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-300">Protein Goal</span><span className="text-gray-500">{dietAnalysis.protein}g / {dietAnalysis.goalProtein}g</span></div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width:`${Math.min(100,(dietAnalysis.protein/dietAnalysis.goalProtein)*100)}%`, backgroundColor:dietAnalysis.protein>=dietAnalysis.goalProtein?'#22c55e':'#4FD1FF' }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-300">Calorie Goal</span><span className="text-gray-500">{dietAnalysis.calories} / {dietAnalysis.goalCalories} kcal</span></div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width:`${Math.min(100,(dietAnalysis.calories/dietAnalysis.goalCalories)*100)}%`, backgroundColor:dietAnalysis.calories>=dietAnalysis.goalCalories?'#22c55e':'#4FD1FF' }} /></div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
                    <p className="text-xs text-gray-300 flex items-start gap-1"><Sparkles size={12} className="text-sky-300 mt-0.5 shrink-0" />{dietAnalysis.suggestionEn}</p>
                    <p className="text-xs text-gray-500 flex items-start gap-1"><ChevronRight size={12} className="text-gray-400 mt-0.5 shrink-0" />{dietAnalysis.suggestionHi}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}
        onUpgrade={() => { setIsPremium(true); showToast('Welcome to FitCoach Pro! All exercises unlocked.'); }} />

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 z-50 animate-bounce" style={{ bottom:'2rem' }}>
          <div className="px-4 py-2.5 rounded-xl text-white font-semibold text-xs shadow-xl flex items-center gap-1.5" style={{ backgroundColor:'#4FD1FF' }}>
            <Sparkles size={12} /> {toast}
          </div>
        </div>
      )}
    </div>
  );
}