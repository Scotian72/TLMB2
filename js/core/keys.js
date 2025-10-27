/**
 * TallyLax Keys (v6.2)
 * Composite key system for Org|Div|Lvl
 * Contract: Never hardcode "U13A"; always use Keys.key()
 */

(function() {
  'use strict';

  var Keys = {
    
    // Create composite key
    key: function(org, div, lvl) {
      if (!org || !div || !lvl) {
        console.error('Keys.key: Missing parameter', org, div, lvl);
        return null;
      }
      return org + '|' + div + '|' + lvl;
    },
    
    // Parse composite key
    parse: function(key) {
      if (!key || typeof key !== 'string') {
        return null;
      }
      
      var parts = key.split('|');
      if (parts.length !== 3) {
        console.error('Keys.parse: Invalid key format', key);
        return null;
      }
      
      return {
        org: parts[0],
        div: parts[1],
        lvl: parts[2]
      };
    },
    
    // Validate key
    isValid: function(key) {
      var parsed = this.parse(key);
      return parsed !== null;
    },
    
    // Create division key (no org)
    divKey: function(div, lvl) {
      if (!div || !lvl) {
        console.error('Keys.divKey: Missing parameter', div, lvl);
        return null;
      }
      return div + '|' + lvl;
    },
    
    // Parse division key
    parseDivKey: function(key) {
      if (!key || typeof key !== 'string') {
        return null;
      }
      
      var parts = key.split('|');
      if (parts.length !== 2) {
        console.error('Keys.parseDivKey: Invalid key format', key);
        return null;
      }
      
      return {
        div: parts[0],
        lvl: parts[1]
      };
    }
  };

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.Keys = Keys;
  window.TL = window.TallyLax; // Alias
})();
