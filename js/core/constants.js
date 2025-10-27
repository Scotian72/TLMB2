/**
 * TallyLax Constants (v6.2) - FIXED WITH TRAINING CAMP
 * Box Lacrosse organization simulator constants
 * Contract: Immutable configuration values
 */

(function() {
  'use strict';

  var Constants = {
    // Version
    VERSION: '6.2',
    
    // Divisions
    DIVISIONS: ['U9', 'U11', 'U13', 'U15', 'U17'],
    LEVELS: ['A', 'B'],
    
    // Season structure
    SEASON_LENGTH_DAYS: 200,
    REGULAR_SEASON_GAMES: 48,
    
    // 🔧 NEW: Training Camp Settings
    TRAINING_CAMP_START_DAY: 1,
    TRAINING_CAMP_END_DAY: 7,
    TRAINING_CAMP_DAYS: 7,
    
    // Box Lacrosse specific
    RUNNERS_PER_LINE: 5,
    GOALIES_PER_TEAM_MIN: 2,
    FACEOFFS_PER_GAME: 20,
    TARGET_SHOTS_PER_TEAM: 35,
    SCORE_BAND_MIN: 8,
    SCORE_BAND_MAX: 18,
    
    // Lines
    LINES_COUNT: 4,
    PP_UNITS: 1,
    PK_UNITS: 1,
    
    // Training
    TRAINING_WEEKS: 28,
    CLINIC_BONUS_U9: 1.5,
    
    // Morale
    MORALE_START: 70,
    MORALE_MIN: 0,
    MORALE_MAX: 100,
    
    // Performance bounds
    MAX_FILE_LINES: 500,
    WARN_FILE_LINES: 400,
    
    // Attribute ranges
    ATTR_MIN: 0,
    ATTR_MAX: 100,
    
    // U9 specific
    U9_ATTR_START_MIN: 5,
    U9_ATTR_START_MAX: 20,
    U9_TRACK_YEARS: 2,
    
    // Organizations
    ORGANIZATIONS: [
      'Hawks', 'Owls', 'Eagles', 'Lynx', 'Wolves', 'Coyotes',
      'Moose', 'Bears', 'Beavers', 'Otters', 'Ravens', 'Foxes'
    ],
    
    // Phases
    PHASES: {
      TRAINING_CAMP: 'training_camp',
      PRESEASON: 'preseason',
      REGULAR: 'regular',
      PLAYOFFS: 'playoffs',
      OFFSEASON: 'offseason'
    },
    
    // ✅ FIXED: Age ranges for divisions (U = Under, so max age is division - 1)
    // U9 means "Under 9" = ages 7-8
    AGE_RANGES: {
      U9: [7, 8],    // FIXED: was [7, 9]
      U11: [9, 10],   // FIXED: was [9, 11]
      U13: [11, 12],  // FIXED: was [11, 13]
      U15: [13, 14],  // FIXED: was [13, 15]
      U17: [15, 16]   // FIXED: was [15, 17]
    },
    
    // Handedness distribution (Box Lacrosse realistic)
    HANDEDNESS_DISTRIBUTION: {
      LEFT: 0.30,   // 30% left-handed
      RIGHT: 0.70   // 70% right-handed
    },
    
    // ✅ FIXED: Jersey number ranges
    JERSEY_GOALIE_NUMBERS: [0, 1, 30, 31, 32, 33, 35],
    JERSEY_RUNNER_MIN: 0,
    JERSEY_RUNNER_MAX: 99,
    
    // ✅ NEW: Roster sizes by division (training camp sizes)
    ROSTER_SIZES: {
      U9: { runners: 50, goalies: 4 },   // 54 total
      U11: { runners: 45, goalies: 4 },  // 49 total (allows 5 lines for B)
      U13: { runners: 35, goalies: 3 },  // 38 total
      U15: { runners: 35, goalies: 3 },  // 38 total  
      U17: { runners: 30, goalies: 2 }   // 32 total
    },
    
    // ✅ NEW: A/B team splits (A teams smaller after U11)
    TEAM_SPLITS: {
      U9: { A: 0, B: 0 },  // All in training camp, no split
      U11: { A: 24, B: 21 },  // 24 A runners + 21 B runners (+ 4 goalies)
      U13: { A: 15, B: 20 },  // 15 A runners + 20 B runners (1 A goalie, 2 B goalies)
      U15: { A: 15, B: 20 },  // 15 A runners + 20 B runners (1 A goalie, 2 B goalies)
      U17: { A: 12, B: 18 }   // 12 A runners + 18 B runners (+ 2 goalies)
    },
    
    // Talent Distribution (realistic probabilities)
    TALENT_DISTRIBUTION: {
      SUPERSTAR: 0.02,      // 2% - Elite talent
      HIGH_LEVEL: 0.08,     // 8% - High-level players
      ABOVE_AVERAGE: 0.15,  // 15% - Above average
      AVERAGE: 0.50,        // 50% - Average players
      SLIGHTLY_BELOW: 0.15, // 15% - Slightly below average
      BELOW_AVERAGE: 0.08,  // 8% - Below average
      POOR: 0.02            // 2% - Poor talent
    },
    
    // OVR ranges by division (Box Lacrosse youth standards)
    OVR_RANGES: {
      U9: [20, 40],
      U11: [30, 55],
      U13: [40, 70],
      U15: [50, 80],
      U17: [60, 90]
    },
    
    // Player archetypes (for generating varied players)
    ARCHETYPES: {
      SNIPER: { finishing: 1.3, shootingPower: 1.2, vision: 1.1 },
      PLAYMAKER: { passing: 1.3, vision: 1.3, finishing: 0.9 },
      POWER_FORWARD: { checking: 1.3, shootingPower: 1.2, endurance: 1.2 },
      TWO_WAY: { defenseIQ: 1.2, discipline: 1.2, transSpeed: 1.1 },
      SPEEDSTER: { transSpeed: 1.4, endurance: 1.2, balance: 1.2 },
      ENFORCER: { checking: 1.4, tenacity: 1.3, discipline: 0.8 },
      FACEOFF_SPECIALIST: { faceoff: 1.5, tenacity: 1.2 },
      DEFENSIVE_SPECIALIST: { defenseIQ: 1.3, stickLift: 1.3, checking: 1.2 }
    },
    
    // ✅ NEW: Handedness shooting bonus multipliers
    HANDEDNESS_BONUS: {
      // Lefty shooting from right side gets bonus, righty from left gets bonus
      CROSS_ICE_BONUS: 1.15,  // 15% bonus shooting accuracy cross-ice
      WEAK_SIDE_PENALTY: 0.95  // 5% penalty shooting from natural side
    }
  };

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.Constants = Constants;
  window.TL = window.TallyLax; // Alias
  
  console.log('✅ TallyLax Constants v6.2 loaded (WITH TRAINING CAMP SETTINGS)');
})();
