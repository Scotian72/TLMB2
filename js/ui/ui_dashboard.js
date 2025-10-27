// js/ui/ui_dashboard.js
// Main dashboard view

(function() {
  'use strict';
  
  window.TallyLax = window.TallyLax || {};
  var TL = window.TallyLax;
  
  var UIDashboard = {
    show: function() {
      var state = TL.GameState;
      var panel = document.getElementById('main-content-panel');
      
      if (!panel || !state) {
        console.error('Dashboard: Panel or GameState missing');
        return;
      }
      
      var html = '<div class="dashboard-container" style="padding: 2rem; color: #ffffff;">';
      
      // Header
      html += '<div style="text-align: center; margin-bottom: 2rem;">';
      html += '<h1 style="color: #00bcd4;">🥍 ' + state.user.org + ' Training Camp</h1>';
      html += '<p style="color: #ffffff; font-size: 1.2rem;">Day ' + state.day + ' | Season ' + state.seasonYear + '</p>';
      html += '</div>';
      
      // Phase info
      html += '<div style="background: #2a2a2a; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;">';
      html += '<h2 style="color: #ffffff; margin-top: 0;">Current Phase: ' + (state.phase || 'TRAINING_CAMP') + '</h2>';
      
      if (state.phase === 'TRAINING_CAMP') {
        html += '<p style="color: #ffffff; font-size: 1.1rem;">Evaluate players, run clinics, assign teams</p>';
      } else {
        html += '<p style="color: #ffffff; font-size: 1.1rem;">Regular season in progress</p>';
      }
      html += '</div>';
      
      // Quick actions
      html += '<div style="background: #2a2a2a; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">';
      html += '<h3 style="color: #00bcd4; margin-top: 0;">Quick Actions</h3>';
      html += '<div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">';
      
      if (state.phase === 'TRAINING_CAMP') {
        html += '<button class="btn btn-primary" data-action="training-camp-dashboard">Training Camp Dashboard</button>';
        html += '<button class="btn btn-secondary" data-action="runcamp" data-param="U11">View U11 Camp</button>';
        html += '<button class="btn btn-success" data-action="advance-camp-day">Advance to Day ' + (state.day + 1) + '</button>';
      } else {
        html += '<button class="btn btn-primary" data-action="roster" data-param="U11" data-param2="A">View Rosters</button>';
        html += '<button class="btn btn-secondary" data-action="advance-day">Advance Day</button>';
      }
      
      html += '<button class="btn btn-info" data-action="organization">Organization</button>';
      html += '</div>';
      html += '</div>';
      
      // Division overview
      html += '<div style="background: #2a2a2a; padding: 1.5rem; border-radius: 8px;">';
      html += '<h3 style="color: #00bcd4; margin-top: 0;">Division Overview</h3>';
      html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">';
      
      ['U9', 'U11', 'U13', 'U15', 'U17'].forEach(function(div) {
        var divData = state.divisions[div];
        var playerCount = divData && divData.players ? divData.players.length : 0;
        
        html += '<div style="background: #1a1a1a; padding: 1rem; border-radius: 4px; text-align: center;">';
        html += '<h4 style="color: #ffffff; margin: 0 0 0.5rem 0;">' + div + '</h4>';
        html += '<p style="color: #00bcd4; font-size: 1.5rem; margin: 0;">' + playerCount + '</p>';
        html += '<p style="color: #b0b0b0; font-size: 0.9rem; margin: 0.5rem 0 0 0;">players</p>';
        html += '</div>';
      });
      
      html += '</div>';
      html += '</div>';
      
      html += '</div>';
      
      panel.innerHTML = html;
      console.log('✅ Dashboard rendered - Day ' + state.day);
    }
  };
  
  window.TallyLax.UIDashboard = UIDashboard;
  console.log('✅ UIDashboard loaded (v6.2)');
})();
