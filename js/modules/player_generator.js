// js/modules/player_generator.js
// Generate players for all divisions

(function() {
  'use strict';
  
  window.TallyLax = window.TallyLax || {};
  var TL = window.TallyLax;
  
  var PlayerGenerator = {
    playerIdCounter: 1,
    
    /**
     * Generate a complete roster for an organization's division
     */
    generateDivisionRoster: function(org, division) {
      var counts = this.getRosterCounts(division);
      var players = [];
      
      // Generate runners
      for (var i = 0; i < counts.runners; i++) {
        players.push(this.generateRunner(org, division));
      }
      
      // Generate goalies
      for (var j = 0; j < counts.goalies; j++) {
        players.push(this.generateGoalie(org, division));
      }
      
      console.log('[PlayerGen] Generated ' + division + ' roster: ' + counts.runners + ' runners + ' + counts.goalies + ' goalies = ' + players.length + ' total');
      
      return players;
    },
    
    /**
     * Get roster counts by division
     */
    getRosterCounts: function(division) {
      var counts = {
        U9: { runners: 50, goalies: 4 },
        U11: { runners: 45, goalies: 4 },
        U13: { runners: 35, goalies: 3 },
        U15: { runners: 35, goalies: 3 },
        U17: { runners: 30, goalies: 2 }
      };
      
      return counts[division] || { runners: 30, goalies: 2 };
    },
    
    /**
     * Generate a runner
     */
    generateRunner: function(org, division) {
      var baseRating = this.getBaseRating(division);
      var variance = 15;
      
      var player = {
        id: 'p' + this.playerIdCounter++,
        firstName: this.randomFirstName(),
        lastName: this.randomLastName(),
        org: org,
        division: division,
        position: 'Runner',
        team: null,
        level: null,
        jersey: null,
        jerseyFavorites: [],
        
        // Runner attributes (12)
        shootingAcc: this.randomAttr(baseRating, variance),
        shootingPower: this.randomAttr(baseRating, variance),
        passing: this.randomAttr(baseRating, variance),
        vision: this.randomAttr(baseRating, variance),
        transSpeed: this.randomAttr(baseRating, variance),
        endurance: this.randomAttr(baseRating, variance),
        ballControl: this.randomAttr(baseRating, variance),
        defenseIQ: this.randomAttr(baseRating, variance),
        checking: this.randomAttr(baseRating, variance),
        faceoff: this.randomAttr(baseRating, variance),
        tenacity: this.randomAttr(baseRating, variance),
        discipline: this.randomAttr(baseRating, variance),
        
        traits: [],
        parentTraits: [],
        
        morale: 70,
        parentMorale: 70,
        
        seasonStats: this.createEmptyStats(false),
        exhibitionStats: this.createEmptyStats(false),
        careerStats: this.createEmptyStats(false),
        
        devLog: [],
        rookie: true
      };
      
      // Calculate OVR
      player.overall = this.calculateRunnerOVR(player);
      player.ovr = player.overall;
      
      return player;
    },
    
    /**
     * Generate a goalie
     */
    generateGoalie: function(org, division) {
      var baseRating = this.getBaseRating(division);
      var variance = 15;
      
      var player = {
        id: 'p' + this.playerIdCounter++,
        firstName: this.randomFirstName(),
        lastName: this.randomLastName(),
        org: org,
        division: division,
        position: 'G',
        team: null,
        level: null,
        jersey: null,
        jerseyFavorites: [],
        
        // Goalie attributes (10)
        reflexes: this.randomAttr(baseRating, variance),
        angles: this.randomAttr(baseRating, variance),
        reboundControl: this.randomAttr(baseRating, variance),
        handSpeed: this.randomAttr(baseRating, variance),
        agility: this.randomAttr(baseRating, variance),
        positioning: this.randomAttr(baseRating, variance),
        communication: this.randomAttr(baseRating, variance),
        stickSkills: this.randomAttr(baseRating, variance),
        clutch: this.randomAttr(baseRating, variance),
        consistency: this.randomAttr(baseRating, variance),
        
        traits: [],
        parentTraits: [],
        
        morale: 70,
        parentMorale: 70,
        
        seasonStats: this.createEmptyStats(true),
        exhibitionStats: this.createEmptyStats(true),
        careerStats: this.createEmptyStats(true),
        
        devLog: [],
        rookie: true
      };
      
      // Calculate OVR
      player.overall = this.calculateGoalieOVR(player);
      player.ovr = player.overall;
      
      return player;
    },
    
    /**
     * Get base rating by division
     */
    getBaseRating: function(division) {
      var bases = {
        U9: 35,
        U11: 45,
        U13: 55,
        U15: 60,
        U17: 65
      };
      return bases[division] || 50;
    },
    
    /**
     * Generate random attribute value
     */
    randomAttr: function(base, variance) {
      var value = base + Math.floor(Math.random() * variance) - Math.floor(variance / 2);
      return Math.max(20, Math.min(85, value));
    },
    
    /**
     * Calculate runner OVR
     */
    calculateRunnerOVR: function(player) {
      var sum = (player.shootingAcc || 50) + (player.shootingPower || 50) + 
                (player.passing || 50) + (player.vision || 50) + 
                (player.transSpeed || 50) + (player.endurance || 50) + 
                (player.ballControl || 50) + (player.defenseIQ || 50) + 
                (player.checking || 50) + (player.faceoff || 50) + 
                (player.tenacity || 50) + (player.discipline || 50);
      return Math.round(sum / 12);
    },
    
    /**
     * Calculate goalie OVR
     */
    calculateGoalieOVR: function(player) {
      var sum = (player.reflexes || 50) + (player.angles || 50) + 
                (player.reboundControl || 50) + (player.handSpeed || 50) + 
                (player.agility || 50) + (player.positioning || 50) + 
                (player.communication || 50) + (player.stickSkills || 50) + 
                (player.clutch || 50) + (player.consistency || 50);
      return Math.round(sum / 10);
    },
    
    /**
     * Create empty stats object
     */
    createEmptyStats: function(isGoalie) {
      if (isGoalie) {
        return {
          GP: 0, W: 0, L: 0, T: 0,
          SA: 0, SV: 0, GA: 0
        };
      } else {
        return {
          GP: 0, G: 0, A: 0, S: 0, SOG: 0,
          LB: 0, CTO: 0, TO: 0, PIM: 0,
          FOT: 0, FOW: 0
        };
      }
    },
    
    /**
     * Random first name
     */
    randomFirstName: function() {
      var names = ['Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
                   'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo',
                   'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew'];
      return names[Math.floor(Math.random() * names.length)];
    },
    
    /**
     * Random last name
     */
    randomLastName: function() {
      var names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                   'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                   'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
      return names[Math.floor(Math.random() * names.length)];
    },
    
    /**
     * Generate all rosters for an organization
     */
    generateOrganizationRosters: function(org) {
      var state = TL.GameState;
      var divisions = ['U9', 'U11', 'U13', 'U15', 'U17'];
      
      divisions.forEach(function(div) {
        var roster = this.generateDivisionRoster(org, div);
        
        if (org === state.user.org) {
          // User's team
          state.divisions[div].players = roster;
        } else {
          // Opponent team
          if (!state.opponentRosters[org]) {
            state.opponentRosters[org] = {};
          }
          state.opponentRosters[org][div] = roster;
        }
      }.bind(this));
      
      console.log('✓ Generated rosters for ' + org);
    }
  };
  
  window.TallyLax.PlayerGenerator = PlayerGenerator;
  console.log('✅ PlayerGenerator loaded (v6.2)');
})();
