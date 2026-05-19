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
  Play,
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
  Mail,
  Phone,
  Calendar,
  Target,
  CreditCard,
  QrCode,
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
  TrendingUp,
  CalendarDays,
  FlameKindling,
  Edit3,
  BarChart3,
  Award,
} from 'lucide-react';
import exercises, { categories } from './data/execrises.js';
import ParticleBackground from './components.jsx';

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

// ==================== VOICE COACHING SYSTEM ====================
const VOICE_CUES = {
  start: [
    "Let's go! Start your exercise!",
    "Ready? Begin!",
    "Let's crush this workout!",
    "3, 2, 1, go!",
  ],
  repMilestones: {
    3: ["Great start! Keep it up!", "3 reps, you're warming up!"],
    5: ["5 reps! Nice work!", "Halfway to 10, keep pushing!"],
    10: ["10 reps! You're on fire!", "Double digits! Outstanding!"],
    15: ["15 reps! Beast mode!", "Incredible stamina!"],
    20: ["20 reps! You're unstoppable!", "Legend status! 20 reps!"],
    25: ["25 reps! Superhuman!", "You're a machine!"],
    30: ["30 reps! Absolutely insane!", "Unbelievable! 30 reps!"],
  },
  encouragement: [
    "Keep going, you got this!",
    "Stay strong!",
    "Push through it!",
    "Don't give up!",
    "You're stronger than you think!",
    "Focus on your form!",
    "Breathe in, breathe out!",
    "Almost there, keep pushing!",
  ],
  formTips: {
    knee: "Watch your knees! Keep proper alignment.",
    hip: "Focus on your hip position.",
    elbow: "Control your elbow movement.",
    shoulder: "Keep your shoulders steady.",
    spine: "Maintain a straight back!",
    ankle: "Watch your ankle position.",
  },
  restReminder: [
    "Take a breath. You're doing great!",
    "Slow down if you need to. Form matters!",
    "Remember to breathe!",
  ],
  workoutComplete: [
    "Workout complete! Amazing effort!",
    "Great session! You should be proud!",
    "That's a wrap! Well done!",
  ],
};

// ==================== CATEGORY ICONS MAP ====================
const categoryIcons = {
  Home: HomeIcon,
  Gym: Dumbbell,
  Yoga: Flower2,
  Cardio: Bike,
  Stretch: StretchHorizontal,
  Strength: Zap,
};

// ==================== DAILY TARGET SYSTEM ====================
const DAILY_TARGET_KEY = 'fitcoach-daily-targets';
const DAILY_PROGRESS_KEY = 'fitcoach-daily-progress';
const STREAK_KEY = 'fitcoach-streak';

const DEFAULT_TARGETS = { calories: 300, workoutMin: 30, reps: 50 };

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function loadDailyTargets() {
  if (typeof window === 'undefined') return DEFAULT_TARGETS;
  try {
    const raw = localStorage.getItem(DAILY_TARGET_KEY);
    return raw ? { ...DEFAULT_TARGETS, ...JSON.parse(raw) } : DEFAULT_TARGETS;
  } catch {
    return DEFAULT_TARGETS;
  }
}

function saveDailyTargets(targets) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(DAILY_TARGET_KEY, JSON.stringify(targets)); } catch {}
}

function loadDailyProgress() {
  const today = getTodayKey();
  const def = { date: today, calories: 0, workoutSeconds: 0, reps: 0, workoutsCompleted: 0 };
  if (typeof window === 'undefined') return def;
  try {
    const raw = localStorage.getItem(DAILY_PROGRESS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) return data;
    }
    return def;
  } catch { return def; }
}

function saveDailyProgress(progress) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(progress)); } catch {}
}

function loadStreak() {
  if (typeof window === 'undefined') return { current: 0, best: 0, lastActiveDate: '' };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  const newCurrent = streak.lastActiveDate === yesterdayKey ? streak.current + 1 : 1;
  const newStreak = { current: newCurrent, best: Math.max(newCurrent, streak.best), lastActiveDate: today };
  saveStreak(newStreak);
  return newStreak;
}

function loadWeeklyProgress() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
    if (i === 0) {
      const progress = loadDailyProgress();
      result.push({ day: dayName, calories: progress.calories });
    } else {
      try {
        const raw = localStorage.getItem(`fitcoach-weekly-${key}`);
        if (raw) {
          const data = JSON.parse(raw);
          result.push({ day: dayName, calories: data.calories || 0 });
        } else {
          result.push({ day: dayName, calories: 0 });
        }
      } catch { result.push({ day: dayName, calories: 0 }); }
    }
  }
  return result;
}

