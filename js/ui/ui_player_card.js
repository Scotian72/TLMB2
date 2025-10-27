/**
 * UI Player Card - Full Player Profile View (v6.2 - FIXED)
 * Shows: attrs, traits, morale, stats, development log
 * 
 * ✅ FIXED: Reads attributes directly from player object (not nested in .attributes)
 * ✅ FIXED: Shows handedness correctly as 'L' or 'R'
 * ✅ FIXED: Shows jersey number
 * ✅ FIXED: Shows archetype
 * ✅ IMPROVED: Shows all stats being tracked
 */
(function() {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};
  
  /**
   * Show player card by ID
   */
  TL.UI.renderPlayerCard = function(playerId) {
    var gs = TL.GameState;
    var player = gs.players[playerId];
    
    if (!player) {
      TL.UI.mount('<div class="error">Player not found: ' + playerId + '</div>');
      return;
    }
    
    var html = this._buildPlayerCard(player);
    TL.UI.mount(html);
    
    console.log('Player card shown:', player.name);
  };
  
  /**
   * Build complete player card HTML
   */
  TL.UI._buildPlayerCard = function(p) {
    var html = '<div class="player-card-container">';
    
    // Header
    html += '<div class="player-card-header">';
    html += '<button class="btn-back" data-action="roster" data-param="' + p.division + '" data-param2="' + p.level + '">← Back to Roster</button>';
    
    // ✅ IMPROVED: Show jersey number prominently
    var jerseyDisplay = p.jersey ? '#' + p.jersey : '#??';
    html += '<h1 class="player-name">' + jerseyDisplay + ' ' + (p.name || 'Unknown') + '</h1>';
    
    // Edit button
    html += '<button class="btn-edit" data-action="edit-player" data-param="' + p.id + '">✏️ Edit</button>';
    
    html += '<div class="player-meta">';
    html += '<span class="badge">' + p.org + ' ' + p.division + ' ' + p.level + '</span>';
    html += '<span class="badge">' + (p.position || 'Runner') + '</span>';
    html += '<span class="badge">Age ' + (p.age || 8) + '</span>';
    
    // ✅ FIXED: Show handedness correctly
    var handDisplay = p.handedness === 'L' ? 'Left' : 'Right';
    html += '<span class="badge">' + handDisplay + ' Hand</span>';
    
    // ✅ NEW: Show archetype if exists
    if (p.archetype) {
      html += '<span class="badge badge-archetype">' + p.archetype.replace(/_/g, ' ') + '</span>';
    }
    
    if (p.rookie) html += '<span class="badge badge-rookie">Rookie</span>';
    html += '</div>';
    html += '</div>';
    
    // Overall Rating
    html += '<div class="player-ovr-section">';
    html += '<div class="ovr-main">Overall: <strong>' + (p.ovr || 50) + '</strong></div>';
    html += '<div class="ovr-role">Talent: ' + (p.talentTier || 'AVERAGE') + '</div>';
    html += '</div>';
    
    // Morale
    html += '<div class="player-morale-section">';
    html += '<div class="morale-bar-container">';
    html += '<label>Player Morale:</label>';
    html += '<div class="morale-bar">';
    html += '<div class="morale-fill" style="width: ' + (p.morale || 70) + '%"></div>';
    html += '</div>';
    html += '<span class="morale-value">' + (p.morale || 70) + '/100</span>';
    html += '</div>';
    html += '<div class="morale-bar-container">';
    html += '<label>Parent Morale:</label>';
    html += '<div class="morale-bar">';
    html += '<div class="morale-fill parent" style="width: ' + (p.parentMorale || 70) + '%"></div>';
    html += '</div>';
    html += '<span class="morale-value">' + (p.parentMorale || 70) + '/100</span>';
    html += '</div>';
    html += '</div>';
    
    // Attributes Section
    if (p.position === 'goalie') {
      html += this._buildGoalieAttrs(p);
    } else {
      html += this._buildRunnerAttrs(p);
    }
    
    // Jersey Preferences
    if (p.favoriteJerseys && p.favoriteJerseys.length > 0) {
      html += '<div class="jersey-prefs-section">';
      html += '<h3>Favorite Jersey Numbers</h3>';
      html += '<div class="jersey-prefs">';
      for (var i = 0; i < p.favoriteJerseys.length; i++) {
        html += '<span class="jersey-badge">' + p.favoriteJerseys[i] + '</span>';
      }
      html += '</div>';
      html += '</div>';
    }
    
    // Traits Section
    html += this._buildTraits(p);
    
    // Stats Section
    html += this._buildStats(p);
    
    // Development Log
    if (p.devLog && p.devLog.length > 0) {
      html += this._buildDevLog(p.devLog);
    }
    
    html += '</div>';
    return html;
  };
  
  /**
   * ✅ FIXED: Build runner attributes display - reads directly from player object
   */
  TL.UI._buildRunnerAttrs = function(p) {
    var html = '<div class="attrs-section">';
    html += '<h3>Attributes</h3>';
    html += '<div class="attrs-grid">';
    
    // Offense
    html += '<div class="attr-group">';
    html += '<h4>Offense</h4>';
    html += this._attr('Finishing', p.finishing);
    html += this._attr('Shooting Power', p.shootingPower);
    html += this._attr('Passing', p.passing);
    html += this._attr('Vision', p.vision);
    html += '</div>';
    
    // Athleticism
    html += '<div class="attr-group">';
    html += '<h4>Athleticism</h4>';
    html += this._attr('Speed', p.transSpeed);
    html += this._attr('Endurance', p.endurance);
    html += this._attr('Balance', p.balance);
    html += '</div>';
    
    // Defense
    html += '<div class="attr-group">';
    html += '<h4>Defense</h4>';
    html += this._attr('Defense IQ', p.defenseIQ);
    html += this._attr('Checking', p.checking);
    html += this._attr('Stick Lift', p.stickLift);
    html += '</div>';
    
    // Intangibles
    html += '<div class="attr-group">';
    html += '<h4>Intangibles</h4>';
    html += this._attr('Faceoff', p.faceoff);
    html += this._attr('Tenacity', p.tenacity);
    html += this._attr('Discipline', p.discipline);
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    return html;
  };
  
  /**
   * Build goalie attributes display
   */
  TL.UI._buildGoalieAttrs = function(p) {
    var html = '<div class="attrs-section">';
    html += '<h3>Goalie Attributes</h3>';
    html += '<div class="attrs-grid">';
    
    // Technical
    html += '<div class="attr-group">';
    html += '<h4>Technical</h4>';
    html += this._attr('Reflexes', p.reflexes);
    html += this._attr('Angles', p.angles);
    html += this._attr('Rebound Control', p.reboundControl);
    html += this._attr('Hand Speed', p.handSpeed);
    html += '</div>';
    
    // Physical
    html += '<div class="attr-group">';
    html += '<h4>Physical</h4>';
    html += this._attr('Agility', p.agility);
    html += this._attr('Positioning', p.positioning);
    html += '</div>';
    
    // Mental
    html += '<div class="attr-group">';
    html += '<h4>Mental</h4>';
    html += this._attr('Communication', p.communication);
    html += this._attr('Stick Skills', p.stickSkills);
    html += this._attr('Clutch', p.clutch);
    html += this._attr('Consistency', p.consistency);
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    return html;
  };
  
  /**
   * Single attribute display
   */
  TL.UI._attr = function(label, value) {
    value = value || 0;
    var color = this._attrColor(value);
    return '<div class="attr-row">' +
           '<span class="attr-label">' + label + '</span>' +
           '<span class="attr-bar"><span class="attr-fill" style="width: ' + value + '%; background: ' + color + '"></span></span>' +
           '<span class="attr-value">' + value + '</span>' +
           '</div>';
  };
  
  /**
   * Get color for attribute value
   */
  TL.UI._attrColor = function(val) {
    if (val >= 80) return '#10b981'; // green
    if (val >= 60) return '#3b82f6'; // blue
    if (val >= 40) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };
  
  /**
   * Build traits display
   */
  TL.UI._buildTraits = function(p) {
    var html = '<div class="traits-section">';
    html += '<h3>Traits</h3>';
    
    if (p.traits && p.traits.length > 0) {
      html += '<div class="traits-list">';
      for (var i = 0; i < p.traits.length; i++) {
        html += '<span class="trait-badge">' + p.traits[i] + '</span>';
      }
      html += '</div>';
    } else {
      html += '<p class="text-muted">No traits</p>';
    }
    
    if (p.parentTraits && p.parentTraits.length > 0) {
      html += '<h4>Parent Traits</h4>';
      html += '<div class="traits-list">';
      for (var i = 0; i < p.parentTraits.length; i++) {
        html += '<span class="trait-badge parent">' + p.parentTraits[i] + '</span>';
      }
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  };
  
  /**
   * ✅ IMPROVED: Build comprehensive stats display
   */
  TL.UI._buildStats = function(p) {
    var html = '<div class="stats-section">';
    html += '<h3>Season Stats</h3>';
    
    var stats = p.season || {};
    html += '<div class="stats-grid">';
    html += '<div class="stat-box"><label>GP</label><span>' + (stats.gp || 0) + '</span></div>';
    
    if (p.position === 'goalie') {
      html += '<div class="stat-box"><label>Saves</label><span>' + (stats.sv || 0) + '</span></div>';
      html += '<div class="stat-box"><label>GA</label><span>' + (stats.ga || 0) + '</span></div>';
      var svPct = stats.sv > 0 ? (stats.sv / (stats.sv + stats.ga)).toFixed(3) : '0.000';
      html += '<div class="stat-box"><label>Save %</label><span>' + svPct + '</span></div>';
    } else {
      html += '<div class="stat-box"><label>Goals</label><span>' + (stats.g || 0) + '</span></div>';
      html += '<div class="stat-box"><label>Assists</label><span>' + (stats.a || 0) + '</span></div>';
      html += '<div class="stat-box"><label>Points</label><span>' + (stats.pts || 0) + '</span></div>';
      html += '<div class="stat-box"><label>Shots</label><span>' + (stats.shots || 0) + '</span></div>';
      html += '<div class="stat-box"><label>PIM</label><span>' + (stats.pim || 0) + '</span></div>';
      
      // Shooting %
      var shootPct = stats.shots > 0 ? ((stats.g / stats.shots) * 100).toFixed(1) : '0.0';
      html += '<div class="stat-box"><label>Shoot %</label><span>' + shootPct + '%</span></div>';
    }
    
    html += '</div>';
    
    // Career stats summary
    var career = p.career || {};
    if (career.gp > 0) {
      html += '<h4>Career Stats</h4>';
      html += '<div class="stats-grid">';
      html += '<div class="stat-box"><label>GP</label><span>' + (career.gp || 0) + '</span></div>';
      
      if (p.position === 'goalie') {
        html += '<div class="stat-box"><label>Saves</label><span>' + (career.sv || 0) + '</span></div>';
        html += '<div class="stat-box"><label>GA</label><span>' + (career.ga || 0) + '</span></div>';
        var careerSvPct = career.sv > 0 ? (career.sv / (career.sv + career.ga)).toFixed(3) : '0.000';
        html += '<div class="stat-box"><label>Save %</label><span>' + careerSvPct + '</span></div>';
      } else {
        html += '<div class="stat-box"><label>Goals</label><span>' + (career.g || 0) + '</span></div>';
        html += '<div class="stat-box"><label>Assists</label><span>' + (career.a || 0) + '</span></div>';
        html += '<div class="stat-box"><label>Points</label><span>' + (career.pts || 0) + '</span></div>';
      }
      
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  };
  
  /**
   * Build development log
   */
  TL.UI._buildDevLog = function(log) {
    var html = '<div class="devlog-section">';
    html += '<h3>Development Log</h3>';
    html += '<div class="devlog-list">';
    
    for (var i = Math.max(0, log.length - 10); i < log.length; i++) {
      html += '<div class="devlog-entry">' + log[i] + '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    return html;
  };
  
  console.log('✅ UIPlayerCard loaded (v6.2 - FIXED)');
  
})();
