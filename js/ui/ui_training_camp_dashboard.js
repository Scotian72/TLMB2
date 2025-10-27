/**
 * Training Camp Dashboard (v6.2) - NEW MODULE
 * Overall training camp management for all divisions
 * Contract: Provides single interface to manage all training camps at once
 */

(function() {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};
  
  /**
   * Render the training camp dashboard
   */
  TL.UI.renderTrainingCampDashboard = function() {
    var gs = TL.GameState;
    var constants = TL.Constants;
    
    var html = '<div class="training-camp-dashboard">';
    
    // Header
    html += '<div class="dashboard-header">';
    html += '<h1>🏕️ Training Camp Dashboard</h1>';
    html += '<p>Manage all divisions from one place</p>';
    html += '</div>';
    
    // Action buttons
    html += '<div class="dashboard-actions">';
    html += '<button class="btn-primary btn-large" data-action="auto-assign-all-teams">';
    html += '⚡ Auto-Assign ALL Teams & Jerseys';
    html += '</button>';
    html += '<button class="btn-secondary" data-action="complete-all-camps">';
    html += '✅ Complete All Training Camps';
    html += '</button>';
    html += '</div>';
    
    // Division cards
    html += '<div class="division-cards">';
    
    for (var i = 0; i < constants.DIVISIONS.length; i++) {
      var div = constants.DIVISIONS[i];
      html += this._buildDivisionCard(div);
    }
    
    html += '</div>';
    
    html += '</div>';
    
    TL.UI.mount(html);
    console.log('✅ Training Camp Dashboard rendered');
  };
  
  /**
   * Build a single division card
   */
  TL.UI._buildDivisionCard = function(division) {
    var gs = TL.GameState;
    var org = gs.user.org;
    
    // Get roster info
    var tcRoster = TL.Selectors.roster(org, division, 'TC') || [];
    var aRoster = TL.Selectors.roster(org, division, 'A') || [];
    var bRoster = TL.Selectors.roster(org, division, 'B') || [];
    
    var isComplete = (division === 'U9' && tcRoster.length === 0) || 
                     (division !== 'U9' && tcRoster.length === 0 && aRoster.length > 0);
    
    var html = '<div class="division-card ' + (isComplete ? 'complete' : '') + '">';
    
    // Card header
    html += '<div class="card-header">';
    html += '<h2>' + division + '</h2>';
    
    if (isComplete) {
      html += '<span class="status-badge complete">✓ Complete</span>';
    } else {
      html += '<span class="status-badge pending">⏳ In Progress</span>';
    }
    
    html += '</div>';
    
    // Card body
    html += '<div class="card-body">';
    
    if (division === 'U9') {
      // U9 special case
      html += '<div class="roster-summary">';
      html += '<div class="roster-count">';
      html += '<span class="count">' + tcRoster.length + '</span>';
      html += '<span class="label">Players</span>';
      html += '</div>';
      html += '</div>';
      
      html += '<div class="card-actions">';
      if (tcRoster.length > 0) {
        html += '<button class="btn" data-action="roster" data-param="' + division + '" data-param2="TC">View Roster</button>';
        html += '<button class="btn" data-action="runcamp" data-param="' + division + '">Manage Camp</button>';
      } else {
        html += '<p class="text-muted">Training camp complete</p>';
      }
      html += '</div>';
      
    } else {
      // U11-U17
      html += '<div class="roster-summary">';
      
      if (tcRoster.length > 0) {
        html += '<div class="roster-count">';
        html += '<span class="count">' + tcRoster.length + '</span>';
        html += '<span class="label">In Camp</span>';
        html += '</div>';
      } else {
        html += '<div class="roster-count split">';
        html += '<div>';
        html += '<span class="count">' + aRoster.length + '</span>';
        html += '<span class="label">Team A</span>';
        html += '</div>';
        html += '<div>';
        html += '<span class="count">' + bRoster.length + '</span>';
        html += '<span class="label">Team B</span>';
        html += '</div>';
        html += '</div>';
      }
      
      html += '</div>';
      
      html += '<div class="card-actions">';
      if (tcRoster.length > 0) {
        html += '<button class="btn" data-action="roster" data-param="' + division + '" data-param2="TC">View Roster</button>';
        html += '<button class="btn" data-action="runcamp" data-param="' + division + '">Manage Camp</button>';
        html += '<button class="btn-primary" data-action="auto-assign-teams" data-param="' + division + '">Auto-Assign Teams</button>';
      } else {
        html += '<button class="btn" data-action="roster" data-param="' + division + '" data-param2="A">View Team A</button>';
        html += '<button class="btn" data-action="roster" data-param="' + division + '" data-param2="B">View Team B</button>';
      }
      html += '</div>';
    }
    
    html += '</div>';
    
    html += '</div>';
    
    return html;
  };
  
  console.log('✅ UITrainingCampDashboard loaded');
  
})();