function saveToWeeklyHistory(progress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fitcoach-weekly-${progress.date}`, JSON.stringify({ calories: progress.calories, reps: progress.reps, workoutSeconds: progress.workoutSeconds }));
  } catch {}
}

// Circular Progress Ring Component
function ProgressRing({ progress, size, strokeWidth, color, bgColor }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
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

function isLandmarkVisible(lm, threshold = 0.55) {
  return (lm.visibility ?? 0) >= threshold;
}

function calculateSingleSideAngle(landmarks, trackJoint, side) {
  const s = side === 'left' ? 0 : 1;
  const shoulder = landmarks[11 + s];
  const elbow = landmarks[13 + s];
  const wrist = landmarks[15 + s];
  const hip = landmarks[23 + s];
  const knee = landmarks[25 + s];
  const ankle = landmarks[27 + s];
  const foot = landmarks[31 + s];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  switch (trackJoint) {
    case 'knee': {
      if (!isLandmarkVisible(hip) || !isLandmarkVisible(knee) || !isLandmarkVisible(ankle)) return { angle: 180, valid: false };
      return { angle: getAngle3(hip, knee, ankle), valid: true };
    }
    case 'hip': {
      if (!isLandmarkVisible(shoulder) || !isLandmarkVisible(hip) || !isLandmarkVisible(knee)) return { angle: 180, valid: false };
      return { angle: getAngle3(shoulder, hip, knee), valid: true };
    }
    case 'elbow': {
      if (!isLandmarkVisible(shoulder) || !isLandmarkVisible(elbow) || !isLandmarkVisible(wrist)) return { angle: 180, valid: false };
      return { angle: getAngle3(shoulder, elbow, wrist), valid: true };
    }
    case 'shoulder': {
      if (!isLandmarkVisible(hip) || !isLandmarkVisible(shoulder) || !isLandmarkVisible(elbow)) return { angle: 180, valid: false };
      return { angle: getAngle3(hip, shoulder, elbow), valid: true };
    }
    case 'ankle': {
      if (!isLandmarkVisible(knee) || !isLandmarkVisible(ankle) || !isLandmarkVisible(foot)) return { angle: 180, valid: false };
      return { angle: getAngle3(knee, ankle, foot), valid: true };
    }
    case 'spine': {
      const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };
      const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
      if (!isLandmarkVisible(leftShoulder) || !isLandmarkVisible(rightShoulder) || !isLandmarkVisible(leftHip) || !isLandmarkVisible(rightHip)) return { angle: 180, valid: false };
      const dx = midHip.x - midShoulder.x;
      const dy = midHip.y - midShoulder.y;
      const angle = Math.abs(Math.atan2(dx, dy) * (180 / Math.PI));
      return { angle: 180 - angle, valid: true };
    }
    default:
      return { angle: 180, valid: false };
  }
}

function calculateAngle(landmarks, trackJoint) {
  if (trackJoint === 'spine') {
    const result = calculateSingleSideAngle(landmarks, trackJoint, 'left');
    return { angle: result.angle, confidence: result.valid ? 1.0 : 0.0 };
  }
  const leftResult = calculateSingleSideAngle(landmarks, trackJoint, 'left');
  const rightResult = calculateSingleSideAngle(landmarks, trackJoint, 'right');
  if (leftResult.valid && rightResult.valid) {
    const leftVis = landmarks[11]?.visibility ?? 0.5;
    const rightVis = landmarks[12]?.visibility ?? 0.5;
    const totalVis = leftVis + rightVis;
    const leftWeight = totalVis > 0 ? leftVis / totalVis : 0.5;
    const rightWeight = totalVis > 0 ? rightVis / totalVis : 0.5;
    return { angle: leftResult.angle * leftWeight + rightResult.angle * rightWeight, confidence: 1.0 };
  } else if (leftResult.valid) {
    return { angle: leftResult.angle, confidence: 0.7 };
  } else if (rightResult.valid) {
    return { angle: rightResult.angle, confidence: 0.7 };
  }
  return { angle: 180, confidence: 0 };
}

// ==================== OPENROUTER API (Direct browser calls) ====================
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY || '';
console.log('🔑 API Key loaded:', OPENROUTER_API_KEY ? 'YES ✅' : 'NO ❌');
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL = 'google/gemma-3-27b-it:free';

// ==================== PAYMENT MODAL (Multi-Step) ====================

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
  const priceLabel = isYearly ? '\u20b9999/yr' : '\u20b999/mo';
  const finalPriceLabel = couponApplied ? `\u20b9${finalPrice}/${isYearly ? 'yr' : 'mo'}` : priceLabel;

  const validateInfo = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) return 'Valid 10-digit mobile number required';
    return '';
  };

  const validatePayment = () => {
    if (!upiId.trim() || !/^[\w.-]+@[\w]+$/.test(upiId)) return 'Valid UPI ID required (e.g. name@upi)';
    return '';
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (coupon.toLowerCase() === 'fitcoach50') {
      setCouponApplied(true);
      setCouponError('');
    } else if (coupon.trim()) {
      setCouponApplied(false);
      setCouponError('Invalid coupon code');
    }
  };

  const handleNext = () => {
    if (step === 1) { setStep(2); }
    else if (step === 2) {
      const err = validateInfo();
      if (err) { setApiError(err); return; }
      setApiError(''); setStep(3);
    }
  };

  const handleBack = () => {
    setApiError('');
    if (step > 1) setStep(step - 1);
  };

  const handlePayment = async () => {
    const err = validatePayment();
    if (err) { setApiError(err); return; }
    setApiError(''); setProcessing(true);
    // Simulate payment processing (replace with real gateway)
    setTimeout(() => {
      setProcessing(false); setStep(4);
      onUpgrade();
    }, 2000);
  };

  const handleClose = () => {
    if (step === 4) {
      setStep(1); setFullName(''); setEmail(''); setPhone('');
      setAge(''); setGender(''); setFitnessGoal('');
      setUpiId(''); setSelectedUpiApp(''); setCoupon('');
      setCouponApplied(false); setCouponError('');
      setApiError(''); setProcessing(false);
    }
    onClose();
  };

  const steps = [
    { num: 1, label: 'Plan' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Payment' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto mx-4"
  style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', scrollbarWidth: 'thin' }}>
        <button onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-lg cursor-pointer">
          ✕
        </button>
        {step < 4 && (
          <div className="px-8 pt-6 pb-2">
            <div className="flex items-center justify-between mb-1">
              {steps.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s.num ? 'bg-[#ff4d00] text-white' : 'bg-white/10 text-gray-500'}`}>
                      {step > s.num ? <CheckCircle2 size={14} /> : s.num}
                    </div>
                    <span className={`text-xs font-semibold ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${step > s.num ? 'bg-[#ff4d00]' : 'bg-white/10'}`} />
                  )}
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
                {[
                  { icon: Dumbbell, text: '150+ Exercises' },
                  { icon: Bot, text: 'AI Form Coaching' },
                  { icon: Volume2, text: 'AI Voice Coach' },
                  { icon: Utensils, text: 'Custom Diet Plans' },
                  { icon: Sparkles, text: 'No Ads' },
                ].map((f) => (
                  <div key={f.text} className="bg-white/5 rounded-xl p-2.5 flex items-center gap-2">
                    <f.icon size={16} className="text-[#ff4d00]" />
                    <span className="text-white text-xs font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className={`text-sm font-semibold ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                <button onClick={() => setIsYearly(!isYearly)}
                  className="relative w-12 h-6 rounded-full cursor-pointer transition-colors"
                  style={{ backgroundColor: isYearly ? '#5d7886' : '#374151' }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{ left: isYearly ? '1.6rem' : '0.125rem' }} />
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
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" />
                <button className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 cursor-pointer transition-colors"
                  onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponError && <p className="text-red-400 text-xs mb-3 -mt-3">{couponError}</p>}
              <button onClick={handleNext}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(255,77,0,0.4)] flex items-center justify-center gap-2"
                style={{ backgroundColor: 'rgb(109, 123, 131)' }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#ff4d00]/20 flex items-center justify-center">
                  <User size={16} className="text-[#ff4d00]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Your Details</h3>
                  <p className="text-gray-400 text-xs">Required for subscription activation</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-300 text-xs font-semibold mb-1 block">Full Name <span className="text-[#ff4d00]">*</span></label>
                  <input type="text" placeholder="Enter your full name" value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold mb-1 block">Email <span className="text-[#ff4d00]">*</span></label>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold mb-1 block">Phone Number <span className="text-[#ff4d00]">*</span></label>
                  <input type="tel" placeholder="9876543210" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-300 text-xs font-semibold mb-1 block">Age</label>
                    <input type="number" placeholder="25" value={age}
                      onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-semibold mb-1 block">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors appearance-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}>
                      <option value="" className="bg-[#1a1a2e]">Select</option>
                      <option value="male" className="bg-[#1a1a2e]">Male</option>
                      <option value="female" className="bg-[#1a1a2e]">Female</option>
                      <option value="other" className="bg-[#1a1a2e]">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold mb-1 block">Fitness Goal</label>
                  <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors appearance-none cursor-pointer"
                    style={{ colorScheme: 'dark' }}>
                    <option value="" className="bg-[#1a1a2e]">Select your goal</option>
                    <option value="weight-loss" className="bg-[#1a1a2e]">Weight Loss</option>
                    <option value="muscle-gain" className="bg-[#1a1a2e]">Muscle Gain</option>
                    <option value="flexibility" className="bg-[#1a1a2e]">Flexibility</option>
                    <option value="general" className="bg-[#1a1a2e]">General Fitness</option>
                  </select>
                </div>
              </div>
              {apiError && <p className="text-red-400 text-xs mt-3">{apiError}</p>}
              <div className="flex gap-3 mt-5">
                <button onClick={handleBack}
                  className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm cursor-pointer hover:bg-white/20 transition-colors flex items-center gap-1">
                  <ArrowLeft size={14} /> Back
                </button>
                <button onClick={handleNext}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(255,77,0,0.4)] flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#786f6a' }}>
                  Continue to Payment <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#ff4d00]/20 flex items-center justify-center">
                  <CreditCard size={16} className="text-[#ff4d00]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">UPI Payment</h3>
                  <p className="text-gray-400 text-xs">Pay securely with UPI</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h4 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">FitCoach Pro ({isYearly ? 'Yearly' : 'Monthly'})</span>
                    <span className="text-white font-semibold">{priceLabel}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between">
                      <span className="text-green-400">Coupon (FITCOACH50)</span>
                      <span className="text-green-400 font-semibold">-\u20b9{basePrice - finalPrice}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-[#ff4d00] font-extrabold text-lg">\u20b9{finalPrice}</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-gray-300 text-xs font-semibold mb-2 block">Choose UPI App</label>
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) => (
                    <button key={app.id}
                      onClick={() => { setSelectedUpiApp(app.id); if (!upiId) setUpiId(`yourname@${app.id}`); }}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-pointer transition-all border ${selectedUpiApp === app.id ? 'border-[#ff4d00] bg-[#ff4d00]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <Smartphone size={18} style={{ color: app.color }} />
                      <span className="text-white text-[10px] font-medium">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="text-gray-300 text-xs font-semibold mb-1 block">UPI ID <span className="text-[#ff4d00]">*</span></label>
                <input type="text" placeholder="yourname@upi" value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-500 text-sm outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" />
              </div>
              <div className="flex items-center gap-2 mb-4 bg-green-400/5 rounded-xl p-3">
                <Shield size={14} className="text-green-400 shrink-0" />
                <p className="text-green-400/80 text-[10px] leading-relaxed">Your payment is secured with bank-grade encryption. We never store your UPI PIN.</p>
              </div>
              {apiError && <p className="text-red-400 text-xs mb-3">{apiError}</p>}
              <div className="flex gap-3">
                <button onClick={handleBack}
                  className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm cursor-pointer hover:bg-white/20 transition-colors flex items-center gap-1">
                  <ArrowLeft size={14} /> Back
                </button>
                <button onClick={handlePayment} disabled={processing}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(255,77,0,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#ff4d00' }}>
                  {processing ? (
                    <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (`Pay \u20b9${finalPrice} via UPI`)}
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center">
                  <CheckCircle2 size={40} className="text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Pro!</h2>
              <p className="text-gray-400 text-sm mb-5">Your subscription is now active. Enjoy unlimited access!</p>
              <div className="bg-white/5 rounded-xl p-4 mb-5 text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Plan</span><span className="text-white font-semibold">{isYearly ? 'Yearly' : 'Monthly'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Amount Paid</span><span className="text-[#ff4d00] font-bold">\u20b9{finalPrice}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Name</span><span className="text-white font-semibold">{fullName}</span></div>
              </div>
              <button onClick={handleClose}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(255,77,0,0.4)]"
                style={{ backgroundColor: '#1881c3' }}>Start Training</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN DASHBOARD COMPONENT ====================
export default function Dashboard() {
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
  const [voiceEnabled, setVoiceEnabled] = useState(false);
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

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseReadyRef = useRef(false);
  const workoutStartRef = useRef(0);
  const isDownRef = useRef(false);
  const repCountRef = useRef(0);
  const timerIntervalRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const poseInstanceRef = useRef(null);
  const goodFormCountRef = useRef(0);
  const lastDifficultySuggestionRef = useRef(0);
  const modelLoadingRef = useRef(false);
  const loadingStepRef = useRef(0);
  const onResultsRef = useRef(null);
  const smoothedAngleRef = useRef(null);
  const downFrameCountRef = useRef(0);
  const upFrameCountRef = useRef(0);
  const lastRepTimeRef = useRef(0);
  const cycleMinAngleRef = useRef(180);
  const cycleMaxAngleRef = useRef(0);
  const lastVoiceTimeRef = useRef(0);
  const lastEncouragementRepRef = useRef(0);

  const filteredExercises = exercises.filter((ex) => {
    const catMatch = ex.category === selectedCategory;
    const diffMatch = difficultyFilter === 'All' || ex.difficulty === difficultyFilter.toLowerCase();
    return catMatch && diffMatch;
  });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }, []);

  useEffect(() => {
    const targets = loadDailyTargets();
    const progress = loadDailyProgress();
    const streakData = loadStreak();
    const weekly = loadWeeklyProgress();
    setDailyTargets(targets);
    setDailyProgress(progress);
    setStreak(streakData);
    setWeeklyData(weekly);
    setEditCalTarget(String(targets.calories));
    setEditMinTarget(String(targets.workoutMin));
    setEditRepTarget(String(targets.reps));
  }, []);

  const saveTargetEdits = useCallback(() => {
    const newTargets = {
      calories: parseInt(editCalTarget) || 300,
      workoutMin: parseInt(editMinTarget) || 30,
      reps: parseInt(editRepTarget) || 50,
    };
    setDailyTargets(newTargets);
    saveDailyTargets(newTargets);
    setEditingTargets(false);
    showToast('Daily targets updated!');
  }, [editCalTarget, editMinTarget, editRepTarget, showToast]);

  const updateDailyProgress = useCallback((calories, workoutSeconds, reps, incrementWorkout = false) => {
    setDailyProgress(prev => {
      const updated = {
        date: getTodayKey(),
        calories: Math.max(prev.calories, calories),
        workoutSeconds: Math.max(prev.workoutSeconds, workoutSeconds),
        reps: Math.max(prev.reps, reps),
        workoutsCompleted: prev.workoutsCompleted + (incrementWorkout ? 1 : 0),
      };
      saveDailyProgress(updated);
      saveToWeeklyHistory(updated);
      return updated;
    });
    setStreak(prev => {
      const updated = updateStreakOnActivity();
      return updated.lastActiveDate === prev.lastActiveDate ? prev : updated;
    });
    setWeeklyData(loadWeeklyProgress());
  }, []);

  // ==================== AI VOICE COACHING ====================
  const speak = useCallback((text, priority = 'low') => {
    if (!voiceEnabled || !isPremium) return;
    const now = Date.now();
    const minInterval = priority === 'high' ? 1000 : 3000;
    if (now - lastVoiceTimeRef.current < minInterval) return;
    lastVoiceTimeRef.current = now;
    try {
      if (priority === 'high' && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      if (priority === 'low' && window.speechSynthesis.speaking) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1; utterance.pitch = 1.0; utterance.volume = 0.9; utterance.lang = 'en-US';
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }, [voiceEnabled, isPremium]);

  const voiceRepMilestone = useCallback((repCount, trackJoint) => {
    if (!voiceEnabled || !isPremium) return;
    const milestone = VOICE_CUES.repMilestones[repCount];
    if (milestone) { speak(milestone[Math.floor(Math.random() * milestone.length)], 'high'); return; }
    if (repCount > 1 && repCount % 7 === 0 && repCount !== lastEncouragementRepRef.current) {
      lastEncouragementRepRef.current = repCount;
      speak(VOICE_CUES.encouragement[Math.floor(Math.random() * VOICE_CUES.encouragement.length)], 'low');
    }
    if (repCount > 0 && repCount % 12 === 0) {
      const tip = VOICE_CUES.formTips[trackJoint];
      if (tip) speak(tip, 'low');
    }
  }, [voiceEnabled, isPremium, speak]);

  const toggleVoice = useCallback(() => {
    if (!isPremium) { setShowPaymentModal(true); return; }
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (newState) { window.speechSynthesis.getVoices(); showToast('AI Voice Coach activated!'); }
    else { window.speechSynthesis.cancel(); showToast('AI Voice Coach muted'); }
  }, [isPremium, voiceEnabled, showToast]);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const checkAutoDifficulty = useCallback((exercise, currentRepCount, angle) => {
    if (!exercise) return;
    const idealAngle = exercise.form[0]?.ideal || 90;
    const tolerance = 20;
    if (Math.abs(angle - idealAngle) < tolerance) goodFormCountRef.current++;
    if (currentRepCount > 0 && currentRepCount % 5 === 0 && currentRepCount !== lastDifficultySuggestionRef.current) {
      lastDifficultySuggestionRef.current = currentRepCount;
      if (goodFormCountRef.current >= 10 && exercise.difficulty !== 'hard') {
        const nextDifficulty = exercise.difficulty === 'easy' ? 'medium' : 'hard';
        showToast(`Great form! Consider trying ${nextDifficulty} difficulty`);
      }
    }
  }, [showToast]);

  // MediaPipe onResults callback
  const onResults = useCallback((results) => {
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
        if (currentExercise) {
          const elapsedMin = elapsed / 60000;
          const timeCalories = currentExercise.caloriesPerMin * elapsedMin * 0.5;
const repBonus = repCountRef.current * (currentExercise.caloriesPerMin / 30);
const currentCals = Math.round(timeCalories + repBonus);
          setCaloriesBurned(currentCals);
          updateDailyProgress(currentCals, Math.floor(elapsed / 1000), repCountRef.current);
        }
      }, 1000);
    }

    // Draw skeleton on canvas
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const connectionGroups = [
          { pairs: [[11, 13], [13, 15]], color: '#00ff88' },
          { pairs: [[12, 14], [14, 16]], color: '#00ccff' },
          { pairs: [[11, 12]], color: '#ffaa00' },
          { pairs: [[11, 23], [12, 24], [23, 24]], color: '#4f92ad' },
          { pairs: [[23, 25], [25, 27]], color: '#00ff88' },
          { pairs: [[24, 26], [26, 28]], color: '#00ccff' },
        ];
        connectionGroups.forEach((group) => {
          group.pairs.forEach(([a, b]) => {
            const lmA = landmarks[a]; const lmB = landmarks[b];
            if (!lmA || !lmB) return;
            if ((lmA.visibility ?? 0) < 0.4 || (lmB.visibility ?? 0) < 0.4) return;
            const avgVis = ((lmA.visibility ?? 0) + (lmB.visibility ?? 0)) / 2;
            const opacity = Math.min(1, avgVis * 1.2);
            const xA = lmA.x * canvas.width; const yA = lmA.y * canvas.height;
            const xB = lmB.x * canvas.width; const yB = lmB.y * canvas.height;
            ctx.beginPath(); ctx.moveTo(xA, yA); ctx.lineTo(xB, yB);
            ctx.strokeStyle = group.color; ctx.lineWidth = 3; ctx.globalAlpha = opacity * 0.8; ctx.lineCap = 'round'; ctx.stroke();
            ctx.globalAlpha = 1;
          });
        });
        const majorJoints = new Set([11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]);
        landmarks.forEach((lm, i) => {
          const vis = lm.visibility ?? 0;
          if (vis < 0.4) return;
          const x = lm.x * canvas.width; const y = lm.y * canvas.height;
          const isMajor = majorJoints.has(i);
          ctx.beginPath(); ctx.arc(x, y, isMajor ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isMajor ? '#00ff88' : `rgba(255,255,255,${vis * 0.8})`;
          ctx.globalAlpha = vis; ctx.fill(); ctx.globalAlpha = 1;
        });
        
      }
    }

    // ==================== ROBUST REP DETECTION ====================
    const { angle: rawAngle, confidence } = calculateAngle(landmarks, currentExercise.track);
    if (confidence < 0.5 || rawAngle <= 0 || rawAngle > 360) return;

    const alpha = 0.35;
    if (smoothedAngleRef.current === null) {
      smoothedAngleRef.current = rawAngle;
    } else {
      const jump = Math.abs(rawAngle - smoothedAngleRef.current);
      if (jump > 60) smoothedAngleRef.current = smoothedAngleRef.current * 0.95 + rawAngle * 0.05;
      else if (jump > 30) smoothedAngleRef.current = smoothedAngleRef.current * 0.88 + rawAngle * 0.12;
      else if (jump > 15) smoothedAngleRef.current = smoothedAngleRef.current * 0.75 + rawAngle * 0.25;
      else smoothedAngleRef.current = smoothedAngleRef.current * (1 - alpha) + rawAngle * alpha;
    }
    const angle = smoothedAngleRef.current;
    cycleMinAngleRef.current = Math.min(cycleMinAngleRef.current, angle);
    cycleMaxAngleRef.current = Math.max(cycleMaxAngleRef.current, angle);
    setCurrentAngles(prev => ({ ...prev, [currentExercise.track]: Math.round(angle) }));
    currentExercise.form.forEach((f) => {
      if (f.joint !== currentExercise.track && f.joint !== 'back') {
        const formResult = calculateAngle(landmarks, f.joint);
        setCurrentAngles(prev => ({ ...prev, [f.joint]: Math.round(formResult.angle) }));
      }
    });

    const downThresh = currentExercise.downThreshold;
    const upThresh = currentExercise.upThreshold;
    const REQUIRED_FRAMES = 8;
    const MIN_REP_INTERVAL = 1200;
    const MIN_ANGLE_RANGE = 25;

    if (angle < downThresh) { downFrameCountRef.current++; upFrameCountRef.current = 0; }
    else if (angle > upThresh) { upFrameCountRef.current++; downFrameCountRef.current = 0; }
    else { downFrameCountRef.current = Math.max(0, downFrameCountRef.current - 2); upFrameCountRef.current = Math.max(0, upFrameCountRef.current - 2); }

    if (downFrameCountRef.current >= REQUIRED_FRAMES && !isDownRef.current) {
      isDownRef.current = true; downFrameCountRef.current = 0;
    }
    if (upFrameCountRef.current >= REQUIRED_FRAMES && isDownRef.current) {
      const now = Date.now();
      const angleRange = cycleMaxAngleRef.current - cycleMinAngleRef.current;
      if (now - lastRepTimeRef.current >= MIN_REP_INTERVAL && angleRange >= MIN_ANGLE_RANGE) {
        isDownRef.current = false; upFrameCountRef.current = 0; lastRepTimeRef.current = now;
        cycleMinAngleRef.current = 180; cycleMaxAngleRef.current = 0;
        const newCount = repCountRef.current + 1;
        repCountRef.current = newCount; setRepCount(newCount);
        const elapsedMin = (now - workoutStartRef.current) / 60000;
        setCaloriesBurned(Math.round(timeCalories + repBonus));
        checkAutoDifficulty(currentExercise, newCount, angle);
        voiceRepMilestone(newCount, currentExercise.track);
      }
    }
  }, [currentExercise, checkAutoDifficulty, voiceRepMilestone, updateDailyProgress]);

  onResultsRef.current = onResults;

  const startWorkout = useCallback(async (exerciseParam) => {
    const exercise = exerciseParam || currentExercise;
    if (!exercise) return;
    setRepCount(0); repCountRef.current = 0; isDownRef.current = false; poseReadyRef.current = false;
    goodFormCountRef.current = 0; smoothedAngleRef.current = null; downFrameCountRef.current = 0;
    upFrameCountRef.current = 0; lastRepTimeRef.current = 0; cycleMinAngleRef.current = 180; cycleMaxAngleRef.current = 0;
    setTimer('Preparing...'); setCaloriesBurned(0); setCoachFeedback(''); setCurrentAngles({}); setCameraError('');
    setModelLoading(true); modelLoadingRef.current = true; setLoadingStep(1); loadingStepRef.current = 1;
    setLoadingTip(Math.floor(Math.random() * LOADING_TIPS.length));
    const tips = exercise.form.map(f => `\u2022 ${f.rule}`).join('\n');
    setCoachFeedback(tips); setIsWorkingOut(true);
    if (voiceEnabled && isPremium) {
      const startCues = VOICE_CUES.start;
      setTimeout(() => speak(startCues[Math.floor(Math.random() * startCues.length)], 'high'), 2000);
    }
    const tipInterval = setInterval(() => setLoadingTip(prev => (prev + 1) % LOADING_TIPS.length), 3000);
    try {
      setLoadingStep(2); loadingStepRef.current = 2;
const pose = new window.Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});
      pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, enableSegmentation: false, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
      pose.onResults((results) => { if (onResultsRef.current) onResultsRef.current(results); });
      poseInstanceRef.current = pose;
      setLoadingStep(3); loadingStepRef.current = 3;
      await new Promise(resolve => setTimeout(resolve, 300));
      const videoEl = videoRef.current;
      if (!videoEl) { setCameraError('Camera element not available.'); setIsWorkingOut(false); setModelLoading(false); modelLoadingRef.current = false; setLoadingStep(0); clearInterval(tipInterval); return; }
      const camera = new window.Camera(videoEl, {
        onFrame: async () => { if (poseInstanceRef.current) await poseInstanceRef.current.send({ image: videoEl }); },
        width: 640, height: 480,
      });
      camera.start(); cameraInstanceRef.current = camera; clearInterval(tipInterval);
    } catch (err) {
      console.error('MediaPipe error:', err);
      setCameraError('Failed to start camera. Please allow camera access and try again.');
      setIsWorkingOut(false); setModelLoading(false); modelLoadingRef.current = false; setLoadingStep(0); clearInterval(tipInterval);
    }
  }, [currentExercise, onResults, voiceEnabled, isPremium, speak]);

  const stopWorkout = useCallback(() => {
    if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); timerIntervalRef.current = null; }
    if (cameraInstanceRef.current) { cameraInstanceRef.current.stop(); cameraInstanceRef.current = null; }
    poseInstanceRef.current = null; poseReadyRef.current = false; isDownRef.current = false;
    smoothedAngleRef.current = null; downFrameCountRef.current = 0; upFrameCountRef.current = 0;
    lastRepTimeRef.current = 0; cycleMinAngleRef.current = 180; cycleMaxAngleRef.current = 0;
    modelLoadingRef.current = false; loadingStepRef.current = 0;
    setIsWorkingOut(false); setModelLoading(false); setLoadingStep(0);
    if (workoutStartRef.current > 0) {
      const elapsed = Math.floor((Date.now() - workoutStartRef.current) / 1000);
      updateDailyProgress(caloriesBurned, elapsed, repCountRef.current, true);
    }
    if (voiceEnabled && isPremium) {
      const completeCues = VOICE_CUES.workoutComplete;
      speak(completeCues[Math.floor(Math.random() * completeCues.length)], 'high');
    }
  }, [voiceEnabled, isPremium, speak, caloriesBurned, updateDailyProgress]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (cameraInstanceRef.current) cameraInstanceRef.current.stop();
    };
  }, []);

  // ==================== API CALLS (Direct OpenRouter) ====================
  // Indian Food Database (NIN + USDA verified values)
