// ============================================================
// voiceCoaching.js
// Centralized voice coaching configuration for FitCoach AI.
// ============================================================

export const EXERCISE_VOICE_CONFIG = {

  // ─────────────────────────────────────────────────────────
  // HOME EXERCISES
  // ─────────────────────────────────────────────────────────

  'home-pushup': {
    track: 'elbow',
    downRange: [70, 100],
    upRange: [155, 180],
    goDownCue: ['Go down!', 'Lower your chest!', 'Down!'],
    goUpCue: ['Press up!', 'Push!', 'Extend!'],
    formTips: [
      'Keep your body straight like a plank!',
      'Elbows at 45 degrees, not flared out!',
      'Breathe out as you push up!',
      'Engage your core throughout!',
      'Lower your chest all the way down!',
    ],
  },

  'home-squat': {
    track: 'knee',
    downRange: [70, 100],
    upRange: [160, 180],
    goDownCue: ['Squat down!', 'Go lower!', 'Bend your knees!'],
    goUpCue: ['Stand up!', 'Drive through your heels!', 'Rise up!'],
    formTips: [
      'Keep your chest up and back straight!',
      'Push your knees out over your toes!',
      'Go as deep as you can comfortably!',
      'Weight should be on your heels!',
      'Keep your core tight!',
    ],
  },

  'home-lunge': {
    track: 'knee',
    downRange: [80, 100],
    upRange: [155, 180],
    goDownCue: ['Lunge down!', 'Step and lower!', 'Drop your knee!'],
    goUpCue: ['Rise up!', 'Push back up!', 'Stand tall!'],
    formTips: [
      'Keep your front knee above your ankle!',
      'Back knee should hover just above the floor!',
      'Keep your torso upright!',
      'Push through your front heel to stand!',
    ],
  },

  'home-burpees': {
    track: 'hip',
    downRange: [60, 100],
    upRange: [150, 180],
    goDownCue: ['Drop down!', 'Squat!', 'Get low!'],
    goUpCue: ['Jump up!', 'Explode up!', 'Jump!'],
    formTips: [
      'Land softly when you jump!',
      'Keep your core tight in the plank position!',
      'Full extension at the top of the jump!',
      'Breathe consistently!',
    ],
  },

  'home-jumpingjack': {
    track: 'shoulder',
    downRange: [10, 40],
    upRange: [140, 180],
    goDownCue: ['Arms down!', 'Come together!'],
    goUpCue: ['Arms up!', 'Jump wide!', 'Spread!'],
    formTips: [
      'Keep a consistent rhythm!',
      'Land with soft knees!',
      'Full arm extension overhead!',
    ],
  },

  'home-mountainclimbers': {
    track: 'knee',
    downRange: [50, 80],
    upRange: [140, 180],
    goDownCue: ['Drive the knee!', 'Knee to chest!', 'Pull in!'],
    goUpCue: ['Extend back!', 'Switch!', 'Drive the other knee!'],
    formTips: [
      'Keep your hips level!',
      'Maintain a straight plank position!',
      'Drive your knees as fast as you can!',
      'Keep your core engaged!',
    ],
  },

  'home-highknees': {
    track: 'hip',
    downRange: [140, 180],
    upRange: [60, 100],
    goDownCue: ['Drive up!', 'Knee up!', 'Higher!'],
    goUpCue: ['Switch!', 'Other knee!', 'Go!'],
    formTips: [
      'Drive your knees above hip level!',
      'Pump your arms for momentum!',
      'Land on the balls of your feet!',
    ],
  },

  'home-glutebridges': {
    track: 'hip',
    downRange: [140, 162],  // FIX 2: was [140,180] overlapping upRange
    upRange: [163, 180],    // FIX 2: was [150,180] overlapping downRange
    goDownCue: ['Lower down!', 'Hips down!'],
    goUpCue: ['Push your hips up!', 'Squeeze your glutes!', 'Lift!'],
    formTips: [
      'Squeeze your glutes hard at the top!',
      'Keep your feet flat on the floor!',
      "Don't arch your lower back!",
      'Drive through your heels!',
    ],
  },

  'home-plank': {
    track: 'spine',
    holdRange: [160, 180],
    holdCue: ['Hold that plank!', 'Stay tight!', 'Core engaged!', 'Keep going!'],
    formTips: [
      "Keep your hips level - don't let them drop!",
      'Engage your core like someone is about to punch you!',
      'Look at the floor, not forward!',
      'Squeeze your glutes!',
    ],
    isHold: true,
  },

  'home-wallsit': {
    track: 'knee',
    holdRange: [80, 100],
    holdCue: ['Hold it!', 'Stay low!', 'Burn through it!', "You've got this!"],
    formTips: [
      'Keep your back flat against the wall!',
      'Thighs should be parallel to the ground!',
      "Don't let your knees cave in!",
    ],
    isHold: true,
  },

  'home-bicyclecrunches': {
    track: 'elbow',
    downRange: [50, 90],
    upRange: [120, 180],
    goDownCue: ['Rotate!', 'Elbow to knee!', 'Twist!'],
    goUpCue: ['Switch sides!', 'Other elbow!', 'Rotate!'],
    formTips: [
      "Don't pull on your neck!",
      'Keep your lower back pressed to the floor!',
      'Extend the opposite leg fully!',
      'Slow and controlled beats fast and sloppy!',
    ],
  },

  'home-tuckjumps': {
    track: 'hip',
    downRange: [130, 180],
    upRange: [50, 90],
    goDownCue: ['Land soft!', 'Bend your knees!', 'Absorb!'],
    goUpCue: ['Tuck your knees!', 'Explode up!', 'Jump higher!'],
    formTips: [
      'Land with bent knees to absorb impact!',
      'Drive your knees to your chest!',
      'Use your arms to generate momentum!',
    ],
  },

  'home-tricepdips': {
    track: 'elbow',
    downRange: [70, 100],
    upRange: [155, 180],
    goDownCue: ['Dip down!', 'Lower slowly!', 'Go down!'],
    goUpCue: ['Press up!', 'Extend your arms!', 'Push!'],
    formTips: [
      'Keep your back close to the chair!',
      'Lower slowly for maximum burn!',
      "Don't let your shoulders shrug up!",
      'Keep your elbows pointing back, not out!',
    ],
  },

  'home-donkeykicks': {
    track: 'knee',
    downRange: [80, 110],
    upRange: [150, 180],
    goDownCue: ['Knee in!', 'Tuck!'],
    goUpCue: ['Kick back!', 'Extend!', 'Push up!'],
    formTips: [
      'Keep your hips square to the floor!',
      'Squeeze your glute at the top!',
      "Don't rotate your hip as you kick!",
    ],
  },

  'home-supermanhold': {
    track: 'spine',
    holdRange: [160, 180],
    holdCue: ['Hold it!', 'Squeeze your back!', 'Stay lifted!'],
    formTips: [
      'Lift your arms and legs simultaneously!',
      'Look down at the floor!',
      'Squeeze your glutes and back muscles!',
    ],
    isHold: true,
  },

  'home-inchworms': {
    track: 'hip',
    downRange: [60, 100],
    upRange: [150, 180],
    goDownCue: ['Walk your hands out!', 'Stretch forward!'],
    goUpCue: ['Walk back in!', 'Stand up!'],
    formTips: [
      'Keep your legs as straight as you can!',
      'Go as far as plank position!',
      'Engage your core throughout!',
    ],
  },

  'home-vups': {
    track: 'hip',
    downRange: [140, 180],
    upRange: [60, 100],
    goDownCue: ['Lower down!', 'Control!'],
    goUpCue: ['V up!', 'Reach for your toes!', 'Crunch up!'],
    formTips: [
      'Keep your legs straight!',
      'Reach your hands to your feet!',
      'Exhale as you crunch up!',
      "Lower slowly - don't crash down!",
    ],
  },

  // FIX 3: plankjacks converted to isHold (same range up/down = meaningless)
  'home-plankjacks': {
    track: 'hip',
    holdRange: [140, 180],
    holdCue: ['Keep jumping!', 'Feet wide then together!', 'Stay in plank!'],
    formTips: [
      "Keep your hips level - don't bounce them!",
      'Strong plank throughout!',
      'Land softly on your feet!',
    ],
    isHold: true,
  },

  'home-skaterjumps': {
    track: 'knee',
    downRange: [100, 140],
    upRange: [150, 180],
    goDownCue: ['Land and bend!', 'Absorb the landing!'],
    goUpCue: ['Leap to the side!', 'Jump!', 'Skate!'],
    formTips: [
      'Land on one foot at a time!',
      'Reach your opposite hand to your foot!',
      'Drive off explosively!',
    ],
  },

  'home-pikepushups': {
    track: 'elbow',
    downRange: [70, 100],
    upRange: [150, 180],
    goDownCue: ['Lower your head!', 'Bend!'],
    goUpCue: ['Press up!', 'Push!', 'Extend!'],
    formTips: [
      'Keep your hips high throughout!',
      'Your head should nearly touch the floor!',
      'This targets your shoulders heavily!',
    ],
  },

  'home-commandoplank': {
    track: 'elbow',
    downRange: [80, 120],
    upRange: [150, 180],
    goDownCue: ['Down to forearms!', 'Forearm plank!'],
    goUpCue: ['Press up to hands!', 'Up!'],
    formTips: [
      'Minimize hip rotation as you switch!',
      'Keep your core engaged throughout!',
      'Alternate which arm leads!',
    ],
  },

  'home-speedsquats': {
    track: 'knee',
    downRange: [80, 110],
    upRange: [155, 180],
    goDownCue: ['Down!', 'Squat!'],
    goUpCue: ['Up!', 'Explode!', 'Drive!'],
    formTips: [
      'Speed is key - keep moving!',
      "Don't sacrifice depth for speed!",
      'Land softly!',
    ],
  },

  // FIX 3: bearcrawl converted to isHold (continuous movement, same ranges)
  'home-bearcrawl': {
    track: 'knee',
    holdRange: [80, 120],
    holdCue: ['Keep crawling!', 'Move forward!', 'Stay low!'],
    formTips: [
      'Keep your knees just above the floor!',
      'Opposite arm and leg move together!',
      'Keep your back flat!',
    ],
    isHold: true,
  },

  // FIX 3: flutterkicks already isHold in original, keeping correct
  'home-flutterkicks': {
    track: 'hip',
    holdRange: [150, 180],
    holdCue: ['Keep kicking!', 'Small fast kicks!', 'Legs up!'],
    formTips: [
      'Keep your lower back pressed to the floor!',
      'Legs should stay low - about 6 inches up!',
      'Point your toes!',
    ],
    isHold: true,
  },

  'home-reverselunge': {
    track: 'knee',
    downRange: [80, 100],
    upRange: [155, 180],
    goDownCue: ['Step back and lower!', 'Lunge down!'],
    goUpCue: ['Drive forward!', 'Stand up!', 'Push!'],
    formTips: [
      'Step back far enough for 90 degree angles!',
      'Keep your front knee above your ankle!',
      'Chest stays tall throughout!',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // GYM EXERCISES
  // ─────────────────────────────────────────────────────────

  'gym-barbellsquat': {
    track: 'knee',
    downRange: [70, 100],
    upRange: [160, 180],
    goDownCue: ['Down!', 'Squat!', 'Descend!'],
    goUpCue: ['Drive up!', 'Push the floor!', 'Stand!'],
    formTips: [
      'Bar should sit on your upper traps!',
      'Keep your chest proud and back flat!',
      'Drive your knees out!',
      'Full depth - break parallel!',
      'Big breath before you descend!',
    ],
  },

  'gym-benchpress': {
    track: 'elbow',
    downRange: [75, 100],
    upRange: [150, 180],
    goDownCue: ['Lower the bar!', 'Control down!', 'Touch your chest!'],
    goUpCue: ['Press!', 'Drive!', 'Lock out!'],
    formTips: [
      'Feet flat on the floor!',
      'Retract your shoulder blades!',
      'Bar should touch your mid-chest!',
      'Keep your wrists straight!',
      "Don't bounce the bar off your chest!",
    ],
  },

  'gym-deadlift': {
    track: 'hip',
    downRange: [50, 90],
    upRange: [160, 180],
    goDownCue: ['Hinge at the hips!', 'Push your hips back!', 'Load the bar!'],
    goUpCue: ['Drive your hips forward!', 'Stand tall!', 'Lock out!'],
    formTips: [
      'Bar stays close to your body!',
      'Push the floor away, do not pull the bar!',
      'Keep your spine neutral!',
      'Engage your lats to protect your back!',
      'Lock out fully at the top!',
    ],
  },

  'gym-bicepcurl': {
    track: 'elbow',
    downRange: [155, 180],
    upRange: [40, 70],
    goDownCue: ['Lower slowly!', 'Extend down!', 'Negative!'],
    goUpCue: ['Curl up!', 'Squeeze at the top!', 'Flex!'],
    formTips: [
      "Don't swing your body - isolate the bicep!",
      'Full range of motion - extend fully at the bottom!',
      'Squeeze hard at the top!',
      "Control the negative - don't drop!",
      'Keep your elbows pinned at your sides!',
    ],
  },

  'gym-shoulderpress': {
    track: 'elbow',
    downRange: [80, 110],
    upRange: [155, 180],
    goDownCue: ['Lower to shoulders!', 'Down!'],
    goUpCue: ['Press overhead!', 'Drive up!', 'Lock out!'],
    formTips: [
      "Don't arch your lower back!",
      'Core tight throughout!',
      'Elbows slightly in front of the bar!',
      'Full lockout overhead!',
    ],
  },

  'gym-latpulldown': {
    track: 'elbow',
    downRange: [70, 100],
    upRange: [150, 180],
    goDownCue: ['Pull to chin!', 'Elbows down!', 'Squeeze your lats!'],
    goUpCue: ['Extend up!', 'Full stretch!', 'Arms up!'],
    formTips: [
      'Lean back slightly as you pull!',
      'Lead with your elbows!',
      'Squeeze your shoulder blades together at the bottom!',
      "Control the return - don't let the weight yank you!",
    ],
  },

  'gym-legpress': {
    track: 'knee',
    downRange: [70, 100],
    upRange: [155, 175],
    goDownCue: ['Lower the sled!', 'Control down!'],
    goUpCue: ['Press!', 'Drive!', 'Extend!'],
    formTips: [
      "Don't lock your knees out fully!",
      'Feet shoulder width apart!',
      'Control the negative!',
      'Keep your lower back pressed to the seat!',
    ],
  },

  'gym-row': {
    track: 'elbow',
    downRange: [155, 180],
    upRange: [60, 90],
    goDownCue: ['Extend forward!', 'Reach out!'],
    goUpCue: ['Row in!', 'Squeeze your back!', 'Pull!'],
    formTips: [
      'Lead the pull with your elbow!',
      'Squeeze your shoulder blades at the finish!',
      'Keep your back flat!',
      "Don't round your lower back!",
    ],
  },

  'gym-chestfly': {
    track: 'elbow',
    downRange: [120, 155],   // FIX: was [140,170] too close to upRange [160,180]
    upRange: [156, 180],
    goDownCue: ['Open wide!', 'Stretch your chest!', 'Lower!'],
    goUpCue: ['Bring it together!', 'Squeeze your chest!', 'Hug!'],
    formTips: [
      'Keep a slight bend in your elbows throughout!',
      'Feel the stretch in your chest at the bottom!',
      'Think of hugging a tree!',
      "Don't go too low - protect your shoulders!",
    ],
  },

  'gym-triceppushdown': {
    track: 'elbow',
    downRange: [155, 180],
    upRange: [70, 100],
    goDownCue: ['Push down!', 'Extend!', 'Lock out!'],
    goUpCue: ['Return up!', 'Control back!'],
    formTips: [
      'Keep your elbows pinned to your sides!',
      'Full extension at the bottom!',
      "Don't lean into the movement!",
      'Squeeze your triceps at the bottom!',
    ],
  },

  'gym-calfraise': {
    track: 'ankle',
    downRange: [70, 100],
    upRange: [130, 160],
    goDownCue: ['Lower your heels!', 'Full stretch!'],
    goUpCue: ['Rise up!', 'On your toes!', 'Squeeze!'],
    formTips: [
      'Full range of motion - all the way up and down!',
      'Pause at the top and squeeze your calf!',
      'Slow on the way down!',
    ],
  },

  'gym-legcurl': {
    track: 'knee',
    downRange: [155, 180],
    upRange: [60, 90],
    goDownCue: ['Extend down!', 'Lower!'],
    goUpCue: ['Curl up!', 'Hamstring squeeze!', 'Pull!'],
    formTips: [
      'Keep your hips pressed to the bench!',
      'Full curl - bring your heels to your glutes!',
      'Slow on the way down!',
    ],
  },

  'gym-legextension': {
    track: 'knee',
    downRange: [70, 100],
    upRange: [155, 180],
    goDownCue: ['Lower down!', 'Control!'],
    goUpCue: ['Extend!', 'Squeeze your quad!', 'Lock out!'],
    formTips: [
      'Full extension at the top!',
      "Don't swing the weight up!",
      'Slow controlled reps beat fast sloppy ones!',
    ],
  },

  'gym-lateralraise': {
    track: 'shoulder',
    downRange: [10, 30],
    upRange: [80, 100],
    goDownCue: ['Lower down!', 'Control!'],
    goUpCue: ['Raise to shoulder height!', 'Lift!', 'Up!'],
    formTips: [
      'Lead with your elbows, not your hands!',
      'Slight bend in the elbow throughout!',
      "Don't go above shoulder height!",
      'Control the negative!',
    ],
  },

  'gym-romaniandeadlift': {
    track: 'hip',
    downRange: [60, 90],
    upRange: [160, 180],
    goDownCue: ['Hinge back!', 'Push your hips back!'],
    goUpCue: ['Drive hips forward!', 'Stand!', 'Squeeze your glutes!'],
    formTips: [
      'Soft bend in the knees throughout!',
      'Feel the stretch in your hamstrings!',
      'Bar stays close to your legs!',
      'Keep your back perfectly flat!',
    ],
  },

  'gym-inclinepress': {
    track: 'elbow',
    downRange: [75, 100],
    upRange: [150, 180],
    goDownCue: ['Lower to upper chest!', 'Control!'],
    goUpCue: ['Press up!', 'Drive!', 'Extend!'],
    formTips: [
      'Bar touches your upper chest!',
      'Keep your shoulder blades retracted!',
      "Don't arch your back excessively!",
    ],
  },

  'gym-hacksquat': {
    track: 'knee',
    downRange: [70, 100],
    upRange: [155, 175],
    goDownCue: ['Descend!', 'Deep squat!'],
    goUpCue: ['Drive up!', 'Press!'],
    formTips: [
      'Feet higher on the plate = more glutes!',
      'Feet lower = more quads!',
      "Don't lock your knees fully!",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CARDIO EXERCISES
  // ─────────────────────────────────────────────────────────

  'cardio-burpees': {
    track: 'hip',
    downRange: [60, 100],
    upRange: [150, 180],
    goDownCue: ['Drop down!', 'Plank!', 'Squat!'],
    goUpCue: ['Jump up!', 'Explode!', 'Jump!'],
    formTips: [
      'Full extension at the top of the jump!',
      'Chest to floor on the push-up!',
      'Keep moving - speed is the goal!',
    ],
  },

  'cardio-boxjumps': {
    track: 'knee',
    downRange: [90, 130],
    upRange: [155, 180],
    goDownCue: ['Load up!', 'Bend your knees!', 'Prepare!'],
    goUpCue: ['Jump!', 'Explode!', 'Drive!'],
    formTips: [
      'Land softly with bent knees!',
      'Full hip extension at the top!',
      "Step down - don't jump down!",
      'Arms drive the jump!',
    ],
  },

  'cardio-squatjumps': {
    track: 'knee',
    downRange: [80, 110],
    upRange: [155, 180],
    goDownCue: ['Squat down!', 'Load!'],
    goUpCue: ['Jump!', 'Explode!', 'Fly!'],
    formTips: [
      'Land soft!',
      'Go straight into the next squat!',
      'Arms swing up as you jump!',
    ],
  },

  'cardio-splitjumps': {
    track: 'knee',
    downRange: [80, 100],
    upRange: [150, 180],
    goDownCue: ['Lunge down!', 'Low lunge!'],
    goUpCue: ['Jump and switch!', 'Explode!', 'Switch legs!'],
    formTips: [
      'Land in a perfect lunge!',
      'Both legs 90 degrees at the bottom!',
      'Use your arms for power!',
    ],
  },

  'cardio-plyopushups': {
    track: 'elbow',
    downRange: [70, 100],
    upRange: [150, 180],
    goDownCue: ['Lower down!', 'Control!'],
    goUpCue: ['Explode up!', 'Push hard!', 'Clap!'],
    formTips: [
      'Full push-up before the explosion!',
      'Land with soft elbows!',
      'Core tight throughout!',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // YOGA EXERCISES
  // ─────────────────────────────────────────────────────────

  'yoga-warrior1': {
    track: 'knee',
    holdRange: [85, 100],
    holdCue: ['Hold warrior 1!', 'Breathe deeply!', 'Root down!', 'Reach up tall!'],
    formTips: [
      'Front knee directly over your ankle!',
      'Back heel pressing firmly into the mat!',
      'Hips square to the front!',
      'Arms reaching to the sky!',
    ],
    isHold: true,
  },

  'yoga-warrior2': {
    track: 'knee',
    holdRange: [85, 100],
    holdCue: ['Hold warrior 2!', 'Arms strong!', 'Gaze forward!', 'Breathe!'],
    formTips: [
      'Front knee over your ankle!',
      'Back foot parallel to the short edge of the mat!',
      'Arms parallel to the floor!',
      'Sink deeper into your lunge!',
    ],
    isHold: true,
  },

  'yoga-chair': {
    track: 'knee',
    holdRange: [85, 105],
    holdCue: ['Hold chair pose!', 'Sink lower!', 'Arms up!', 'Breathe!'],
    formTips: [
      "Sit back like you're sitting into a chair!",
      'Keep your chest up!',
      'Arms parallel or overhead!',
      'Weight in your heels!',
    ],
    isHold: true,
  },

  'yoga-treepose': {
    track: 'knee',
    holdRange: [70, 110],
    holdCue: ['Hold tree pose!', 'Find your balance!', 'Breathe steady!', 'Root down!'],
    formTips: [
      'Press your foot into your thigh!',
      "Don't place your foot on your knee!",
      'Find a focus point for balance!',
      'Breathe slowly!',
    ],
    isHold: true,
  },

  'yoga-downwarddog': {
    track: 'hip',
    holdRange: [90, 130],
    holdCue: ['Hold down dog!', 'Press your heels!', 'Lengthen your spine!'],
    formTips: [
      'Press your hands firmly into the mat!',
      'Try to straighten your legs!',
      'Heels reaching toward the floor!',
      'Ears between your upper arms!',
    ],
    isHold: true,
  },

  'yoga-bridge': {
    track: 'hip',
    holdRange: [130, 160],
    holdCue: ['Hold bridge!', 'Squeeze your glutes!', 'Lift higher!'],
    formTips: [
      'Feet hip-width apart!',
      'Press through your heels!',
      'Shoulders stay on the mat!',
      'Clasp your hands under your hips!',
    ],
    isHold: true,
  },

  'yoga-cobrapose': {
    track: 'spine',
    holdRange: [140, 180],
    holdCue: ['Hold cobra!', 'Lift your chest!', 'Open your heart!'],
    formTips: [
      'Elbows slightly bent!',
      'Shoulder blades down and back!',
      "Don't strain your neck!",
      'Hips stay on the mat!',
    ],
    isHold: true,
  },

  'yoga-boat': {
    track: 'hip',
    holdRange: [80, 110],
    holdCue: ['Hold boat pose!', 'Core tight!', 'Balance!', 'Breathe!'],
    formTips: [
      'Keep your spine straight!',
      'Arms parallel to the floor!',
      'Balance on your sit bones!',
      'Legs as straight as you can!',
    ],
    isHold: true,
  },

  // ─────────────────────────────────────────────────────────
  // STRETCH EXERCISES
  // ─────────────────────────────────────────────────────────

  'stretch-hamstring': {
    track: 'knee',
    holdRange: [140, 180],
    holdCue: ['Hold the stretch!', 'Breathe into it!', 'Relax!', 'Let go of tension!'],
    formTips: [
      'Keep your back flat!',
      "Don't bounce - hold steady!",
      'Breathe deeply to deepen the stretch!',
    ],
    isHold: true,
  },

  'stretch-quad': {
    track: 'knee',
    holdRange: [40, 80],
    holdCue: ['Hold the quad stretch!', 'Feel the pull!', 'Breathe!'],
    formTips: [
      'Stand tall and keep your knees together!',
      'Use a wall for balance if needed!',
      "Don't arch your lower back!",
    ],
    isHold: true,
  },

  'stretch-hipflexor': {
    track: 'hip',
    holdRange: [100, 140],
    holdCue: ['Hold the lunge stretch!', 'Sink deeper!', 'Breathe!'],
    formTips: [
      'Front knee above ankle!',
      'Tuck your pelvis under slightly!',
      'Feel the stretch in your front hip!',
    ],
    isHold: true,
  },

  'stretch-shoulder': {
    track: 'shoulder',
    holdRange: [80, 130],
    holdCue: ['Hold!', 'Relax your shoulder!', 'Breathe into it!'],
    formTips: [
      'Keep the arm straight!',
      "Don't rotate your torso!",
      'Feel the stretch across your shoulder!',
    ],
    isHold: true,
  },

  'stretch-lunge': {
    track: 'knee',
    holdRange: [80, 100],
    holdCue: ['Hold the lunge!', 'Deep stretch!', 'Breathe!'],
    formTips: [
      'Front knee over ankle!',
      'Drop your back knee to the ground!',
      'Chest stays upright!',
    ],
    isHold: true,
  },

  // ─────────────────────────────────────────────────────────
  // STRENGTH EXERCISES
  // ─────────────────────────────────────────────────────────

  'strength-pullup': {
    track: 'elbow',
    downRange: [155, 180],
    upRange: [60, 90],
    goDownCue: ['Lower down!', 'Full extension!', 'Dead hang!'],
    goUpCue: ['Pull up!', 'Drive your elbows down!', 'Chin over bar!'],
    formTips: [
      'Full dead hang at the bottom!',
      'Lead with your chest, not your chin!',
      'Engage your lats - feel your back do the work!',
      'No kipping - strict form!',
      'Breathe out as you pull up!',
    ],
  },

  'strength-kettlebellswing': {
    track: 'hip',
    downRange: [60, 100],
    upRange: [150, 180],
    goDownCue: ['Hinge!', 'Push your hips back!', 'Swing back!'],
    goUpCue: ['Drive your hips forward!', 'Snap!', 'Hips through!'],
    formTips: [
      "It's a hip hinge, not a squat!",
      'Hips drive the swing - not your arms!',
      'Stand tall and squeeze your glutes at the top!',
      'Keep your back flat throughout!',
      'Bell should float at shoulder height!',
    ],
  },

  'strength-gobletsquat': {
    track: 'knee',
    downRange: [70, 100],
    upRange: [160, 180],
    goDownCue: ['Squat deep!', 'Down!', 'Elbows to knees!'],
    goUpCue: ['Stand up!', 'Drive through your heels!'],
    formTips: [
      'Hold the weight at your chest!',
      'Elbows push your knees out at the bottom!',
      'Chest stays tall!',
      'Heels on the floor!',
    ],
  },

  'strength-overheadpress': {
    track: 'elbow',
    downRange: [80, 110],
    upRange: [155, 180],
    goDownCue: ['Lower to shoulders!'],
    goUpCue: ['Press overhead!', 'Lock out!', 'Drive up!'],
    formTips: [
      "Don't lean back - brace your core!",
      'Full lockout overhead!',
      'Head through at the top!',
    ],
  },

  'strength-thruster': {
    track: 'knee',
    downRange: [70, 100],
    upRange: [155, 180],
    goDownCue: ['Squat down!', 'Front squat!'],
    goUpCue: ['Drive and press!', 'Explode into press!', 'Stand and press!'],
    formTips: [
      'The squat powers the press!',
      'Elbows high in the squat!',
      'Full lockout overhead!',
      'Continuous movement - no pause!',
    ],
  },

  'strength-renegaderow': {
    track: 'elbow',
    downRange: [155, 180],
    upRange: [60, 90],
    goDownCue: ['Lower the weight!', 'Place it down!'],
    goUpCue: ['Row up!', 'Elbow to ceiling!', 'Pull!'],
    formTips: [
      'Keep your hips perfectly square!',
      'Minimal rotation!',
      'Core braced throughout!',
      'Alternate sides!',
    ],
  },

  'strength-weightedlunge': {
    track: 'knee',
    downRange: [80, 100],
    upRange: [155, 180],
    goDownCue: ['Lunge down!', 'Drop your knee!'],
    goUpCue: ['Drive up!', 'Push!', 'Stand!'],
    formTips: [
      'Front knee tracks over toes!',
      'Keep the dumbbells at your sides!',
      'Chest stays tall!',
      'Big step for deeper stretch!',
    ],
  },
};

// ==================== UNIVERSAL MILESTONE CUES ====================
export const MILESTONE_CUES = {
  3:  ['Great start! Keep it up!', '3 reps - you are warming up!'],
  5:  ['5 reps! Nice work!', 'Halfway to 10 - keep pushing!'],
  10: ['10 reps! You are on fire!', 'Double digits - outstanding!'],
  15: ['15 reps! Beast mode!', 'Incredible stamina!'],
  20: ['20 reps! You are unstoppable!', 'Legend status - 20 reps!'],
  25: ['25 reps! Superhuman!', 'You are a machine!'],
  30: ['30 reps! Absolutely insane!', 'Unbelievable - 30 reps!'],
  40: ['40 reps! Legendary!'],
  50: ['50 reps! Absolutely elite!'],
};

export const ENCOURAGEMENT_CUES = [
  'Keep going, you got this!',
  'Stay strong!',
  'Push through it!',
  "Don't give up!",
  "You're stronger than you think!",
  'Focus on your form!',
  'Breathe in, breathe out!',
  'Almost there, keep pushing!',
  'Every rep counts!',
  "You're doing amazing!",
];

export const START_CUES = [
  "Let's go! Start your exercise!",
  'Ready? Begin!',
  "Let's crush this workout!",
  '3, 2, 1, go!',
  "You've got this - let's move!",
];

export const COMPLETE_CUES = [
  'Workout complete! Amazing effort!',
  'Great session! You should be proud!',
  "That's a wrap! Well done!",
  'Fantastic work today!',
];

export function inRange(angle, range) {
  if (!range || range.length < 2) return false;
  return angle >= range[0] && angle <= range[1];
}

export function getVoiceConfig(exerciseId) {
  if (EXERCISE_VOICE_CONFIG[exerciseId]) {
    return EXERCISE_VOICE_CONFIG[exerciseId];
  }
  const prefix = exerciseId?.split('-')[0];
  return GENERIC_FALLBACKS[prefix] || GENERIC_FALLBACKS.default;
}

const GENERIC_FALLBACKS = {
  home: {
    track: 'knee',
    downRange: [80, 110],
    upRange: [155, 180],
    goDownCue: ['Go down!'],
    goUpCue: ['Come up!'],
    formTips: ['Focus on your form!', 'Breathe consistently!'],
  },
  gym: {
    track: 'elbow',
    downRange: [75, 110],
    upRange: [150, 180],
    goDownCue: ['Lower the weight!'],
    goUpCue: ['Push!', 'Lift!'],
    formTips: ['Control the movement!', "Don't swing the weight!"],
  },
  cardio: {
    track: 'hip',
    downRange: [80, 120],
    upRange: [150, 180],
    goDownCue: ['Go!'],
    goUpCue: ['Drive!'],
    formTips: ['Keep moving!', 'Breathe!'],
  },
  yoga: {
    track: 'hip',
    holdRange: [80, 130],
    holdCue: ['Hold!', 'Breathe!', 'Stay!'],
    formTips: ['Breathe into the pose!', 'Listen to your body!'],
    isHold: true,
  },
  stretch: {
    track: 'knee',
    holdRange: [130, 180],
    holdCue: ['Hold the stretch!', 'Relax into it!', 'Breathe!'],
    formTips: ["Don't bounce!", 'Breathe deeply!'],
    isHold: true,
  },
  strength: {
    track: 'elbow',
    downRange: [75, 110],
    upRange: [150, 180],
    goDownCue: ['Lower!'],
    goUpCue: ['Drive!', 'Lift!'],
    formTips: ['Control the weight!', 'Engage your core!'],
  },
  default: {
    track: 'knee',
    downRange: [80, 110],
    upRange: [155, 180],
    goDownCue: ['Go down!'],
    goUpCue: ['Come up!'],
    formTips: ['Focus on form!', 'Breathe!'],
  },
};

export function pickRandom(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}