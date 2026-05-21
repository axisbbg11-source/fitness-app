const exercises = [
  // ==========================================
  // HOME (25 exercises, 5 free)
  // ==========================================
  {
    id: "home-squat",
    name: "Bodyweight Squat",
    emoji: "🏋️",
    category: "Home",
    premium: false,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Keep knees behind toes", ideal: 90 },
      { joint: "back", rule: "Keep back straight", ideal: 180 }
    ],
    caloriesPerMin: 8,
    description: "Lower your body by bending knees until thighs are parallel to the floor, then push back up through your heels."
  },
  {
    id: "home-pushup",
    name: "Push-Up",
    emoji: "💪",
    category: "Home",
    premium: false,
    difficulty: "easy",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Lower chest to ground level", ideal: 90 },
      { joint: "back", rule: "Keep body in straight line", ideal: 180 }
    ],
    caloriesPerMin: 7,
    description: "Start in plank position, lower your chest toward the floor by bending elbows, then push back up."
  },
  {
    id: "home-jumpingjack",
    name: "Jumping Jack",
    emoji: "⭐",
    category: "Home",
    premium: false,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 30,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Fully extend arms overhead", ideal: 180 },
      { joint: "knee", rule: "Land with soft knees", ideal: 170 }
    ],
    caloriesPerMin: 10,
    description: "Jump feet apart while raising arms overhead, then jump back together. Great full-body cardio."
  },
  {
    id: "home-lunge",
    name: "Lunge",
    emoji: "🦵",
    category: "Home",
    premium: false,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Front knee at 90 degrees", ideal: 90 },
      { joint: "back", rule: "Keep torso upright", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Step forward and lower your back knee toward the ground, keeping front knee at 90 degrees."
  },
  {
    id: "home-plank",
    name: "Plank Hold",
    emoji: "🧱",
    category: "Home",
    premium: false,
    difficulty: "easy",
    track: "spine",
    downThreshold: 160,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Keep body in straight line from head to heels", ideal: 180 },
      { joint: "hip", rule: "Don't let hips sag or pike", ideal: 180 }
    ],
    caloriesPerMin: 4,
    description: "Hold a push-up position with arms straight, keeping your body in a perfect line from head to heels."
  },
  {
    id: "home-burpees",
    name: "Burpees",
    emoji: "🔥",
    category: "Home",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Fully extend at top of movement", ideal: 180 },
      { joint: "knee", rule: "Bring knees to chest in tuck", ideal: 45 }
    ],
    caloriesPerMin: 14,
    description: "Drop to a squat, kick feet back to plank, perform a push-up, jump feet forward, then explosively jump up."
  },
  {
    id: "home-mountainclimbers",
    name: "Mountain Climbers",
    emoji: "⛰️",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Drive knee to chest", ideal: 45 },
      { joint: "back", rule: "Keep hips level", ideal: 180 }
    ],
    caloriesPerMin: 12,
    description: "In plank position, alternate driving knees toward chest at a quick pace. Great for cardio and core."
  },
  {
    id: "home-highknees",
    name: "High Knees",
    emoji: "🏃",
    category: "Home",
    premium: true,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Lift knee to hip height", ideal: 90 },
      { joint: "back", rule: "Stay upright with slight lean", ideal: 170 }
    ],
    caloriesPerMin: 11,
    description: "Run in place while lifting knees as high as possible. Pump arms for added intensity."
  },
  {
    id: "home-bicyclecrunches",
    name: "Bicycle Crunches",
    emoji: "🚴",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "spine",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Rotate torso fully", ideal: 90 },
      { joint: "knee", rule: "Bring opposite elbow to knee", ideal: 45 }
    ],
    caloriesPerMin: 8,
    description: "Lie on back, bring opposite elbow to knee in a cycling motion. Targets obliques and core."
  },
  {
    id: "home-wallsit",
    name: "Wall Sit",
    emoji: "🧱",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Keep thighs parallel to floor", ideal: 90 },
      { joint: "back", rule: "Press back flat against wall", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Sit against a wall with knees at 90 degrees. Hold the position to build leg endurance."
  },
  {
    id: "home-tricepdips",
    name: "Tricep Dips",
    emoji: "💺",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Lower until upper arm is parallel to floor", ideal: 90 },
      { joint: "shoulder", rule: "Keep shoulders down and back", ideal: 180 }
    ],
    caloriesPerMin: 7,
    description: "Support yourself on a chair or bench, lower body by bending elbows, then press back up."
  },
  {
    id: "home-glutebridges",
    name: "Glute Bridges",
    emoji: "🍑",
    category: "Home",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 120,
    upThreshold: 180,
    form: [
      { joint: "hip", rule: "Fully extend hips at top", ideal: 180 },
      { joint: "knee", rule: "Keep feet flat on floor", ideal: 90 }
    ],
    caloriesPerMin: 6,
    description: "Lie on back with knees bent, squeeze glutes and lift hips toward ceiling until fully extended."
  },
  {
    id: "home-supermanhold",
    name: "Superman Hold",
    emoji: "🦸",
    category: "Home",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 120,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Extend arms and legs fully", ideal: 180 },
      { joint: "back", rule: "Squeeze glutes and lower back", ideal: 180 }
    ],
    caloriesPerMin: 4,
    description: "Lie face down, simultaneously lift arms and legs off the ground. Hold to strengthen lower back."
  },
  {
    id: "home-donkeykicks",
    name: "Donkey Kicks",
    emoji: "🫏",
    category: "Home",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Extend leg fully behind you", ideal: 180 },
      { joint: "knee", rule: "Keep knee at 90 degrees when lifted", ideal: 90 }
    ],
    caloriesPerMin: 5,
    description: "On all fours, kick one leg back and up while keeping knee bent. Targets glutes effectively."
  },
  {
    id: "home-inchworms",
    name: "Inchworms",
    emoji: "🐛",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Fold at hips with straight legs", ideal: 90 },
      { joint: "back", rule: "Walk hands out to full plank", ideal: 180 }
    ],
    caloriesPerMin: 8,
    description: "Stand tall, fold forward, walk hands out to plank, then walk feet to hands. Full body movement."
  },
  {
    id: "home-tuckjumps",
    name: "Tuck Jumps",
    emoji: "🦘",
    category: "Home",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Tuck knees to chest at peak", ideal: 45 },
      { joint: "hip", rule: "Fully extend before tucking", ideal: 180 }
    ],
    caloriesPerMin: 13,
    description: "Jump explosively and tuck knees to chest at the highest point. Land softly with bent knees."
  },
  {
    id: "home-plankjacks",
    name: "Plank Jacks",
    emoji: "⭐",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 120,
    upThreshold: 180,
    form: [
      { joint: "hip", rule: "Keep hips stable during jumps", ideal: 180 },
      { joint: "back", rule: "Maintain plank position", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "In plank position, jump feet apart and together like a horizontal jumping jack. Core and cardio."
  },
  {
    id: "home-skaterjumps",
    name: "Skater Jumps",
    emoji: "⛸️",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Land with soft bent knee", ideal: 120 },
      { joint: "hip", rule: "Push hips back on landing", ideal: 120 }
    ],
    caloriesPerMin: 11,
    description: "Leap laterally from one foot to the other, swinging arms for balance. Builds agility and power."
  },
  {
    id: "home-bearcrawl",
    name: "Bear Crawl",
    emoji: "🐻",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 130,
    form: [
      { joint: "knee", rule: "Keep knees hovering off ground", ideal: 90 },
      { joint: "back", rule: "Keep back flat and level", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "On all fours with knees hovering, move opposite hand and foot forward. Full body coordination."
  },
  {
    id: "home-vups",
    name: "V-Ups",
    emoji: "📐",
    category: "Home",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Fold at hips to form V shape", ideal: 60 },
      { joint: "knee", rule: "Keep legs straight", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Lie flat, simultaneously lift legs and torso to form a V. Advanced core exercise."
  },
  {
    id: "home-pikepushups",
    name: "Pike Push-Ups",
    emoji: "🔺",
    category: "Home",
    premium: true,
    difficulty: "hard",
    track: "shoulder",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Bend elbows to lower head to floor", ideal: 90 },
      { joint: "hip", rule: "Keep hips high in pike position", ideal: 90 }
    ],
    caloriesPerMin: 8,
    description: "In downward dog position, bend elbows to lower head toward floor. Targets shoulders."
  },
  {
    id: "home-commandoplank",
    name: "Commando Plank",
    emoji: "🎖️",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "spine",
    downThreshold: 160,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Keep body straight throughout", ideal: 180 },
      { joint: "hip", rule: "Minimize hip rotation", ideal: 180 }
    ],
    caloriesPerMin: 7,
    description: "Alternate between forearm plank and high plank by pressing up one arm at a time."
  },
  {
    id: "home-speedsquats",
    name: "Speed Squats",
    emoji: "⚡",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Reach parallel quickly", ideal: 90 },
      { joint: "back", rule: "Maintain upright torso", ideal: 180 }
    ],
    caloriesPerMin: 12,
    description: "Perform squats at maximum speed while maintaining form. Builds explosive leg power."
  },
  {
    id: "home-flutterkicks",
    name: "Flutter Kicks",
    emoji: "🦵",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Keep lower back pressed to floor", ideal: 180 },
      { joint: "knee", rule: "Keep legs mostly straight", ideal: 170 }
    ],
    caloriesPerMin: 7,
    description: "Lie on back, lift legs and alternate small kicks up and down. Core and hip flexor endurance."
  },
  {
    id: "home-reverselunge",
    name: "Reverse Lunge",
    emoji: "🔙",
    category: "Home",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Front knee at 90 degrees", ideal: 90 },
      { joint: "back", rule: "Keep torso upright", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Step backward and lower back knee toward the ground. Easier on knees than forward lunges."
  },

  // ==========================================
  // GYM (25 exercises, 5 free)
  // ==========================================
  {
    id: "gym-barbellsquat",
    name: "Barbell Squat",
    emoji: "🏋️",
    category: "Gym",
    premium: false,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Squat to parallel or below", ideal: 90 },
      { joint: "back", rule: "Keep chest up and back straight", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "With barbell on upper back, squat down until thighs are parallel, then drive up through heels."
  },
  {
    id: "gym-benchpress",
    name: "Bench Press",
    emoji: "🏋️",
    category: "Gym",
    premium: false,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Lower bar to mid-chest", ideal: 90 },
      { joint: "shoulder", rule: "Keep shoulder blades retracted", ideal: 160 }
    ],
    caloriesPerMin: 8,
    description: "Lie on bench, lower barbell to chest, then press up to full arm extension. Classic chest builder."
  },
  {
    id: "gym-deadlift",
    name: "Deadlift",
    emoji: "🏋️",
    category: "Gym",
    premium: false,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Hinge at hips with flat back", ideal: 90 },
      { joint: "back", rule: "Keep spine neutral throughout", ideal: 180 }
    ],
    caloriesPerMin: 11,
    description: "Grip barbell at hip width, drive through heels and extend hips to stand tall. King of compound lifts."
  },
  {
    id: "gym-latpulldown",
    name: "Lat Pulldown",
    emoji: "🏋️",
    category: "Gym",
    premium: false,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Pull bar to upper chest", ideal: 90 },
      { joint: "back", rule: "Lean back slightly, squeeze lats", ideal: 160 }
    ],
    caloriesPerMin: 7,
    description: "Pull cable bar down to upper chest while sitting, squeezing shoulder blades together."
  },
  {
    id: "gym-bicepcurl",
    name: "Bicep Curl",
    emoji: "💪",
    category: "Gym",
    premium: false,
    difficulty: "easy",
    track: "elbow",
    downThreshold: 40,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Keep elbows pinned to sides", ideal: 170 },
      { joint: "shoulder", rule: "Don't swing weights up", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Hold dumbbells at sides, curl weight up by bending elbows, then slowly lower back down."
  },
  {
    id: "gym-shoulderpress",
    name: "Shoulder Press",
    emoji: "🏋️",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "shoulder",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "shoulder", rule: "Press weight overhead to full extension", ideal: 180 },
      { joint: "back", rule: "Keep core tight, avoid arching", ideal: 180 }
    ],
    caloriesPerMin: 8,
    description: "Press dumbbells or barbell from shoulder height to full overhead extension. Builds deltoids."
  },
  {
    id: "gym-legpress",
    name: "Leg Press",
    emoji: "🦵",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Lower until knees at 90 degrees", ideal: 90 },
      { joint: "back", rule: "Keep back flat against pad", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Sit in machine with feet on platform, lower weight by bending knees, then press back up."
  },
  {
    id: "gym-chestfly",
    name: "Chest Fly",
    emoji: "🦅",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "shoulder",
    downThreshold: 60,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Open arms with slight elbow bend", ideal: 160 },
      { joint: "elbow", rule: "Maintain slight bend throughout", ideal: 150 }
    ],
    caloriesPerMin: 7,
    description: "Lie on bench with dumbbells, open arms wide with slight bend, then squeeze together over chest."
  },
  {
    id: "gym-row",
    name: "Barbell Row",
    emoji: "🚣",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Pull bar to lower chest", ideal: 90 },
      { joint: "back", rule: "Keep torso at 45-degree angle", ideal: 135 }
    ],
    caloriesPerMin: 9,
    description: "Bend at hips, pull barbell to lower chest while keeping back flat. Powerful back builder."
  },
  {
    id: "gym-triceppushdown",
    name: "Tricep Pushdown",
    emoji: "👇",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "elbow",
    downThreshold: 40,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Fully extend arms at bottom", ideal: 180 },
      { joint: "shoulder", rule: "Keep elbows at sides", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Push cable attachment down until arms are fully extended. Isolates the triceps."
  },
  {
    id: "gym-legcurl",
    name: "Leg Curl",
    emoji: "🦵",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Curl pad to glutes", ideal: 45 },
      { joint: "back", rule: "Keep torso flat on bench", ideal: 180 }
    ],
    caloriesPerMin: 6,
    description: "Lie on machine, curl weight by bending knees toward glutes. Isolates hamstrings."
  },
  {
    id: "gym-legextension",
    name: "Leg Extension",
    emoji: "🦵",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "knee", rule: "Extend to full lockout", ideal: 180 },
      { joint: "back", rule: "Keep back against pad", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Sit in machine, extend legs until straight. Isolates quadriceps effectively."
  },
  {
    id: "gym-lateralraise",
    name: "Lateral Raise",
    emoji: "🦅",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 30,
    upThreshold: 90,
    form: [
      { joint: "shoulder", rule: "Raise arms to shoulder height", ideal: 90 },
      { joint: "elbow", rule: "Maintain slight bend", ideal: 160 }
    ],
    caloriesPerMin: 5,
    description: "Hold dumbbells at sides, raise arms laterally to shoulder height. Builds medial delts."
  },
  {
    id: "gym-facepull",
    name: "Face Pull",
    emoji: "🧲",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Pull rope to face level", ideal: 90 },
      { joint: "elbow", rule: "Let elbows flare out", ideal: 90 }
    ],
    caloriesPerMin: 5,
    description: "Pull cable rope toward face, separating handles. Great for rear delts and posture."
  },
  {
    id: "gym-calfraise",
    name: "Calf Raise",
    emoji: "🦶",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "ankle",
    downThreshold: 70,
    upThreshold: 150,
    form: [
      { joint: "ankle", rule: "Full range of motion on toes", ideal: 150 },
      { joint: "knee", rule: "Keep legs straight", ideal: 180 }
    ],
    caloriesPerMin: 4,
    description: "Stand on edge of platform, rise onto toes then lower below level. Builds calf muscles."
  },
  {
    id: "gym-cablecrossover",
    name: "Cable Crossover",
    emoji: "🔄",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "shoulder",
    downThreshold: 60,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Cross arms in front of body", ideal: 60 },
      { joint: "elbow", rule: "Keep slight bend throughout", ideal: 150 }
    ],
    caloriesPerMin: 7,
    description: "Pull cable handles from high position, crossing arms in front of chest. Chest isolation."
  },
  {
    id: "gym-hacksquat",
    name: "Hack Squat",
    emoji: "🏋️",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Lower to 90 degrees or slightly below", ideal: 90 },
      { joint: "back", rule: "Keep back flat against pad", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Stand on hack squat machine with back on pad, lower by bending knees, then press back up."
  },
  {
    id: "gym-romaniandeadlift",
    name: "Romanian Deadlift",
    emoji: "🏋️",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Hinge at hips pushing glutes back", ideal: 90 },
      { joint: "knee", rule: "Keep slight knee bend", ideal: 160 }
    ],
    caloriesPerMin: 9,
    description: "Hold barbell, hinge at hips while keeping legs mostly straight. Targets hamstrings and glutes."
  },
  {
    id: "gym-inclinepress",
    name: "Incline Bench Press",
    emoji: "🏋️",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Lower bar to upper chest", ideal: 90 },
      { joint: "shoulder", rule: "Keep shoulder blades tight", ideal: 160 }
    ],
    caloriesPerMin: 8,
    description: "Press barbell on an incline bench. Targets upper chest and front delts."
  },
  {
    id: "gym-preachercurl",
    name: "Preacher Curl",
    emoji: "🙏",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "elbow",
    downThreshold: 40,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Fully extend at bottom", ideal: 180 },
      { joint: "shoulder", rule: "Keep arms on pad", ideal: 90 }
    ],
    caloriesPerMin: 5,
    description: "Rest arms on preacher bench, curl weight up. Strict bicep isolation."
  },
  {
    id: "gym-skullcrusher",
    name: "Skull Crusher",
    emoji: "💀",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Lower bar to forehead", ideal: 90 },
      { joint: "shoulder", rule: "Keep upper arms vertical", ideal: 90 }
    ],
    caloriesPerMin: 6,
    description: "Lie on bench, lower barbell to forehead by bending elbows, then extend back up. Tricep builder."
  },
  {
    id: "gym-hyperextension",
    name: "Hyperextension",
    emoji: "🔙",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 90,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Extend to neutral spine position", ideal: 180 },
      { joint: "hip", rule: "Don't overextend", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "On roman chair, bend forward at waist, then extend back up. Strengthens lower back."
  },
  {
    id: "gym-woodchopper",
    name: "Woodchopper",
    emoji: "🪓",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "spine",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Rotate torso fully", ideal: 90 },
      { joint: "hip", rule: "Pivot hips with rotation", ideal: 135 }
    ],
    caloriesPerMin: 8,
    description: "Pull cable diagonally across body from high to low. Rotational core and oblique exercise."
  },
  {
    id: "gym-farmerwalk",
    name: "Farmer Walk",
    emoji: "🚜",
    category: "Gym",
    premium: true,
    difficulty: "medium",
    track: "spine",
    downThreshold: 160,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Walk with upright posture", ideal: 180 },
      { joint: "shoulder", rule: "Keep shoulders pulled back", ideal: 180 }
    ],
    caloriesPerMin: 8,
    description: "Carry heavy dumbbells at sides and walk for distance. Builds grip, traps, and core stability."
  },
  {
    id: "gym-shrug",
    name: "Shrug",
    emoji: "🤷",
    category: "Gym",
    premium: true,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 120,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Shrug shoulders toward ears", ideal: 160 },
      { joint: "elbow", rule: "Keep arms straight", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Hold weights at sides, shrug shoulders up toward ears, hold, then lower. Builds traps."
  },

  // ==========================================
  // YOGA (25 exercises, 5 free)
  // ==========================================
  {
    id: "yoga-mountainpose",
    name: "Mountain Pose",
    emoji: "🏔️",
    category: "Yoga",
    premium: false,
    difficulty: "easy",
    track: "spine",
    downThreshold: 160,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Stand tall with perfect posture", ideal: 180 },
      { joint: "shoulder", rule: "Relax shoulders down and back", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Stand with feet together, arms at sides, weight evenly distributed. Foundation of all standing poses."
  },
  {
    id: "yoga-warrior1",
    name: "Warrior I",
    emoji: "⚔️",
    category: "Yoga",
    premium: false,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Front knee at 90 degrees over ankle", ideal: 90 },
      { joint: "hip", rule: "Square hips forward", ideal: 180 }
    ],
    caloriesPerMin: 4,
    description: "Step one foot forward into a lunge, back foot angled at 45 degrees, arms raised overhead."
  },
  {
    id: "yoga-downwarddog",
    name: "Downward Dog",
    emoji: "🐕",
    category: "Yoga",
    premium: false,
    difficulty: "easy",
    track: "hip",
    downThreshold: 60,
    upThreshold: 120,
    form: [
      { joint: "hip", rule: "Push hips high and back", ideal: 90 },
      { joint: "spine", rule: "Keep spine long and straight", ideal: 180 }
    ],
    caloriesPerMin: 4,
    description: "Form an inverted V-shape, hands and feet on ground, hips pushed up and back. Classic yoga pose."
  },
  {
    id: "yoga-treepose",
    name: "Tree Pose",
    emoji: "🌳",
    category: "Yoga",
    premium: false,
    difficulty: "medium",
    track: "knee",
    downThreshold: 60,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Open knee to the side", ideal: 90 },
      { joint: "spine", rule: "Stand tall and balanced", ideal: 180 }
    ],
    caloriesPerMin: 3,
    description: "Stand on one leg, place other foot on inner thigh or calf, arms overhead. Balance and focus."
  },
  {
    id: "yoga-cobrapose",
    name: "Cobra Pose",
    emoji: "🐍",
    category: "Yoga",
    premium: false,
    difficulty: "easy",
    track: "spine",
    downThreshold: 60,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Lift chest using back muscles", ideal: 160 },
      { joint: "elbow", rule: "Keep slight bend in arms", ideal: 150 }
    ],
    caloriesPerMin: 3,
    description: "Lie face down, place hands under shoulders, lift chest off the floor. Gentle backbend."
  },
  {
    id: "yoga-warrior2",
    name: "Warrior II",
    emoji: "⚔️",
    category: "Yoga",
    premium: true,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Front knee at 90 degrees", ideal: 90 },
      { joint: "hip", rule: "Open hips to the side", ideal: 90 }
    ],
    caloriesPerMin: 4,
    description: "Wide stance with front knee bent, arms extended to sides, gaze over front hand. Strength and focus."
  },
  {
    id: "yoga-triangle",
    name: "Triangle Pose",
    emoji: "📐",
    category: "Yoga",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Hinge at hip keeping torso open", ideal: 90 },
      { joint: "spine", rule: "Keep torso in same plane as legs", ideal: 180 }
    ],
    caloriesPerMin: 3,
    description: "Wide stance, reach front hand forward and down to shin, other arm up. Stretches entire side body."
  },
  {
    id: "yoga-chair",
    name: "Chair Pose",
    emoji: "🪑",
    category: "Yoga",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 140,
    form: [
      { joint: "knee", rule: "Sit back as if in a chair", ideal: 90 },
      { joint: "spine", rule: "Keep chest lifted and weight in heels", ideal: 160 }
    ],
    caloriesPerMin: 6,
    description: "Stand with feet together, sit back into imaginary chair, arms overhead. Powerful leg strengthener."
  },
  {
    id: "yoga-crow",
    name: "Crow Pose",
    emoji: "🐦",
    category: "Yoga",
    premium: true,
    difficulty: "hard",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Bend elbows to shelf knees", ideal: 90 },
      { joint: "shoulder", rule: "Press knees into upper arms", ideal: 90 }
    ],
    caloriesPerMin: 5,
    description: "Balance on hands with knees resting on backs of upper arms. Advanced arm balance."
  },
  {
    id: "yoga-bridge",
    name: "Bridge Pose",
    emoji: "🌉",
    category: "Yoga",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 120,
    upThreshold: 180,
    form: [
      { joint: "hip", rule: "Lift hips toward ceiling", ideal: 180 },
      { joint: "knee", rule: "Keep feet hip-width apart", ideal: 90 }
    ],
    caloriesPerMin: 4,
    description: "Lie on back, bend knees, press feet down to lift hips. Opens chest and strengthens glutes."
  },
  {
    id: "yoga-boat",
    name: "Boat Pose",
    emoji: "⛵",
    category: "Yoga",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Balance on sit bones with V-shape", ideal: 90 },
      { joint: "spine", rule: "Keep spine long and straight", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Sit, lean back slightly, lift legs to form a V. Intense core strengthener."
  },
  {
    id: "yoga-camel",
    name: "Camel Pose",
    emoji: "🐪",
    category: "Yoga",
    premium: true,
    difficulty: "hard",
    track: "spine",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Arch back evenly", ideal: 90 },
      { joint: "hip", rule: "Push hips forward over knees", ideal: 180 }
    ],
    caloriesPerMin: 4,
    description: "Kneel and lean back, reaching hands toward heels. Deep backbend and chest opener."
  },
  {
    id: "yoga-pigeon",
    name: "Pigeon Pose",
    emoji: "🕊️",
    category: "Yoga",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Square hips to front of mat", ideal: 180 },
      { joint: "knee", rule: "Front knee bent at comfortable angle", ideal: 90 }
    ],
    caloriesPerMin: 3,
    description: "From downward dog, bring one knee forward behind wrist, extend back leg. Deep hip opener."
  },
  {
    id: "yoga-catcow",
    name: "Cat-Cow",
    emoji: "🐱",
    category: "Yoga",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 120,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Alternate between arching and rounding", ideal: 180 },
      { joint: "hip", rule: "Keep hips over knees", ideal: 90 }
    ],
    caloriesPerMin: 3,
    description: "On all fours, alternate between arching back (cow) and rounding spine (cat). Spinal mobility."
  },
  {
    id: "yoga-childspose",
    name: "Child's Pose",
    emoji: "🧒",
    category: "Yoga",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 60,
    upThreshold: 120,
    form: [
      { joint: "hip", rule: "Sit back on heels completely", ideal: 60 },
      { joint: "spine", rule: "Relax and reach arms forward", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Kneel and sit back on heels, fold forward with arms extended. Resting and restorative pose."
  },
  {
    id: "yoga-forwardfold",
    name: "Forward Fold",
    emoji: " Fold",
    category: "Yoga",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Fold at hips, not waist", ideal: 90 },
      { joint: "knee", rule: "Slight bend if hamstrings tight", ideal: 160 }
    ],
    caloriesPerMin: 3,
    description: "Stand and fold forward from hips, letting head hang. Stretches hamstrings and calms the mind."
  },
  {
    id: "yoga-halfmoon",
    name: "Half Moon",
    emoji: "🌙",
    category: "Yoga",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Stack hips on top of each other", ideal: 180 },
      { joint: "knee", rule: "Standing leg strong and straight", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Balance on one leg with hand on floor, other arm up, top leg lifted. Balance and strength."
  },
  {
    id: "yoga-lordofdance",
    name: "Lord of the Dance",
    emoji: "💃",
    category: "Yoga",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Grab foot behind you and kick", ideal: 90 },
      { joint: "spine", rule: "Lift chest and arch slightly", ideal: 160 }
    ],
    caloriesPerMin: 4,
    description: "Stand on one leg, grab the other foot behind you and kick into hand. Balance and flexibility."
  },
  {
    id: "yoga-eagle",
    name: "Eagle Pose",
    emoji: "🦅",
    category: "Yoga",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Sit deep into the standing leg", ideal: 120 },
      { joint: "shoulder", rule: "Wrap arms tightly", ideal: 90 }
    ],
    caloriesPerMin: 4,
    description: "Wrap one leg around the other and arms around each other. Balance, focus, and flexibility."
  },
  {
    id: "yoga-wheel",
    name: "Wheel Pose",
    emoji: "🎡",
    category: "Yoga",
    premium: true,
    difficulty: "hard",
    track: "spine",
    downThreshold: 90,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Full wheel backbend", ideal: 90 },
      { joint: "shoulder", rule: "Press into hands to lift", ideal: 180 }
    ],
    caloriesPerMin: 6,
    description: "Lie on back, place hands by ears, press up into full backbend. Advanced chest and spine opener."
  },
  {
    id: "yoga-plow",
    name: "Plow Pose",
    emoji: "犁",
    category: "Yoga",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 60,
    upThreshold: 120,
    form: [
      { joint: "hip", rule: "Lift legs over head to floor", ideal: 60 },
      { joint: "spine", rule: "Keep spine long and supported", ideal: 90 }
    ],
    caloriesPerMin: 4,
    description: "Lie on back, swing legs over head to touch floor behind you. Deep stretch for back and hamstrings."
  },
  {
    id: "yoga-fish",
    name: "Fish Pose",
    emoji: "🐟",
    category: "Yoga",
    premium: true,
    difficulty: "medium",
    track: "spine",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Arch upper back off the floor", ideal: 120 },
      { joint: "shoulder", rule: "Open chest wide", ideal: 180 }
    ],
    caloriesPerMin: 3,
    description: "Lie on back, arch chest up while crown of head touches floor. Throat and chest opener."
  },
  {
    id: "yoga-seatedtwist",
    name: "Seated Twist",
    emoji: "🔄",
    category: "Yoga",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Twist from the core, not arms", ideal: 90 },
      { joint: "hip", rule: "Keep both sit bones grounded", ideal: 180 }
    ],
    caloriesPerMin: 3,
    description: "Sit with legs extended, cross one leg over, twist torso toward bent knee. Spinal mobility."
  },
  {
    id: "yoga-hero",
    name: "Hero Pose",
    emoji: "🦸",
    category: "Yoga",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Sit between feet on floor", ideal: 90 },
      { joint: "spine", rule: "Keep spine tall and upright", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Kneel and sit between feet, keeping spine tall. Stretches thighs and ankles."
  },
  {
    id: "yoga-staffpose",
    name: "Staff Pose",
    emoji: "🪈",
    category: "Yoga",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 160,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Sit tall with straight back", ideal: 180 },
      { joint: "knee", rule: "Legs extended with flexed feet", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Sit with legs extended, feet flexed, hands by hips, spine tall. Foundation for seated poses."
  },

  // ==========================================
  // CARDIO (25 exercises, 5 free)
  // ==========================================
  {
    id: "cardio-jumpingjacks",
    name: "Jumping Jacks",
    emoji: "⭐",
    category: "Cardio",
    premium: false,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 30,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Fully extend arms overhead", ideal: 180 },
      { joint: "knee", rule: "Land with soft knees", ideal: 170 }
    ],
    caloriesPerMin: 10,
    description: "Jump feet apart while raising arms overhead, then jump back together. Classic cardio warm-up."
  },
  {
    id: "cardio-highknees",
    name: "High Knees",
    emoji: "🏃",
    category: "Cardio",
    premium: false,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Drive knee to hip height", ideal: 90 },
      { joint: "back", rule: "Stay upright with slight lean", ideal: 170 }
    ],
    caloriesPerMin: 11,
    description: "Run in place lifting knees as high as possible. Great cardio and hip flexor workout."
  },
  {
    id: "cardio-buttkicks",
    name: "Butt Kicks",
    emoji: "🦵",
    category: "Cardio",
    premium: false,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Kick heel to glute", ideal: 45 },
      { joint: "hip", rule: "Keep hips under shoulders", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "Run in place, kicking heels up toward glutes. Warms up hamstrings and gets heart rate up."
  },
  {
    id: "cardio-mountainclimbers",
    name: "Mountain Climbers",
    emoji: "⛰️",
    category: "Cardio",
    premium: false,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Drive knee toward chest", ideal: 45 },
      { joint: "back", rule: "Keep hips level with shoulders", ideal: 180 }
    ],
    caloriesPerMin: 12,
    description: "In plank position, alternate driving knees to chest. Full body cardio and core exercise."
  },
  {
    id: "cardio-burpees",
    name: "Burpees",
    emoji: "🔥",
    category: "Cardio",
    premium: false,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Full extension at top of jump", ideal: 180 },
      { joint: "knee", rule: "Tuck knees to chest in squat", ideal: 45 }
    ],
    caloriesPerMin: 14,
    description: "Squat, kick to plank, push-up, jump feet in, explode up. The ultimate cardio exercise."
  },
  {
    id: "cardio-tuckjumps",
    name: "Tuck Jumps",
    emoji: "🦘",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Tuck knees high to chest", ideal: 45 },
      { joint: "hip", rule: "Fully extend before tucking", ideal: 180 }
    ],
    caloriesPerMin: 13,
    description: "Jump as high as possible, pulling knees to chest at peak. Explosive power and cardio."
  },
  {
    id: "cardio-boxjumps",
    name: "Box Jumps",
    emoji: "📦",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Land softly with bent knees", ideal: 120 },
      { joint: "hip", rule: "Swing arms for momentum", ideal: 160 }
    ],
    caloriesPerMin: 12,
    description: "Jump onto a raised platform, land softly, step down. Builds explosive leg power."
  },
  {
    id: "cardio-skaterjumps",
    name: "Skater Jumps",
    emoji: "⛸️",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Land with soft bent knee", ideal: 120 },
      { joint: "hip", rule: "Push hips back on landing", ideal: 120 }
    ],
    caloriesPerMin: 11,
    description: "Leap side to side landing on one foot. Builds lateral agility and cardio endurance."
  },
  {
    id: "cardio-speedskaters",
    name: "Speed Skaters",
    emoji: "⛸️",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Stay low and explosive", ideal: 120 },
      { joint: "hip", rule: "Sweep trailing leg behind", ideal: 135 }
    ],
    caloriesPerMin: 12,
    description: "Fast lateral jumps mimicking speed skating. Low and explosive for maximum cardio benefit."
  },
  {
    id: "cardio-jumprope",
    name: "Jump Rope",
    emoji: "🪢",
    category: "Cardio",
    premium: true,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Small hops with soft landings", ideal: 160 },
      { joint: "wrist", rule: "Rotate rope with wrists not arms", ideal: 180 }
    ],
    caloriesPerMin: 13,
    description: "Swing rope and hop over it with light, quick jumps. Excellent calorie burner and coordination."
  },
  {
    id: "cardio-stepups",
    name: "Step Ups",
    emoji: "🪜",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Drive through heel of stepping foot", ideal: 90 },
      { joint: "hip", rule: "Stand fully upright at top", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Step onto a raised platform, fully extend, then step down. Alternate legs for cardio."
  },
  {
    id: "cardio-sprintintervals",
    name: "Sprint Intervals",
    emoji: "💨",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Drive knees high during sprint", ideal: 90 },
      { joint: "hip", rule: "Lean forward from ankles", ideal: 160 }
    ],
    caloriesPerMin: 15,
    description: "Alternate between all-out sprinting and recovery periods. Maximum fat burning and speed."
  },
  {
    id: "cardio-lateralshuffles",
    name: "Lateral Shuffles",
    emoji: "↔️",
    category: "Cardio",
    premium: true,
    difficulty: "easy",
    track: "knee",
    downThreshold: 120,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Stay in athletic stance", ideal: 130 },
      { joint: "hip", rule: "Keep hips low and level", ideal: 135 }
    ],
    caloriesPerMin: 9,
    description: "Shuffle side to side in low athletic stance. Builds lateral speed and cardio endurance."
  },
  {
    id: "cardio-powerskips",
    name: "Power Skips",
    emoji: "🦘",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Drive knee up explosively", ideal: 90 },
      { joint: "shoulder", rule: "Swing opposite arm high", ideal: 160 }
    ],
    caloriesPerMin: 12,
    description: "Skip with maximum height and power on each step. Explosive cardio and coordination."
  },
  {
    id: "cardio-broadjumps",
    name: "Broad Jumps",
    emoji: "📏",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Swing arms and explode forward", ideal: 90 },
      { joint: "hip", rule: "Stick landing with soft knees", ideal: 120 }
    ],
    caloriesPerMin: 13,
    description: "Jump forward as far as possible from a half-squat. Builds explosive horizontal power."
  },
  {
    id: "cardio-splitjumps",
    name: "Split Jumps",
    emoji: "✂️",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Switch legs mid-air", ideal: 90 },
      { joint: "hip", rule: "Drop back knee toward floor", ideal: 90 }
    ],
    caloriesPerMin: 13,
    description: "Jumping lunge switching legs in mid-air. Intense cardio and leg strength."
  },
  {
    id: "cardio-staggeredpushups",
    name: "Staggered Push-Ups",
    emoji: "💪",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "One hand forward, one back", ideal: 90 },
      { joint: "back", rule: "Keep body in straight line", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Push-ups with one hand placed forward and one back. Increases difficulty and core engagement."
  },
  {
    id: "cardio-plyopushups",
    name: "Plyo Push-Ups",
    emoji: "💥",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Push hard enough to lift hands", ideal: 160 },
      { joint: "back", rule: "Maintain rigid body line", ideal: 180 }
    ],
    caloriesPerMin: 11,
    description: "Explosive push-ups where hands leave the ground at the top. Upper body power."
  },
  {
    id: "cardio-squatjumps",
    name: "Squat Jumps",
    emoji: "🦘",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Squat to parallel then explode up", ideal: 90 },
      { joint: "hip", rule: "Fully extend hips at top", ideal: 180 }
    ],
    caloriesPerMin: 12,
    description: "Squat down then jump as high as possible. Leg power and cardio in one move."
  },
  {
    id: "cardio-clappushups",
    name: "Clap Push-Ups",
    emoji: "👏",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Explode up and clap hands", ideal: 160 },
      { joint: "back", rule: "Keep core tight throughout", ideal: 180 }
    ],
    caloriesPerMin: 11,
    description: "Explosive push-up with a clap at the top. Maximum upper body power and coordination."
  },
  {
    id: "cardio-depthjumps",
    name: "Depth Jumps",
    emoji: "📉",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Step off box and immediately jump", ideal: 90 },
      { joint: "hip", rule: "Minimize ground contact time", ideal: 180 }
    ],
    caloriesPerMin: 14,
    description: "Step off a box, land, then immediately jump as high as possible. Advanced plyometric power."
  },
  {
    id: "cardio-hurdlehops",
    name: "Hurdle Hops",
    emoji: "🏅",
    category: "Cardio",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Tuck knees over hurdle", ideal: 45 },
      { joint: "ankle", rule: "Land on balls of feet", ideal: 150 }
    ],
    caloriesPerMin: 14,
    description: "Jump over a series of small hurdles consecutively. Reactive power and coordination."
  },
  {
    id: "cardio-shuttlerun",
    name: "Shuttle Run",
    emoji: "🏃",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Low center of gravity on turns", ideal: 120 },
      { joint: "hip", rule: "Decelerate and accelerate quickly", ideal: 160 }
    ],
    caloriesPerMin: 12,
    description: "Sprint between two points, touching the ground at each turn. Speed and agility."
  },
  {
    id: "cardio-agilityladder",
    name: "Agility Ladder",
    emoji: "🪜",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 120,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Quick, light feet through rungs", ideal: 140 },
      { joint: "ankle", rule: "Stay on balls of feet", ideal: 150 }
    ],
    caloriesPerMin: 10,
    description: "Move feet quickly through ladder patterns. Footwork speed, coordination, and cardio."
  },
  {
    id: "cardio-dotdrills",
    name: "Dot Drills",
    emoji: "⚫",
    category: "Cardio",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 120,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Quick hops between dots", ideal: 140 },
      { joint: "ankle", rule: "Land on balls of feet", ideal: 150 }
    ],
    caloriesPerMin: 10,
    description: "Hop between dots on the floor in various patterns. Quick feet and directional change."
  },

  // ==========================================
  // STRETCH (25 exercises, 5 free)
  // ==========================================
  {
    id: "stretch-hamstring",
    name: "Standing Hamstring Stretch",
    emoji: "🦵",
    category: "Stretch",
    premium: false,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Hinge at hips keeping back straight", ideal: 90 },
      { joint: "knee", rule: "Keep legs straight but not locked", ideal: 170 }
    ],
    caloriesPerMin: 2,
    description: "Stand tall, hinge forward at hips reaching toward toes. Stretches hamstrings and lower back."
  },
  {
    id: "stretch-quad",
    name: "Quad Stretch",
    emoji: "🦵",
    category: "Stretch",
    premium: false,
    difficulty: "easy",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Pull heel to glute", ideal: 45 },
      { joint: "hip", rule: "Push hips slightly forward", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Stand on one leg, pull other foot toward glute. Essential quad and hip flexor stretch."
  },
  {
    id: "stretch-shoulder",
    name: "Shoulder Stretch",
    emoji: "🤲",
    category: "Stretch",
    premium: false,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 30,
    upThreshold: 90,
    form: [
      { joint: "shoulder", rule: "Pull arm across chest gently", ideal: 90 },
      { joint: "elbow", rule: "Keep arm at chest height", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Pull one arm across your body with the other. Relieves shoulder tension and improves mobility."
  },
  {
    id: "stretch-catcow",
    name: "Cat-Cow Stretch",
    emoji: "🐱",
    category: "Stretch",
    premium: false,
    difficulty: "easy",
    track: "spine",
    downThreshold: 120,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Alternate arching and rounding back", ideal: 180 },
      { joint: "hip", rule: "Keep hips directly over knees", ideal: 90 }
    ],
    caloriesPerMin: 3,
    description: "On all fours, alternate between arching (cow) and rounding (cat) your spine. Spinal mobility."
  },
  {
    id: "stretch-forwardbend",
    name: "Seated Forward Bend",
    emoji: "🪑",
    category: "Stretch",
    premium: false,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Fold forward from hips", ideal: 90 },
      { joint: "knee", rule: "Keep legs extended, slight bend ok", ideal: 170 }
    ],
    caloriesPerMin: 2,
    description: "Sit with legs extended, reach forward toward toes. Deep hamstring and back stretch."
  },
  {
    id: "stretch-butterfly",
    name: "Butterfly Stretch",
    emoji: "🦋",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Press knees toward floor gently", ideal: 90 },
      { joint: "spine", rule: "Sit tall with straight back", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Sit with soles of feet together, knees out to sides. Opens hips and inner thighs."
  },
  {
    id: "stretch-piriformis",
    name: "Piriformis Stretch",
    emoji: "🍑",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Cross ankle over opposite knee", ideal: 90 },
      { joint: "knee", rule: "Gently push crossed knee away", ideal: 90 }
    ],
    caloriesPerMin: 2,
    description: "Lie on back, cross one ankle over opposite knee, pull bottom leg toward you. Deep glute stretch."
  },
  {
    id: "stretch-hipflexor",
    name: "Hip Flexor Stretch",
    emoji: "🦴",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Push hips forward into lunge", ideal: 170 },
      { joint: "knee", rule: "Back knee on ground", ideal: 90 }
    ],
    caloriesPerMin: 2,
    description: "Kneel in lunge position, push hips forward. Essential for counteracting sitting all day."
  },
  {
    id: "stretch-neck",
    name: "Neck Stretch",
    emoji: "🦒",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 120,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Tilt head gently to each side", ideal: 120 },
      { joint: "shoulder", rule: "Keep shoulders relaxed down", ideal: 180 }
    ],
    caloriesPerMin: 1,
    description: "Gently tilt head to each side, holding for a stretch. Relieves neck tension and headaches."
  },
  {
    id: "stretch-wrist",
    name: "Wrist Stretch",
    emoji: "✋",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Extend arm and flex wrist", ideal: 180 },
      { joint: "shoulder", rule: "Keep arm at shoulder height", ideal: 90 }
    ],
    caloriesPerMin: 1,
    description: "Extend arm, use other hand to flex wrist up and down. Essential for desk workers."
  },
  {
    id: "stretch-anklecircles",
    name: "Ankle Circles",
    emoji: "🔄",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "ankle",
    downThreshold: 70,
    upThreshold: 150,
    form: [
      { joint: "ankle", rule: "Make slow full circles", ideal: 120 },
      { joint: "knee", rule: "Keep leg stable, only ankle moves", ideal: 180 }
    ],
    caloriesPerMin: 1,
    description: "Lift one foot and rotate ankle in circles both directions. Improves ankle mobility."
  },
  {
    id: "stretch-cobra",
    name: "Cobra Stretch",
    emoji: "🐍",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 60,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Lift chest using back muscles", ideal: 160 },
      { joint: "hip", rule: "Keep hips on the ground", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Lie face down, press hands down to lift chest. Stretches abs and opens chest."
  },
  {
    id: "stretch-childspose",
    name: "Child's Pose Stretch",
    emoji: "🧒",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 60,
    upThreshold: 120,
    form: [
      { joint: "hip", rule: "Sit back fully on heels", ideal: 60 },
      { joint: "spine", rule: "Reach arms forward and relax", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Kneel, sit back on heels, fold forward with arms extended. Gentle back and shoulder stretch."
  },
  {
    id: "stretch-pigeon",
    name: "Pigeon Pose Stretch",
    emoji: "🕊️",
    category: "Stretch",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Square hips to front", ideal: 180 },
      { joint: "knee", rule: "Front knee at comfortable angle", ideal: 90 }
    ],
    caloriesPerMin: 2,
    description: "From plank, bring knee forward behind wrist, extend back leg. Deep hip and glute stretch."
  },
  {
    id: "stretch-figurefour",
    name: "Figure Four",
    emoji: "4️⃣",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Cross ankle over opposite knee", ideal: 90 },
      { joint: "knee", rule: "Pull legs toward chest gently", ideal: 90 }
    ],
    caloriesPerMin: 2,
    description: "Lie on back, cross ankle over opposite thigh, pull legs in. Deep glute and hip stretch."
  },
  {
    id: "stretch-lunge",
    name: "Lunge Stretch",
    emoji: "🦵",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Sink into deep lunge", ideal: 90 },
      { joint: "knee", rule: "Front knee over ankle", ideal: 90 }
    ],
    caloriesPerMin: 2,
    description: "Step into deep lunge position and hold. Stretches hip flexors and psoas."
  },
  {
    id: "stretch-tricep",
    name: "Tricep Stretch",
    emoji: "💪",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Reach elbow behind head", ideal: 180 },
      { joint: "elbow", rule: "Gently push elbow down", ideal: 90 }
    ],
    caloriesPerMin: 1,
    description: "Reach one hand behind head, use other hand to gently press elbow down. Stretches triceps."
  },
  {
    id: "stretch-sidebend",
    name: "Side Bend",
    emoji: "↗️",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 120,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Bend directly to the side", ideal: 120 },
      { joint: "hip", rule: "Keep hips squared forward", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Stand tall, reach one arm overhead and bend to the opposite side. Stretches obliques."
  },
  {
    id: "stretch-spinaltwist",
    name: "Spinal Twist",
    emoji: "🔄",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "spine",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Rotate torso gently", ideal: 90 },
      { joint: "hip", rule: "Keep both shoulders on floor", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Lie on back, drop bent knees to one side. Releases lower back and rotates spine."
  },
  {
    id: "stretch-wallcalf",
    name: "Wall Calf Stretch",
    emoji: "🧱",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "ankle",
    downThreshold: 70,
    upThreshold: 150,
    form: [
      { joint: "ankle", rule: "Press heel toward floor against wall", ideal: 150 },
      { joint: "knee", rule: "Keep back leg straight", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Press ball of foot against wall, lean forward with heel down. Deep calf stretch."
  },
  {
    id: "stretch-chestopener",
    name: "Chest Opener",
    emoji: "🔓",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "shoulder",
    downThreshold: 60,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Open arms wide behind you", ideal: 180 },
      { joint: "spine", rule: "Lift chest and squeeze shoulder blades", ideal: 160 }
    ],
    caloriesPerMin: 2,
    description: "Clasp hands behind back, lift and open chest. Counteracts hunched posture."
  },
  {
    id: "stretch-foamroll",
    name: "Foam Roll",
    emoji: "🧹",
    category: "Stretch",
    premium: true,
    difficulty: "easy",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Roll slowly over tight areas", ideal: 160 },
      { joint: "knee", rule: "Support body weight with arms", ideal: 90 }
    ],
    caloriesPerMin: 3,
    description: "Use foam roller to massage tight muscles by rolling slowly. Self-myofascial release."
  },
  {
    id: "stretch-itband",
    name: "IT Band Stretch",
    emoji: "🦵",
    category: "Stretch",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Cross legs and lean to side", ideal: 120 },
      { joint: "knee", rule: "Keep legs straight", ideal: 180 }
    ],
    caloriesPerMin: 2,
    description: "Cross one leg behind the other, lean to the opposite side. Stretches the IT band."
  },
  {
    id: "stretch-frog",
    name: "Frog Stretch",
    emoji: "🐸",
    category: "Stretch",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "hip", rule: "Open knees wide, sit back", ideal: 90 },
      { joint: "knee", rule: "Keep feet in line with knees", ideal: 90 }
    ],
    caloriesPerMin: 2,
    description: "On all fours, spread knees wide and sit back toward heels. Deep inner thigh and hip opener."
  },
  {
    id: "stretch-scorpion",
    name: "Scorpion Stretch",
    emoji: "🦂",
    category: "Stretch",
    premium: true,
    difficulty: "medium",
    track: "spine",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "spine", rule: "Rotate to bring foot toward opposite hand", ideal: 90 },
      { joint: "hip", rule: "Keep opposite shoulder on ground", ideal: 180 }
    ],
    caloriesPerMin: 3,
    description: "Lie face down, reach one foot toward opposite hand. Dynamic stretch for core and hips."
  },

  // ==========================================
  // STRENGTH (25 exercises, 5 free)
  // ==========================================
  {
    id: "strength-gobletsquat",
    name: "Goblet Squat",
    emoji: "🏆",
    category: "Strength",
    premium: false,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Squat deep with weight at chest", ideal: 90 },
      { joint: "back", rule: "Keep chest up and elbows in", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Hold dumbbell or kettlebell at chest, squat down between knees. Great for depth and form."
  },
  {
    id: "strength-pushupvariation",
    name: "Push-Up Variation",
    emoji: "💪",
    category: "Strength",
    premium: false,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Lower chest to floor with control", ideal: 90 },
      { joint: "back", rule: "Maintain rigid plank position", ideal: 180 }
    ],
    caloriesPerMin: 8,
    description: "Advanced push-up variations including diamond, wide, and decline. Upper body strength builder."
  },
  {
    id: "strength-pullup",
    name: "Pull-Up",
    emoji: "🔝",
    category: "Strength",
    premium: false,
    difficulty: "hard",
    track: "elbow",
    downThreshold: 120,
    upThreshold: 170,
    form: [
      { joint: "elbow", rule: "Pull chin above bar", ideal: 160 },
      { joint: "shoulder", rule: "Engage lats fully at top", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "Hang from bar with overhand grip, pull body up until chin clears bar. Ultimate back exercise."
  },
  {
    id: "strength-kettlebellswing",
    name: "Kettlebell Swing",
    emoji: "🔔",
    category: "Strength",
    premium: false,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Hinge at hips, snap to standing", ideal: 180 },
      { joint: "knee", rule: "Minimal knee bend, hip dominant", ideal: 150 }
    ],
    caloriesPerMin: 12,
    description: "Hinge at hips, swing kettlebell to eye level using hip power. Explosive hip hinge movement."
  },
  {
    id: "strength-overheadpress",
    name: "Overhead Press",
    emoji: "🏋️",
    category: "Strength",
    premium: false,
    difficulty: "medium",
    track: "shoulder",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "shoulder", rule: "Press weight to full lockout overhead", ideal: 180 },
      { joint: "back", rule: "Brace core, avoid excessive lean", ideal: 180 }
    ],
    caloriesPerMin: 8,
    description: "Press barbell or dumbbells from shoulders to full overhead extension. Shoulder strength standard."
  },
  {
    id: "strength-frontsquat",
    name: "Front Squat",
    emoji: "🏋️",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Squat to parallel or below", ideal: 90 },
      { joint: "back", rule: "Keep chest up with front rack position", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "Barbell in front rack position, squat deep while keeping torso upright. Quad-dominant squat."
  },
  {
    id: "strength-sumodeadlift",
    name: "Sumo Deadlift",
    emoji: "🏋️",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Wide stance, hinge to bar", ideal: 90 },
      { joint: "knee", rule: "Knees track over toes in wide stance", ideal: 90 }
    ],
    caloriesPerMin: 10,
    description: "Deadlift with wide stance and narrow grip. Targets glutes and inner thighs more than conventional."
  },
  {
    id: "strength-renegaderow",
    name: "Renegade Row",
    emoji: "🚣",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Row dumbbell to hip while in plank", ideal: 90 },
      { joint: "hip", rule: "Resist rotation of hips", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "Plank on dumbbells, row one at a time while stabilizing. Full body strength and anti-rotation."
  },
  {
    id: "strength-thruster",
    name: "Thruster",
    emoji: "🚀",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "knee", rule: "Full squat then press overhead", ideal: 90 },
      { joint: "shoulder", rule: "Press at top of squat", ideal: 180 }
    ],
    caloriesPerMin: 13,
    description: "Front squat into overhead press in one fluid motion. Full body power and conditioning."
  },
  {
    id: "strength-turkishgetup",
    name: "Turkish Get-Up",
    emoji: "🇹🇷",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "shoulder",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "shoulder", rule: "Keep weight locked out overhead", ideal: 180 },
      { joint: "spine", rule: "Move with control through each step", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "From lying down holding weight overhead, stand up then return. Total body stability and strength."
  },
  {
    id: "strength-cleanandpress",
    name: "Clean and Press",
    emoji: "🏋️",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Explosively extend hips to clean", ideal: 180 },
      { joint: "shoulder", rule: "Press overhead after catching", ideal: 180 }
    ],
    caloriesPerMin: 12,
    description: "Lift bar from floor to shoulders (clean), then press overhead. Olympic-style full body lift."
  },
  {
    id: "strength-snatch",
    name: "Snatch",
    emoji: "🏋️",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Explosively extend and pull under", ideal: 180 },
      { joint: "shoulder", rule: "Lock out overhead in squat", ideal: 180 }
    ],
    caloriesPerMin: 13,
    description: "Lift barbell from floor to overhead in one explosive movement. The most technical lift."
  },
  {
    id: "strength-weightedlunge",
    name: "Weighted Lunge",
    emoji: "🦵",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Front knee at 90 degrees", ideal: 90 },
      { joint: "back", rule: "Keep torso upright with weight", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Lunge with dumbbells or barbell. Builds single-leg strength and stability."
  },
  {
    id: "strength-farmercarry",
    name: "Farmer Carry",
    emoji: "🚜",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "spine",
    downThreshold: 160,
    upThreshold: 180,
    form: [
      { joint: "spine", rule: "Walk tall with perfect posture", ideal: 180 },
      { joint: "shoulder", rule: "Keep shoulders back and down", ideal: 180 }
    ],
    caloriesPerMin: 8,
    description: "Carry heavy weights at sides and walk for distance. Functional grip and core strength."
  },
  {
    id: "strength-sledpush",
    name: "Sled Push",
    emoji: "🛷",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 140,
    form: [
      { joint: "knee", rule: "Drive through with powerful strides", ideal: 120 },
      { joint: "hip", rule: "Stay low, lean into sled", ideal: 120 }
    ],
    caloriesPerMin: 14,
    description: "Push weighted sled across floor with maximum effort. Full body power and conditioning."
  },
  {
    id: "strength-battleropes",
    name: "Battle Ropes",
    emoji: "〰️",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "shoulder",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "shoulder", rule: "Create waves with full arm extension", ideal: 120 },
      { joint: "hip", rule: "Stay in athletic stance", ideal: 135 }
    ],
    caloriesPerMin: 12,
    description: "Create alternating waves with heavy ropes. Upper body endurance and cardio combined."
  },
  {
    id: "strength-boxsquat",
    name: "Box Squat",
    emoji: "📦",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Sit to box, pause, then drive up", ideal: 90 },
      { joint: "back", rule: "Keep chest up, sit back into box", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Squat down to a box, pause, then explode up. Builds starting strength and proper depth."
  },
  {
    id: "strength-zerchersquat",
    name: "Zercher Squat",
    emoji: "🤗",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Squat deep with bar in elbow crease", ideal: 90 },
      { joint: "back", rule: "Keep extremely upright torso", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "Hold barbell in elbow crease and squat. Forces upright posture and builds incredible core strength."
  },
  {
    id: "strength-deficitdeadlift",
    name: "Deficit Deadlift",
    emoji: "📏",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Stand on plate for increased range", ideal: 90 },
      { joint: "back", rule: "Maintain flat back from lower position", ideal: 180 }
    ],
    caloriesPerMin: 11,
    description: "Deadlift while standing on a raised platform. Increases range of motion and starting strength."
  },
  {
    id: "strength-pausedbench",
    name: "Paused Bench Press",
    emoji: "⏸️",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Pause at chest for 2 seconds", ideal: 90 },
      { joint: "shoulder", rule: "Stay tight during pause", ideal: 160 }
    ],
    caloriesPerMin: 8,
    description: "Bench press with a 2-second pause at the bottom. Eliminates momentum, builds pure strength."
  },
  {
    id: "strength-rackpull",
    name: "Rack Pull",
    emoji: "🏋️",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "hip",
    downThreshold: 120,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Pull from pins at knee height", ideal: 120 },
      { joint: "back", rule: "Drive hips through at lockout", ideal: 180 }
    ],
    caloriesPerMin: 9,
    description: "Partial deadlift from raised starting position. Overload the top range of the deadlift."
  },
  {
    id: "strength-pinpress",
    name: "Pin Press",
    emoji: "📌",
    category: "Strength",
    premium: true,
    difficulty: "medium",
    track: "elbow",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Press from pins in rack", ideal: 90 },
      { joint: "shoulder", rule: "Drive hard from dead stop", ideal: 160 }
    ],
    caloriesPerMin: 8,
    description: "Bench press from pins set at mid-range. Builds explosive pressing power from a dead stop."
  },
  {
    id: "strength-bandedcurl",
    name: "Banded Curl",
    emoji: "🏋️",
    category: "Strength",
    premium: true,
    difficulty: "easy",
    track: "elbow",
    downThreshold: 40,
    upThreshold: 160,
    form: [
      { joint: "elbow", rule: "Curl against band resistance", ideal: 45 },
      { joint: "shoulder", rule: "Keep elbows pinned to sides", ideal: 180 }
    ],
    caloriesPerMin: 5,
    description: "Step on resistance band and curl handles up. Variable resistance throughout the movement."
  },
  {
    id: "strength-chainsquat",
    name: "Chain Squat",
    emoji: "⛓️",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "knee",
    downThreshold: 90,
    upThreshold: 160,
    form: [
      { joint: "knee", rule: "Squat with chains for accommodating resistance", ideal: 90 },
      { joint: "back", rule: "Keep chest up throughout", ideal: 180 }
    ],
    caloriesPerMin: 10,
    description: "Barbell squat with chains attached. Weight increases as you stand, matching strength curve."
  },
  {
    id: "strength-atlasstone",
    name: "Atlas Stone",
    emoji: "🪨",
    category: "Strength",
    premium: true,
    difficulty: "hard",
    track: "hip",
    downThreshold: 90,
    upThreshold: 170,
    form: [
      { joint: "hip", rule: "Lap stone then extend hips violently", ideal: 180 },
      { joint: "back", rule: "Keep chest over stone initially", ideal: 120 }
    ],
    caloriesPerMin: 13,
    description: "Lift a heavy round stone from floor to chest or over platform. Strongman event staple."
  }
];

export const categories = ["Home", "Gym", "Yoga", "Cardio", "Stretch", "Strength"];

export const categoryEmojis = {
  Home: "🏠",
  Gym: "🏋️",
  Yoga: "🧘",
  Cardio: "🏃",
  Stretch: "🤸",
  Strength: "💪"
};

export default exercises;