// ==================== FOOD DATABASE (Verified Indian Foods) ====================
const FOOD_DB = {
  // Dal / Lentils (per serving ~150g cooked)
  'dal': { cal: 120, protein: 8, carbs: 18, fat: 2, serving: 150, unit: 'bowl' },
  'arhar dal': { cal: 120, protein: 8, carbs: 18, fat: 2, serving: 150, unit: 'bowl' },
  'toor dal': { cal: 120, protein: 8, carbs: 18, fat: 2, serving: 150, unit: 'bowl' },
  'moong dal': { cal: 105, protein: 7, carbs: 16, fat: 1.5, serving: 150, unit: 'bowl' },
  'masoor dal': { cal: 115, protein: 7.5, carbs: 17, fat: 1.8, serving: 150, unit: 'bowl' },
  'chana dal': { cal: 130, protein: 9, carbs: 19, fat: 2.5, serving: 150, unit: 'bowl' },
  'urad dal': { cal: 125, protein: 8.5, carbs: 17, fat: 2.2, serving: 150, unit: 'bowl' },
  'rajma': { cal: 140, protein: 9, carbs: 22, fat: 1.5, serving: 150, unit: 'bowl' },
  'chole': { cal: 145, protein: 9, carbs: 22, fat: 2, serving: 150, unit: 'bowl' },
  'chickpea curry': { cal: 145, protein: 9, carbs: 22, fat: 2, serving: 150, unit: 'bowl' },
  'lobia': { cal: 120, protein: 8, carbs: 19, fat: 1.5, serving: 150, unit: 'bowl' },
  'dal makhani': { cal: 180, protein: 7, carbs: 16, fat: 10, serving: 150, unit: 'bowl' },
  'dal fry': { cal: 140, protein: 7, carbs: 17, fat: 5, serving: 150, unit: 'bowl' },
  'dal tadka': { cal: 135, protein: 7, carbs: 17, fat: 4.5, serving: 150, unit: 'bowl' },
  'sambhar': { cal: 100, protein: 5, carbs: 14, fat: 3, serving: 200, unit: 'bowl' },
  'kadhi': { cal: 110, protein: 4, carbs: 10, fat: 6, serving: 200, unit: 'bowl' },

  // Rice & Grains (per serving)
  'rice': { cal: 180, protein: 4, carbs: 40, fat: 0.5, serving: 150, unit: 'bowl' },
  'chawal': { cal: 180, protein: 4, carbs: 40, fat: 0.5, serving: 150, unit: 'bowl' },
  'white rice': { cal: 180, protein: 4, carbs: 40, fat: 0.5, serving: 150, unit: 'bowl' },
  'brown rice': { cal: 165, protein: 4.5, carbs: 35, fat: 1.2, serving: 150, unit: 'bowl' },
  'jeera rice': { cal: 200, protein: 4, carbs: 38, fat: 5, serving: 150, unit: 'bowl' },
  'pulao': { cal: 210, protein: 5, carbs: 36, fat: 6, serving: 150, unit: 'bowl' },
  'biryani': { cal: 260, protein: 10, carbs: 32, fat: 10, serving: 200, unit: 'plate' },
  'veg biryani': { cal: 230, protein: 6, carbs: 35, fat: 8, serving: 200, unit: 'plate' },
  'chicken biryani': { cal: 300, protein: 16, carbs: 30, fat: 13, serving: 250, unit: 'plate' },
  'mutton biryani': { cal: 330, protein: 18, carbs: 28, fat: 16, serving: 250, unit: 'plate' },
  'fried rice': { cal: 240, protein: 6, carbs: 35, fat: 8, serving: 200, unit: 'plate' },
  'khichdi': { cal: 150, protein: 6, carbs: 26, fat: 3, serving: 200, unit: 'bowl' },
  'upma': { cal: 180, protein: 5, carbs: 28, fat: 6, serving: 200, unit: 'bowl' },
  'poha': { cal: 170, protein: 4, carbs: 30, fat: 5, serving: 200, unit: 'bowl' },
  'idli': { cal: 40, protein: 2, carbs: 8, fat: 0.2, serving: 1, unit: 'piece' },
  'dosa': { cal: 120, protein: 3, carbs: 18, fat: 4, serving: 1, unit: 'piece' },
  'masala dosa': { cal: 180, protein: 4, carbs: 24, fat: 7, serving: 1, unit: 'piece' },
  'uttapam': { cal: 150, protein: 4, carbs: 22, fat: 5, serving: 1, unit: 'piece' },
  'appam': { cal: 90, protein: 2, carbs: 16, fat: 2, serving: 1, unit: 'piece' },
  'chapati': { cal: 70, protein: 2.5, carbs: 12, fat: 1.5, serving: 1, unit: 'piece' },
  'roti': { cal: 70, protein: 2.5, carbs: 12, fat: 1.5, serving: 1, unit: 'piece' },
  'phulka': { cal: 55, protein: 2, carbs: 10, fat: 0.5, serving: 1, unit: 'piece' },
  'paratha': { cal: 150, protein: 4, carbs: 18, fat: 7, serving: 1, unit: 'piece' },
  'aloo paratha': { cal: 200, protein: 5, carbs: 24, fat: 9, serving: 1, unit: 'piece' },
  'gobi paratha': { cal: 180, protein: 5, carbs: 22, fat: 8, serving: 1, unit: 'piece' },
  'paneer paratha': { cal: 220, protein: 8, carbs: 20, fat: 12, serving: 1, unit: 'piece' },
  'naan': { cal: 130, protein: 4, carbs: 22, fat: 3, serving: 1, unit: 'piece' },
  'kulcha': { cal: 140, protein: 4, carbs: 24, fat: 3.5, serving: 1, unit: 'piece' },
  'puri': { cal: 100, protein: 2, carbs: 12, fat: 5, serving: 1, unit: 'piece' },
  'bhatura': { cal: 160, protein: 3, carbs: 20, fat: 7, serving: 1, unit: 'piece' },

  // Sabzi / Vegetables (per serving ~150g)
  'sabzi': { cal: 80, protein: 3, carbs: 10, fat: 4, serving: 150, unit: 'bowl' },
  'aloo sabzi': { cal: 120, protein: 3, carbs: 18, fat: 5, serving: 150, unit: 'bowl' },
  'aloo gobi': { cal: 110, protein: 3, carbs: 16, fat: 5, serving: 150, unit: 'bowl' },
  'aloo matar': { cal: 115, protein: 4, carbs: 17, fat: 4.5, serving: 150, unit: 'bowl' },
  'gobi sabzi': { cal: 80, protein: 3, carbs: 10, fat: 4, serving: 150, unit: 'bowl' },
  'bhindi sabzi': { cal: 85, protein: 3, carbs: 9, fat: 5, serving: 150, unit: 'bowl' },
  'baingan bharta': { cal: 90, protein: 2.5, carbs: 10, fat: 5, serving: 150, unit: 'bowl' },
  'palak paneer': { cal: 170, protein: 10, carbs: 8, fat: 12, serving: 150, unit: 'bowl' },
  'paneer butter masala': { cal: 240, protein: 12, carbs: 10, fat: 18, serving: 150, unit: 'bowl' },
  'paneer tikka': { cal: 200, protein: 14, carbs: 6, fat: 13, serving: 150, unit: 'plate' },
  'paneer tikka masala': { cal: 250, protein: 13, carbs: 10, fat: 18, serving: 150, unit: 'bowl' },
  'matar paneer': { cal: 200, protein: 10, carbs: 12, fat: 13, serving: 150, unit: 'bowl' },
  'kadai paneer': { cal: 230, protein: 11, carbs: 10, fat: 17, serving: 150, unit: 'bowl' },
  'shahi paneer': { cal: 250, protein: 11, carbs: 10, fat: 19, serving: 150, unit: 'bowl' },
  'paneer bhurji': { cal: 200, protein: 13, carbs: 5, fat: 14, serving: 150, unit: 'bowl' },
  'mushroom masala': { cal: 100, protein: 5, carbs: 8, fat: 6, serving: 150, unit: 'bowl' },
  'mix veg': { cal: 90, protein: 3, carbs: 12, fat: 4, serving: 150, unit: 'bowl' },
  'mixed vegetable': { cal: 90, protein: 3, carbs: 12, fat: 4, serving: 150, unit: 'bowl' },
  'sev tamatar': { cal: 130, protein: 4, carbs: 14, fat: 7, serving: 150, unit: 'bowl' },
  'lauki sabzi': { cal: 60, protein: 2, carbs: 8, fat: 3, serving: 150, unit: 'bowl' },
  'tori sabzi': { cal: 65, protein: 2, carbs: 8, fat: 3.5, serving: 150, unit: 'bowl' },
  'sambar': { cal: 100, protein: 5, carbs: 14, fat: 3, serving: 200, unit: 'bowl' },

  // Non-Veg (per serving ~150g cooked)
  'chicken curry': { cal: 200, protein: 22, carbs: 6, fat: 10, serving: 150, unit: 'bowl' },
  'chicken': { cal: 165, protein: 25, carbs: 0, fat: 6, serving: 100, unit: 'g' },
  'chicken breast': { cal: 110, protein: 23, carbs: 0, fat: 1.5, serving: 100, unit: 'g' },
  'chicken thigh': { cal: 180, protein: 20, carbs: 0, fat: 10, serving: 100, unit: 'g' },
  'tandoori chicken': { cal: 190, protein: 26, carbs: 3, fat: 8, serving: 150, unit: 'piece' },
  'chicken tikka': { cal: 180, protein: 25, carbs: 4, fat: 7, serving: 150, unit: 'plate' },
  'butter chicken': { cal: 260, protein: 20, carbs: 10, fat: 16, serving: 150, unit: 'bowl' },
  'chicken biryani': { cal: 300, protein: 16, carbs: 30, fat: 13, serving: 250, unit: 'plate' },
  'chicken fried rice': { cal: 280, protein: 14, carbs: 34, fat: 9, serving: 250, unit: 'plate' },
  'fish curry': { cal: 170, protein: 20, carbs: 6, fat: 8, serving: 150, unit: 'bowl' },
  'fish': { cal: 120, protein: 20, carbs: 0, fat: 4, serving: 100, unit: 'g' },
  'fish fry': { cal: 200, protein: 18, carbs: 8, fat: 11, serving: 150, unit: 'piece' },
  'prawn curry': { cal: 150, protein: 18, carbs: 5, fat: 6, serving: 150, unit: 'bowl' },
  'prawns': { cal: 100, protein: 20, carbs: 0, fat: 1.5, serving: 100, unit: 'g' },
  'mutton curry': { cal: 240, protein: 22, carbs: 4, fat: 15, serving: 150, unit: 'bowl' },
  'mutton': { cal: 200, protein: 20, carbs: 0, fat: 13, serving: 100, unit: 'g' },
  'keema': { cal: 220, protein: 20, carbs: 5, fat: 13, serving: 150, unit: 'bowl' },
  'mutton keema': { cal: 220, protein: 20, carbs: 5, fat: 13, serving: 150, unit: 'bowl' },
  'egg curry': { cal: 160, protein: 12, carbs: 6, fat: 9, serving: 150, unit: 'bowl' },
  'egg': { cal: 70, protein: 6, carbs: 0.5, fat: 5, serving: 1, unit: 'piece' },
  'boiled egg': { cal: 70, protein: 6, carbs: 0.5, fat: 5, serving: 1, unit: 'piece' },
  'omelette': { cal: 90, protein: 7, carbs: 1, fat: 7, serving: 1, unit: 'piece' },
  'egg bhurji': { cal: 120, protein: 9, carbs: 2, fat: 8, serving: 150, unit: 'bowl' },

  // Snacks & Street Food
  'samosa': { cal: 260, protein: 4, carbs: 26, fat: 15, serving: 1, unit: 'piece' },
  'pakora': { cal: 75, protein: 2, carbs: 8, fat: 4, serving: 1, unit: 'piece' },
  'onion pakoda': { cal: 75, protein: 2, carbs: 8, fat: 4, serving: 1, unit: 'piece' },
  'vada': { cal: 100, protein: 3, carbs: 12, fat: 5, serving: 1, unit: 'piece' },
  'medu vada': { cal: 100, protein: 3, carbs: 12, fat: 5, serving: 1, unit: 'piece' },
  'dhokla': { cal: 80, protein: 3, carbs: 14, fat: 2, serving: 2, unit: 'piece' },
  'khandvi': { cal: 60, protein: 3, carbs: 8, fat: 2, serving: 4, unit: 'piece' },
  'pav bhaji': { cal: 350, protein: 10, carbs: 42, fat: 16, serving: 1, unit: 'plate' },
  'chaat': { cal: 150, protein: 4, carbs: 22, fat: 5, serving: 1, unit: 'plate' },
  'pani puri': { cal: 36, protein: 1, carbs: 6, fat: 1, serving: 1, unit: 'piece' },
  'golgappa': { cal: 36, protein: 1, carbs: 6, fat: 1, serving: 1, unit: 'piece' },
  'bhel puri': { cal: 180, protein: 4, carbs: 28, fat: 6, serving: 1, unit: 'plate' },
  'sev puri': { cal: 190, protein: 4, carbs: 26, fat: 8, serving: 1, unit: 'plate' },
  'aloo tikki': { cal: 150, protein: 3, carbs: 20, fat: 7, serving: 1, unit: 'piece' },
  'kachori': { cal: 190, protein: 4, carbs: 22, fat: 10, serving: 1, unit: 'piece' },
  'spring roll': { cal: 130, protein: 3, carbs: 14, fat: 7, serving: 1, unit: 'piece' },
  'bread pakora': { cal: 180, protein: 4, carbs: 22, fat: 8, serving: 1, unit: 'piece' },

  // Dairy (per serving)
  'milk': { cal: 60, protein: 3, carbs: 5, fat: 3, serving: 100, unit: 'ml' },
  'curd': { cal: 60, protein: 3.5, carbs: 5, fat: 3, serving: 100, unit: 'g' },
  'dahi': { cal: 60, protein: 3.5, carbs: 5, fat: 3, serving: 100, unit: 'g' },
  'yogurt': { cal: 60, protein: 3.5, carbs: 5, fat: 3, serving: 100, unit: 'g' },
  'paneer': { cal: 265, protein: 18, carbs: 3, fat: 20, serving: 100, unit: 'g' },
  'butter': { cal: 720, protein: 0.5, carbs: 0, fat: 80, serving: 100, unit: 'g' },
  'ghee': { cal: 900, protein: 0, carbs: 0, fat: 100, serving: 100, unit: 'g' },
  'cheese': { cal: 350, protein: 22, carbs: 2, fat: 28, serving: 100, unit: 'g' },
  'lassi': { cal: 120, protein: 4, carbs: 16, fat: 4, serving: 250, unit: 'glass' },
  'chai': { cal: 50, protein: 2, carbs: 6, fat: 2, serving: 150, unit: 'cup' },
  'tea': { cal: 50, protein: 2, carbs: 6, fat: 2, serving: 150, unit: 'cup' },
  'coffee': { cal: 40, protein: 1.5, carbs: 5, fat: 1.5, serving: 150, unit: 'cup' },
  'buttermilk': { cal: 20, protein: 1.5, carbs: 2.5, fat: 0.5, serving: 250, unit: 'glass' },
  'chaas': { cal: 20, protein: 1.5, carbs: 2.5, fat: 0.5, serving: 250, unit: 'glass' },

  // Fruits (per serving ~100g)
  'banana': { cal: 90, protein: 1.2, carbs: 22, fat: 0.3, serving: 1, unit: 'piece' },
  'apple': { cal: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: 1, unit: 'piece' },
  'orange': { cal: 47, protein: 0.9, carbs: 12, fat: 0.1, serving: 1, unit: 'piece' },
  'mango': { cal: 60, protein: 0.8, carbs: 15, fat: 0.4, serving: 1, unit: 'piece' },
  'papaya': { cal: 40, protein: 0.5, carbs: 10, fat: 0.1, serving: 100, unit: 'g' },
  'watermelon': { cal: 30, protein: 0.6, carbs: 8, fat: 0.2, serving: 100, unit: 'g' },
  'grapes': { cal: 65, protein: 0.7, carbs: 17, fat: 0.2, serving: 100, unit: 'g' },
  'guava': { cal: 38, protein: 2.6, carbs: 9, fat: 0.1, serving: 1, unit: 'piece' },
  'pomegranate': { cal: 83, protein: 1.7, carbs: 19, fat: 1.2, serving: 1, unit: 'piece' },
  'pineapple': { cal: 50, protein: 0.5, carbs: 13, fat: 0.1, serving: 100, unit: 'g' },
  'chikoo': { cal: 83, protein: 0.4, carbs: 20, fat: 1.1, serving: 1, unit: 'piece' },
  'coconut': { cal: 354, protein: 3.3, carbs: 15, fat: 33, serving: 100, unit: 'g' },

  // Sweets & Desserts
  'gulab jamun': { cal: 150, protein: 2, carbs: 22, fat: 6, serving: 1, unit: 'piece' },
  'rasgulla': { cal: 130, protein: 3, carbs: 24, fat: 3, serving: 1, unit: 'piece' },
  'jalebi': { cal: 150, protein: 1, carbs: 26, fat: 5, serving: 2, unit: 'piece' },
  'halwa': { cal: 180, protein: 2, carbs: 24, fat: 9, serving: 100, unit: 'g' },
  'gajar halwa': { cal: 200, protein: 3, carbs: 26, fat: 10, serving: 100, unit: 'g' },
  'kheer': { cal: 140, protein: 4, carbs: 22, fat: 4, serving: 150, unit: 'bowl' },
  'rice kheer': { cal: 140, protein: 4, carbs: 22, fat: 4, serving: 150, unit: 'bowl' },
  'rasmalai': { cal: 160, protein: 5, carbs: 22, fat: 6, serving: 1, unit: 'piece' },
  'barfi': { cal: 180, protein: 4, carbs: 22, fat: 8, serving: 1, unit: 'piece' },
  'laddu': { cal: 200, protein: 4, carbs: 24, fat: 10, serving: 1, unit: 'piece' },
  'peda': { cal: 160, protein: 4, carbs: 20, fat: 7, serving: 1, unit: 'piece' },
  'ice cream': { cal: 200, protein: 3.5, carbs: 24, fat: 10, serving: 100, unit: 'g' },

  // Drinks
  'nimbu pani': { cal: 40, protein: 0.2, carbs: 10, fat: 0.1, serving: 250, unit: 'glass' },
  'lemon water': { cal: 40, protein: 0.2, carbs: 10, fat: 0.1, serving: 250, unit: 'glass' },
  'juice': { cal: 50, protein: 0.5, carbs: 12, fat: 0.1, serving: 250, unit: 'glass' },
  'orange juice': { cal: 45, protein: 0.7, carbs: 10, fat: 0.2, serving: 250, unit: 'glass' },
  'mango shake': { cal: 180, protein: 4, carbs: 30, fat: 5, serving: 300, unit: 'glass' },
  'banana shake': { cal: 160, protein: 4, carbs: 28, fat: 4, serving: 300, unit: 'glass' },
  'protein shake': { cal: 120, protein: 25, carbs: 3, fat: 1.5, serving: 300, unit: 'glass' },
  'sugarcane juice': { cal: 180, protein: 0.5, carbs: 45, fat: 0.1, serving: 300, unit: 'glass' },
  'coconut water': { cal: 20, protein: 0.7, carbs: 4, fat: 0.2, serving: 250, unit: 'glass' },

  // Dry Fruits & Nuts (per 100g - small portions!)
  'almonds': { cal: 580, protein: 21, carbs: 22, fat: 50, serving: 100, unit: 'g' },
  'badam': { cal: 580, protein: 21, carbs: 22, fat: 50, serving: 100, unit: 'g' },
  'cashews': { cal: 560, protein: 18, carbs: 30, fat: 44, serving: 100, unit: 'g' },
  'kaju': { cal: 560, protein: 18, carbs: 30, fat: 44, serving: 100, unit: 'g' },
  'walnuts': { cal: 650, protein: 15, carbs: 14, fat: 65, serving: 100, unit: 'g' },
  'peanuts': { cal: 560, protein: 26, carbs: 16, fat: 48, serving: 100, unit: 'g' },
  'makhana': { cal: 350, protein: 10, carbs: 65, fat: 0.5, serving: 100, unit: 'g' },
  'dates': { cal: 280, protein: 2.5, carbs: 75, fat: 0.4, serving: 100, unit: 'g' },
  'raisins': { cal: 300, protein: 3, carbs: 79, fat: 0.5, serving: 100, unit: 'g' },
  'pista': { cal: 560, protein: 20, carbs: 28, fat: 45, serving: 100, unit: 'g' },
  'pistachio': { cal: 560, protein: 20, carbs: 28, fat: 45, serving: 100, unit: 'g' },

  // Miscellaneous
  'salad': { cal: 30, protein: 1.5, carbs: 5, fat: 0.5, serving: 150, unit: 'bowl' },
  'raita': { cal: 60, protein: 3, carbs: 5, fat: 3, serving: 100, unit: 'bowl' },
  'pickle': { cal: 50, protein: 1, carbs: 5, fat: 3, serving: 15, unit: 'tbsp' },
  'achar': { cal: 50, protein: 1, carbs: 5, fat: 3, serving: 15, unit: 'tbsp' },
  'chutney': { cal: 30, protein: 0.5, carbs: 6, fat: 0.5, serving: 30, unit: 'tbsp' },
  'papad': { cal: 50, protein: 3, carbs: 7, fat: 1.5, serving: 1, unit: 'piece' },
  'bread': { cal: 70, protein: 2.5, carbs: 13, fat: 1, serving: 1, unit: 'slice' },
  'toast': { cal: 70, protein: 2.5, carbs: 13, fat: 1, serving: 1, unit: 'slice' },
  'cornflakes': { cal: 110, protein: 2, carbs: 24, fat: 0.5, serving: 30, unit: 'bowl' },
  'oats': { cal: 150, protein: 5, carbs: 25, fat: 3, serving: 40, unit: 'bowl' },
  'dalia': { cal: 130, protein: 4, carbs: 22, fat: 2.5, serving: 150, unit: 'bowl' },
  'maggi': { cal: 350, protein: 8, carbs: 48, fat: 14, serving: 1, unit: 'packet' },
  'noodles': { cal: 350, protein: 8, carbs: 48, fat: 14, serving: 1, unit: 'packet' },
  'pasta': { cal: 280, protein: 9, carbs: 42, fat: 8, serving: 200, unit: 'plate' },
  'pizza': { cal: 270, protein: 11, carbs: 33, fat: 10, serving: 1, unit: 'slice' },
  'burger': { cal: 350, protein: 15, carbs: 35, fat: 16, serving: 1, unit: 'piece' },
  'sandwich': { cal: 200, protein: 8, carbs: 24, fat: 8, serving: 1, unit: 'piece' },
  'soup': { cal: 60, protein: 2, carbs: 8, fat: 2, serving: 250, unit: 'bowl' },
  'tomato soup': { cal: 70, protein: 2, carbs: 10, fat: 2, serving: 250, unit: 'bowl' },
  'sweet corn soup': { cal: 90, protein: 2, carbs: 14, fat: 3, serving: 250, unit: 'bowl' },
  'honey': { cal: 300, protein: 0.3, carbs: 82, fat: 0, serving: 100, unit: 'g' },
  'sugar': { cal: 387, protein: 0, carbs: 100, fat: 0, serving: 100, unit: 'g' },
  'jam': { cal: 250, protein: 0.5, carbs: 64, fat: 0.1, serving: 100, unit: 'g' },
  'peanut butter': { cal: 590, protein: 25, carbs: 20, fat: 50, serving: 100, unit: 'g' },
  'soya chunks': { cal: 345, protein: 52, carbs: 33, fat: 0.5, serving: 100, unit: 'g' },
  'tofu': { cal: 76, protein: 8, carbs: 1.9, fat: 4.8, serving: 100, unit: 'g' },
  'sprouts': { cal: 30, protein: 3, carbs: 5, fat: 0.2, serving: 100, unit: 'g' },
  'green salad': { cal: 20, protein: 1, carbs: 3, fat: 0.2, serving: 150, unit: 'bowl' },
};

