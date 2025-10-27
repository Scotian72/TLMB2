// js/ui/ui_player_card.js
// COMPREHENSIVE FIX: Colored attribute bars, proper jersey display, complete stats

(function() {
  'use strict';
  window.TallyLax = window.TallyLax || {};

  var UIPlayerCard = {
    
    /**
     * Show player card with all details
     */
    show: function(playerId) {
      var state = window.TallyLax.GameState;
      var player = this.findPlayer(playerId);
      
      if (!player) {
        console.error('Player not found:', playerId);
        return;
      }

      var panel = document.getElementById('main-content-panel');
      if (!panel) return;

      var html = '<div class="player-card-container">';
      
      // Header
      html += '<div class="player-card-header">';
      html += '<h2>' + (player.firstName || 'Player') + ' ' + (player.lastName || '') + '</h2>';
      html += '<div class="player-card-meta">';
      html += '<span class="player-position">' + (player.position === 'G' ? '🥅 Goalie' : '🥍 Runner') + '</span>';
      html += '<span class="player-jersey">Jersey: #' + (player.jersey || '?') + '</span>';
      html += '<span class="player-ovr">OVR: ' + Math.round(player.overall || player.ovr || 50) + '</span>';
      html += '</div>';
      html += '</div>';

      // Jersey Favorites - FIXED display
      html += '<div class="player-info-section">';
      html += '<h3>Jersey Preferences</h3>';
      html += '<div class="jersey-favorites">';
      html += '<strong>Favorite Numbers:</strong> ';
      if (player.jerseyFavorites && Array.isArray(player.jerseyFavorites)) {
        html += '<span class="jersey-favorite-list">';
        player.jerseyFavorites.forEach(function(num, idx) {
          html += '<span class="jersey-favorite-number">' + num + '</span>';
          if (idx < player.jerseyFavorites.length - 1) {
            html += '<span style="color: #666;">, </span>';
          }
        });
        html += '</span>';
      } else {
        html += '<span class="jersey-favorite-number">' + (player.jersey || '?') + '</span>';
      }
      html += '</div>';
      html += '</div>';

      // Attributes with colored bars
      html += '<div class="player-info-section">';
      html += '<h3>Attributes</h3>';
      html += '<div class="attributes-grid">';
      
      if (player.position === 'G' || player.position === 'Goalie') {
        html += this.renderGoalieAttributes(player);
      } else {
        html += this.renderRunnerAttributes(player);
      }
      
      html += '</div>';
      html += '</div>';

      // Statistics - ALL tracked stats
      html += '<div class="player-info-section">';
      html += '<h3>Statistics</h3>';
      html += this.renderPlayerStats(player);
      html += '</div>';

      // Traits
      if (player.traits && player.traits.length > 0) {
        html += '<div class="player-info-section">';
        html += '<h3>Traits</h3>';
        html += '<div class="traits-list">';
        player.traits.forEach(function(trait) {
          html += '<span class="trait-badge">' + trait + '</span>';
        });
        html += '</div>';
        html += '</div>';
      }

      // Morale
      html += '<div class="player-info-section">';
      html += '<h3>Morale</h3>';
      html += '<div class="morale-display">';
      html += '<div>Player Morale: ' + this.renderMoraleBar(player.morale || 70) + '</div>';
      html += '<div>Parent Morale: ' + this.renderMoraleBar(player.parentMorale || 70) + '</div>';
      html += '</div>';
      html += '</div>';

      // Back button
      html += '<div style="margin-top: 2rem;">';
      html += '<button class="btn btn-secondary" data-action="dashboard">Back to Dashboard</button>';
      html += '</div>';

      html += '</div>';
      
      panel.innerHTML = html;
      console.log('Player card shown:', player.firstName, player.lastName);
    },

    /**
     * Render runner attributes with colored bars
     */
    renderRunnerAttributes: function(player) {
      var attrs = [
        { key: 'shootingAcc', label: 'Shooting Accuracy' },
        { key: 'shootingPower', label: 'Shooting Power' },
        { key: 'passing', label: 'Passing' },
        { key: 'vision', label: 'Vision' },
        { key: 'transSpeed', label: 'Transition Speed' },
        { key: 'endurance', label: 'Endurance' },
        { key: 'ballControl', label: 'Ball Control' },
        { key: 'defenseIQ', label: 'Defense IQ' },
        { key: 'checking', label: 'Checking' },
        { key: 'faceoff', label: 'Faceoff' },
        { key: 'tenacity', label: 'Tenacity' },
        { key: 'discipline', label: 'Discipline' }
      ];

      var html = '';
      attrs.forEach(function(attr) {
        var value = player[attr.key] || 50;
        html += this.renderAttributeBar(attr.label, value);
      }.bind(this));

      return html;
    },

    /**
     * Render goalie attributes with colored bars
     */
    renderGoalieAttributes: function(player) {
      var attrs = [
        { key: 'reflexes', label: 'Reflexes' },
        { key: 'angles', label: 'Angles' },
        { key: 'reboundControl', label: 'Rebound Control' },
        { key: 'handSpeed', label: 'Hand Speed' },
        { key: 'agility', label: 'Agility' },
        { key: 'positioning', label: 'Positioning' },
        { key: 'communication', label: 'Communication' },
        { key: 'stickSkills', label: 'Stick Skills' },
        { key: 'clutch', label: 'Clutch' },
        { key: 'consistency', label: 'Consistency' }
      ];

      var html = '';
      attrs.forEach(function(attr) {
        var value = player[attr.key] || 50;
        html += this.renderAttributeBar(attr.label, value);
      }.bind(this));

      return html;
    },

    /**
     * Render a single attribute bar with color
     * FIXED: Shortened bars (max-width 200px) with color gradient
     */
    renderAttributeBar: function(label, value) {
      value = Math.max(0, Math.min(99, value));
      var percentage = (value / 99) * 100;
      
      // Color based on value
      var color = '#f44336'; // red (low)
      if (value >= 70) color = '#4caf50'; // green (high)
      else if (value >= 60) color = '#2196f3'; // blue (good)
      else if (value >= 50) color = '#ff9800'; // orange (avg)

      var html = '<div class="attribute-row">';
      html += '<div class="attribute-label">' + label + '</div>';
      html += '<div class="attribute-value-container">';
      html += '<div class="attribute-bar-bg">';
      html += '<div class="attribute-bar-fill" style="width: ' + percentage + '%; background: ' + color + ';"></div>';
      html += '</div>';
      html += '<div class="attribute-value-text">' + value + '</div>';
      html += '</div>';
      html += '</div>';

      return html;
    },

    /**
     * Render player statistics - ALL stats
     */
    renderPlayerStats: function(player) {
      var stats = player.seasonStats || player.stats || {};
      var isGoalie = player.position === 'G' || player.position === 'Goalie';

      var html = '<div class="stats-grid">';

      if (isGoalie) {
        // Goalie stats
        html += '<div class="stat-item"><strong>GP:</strong> ' + (stats.gamesPlayed || stats.GP || 0) + '</div>';
        html += '<div class="stat-item"><strong>W:</strong> ' + (stats.wins || stats.W || 0) + '</div>';
        html += '<div class="stat-item"><strong>L:</strong> ' + (stats.losses || stats.L || 0) + '</div>';
        html += '<div class="stat-item"><strong>T:</strong> ' + (stats.ties || stats.T || 0) + '</div>';
        html += '<div class="stat-item"><strong>SA:</strong> ' + (stats.shotsAgainst || stats.SA || 0) + '</div>';
        html += '<div class="stat-item"><strong>SV:</strong> ' + (stats.saves || stats.SV || 0) + '</div>';
        html += '<div class="stat-item"><strong>GA:</strong> ' + (stats.goalsAgainst || stats.GA || 0) + '</div>';
        
        var sa = stats.shotsAgainst || stats.SA || 0;
        var sv = stats.saves || stats.SV || 0;
        var svPct = sa > 0 ? ((sv / sa) * 100).toFixed(1) : '0.0';
        html += '<div class="stat-item"><strong>SV%:</strong> ' + svPct + '%</div>';
      } else {
        // Runner stats - COMPLETE list including LB, CTO, TO
        html += '<div class="stat-item"><strong>GP:</strong> ' + (stats.gamesPlayed || stats.GP || 0) + '</div>';
        html += '<div class="stat-item"><strong>G:</strong> ' + (stats.goals || stats.G || 0) + '</div>';
        html += '<div class="stat-item"><strong>A:</strong> ' + (stats.assists || stats.A || 0) + '</div>';
        
        var goals = stats.goals || stats.G || 0;
        var assists = stats.assists || stats.A || 0;
        html += '<div class="stat-item"><strong>P:</strong> ' + (goals + assists) + '</div>';
        
        html += '<div class="stat-item"><strong>S:</strong> ' + (stats.shots || stats.S || 0) + '</div>';
        html += '<div class="stat-item"><strong>SOG:</strong> ' + (stats.shotsOnGoal || stats.SOG || 0) + '</div>';
        
        // FIXED: Include all missing stats
        html += '<div class="stat-item"><strong>LB:</strong> ' + (stats.looseBalls || stats.LB || 0) + '</div>';
        html += '<div class="stat-item"><strong>CTO:</strong> ' + (stats.causedTurnovers || stats.CTO || 0) + '</div>';
        html += '<div class="stat-item"><strong>TO:</strong> ' + (stats.turnovers || stats.TO || 0) + '</div>';
        html += '<div class="stat-item"><strong>PIM:</strong> ' + (stats.penalties || stats.PIM || 0) + '</div>';
        
        html += '<div class="stat-item"><strong>FO Won:</strong> ' + (stats.faceoffsWon || stats.FOW || 0) + '</div>';
        html += '<div class="stat-item"><strong>FO Taken:</strong> ' + (stats.faceoffsTaken || stats.FOT || 0) + '</div>';
      }

      html += '</div>';
      return html;
    },

    /**
     * Render morale bar
     */
    renderMoraleBar: function(morale) {
      morale = Math.max(0, Math.min(100, morale || 70));
      var color = morale >= 70 ? '#4caf50' : morale >= 50 ? '#ff9800' : '#f44336';
      
      return '<div class="morale-bar-container">' +
             '<div class="morale-bar-bg">' +
             '<div class="morale-bar-fill" style="width: ' + morale + '%; background: ' + color + ';"></div>' +
             '</div>' +
             '<span class="morale-value">' + morale + '</span>' +
             '</div>';
    },

    /**
     * Find player by ID
     */
    findPlayer: function(playerId) {
      var state = window.TallyLax.GameState;
      var divisions = ['U9', 'U11', 'U13', 'U15', 'U17'];
      
      for (var i = 0; i < divisions.length; i++) {
        var div = divisions[i];
        if (state.divisions && state.divisions[div] && state.divisions[div].players) {
          var players = state.divisions[div].players;
          for (var j = 0; j < players.length; j++) {
            if (players[j].id === playerId || players[j].id === parseInt(playerId)) {
              return players[j];
            }
          }
        }
      }
      
      return null;
    }
  };

  // Add CSS styles dynamically
  var style = document.createElement('style');
  style.textContent = `
    .player-card-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .player-card-header {
      background: #2a2a2a;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .player-card-header h2 {
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }
    .player-card-meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .player-card-meta span {
      color: #ffffff;
      background: #1a1a1a;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    .player-info-section {
      background: #2a2a2a;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .player-info-section h3 {
      color: #00bcd4;
      margin-top: 0;
      margin-bottom: 1rem;
    }
    .attributes-grid {
      display: grid;
      gap: 0.75rem;
    }
    .attribute-row {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 1rem;
      align-items: center;
    }
    .attribute-label {
      color: #ffffff;
      font-weight: 500;
    }
    .attribute-value-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .attribute-bar-bg {
      flex: 1;
      max-width: 200px; /* FIXED: Shortened bars */
      height: 16px;
      background: #1a1a1a;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }
    .attribute-bar-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 8px;
    }
    .attribute-value-text {
      color: #ffffff;
      font-weight: bold;
      min-width: 30px;
      text-align: right;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
    .stat-item {
      color: #ffffff;
      background: #1a1a1a;
      padding: 0.75rem;
      border-radius: 4px;
    }
    .stat-item strong {
      color: #00bcd4;
    }
    .traits-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .trait-badge {
      background: #1a1a1a;
      color: #00bcd4;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
    }
    .morale-display {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .morale-bar-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .morale-bar-bg {
      flex: 1;
      max-width: 300px;
      height: 20px;
      background: #1a1a1a;
      border-radius: 10px;
      overflow: hidden;
    }
    .morale-bar-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    .morale-value {
      color: #ffffff;
      font-weight: bold;
      min-width: 40px;
    }
  `;
  document.head.appendChild(style);

  window.TallyLax.UIPlayerCard = UIPlayerCard;
  console.log('✅ UIPlayerCard loaded (v6.2 - Colored bars + complete stats)');
})();
