/**
 * TallyLax Jersey Manager (v6.2) - NEW MODULE
 * Manages jersey number assignment, preferences, and validation
 * Contract: Ensures unique jersey numbers per org/division with proper restrictions
 */

(function() {
  'use strict';
  
  var JerseyManager = {
    
    /**
     * Generate 1-2 favorite jersey numbers for a player
     * Goalies prefer goalie numbers (0, 1, 30, 31, 32, 33, 35), runners prefer 0-99
     */
    generateFavoriteNumbers: function(position) {
      var rng = window.TL.RNG;
      var constants = window.TL.Constants;
      var favorites = [];
      
      if (position === 'goalie') {
        // ✅ FIXED: Goalies can only have: 0, 1, 30, 31, 32, 33, 35
        var goalieNums = constants.JERSEY_GOALIE_NUMBERS;
        favorites.push(rng.choice(goalieNums));
        
        // Always generate second favorite for goalies
        var second = rng.choice(goalieNums);
        var attempts = 0;
        while (second === favorites[0] && attempts < 10) {
          second = rng.choice(goalieNums);
          attempts++;
        }
        if (second !== favorites[0]) {
          favorites.push(second);
        }
      } else {
        // ✅ FIXED: Runners can have 0-99
        var firstFav = rng.int(constants.JERSEY_RUNNER_MIN, constants.JERSEY_RUNNER_MAX);
        favorites.push(firstFav);
        
        // Always generate second favorite for runners
        var secondFav = rng.int(constants.JERSEY_RUNNER_MIN, constants.JERSEY_RUNNER_MAX);
        var attempts = 0;
        while (secondFav === firstFav && attempts < 20) {
          secondFav = rng.int(constants.JERSEY_RUNNER_MIN, constants.JERSEY_RUNNER_MAX);
          attempts++;
        }
        if (secondFav !== firstFav) {
          favorites.push(secondFav);
        }
      }
      
      return favorites;
    },
    
    /**
     * Get all taken jersey numbers for an org/division
     * Returns: array of taken numbers
     */
    getTakenNumbers: function(org, division) {
      var gs = window.TL.GameState;
      var taken = [];
      
      // Get all players in this org/division
      var divPlayers = gs.divisions[division].players || [];
      
      for (var i = 0; i < divPlayers.length; i++) {
        var playerId = divPlayers[i];
        var player = gs.players[playerId];
        
        if (player && player.org === org && player.jersey) {
          taken.push(player.jersey);
        }
      }
      
      return taken;
    },
    
    /**
     * Check if a jersey number is available
     */
    isNumberAvailable: function(number, org, division, excludePlayerId) {
      var taken = this.getTakenNumbers(org, division);
      var gs = window.TL.GameState;
      
      // Remove excluded player's current number from taken list
      if (excludePlayerId) {
        var excludePlayer = gs.players[excludePlayerId];
        if (excludePlayer && excludePlayer.jersey) {
          var index = taken.indexOf(excludePlayer.jersey);
          if (index > -1) {
            taken.splice(index, 1);
          }
        }
      }
      
      return taken.indexOf(number) === -1;
    },
    
    /**
     * Try to assign a player their favorite number
     * Returns: assigned number or null if none available
     */
    assignFavoriteNumber: function(player, org, division) {
      if (!player.favoriteJerseys || player.favoriteJerseys.length === 0) {
        return null;
      }
      
      // Try each favorite in order
      for (var i = 0; i < player.favoriteJerseys.length; i++) {
        var fav = player.favoriteJerseys[i];
        if (this.isNumberAvailable(fav, org, division, player.id)) {
          return fav;
        }
      }
      
      return null;
    },
    
    /**
     * Get next available number for a player
     * Respects position restrictions
     */
    getNextAvailableNumber: function(player, org, division) {
      var constants = window.TL.Constants;
      var taken = this.getTakenNumbers(org, division);
      
      if (player.position === 'goalie') {
        // Try goalie numbers first
        var goalieNums = constants.JERSEY_GOALIE_NUMBERS;
        for (var i = 0; i < goalieNums.length; i++) {
          if (taken.indexOf(goalieNums[i]) === -1) {
            return goalieNums[i];
          }
        }
        // Fallback to regular numbers if all goalie numbers taken
      }
      
      // Try runner numbers 2-99
      for (var num = constants.JERSEY_RUNNER_MIN; num <= constants.JERSEY_RUNNER_MAX; num++) {
        if (taken.indexOf(num) === -1) {
          return num;
        }
      }
      
      // If somehow all numbers are taken, use a high number
      return 100 + taken.length;
    },
    
    /**
     * Auto-assign jersey number to a single player
     * Tries favorite first, then next available
     */
    autoAssignJersey: function(player, org, division) {
      // Try favorite numbers first
      var favoriteNum = this.assignFavoriteNumber(player, org, division);
      if (favoriteNum !== null) {
        player.jersey = favoriteNum;
        return favoriteNum;
      }
      
      // Assign next available
      var nextNum = this.getNextAvailableNumber(player, org, division);
      player.jersey = nextNum;
      return nextNum;
    },
    
    /**
     * Auto-assign jerseys to all players in a division for an org
     * Used during training camp team assignment
     */
    autoAssignDivisionJerseys: function(org, division, level) {
      var gs = window.TL.GameState;
      var keys = window.TL.Keys;
      var assigned = 0;
      
      // Get all players for this org/division/level
      var roster = window.TL.Selectors.roster(org, division, level);
      
      if (!roster || roster.length === 0) {
        return 0;
      }
      
      // Clear all existing jerseys first
      for (var i = 0; i < roster.length; i++) {
        roster[i].jersey = null;
      }
      
      // Sort: goalies first, then by overall rating (best players get first pick)
      roster.sort(function(a, b) {
        if (a.position === 'goalie' && b.position !== 'goalie') return -1;
        if (a.position !== 'goalie' && b.position === 'goalie') return 1;
        return (b.ovr || 50) - (a.ovr || 50);
      });
      
      // Assign jerseys
      for (var i = 0; i < roster.length; i++) {
        this.autoAssignJersey(roster[i], org, division);
        assigned++;
      }
      
      return assigned;
    },
    
    /**
     * Auto-assign jerseys for all divisions in an org
     * Used at training camp completion
     */
    autoAssignOrgJerseys: function(org) {
      var constants = window.TL.Constants;
      var totalAssigned = 0;
      
      for (var i = 0; i < constants.DIVISIONS.length; i++) {
        var div = constants.DIVISIONS[i];
        
        // U9 only has one team
        if (div === 'U9') {
          var assigned = this.autoAssignDivisionJerseys(org, div, 'TC');
          totalAssigned += assigned;
        } else {
          // Other divisions have A and B teams
          var assignedA = this.autoAssignDivisionJerseys(org, div, 'A');
          var assignedB = this.autoAssignDivisionJerseys(org, div, 'B');
          totalAssigned += assignedA + assignedB;
        }
      }
      
      return totalAssigned;
    },
    
    /**
     * Manually set a player's jersey number
     * Validates availability first
     */
    setPlayerJersey: function(playerId, newNumber) {
      var gs = window.TL.GameState;
      var player = gs.players[playerId];
      
      if (!player) {
        return { success: false, error: 'Player not found' };
      }
      
      // Validate number is available
      if (!this.isNumberAvailable(newNumber, player.org, player.division, playerId)) {
        return { success: false, error: 'Jersey number ' + newNumber + ' is already taken' };
      }
      
      // Validate number is appropriate for position
      var constants = window.TL.Constants;
      if (player.position === 'goalie') {
        var isGoalieNum = constants.JERSEY_GOALIE_NUMBERS.indexOf(newNumber) > -1;
        var isRunnerNum = newNumber >= constants.JERSEY_RUNNER_MIN && newNumber <= constants.JERSEY_RUNNER_MAX;
        if (!isGoalieNum && !isRunnerNum) {
          return { success: false, error: 'Invalid jersey number' };
        }
      } else {
        if (newNumber < constants.JERSEY_RUNNER_MIN || newNumber > constants.JERSEY_RUNNER_MAX) {
          return { success: false, error: 'Runners must use numbers ' + constants.JERSEY_RUNNER_MIN + '-' + constants.JERSEY_RUNNER_MAX };
        }
      }
      
      // Assign the number
      player.jersey = newNumber;
      return { success: true, number: newNumber };
    },
    
    /**
     * Get jersey summary for a division
     * Returns: { taken: [numbers], available: [numbers], goalie: [numbers], runner: [numbers] }
     */
    getDivisionJerseySummary: function(org, division) {
      var constants = window.TL.Constants;
      var taken = this.getTakenNumbers(org, division);
      var available = [];
      
      // Build available list
      var goalieAvailable = [];
      for (var i = 0; i < constants.JERSEY_GOALIE_NUMBERS.length; i++) {
        var num = constants.JERSEY_GOALIE_NUMBERS[i];
        if (taken.indexOf(num) === -1) {
          goalieAvailable.push(num);
        }
      }
      
      var runnerAvailable = [];
      for (var num = constants.JERSEY_RUNNER_MIN; num <= constants.JERSEY_RUNNER_MAX; num++) {
        if (taken.indexOf(num) === -1) {
          runnerAvailable.push(num);
        }
      }
      
      return {
        taken: taken,
        availableGoalie: goalieAvailable,
        availableRunner: runnerAvailable,
        totalAvailable: goalieAvailable.length + runnerAvailable.length
      };
    }
  };
  
  // Export to global namespace
  window.TL = window.TL || {};
  window.TL.JerseyManager = JerseyManager;
  
  console.log('✅ JerseyManager loaded');
})();