// Portion unit multipliers (relative to FOOD_DB serving size)
// If user says "1 cup dal" and dal serving is "bowl" (150g), 
// then 1 cup = ~200ml ≈ 1.33 × a standard bowl
const PORTION_MULTIPLIERS = {
  'cup': 1.3,       // 1 cup ≈ 200ml, standard bowl ≈ 150ml
  'bowl': 1.0,      // 1 bowl = standard serving
  'katori': 0.9,    // 1 katori ≈ 135ml, slightly smaller than bowl
  'plate': 1.0,     // 1 plate = standard serving
  'glass': 1.0,     // 1 glass = standard serving
  'piece': 1.0,     // 1 piece = standard serving
  'slice': 1.0,     // 1 slice = standard serving
  'packet': 1.0,    // 1 packet = standard serving
  'tbsp': 0.15,     // 1 tablespoon ≈ 15g/15ml
  'tsp': 0.05,      // 1 teaspoon ≈ 5g/5ml
  'ml': 0.01,       // per ml
  'g': null,        // handled specially: ratio of grams to serving
  'kg': null,       // 1000g
  'large': 1.3,     // large piece/serving
  'medium': 1.0,    // medium piece/serving
  'small': 0.7,     // small piece/serving
};

// Food name aliases for fuzzy matching
const FOOD_ALIASES = {
  'chawal': 'rice', 'bhat': 'rice', 'bhaat': 'rice',
  'roti': 'chapati', 'fulka': 'phulka',
  'sabji': 'sabzi', 'shaak': 'sabzi',
  'nonveg': 'chicken', 'non veg': 'chicken',
  'murgi': 'chicken', 'chicken leg': 'chicken thigh',
  'chicken breast grilled': 'chicken breast', 'grilled chicken': 'chicken breast',
  'anda': 'egg', 'boiled anda': 'boiled egg',
  'doodh': 'milk', 'curd rice': 'curd',
  'paneer sabzi': 'palak paneer', 'paneer curry': 'kadai paneer',
  'aloo': 'aloo sabzi', 'potato': 'aloo sabzi',
  'bhindi': 'bhindi sabzi', 'okra': 'bhindi sabzi',
  'baingan': 'baingan bharta', 'brinjal': 'baingan bharta',
  'gobi': 'gobi sabzi', 'cauliflower': 'gobi sabzi',
  'matar': 'aloo matar', 'peas': 'aloo matar',
  'dahi': 'curd', 'yoghurt': 'curd',
  'badam': 'almonds', 'kaju': 'cashews',
  'akharot': 'walnuts', 'pishta': 'pista',
  'namkeen': 'sambar', 'snack': 'samosa',
  'paratha': 'paratha', 'stuffed paratha': 'aloo paratha',
  'tea': 'chai', 'masala chai': 'chai', 'chai tea': 'chai',
  'filter coffee': 'coffee', 'espresso': 'coffee',
  'idli sambar': 'idli', 'dosa sambar': 'dosa',
  'curd rice': 'khichdi', 'lemon rice': 'pulao',
  'veg meal': 'dal', 'lunch': 'dal',
  'mutton biryani': 'mutton biryani',
  'egg rice': 'fried rice', 'veg rice': 'pulao',
  'veg roll': 'spring roll', 'bread omelette': 'omelette',
  'masala omelette': 'omelette', 'scrambled egg': 'egg bhurji',
  'bhurji': 'egg bhurji', 'mutton keema': 'keema',
  'keema rice': 'biryani', 'chicken soup': 'soup',
  'dal chawal': 'dal', 'rajma chawal': 'rajma',
  'chole bhature': 'chole', 'chole kulche': 'chole',
  'tandoori roti': 'chapati', 'missi roti': 'chapati',
  'makki roti': 'chapati', 'makki ki roti': 'chapati',
  'sarson saag': 'mix veg', 'saag': 'mix veg',
  'sweet': 'gulab jamun', 'mithai': 'barfi',
  'khoya': 'barfi', 'burfi': 'barfi',
  'fruit': 'apple', 'fruits': 'apple',
  'dry fruit': 'almonds', 'mixed nuts': 'almonds',
  'protein powder': 'protein shake', 'whey protein': 'protein shake',
  'soy milk': 'milk', 'almond milk': 'milk',
  'veg sandwich': 'sandwich', 'cheese sandwich': 'sandwich',
  'grilled sandwich': 'sandwich',
};
  const getDietPlan = async () => {
    setDietLoading(true);
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: 'system', content: 'You are a sports nutritionist. Give practical, specific diet advice with real food names.' },
            { role: 'user', content: `Sports nutritionist. Create a practical 1-day diet plan for someone who did ${Math.max(1, Math.floor(repCount / 10))} sets of ${currentExercise?.name || 'exercise'} (${currentExercise?.difficulty || 'easy'}). Total reps: ${repCount || 10}. Burned: ~${caloriesBurned || 100} kcal.\nFormat:\n🌅 Breakfast: ...\n🍎 Pre-workout: ...\n🍽️ Lunch: ...\n💪 Post-workout: ...\n🌙 Dinner: ...\nUnder 100 words. Specific foods. End with one Hindi tip sentence.` },
          ],
        }),
      });
      const data = await res.json();
      setDietPlan(data.choices?.[0]?.message?.content || 'Could not generate diet plan');
    } catch { setDietPlan('Failed to generate diet plan. Please try again.'); }
    setDietLoading(false);
  };
