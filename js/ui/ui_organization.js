/**
 * Organization UI (v6.2) - NEW MODULE
 * Shows organization info, history, and season tracking
 */

(function() {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};
  
  /**
   * Render organization page
   */
  TL.UI.renderOrganization = function() {
    var gs = TL.GameState;
    
    var html = '<div class="organization-container">';
    
    // Header
    html += '<div class="org-header">';
    html += '<h1>' + gs.user.org + ' Organization</h1>';
    html += '<p class="org-subtitle">President: ' + gs.user.name + '</p>';
    html += '</div>';
    
    // Current season info
    html += '<div class="current-season-section">';
    html += '<h2>Current Season</h2>';
    html += '<div class="season-info-card">';
    html += '<div class="info-row">';
    html += '<span class="label">Season:</span>';
    html += '<span class="value">Season ' + (gs.seasonYear || 1) + '</span>';
    html += '</div>';
    html += '<div class="info-row">';
    html += '<span class="label">Day:</span>';
    html += '<span class="value">' + gs.day + ' of ' + TL.Constants.SEASON_LENGTH_DAYS + '</span>';
    html += '</div>';
    html += '<div class="info-row">';
    html += '<span class="label">Organization:</span>';
    html += '<span class="value">' + gs.user.org + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    // History section
    html += '<div class="history-section">';
    html += '<h2>📜 Organization History</h2>';
    
    if (!gs.history) {
      gs.history = { seasons: [], championships: [] };
    }
    
    if (gs.history.seasons && gs.history.seasons.length > 0) {
      html += '<div class="history-list">';
      
      for (var i = gs.history.seasons.length - 1; i >= 0; i--) {
        var season = gs.history.seasons[i];
        html += this._buildSeasonHistoryCard(season);
      }
      
      html += '</div>';
    } else {
      html += '<div class="no-history">';
      html += '<p>📝 No completed seasons yet</p>';
      html += '<p class="text-muted">Complete your first season to start building your organization\'s history!</p>';
      html += '</div>';
    }
    
    html += '</div>';
    
    // Championship tracker
    if (gs.history.championships && gs.history.championships.length > 0) {
      html += '<div class="championships-section">';
      html += '<h2>🏆 Championships</h2>';
      html += '<div class="championships-grid">';
      
      var champCounts = {};
      for (var i = 0; i < gs.history.championships.length; i++) {
        var champ = gs.history.championships[i];
        var div = champ.division + ' ' + champ.level;
        champCounts[div] = (champCounts[div] || 0) + 1;
      }
      
      for (var div in champCounts) {
        if (champCounts.hasOwnProperty(div)) {
          html += '<div class="champ-card">';
          html += '<div class="champ-trophy">🏆</div>';
          html += '<div class="champ-div">' + div + '</div>';
          html += '<div class="champ-count">' + champCounts[div] + ' title' + (champCounts[div] > 1 ? 's' : '') + '</div>';
          html += '</div>';
        }
      }
      
      html += '</div>';
      html += '</div>';
    }
    
    // Division rosters summary
    html += '<div class="rosters-section">';
    html += '<h2>Division Rosters</h2>';
    html += '<div class="rosters-grid">';
    
    var divisions = TL.Constants.DIVISIONS;
    for (var i = 0; i < divisions.length; i++) {
      var div = divisions[i];
      html += this._buildRosterCard(div);
    }
    
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    
    TL.UI.mount(html);
    console.log('✅ Organization page rendered');
  };
  
  /**
   * Build season history card
   */
  TL.UI._buildSeasonHistoryCard = function(season) {
    var html = '<div class="season-history-card">';
    
    html += '<div class="season-header">';
    html += '<h3>Season ' + season.year + '</h3>';
    html += '<span class="season-dates">Days 1-' + season.endDay + '</span>';
    html += '</div>';
    
    if (season.divisions) {
      html += '<div class="season-results">';
      for (var div in season.divisions) {
        if (season.divisions.hasOwnProperty(div)) {
          var divResult = season.divisions[div];
          html += '<div class="division-result">';
          html += '<span class="div-name">' + div + ':</span> ';
          html += '<span class="record">' + divResult.wins + '-' + divResult.losses + '</span>';
          if (divResult.champion) {
            html += ' <span class="champ-badge">🏆 Champion</span>';
          }
          html += '</div>';
        }
      }
      html += '</div>';
    }
    
    html += '</div>';
    
    return html;
  };
  
  /**
   * Build roster card
   */
  TL.UI._buildRosterCard = function(division) {
    var gs = TL.GameState;
    var org = gs.user.org;
    
    var html = '<div class="roster-card">';
    html += '<h4>' + division + '</h4>';
    
    if (division === 'U9') {
      var tcRoster = TL.Selectors.roster(org, division, 'TC') || [];
      html += '<p>' + tcRoster.length + ' players</p>';
      html += '<button class="btn-small" data-action="roster" data-param="' + division + '" data-param2="TC">View</button>';
    } else {
      var aRoster = TL.Selectors.roster(org, division, 'A') || [];
      var bRoster = TL.Selectors.roster(org, division, 'B') || [];
      html += '<p>A: ' + aRoster.length + ' | B: ' + bRoster.length + '</p>';
      html += '<button class="btn-small" data-action="roster" data-param="' + division + '" data-param2="A">Team A</button>';
      html += '<button class="btn-small" data-action="roster" data-param="' + division + '" data-param2="B">Team B</button>';
    }
    
    html += '</div>';
    
    return html;
  };
  
  console.log('✅ UIOrganization loaded');
  
})();
