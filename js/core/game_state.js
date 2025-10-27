/* @tlos:6.2
 * role: core
 * name: game_state.js
 * reads: Constants
 * writes: window.TallyLax.GameState
 * contracts: SSOT, never mutated by UI, includes U9 division
 */

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    var C = TL.Constants;
    
    /**
     * GameState - Single Source of Truth
     * All game data lives here. UI reads via Selectors, Modules write directly.
     */
    var GameState = {
        // Metadata
        version: '6.2',
        rngSeed: null,
        initialized: false,
        
        // Time
        day: 1,
        seasonYear: 2025,
        
        // User Identity
        user: {
            name: '',
            org: '',
            title: 'President'
        },
        
        // Divisions (U9 through U17)
        divisions: {
            U9: {
                players: [],
                lines: {
                    A: {},
                    B: {}
                }
            },
            U11: {
                players: [],
                lines: {
                    A: {},
                    B: {}
                }
            },
            U13: {
                players: [],
                lines: {
                    A: {},
                    B: {}
                }
            },
            U15: {
                players: [],
                lines: {
                    A: {},
                    B: {}
                }
            },
            U17: {
                players: [],
                lines: {
                    A: {},
                    B: {}
                }
            }
        },
        
        // Players (canonical storage by ID)
        players: {},
        
        // Lines (by composite key: 'Org|Div|Lvl')
        lines: {},
        
        // Calendar (day â†’ phase mapping)
        calendar: {},
        
        // Schedule (day â†’ array of Game objects)
        schedule: {},
        
        // Standings (by 'Div|Lvl' key)
        standings: {},
        
        // Game Log
        gameLog: [],
        
        // News Feed
        news: [],
        
        // History (seasons, awards, etc)
        history: {
            seasons: [],
            awards: [],
            retiredNumbers: []
        },
        
        // Training Plans
        training: {
            plans: {},
            lastReportDay: 0
        },
        
        // Coaches
        coaches: {
            pool: [],
            assignments: {}
        },
        
        // Opponent Rosters (cached)
        opponentRosters: {},
        
        // Tournaments
        tournaments: {
            laxfest: null,
            foundersCup: null
        },
        
        // Playoffs
        playoffs: {
            active: false,
            brackets: {},
            results: {}
        }
    };
    
    /**
     * Initialize GameState with user data
     */
    GameState.initialize = function(userName, orgName) {
        this.user.name = userName;
        this.user.org = orgName;
        this.initialized = true;
        
        // Generate RNG seed based on user input + timestamp
        this.rngSeed = this._generateSeed(userName, orgName);
        
        // Initialize calendar
        this._initializeCalendar();
        
        console.log('GameState initialized for ' + userName + ' (' + orgName + ')');
    };
    
    /**
     * Generate deterministic seed from user data
     */
    GameState._generateSeed = function(userName, orgName) {
        var str = userName + orgName + Date.now();
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };
    
    /**
     * Initialize calendar from segments
     */
    GameState._initializeCalendar = function() {
        if (!C || !C.CALENDAR_SEGMENTS) {
            console.error('Constants not loaded!');
            return;
        }
        
        for (var i = 0; i < C.CALENDAR_SEGMENTS.length; i++) {
            var seg = C.CALENDAR_SEGMENTS[i];
            for (var day = seg.start; day <= seg.end; day++) {
                this.calendar[day] = {
                    phase: seg.phase,
                    label: seg.label
                };
            }
        }
    };
    
    /**
     * Get current phase
     */
    GameState.getCurrentPhase = function() {
        var entry = this.calendar[this.day];
        return entry ? entry.phase : 'unknown';
    };
    
    /**
     * Get current phase label
     */
    GameState.getCurrentPhaseLabel = function() {
        var entry = this.calendar[this.day];
        return entry ? entry.label : 'Day ' + this.day;
    };
    
    /**
     * Reset GameState (for testing/new game)
     */
    GameState.reset = function() {
        this.day = 1;
        this.seasonYear = 2025;
        this.user = { name: '', org: '', title: 'President' };
        this.divisions = {
            U9: { players: [], lines: { A: {}, B: {} } },
            U11: { players: [], lines: { A: {}, B: {} } },
            U13: { players: [], lines: { A: {}, B: {} } },
            U15: { players: [], lines: { A: {}, B: {} } },
            U17: { players: [], lines: { A: {}, B: {} } }
        };
        this.players = {};
        this.lines = {};
        this.schedule = {};
        this.standings = {};
        this.gameLog = [];
        this.news = [];
        this.training = { plans: {}, lastReportDay: 0 };
        this.coaches = { pool: [], assignments: {} };
        this.opponentRosters = {};
        this.tournaments = { laxfest: null, foundersCup: null };
        this.playoffs = { active: false, brackets: {}, results: {} };
        this.initialized = false;
        this.rngSeed = null;
        
        console.log('GameState reset');
    };
    
    // Export
    TL.GameState = GameState;
    
    console.log('âœ… GameState loaded');
    
})();
