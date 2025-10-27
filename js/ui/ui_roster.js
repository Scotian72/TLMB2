// js/ui/ui_roster.js
// ðŸ”§ SURGICAL FIX: Restore horizontal card layout with proper CSS classes

(function () {
  'use strict';
  window.TallyLax = window.TallyLax || {};
  const TL = window.TallyLax;

  // ðŸ”§ FIX: Safe name extraction with fallbacks
  function playerName(p) {
    if (p.name) return p.name;
    const first = p.firstName || 'Player';
    const last = p.lastName || (p.id ? '#' + p.id : '');
    return first + ' ' + last;
  }

  // ðŸ”§ FIX: Rating color classes
  function ratingClass(ovr) {
    if (ovr >= 70) return 'rating-high';
    if (ovr >= 60) return 'rating-good';
    if (ovr >= 50) return 'rating-avg';
    return 'rating-low';
  }

  // ðŸ”§ FIX: Render horizontal player card using existing CSS
  function renderPlayerCard(player) {
    const pos = player.position === 'G' ? 'ðŸ¥… Goalie' : 'ðŸ¥ Runner';
    const overall = Math.round(player.overall || 0);
    const jersey = player.jersey || '?';
    const trait = (player.traits && player.traits.length > 0) ? player.traits[0] : '';
    const captainBadge = player.isCaptain ? '<span class="captain-badge-small">C</span>' : 
                         player.isAssistant ? '<span class="captain-badge-small">A</span>' : '';

    return `
      <div class="compact-player-card" data-player-id="${player.id}" style="cursor: pointer;">
        <div class="compact-header">
          <div class="compact-jersey">#${jersey}</div>
          <div class="compact-overall ${ratingClass(overall)}">${overall}</div>
        </div>
        <div class="compact-name">${playerName(player)}${captainBadge}</div>
        <div class="compact-position">${pos}</div>
        ${trait ? `<div class="compact-trait">ðŸ† ${trait}</div>` : ''}
      </div>
    `;
  }

  const UIRoster = {
    currentDivision: 'U11',

    show: function(division) {
      this.currentDivision = division || this.currentDivision;
      const state = window.TallyLax.GameState;
      
      if (!state || !state.divisions || !state.divisions[this.currentDivision]) {
        console.error('Division data not found for', this.currentDivision);
        document.getElementById('main-content-panel').innerHTML = 
          '<div class="container"><h2>âš ï¸ Division Not Found</h2><p>Please start a new season.</p></div>';
        return;
      }

      const players = state.divisions[this.currentDivision].players || [];
      
      // ðŸ”§ FIX: Separate goalies and runners
      const goalies = players.filter(p => p.position === 'G' || p.position === 'Goalie');
      const runners = players.filter(p => p.position !== 'G' && p.position !== 'Goalie');

      // Build HTML
      let html = '<div class="roster-container">';
      
      // Header with division selector
      html += '<h2>ðŸ¥ ' + this.currentDivision + ' Roster</h2>';
      
      html += '<div class="camp-division-selector">';
      ['U11', 'U13', 'U15', 'U17'].forEach(function(div) {
        const btnClass = div === this.currentDivision ? 'btn btn-primary' : 'btn btn-secondary';
        html += '<button class="' + btnClass + '" data-action="showRoster" data-param="' + div + '">' + div + '</button>';
      }.bind(this));
      html += '</div>';

      // Stats summary
      html += '<div class="roster-stats">';
      html += '<span>Total Players: <strong>' + players.length + '</strong></span>';
      html += '<span>Goalies: <strong>' + goalies.length + '</strong></span>';
      html += '<span>Runners: <strong>' + runners.length + '</strong></span>';
      html += '</div>';

      // ðŸ”§ FIX: Use the correct CSS class for horizontal grid
      html += '<div class="team-section">';
      html += '<h3>ðŸ¥… Goalies</h3>';
      html += '<div class="compact-roster-grid">';
      if (goalies.length > 0) {
        goalies.forEach(function(player) {
          html += renderPlayerCard(player);
        });
      } else {
        html += '<p class="empty-message">No goalies on roster</p>';
      }
      html += '</div>';
      html += '</div>';

      html += '<div class="team-section">';
      html += '<h3>ðŸ¥ Runners</h3>';
      html += '<div class="compact-roster-grid">';
      if (runners.length > 0) {
        runners.forEach(function(player) {
          html += renderPlayerCard(player);
        });
      } else {
        html += '<p class="empty-message">No runners on roster</p>';
      }
      html += '</div>';
      html += '</div>';

      html += '</div>';

      document.getElementById('main-content-panel').innerHTML = html;

      // Attach click handlers for player cards
      this.attachEventListeners();
    },

    attachEventListeners: function() {
      const cards = document.querySelectorAll('.compact-player-card');
      cards.forEach(function(card) {
        card.addEventListener('click', function() {
          const playerId = card.getAttribute('data-player-id');
          if (playerId && window.TallyLax.UIModals && window.TallyLax.UIModals.showPlayerCard) {
            window.TallyLax.UIModals.showPlayerCard(playerId);
          }
        });
      });
    }
  };

  window.TallyLax.UIRoster = UIRoster;
  console.log('âœ… UIRoster loaded - HORIZONTAL LAYOUT RESTORED');
})();