// js/ui/ui_training_camp.js
// COMPREHENSIVE FIX: Clickable player cards, proper rendering, white text

(function() {
  'use strict';
  window.TallyLax = window.TallyLax || {};

  var UITrainingCamp = {
    currentDivision: 'U11',

    show: function(division) {
      this.currentDivision = division || this.currentDivision;
      var state = window.TallyLax.GameState;
      
      if (!state) {
        console.error('GameState missing');
        return;
      }

      var currentDay = Number(state.day || 1);
      var panel = document.getElementById('main-content-panel');
      
      if (!panel) {
        console.error('#main-content-panel not found');
        return;
      }

      // Camp is over after Day 7
      if (currentDay > 7 || state.phase !== 'TRAINING_CAMP') {
        panel.innerHTML = 
          '<div class="training-camp-closed">' +
          '<h2>🏕️ Training Camp Complete</h2>' +
          '<p>All players have been assigned and the regular season is underway!</p>' +
          '</div>';
        return;
      }

      var divNode = state.divisions && state.divisions[this.currentDivision];
      if (!divNode || !Array.isArray(divNode.players)) {
        panel.innerHTML = '<div class="training-camp-closed"><h2>⚠️ Division ' + this.currentDivision + ' not found</h2></div>';
        return;
      }

      var players = divNode.players;

      // Build HTML
      var html = '<div class="training-camp-container">';
      
      // Header with WHITE text
      html += '<div class="training-camp-header">';
      html += '<h2 style="color: #ffffff !important;">🥍 ' + state.user.org + ' ' + this.currentDivision + ' Training Camp</h2>';
      html += '<p class="camp-subtitle" style="color: #ffffff !important;">Day ' + currentDay + ' of 7 - Evaluating players</p>';
      
      if (currentDay === 7) {
        html += '<p class="camp-warning">⚠️ FINAL DAY - Assign all players to A/B teams!</p>';
      }
      html += '</div>';

      // Division selector
      html += '<div class="camp-division-selector">';
      ['U9', 'U11', 'U13', 'U15', 'U17'].forEach(function(div) {
        var btnClass = div === this.currentDivision ? 'btn btn-primary' : 'btn btn-secondary';
        html += '<button class="' + btnClass + '" data-action="runcamp" data-param="' + div + '">' + div + '</button>';
      }.bind(this));
      html += '</div>';

      // Stats summary with WHITE text
      var aTeam = players.filter(function(p) { return p.team === 'A'; }).length;
      var bTeam = players.filter(function(p) { return p.team === 'B'; }).length;
      var unassigned = players.filter(function(p) { return !p.team; }).length;
      var runners = players.filter(function(p) { return p.position !== 'G' && p.position !== 'Goalie'; }).length;
      var goalies = players.filter(function(p) { return p.position === 'G' || p.position === 'Goalie'; }).length;

      html += '<div class="camp-stats">';
      html += '<div class="camp-stat">';
      html += '<strong style="color: #ffffff !important;">Total Players</strong>';
      html += '<div class="camp-stat-value">' + players.length + '</div>';
      html += '</div>';
      html += '<div class="camp-stat">';
      html += '<strong style="color: #ffffff !important;">Runners</strong>';
      html += '<div class="camp-stat-value">' + runners + '</div>';
      html += '</div>';
      html += '<div class="camp-stat">';
      html += '<strong style="color: #ffffff !important;">Goalies</strong>';
      html += '<div class="camp-stat-value">' + goalies + '</div>';
      html += '</div>';
      html += '<div class="camp-stat">';
      html += '<strong style="color: #ffffff !important;">A-Team</strong>';
      html += '<div class="camp-stat-value">' + aTeam + '</div>';
      html += '</div>';
      html += '<div class="camp-stat">';
      html += '<strong style="color: #ffffff !important;">B-Team</strong>';
      html += '<div class="camp-stat-value">' + bTeam + '</div>';
      html += '</div>';
      html += '<div class="camp-stat">';
      html += '<strong style="color: #ffffff !important;">Unassigned</strong>';
      html += '<div class="camp-stat-value">' + unassigned + '</div>';
      html += '</div>';
      html += '</div>';

      // Quick actions
      html += '<div class="camp-assignment-section">';
      html += '<h3 style="color: #00bcd4;">Camp Actions</h3>';
      html += '<div class="camp-quick-actions">';
      html += '<button class="btn btn-success" data-action="advance-camp-day">Advance to Day ' + (currentDay + 1) + '</button>';
      html += '<button class="btn btn-warning" data-action="auto-sort-team" data-param="' + this.currentDivision + '">Auto-Assign A/B</button>';
      html += '<button class="btn btn-info" data-action="training-camp-dashboard">Back to Camp Dashboard</button>';
      html += '</div>';
      html += '</div>';

      // Player cards grid - CLICKABLE
      html += '<div class="camp-assignment-section">';
      html += '<h3 style="color: #00bcd4;">Players</h3>';
      html += '<div class="camp-team-grid">';
      
      players.forEach(function(player) {
        html += this.renderPlayerCard(player);
      }.bind(this));
      
      html += '</div>';
      html += '</div>';

      html += '</div>';

      panel.innerHTML = html;
      
      // FIXED: Attach click handlers to player cards
      this.attachPlayerCardHandlers();
      
      console.log('✅ Training camp rendered:', this.currentDivision);
    },

    /**
     * Render a single player card - CLICKABLE
     */
    renderPlayerCard: function(player) {
      var position = player.position === 'G' || player.position === 'Goalie' ? '🥅 Goalie' : '🥍 Runner';
      var overall = Math.round(player.overall || player.ovr || 50);
      var jersey = player.jersey || '?';
      var name = (player.firstName || 'Player') + ' ' + (player.lastName || '');
      
      var ratingClass = 'rating-low';
      if (overall >= 70) ratingClass = 'rating-high';
      else if (overall >= 60) ratingClass = 'rating-good';
      else if (overall >= 50) ratingClass = 'rating-avg';

      var teamBadge = '';
      if (player.team === 'A') teamBadge = '<div class="team-badge team-badge-a">A-Team</div>';
      else if (player.team === 'B') teamBadge = '<div class="team-badge team-badge-b">B-Team</div>';

      var html = '<div class="camp-player-card" data-player-id="' + player.id + '" style="cursor: pointer;">';
      html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">';
      html += '<div class="camp-player-name">' + name + '</div>';
      html += '<div class="camp-player-ovr ' + ratingClass + '">' + overall + '</div>';
      html += '</div>';
      html += '<div class="camp-player-position">#' + jersey + ' - ' + position + '</div>';
      
      if (teamBadge) {
        html += teamBadge;
      }

      // Jersey favorites - FIXED display
      if (player.jerseyFavorites && Array.isArray(player.jerseyFavorites)) {
        html += '<div class="jersey-favorites">';
        html += 'Favorites: ';
        html += '<span class="jersey-favorite-list">';
        player.jerseyFavorites.forEach(function(num, idx) {
          html += '<span class="jersey-favorite-number">' + num + '</span>';
        });
        html += '</span>';
        html += '</div>';
      }

      html += '</div>';
      return html;
    },

    /**
     * FIXED: Attach click handlers to player cards
     */
    attachPlayerCardHandlers: function() {
      var cards = document.querySelectorAll('.camp-player-card');
      
      cards.forEach(function(card) {
        card.addEventListener('click', function() {
          var playerId = this.getAttribute('data-player-id');
          if (playerId && window.TallyLax.UIPlayerCard) {
            window.TallyLax.UIPlayerCard.show(playerId);
          }
        });
      });
      
      console.log('✅ Attached', cards.length, 'player card click handlers');
    }
  };

  // Add CSS for team badges
  var style = document.createElement('style');
  style.textContent = `
    .team-badge {
      margin-top: 0.5rem;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      text-align: center;
    }
    .team-badge-a {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      border: 1px solid #4caf50;
    }
    .team-badge-b {
      background: rgba(33, 150, 243, 0.2);
      color: #2196f3;
      border: 1px solid #2196f3;
    }
  `;
  document.head.appendChild(style);

  window.TallyLax.UITrainingCamp = UITrainingCamp;
  console.log('✅ UITrainingCamp loaded (v6.2 - Clickable cards)');
})();
