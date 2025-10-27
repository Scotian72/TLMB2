/**
 * UI Roster (v6.2) - IMPROVED
 * Displays team rosters with player information
 * 
 * ✅ IMPROVED: Shows jersey numbers prominently
 * ✅ IMPROVED: Shows handedness correctly
 * ✅ IMPROVED: Better attribute display
 */

(function() {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};
  
  /**
   * Render roster table
   */
  TL.UI.renderRoster = function(division, level) {
    var gs = TL.GameState;
    var org = gs.user.org;
    var roster = TL.Selectors.roster(org, division, level);
    
    if (!roster) {
      TL.UI.mount('<div class="error">Roster not found</div>');
      return;
    }
    
    var html = '<div class="roster-container">';
    
    // Header
    html += '<div class="roster-header">';
    html += '<h1>' + org + ' ' + division + ' ' + (level === 'TC' ? 'Training Camp' : 'Team ' + level) + '</h1>';
    html += '<p class="roster-count">' + roster.length + ' players</p>';
    html += '</div>';
    
    // Quick actions
    html += '<div class="roster-actions">';
    if (level !== 'TC') {
      html += '<button class="btn" data-action="lines" data-param="' + division + '" data-param2="' + level + '">⚡ Set Lines</button>';
    }
    html += '<button class="btn" data-action="runcamp" data-param="' + division + '">🏕️ Training Camp</button>';
    html += '</div>';
    
    if (roster.length === 0) {
      html += '<div class="empty-roster">';
      html += '<p>No players in this roster</p>';
      html += '</div>';
    } else {
      // Sort roster: goalies first, then by jersey number
      var sortedRoster = roster.slice().sort(function(a, b) {
        if (a.position === 'goalie' && b.position !== 'goalie') return -1;
        if (a.position !== 'goalie' && b.position === 'goalie') return 1;
        return (a.jersey || 999) - (b.jersey || 999);
      });
      
      html += '<div class="roster-table-wrapper">';
      html += '<table class="roster-table">';
      html += '<thead>';
      html += '<tr>';
      html += '<th>#</th>'; // ✅ Jersey column
      html += '<th>Name</th>';
      html += '<th>Pos</th>';
      html += '<th>Age</th>';
      html += '<th>Hand</th>'; // ✅ Handedness
      html += '<th>OVR</th>';
      html += '<th>Top Attrs</th>';
      html += '<th>Morale</th>';
      html += '<th>Action</th>';
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>';
      
      for (var i = 0; i < sortedRoster.length; i++) {
        var p = sortedRoster[i];
        html += '<tr class="roster-row" data-player-id="' + p.id + '">';
        
        // ✅ Jersey
        html += '<td class="jersey-col"><strong>' + (p.jersey || '?') + '</strong></td>';
        
        // Name
        html += '<td class="name-col">' + p.name + '</td>';
        
        // Position
        var posIcon = p.position === 'goalie' ? '🥅' : '🏃';
        html += '<td>' + posIcon + ' ' + (p.position === 'goalie' ? 'G' : 'R') + '</td>';
        
        // Age
        html += '<td>' + p.age + '</td>';
        
        // ✅ Handedness
        html += '<td>' + (p.handedness || 'R') + '</td>';
        
        // OVR with color coding
        var ovrClass = p.ovr >= 70 ? 'ovr-high' : p.ovr >= 50 ? 'ovr-mid' : 'ovr-low';
        html += '<td class="' + ovrClass + '"><strong>' + p.ovr + '</strong></td>';
        
        // Top attributes
        html += '<td class="attrs-col">' + this._getTopAttrs(p) + '</td>';
        
        // Morale
        var moraleClass = p.morale >= 70 ? 'morale-good' : p.morale >= 40 ? 'morale-ok' : 'morale-bad';
        html += '<td class="' + moraleClass + '">' + p.morale + '</td>';
        
        // Action
        html += '<td>';
        html += '<button class="btn-small" data-action="player-card" data-param="' + p.id + '">View</button>';
        html += '</td>';
        
        html += '</tr>';
      }
      
      html += '</tbody>';
      html += '</table>';
      html += '</div>';
    }
    
    html += '</div>';
    
    TL.UI.mount(html);
    console.log('Roster rendered:', org, division, level);
  };
  
  /**
   * Get top 3 attributes for a player
   */
  TL.UI._getTopAttrs = function(p) {
    var attrs = [];
    
    if (p.position === 'goalie') {
      // Goalie attributes
      var goalieAttrs = [
        { name: 'Ref', val: p.reflexes },
        { name: 'Ang', val: p.angles },
        { name: 'Reb', val: p.reboundControl },
        { name: 'Pos', val: p.positioning }
      ];
      
      goalieAttrs.sort(function(a, b) { return (b.val || 0) - (a.val || 0); });
      
      for (var i = 0; i < Math.min(3, goalieAttrs.length); i++) {
        attrs.push(goalieAttrs[i].name + ':' + (goalieAttrs[i].val || 0));
      }
    } else {
      // Runner attributes
      var runnerAttrs = [
        { name: 'Fin', val: p.finishing },
        { name: 'Pwr', val: p.shootingPower },
        { name: 'Pas', val: p.passing },
        { name: 'Vis', val: p.vision },
        { name: 'Spd', val: p.transSpeed },
        { name: 'Def', val: p.defenseIQ }
      ];
      
      runnerAttrs.sort(function(a, b) { return (b.val || 0) - (a.val || 0); });
      
      for (var i = 0; i < Math.min(3, runnerAttrs.length); i++) {
        attrs.push(runnerAttrs[i].name + ':' + (runnerAttrs[i].val || 0));
      }
    }
    
    return attrs.join(' | ');
  };
  
  console.log('✅ UIRoster loaded (v6.2 - IMPROVED)');
  
})();
