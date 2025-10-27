/**
 * TallyLax GameState (v6.2)
 * Single source of truth for all game data
 * Contract: Only modules write; UI reads via Selectors
 */

(function() {
  'use strict';

  var GameState = {
    version: '6.2',
    
    // RNG
    rngSeed: null,
    
    // Time
    day: 1,
    seasonYear: 1,
    phase: 'preseason',
    
    // User identity
    user: {
      name: '',
      org: 'Hawks'
    },
    
    // Divisions structure
    divisions: {
      U9: { players: [], lines: { A: {}, B: {} } },
      U11: { players: [], lines: { A: {}, B: {} } },
      U13: { players: [], lines: { A: {}, B: {} } },
      U15: { players: [], lines: { A: {}, B: {} } },
      U17: { players: [], lines: { A: {}, B: {} } }
    },
    
    // Player registry (canonical)
    players: {},
    
    // Lines keyed by 'Org|Div|Lvl'
    lines: {},
    
    // Calendar and schedule
    calendar: {},
    schedule: {},
    
    // Standings keyed by 'Div|Lvl'
    standings: {},
    
    // Tournaments
    tournaments: {},
    
    // Playoffs
    playoffs: {},
    
    // Game log
    gameLog: [],
    
    // News
    news: [],
    
    // History
    history: {
      seasons: []
    },
    
    // Training
    training: {
      plans: {},
      lastReportDay: 0
    },
    
    // Coaches
    coaches: {
      pool: [],
      assignments: {}
    },
    
    // Organizations list
    orgs: [
      'Hawks', 'Owls', 'Eagles', 'Lynx', 'Wolves', 'Coyotes',
      'Moose', 'Bears', 'Beavers', 'Otters', 'Ravens', 'Foxes'
    ],
    
    // Opponent rosters cache
    opponentRosters: {}
  };

  // Initialize function
  function init() {
    // Seed RNG
    GameState.rngSeed = Date.now();
    
    // Initialize calendar (placeholder)
    for (var i = 1; i <= 200; i++) {
      GameState.calendar[i] = { phase: 'preseason' };
    }
    
    return GameState;
  }

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.GameState = GameState;
  window.TallyLax.initGameState = init;
  window.TL = window.TallyLax; // Alias
})();
