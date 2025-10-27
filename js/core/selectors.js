/* @tlos:6.2
 * role: core
 * name: selectors.js
 * reads: GameState, Keys
 * writes: window.TallyLax.Selectors
 * contracts: safe read helpers, guards undefined, NEVER writes to state
 */

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    
    /**
     * Selectors - Safe Read Helpers
     * 
     * UI must ALWAYS read via Selectors, never directly from GameState.
     * Selectors guard against undefined/null and provide clean interfaces.
     * 
     * CRITICAL: Selectors NEVER mutate GameState
     */
    var Selectors = {
        
        /**
         * Get user info
         * @returns {object} User object {name, org, title}
         */
        user: function() {
            var GS = TL.GameState;
            return {
                name: GS.user.name || 'Unknown',
                org: GS.user.org || 'Unknown',
                title: GS.user.title || 'President'
            };
        },
        
        /**
         * Get current day
         * @returns {number} Current day
         */
        day: function() {
            return TL.GameState.day || 1;
        },
        
        /**
         * Get current season year
         * @returns {number} Season year
         */
        seasonYear: function() {
            return TL.GameState.seasonYear || 2025;
        },
        
        /**
         * Get current phase
         * @returns {string} Current phase name
         */
        phase: function() {
            return TL.GameState.getCurrentPhase();
        },
        
        /**
         * Get current phase label
         * @returns {string} Human-readable phase label
         */
        phaseLabel: function() {
            return TL.GameState.getCurrentPhaseLabel();
        },
        
        /**
         * Get roster for a division/level
         * @param {string} org - Organization
         * @param {string} div - Division
         * @param {string} lvl - Level
         * @returns {Array} Array of player objects
         */
        roster: function(org, div, lvl) {
            var GS = TL.GameState;
            
            if (!div || !GS.divisions[div]) {
                return [];
            }
            
            var divData = GS.divisions[div];
            if (!divData.players || !Array.isArray(divData.players)) {
                return [];
            }
            
            // Filter by org and level
            var roster = [];
            for (var i = 0; i < divData.players.length; i++) {
                var playerId = divData.players[i];
                var player = GS.players[playerId];
                
                if (player && player.org === org && player.level === lvl) {
                    roster.push(player);
                }
            }
            
            return roster;
        },
        
        /**
         * Get player by ID
         * @param {string} id - Player ID
         * @returns {object|null} Player object or null
         */
        player: function(id) {
            var GS = TL.GameState;
            return GS.players[id] || null;
        },
        
        /**
         * Get lines for a team
         * @param {string} org - Organization
         * @param {string} div - Division
         * @param {string} lvl - Level
         * @returns {object} Lines object
         */
        lines: function(org, div, lvl) {
            var key = TL.Keys.key(org, div, lvl);
            return TL.GameState.lines[key] || {};
        },
        
        /**
         * Get schedule for a day
         * @param {number} day - Day number
         * @returns {Array} Array of game objects
         */
        schedule: function(day) {
            var GS = TL.GameState;
            return GS.schedule[day] || [];
        },
        
        /**
         * Get standings for division/level
         * @param {string} div - Division
         * @param {string} lvl - Level
         * @returns {object} Standings object
         */
        standings: function(div, lvl) {
            var key = TL.Keys.standingsKey(div, lvl);
            return TL.GameState.standings[key] || null;
        },
        
        /**
         * Get game log (recent games)
         * @param {number} count - Number of games to retrieve
         * @returns {Array} Array of game objects
         */
        gameLog: function(count) {
            var GS = TL.GameState;
            var log = GS.gameLog || [];
            
            if (!count || count >= log.length) {
                return log.slice();
            }
            
            return log.slice(-count);
        },
        
        /**
         * Get news feed
         * @param {number} count - Number of news items to retrieve
         * @returns {Array} Array of news objects
         */
        news: function(count) {
            var GS = TL.GameState;
            var news = GS.news || [];
            
            if (!count || count >= news.length) {
                return news.slice();
            }
            
            return news.slice(-count);
        },
        
        /**
         * Get training plan for team
         * @param {string} org - Organization
         * @param {string} div - Division
         * @param {string} lvl - Level
         * @returns {object|null} Training plan or null
         */
        trainingPlan: function(org, div, lvl) {
            var key = TL.Keys.key(org, div, lvl);
            return TL.GameState.training.plans[key] || null;
        },
        
        /**
         * Get coach assignment for team
         * @param {string} org - Organization
         * @param {string} div - Division
         * @param {string} lvl - Level
         * @returns {object|null} Coach object or null
         */
        coach: function(org, div, lvl) {
            var key = TL.Keys.key(org, div, lvl);
            var coachId = TL.GameState.coaches.assignments[key];
            
            if (!coachId) {
                return null;
            }
            
            var pool = TL.GameState.coaches.pool;
            for (var i = 0; i < pool.length; i++) {
                if (pool[i].id === coachId) {
                    return pool[i];
                }
            }
            
            return null;
        },
        
        /**
         * Get tournament data
         * @param {string} name - Tournament name ('laxfest' or 'foundersCup')
         * @returns {object|null} Tournament object or null
         */
        tournament: function(name) {
            return TL.GameState.tournaments[name] || null;
        },
        
        /**
         * Get playoff data
         * @returns {object} Playoffs object
         */
        playoffs: function() {
            return TL.GameState.playoffs || { active: false, brackets: {}, results: {} };
        },
        
        /**
         * Check if GameState is initialized
         * @returns {boolean} True if initialized
         */
        isInitialized: function() {
            return TL.GameState.initialized === true;
        },
        
        /**
         * Get all divisions
         * @returns {Array} Array of division names
         */
        divisions: function() {
            return TL.Constants.DIVISIONS.slice();
        },
        
        /**
         * Get all organizations
         * @returns {Array} Array of organization names
         */
        organizations: function() {
            return TL.Constants.ORGANIZATIONS.slice();
        },
        
        /**
         * Get player count for division
         * @param {string} org - Organization
         * @param {string} div - Division
         * @param {string} lvl - Level
         * @returns {number} Player count
         */
        playerCount: function(org, div, lvl) {
            return this.roster(org, div, lvl).length;
        }
    };
    
    // Export
    TL.Selectors = Selectors;
    
    console.log('âœ… Selectors loaded');
    
})();
