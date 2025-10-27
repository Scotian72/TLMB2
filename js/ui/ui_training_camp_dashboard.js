// js/ui/ui_training_camp_dashboard.js
// COMPREHENSIVE FIX: White text, clickable players, advance days, jersey conflicts

(function() {
  'use strict';
  window.TallyLax = window.TallyLax || {};

  var UITrainingCampDashboard = {
    show: function() {
      var state = window.TallyLax.GameState;
      var panel = document.getElementById('main-content-panel');
      
      if (!state || !panel) {
        console.error('GameState or panel missing');
        return;
      }

      var html = '<div class="training-camp-container">';
      
      // Header with WHITE text
      html += '<div class="training-camp-header">';
      html += '<h2 style="color: #ffffff !important;">' + state.user.org + ' Training Camp</h2>';
      html += '<p class="camp-subtitle" style="color: #ffffff !important;">Day ' + state.day + ' of 7</p>';
      html += '</div>';

      // Stats for all divisions - WHITE text
      ['U9', 'U11', 'U13', 'U15', 'U17'].forEach(function(div) {
        var divData = state.divisions[div];
        if (!divData || !divData.players) return;
        
        var totalPlayers = divData.players.length;
        var runners = divData.players.filter(function(p) { 
          return p.position !== 'G' && p.position !== 'Goalie'; 
        }).length;
        var goalies = divData.players.filter(function(p) { 
          return p.position === 'G' || p.position === 'Goalie'; 
        }).length;

        html += '<div class="camp-assignment-section" style="margin-bottom: 1.5rem;">';
        html += '<h3 style="color: #00bcd4;">' + div + ' Training Camp</h3>';
        
        // Stats with WHITE text
        html += '<div class="camp-stats">';
        html += '<div class="camp-stat">';
        html += '<strong style="color: #ffffff !important;">Total Players</strong>';
        html += '<div class="camp-stat-value">' + totalPlayers + '</div>';
        html += '</div>';
        html += '<div class="camp-stat">';
        html += '<strong style="color: #ffffff !important;">Runners</strong>';
        html += '<div class="camp-stat-value">' + runners + '</div>';
        html += '</div>';
        html += '<div class="camp-stat">';
        html += '<strong style="color: #ffffff !important;">Goalies</strong>';
        html += '<div class="camp-stat-value">' + goalies + '</div>';
        html += '</div>';
        html += '</div>';

        // Action buttons
        html += '<div class="camp-quick-actions">';
        html += '<button class="btn btn-primary" data-action="runcamp" data-param="' + div + '">View ' + div + ' Camp</button>';
        html += '<button class="btn btn-secondary" data-action="roster" data-param="' + div + '" data-param2="TC">View Roster</button>';
        html += '</div>';
        html += '</div>';
      });

      // Camp advance buttons
      html += '<div class="camp-assignment-section">';
      html += '<h3 style="color: #00bcd4;">Camp Actions</h3>';
      html += '<div class="camp-quick-actions">';
      html += '<button class="btn btn-success" data-action="advance-camp-day">Advance to Day ' + (state.day + 1) + '</button>';
      html += '<button class="btn btn-warning" data-action="auto-assign-all-teams">Auto-Assign All Teams (A/B)</button>';
      html += '<button class="btn btn-info" data-action="dashboard">Return to Dashboard</button>';
      html += '</div>';
      html += '</div>';

      html += '</div>';
      
      panel.innerHTML = html;
      console.log('✅ Training Camp Dashboard rendered');
    }
  };

  window.TallyLax.UITrainingCampDashboard = UITrainingCampDashboard;
  console.log('✅ UITrainingCampDashboard loaded');
})();
