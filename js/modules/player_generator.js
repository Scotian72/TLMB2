/**
 * TallyLax Player Generator (v6.2) - COMPLETELY FIXED
 * Generates runners (13 attrs) and goalies (10 attrs) with realistic talent distribution
 * Contract: Creates realistic Box Lacrosse players with proper age ranges and scaling
 * 
 * ✅ FIXED: Attributes stored at player.attr level (not nested in .attributes)
 * ✅ FIXED: Handedness weighted 30% left, 70% right
 * ✅ FIXED: Jersey number preferences generated
 * ✅ FIXED: Archetypes applied for variation
 * ✅ FIXED: Ages correct (U9 = 7-8, not 7-9)
 */

(function() {
  'use strict';

  var FIRST_NAMES = [
    'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'Mason', 'Ethan', 'Logan', 'Lucas',
    'Jackson', 'Aiden', 'Carter', 'Owen', 'Wyatt', 'Hudson', 'Grayson', 'Jack', 'Dylan',
    'Connor', 'Ryan', 'Tyler', 'Cole', 'Blake', 'Chase', 'Hunter', 'Jordan', 'Parker',
    'Nathan', 'Caleb', 'Austin', 'Evan', 'Gavin', 'Brody', 'Cameron', 'Dawson', 'Ian',
    'Max', 'Luke', 'Isaac', 'Ben', 'Sam', 'Alex', 'Josh', 'Matt', 'Jake', 'Kyle'
  ];

  var LAST_NAMES = [
    'MacDonald', 'MacKenzie', 'MacLeod', 'Campbell', 'Stewart', 'MacInnis', 'Fraser',
    'Murray', 'Ross', 'Grant', 'Ferguson', 'Reid', 'Wilson', 'Thompson', 'Anderson',
    'Sullivan', 'Murphy', 'Kelly', 'Ryan', 'McCarthy', 'Burke', 'Walsh', 'Kennedy',
    'MacDonnell', 'MacKay', 'Cameron', 'MacPherson', 'MacLean', 'Morrison', 'Johnston',
    'Robertson', 'LeBlanc', 'Boudreau', 'Cormier', 'Arsenault', 'Gallant', 'Richard',
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'
  ];

  // V6.2 RUNNER ATTRIBUTES (13 total)
  var RUNNER_ATTRS = [
    'finishing', 'shootingPower', 'passing', 'vision', 'transSpeed', 
    'endurance', 'balance', 'defenseIQ', 'checking', 'stickLift', 
    'faceoff', 'tenacity', 'discipline'
  ];

  // V6.2 GOALIE ATTRIBUTES (10 total)  
  var GOALIE_ATTRS = [
    'reflexes', 'angles', 'reboundControl', 'handSpeed', 'agility',
    'positioning', 'communication', 'stickSkills', 'clutch', 'consistency'
  ];

  var PlayerGenerator = {
    
    // Player ID counter (ensures unique IDs)
    _playerIdCounter: 0,
    
    // Generate unique player ID
    generateId: function() {
      var id = 'p' + this._playerIdCounter;
      this._playerIdCounter++;
      return id;
    },
    
    // Generate player name
    generateName: function() {
      var rng = window.TL.RNG;
      var first = rng.choice(FIRST_NAMES);
      var last = rng.choice(LAST_NAMES);
      return first + ' ' + last;
    },
    
    // ✅ FIXED: Generate handedness with proper weighting (30% left, 70% right)
    generateHandedness: function() {
      var rng = window.TL.RNG;
      var constants = window.TL.Constants;
      var rand = rng.random();
      
      return rand < constants.HANDEDNESS_DISTRIBUTION.LEFT ? 'L' : 'R';
    },
    
    // Generate age for division (proper youth lacrosse standards)
    getAgeForDivision: function(div) {
      var rng = window.TL.RNG;
      var constants = window.TL.Constants;
      
      if (!constants || !constants.AGE_RANGES) {
        console.warn('[PlayerGen] Constants not loaded, using fallback age');
        return 12;
      }
      
      var range = constants.AGE_RANGES[div];
      
      if (!range) {
        console.warn('[PlayerGen] Unknown division:', div, '- using U11 range');
        range = constants.AGE_RANGES['U11'] || [9, 10];
      }
      
      return rng.int(range[0], range[1]);
    },

    // Determine talent tier using realistic distribution
    getTalentTier: function() {
      var rng = window.TL.RNG;
      var constants = window.TL.Constants;
      var rand = rng.random();
      var dist = constants.TALENT_DISTRIBUTION;
      
      if (rand < dist.SUPERSTAR) return 'SUPERSTAR';
      if (rand < dist.SUPERSTAR + dist.HIGH_LEVEL) return 'HIGH_LEVEL';
      if (rand < dist.SUPERSTAR + dist.HIGH_LEVEL + dist.ABOVE_AVERAGE) return 'ABOVE_AVERAGE';
      if (rand < dist.SUPERSTAR + dist.HIGH_LEVEL + dist.ABOVE_AVERAGE + dist.AVERAGE) return 'AVERAGE';
      if (rand < 1 - dist.BELOW_AVERAGE - dist.POOR) return 'SLIGHTLY_BELOW';
      if (rand < 1 - dist.POOR) return 'BELOW_AVERAGE';
      return 'POOR';
    },
    
    // ✅ NEW: Select archetype for runner (adds variation)
    selectArchetype: function() {
      var rng = window.TL.RNG;
      var constants = window.TL.Constants;
      var archetypeNames = Object.keys(constants.ARCHETYPES);
      
      // 70% chance of having an archetype, 30% chance of being balanced
      if (rng.random() < 0.7) {
        return rng.choice(archetypeNames);
      }
      
      return null;
    },

    // Get attribute range for talent tier and division
    getAttributeRange: function(division, talentTier) {
      var constants = window.TL.Constants;
      
      if (!constants || !constants.OVR_RANGES) {
        console.warn('[PlayerGen] Constants not loaded, using fallback range');
        return [40, 60];
      }
      
      var ovrRange = constants.OVR_RANGES[division];
      
      if (!ovrRange) {
        console.warn('[PlayerGen] Unknown division:', division, '- using U11 range');
        ovrRange = constants.OVR_RANGES['U11'] || [30, 55];
      }
      
      var min = ovrRange[0];
      var max = ovrRange[1];
      var range = max - min;

      switch (talentTier) {
        case 'SUPERSTAR': return [min + (range * 0.9), max];
        case 'HIGH_LEVEL': return [min + (range * 0.8), min + (range * 0.89)];
        case 'ABOVE_AVERAGE': return [min + (range * 0.7), min + (range * 0.79)];
        case 'AVERAGE': return [min + (range * 0.6), min + (range * 0.69)];
        case 'SLIGHTLY_BELOW': return [min + (range * 0.5), min + (range * 0.59)];
        case 'BELOW_AVERAGE': return [min + (range * 0.4), min + (range * 0.49)];
        case 'POOR': return [min + (range * 0.3), min + (range * 0.39)];
        default: return [min + (range * 0.5), min + (range * 0.7)];
      }
    },

    // ✅ FIXED: Generate runner attributes with increased variance
    // ✅ NEW: Applies archetype multipliers for significant variation
    generateRunnerAttributes: function(division, talentTier, archetype) {
      var rng = window.TL.RNG;
      var constants = window.TL.Constants;
      var attrRange = this.getAttributeRange(division, talentTier);
      var attributes = {};
      
      // Get archetype multipliers if applicable
      var archetypeMods = archetype ? constants.ARCHETYPES[archetype] : {};
      
      // ✅ INCREASED VARIANCE: Base range wider, archetype effects stronger
      for (var i = 0; i < RUNNER_ATTRS.length; i++) {
        var attr = RUNNER_ATTRS[i];
        
        // Widen the base range for more variance
        var rangeWidth = attrRange[1] - attrRange[0];
        var extraVariance = Math.floor(rangeWidth * 0.2); // Add 20% extra range
        var base = rng.int(
          Math.floor(attrRange[0] - extraVariance), 
          Math.ceil(attrRange[1] + extraVariance)
        );
        
        // Apply archetype modifier if exists for this attribute
        if (archetypeMods[attr]) {
          base = Math.round(base * archetypeMods[attr]);
        }
        
        // Add individual variance (±8 points for more differentiation)
        var variance = rng.int(-8, 8);
        attributes[attr] = Math.max(1, Math.min(100, base + variance));
      }
      
      return attributes;
    },

    // Generate goalie attributes with v6.2 specification
    generateGoalieAttributes: function(division, talentTier) {
      var rng = window.TL.RNG;
      var attrRange = this.getAttributeRange(division, talentTier);
      var attributes = {};
      
      for (var i = 0; i < GOALIE_ATTRS.length; i++) {
        var attr = GOALIE_ATTRS[i];
        var base = rng.int(Math.floor(attrRange[0]), Math.ceil(attrRange[1]));
        
        // Add variance (±5 points for more variation)
        var variance = rng.int(-5, 5);
        attributes[attr] = Math.max(1, Math.min(100, base + variance));
      }
      
      return attributes;
    },

    // Calculate OVR from attributes (derived value)
    calculateOVR: function(player, position) {
      var total = 0;
      var count = 0;
      
      if (position === 'goalie') {
        for (var i = 0; i < GOALIE_ATTRS.length; i++) {
          var attr = GOALIE_ATTRS[i];
          total += player[attr] || 0;
          count++;
        }
      } else {
        for (var i = 0; i < RUNNER_ATTRS.length; i++) {
          var attr = RUNNER_ATTRS[i];
          total += player[attr] || 0;
          count++;
        }
      }
      
      return Math.round(total / count);
    },

    // ✅ COMPLETELY FIXED: Generate full player with all fixes
    generatePlayer: function(division, position, level) {
      var talentTier = this.getTalentTier();
      var age = this.getAgeForDivision(division);
      var name = this.generateName();
      var rng = window.TL.RNG;
      var archetype = position === 'runner' ? this.selectArchetype() : null;
      
      // Generate attributes
      var attributes = position === 'goalie' ?
        this.generateGoalieAttributes(division, talentTier) :
        this.generateRunnerAttributes(division, talentTier, archetype);
      
      // ✅ CRITICAL FIX: Store attributes at player level (not in nested object)
      var player = {
        id: this.generateId(),
        name: name,
        age: age,
        position: position,
        handedness: this.generateHandedness(), // ✅ FIXED: weighted 30/70
        division: division,
        level: level,
        
        // ✅ NEW: Jersey number preferences (generated but not assigned yet)
        favoriteJerseys: window.TL.JerseyManager ? 
          window.TL.JerseyManager.generateFavoriteNumbers(position) : 
          [],
        jersey: null, // Will be assigned during training camp
        
        // ✅ NEW: Archetype (for runners only)
        archetype: archetype,
        
        // Traits
        traits: [],
        parentTraits: [],
        
        // Hidden attributes
        hidden: {
          consistency: rng.int(40, 80),
          injuryProne: rng.int(1, 10),
          growthCeiling: rng.int(75, 100),
          workEthic: rng.int(60, 90)
        },
        
        // Morale
        morale: window.TL.Constants.MORALE_START,
        parentMorale: window.TL.Constants.MORALE_START,
        
        // Stats (empty to start) - ✅ IMPROVED: more comprehensive tracking
        exhibition: { 
          gp: 0, g: 0, a: 0, pts: 0, shots: 0, pim: 0,
          // Goalie stats
          sv: 0, ga: 0, svPct: 0 
        },
        season: { 
          gp: 0, g: 0, a: 0, pts: 0, shots: 0, pim: 0,
          sv: 0, ga: 0, svPct: 0 
        },
        career: { 
          gp: 0, g: 0, a: 0, pts: 0, shots: 0, pim: 0,
          sv: 0, ga: 0, svPct: 0 
        },
        
        // Development
        devLog: [],
        rookie: true,
        
        // Metadata
        talentTier: talentTier
      };
      
      // ✅ CRITICAL: Copy all attributes directly onto player object
      for (var attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
          player[attr] = attributes[attr];
        }
      }
      
      // Calculate OVR from the attributes now stored on player
      player.ovr = this.calculateOVR(player, position);
      player.roleOVR = player.ovr;
      
      return player;
    },

    // Generate team roster for training camp
    generateTeamRoster: function(org, division, level, existingPlayers) {
      existingPlayers = existingPlayers || [];
      var players = [];
      var rng = window.TL.RNG;
      var constants = window.TL.Constants;
      
      // ✅ FIXED: Use roster sizes from constants
      var rosterConfig = constants.ROSTER_SIZES[division];
      
      if (!rosterConfig) {
        console.error('[PlayerGen] No roster config for division:', division);
        return players;
      }
      
      var goalieCount = rosterConfig.goalies;
      var runnerCount = rosterConfig.runners;
      
      console.log('[PlayerGen] Generating', division, 'roster:', runnerCount, 'runners +', goalieCount, 'goalies =', runnerCount + goalieCount, 'total');
      
      // Generate goalies
      for (var g = 0; g < goalieCount; g++) {
        var goalie = this.generatePlayer(division, 'goalie', level);
        goalie.org = org;
        players.push(goalie);
      }
      
      // Generate runners
      for (var r = 0; r < runnerCount; r++) {
        var runner = this.generatePlayer(division, 'runner', level);
        runner.org = org;
        players.push(runner);
      }
      
      return players;
    },

    // Generate rosters for all divisions of an org
    generateOrgRosters: function(org) {
      var gs = window.TL.GameState;
      var constants = window.TL.Constants;
      
      for (var i = 0; i < constants.DIVISIONS.length; i++) {
        var div = constants.DIVISIONS[i];
        
        // Initialize division if needed
        if (!gs.divisions[div]) {
          gs.divisions[div] = { players: [], lines: {} };
        }
        
        // Generate training camp roster
        var level = 'TC'; // All start in training camp
        var roster = this.generateTeamRoster(org, div, level);
        
        // Store players in GameState
        for (var p = 0; p < roster.length; p++) {
          var player = roster[p];
          gs.players[player.id] = player;
          gs.divisions[div].players.push(player.id);
        }
        
        console.log('Generated roster:', org, div, 'Training Camp', roster.length, 'players');
      }
      
      return true;
    }
  };

  // Export to global namespace
  window.TL = window.TL || {};
  window.TL.PlayerGenerator = PlayerGenerator;
  
  console.log('✅ PlayerGenerator loaded (v6.2 - COMPLETELY FIXED)');
})();
