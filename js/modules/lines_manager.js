/**
 * TallyLax Lines Manager (v6.2)
 * Box Lacrosse lineup management - 5 runners per line
 * Contract: L1-L4, PP/PK units, goalie rotation
 */

(function() {
  'use strict';

  var RUNNERS_PER_LINE = 5; // Box Lacrosse!
  var LINES_COUNT = 4;

  var LinesManager = {
    
    // Initialize lines for a team
    initLines: function(org, div, lvl) {
      var key = window.TL.Keys.key(org, div, lvl);
      var gs = window.TL.GameState;
      
      if (gs.lines[key]) {
        return gs.lines[key]; // Already initialized
      }
      
      // Create empty lines structure
      var lines = {
        L1: [null, null, null, null, null],
        L2: [null, null, null, null, null],
        L3: [null, null, null, null, null],
        L4: [null, null, null, null, null],
        PP: [null, null, null, null, null],
        PK: [null, null, null, null, null],
        goalieRotation: 'Alternate', // Alternate, Balanced, HotHand
        goalies: [],
        floorTime: {
          L1: 30,
          L2: 25,
          L3: 25,
          L4: 20
        }
      };
      
      gs.lines[key] = lines;
      return lines;
    },
    
    // Auto-fill lines based on OVR
    autoFillLines: function(org, div, lvl) {
      var key = window.TL.Keys.key(org, div, lvl);
      var roster = window.TL.Selectors.roster(org, div, lvl);
      
      if (!roster || roster.length === 0) {
        console.error('No roster found for auto-fill');
        return false;
      }
      
      // Separate runners and goalies
      var runners = [];
      var goalies = [];
      
      for (var i = 0; i < roster.length; i++) {
        if (roster[i].type === 'goalie') {
          goalies.push(roster[i]);
        } else {
          runners.push(roster[i]);
        }
      }
      
      // Sort runners by OVR (highest first)
      runners.sort(function(a, b) {
        return b.ovr - a.ovr;
      });
      
      // Sort goalies by OVR
      goalies.sort(function(a, b) {
        return b.ovr - a.ovr;
      });
      
      // Initialize lines
      var lines = this.initLines(org, div, lvl);
      
      // Assign goalies
      lines.goalies = [];
      for (var g = 0; g < Math.min(goalies.length, 3); g++) {
        lines.goalies.push(goalies[g].id);
      }
      
      // Assign runners to lines (L1 gets best players)
      var lineNames = ['L1', 'L2', 'L3', 'L4'];
      var runnerIndex = 0;
      
      for (var l = 0; l < lineNames.length; l++) {
        var lineName = lineNames[l];
        
        for (var slot = 0; slot < RUNNERS_PER_LINE; slot++) {
          if (runnerIndex < runners.length) {
            lines[lineName][slot] = runners[runnerIndex].id;
            runnerIndex++;
          } else {
            lines[lineName][slot] = null;
          }
        }
      }
      
      // PP = L1 (best offensive players)
      for (var pp = 0; pp < RUNNERS_PER_LINE && pp < runners.length; pp++) {
        lines.PP[pp] = runners[pp].id;
      }
      
      // PK = mix of L1/L2 (best defensive players)
      // For now, use top defensive stats
      var defensive = runners.slice().sort(function(a, b) {
        var aDefense = (a.defenseIQ + a.checking + a.stickLift) / 3;
        var bDefense = (b.defenseIQ + b.checking + b.stickLift) / 3;
        return bDefense - aDefense;
      });
      
      for (var pk = 0; pk < RUNNERS_PER_LINE && pk < defensive.length; pk++) {
        lines.PK[pk] = defensive[pk].id;
      }
      
      // Save to GameState
      var gs = window.TL.GameState;
      gs.lines[key] = lines;
      
      console.log('Auto-filled lines for', key);
      return true;
    },
    
    // Get lines for a team
    getLines: function(org, div, lvl) {
      var key = window.TL.Keys.key(org, div, lvl);
      var gs = window.TL.GameState;
      return gs.lines[key] || this.initLines(org, div, lvl);
    },
    
    // Set a player in a line slot
    setLinePlayer: function(org, div, lvl, lineName, slot, playerId) {
      var lines = this.getLines(org, div, lvl);
      
      if (!lines[lineName]) {
        console.error('Invalid line name:', lineName);
        return false;
      }
      
      if (slot < 0 || slot >= RUNNERS_PER_LINE) {
        console.error('Invalid slot:', slot);
        return false;
      }
      
      lines[lineName][slot] = playerId;
      return true;
    },
    
    // Set goalie rotation mode
    setGoalieRotation: function(org, div, lvl, mode) {
      var validModes = ['Alternate', 'Balanced', 'HotHand'];
      if (validModes.indexOf(mode) === -1) {
        console.error('Invalid rotation mode:', mode);
        return false;
      }
      
      var lines = this.getLines(org, div, lvl);
      lines.goalieRotation = mode;
      return true;
    },
    
    // Add goalie to rotation
    addGoalie: function(org, div, lvl, playerId) {
      var lines = this.getLines(org, div, lvl);
      
      if (lines.goalies.indexOf(playerId) === -1) {
        lines.goalies.push(playerId);
      }
      
      return true;
    },
    
    // Remove goalie from rotation
    removeGoalie: function(org, div, lvl, playerId) {
      var lines = this.getLines(org, div, lvl);
      var index = lines.goalies.indexOf(playerId);
      
      if (index > -1) {
        lines.goalies.splice(index, 1);
      }
      
      return true;
    },
    
    // Set floor time percentage for a line
    setFloorTime: function(org, div, lvl, lineName, percentage) {
      var lines = this.getLines(org, div, lvl);
      
      if (!lines.floorTime) {
        lines.floorTime = { L1: 30, L2: 25, L3: 25, L4: 20 };
      }
      
      lines.floorTime[lineName] = Math.max(0, Math.min(100, percentage));
      return true;
    },
    
    // Validate lines (check for required positions filled)
    validateLines: function(org, div, lvl) {
      var lines = this.getLines(org, div, lvl);
      var errors = [];
      
      // Check if L1 is filled
      var l1Filled = 0;
      for (var i = 0; i < RUNNERS_PER_LINE; i++) {
        if (lines.L1[i] !== null) {
          l1Filled++;
        }
      }
      
      if (l1Filled === 0) {
        errors.push('L1 has no players assigned');
      }
      
      // Check if at least one goalie
      if (!lines.goalies || lines.goalies.length === 0) {
        errors.push('No goalie assigned');
      }
      
      return {
        valid: errors.length === 0,
        errors: errors
      };
    },
    
    // Get starter goalie based on rotation
    getStarterGoalie: function(org, div, lvl, gameNumber) {
      var lines = this.getLines(org, div, lvl);
      
      if (!lines.goalies || lines.goalies.length === 0) {
        return null;
      }
      
      var mode = lines.goalieRotation || 'Alternate';
      
      if (mode === 'Alternate') {
        // Alternate between goalies
        var index = gameNumber % lines.goalies.length;
        return lines.goalies[index];
      }
      
      if (mode === 'Balanced') {
        // Try to balance games played
        // For now, just alternate
        var index2 = gameNumber % lines.goalies.length;
        return lines.goalies[index2];
      }
      
      if (mode === 'HotHand') {
        // Start the goalie with best recent performance
        // For now, just use the first goalie
        // TODO: implement performance tracking
        return lines.goalies[0];
      }
      
      return lines.goalies[0];
    },
    
    // Assign captains for a team (1 Captain + 2 Assistants)
    assignCaptains: function(org, div, lvl) {
      var roster = window.TL.Selectors.roster(org, div, lvl);
      var lines = this.getLines(org, div, lvl);
      
      if (!roster || roster.length === 0) {
        console.warn('No roster found for captain assignment:', org, div, lvl);
        return false;
      }
      
      // Filter out goalies, sort by leadership (or OVR if no leadership attr)
      var runners = [];
      for (var i = 0; i < roster.length; i++) {
        if (roster[i].type !== 'goalie' && roster[i].position !== 'G') {
          runners.push(roster[i]);
        }
      }
      
      // Sort by leadership (fallback to OVR)
      runners.sort(function(a, b) {
        var aLead = a.leadership || a.ovr || 0;
        var bLead = b.leadership || b.ovr || 0;
        return bLead - aLead;
      });
      
      // Assign Captain and Assistants
      lines.captains = {
        C: runners[0] ? runners[0].id : null,
        A1: runners[1] ? runners[1].id : null,
        A2: runners[2] ? runners[2].id : null
      };
      
      console.log('Captains assigned for', org, div, lvl, ':', lines.captains);
      return true;
    },
    
    // Get captains for a team
    getCaptains: function(org, div, lvl) {
      var lines = this.getLines(org, div, lvl);
      return lines.captains || { C: null, A1: null, A2: null };
    },
    
    // Check if captains are assigned
    hasCaptains: function(org, div, lvl) {
      var captains = this.getCaptains(org, div, lvl);
      return captains.C !== null;
    }
  };

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.LinesManager = LinesManager;
  window.TL = window.TallyLax; // Alias
})();
