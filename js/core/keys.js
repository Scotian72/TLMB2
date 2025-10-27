/* @tlos:6.2
 * role: core
 * name: keys.js
 * reads: Constants
 * writes: window.TallyLax.Keys
 * contracts: generates/parses composite keys, never inline strings like 'U13A'
 */

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    
    /**
     * Keys - Composite Key System
     * 
     * All composite keys follow format: "Org|Div|Lvl"
     * Examples: "Hawks|U13|A", "Lynx|U15|B"
     * 
     * NEVER use inline strings like "U13A" or "HawksU13A"
     * ALWAYS use Keys.key() to generate keys
     */
    var Keys = {
        
        /**
         * Generate composite key
         * @param {string} org - Organization name (e.g., 'Hawks')
         * @param {string} div - Division (e.g., 'U13')
         * @param {string} lvl - Level (e.g., 'A' or 'B')
         * @returns {string} Composite key (e.g., 'Hawks|U13|A')
         */
        key: function(org, div, lvl) {
            if (!org || !div || !lvl) {
                console.error('Keys.key() missing params:', org, div, lvl);
                return null;
            }
            return org + '|' + div + '|' + lvl;
        },
        
        /**
         * Parse composite key into components
         * @param {string} key - Composite key (e.g., 'Hawks|U13|A')
         * @returns {object} {org, div, lvl} or null if invalid
         */
        parse: function(key) {
            if (!key || typeof key !== 'string') {
                return null;
            }
            
            var parts = key.split('|');
            if (parts.length !== 3) {
                console.error('Keys.parse() invalid format:', key);
                return null;
            }
            
            return {
                org: parts[0],
                div: parts[1],
                lvl: parts[2]
            };
        },
        
        /**
         * Generate standings key (no org, just Div|Lvl)
         * @param {string} div - Division (e.g., 'U13')
         * @param {string} lvl - Level (e.g., 'A')
         * @returns {string} Standings key (e.g., 'U13|A')
         */
        standingsKey: function(div, lvl) {
            if (!div || !lvl) {
                console.error('Keys.standingsKey() missing params:', div, lvl);
                return null;
            }
            return div + '|' + lvl;
        },
        
        /**
         * Parse standings key
         * @param {string} key - Standings key (e.g., 'U13|A')
         * @returns {object} {div, lvl} or null if invalid
         */
        parseStandingsKey: function(key) {
            if (!key || typeof key !== 'string') {
                return null;
            }
            
            var parts = key.split('|');
            if (parts.length !== 2) {
                console.error('Keys.parseStandingsKey() invalid format:', key);
                return null;
            }
            
            return {
                div: parts[0],
                lvl: parts[1]
            };
        },
        
        /**
         * Generate player ID
         * @param {string} prefix - Prefix (e.g., 'p')
         * @param {number} counter - Counter value
         * @returns {string} Player ID (e.g., 'p1234')
         */
        playerId: function(prefix, counter) {
            return (prefix || 'p') + counter;
        },
        
        /**
         * Validate key format
         * @param {string} key - Key to validate
         * @returns {boolean} True if valid format
         */
        isValid: function(key) {
            if (!key || typeof key !== 'string') {
                return false;
            }
            
            var parts = key.split('|');
            return parts.length === 3 && 
                   parts[0].length > 0 && 
                   parts[1].length > 0 && 
                   parts[2].length > 0;
        },
        
        /**
         * Validate standings key format
         * @param {string} key - Key to validate
         * @returns {boolean} True if valid format
         */
        isValidStandingsKey: function(key) {
            if (!key || typeof key !== 'string') {
                return false;
            }
            
            var parts = key.split('|');
            return parts.length === 2 && 
                   parts[0].length > 0 && 
                   parts[1].length > 0;
        }
    };
    
    // Export
    TL.Keys = Keys;
    
    console.log('âœ… Keys loaded');
    
})();
