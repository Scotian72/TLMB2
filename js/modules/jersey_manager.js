// js/modules/jersey_manager.js
// COMPREHENSIVE FIX: Multiple favorite numbers, conflict resolution, proper assignment

(function() {
  'use strict';
  window.TallyLax = window.TallyLax || {};

  var JerseyManager = {
    
    /**
     * Generate 3 favorite jersey numbers for a player
     * Returns array of 3 unique numbers between 1-99
     */
    generateFavoriteNumbers: function() {
      var favorites = [];
      var attempts = 0;
      var maxAttempts = 100;
      
      while (favorites.length < 3 && attempts < maxAttempts) {
        var num = 1 + Math.floor(Math.random() * 99); // 1-99
        if (favorites.indexOf(num) === -1) {
          favorites.push(num);
        }
        attempts++;
      }
      
      // Fill with random if needed
      while (favorites.length < 3) {
        favorites.push(1 + Math.floor(Math.random() * 99));
      }
      
      return favorites;
    },

    /**
     * Assign jersey numbers to a division roster
     * Priority: highest OVR players get their first choice
     * Conflicts resolved by OVR ranking
     */
    assignJerseyNumbers: function(players, division) {
      if (!players || players.length === 0) return;
      
      // Initialize favorites if missing
      players.forEach(function(p) {
        if (!p.jerseyFavorites || !Array.isArray(p.jerseyFavorites) || p.jerseyFavorites.length === 0) {
          p.jerseyFavorites = this.generateFavoriteNumbers();
        }
      }.bind(this));

      // Sort players by OVR descending (best players pick first)
      var sortedPlayers = players.slice().sort(function(a, b) {
        var ovrA = a.overall || a.ovr || 50;
        var ovrB = b.overall || b.ovr || 50;
        return ovrB - ovrA;
      });

      var usedNumbers = {};
      var assignedCount = 0;

      // First pass: try to assign favorite numbers
      sortedPlayers.forEach(function(player) {
        if (player.jersey) return; // Already assigned
        
        var assigned = false;
        var favorites = player.jerseyFavorites || [];
        
        // Try each favorite in order
        for (var i = 0; i < favorites.length; i++) {
          var num = favorites[i];
          if (!usedNumbers[num]) {
            player.jersey = num;
            usedNumbers[num] = true;
            assigned = true;
            assignedCount++;
            break;
          }
        }
        
        // If no favorite available, assign random available number
        if (!assigned) {
          var randomNum = this.findAvailableNumber(usedNumbers);
          player.jersey = randomNum;
          usedNumbers[randomNum] = true;
          assignedCount++;
        }
      }.bind(this));

      console.log('[JerseyManager] Assigned', assignedCount, 'jersey numbers for', division);
    },

    /**
     * Find an available jersey number
     */
    findAvailableNumber: function(usedNumbers) {
      // Try random numbers first
      for (var attempt = 0; attempt < 100; attempt++) {
        var num = 1 + Math.floor(Math.random() * 99);
        if (!usedNumbers[num]) {
          return num;
        }
      }
      
      // Fallback: sequential search
      for (var i = 1; i <= 99; i++) {
        if (!usedNumbers[i]) {
          return i;
        }
      }
      
      // Ultimate fallback
      return 99;
    },

    /**
     * Format jersey favorites for display
     * Returns: "30, 33, 45" instead of "303345"
     */
    formatJerseyFavorites: function(favorites) {
      if (!favorites || !Array.isArray(favorites)) return '?';
      return favorites.join(', ');
    },

    /**
     * Assign jerseys to all divisions at start of camp
     */
    assignAllDivisionJerseys: function(state) {
      var divisions = ['U9', 'U11', 'U13', 'U15', 'U17'];
      
      divisions.forEach(function(div) {
        if (state.divisions && state.divisions[div] && state.divisions[div].players) {
          this.assignJerseyNumbers(state.divisions[div].players, div);
        }
      }.bind(this));

      console.log('✅ Jersey numbers assigned to all divisions');
    },

    /**
     * Reassign jerseys for a specific team (A or B) after roster cuts
     */
    reassignTeamJerseys: function(players) {
      var usedNumbers = {};
      
      // Clear existing assignments
      players.forEach(function(p) {
        p.jersey = null;
      });
      
      // Sort by OVR and reassign
      this.assignJerseyNumbers(players, 'Team');
    }
  };

  window.TallyLax.JerseyManager = JerseyManager;
  console.log('✅ JerseyManager loaded (v6.2 - Multiple favorites + conflict resolution)');
})();
