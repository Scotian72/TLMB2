/**
 * UI Dashboard (v6.2) - IMPROVED
 * Main dashboard with day counter, phase info, and quick actions
 * 
 * ✅ FIXED: Day counter now updates properly
 * ✅ IMPROVED: Action buttons at top (Start Training Camp, Advance Day)
 */

(function() {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};
  
  /**
   * Render main dashboard
   */
  TL.UI.renderDashboard = function() {
    var gs = TL.GameState;
    
    var html = '<div class="dashboard-container">';
    
    // ✅ NEW: Clean header with day/phase/advance button in top right
    html += '<div class="dashboard-header-new">';
    html += '<div class="header-left">';
    html += '<h1>' + gs.user.name + ' - ' + gs.user.org + '</h1>';
    html += '<h2>Season ' + (gs.seasonYear || 1) + '</h2>';
    html += '</div>';
    // ✅ FIXED: Always show advance button in top right
    html += '<div class="header-right">';
    html += '<div class="day-phase-info">';
    html += '<div class="day-display">Day ' + gs.day + ' of ' + TL.Constants.SEASON_LENGTH_DAYS + '</div>';
    var phase = this._getCurrentPhase();
    html += '<div class="phase-display">' + phase.name + '</div>';
    html += '</div>';
    
    // ✅ CRITICAL FIX: ALWAYS show advance button
    if (gs.day <= TL.Constants.TRAINING_CAMP_END_DAY) {
      // During training camp - link to camp dashboard but also show advance option
      html += '<div class="button-group-vertical">';
      html += '<button class="btn-advance btn-primary" data-action="training-camp-dashboard" style="margin-bottom: 4px;">';
      html += '🏕️ Training Camp';
      html += '</button>';
      html += '<button class="btn-advance btn-secondary" data-action="advance-day">';
      html += '⏭️ Advance Day';
      html += '</button>';
      html += '</div>';
    } else {
      // After training camp - show advance day
      html += '<button class="btn-advance btn-primary" data-action="advance-day">';
      html += '⏭️ Advance Day';
      html += '</button>';
    }
    html += '</div>';
    html += '</div>';
    
    // Quick stats (compact)
    html += '<div class="dashboard-quick-stats">';
    
    var divisions = TL.Constants.DIVISIONS;
    for (var i = 0; i < divisions.length; i++) {
      var div = divisions[i];
      html += this._buildCompactDivisionCard(div);
    }
    
    html += '</div>';
    
    // Quick actions
    html += '<div class="quick-actions-compact">';
    html += '<button class="action-btn-compact" data-action="schedule">📅 Schedule</button>';
    html += '<button class="action-btn-compact" data-action="standings">📊 Standings</button>';
    html += '<button class="action-btn-compact" data-action="league-organizations">🏢 All Teams</button>';
    html += '<button class="action-btn-compact" data-action="save">💾 Save</button>';
    html += '</div>';
    
    html += '</div>';
    
    TL.UI.mount(html);
    console.log('✅ Dashboard rendered - Day', gs.day);
  };
  
  /**
   * Get current phase info
   */
  TL.UI._getCurrentPhase = function() {
    var gs = TL.GameState;
    var day = gs.day;
    
    if (day <= 7) {
      return {
        name: 'Training Camp',
        description: 'Evaluate players and assign teams'
      };
    } else if (day <= 150) {
      return {
        name: 'Regular Season',
        description: 'Playing scheduled games'
      };
    } else if (day <= 180) {
      return {
        name: 'Playoffs',
        description: 'Championship tournament'
      };
    } else {
      return {
        name: 'Off-Season',
        description: 'Season complete - preparing for next year'
      };
    }
  };
  
  /**
   * Build compact division card for dashboard
   */
  TL.UI._buildCompactDivisionCard = function(division) {
    var gs = TL.GameState;
    var org = gs.user.org;
    
    var tcRoster = TL.Selectors.roster(org, division, 'TC') || [];
    var aRoster = TL.Selectors.roster(org, division, 'A') || [];
    var bRoster = TL.Selectors.roster(org, division, 'B') || [];
    
    var html = '<div class="compact-division-card">';
    html += '<div class="division-name-compact">' + division + '</div>';
    
    if (division === 'U9') {
      html += '<div class="division-count">' + tcRoster.length + ' players</div>';
      html += '<button class="btn-mini" data-action="roster" data-param="' + division + '" data-param2="TC">View</button>';
    } else {
      if (tcRoster.length > 0) {
        html += '<div class="division-count">' + tcRoster.length + ' in camp</div>';
        html += '<button class="btn-mini" data-action="runcamp" data-param="' + division + '">Camp</button>';
      } else {
        html += '<div class="division-count">A:' + aRoster.length + ' B:' + bRoster.length + '</div>';
        html += '<button class="btn-mini" data-action="roster" data-param="' + division + '" data-param2="A">A</button>';
        html += '<button class="btn-mini" data-action="roster" data-param="' + division + '" data-param2="B">B</button>';
      }
    }
    
    html += '</div>';
    
    return html;
  };
  
  console.log('✅ UIDashboard loaded (v6.2 - IMPROVED)');
  
})();
