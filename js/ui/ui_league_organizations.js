/**
 * League Organizations UI (v6.2) - NEW MODULE
 * Shows ALL 12 organizations in the league with their rosters
 * Contract: Allows viewing any team's players and player cards
 */

(function() {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};
  
  /**
   * Render league organizations page - ALL TEAMS
   */
  TL.UI.renderLeagueOrganizations = function() {
    var gs = TL.GameState;
    var orgs = TL.Constants.ORGANIZATIONS;
    
    var html = '<div class="league-organizations-container">';
    
    // Header
    html += '<div class="league-header">';
    html += '<h1>🏒 League Organizations</h1>';
    html += '<p>All 12 teams in the youth box lacrosse league</p>';
    html += '</div>';
    
    // Organization grid
    html += '<div class="organizations-grid">';
    
    for (var i = 0; i < orgs.length; i++) {
      var org = orgs[i];
      html += this._buildOrganizationCard(org);
    }
    
    html += '</div>';
    
    html += '</div>';
    
    TL.UI.mount(html);
    console.log('✅ League Organizations page rendered');
  };
  
  /**
   * Build a single organization card
   */
  TL.UI._buildOrganizationCard = function(org) {
    var gs = TL.GameState;
    var isUserOrg = (org === gs.user.org);
    
    var html = '<div class="org-card' + (isUserOrg ? ' user-org' : '') + '">';
    
    // Card header
    html += '<div class="org-card-header">';
    html += '<h2>' + org + '</h2>';
    if (isUserOrg) {
      html += '<span class="your-team-badge">👤 YOUR TEAM</span>';
    }
    html += '</div>';
    
    // Divisions
    html += '<div class="org-divisions">';
    
    var divisions = TL.Constants.DIVISIONS;
    for (var i = 0; i < divisions.length; i++) {
      var div = divisions[i];
      html += this._buildOrgDivisionRow(org, div);
    }
    
    html += '</div>';
    
    html += '</div>';
    
    return html;
  };
  
  /**
   * Build division row for an organization
   */
  TL.UI._buildOrgDivisionRow = function(org, division) {
    var gs = TL.GameState;
    
    var html = '<div class="org-division-row">';
    html += '<div class="division-label">' + division + '</div>';
    
    if (division === 'U9') {
      // U9 - just show total count and view button
      var tcRoster = TL.Selectors.roster(org, division, 'TC') || [];
      html += '<div class="division-info">';
      html += '<span class="player-count">' + tcRoster.length + ' players</span>';
      html += '</div>';
      html += '<button class="btn-view-roster" data-action="view-org-roster" data-param="' + org + '" data-param2="' + division + '">View</button>';
    } else {
      // U11-U17 - show A and B team counts
      var tcRoster = TL.Selectors.roster(org, division, 'TC') || [];
      var aRoster = TL.Selectors.roster(org, division, 'A') || [];
      var bRoster = TL.Selectors.roster(org, division, 'B') || [];
      
      html += '<div class="division-info">';
      
      if (tcRoster.length > 0) {
        html += '<span class="player-count">' + tcRoster.length + ' in training camp</span>';
      } else {
        html += '<span class="player-count">A: ' + aRoster.length + ' | B: ' + bRoster.length + '</span>';
      }
      
      html += '</div>';
      html += '<button class="btn-view-roster" data-action="view-org-roster" data-param="' + org + '" data-param2="' + division + '">View</button>';
    }
    
    html += '</div>';
    
    return html;
  };
  
  /**
   * Render specific organization's roster
   */
  TL.UI.renderOrgRoster = function(org, division) {
    var gs = TL.GameState;
    
    var html = '<div class="org-roster-container">';
    
    // Header with back button
    html += '<div class="org-roster-header">';
    html += '<button class="btn-back" data-action="league-organizations">← Back to All Organizations</button>';
    html += '<h1>' + org + ' - ' + division + '</h1>';
    html += '</div>';
    
    // Division tabs
    if (division !== 'U9') {
      html += '<div class="division-tabs">';
      var tcRoster = TL.Selectors.roster(org, division, 'TC') || [];
      if (tcRoster.length > 0) {
        html += '<button class="tab-btn active" data-action="view-org-roster" data-param="' + org + '" data-param2="' + division + '">Training Camp</button>';
      } else {
        html += '<button class="tab-btn" data-action="view-org-roster-level" data-param="' + org + '" data-param2="' + division + '" data-param3="A">Team A</button>';
        html += '<button class="tab-btn" data-action="view-org-roster-level" data-param="' + org + '" data-param2="' + division + '" data-param3="B">Team B</button>';
      }
      html += '</div>';
    }
    
    // Roster table
    html += this._buildOrgRosterTable(org, division);
    
    html += '</div>';
    
    TL.UI.mount(html);
    console.log('✅ Org roster rendered:', org, division);
  };
  
  /**
   * Build roster table for an organization
   */
  TL.UI._buildOrgRosterTable = function(org, division, level) {
    var gs = TL.GameState;
    
    // Get roster based on parameters
    var roster = [];
    if (division === 'U9' || !level) {
      // Get all players for this division
      var tcRoster = TL.Selectors.roster(org, division, 'TC') || [];
      var aRoster = TL.Selectors.roster(org, division, 'A') || [];
      var bRoster = TL.Selectors.roster(org, division, 'B') || [];
      roster = tcRoster.concat(aRoster).concat(bRoster);
    } else {
      roster = TL.Selectors.roster(org, division, level) || [];
    }
    
    if (roster.length === 0) {
      return '<p class="no-players">No players found</p>';
    }
    
    var html = '<table class="roster-table">';
    html += '<thead><tr>';
    html += '<th>#</th><th>Name</th><th>Pos</th><th>Age</th><th>OVR</th>';
    if (level) html += '<th>Team</th>';
    html += '<th>Action</th>';
    html += '</tr></thead><tbody>';
    
    for (var i = 0; i < roster.length; i++) {
      var player = roster[i];
      html += '<tr>';
      html += '<td>' + (player.jerseyNumber || '-') + '</td>';
      html += '<td>' + (player.firstName || '') + ' ' + (player.lastName || '') + '</td>';
      html += '<td>' + (player.position || 'R') + '</td>';
      html += '<td>' + (player.age || '?') + '</td>';
      html += '<td>' + Math.round(player.ovr || 50) + '</td>';
      if (level) html += '<td>' + (player.level || 'TC') + '</td>';
      html += '<td><button class="btn-mini" data-action="player-card" data-param="' + player.id + '">View Card</button></td>';
      html += '</tr>';
    }
    
    html += '</tbody></table>';
    
    return html;
  };
  
  console.log('✅ League Organizations UI loaded');
  
})();
