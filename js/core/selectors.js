/**
 * TallyLax Selectors (v6.2)
 * Safe read-only access to GameState
 * Contract: UI reads ONLY via Selectors; never mutates
 */

(function() {
  'use strict';

  var Selectors = {
    
    // Get user info
    getUser: function() {
      var gs = window.TL.GameState;
      return {
        name: gs.user.name || '',
        org: gs.user.org || 'Hawks'
      };
    },
    
    // Get current day
    getDay: function() {
      return window.TL.GameState.day || 1;
    },
    
    // Get season year
    getSeasonYear: function() {
      return window.TL.GameState.seasonYear || 1;
    },
    
    // Get phase
    getPhase: function() {
      return window.TL.GameState.phase || 'preseason';
    },
    
    // Get roster for org/div/lvl
    roster: function(org, div, lvl) {
      var gs = window.TL.GameState;
      var key = window.TL.Keys.key(org, div, lvl);
      var playerIds = gs.divisions[div] ? gs.divisions[div].players || [] : [];
      var players = [];
      
      for (var i = 0; i < playerIds.length; i++) {
        var p = gs.players[playerIds[i]];
        if (p && p.org === org && p.division === div && p.level === lvl) {
          players.push(p);
        }
      }
      
      return players;
    },
    
    // Get player by ID
    getPlayer: function(playerId) {
      return window.TL.GameState.players[playerId] || null;
    },
    
    // Get lines for key
    getLines: function(key) {
      return window.TL.GameState.lines[key] || null;
    },
    
    // Get all organizations
    getOrgs: function() {
      return window.TL.GameState.orgs || [];
    },
    
    // Get calendar entry for day
    getCalendarDay: function(day) {
      return window.TL.GameState.calendar[day] || null;
    },
    
    // Get schedule for day
    getScheduleDay: function(day) {
      return window.TL.GameState.schedule[day] || [];
    },
    
    // Get standings for div/lvl
    getStandings: function(div, lvl) {
      var key = div + '|' + lvl;
      return window.TL.GameState.standings[key] || null;
    },
    
    // Get game log
    getGameLog: function(limit) {
      var log = window.TL.GameState.gameLog || [];
      if (limit) {
        return log.slice(0, limit);
      }
      return log;
    },
    
    // Get news
    getNews: function(limit) {
      var news = window.TL.GameState.news || [];
      if (limit) {
        return news.slice(0, limit);
      }
      return news;
    },
    
    // Clamp helper (used internally)
    clamp: function(val, min, max) {
      if (typeof val !== 'number' || isNaN(val)) return min;
      return Math.max(min, Math.min(max, val));
    }
  };

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.Selectors = Selectors;
  window.TL = window.TallyLax; // Alias
})();


(function(){
  var TL = window.TL = window.TL || {};
  TL.Selectors = TL.Selectors || {};
  
  /**
   * Get all players for org/div (both A and B teams, or camp)
   */
  TL.Selectors.getAllPlayers = function(org, div){
    var gs = TL.GameState;
    var allPlayers = [];
    
    // Iterate through all players in GameState.players
    for (var id in gs.players) {
      var p = gs.players[id];
      if (p && p.org === org && p.division === div) {
        allPlayers.push(p);
      }
    }
    
    return allPlayers;
  };
  
  /**
   * Get roster for specific org/div/level
   * Returns { runners: [], goalies: [] }
   */
  TL.Selectors.getRoster = function(org, div, level){
    var gs = TL.GameState;
    var runners = [];
    var goalies = [];
    
    // If level is 'All', 'TC', or similar, get all players for this division
    if (level === 'All' || level === 'ALL' || level === 'All Players' || level === 'TC') {
      var allPlayers = TL.Selectors.getAllPlayers(org, div);
      for (var i = 0; i < allPlayers.length; i++) {
        var p = allPlayers[i];
        if (p.type === 'goalie') {
          goalies.push(p);
        } else {
          runners.push(p);
        }
      }
      return { runners: runners, goalies: goalies };
    }
    
    // Get players for specific team (A or B)
    for (var id in gs.players) {
      var p = gs.players[id];
      if (p && p.org === org && p.division === div && p.level === level) {
        if (p.type === 'goalie') {
          goalies.push(p);
        } else {
          runners.push(p);
        }
      }
    }
    
    return { runners: runners, goalies: goalies };
  };
})();