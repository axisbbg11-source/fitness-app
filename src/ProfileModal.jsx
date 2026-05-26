import React, { useState, useEffect } from 'react';
import {
  X, Crown, Flame, Trophy, Target, Zap, Star,
  Award, Shield, TrendingUp, Calendar, Dumbbell,
  Edit3, CheckCircle2, Sun, Moon, User, Lock,
  ChevronRight, BarChart2, Activity,
} from 'lucide-react';

const BADGES = [
  { id: 'first-rep', icon: Zap, label: 'First Rep', desc: 'Completed your first workout', color: '#f97316', bg: 'rgba(249,115,22,0.12)', condition: (p) => p.reps >= 1 },
  { id: 'calorie-starter', icon: Flame, label: 'On Fire', desc: 'Burned 100+ calories in a day', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', condition: (p) => p.calories >= 100 },
  { id: 'calorie-crusher', icon: Flame, label: 'Calorie Crusher', desc: 'Burned 300+ calories', color: '#dc2626', bg: 'rgba(220,38,38,0.12)', condition: (p) => p.calories >= 300 },
  { id: 'rep-50', icon: Target, label: 'Rep Rookie', desc: '50 reps in a day', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', condition: (p) => p.reps >= 50 },
  { id: 'rep-100', icon: TrendingUp, label: 'Century Club', desc: '100 reps in a day', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', condition: (p) => p.reps >= 100 },
  { id: 'streak-3', icon: Calendar, label: '3-Day Streak', desc: 'Worked out 3 days in a row', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', condition: (_, s) => s.current >= 3 },
  { id: 'streak-7', icon: Star, label: 'Week Warrior', desc: '7-day streak achieved', color: '#eab308', bg: 'rgba(234,179,8,0.12)', condition: (_, s) => s.current >= 7 },
  { id: 'goal-hit', icon: CheckCircle2, label: 'Goal Crusher', desc: 'Hit daily calorie target', color: '#10b981', bg: 'rgba(16,185,129,0.12)', condition: (p, _, t) => p.calories >= t.calories },
  { id: 'workout-5', icon: Dumbbell, label: 'Gym Rat', desc: 'Completed 5 workouts', color: '#f97316', bg: 'rgba(249,115,22,0.12)', condition: (p) => p.workoutsCompleted >= 5 },
  { id: 'pro', icon: Crown, label: 'Pro Member', desc: 'Upgraded to FitCoach Pro', color: '#eab308', bg: 'rgba(234,179,8,0.12)', condition: (_, __, ___, ip) => ip },
  { id: 'minutes-30', icon: Shield, label: 'Endurance', desc: '30+ minutes workout', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', condition: (p) => Math.floor(p.workoutSeconds / 60) >= 30 },
  { id: 'award-all', icon: Award, label: 'Overachiever', desc: 'Hit all 3 daily targets', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', condition: (p, _, t) => p.calories >= t.calories && p.reps >= t.reps && Math.floor(p.workoutSeconds / 60) >= t.workoutMin },
];

export default function ProfileModal({ isOpen, onClose, firebaseUser, isPremium, dailyProgress, streak, dailyTargets, isDark, onToggleTheme }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!isOpen) return;
    const saved = JSON.parse(localStorage.getItem('fitcoach-profile') || '{}');
    setDisplayName(saved.displayName || firebaseUser?.displayName || '');
    setBio(saved.bio || '');
    setWeight(saved.weight || '');
    setHeight(saved.height || '');
    setAge(saved.age || '');
    setGoal(saved.goal || '');
  }, [isOpen, firebaseUser]);

  const saveProfile = () => {
    localStorage.setItem('fitcoach-profile', JSON.stringify({ displayName, bio, weight, height, age, goal }));
    setEditing(false);
  };

  const earnedBadges = BADGES.filter(b => b.condition(dailyProgress, streak, dailyTargets, isPremium));
  const lockedBadges = BADGES.filter(b => !b.condition(dailyProgress, streak, dailyTargets, isPremium));

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : null;
  const getBmiInfo = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: '#3b82f6', pct: 15 };
    if (b < 25) return { label: 'Healthy', color: '#22c55e', pct: 38 };
    if (b < 30) return { label: 'Overweight', color: '#f97316', pct: 65 };
    return { label: 'Obese', color: '#ef4444', pct: 88 };
  };
  const bmiInfo = bmi ? getBmiInfo(parseFloat(bmi)) : null;

  const D = isDark ? {
    bg: '#0f1629',
    surface: '#1a2540',
    card: '#1e2d4a',
    border: 'rgba(255,255,255,0.07)',
    text: '#f1f5f9',
    sub: '#94a3b8',
    muted: '#64748b',
    input: '#162035',
    inputBorder: 'rgba(99,102,241,0.3)',
    overlay: 'rgba(0,0,0,0.75)',
    tabBg: '#162035',
    tabActive: '#4f46e5',
  } : {
    bg: '#f8faff',
    surface: '#ffffff',
    card: '#f0f4ff',
    border: 'rgba(0,0,0,0.07)',
    text: '#0f172a',
    sub: '#475569',
    muted: '#94a3b8',
    input: '#ffffff',
    inputBorder: 'rgba(99,102,241,0.35)',
    overlay: 'rgba(15,23,42,0.5)',
    tabBg: '#e8ecf8',
    tabActive: '#4f46e5',
  };

  if (!isOpen) return null;

  const caloriesPct = Math.min(100, Math.round((dailyProgress.calories / dailyTargets.calories) * 100));
  const minPct = Math.min(100, Math.round((Math.floor(dailyProgress.workoutSeconds / 60) / dailyTargets.workoutMin) * 100));
  const repsPct = Math.min(100, Math.round((dailyProgress.reps / dailyTargets.reps) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: D.overlay }} onClick={onClose} />

      <div className="relative w-full max-w-md flex flex-col rounded-t-[28px] sm:rounded-[24px]"
        style={{ background: D.bg, maxHeight: '94vh', boxShadow: isDark ? '0 -12px 60px rgba(0,0,0,0.7)' : '0 -12px 60px rgba(79,70,229,0.18)' }}>

        {/* Pull bar */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: D.border }} />
        </div>

        {/* ── TOP HEADER ── */}
        <div className="px-5 pt-3 pb-4 flex items-center justify-between shrink-0">
          <span className="text-base font-bold" style={{ color: D.text }}>Profile</span>
          <div className="flex items-center gap-2">
            <button onClick={onToggleTheme}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: D.card, border: `1px solid ${D.border}` }}>
              {isDark ? <Sun size={14} color="#eab308" /> : <Moon size={14} color="#6366f1" />}
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: D.card, border: `1px solid ${D.border}` }}>
              <X size={14} color={D.sub} />
            </button>
          </div>
        </div>

        {/* ── HERO SECTION ── */}
        <div className="px-5 pb-4 shrink-0">
          <div className="rounded-2xl p-4" style={{ background: D.surface, border: `1px solid ${D.border}` }}>
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                {firebaseUser?.photoURL ? (
                  <img src={firebaseUser.photoURL} alt=""
                    className="w-[60px] h-[60px] rounded-2xl object-cover"
                    style={{ border: `2.5px solid #4f46e5` }} />
                ) : (
                  <div className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-xl font-black"
                    style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }}>
                    {(displayName || firebaseUser?.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                {isPremium && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-lg flex items-center justify-center"
                    style={{ background: '#eab308' }}>
                    <Crown size={10} color="#fff" />
                  </div>
                )}
              </div>

              {/* Name / email */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-sm truncate" style={{ color: D.text }}>
                    {displayName || firebaseUser?.displayName || 'Athlete'}
                  </p>
                  {isPremium && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>PRO</span>
                  )}
                </div>
                <p className="text-xs truncate" style={{ color: D.muted }}>{firebaseUser?.email || 'No email'}</p>
                {bio && <p className="text-[11px] mt-1 truncate" style={{ color: D.sub }}>{bio}</p>}
                {goal && (
                  <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(79,70,229,0.12)', color: '#818cf8' }}>{goal}</span>
                )}
              </div>

              {/* Edit button */}
              <button onClick={() => setEditing(!editing)}
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: editing ? '#4f46e5' : D.card, border: `1px solid ${editing ? '#4f46e5' : D.border}` }}>
                <Edit3 size={13} color={editing ? '#fff' : D.sub} />
              </button>
            </div>

            {/* 3 stat pills */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { label: 'Streak', val: `${streak.current}d`, color: '#a855f7', icon: Zap },
                { label: 'Best', val: `${streak.best}d`, color: '#eab308', icon: Trophy },
                { label: 'Workouts', val: dailyProgress.workoutsCompleted, color: '#22c55e', icon: Dumbbell },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-2 text-center"
                  style={{ background: D.card }}>
                  <s.icon size={12} style={{ color: s.color, margin: '0 auto 3px' }} />
                  <div className="text-sm font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[9px] font-medium" style={{ color: D.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EDIT FORM ── */}
        {editing && (
          <div className="px-5 pb-3 shrink-0">
            <div className="rounded-2xl p-4 space-y-3" style={{ background: D.surface, border: `1px solid ${D.border}` }}>
              <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: D.muted }}>Edit Profile</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Display Name', val: displayName, set: setDisplayName, ph: 'Your name', col: 2, type: 'text' },
                  { label: 'Bio', val: bio, set: setBio, ph: 'About you...', col: 2, type: 'text' },
                  { label: 'Age', val: age, set: setAge, ph: '25', col: 1, type: 'number' },
                  { label: 'Weight (kg)', val: weight, set: setWeight, ph: '70', col: 1, type: 'number' },
                  { label: 'Height (cm)', val: height, set: setHeight, ph: '175', col: 1, type: 'number' },
                ].map(f => (
                  <div key={f.label} style={{ gridColumn: `span ${f.col}` }}>
                    <label className="text-[10px] font-semibold mb-1 block" style={{ color: D.sub }}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                      className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                      style={{ background: D.input, border: `1px solid ${D.inputBorder}`, color: D.text }} />
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="text-[10px] font-semibold mb-1 block" style={{ color: D.sub }}>Fitness Goal</label>
                  <select value={goal} onChange={e => setGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs outline-none appearance-none"
                    style={{ background: D.input, border: `1px solid ${D.inputBorder}`, color: D.text, colorScheme: isDark ? 'dark' : 'light' }}>
                    <option value="">Select goal</option>
                    {['Weight Loss','Muscle Gain','Flexibility','General Fitness','Endurance'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setEditing(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: D.card, border: `1px solid ${D.border}`, color: D.sub }}>Cancel</button>
                <button onClick={saveProfile}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: '#4f46e5' }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="px-5 pb-3 shrink-0">
          <div className="flex rounded-xl p-1 gap-1" style={{ background: D.tabBg }}>
            {[
              { key: 'overview', label: 'Overview', icon: Activity },
              { key: 'badges', label: `Badges ${earnedBadges.length}/${BADGES.length}`, icon: Award },
              { key: 'body', label: 'Body', icon: BarChart2 },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveSection(t.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: activeSection === t.key ? D.tabActive : 'transparent',
                  color: activeSection === t.key ? '#fff' : D.sub,
                }}>
                <t.icon size={11} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-8" style={{ scrollbarWidth: 'none' }}>

          {/* OVERVIEW TAB */}
          {activeSection === 'overview' && (
            <div className="space-y-3">
              {/* Today's progress */}
              <div className="rounded-2xl p-4" style={{ background: D.surface, border: `1px solid ${D.border}` }}>
                <p className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: D.muted }}>Today's Progress</p>
                <div className="space-y-3">
                  {[
                    { label: 'Calories', val: dailyProgress.calories, target: dailyTargets.calories, unit: 'kcal', pct: caloriesPct, color: '#f97316' },
                    { label: 'Workout Time', val: Math.floor(dailyProgress.workoutSeconds / 60), target: dailyTargets.workoutMin, unit: 'min', pct: minPct, color: '#22c55e' },
                    { label: 'Reps', val: dailyProgress.reps, target: dailyTargets.reps, unit: 'reps', pct: repsPct, color: '#4f46e5' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold" style={{ color: D.sub }}>{item.label}</span>
                        <span className="text-xs font-bold" style={{ color: D.text }}>
                          {item.val} <span style={{ color: D.muted }}>/ {item.target} {item.unit}</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: D.card }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.pct}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Total Calories', val: dailyProgress.calories, unit: 'kcal', color: '#f97316', icon: Flame },
                  { label: 'Total Reps', val: dailyProgress.reps, unit: 'reps', color: '#4f46e5', icon: Target },
                  { label: 'Active Time', val: `${Math.floor(dailyProgress.workoutSeconds / 60)}m`, unit: 'today', color: '#22c55e', icon: Activity },
                  { label: 'Workouts Done', val: dailyProgress.workoutsCompleted, unit: 'sessions', color: '#a855f7', icon: Dumbbell },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 flex items-center gap-2.5"
                    style={{ background: D.surface, border: `1px solid ${D.border}` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${s.color}15` }}>
                      <s.icon size={14} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="text-base font-black leading-none mb-0.5" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[9px]" style={{ color: D.muted }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BADGES TAB */}
          {activeSection === 'badges' && (
            <div className="space-y-3">
              {earnedBadges.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: D.muted }}>
                    Earned — {earnedBadges.length}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {earnedBadges.map(b => (
                      <div key={b.id} className="rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center"
                        style={{ background: b.bg, border: `1px solid ${b.color}25` }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: `${b.color}20` }}>
                          <b.icon size={16} style={{ color: b.color }} />
                        </div>
                        <span className="text-[10px] font-bold leading-tight" style={{ color: b.color }}>{b.label}</span>
                        <span className="text-[8px] leading-tight" style={{ color: D.sub }}>{b.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lockedBadges.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: D.muted }}>
                    Locked — {lockedBadges.length}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {lockedBadges.map(b => (
                      <div key={b.id} className="rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center"
                        style={{ background: D.card, border: `1px solid ${D.border}` }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: D.surface }}>
                          <Lock size={14} style={{ color: D.muted }} />
                        </div>
                        <span className="text-[10px] font-semibold leading-tight" style={{ color: D.muted }}>{b.label}</span>
                        <span className="text-[8px] leading-tight" style={{ color: D.muted }}>{b.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BODY TAB */}
          {activeSection === 'body' && (
            <div className="space-y-3">
              {/* Stats row */}
              {(weight || height || age) ? (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Weight', val: weight || '--', unit: 'kg', color: '#4f46e5' },
                    { label: 'Height', val: height || '--', unit: 'cm', color: '#06b6d4' },
                    { label: 'Age', val: age || '--', unit: 'yrs', color: '#a855f7' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-3 text-center"
                      style={{ background: D.surface, border: `1px solid ${D.border}` }}>
                      <div className="text-lg font-black" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[9px] font-semibold" style={{ color: D.muted }}>{s.unit}</div>
                      <div className="text-[9px]" style={{ color: D.sub }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* BMI */}
              {bmi && bmiInfo ? (
                <div className="rounded-2xl p-4" style={{ background: D.surface, border: `1px solid ${D.border}` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: D.muted }}>Body Mass Index</p>
                      <span className="text-3xl font-black" style={{ color: D.text }}>{bmi}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl mt-1"
                      style={{ background: `${bmiInfo.color}15`, color: bmiInfo.color }}>
                      {bmiInfo.label}
                    </span>
                  </div>
                  {/* Gradient bar */}
                  <div className="relative h-3 rounded-full overflow-hidden mb-2"
                    style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 30%, #f97316 65%, #ef4444 100%)' }}>
                    <div className="absolute top-0 h-full w-1 rounded-full bg-white shadow-lg"
                      style={{ left: `${bmiInfo.pct}%`, transform: 'translateX(-50%)' }} />
                  </div>
                  <div className="flex justify-between text-[9px]" style={{ color: D.muted }}>
                    <span>Underweight</span><span>Healthy</span><span>Over</span><span>Obese</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-6 flex flex-col items-center text-center"
                  style={{ background: D.surface, border: `1px solid ${D.border}` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: D.card }}>
                    <BarChart2 size={20} style={{ color: D.muted }} />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: D.text }}>No body data yet</p>
                  <p className="text-xs mb-3" style={{ color: D.sub }}>Add your weight and height to calculate BMI</p>
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ background: '#4f46e5' }}>
                    <Edit3 size={11} /> Add Stats
                  </button>
                </div>
              )}

              {/* Goal */}
              {goal && (
                <div className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: D.surface, border: `1px solid ${D.border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(79,70,229,0.12)' }}>
                    <Target size={18} color="#4f46e5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: D.muted }}>Fitness Goal</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: D.text }}>{goal}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: D.muted, marginLeft: 'auto' }} />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}