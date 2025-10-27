// js/modules/season_manager.js
// COMPREHENSIVE FIX: Training camp advancement, clinics, scrimmages, AI team sorting

(function() {
  'use strict';
  window.TallyLax = window.TallyLax || {};
  var TL = window.TallyLax;

  var SeasonManager = {
    
    /**
     * Advance training camp by one day
     * Runs clinics, scrimmages, and sorts teams on day 7
     */
    advanceCampDay: function() {
      var state = TL.GameState;
      if (!state) return;

      var currentDay = state.day || 1;
      console.log('🏕️ Advancing training camp from day', currentDay, 'to', currentDay + 1);

      // Run daily activities
      this.runDailyCampActivities(currentDay);

      // Advance day
      state.day = currentDay + 1;

      // On day 7, auto-sort all AI teams to A/B
      if (state.day === 7) {
        console.log('📊 Day 7: Auto-sorting all organizations to A/B teams');
        this.autoSortAllOrganizations();
      }

      // If advancing past day 7, transition to regular season
      if (state.day > 7) {
        console.log('✅ Training camp complete, transitioning to regular season');
        state.phase = 'REGULAR_SEASON';
        
        // Ensure all teams are sorted
        this.autoSortAllOrganizations();
        
        // Generate schedule
        if (TL.ScheduleSystem && TL.ScheduleSystem.generateSchedule) {
          TL.ScheduleSystem.generateSchedule();
        }
      }

      console.log('✅ Camp day advanced to', state.day);
    },

    /**
     * Run daily camp activities: clinics, scrimmages, attribute gains
     */
    runDailyCampActivities: function(day) {
      console.log('🏋️ Running camp activities for day', day);

      // Day-specific clinics
      var clinicFocus = this.getClinicFocus(day);
      if (clinicFocus) {
        console.log('  📚 Clinic focus:', clinicFocus);
        this.runClinicForAllDivisions(clinicFocus);
      }

      // Run scrimmages for each division
      var divisions = ['U9', 'U11', 'U13', 'U15', 'U17'];
      divisions.forEach(function(div) {
        this.runDivisionScrimmage(div, day);
      }.bind(this));
    },

    /**
     * Get clinic focus for specific day
     */
    getClinicFocus: function(day) {
      var clinics = {
        2: 'defense',
        4: 'offense',
        6: 'conditioning'
      };
      return clinics[day] || null;
    },

    /**
     * Run clinic for all divisions
     */
    runClinicForAllDivisions: function(focus) {
      var state = TL.GameState;
      var divisions = ['U9', 'U11', 'U13', 'U15', 'U17'];

      divisions.forEach(function(div) {
        if (!state.divisions || !state.divisions[div]) return;
        
        var players = state.divisions[div].players || [];
        players.forEach(function(player) {
          this.applyClinicGains(player, focus);
        }.bind(this));
      }.bind(this));

      console.log('  ✅ Clinic applied to all players:', focus);
    },

    /**
     * Apply clinic attribute gains
     */
    applyClinicGains: function(player, focus) {
      var gain = 1 + Math.floor(Math.random() * 2); // 1-2 points
      
      var isGoalie = player.position === 'G' || player.position === 'Goalie';

      if (focus === 'defense') {
        if (isGoalie) {
          player.positioning = Math.min(99, (player.positioning || 50) + gain);
        } else {
          player.defenseIQ = Math.min(99, (player.defenseIQ || 50) + gain);
          player.checking = Math.min(99, (player.checking || 50) + gain);
        }
      } else if (focus === 'offense') {
        if (!isGoalie) {
          player.shootingAcc = Math.min(99, (player.shootingAcc || 50) + gain);
          player.passing = Math.min(99, (player.passing || 50) + gain);
        }
      } else if (focus === 'conditioning') {
        if (isGoalie) {
          player.agility = Math.min(99, (player.agility || 50) + gain);
        } else {
          player.endurance = Math.min(99, (player.endurance || 50) + gain);
        }
      }
    },

    /**
     * Run scrimmage for a division
     */
    runDivisionScrimmage: function(division, day) {
      var state = TL.GameState;
      if (!state.divisions || !state.divisions[division]) return;

      var players = state.divisions[division].players || [];
      var runners = players.filter(function(p) { return p.position !== 'G' && p.position !== 'Goalie'; });
      var goalies = players.filter(function(p) { return p.position === 'G' || p.position === 'Goalie'; });

      if (runners.length < 10 || goalies.length < 2) {
        console.log('  ⚠️ Not enough players for', division, 'scrimmage');
        return;
      }

      // Randomly split into two teams
      var shuffled = runners.slice().sort(function() { return 0.5 - Math.random(); });
      var team1Runners = shuffled.slice(0, Math.floor(shuffled.length / 2));
      var team2Runners = shuffled.slice(Math.floor(shuffled.length / 2));

      var team1Goalie = goalies[0];
      var team2Goalie = goalies[1] || goalies[0];

      // Simulate simple scrimmage
      var team1Score = 5 + Math.floor(Math.random() * 8); // 5-12
      var team2Score = 5 + Math.floor(Math.random() * 8);

      // Apply stats to players
      team1Runners.concat([team1Goalie]).forEach(function(p) {
        this.applyScrimmageStats(p, team1Score > team2Score);
      }.bind(this));

      team2Runners.concat([team2Goalie]).forEach(function(p) {
        this.applyScrimmageStats(p, team2Score > team1Score);
      }.bind(this));

      console.log('  🥍', division, 'scrimmage:', team1Score, '-', team2Score);
    },

    /**
     * Apply scrimmage stats to player
     */
    applyScrimmageStats: function(player, won) {
      if (!player.exhibitionStats) {
        player.exhibitionStats = {
          GP: 0, G: 0, A: 0, S: 0, SOG: 0, LB: 0, CTO: 0, TO: 0, PIM: 0,
          FOT: 0, FOW: 0, SA: 0, SV: 0, GA: 0
        };
      }

      var stats = player.exhibitionStats;
      stats.GP = (stats.GP || 0) + 1;

      var isGoalie = player.position === 'G' || player.position === 'Goalie';

      if (isGoalie) {
        var sa = 15 + Math.floor(Math.random() * 15); // 15-29 shots against
        var sv = Math.floor(sa * (0.6 + Math.random() * 0.3)); // 60-90% save rate
        stats.SA = (stats.SA || 0) + sa;
        stats.SV = (stats.SV || 0) + sv;
        stats.GA = (stats.GA || 0) + (sa - sv);
      } else {
        // Runner stats
        if (Math.random() < 0.3) {
          stats.G = (stats.G || 0) + 1;
        }
        if (Math.random() < 0.3) {
          stats.A = (stats.A || 0) + 1;
        }
        
        var shots = 2 + Math.floor(Math.random() * 4);
        stats.S = (stats.S || 0) + shots;
        stats.SOG = (stats.SOG || 0) + Math.floor(shots * 0.6);
        
        // FIXED: Track LB, CTO, TO
        stats.LB = (stats.LB || 0) + Math.floor(Math.random() * 3);
        stats.CTO = (stats.CTO || 0) + Math.floor(Math.random() * 2);
        stats.TO = (stats.TO || 0) + Math.floor(Math.random() * 2);
        stats.PIM = (stats.PIM || 0) + (Math.random() < 0.2 ? 2 : 0);
        
        stats.FOT = (stats.FOT || 0) + Math.floor(Math.random() * 5);
        stats.FOW = (stats.FOW || 0) + Math.floor(stats.FOT * 0.5);
      }
    },

    /**
     * Auto-sort all organizations to A/B teams
     * FIXED: Ensures AI teams sort on day 7
     */
    autoSortAllOrganizations: function() {
      var state = TL.GameState;
      if (!state.divisions) return;

      var orgs = state.orgs || ['Hawks','Owls','Eagles','Lynx','Wolves','Coyotes','Moose','Bears','Beavers','Otters','Ravens','Foxes'];
      var divisions = ['U9', 'U11', 'U13', 'U15', 'U17'];

      orgs.forEach(function(org) {
        divisions.forEach(function(div) {
          this.sortTeamsAB(org, div);
        }.bind(this));
      }.bind(this));

      console.log('✅ All organizations sorted to A/B teams');
    },

    /**
     * Sort a specific organization's division into A/B teams
     */
    sortTeamsAB: function(org, division) {
      var state = TL.GameState;
      
      // Get roster
      var roster;
      if (org === state.user.org) {
        // User's team
        roster = state.divisions[division].players || [];
      } else {
        // Opponent team
        if (!state.opponentRosters) state.opponentRosters = {};
        if (!state.opponentRosters[org]) return;
        if (!state.opponentRosters[org][division]) return;
        roster = state.opponentRosters[org][division];
      }

      if (!roster || roster.length === 0) return;

      // Sort by OVR descending
      roster.sort(function(a, b) {
        var ovrA = a.overall || a.ovr || 50;
        var ovrB = b.overall || b.ovr || 50;
        return ovrB - ovrA;
      });

      // Assign top 50% to A, rest to B
      var midpoint = Math.ceil(roster.length / 2);
      
      for (var i = 0; i < roster.length; i++) {
        if (i < midpoint) {
          roster[i].team = 'A';
          roster[i].level = 'A';
        } else {
          roster[i].team = 'B';
          roster[i].level = 'B';
        }
      }

      console.log('  📊 Sorted', org, division, ':', midpoint, 'A-team,', (roster.length - midpoint), 'B-team');
    },

    /**
     * Advance day (regular season)
     */
    advanceDay: function() {
      var state = TL.GameState;
      if (!state) return;

      state.day = (state.day || 1) + 1;

      // Simulate games for this day
      if (TL.GameSimulator && TL.GameSimulator.simulateDay) {
        TL.GameSimulator.simulateDay(state.day);
      }

      console.log('📅 Advanced to day', state.day);
    }
  };

  window.TallyLax.SeasonManager = SeasonManager;
  console.log('✅ SeasonManager v6.2 loaded (Training Camp + AI sorting)');
})();