const analyzeDiet = async () => {
  if (!mealInput.trim()) return;
  setAnalyzeLoading(true);

  try {
    // Parse the meal input into individual items
    const items = mealInput
      .toLowerCase()
      .replace(/\band\b/g, ',')
      .replace(/\+/g, ',')
      .replace(/\n/g, ',')
      .replace(/\s{2,}/g, ' ')
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(Boolean);

    let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    const matchedItems = [];
    const unmatchedItems = [];

    for (const item of items) {
      // Parse: quantity + unit + food name
      // Examples: "1 cup dal", "2 bowl rice", "200g chicken", "3 roti", "1 large banana"
      const portionRegex = /^(\d+\.?\d*)\s*(cup|cups|bowl|bowls|katori|plate|plates|glass|glasses|piece|pieces|slice|slices|packet|packets|tbsp|tsp|ml|g|kg|large|medium|small)?\s+(.+)$/;
      const simpleRegex = /^(\d+\.?\d*)\s+(.+)$/;  // "2 roti"
      const plainRegex = /^(.+)$/;  // just "roti"

      let quantity = 1;
      let unit = null;
      let foodName = '';

      const portionMatch = item.match(portionRegex);
      const simpleMatch = item.match(simpleRegex);

      if (portionMatch) {
        // "1 cup dal", "200g chicken", "2 bowl rice"
        quantity = parseFloat(portionMatch[1]);
        unit = portionMatch[2]?.toLowerCase() || null;
        foodName = portionMatch[3].trim();
      } else if (simpleMatch) {
        // "2 roti" (number + food, no unit)
        const possibleUnit = simpleMatch[2]?.toLowerCase();
        // Check if the "food name" is actually a unit (e.g., "2 cups" is incomplete)
        const knownUnits = ['cup','cups','bowl','bowls','katori','plate','plates','glass','glasses','piece','pieces','slice','slices','packet','packets','tbsp','tsp','ml','g','kg','large','medium','small'];
        if (knownUnits.includes(possibleUnit)) {
          // This is just a number + unit without food name, skip
          unmatchedItems.push(item);
          continue;
        }
        quantity = parseFloat(simpleMatch[1]);
        foodName = simpleMatch[2].trim();
      } else {
        // Just "roti" or "dal" (no number)
        foodName = item.trim();
      }

      // Handle "200g chicken" format (number directly attached to unit)
      const attachedUnitMatch = foodName.match(/^(g|kg|ml)\s+(.+)$/);
      if (!unit && attachedUnitMatch) {
        unit = attachedUnitMatch[1];
        foodName = attachedUnitMatch[2].trim();
      }
      // Handle "200 g chicken" where "g" was parsed as unit
      // Already handled by portionRegex above

      // Find the food in FOOD_DB (with alias fallback)
      let foodData = FOOD_DB[foodName];
      if (!foodData) {
        // Try alias
        const alias = FOOD_ALIASES[foodName];
        if (alias) {
          foodData = FOOD_DB[alias];
        }
      }
      if (!foodData) {
        // Try partial match: if foodName contains a known food
        for (const [key, val] of Object.entries(FOOD_DB)) {
          if (key.includes(foodName) || foodName.includes(key)) {
            foodData = val;
            break;
          }
        }
      }

      if (!foodData) {
        unmatchedItems.push(item);
        continue;
      }

      // Calculate multiplier based on portion unit
      let multiplier = quantity; // default: just multiply by quantity

      if (unit) {
        if (unit === 'g') {
          // "200g chicken" → ratio of grams to serving
          multiplier = quantity / foodData.serving;
        } else if (unit === 'kg') {
          multiplier = (quantity * 1000) / foodData.serving;
        } else if (unit === 'ml') {
          multiplier = quantity / foodData.serving;
        } else if (unit === 'tbsp') {
          multiplier = quantity * 0.15;
        } else if (unit === 'tsp') {
          multiplier = quantity * 0.05;
        } else if (unit === 'large') {
          multiplier = quantity * 1.3;
        } else if (unit === 'medium') {
          multiplier = quantity * 1.0;
        } else if (unit === 'small') {
          multiplier = quantity * 0.7;
        } else {
          // cup, bowl, katori, plate, glass, piece, slice, packet
          const portionMult = PORTION_MULTIPLIERS[unit] || 1.0;
          // If food's default unit matches user's unit, just use quantity
          // If different, apply the ratio
          if (unit === foodData.unit) {
            multiplier = quantity; // "1 bowl dal" → 1 × dal serving
          } else {
            multiplier = quantity * portionMult; // "1 cup dal" → 1 × 1.3 × dal serving
          }
        }
      } else {
        // No unit specified, assume 1 standard serving
        multiplier = quantity;
      }

      const itemCal = Math.round(foodData.cal * multiplier);
      const itemProtein = Math.round(foodData.protein * multiplier * 10) / 10;
      const itemCarbs = Math.round(foodData.carbs * multiplier * 10) / 10;
      const itemFat = Math.round(foodData.fat * multiplier * 10) / 10;

      totalCal += itemCal;
      totalProtein += itemProtein;
      totalCarbs += itemCarbs;
      totalFat += itemFat;

      matchedItems.push({
        name: foodName,
        quantity,
        unit: unit || foodData.unit,
        cal: itemCal,
        protein: itemProtein,
        carbs: itemCarbs,
        fat: itemFat,
      });
    }

    // Calculate daily goals based on a 70kg person
    const goalProtein = 112; // 1.6g per kg
    const goalCalories = 2200;

    let suggestionEn = '';
    let suggestionHi = '';

    if (unmatchedItems.length > 0) {
      suggestionEn = `Could not find: ${unmatchedItems.join(', ')}. `;
      suggestionHi = `ये नहीं मिले: ${unmatchedItems.join(', ')}. `;
    }

    if (totalProtein < 20) {
      suggestionEn += 'Add protein-rich foods like eggs, paneer, chicken, dal, or soya chunks to meet your daily target.';
      suggestionHi += 'अपने दैनिक लक्ष्य को पूरा करने के लिए अंडे, पनीर, चिकन, दाल, या सोया चंक्स जैसे प्रोटीन युक्त खाद्य पदार्थ खाएं।';
    } else if (totalProtein < 40) {
      suggestionEn += 'Good start! Add more protein like curd, sprouts, or nuts to hit your goal.';
      suggestionHi += 'अच्छी शुरुआत! अपने लक्ष्य तक पहुंचने के लिए दही, अंकुरित दाल या नट्स और जोड़ें।';
    } else {
      suggestionEn += 'Great protein intake! Keep it up and maintain balanced meals.';
      suggestionHi += 'बहुत अच्छी प्रोटीन मात्रा! इसे बनाए रखें और संतुलित भोजन लें।';
    }

    setDietAnalysis({
      calories: totalCal,
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      suggestionEn,
      suggestionHi,
      goalProtein,
      goalCalories,
      items: matchedItems,
      unmatched: unmatchedItems,
    });

  } catch (err) {
    console.error('Diet analysis error:', err);
    setDietAnalysis({
      calories: 0, protein: 0, carbs: 0, fat: 0,
      suggestionEn: 'Error analyzing. Please try again.',
      suggestionHi: 'विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।',
      goalProtein: 112, goalCalories: 2200,
      items: [], unmatched: [],
    });
  }
  setAnalyzeLoading(false);
};
  const handleExerciseClick = (exercise) => {
    if (exercise.premium && !isPremium) { setShowPaymentModal(true); return; }
    setCurrentExercise(exercise);
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

  const getCategoryIcon = (category, size = 16, className) => {
    const IconComponent = categoryIcons[category] || HomeIcon;
    return <IconComponent size={size} className={className} />;
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <ParticleBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40"
        style={{ background: 'rgba(10,10,30,0.97)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#425b66]/20 flex items-center justify-center">
              <Dumbbell size={18} className="text-[#425b66]" />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight" style={{ color: '#8d4425', fontFamily: 'Syne, DM Sans, sans-serif' }}>FitCoach AI</h1>
            {isPremium && <span className="text-[9px] font-bold bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Crown size={8} /> PRO</span>}
          </div>
          {!isPremium && (
            <button onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-white cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(255,77,0,0.3)]"
              style={{ backgroundColor: '#425b66' }}>
              <Crown size={11} /> Pro
            </button>
          )}
        </div>
        <div className="px-4 pb-2">
          <div className="flex items-center rounded-2xl p-1 w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[{ key: 'workout', label: 'Workout', icon: Dumbbell }, { key: 'diet', label: 'Diet', icon: Utensils }].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-300 ${activeTab === tab.key ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #c8263c, #425b66)', boxShadow: '0 2px 12px rgba(255,77,0,0.35)' } : {}}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 overscroll-contain" style={{ paddingTop: '100px', paddingBottom: '4rem', WebkitOverflowScrolling: 'touch' }}>

        {/* ==================== WORKOUT TAB ==================== */}
        {activeTab === 'workout' && (
          <div className="space-y-4 px-3 pt-3 pb-8">
            {!isWorkingOut ? (
              <>
                {/* Daily Target Section */}
                <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#425b66]/20 flex items-center justify-center"><Trophy size={16} className="text-[#ff4d00]" /></div>
                      <div><h2 className="text-white font-bold text-sm leading-tight">Daily Target</h2><p className="text-gray-400 text-[10px]">Today&apos;s Progress</p></div>
                    </div>
                   <div className="flex items-center gap-2">
  <div className="flex items-center gap-1 bg-[#ff7043]/10 rounded-lg px-2 py-1"><FlameKindling size={12} className="text-orange-400" /><span className="text-orange-300 text-[10px] font-bold">{streak.current}d</span></div>
  <button onClick={() => { const reset = { date: getTodayKey(), calories: 0, workoutSeconds: 0, reps: 0, workoutsCompleted: 0 }; setDailyProgress(reset); saveDailyProgress(reset); saveToWeeklyHistory(reset); setWeeklyData(loadWeeklyProgress()); showToast('Daily progress reset!'); }}
    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center cursor-pointer transition-colors"><RotateCcw size={14} className="text-red-400" /></button>
  <button onClick={() => { setEditCalTarget(String(dailyTargets.calories)); setEditMinTarget(String(dailyTargets.workoutMin)); setEditRepTarget(String(dailyTargets.reps)); setEditingTargets(!editingTargets); }}
    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"><Edit3 size={14} className="text-gray-400" /></button>
</div>
                  </div>
                  <div className="px-5 pb-4 flex items-center justify-around">
                    <div className="flex flex-col items-center">
                      <div className="relative"><ProgressRing progress={(dailyProgress.calories / dailyTargets.calories) * 100} size={68} strokeWidth={5} color="#425b66" bgColor="rgba(255,77,0,0.15)" /><div className="absolute inset-0 flex items-center justify-center"><Flame size={16} className="text-[#425b66]" /></div></div>
                      <div className="mt-1.5 text-center"><div className="text-white font-extrabold text-base leading-tight">{dailyProgress.calories}</div><div className="text-gray-500 text-[9px]">/ {dailyTargets.calories} kcal</div></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative"><ProgressRing progress={(Math.floor(dailyProgress.workoutSeconds / 60) / dailyTargets.workoutMin) * 100} size={68} strokeWidth={5} color="#22c55e" bgColor="rgba(34,197,94,0.15)" /><div className="absolute inset-0 flex items-center justify-center"><Timer size={16} className="text-green-400" /></div></div>
                      <div className="mt-1.5 text-center"><div className="text-white font-extrabold text-base leading-tight">{Math.floor(dailyProgress.workoutSeconds / 60)}</div><div className="text-gray-500 text-[9px]">/ {dailyTargets.workoutMin} min</div></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative"><ProgressRing progress={(dailyProgress.reps / dailyTargets.reps) * 100} size={68} strokeWidth={5} color="#3b82f6" bgColor="rgba(59,130,246,0.15)" /><div className="absolute inset-0 flex items-center justify-center"><RotateCcw size={16} className="text-blue-400" /></div></div>
                      <div className="mt-1.5 text-center"><div className="text-white font-extrabold text-base leading-tight">{dailyProgress.reps}</div><div className="text-gray-500 text-[9px]">/ {dailyTargets.reps} reps</div></div>
                    </div>
                  </div>
                  {/* Weekly Mini Chart */}
                  <div className="mx-5 mb-4">
                    <div className="flex items-center gap-1.5 mb-2"><BarChart3 size={12} className="text-gray-500" /><span className="text-gray-400 text-[10px] font-semibold">This Week</span></div>
                    <div className="flex items-end gap-1.5 h-12">
                      {weeklyData.map((d, i) => {
                        const maxCal = Math.max(...weeklyData.map(w => w.calories), dailyTargets.calories);
                        const height = maxCal > 0 ? Math.max(4, (d.calories / maxCal) * 48) : 4;
                        const isToday = i === weeklyData.length - 1;
                        return (
                          <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full rounded-sm transition-all duration-500" style={{ height: `${height}px`, backgroundColor: isToday ? '#425b66' : d.calories > 0 ? 'rgba(255,77,0,0.3)' : 'rgba(255,255,255,0.08)' }} />
                            <span className={`text-[8px] ${isToday ? 'text-[ #ff4d00] font-bold' : 'text-gray-500'}`}>{d.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Edit Targets Panel */}
                  {editingTargets && (
                    <div className="mx-5 mb-4 bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-2"><CalendarDays size={14} className="text-[#ff4d00]" /><span className="text-white text-sm font-bold">Set Your Targets</span></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><label className="text-gray-400 text-[10px] font-semibold mb-1 block">Calories</label><input type="number" value={editCalTarget} onChange={(e) => setEditCalTarget(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-white/10 text-white text-sm text-center outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" /><span className="text-gray-500 text-[9px]">kcal</span></div>
                        <div><label className="text-gray-400 text-[10px] font-semibold mb-1 block">Workout</label><input type="number" value={editMinTarget} onChange={(e) => setEditMinTarget(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-white/10 text-white text-sm text-center outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" /><span className="text-gray-500 text-[9px]">minutes</span></div>
                        <div><label className="text-gray-400 text-[10px] font-semibold mb-1 block">Reps</label><input type="number" value={editRepTarget} onChange={(e) => setEditRepTarget(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-white/10 text-white text-sm text-center outline-none border border-white/10 focus:border-[#ff4d00] transition-colors" /><span className="text-gray-500 text-[9px]">reps</span></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingTargets(false)} className="flex-1 py-2 rounded-lg bg-white/10 text-gray-400 text-xs font-semibold cursor-pointer hover:bg-white/15 transition-colors">Cancel</button>
                        <button onClick={saveTargetEdits} className="flex-1 py-2 rounded-lg text-white text-xs font-bold cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(255,77,0,0.3)]" style={{ backgroundColor: '#ff4d00' }}>Save Targets</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${selectedCategory === cat ? 'bg-[#ff4d00] text-white shadow-md shadow-[#ff4d00]/30' : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/10'}`}>
                      {React.createElement(categoryIcons[cat] || HomeIcon, { size: 14 })} {cat}
                    </button>
                  ))}
                </div>

                {/* Difficulty Filter */}
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                    <button key={d} onClick={() => setDifficultyFilter(d)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${difficultyFilter === d ? 'bg-[#ff4d00]/80 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/15 border border-white/10'}`}>
                      {d}
                    </button>
                  ))}
                </div>

                {/* Premium Upgrade Banner */}
                {!isPremium && (
                  <div className="rounded-xl py-2.5 px-3 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                    <Crown size={18} className="text-yellow-400 shrink-0" />
                    <p className="text-white text-xs font-semibold flex-1 min-w-0">Unlock 150+ Exercises & AI Coaching</p>
                    <button onClick={() => setShowPaymentModal(true)}
                      className="px-3 py-1.5 rounded-lg text-white font-bold text-[10px] cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(255,77,0,0.4)] whitespace-nowrap flex items-center gap-1 shrink-0"
                      style={{ backgroundColor: '#ff4d00' }}><Sparkles size={10} /> Pro</button>
                  </div>
                )}

                {/* Exercise Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {filteredExercises.map((ex) => (
                    <button key={ex.id} onClick={() => handleExerciseClick(ex)}
                      className={`relative p-3 rounded-xl text-left cursor-pointer transition-all active:scale-[0.97] ${ex.premium && !isPremium ? 'opacity-80' : ''} bg-white/5 border border-white/10 hover:border-[#ff4d00]/50 hover:bg-white/10`}>
                      {ex.premium && !isPremium && (
                        <div className="absolute top-2 right-2 flex items-center gap-0.5"><Lock size={10} className="text-gray-400" /><span className="text-[10px] font-bold text-[#ff4d00] bg-[#ff4d00]/10 px-1.5 py-0.5 rounded-full">PRO</span></div>
                      )}
                      {ex.premium && isPremium && (
                        <div className="absolute top-2 right-2 flex items-center gap-0.5"><Crown size={10} className="text-yellow-400" /><span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-full">PRO</span></div>
                      )}
                      <div className="mb-0.5 text-[ #ff4d00]">{getCategoryIcon(ex.category, 18)}</div>
                      <div className="font-semibold text-xs text-white leading-tight pr-7">{ex.name}</div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${getDifficultyColor(ex.difficulty)}`}>{ex.difficulty.charAt(0).toUpperCase() + ex.difficulty.slice(1)}</span>
                        <span className="text-[9px] text-gray-500">{ex.caloriesPerMin}k/m</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Workout Active UI */}
                <div className="relative rounded-xl overflow-hidden" style={{ background: '#1a1a2e' }}>
                  <div className="relative w-full" style={{ minHeight: '200px' }}>
                    <video ref={videoRef} className="w-full h-auto rounded-xl" style={{ transform: 'scaleX(-1)', maxHeight: '40vh', objectFit: 'cover' }} autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" style={{ transform: 'scaleX(-1)' }} />
                    {/* Model Loading Overlay */}
                    {(modelLoading || loadingStep === 4) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]/90 backdrop-blur-md z-10">
                        <div className="text-center px-4 max-w-xs">
                          <div className="relative mx-auto w-20 h-20 mb-5">
                            <div className="absolute inset-0 rounded-full bg-[ #ff4d00]/20 animate-ping" style={{ animationDuration: '2s' }} />
                            <div className="absolute inset-2 rounded-full bg-[ #ff4d00]/30 animate-pulse" />
                            <div className="absolute inset-3 rounded-full bg-[ #1a1a2e] flex items-center justify-center">
                              {loadingStep === 4 ? <CheckCircle2 size={28} className="text-green-400 animate-bounce" /> : <Brain size={28} className="text-[#ff4d00]" />}
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-white font-bold text-base mb-1">{loadingStep === 4 ? 'Ready!' : LOADING_STEPS[Math.min(loadingStep, 3) - 1]?.label || 'Initializing...'}</p>
                            <p className="text-gray-400 text-xs">{loadingStep === 4 ? 'AI coach is watching your form' : 'Setting up your AI workout coach'}</p>
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-5">
                            {LOADING_STEPS.map((step, i) => (
                              <div key={step.key} className="flex items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${loadingStep > i + 1 || loadingStep === 4 ? 'bg-green-500/20 text-green-400' : loadingStep === i + 1 ? 'bg-[#ff4d00]/20 text-[#ff4d00] scale-110' : 'bg-white/5 text-gray-500'}`}>
                                  {loadingStep > i + 1 || loadingStep === 4 ? <CheckCircle2 size={14} /> : loadingStep === i + 1 ? <Loader2 size={14} className="animate-spin" /> : <step.icon size={12} />}
                                </div>
                                {i < LOADING_STEPS.length - 1 && <div className={`w-4 h-0.5 mx-1 rounded-full transition-all duration-500 ${loadingStep > i + 1 ? 'bg-green-500/50' : 'bg-white/10'}`} />}
                              </div>
                            ))}
                          </div>
                          {loadingStep < 4 && (
                            <div className="bg-white/5 rounded-xl px-4 py-2.5 flex items-center gap-2 transition-opacity duration-500" key={loadingTip}>
                              {React.createElement(LOADING_TIPS[loadingTip]?.icon || Flame, { size: 14, className: 'text-[#ff4d00] shrink-0' })}
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
                      <span className="text-[ #ff4d00] shrink-0">{getCategoryIcon(currentExercise?.category || 'Home', 12)}</span>
                      <span className="text-white font-bold text-xs truncate">{currentExercise?.name}</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${getDifficultyColor(currentExercise?.difficulty || 'easy')}`}>{currentExercise?.difficulty?.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><RotateCcw size={9} /> Reps</div>
                    <div className="text-2xl font-extrabold text-[ #ff4d00]">{repCount}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><Timer size={9} /> Time</div>
                    <div className="text-xl font-extrabold text-white">{timer}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><Flame size={9} /> Calories</div>
                    <div className="text-2xl font-extrabold text-green-400">{caloriesBurned}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5"><Activity size={9} /> Angle</div>
                    <div className="text-2xl font-extrabold text-white">{currentAngles[currentExercise?.track || 'knee'] || '\u2014'}°</div>
                  </div>
                </div>

                {/* AI Coach Feedback */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bot size={16} className="text-[ #ff4d00]" />
                    <h3 className="font-bold text-xs text-white">AI Coach</h3>
                    {isPremium && <span className="text-[9px] font-bold text-[#ff4d00] bg-[#ff4d00]/10 px-1.5 py-0.5 rounded-full">LIVE</span>}
                  </div>
                  <p className="text-xs text-gray-300 whitespace-pre-line">{coachFeedback || 'Start moving to get feedback...'}</p>
                  {!isPremium && <button onClick={() => setShowPaymentModal(true)} className="mt-1.5 text-[10px] text-[#ff4d00] font-semibold hover:underline cursor-pointer flex items-center gap-0.5">Unlock AI Coaching <ChevronRight size={10} /></button>}
                </div>

                {/* AI Voice Coach Toggle */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${voiceEnabled && isPremium ? 'bg-[ #ff4d00]/10' : 'bg-white/10'}`}>
                        {voiceEnabled && isPremium ? <Volume2 size={16} className="text-[ #ff4d00]" /> : <VolumeX size={16} className="text-gray-400" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white">Voice Coach</span>
                          {!isPremium && <span className="flex items-center gap-0.5 text-[9px] font-bold text-[ #ff4d00] bg-[ #ff4d00]/10 px-1 py-0.5 rounded-full"><Lock size={7} /> PRO</span>}
                        </div>
                        <span className="text-[10px] text-gray-500">{voiceEnabled && isPremium ? 'Active' : 'Tap to enable'}</span>
                      </div>
                    </div>
                    <button onClick={toggleVoice}
                      className={`relative w-11 h-6 rounded-full cursor-pointer transition-all ${voiceEnabled && isPremium ? 'shadow-[0_2px_8px_rgba(255,77,0,0.4)]' : ''}`}
                      style={{ backgroundColor: voiceEnabled && isPremium ? '#ff4d00' : '#374151' }}>
                      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                        style={{ left: voiceEnabled && isPremium ? '1.2rem' : '0.125rem' }} />
                    </button>
                  </div>
                  {voiceEnabled && isPremium && (
                    <div className="mt-2 flex items-center gap-1.5 bg-green-400/10 rounded-lg p-1.5">
                      <Mic size={10} className="text-green-400" />
                      <span className="text-[10px] text-green-400 font-medium">Voice active \u2014 Coach will speak cues</span>
                    </div>
                  )}
                </div>

                {/* Stop Button */}
                <button onClick={stopWorkout}
                  className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-base cursor-pointer transition-all active:scale-[0.97] hover:bg-red-600 hover:shadow-lg flex items-center justify-center gap-2">
                  <Square size={16} /> Stop Workout
                </button>
              </>
            )}
          </div>
        )}

        {/* ==================== DIET TAB ==================== */}
        {activeTab === 'diet' && (
          <div className="space-y-4 px-3 pt-3 pb-8">
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="px-5 pt-5 pb-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[ #16abd8]/20 flex items-center justify-center"><Utensils size={16} className="text-[#ff4d00]" /></div>
                <h2 className="text-sm font-bold text-white">Diet Plan Generator</h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 px-5">Get a personalized diet plan based on your workout session.</p>
              {currentExercise && (
                <div className="flex items-center gap-2 mb-4 mx-5 bg-white/5 rounded-xl p-3">
                  <span className="text-[ #ff4d00]">{getCategoryIcon(currentExercise.category, 16)}</span>
                  <span className="text-sm font-medium text-gray-300">{currentExercise.name}</span>
                  <span className="text-xs text-gray-500">\u2022 {repCount} reps \u2022 {caloriesBurned} kcal burned</span>
                </div>
              )}
              <div className="px-5 pb-5">
                <button onClick={getDietPlan} disabled={dietLoading}
                  className="w-full py-3 rounded-xl text-white font-bold text-base cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(255,77,0,0.35)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#c43957' }}>
                  {dietLoading ? (<span className="flex items-center justify-center gap-2"><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating Plan...</span>) : (<><Utensils size={16} /> Get Diet Plan</>)}
                </button>
              </div>
              {dietPlan && (
                <div className="mx-5 mb-5 bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white mb-2">Your Diet Plan</h3>
                  <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{dietPlan}</div>
                </div>
              )}
            </div>

            {/* Diet Analysis */}
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="flex items-center gap-2 mb-3 px-5 pt-5">
                <div className="w-8 h-8 rounded-lg bg-[ #2b5e8e]/20 flex items-center justify-center"><Microscope size={16} className="text-[ #e01b14]" /></div>
                <h2 className="text-sm font-bold text-white">Analyze Your Diet</h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 px-5">Enter your meals to get a detailed nutritional breakdown.</p>
          <div className="px-5">
          <textarea value={mealInput} onChange={(e) => setMealInput(e.target.value)}
                placeholder="e.g., 2 roti, dal, rice, curd, 1 banana..."
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-gray-500 outline-none resize-none focus:border-[ #09e355] transition-colors" rows={3} />
              </div>
              <div className="px-5 pb-5">
                <button onClick={analyzeDiet} disabled={analyzeLoading || !mealInput.trim()}
                  className="w-full mt-3 py-3 rounded-xl text-white font-bold text-base cursor-pointer transition-all hover:shadow-[0_8px_28px_rgba(255,77,0,0.35)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: ' #c43957' }}>
                  {analyzeLoading ? (<span className="flex items-center justify-center gap-2"><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Analyzing...</span>) : (<><Microscope size={16} /> Analyze Diet</>)}
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
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (dietAnalysis.protein / dietAnalysis.goalProtein) * 100)}%`, backgroundColor: dietAnalysis.protein >= dietAnalysis.goalProtein ? '#22c55e' : '#ff4d00' }} /></div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-300">Calorie Goal</span><span className="text-gray-500">{dietAnalysis.calories} / {dietAnalysis.goalCalories} kcal</span></div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (dietAnalysis.calories / dietAnalysis.goalCalories) * 100)}%`, backgroundColor: dietAnalysis.calories >= dietAnalysis.goalCalories ? '#22c55e' : '#ff4d00' }} /></div>
      </div>
    </div>

    {dietAnalysis.items && dietAnalysis.items.length > 0 && (
      <div className="rounded-xl overflow-hidden border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
          <Utensils size={12} className="text-[#ff4d00]" />
          <span className="text-white text-[11px] font-bold">Food Breakdown</span>
        </div>
        {dietAnalysis.items.map((item, i) => (
          <div key={i} className="px-3 py-2 flex items-center justify-between border-b border-white/5 last:border-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-white text-[11px] font-semibold capitalize truncate">{item.name}</span>
              <span className="text-gray-500 text-[9px] shrink-0">{item.quantity}{item.unit !== 'piece' ? ' ' + item.unit : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] shrink-0">
              <span className="text-orange-400 font-bold">{item.cal}cal</span>
              <span className="text-green-400">P:{item.protein}g</span>
              <span className="text-blue-400">C:{item.carbs}g</span>
              <span className="text-yellow-400">F:{item.fat}g</span>
            </div>
          </div>
        ))}
      </div>
    )}

    {dietAnalysis.unmatched && dietAnalysis.unmatched.length > 0 && (
      <div className="rounded-xl p-3 bg-red-400/10 border border-red-400/20">
        <p className="text-red-400 text-[11px] font-semibold">Not found: {dietAnalysis.unmatched.join(', ')}</p>
        <p className="text-gray-400 text-[9px] mt-1">Try: "dal", "rice", "chicken", "roti", "paneer", "egg", "rajma", "biryani"</p>
      </div>
    )}

    <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
      <p className="text-xs text-gray-300 flex items-start gap-1"><Sparkles size={12} className="text-[#ff4d00] mt-0.5 shrink-0" />{dietAnalysis.suggestionEn}</p>
      <p className="text-xs text-gray-500 flex items-start gap-1"><ChevronRight size={12} className="text-gray-400 mt-0.5 shrink-0" />{dietAnalysis.suggestionHi}</p>
    </div>
  </div>
)}
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}
        onUpgrade={() => { setIsPremium(true); showToast('Welcome to FitCoach Pro! All exercises unlocked.'); }} />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 z-50 animate-bounce" style={{ bottom: '2rem' }}>
          <div className="px-4 py-2.5 rounded-xl text-white font-semibold text-xs shadow-xl flex items-center gap-1.5" style={{ backgroundColor: '#ff4d00' }}>
            <Sparkles size={12} /> {toast}
          </div>
        </div>
      )}
    </div>
  );
}