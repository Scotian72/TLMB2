/**
 * UI Training Camp - 7-Day Pre-Season Camp Experience
 * Days 1,3,5: Clinics | Days 2,4,6: Exhibitions | Day 7: Team Selection
 */
(function () {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};

  var DIVS = ['U9','U11','U13','U15','U17'];
  
  // Training Camp Day Structure
  var CAMP_SCHEDULE = {
    1: { type: 'clinic', focus: 'Balanced', description: 'General skills development for all players' },
    2: { type: 'exhibition', description: 'Intersquad scrimmage - Red vs Blue teams' },
    3: { type: 'clinic', focus: 'Offensive Skills', description: 'Shooting, passing, and offensive positioning' },
    4: { type: 'exhibition', description: 'Intersquad scrimmage - Red vs Blue teams' },
    5: { type: 'clinic', focus: 'Defensive Skills', description: 'Checking, positioning, and defensive awareness' },
    6: { type: 'exhibition', description: 'Final intersquad scrimmage - Red vs Blue teams' },
    7: { type: 'selection', description: 'Team selection and roster finalization' }
  };

  /**
   * Show training camp for division
   */
  TL.UI.renderTrainingCamp = function (div) {
    div = DIVS.indexOf(div) >= 0 ? div : 'U9';
    
    var gs = TL.GameState;
    var org = gs.user.org;
    
    // Initialize training camp state if needed
    if (!gs.trainingCamp) {
      gs.trainingCamp = {
        currentDay: 1,
        completedDays: [],
        playerStats: {},
        teamAssignments: {}
      };
    }
    
    var currentDay = gs.trainingCamp.currentDay || 1;
    var completedDays = gs.trainingCamp.completedDays || [];
    
    var html = '<div class="training-camp-centralized">';
    
    // Header
    html += '<div class="camp-header">';
    html += '<button class="btn-back" data-action="dashboard">← Dashboard</button>';
    html += '<h1>🏕️ Training Camp Central - ' + org + '</h1>';
    html += '<div class="camp-progress">';
    html += '<span class="camp-day">Day ' + currentDay + ' of 7</span>';
    html += '<div class="progress-bar">';
    html += '<div class="progress-fill" style="width: ' + Math.round((currentDay - 1) / 6 * 100) + '%"></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    // Tab selector for divisions
    html += '<div class="camp-tabs">';
    for (var i = 0; i < DIVS.length; i++) {
      var d = DIVS[i];
      var activeClass = (d === div) ? ' active' : '';
      html += '<button class="camp-tab' + activeClass + '" data-action="runcamp" data-param="' + d + '">' + d + '</button>';
    }
    html += '</div>';
    
    // Current division content
    html += '<div class="camp-main-content">';
    
    // Get all players for this division
    var allPlayers = TL.Selectors.getAllPlayers(org, div);
    
    if (!allPlayers || allPlayers.length === 0) {
      html += '<div class="no-players-warning">';
      html += '<h3>⚠️ No Players Found</h3>';
      html += '<p>No players have been generated for ' + div + ' yet.</p>';
      html += '<p>Please generate rosters from the dashboard first.</p>';
      html += '</div>';
    } else {
      // Special handling for U9 (no A/B teams)
      if (div === 'U9') {
        html += renderU9TrainingCamp(org, div, currentDay, allPlayers);
      } else {
        html += renderStandardTrainingCamp(org, div, currentDay, allPlayers);
      }
    }
    
    html += '</div>';
    html += '</div>';
    
    TL.UI.mount(html);
    
    // Bind events
    bindTrainingCampEvents(div);
  };
  
  /**
   * Render U9 training camp (simplified, no A/B teams)
   */
  function renderU9TrainingCamp(org, div, currentDay, allPlayers) {
    var html = '<div class="camp-content">';
    
    // Player count summary
    html += '<div class="camp-summary">';
    html += '<h3>' + org + ' ' + div + ' Training Camp</h3>';
    html += '<div class="summary-stats">';
    html += '<div class="stat-box">';
    html += '<div class="stat-number">' + allPlayers.length + '</div>';
    html += '<div class="stat-label">Total Players</div>';
    html += '</div>';
    var runners = allPlayers.filter(function(p) { return p.position !== 'goalie'; }).length;
    var goalies = allPlayers.filter(function(p) { return p.position === 'goalie'; }).length;
    html += '<div class="stat-box">';
    html += '<div class="stat-number">' + runners + '</div>';
    html += '<div class="stat-label">Runners</div>';
    html += '</div>';
    html += '<div class="stat-box">';
    html += '<div class="stat-number">' + goalies + '</div>';
    html += '<div class="stat-label">Goalies</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    // Current day activity
    var todayActivity = CAMP_SCHEDULE[currentDay];
    html += '<div class="day-activity">';
    html += '<h2>Day ' + currentDay + ': ' + (todayActivity.focus || todayActivity.type) + '</h2>';
    html += '<p>' + todayActivity.description + '</p>';
    html += '</div>';
    
    if (currentDay <= 6) {
      html += '<div class="activity-content">';
      
      if (todayActivity.type === 'clinic') {
        html += renderClinicDay(allPlayers, todayActivity.focus, div);
      } else if (todayActivity.type === 'exhibition') {
        html += renderExhibitionDay(allPlayers, div);
      }
      
      html += '<div class="day-actions">';
      html += '<button class="btn-primary" data-action="advance-camp-day" data-param="' + div + '">Complete Day ' + currentDay + '</button>';
      html += '</div>';
      html += '</div>';
    } else {
      // Day 7 - U9 just graduates to regular season
      html += '<div class="completion-content">';
      html += '<h3>🎓 Training Camp Complete!</h3>';
      html += '<p>U9 players are ready for the regular season!</p>';
      html += '<button class="btn-primary" data-action="complete-training-camp" data-param="' + div + '">Start Regular Season</button>';
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }
  
  /**
   * Render standard training camp (U11-U17)
   */
  function renderStandardTrainingCamp(org, div, currentDay, allPlayers) {
    var html = '<div class="camp-content">';
    
    // Player count summary
    html += '<div class="camp-summary">';
    html += '<h3>' + org + ' ' + div + ' Training Camp</h3>';
    html += '<div class="summary-stats">';
    html += '<div class="stat-box">';
    html += '<div class="stat-number">' + allPlayers.length + '</div>';
    html += '<div class="stat-label">Total Players</div>';
    html += '</div>';
    var runners = allPlayers.filter(function(p) { return p.position !== 'goalie'; }).length;
    var goalies = allPlayers.filter(function(p) { return p.position === 'goalie'; }).length;
    html += '<div class="stat-box">';
    html += '<div class="stat-number">' + runners + '</div>';
    html += '<div class="stat-label">Runners</div>';
    html += '</div>';
    html += '<div class="stat-box">';
    html += '<div class="stat-number">' + goalies + '</div>';
    html += '<div class="stat-label">Goalies</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    // Current day activity
    var todayActivity = CAMP_SCHEDULE[currentDay];
    html += '<div class="day-activity">';
    html += '<h2>Day ' + currentDay + ': ' + (todayActivity.focus || todayActivity.type) + '</h2>';
    html += '<p>' + todayActivity.description + '</p>';
    html += '</div>';
    
    if (currentDay <= 6) {
      html += '<div class="activity-content">';
      
      if (todayActivity.type === 'clinic') {
        html += renderClinicDay(allPlayers, todayActivity.focus, div);
      } else if (todayActivity.type === 'exhibition') {
        html += renderExhibitionDay(allPlayers, div);
      }
      
      html += '<div class="day-actions">';
      html += '<button class="btn-primary" data-action="advance-camp-day" data-param="' + div + '">Complete Day ' + currentDay + '</button>';
      html += '</div>';
      html += '</div>';
    } else {
      // Day 7 - Team selection
      html += renderTeamSelectionDay(allPlayers, div);
    }
    
    html += '</div>';
    return html;
  }
  
  /**
   * Render clinic day (Days 1, 3, 5)
   */
  function renderClinicDay(allPlayers, focus, div) {
    var html = '<div class="clinic-day">';
    html += '<div class="clinic-focus">';
    html += '<h3>🏃‍♂️ ' + focus + ' Clinic</h3>';
    
    var focusDetails = {
      'Balanced': 'Players work on all fundamental skills with equal emphasis',
      'Offensive Skills': 'Focus on shooting accuracy, passing, and offensive positioning',
      'Defensive Skills': 'Emphasis on checking, defensive positioning, and ball control'
    };
    
    html += '<p>' + focusDetails[focus] + '</p>';
    html += '</div>';
    
    // Show player participation
    html += '<div class="participant-list">';
    html += '<h4>Participants (' + allPlayers.length + ' players)</h4>';
    html += '<div class="player-grid">';
    
    for (var i = 0; i < allPlayers.length; i++) {
      var player = allPlayers[i];
      html += '<div class="player-clinic-card">';
      html += '<span class="player-name">' + player.name + '</span>';
      html += '<span class="player-position">' + (player.position || 'Runner') + '</span>';
      html += '<span class="player-ovr">' + (player.ovr || 50) + ' OVR</span>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    return html;
  }
  
  /**
   * Render exhibition day (Days 2, 4, 6)
   */
  function renderExhibitionDay(allPlayers, div) {
    var runners = allPlayers.filter(function(p) { return p.position !== 'goalie'; });
    var goalies = allPlayers.filter(function(p) { return p.position === 'goalie'; });
    
    // Split into Red and Blue teams
    var redTeam = [];
    var blueTeam = [];
    var redGoalies = [];
    var blueGoalies = [];
    
    // Distribute runners alternately by OVR
    runners.sort(function(a, b) { return (b.ovr || 0) - (a.ovr || 0); });
    for (var i = 0; i < runners.length; i++) {
      if (i % 2 === 0) {
        redTeam.push(runners[i]);
      } else {
        blueTeam.push(runners[i]);
      }
    }
    
    // Distribute goalies according to rules
    goalies.sort(function(a, b) { return (b.ovr || 0) - (a.ovr || 0); });
    if (goalies.length === 4) {
      // 4 goalies: 2 per team
      redGoalies = [goalies[0], goalies[2]];
      blueGoalies = [goalies[1], goalies[3]];
    } else if (goalies.length === 3) {
      // 3 goalies: 1 on A team (Red), 2 on B team (Blue)
      redGoalies = [goalies[0]];
      blueGoalies = [goalies[1], goalies[2]];
    } else {
      // Other cases: distribute evenly
      for (var j = 0; j < goalies.length; j++) {
        if (j % 2 === 0) {
          redGoalies.push(goalies[j]);
        } else {
          blueGoalies.push(goalies[j]);
        }
      }
    }
    
    var html = '<div class="exhibition-day">';
    html += '<div class="exhibition-header">';
    html += '<h3>🥍 Intersquad Scrimmage</h3>';
    html += '<p>Red Team vs Blue Team - Evaluate players in game situations</p>';
    html += '</div>';
    
    html += '<div class="teams-display">';
    
    // Red Team
    html += '<div class="team-roster red-team">';
    html += '<h4>🔴 Red Team (' + (redTeam.length + redGoalies.length) + ')</h4>';
    html += '<div class="team-goalies">';
    html += '<h5>Goalies (' + redGoalies.length + ')</h5>';
    for (var k = 0; k < redGoalies.length; k++) {
      var g = redGoalies[k];
      html += '<div class="player-exhibition-card goalie">';
      html += '<span class="player-name">' + g.name + '</span>';
      html += '<span class="player-ovr">' + (g.ovr || 50) + ' OVR</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="team-runners">';
    html += '<h5>Runners (' + redTeam.length + ')</h5>';
    for (var l = 0; l < redTeam.length; l++) {
      var r = redTeam[l];
      html += '<div class="player-exhibition-card runner">';
      html += '<span class="player-name">' + r.name + '</span>';
      html += '<span class="player-ovr">' + (r.ovr || 50) + ' OVR</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    
    // Blue Team
    html += '<div class="team-roster blue-team">';
    html += '<h4>🔵 Blue Team (' + (blueTeam.length + blueGoalies.length) + ')</h4>';
    html += '<div class="team-goalies">';
    html += '<h5>Goalies (' + blueGoalies.length + ')</h5>';
    for (var m = 0; m < blueGoalies.length; m++) {
      var bg = blueGoalies[m];
      html += '<div class="player-exhibition-card goalie">';
      html += '<span class="player-name">' + bg.name + '</span>';
      html += '<span class="player-ovr">' + (bg.ovr || 50) + ' OVR</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="team-runners">';
    html += '<h5>Runners (' + blueTeam.length + ')</h5>';
    for (var n = 0; n < blueTeam.length; n++) {
      var br = blueTeam[n];
      html += '<div class="player-exhibition-card runner">';
      html += '<span class="player-name">' + br.name + '</span>';
      html += '<span class="player-ovr">' + (br.ovr || 50) + ' OVR</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    
    return html;
  }
  
  /**
   * Render team selection day (Day 7)
   */
  function renderTeamSelectionDay(allPlayers, div) {
    var html = '<div class="team-selection-day">';
    html += '<div class="selection-header">';
    html += '<h3>🎯 Team Selection</h3>';
    html += '<p>Based on clinic performance and exhibition games, assign players to Team A and Team B</p>';
    html += '</div>';
    
    // Show recommendations
    html += '<div class="recommendations">';
    html += '<h4>📊 Recommended Assignments</h4>';
    html += '<p>Players are ranked by overall performance during training camp</p>';
    
    // Sort players by performance (using OVR for now, could be enhanced with camp stats)
    var sortedPlayers = allPlayers.slice().sort(function(a, b) { 
      return (b.ovr || 0) - (a.ovr || 0); 
    });
    
    var teamASize = Math.ceil(allPlayers.length / 2);
    var teamA = sortedPlayers.slice(0, teamASize);
    var teamB = sortedPlayers.slice(teamASize);
    
    html += '<div class="team-assignments">';
    
    // Team A
    html += '<div class="assignment-team">';
    html += '<h5>🥇 Team A (Recommended)</h5>';
    html += '<div class="assigned-players">';
    for (var i = 0; i < teamA.length; i++) {
      var playerA = teamA[i];
      html += '<div class="assigned-player">';
      html += '<span class="player-name">' + playerA.name + '</span>';
      html += '<span class="player-position">' + (playerA.position || 'Runner') + '</span>';
      html += '<span class="player-ovr">' + (playerA.ovr || 50) + ' OVR</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    
    // Team B  
    html += '<div class="assignment-team">';
    html += '<h5>🥈 Team B (Recommended)</h5>';
    html += '<div class="assigned-players">';
    for (var j = 0; j < teamB.length; j++) {
      var playerB = teamB[j];
      html += '<div class="assigned-player">';
      html += '<span class="player-name">' + playerB.name + '</span>';
      html += '<span class="player-position">' + (playerB.position || 'Runner') + '</span>';
      html += '<span class="player-ovr">' + (playerB.ovr || 50) + ' OVR</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    
    // Action buttons
    html += '<div class="selection-actions">';
    html += '<button class="btn-primary" data-action="auto-assign-teams" data-param="' + div + '">✨ Auto-Assign Teams</button>';
    html += '<button class="btn-secondary" data-action="manual-assign-teams" data-param="' + div + '">✏️ Manual Assignment</button>';
    html += '</div>';
    
    html += '</div>';
    
    return html;
  }
  
  /**
   * Bind training camp events
   */
  function bindTrainingCampEvents(div) {
    // Division selector
    var divSelect = document.getElementById('camp-div-select');
    if (divSelect) {
      divSelect.addEventListener('change', function() {
        TL.Router.route('runcamp', this.value);
      });
    }
  }
  
  /**
   * Build camp player table
   */
  TL.UI._buildCampTable = function(players) {
    if (!players || players.length === 0) {
      return '<p class="text-muted">No players in camp</p>';
    }
    
    var html = '<table class="camp-table">';
    html += '<thead><tr>';
    html += '<th>#</th>';
    html += '<th>Name</th>';
    html += '<th>Pos</th>';
    html += '<th>Age</th>';
    html += '<th>Hand</th>';
    html += '<th>OVR</th>';
    html += '<th>Potential</th>';
    html += '<th>Morale</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    
    for (var i = 0; i < players.length; i++) {
      var p = players[i];
      var potential = this._getPotential(p);
      
      html += '<tr class="player-row" data-action="player-card" data-param="' + p.id + '">';
      html += '<td>' + (p.jersey || '?') + '</td>';
      html += '<td class="player-name">' + (p.name || 'Unknown') + '</td>';
      html += '<td>' + (p.position || 'Runner') + '</td>';
      html += '<td>' + (p.age || 8) + '</td>';
      html += '<td>' + (p.hand || 'R') + '</td>';
      html += '<td class="ovr-cell"><strong>' + (p.ovr || 50) + '</strong></td>';
      html += '<td>' + potential + '</td>';
      html += '<td>' + this._moraleIndicator(p.morale || 70) + '</td>';
      html += '</tr>';
    }
    
    html += '</tbody></table>';
    return html;
  };
  
  /**
   * Get potential indicator
   */
  TL.UI._getPotential = function(p) {
    var ceiling = p.hidden && p.hidden.growthCeiling || 50;
    if (ceiling >= 80) return '⭐⭐⭐';
    if (ceiling >= 60) return '⭐⭐';
    if (ceiling >= 40) return '⭐';
    return '—';
  };
  
  /**
   * Morale visual indicator
   */
  TL.UI._moraleIndicator = function(morale) {
    var emoji = '😐';
    if (morale >= 80) emoji = '😊';
    else if (morale >= 60) emoji = '🙂';
    else if (morale < 40) emoji = '😟';
    return '<span title="' + morale + '/100">' + emoji + '</span>';
  };
  
  /**
   * Assign players to A/B teams based on OVR
   */
  TL.UI.assignPlayersToTeams = function(div) {
    var gs = TL.GameState;
    var org = gs.user.org;
    var allPlayers = TL.Selectors.getAllPlayers(org, div);
    
    if (!allPlayers || allPlayers.length === 0) {
      alert('No players found for ' + div);
      return;
    }
    
    // Separate runners and goalies
    var runners = [];
    var goalies = [];
    
    for (var i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].type === 'goalie') {
        goalies.push(allPlayers[i]);
      } else {
        runners.push(allPlayers[i]);
      }
    }
    
    // Sort by OVR (highest first)
    runners.sort(function(a, b) { return b.ovr - a.ovr; });
    goalies.sort(function(a, b) { return b.ovr - a.ovr; });
    
    // Split runners: top 50% to A, bottom 50% to B
    var runnerMidpoint = Math.floor(runners.length / 2);
    for (var i = 0; i < runners.length; i++) {
      runners[i].level = (i < runnerMidpoint) ? 'A' : 'B';
    }
    
    // Split goalies: top 50% to A, bottom 50% to B
    var goalieMidpoint = Math.floor(goalies.length / 2);
    for (var i = 0; i < goalies.length; i++) {
      goalies[i].level = (i < goalieMidpoint) ? 'A' : 'B';
    }
    
    // Show confirmation
    var aRunners = 0;
    var bRunners = 0;
    var aGoalies = 0;
    var bGoalies = 0;
    
    for (var i = 0; i < runners.length; i++) {
      if (runners[i].level === 'A') aRunners++;
      else bRunners++;
    }
    for (var i = 0; i < goalies.length; i++) {
      if (goalies[i].level === 'A') aGoalies++;
      else bGoalies++;
    }
    
    alert('Players assigned!\n\n' +
          'Team A: ' + aRunners + ' runners + ' + aGoalies + ' goalies\n' +
          'Team B: ' + bRunners + ' runners + ' + bGoalies + ' goalies');
    
    // Go to Team A roster
    TL.Router.route('roster', div, 'A');
  };
  
  console.log('✅ UITrainingCamp loaded');
  
})();
