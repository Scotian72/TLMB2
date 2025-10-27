/* @tlos:6.2
 * role: core
 * name: constants.js
 * reads: none
 * writes: window.TallyLax.Constants
 * contracts: defines all game constants, Box Lacrosse rules, immutable
 */

(function() {
    'use strict';
    
    window.TallyLax = window.TallyLax || {};
    
    var Constants = {
        // Version
        VERSION: '6.2.0',
        
        // Box Lacrosse Specific
        RUNNERS_PER_LINE: 5,
        GOALIES_PER_TEAM_MIN: 2,
        GOALIES_PER_TEAM_MAX: 3,
        BENCH_SIZE_MIN: 12,
        BENCH_SIZE_MAX: 18,
        FACEOFFS_PER_GAME: 20,
        TARGET_SHOTS_PER_TEAM: 35,
        SCORE_BAND_MIN: 8,
        SCORE_BAND_MAX: 18,
        
        // Divisions (Box Lacrosse youth system)
        DIVISIONS: ['U9', 'U11', 'U13', 'U15', 'U17'],
        
        // Levels per division
        LEVELS: ['A', 'B'],
        
        // U9 is special - Academy only, no inter-org competition
        U9_ACADEMY_ONLY: true,
        
        // Season Structure
        SEASON_DAYS: 200,
        TRAINING_CAMP_DAYS: 7,
        REGULAR_SEASON_GAMES: 48,
        GAMES_PER_WEEK_TARGET: 2.5, // Average over season
        
        // Training
        TRAINING_WEEKS: 28,
        CLINIC_BONUS_U9: 1.5,
        
        // 12 Organizations (Maritime region)
        ORGANIZATIONS: [
            'Hawks',
            'Owls', 
            'Eagles',
            'Lynx',
            'Wolves',
            'Coyotes',
            'Moose',
            'Bears',
            'Beavers',
            'Otters',
            'Ravens',
            'Foxes'
        ],
        
        // Attribute Bounds
        ATTR_MIN: 0,
        ATTR_MAX: 99,
        
        // Rating Bounds (derived from attrs)
        RATING_MIN: 0,
        RATING_MAX: 10,
        
        // OVR Bounds (division-calibrated)
        OVR_MIN: 20,
        OVR_MAX: 99,
        
        // Morale Bounds
        MORALE_MIN: 0,
        MORALE_MAX: 100,
        MORALE_START: 70,
        PARENT_MORALE_START: 70,
        
        // Runner Attributes (13 total)
        RUNNER_ATTRS: [
            'finishing',
            'shootingPower',
            'passing',
            'vision',
            'transSpeed',
            'endurance',
            'balance',
            'defenseIQ',
            'checking',
            'stickLift',
            'faceoff',
            'tenacity',
            'discipline'
        ],
        
        // Goalie Attributes (10 total)
        GOALIE_ATTRS: [
            'reflexes',
            'angles',
            'reboundControl',
            'handSpeed',
            'agility',
            'positioning',
            'communication',
            'stickSkills',
            'clutch',
            'consistency'
        ],
        
        // Hidden Attributes (affect development/performance)
        HIDDEN_ATTRS: [
            'consistency',
            'injuryProne',
            'growthCeiling',
            'workEthic'
        ],
        
        // Positions
        POSITIONS: {
            RUNNER: ['LW', 'RW', 'C', 'LD', 'RD'],
            GOALIE: ['G']
        },
        
        // Phase Names
        PHASES: {
            SETUP: 'setup',
            TRAINING_CAMP: 'camp',
            REGULAR_SEASON: 'season',
            TOURNAMENT: 'tournament',
            PLAYOFFS: 'playoffs',
            OFFSEASON: 'offseason'
        },
        
        // Goalie Rotation Strategies
        GOALIE_ROTATIONS: {
            ALTERNATE: 'alternate',
            BALANCED: 'balanced',
            HOT_HAND: 'hothand'
        },
        
        // File Size Limits
        MAX_FILE_LINES: 500,
        WARN_FILE_LINES: 400,
        
        // Performance Targets
        TARGET_MS_PER_DAY: 200,
        
        // Box Lacrosse Terms (for UI/commentary)
        BOX_TERMS: {
            SURFACE: 'floor',
            PLAYER: 'runner',
            GOAL_AREA: 'crease',
            WALLS: 'boards',
            VIOLATION: 'crease violation',
            SHOT_TYPE: 'short-stick shot',
            DEFENSIVE_MOVE: 'stick check'
        },
        
        // Calendar Segments
        CALENDAR_SEGMENTS: [
            { start: 1, end: 7, phase: 'camp', label: 'Training Camp' },
            { start: 8, end: 50, phase: 'season', label: 'Regular Season - Segment 1' },
            { start: 51, end: 80, phase: 'season', label: 'Regular Season - Segment 2' },
            { start: 81, end: 85, phase: 'tournament', label: 'LaxFest Tournament' },
            { start: 86, end: 130, phase: 'season', label: 'Regular Season - Segment 3' },
            { start: 131, end: 135, phase: 'tournament', label: 'Founders Cup' },
            { start: 136, end: 165, phase: 'season', label: 'Regular Season - Segment 4' },
            { start: 166, end: 185, phase: 'playoffs', label: 'Playoffs' },
            { start: 186, end: 200, phase: 'offseason', label: 'Season Review' }
        ],
        
        // Error Codes
        ERRORS: {
            E_KEYS_001: 'Invalid composite key format',
            E_STATE_000: 'Missing GameState',
            E_STATE_030: 'Missing division roster',
            E_MOD_001: 'Required module missing',
            E_LINES_020: 'Lines incomplete or missing starter goalie',
            E_SCHED_010: 'Team double-booked on day',
            E_SIM_040: 'Empty runners or invalid sim inputs',
            E_SAVE_050: 'Save/load migration mismatch'
        }
    };
    
    // Clamp utility (used throughout)
    Constants.clamp = function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    };
    
    // Export
    window.TallyLax.Constants = Constants;
    
    console.log('âœ… Constants loaded (v' + Constants.VERSION + ')');
    
})();
