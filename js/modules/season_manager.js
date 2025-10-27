/**
 * TallyLax Season Manager (v6.2) - NEW MODULE
 * Handles training camp simulation, game progression, and day advancement
 * Contract: Runs daily camp activities (clinics, scrimmages) and season games
 */

(function() {
  'use strict';
  
  var SeasonManager = {
    
    /**
     * Run a training camp day for a specific division
     * Includes clinics and intersquad scrimmages
     */
    runCampDay: function(division) {
      var gs = window.TL.GameState;
      var org = gs.user.org;
      
      console.log('🏕️ Running training camp day ' + gs.day + ' for ' + division);
      
      // Run clinic (skill improvements)
      this.runClinic(org, division);
      
      // Run intersquad game
      var gameResult = this.runIntersquadGame(org, division);
      
      // Show results banner
      if (gameResult) {
        var banner = '🏒 ' + division + ' Scrimmage: ' + 
                    gameResult.homeTeam + ' ' + gameResult.homeScore + ' - ' + 
                    gameResult.awayScore + ' ' + gameResult.awayTeam;
        window.TL.UI.showBanner(banner, 'success');
      }
      
      console.log('✅ Camp day complete');
    },
    
    /**
     * Run daily clinic for skill improvements
     */
    runClinic: function(org, division) {
      var gs = window.TL.GameState;
      var rng = window.TL.RNG;
      
      // Get all players in this division's training camp
      var tcRoster = window.TL.Selectors.roster(org, division, 'TC');
      if (!tcRoster || tcRoster.length === 0) {
        return;
      }
      
      // Determine clinic focus (random each day)
      var clinicFocus = rng.choice([
        'shooting', 'passing', 'defense', 'skating', 'fitness', 'tactics'
      ]);
      
      console.log('  📚 Clinic focus: ' + clinicFocus);
      
      // Apply small improvements to relevant attributes
      for (var i = 0; i < tcRoster.length; i++) {
        var player = tcRoster[i];
        
        // Small chance of improvement based on work ethic
        var improvementChance = 0.3; // 30% base chance
        if (player.hidden && player.hidden.workEthic) {
          improvementChance += (player.hidden.workEthic / 100) * 0.2;
        }
        
        if (rng.random() < improvementChance) {
          this.applyClinicGains(player, clinicFocus, division);
        }
        
        // Small morale boost from training
        if (player.morale < 85) {
          player.morale = Math.min(100, player.morale + rng.int(1, 3));
        }
      }
    },
    
    /**
     * Apply attribute gains from clinic focus
     */
    applyClinicGains: function(player, focus, division) {
      var rng = window.TL.RNG;
      var gainSize = rng.int(1, 2); // Small gains
      
      // U9 gets slightly larger gains (they're developing fundamentals)
      if (division === 'U9') {
        gainSize = rng.int(1, 3);
      }
      
      // Apply gains based on focus
      switch(focus) {
        case 'shooting':
          if (player.position !== 'goalie') {
            player.finishing = Math.min(99, (player.finishing || 50) + gainSize);
            player.shootingPower = Math.min(99, (player.shootingPower || 50) + gainSize);
          }
          break;
        case 'passing':
          if (player.position !== 'goalie') {
            player.passing = Math.min(99, (player.passing || 50) + gainSize);
            player.vision = Math.min(99, (player.vision || 50) + gainSize);
          }
          break;
        case 'defense':
          if (player.position !== 'goalie') {
            player.defenseIQ = Math.min(99, (player.defenseIQ || 50) + gainSize);
            player.checking = Math.min(99, (player.checking || 50) + gainSize);
            player.stickLift = Math.min(99, (player.stickLift || 50) + gainSize);
          }
          break;
        case 'skating':
          if (player.position !== 'goalie') {
            player.transSpeed = Math.min(99, (player.transSpeed || 50) + gainSize);
            player.balance = Math.min(99, (player.balance || 50) + gainSize);
          } else {
            player.agility = Math.min(99, (player.agility || 50) + gainSize);
          }
          break;
        case 'fitness':
          if (player.position !== 'goalie') {
            player.endurance = Math.min(99, (player.endurance || 50) + gainSize);
          }
          break;
        case 'tactics':
          if (player.position !== 'goalie') {
            player.vision = Math.min(99, (player.vision || 50) + gainSize);
            player.defenseIQ = Math.min(99, (player.defenseIQ || 50) + gainSize);
          } else {
            player.positioning = Math.min(99, (player.positioning || 50) + gainSize);
            player.communication = Math.min(99, (player.communication || 50) + gainSize);
          }
          break;
      }
      
      // Recalculate OVR
      if (player.position === 'goalie') {
        player.ovr = this.calculateGoalieOVR(player);
      } else {
        player.ovr = this.calculateRunnerOVR(player);
      }
    },
    
    /**
     * Run an intersquad scrimmage game
     */
    runIntersquadGame: function(org, division) {
      var gs = window.TL.GameState;
      
      // For U9: Red vs Blue
      // For U11-U17: A vs B
      var homeRoster, awayRoster, homeTeam, awayTeam;
      
      if (division === 'U9') {
        // U9 uses Red/Blue teams for scrimmages
        var tcRoster = window.TL.Selectors.roster(org, division, 'TC');
        if (!tcRoster || tcRoster.length < 12) {
          console.log('  ⚠️ Not enough players for U9 scrimmage');
          return null;
        }
        
        // Split into Red and Blue randomly
        var shuffled = window.TL.RNG.shuffle(tcRoster.slice());
        var half = Math.floor(shuffled.length / 2);
        homeRoster = shuffled.slice(0, half);
        awayRoster = shuffled.slice(half);
        homeTeam = 'Red Team';
        awayTeam = 'Blue Team';
      } else {
        // U11-U17 use A vs B teams
        homeRoster = window.TL.Selectors.roster(org, division, 'A');
        awayRoster = window.TL.Selectors.roster(org, division, 'B');
        homeTeam = division + ' A';
        awayTeam = division + ' B';
        
        if (!homeRoster || homeRoster.length < 6 || !awayRoster || awayRoster.length < 6) {
          console.log('  ⚠️ Not enough players for ' + division + ' scrimmage');
          return null;
        }
      }
      
      // Simulate the game
      var result = this.simulateCampGame(homeRoster, awayRoster);
      
      console.log('  🏒 Scrimmage: ' + homeTeam + ' ' + result.homeScore + 
                  ' - ' + result.awayScore + ' ' + awayTeam);
      
      // Update morale based on result
      this.updateMoraleAfterGame(homeRoster, awayRoster, result);
      
      return {
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: result.homeScore,
        awayScore: result.awayScore
      };
    },
    
    /**
     * Simulate a training camp scrimmage (simplified box lacrosse game)
     */
    simulateCampGame: function(homeRoster, awayRoster) {
      var rng = window.TL.RNG;
      
      // Calculate team strengths
      var homeStrength = this.calculateTeamStrength(homeRoster);
      var awayStrength = this.calculateTeamStrength(awayRoster);
      
      // Get goalies
      var homeGoalie = this.getBestGoalie(homeRoster);
      var awayGoalie = this.getBestGoalie(awayRoster);
      
      // Box lacrosse target: 8-18 goals per team
      var baseGoals = 12;
      var variance = 4;
      
      // Home team scoring
      var homeGoals = baseGoals + rng.int(-variance, variance);
      homeGoals += Math.floor((homeStrength - awayStrength) / 10); // Strength differential
      if (awayGoalie) {
        homeGoals -= Math.floor(awayGoalie.ovr / 20); // Goalie impact
      }
      homeGoals = Math.max(6, Math.min(20, homeGoals)); // Clamp
      
      // Away team scoring
      var awayGoals = baseGoals + rng.int(-variance, variance);
      awayGoals += Math.floor((awayStrength - homeStrength) / 10); // Strength differential
      if (homeGoalie) {
        awayGoals -= Math.floor(homeGoalie.ovr / 20); // Goalie impact
      }
      awayGoals = Math.max(6, Math.min(20, awayGoals)); // Clamp
      
      // Rare chance for tie - adjust by 1
      if (homeGoals === awayGoals && rng.random() > 0.3) {
        if (rng.random() < 0.5) {
          homeGoals++;
        } else {
          awayGoals++;
        }
      }
      
      return {
        homeScore: homeGoals,
        awayScore: awayGoals,
        homeWin: homeGoals > awayGoals
      };
    },
    
    /**
     * Calculate overall team strength
     */
    calculateTeamStrength: function(roster) {
      if (!roster || roster.length === 0) return 50;
      
      var total = 0;
      var count = 0;
      
      for (var i = 0; i < roster.length; i++) {
        if (roster[i].ovr) {
          total += roster[i].ovr;
          count++;
        }
      }
      
      return count > 0 ? Math.floor(total / count) : 50;
    },
    
    /**
     * Get best goalie from roster
     */
    getBestGoalie: function(roster) {
      var goalies = [];
      
      for (var i = 0; i < roster.length; i++) {
        if (roster[i].position === 'goalie') {
          goalies.push(roster[i]);
        }
      }
      
      if (goalies.length === 0) return null;
      
      // Sort by OVR descending
      goalies.sort(function(a, b) {
        return (b.ovr || 50) - (a.ovr || 50);
      });
      
      return goalies[0];
    },
    
    /**
     * Update player morale after a game
     */
    updateMoraleAfterGame: function(homeRoster, awayRoster, result) {
      var rng = window.TL.RNG;
      
      // Winners get morale boost, losers get slight decrease
      var winnerBoost = rng.int(2, 5);
      var loserPenalty = rng.int(1, 3);
      
      // Update home team
      for (var i = 0; i < homeRoster.length; i++) {
        var player = homeRoster[i];
        if (result.homeWin) {
          player.morale = Math.min(100, player.morale + winnerBoost);
        } else {
          player.morale = Math.max(0, player.morale - loserPenalty);
        }
      }
      
      // Update away team
      for (var j = 0; j < awayRoster.length; j++) {
        var player2 = awayRoster[j];
        if (!result.homeWin) {
          player2.morale = Math.min(100, player2.morale + winnerBoost);
        } else {
          player2.morale = Math.max(0, player2.morale - loserPenalty);
        }
      }
    },
    
    /**
     * Calculate runner OVR (simplified)
     */
    calculateRunnerOVR: function(player) {
      var attrs = [
        player.finishing || 50,
        player.shootingPower || 50,
        player.passing || 50,
        player.vision || 50,
        player.transSpeed || 50,
        player.endurance || 50,
        player.balance || 50,
        player.defenseIQ || 50,
        player.checking || 50,
        player.stickLift || 50,
        player.faceoff || 50,
        player.tenacity || 50,
        player.discipline || 50
      ];
      
      var sum = 0;
      for (var i = 0; i < attrs.length; i++) {
        sum += attrs[i];
      }
      
      return Math.floor(sum / attrs.length);
    },
    
    /**
     * Calculate goalie OVR (simplified)
     */
    calculateGoalieOVR: function(player) {
      var attrs = [
        player.reflexes || 50,
        player.angles || 50,
        player.reboundControl || 50,
        player.handSpeed || 50,
        player.agility || 50,
        player.positioning || 50,
        player.communication || 50,
        player.stickSkills || 50,
        player.clutch || 50,
        player.consistency || 50
      ];
      
      var sum = 0;
      for (var i = 0; i < attrs.length; i++) {
        sum += attrs[i];
      }
      
      return Math.floor(sum / attrs.length);
    }
  };
  
  // Export to global namespace
  window.TL = window.TL || {};
  window.TL.SeasonManager = SeasonManager;
  
  console.log('✅ SeasonManager v6.2 loaded (Training Camp Simulation)');
  
})();
