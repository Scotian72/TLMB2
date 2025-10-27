/**
 * Training Camp Scrimmage Display
 * Shows Red vs Blue scrimmage results during training camp
 */
(function() {
  'use strict';
  var TL = window.TL || {};
  
  TL.renderCampScrimmages = function(division, day) {
    var gs = TL.GameState;
    
    // Initialize camp scrimmages if needed
    if (!gs.campScrimmages) {
      gs.campScrimmages = {};
    }
    
    if (!gs.campScrimmages[division]) {
      gs.campScrimmages[division] = [];
    }
    
    // Get scrimmages for this division
    var scrimmages = gs.campScrimmages[division];
    
    var html = '<div class="camp-scrimmages-section">';
    html += '<h3>🏅 Training Camp Scrimmages</h3>';
    
    if (scrimmages.length === 0) {
      html += '<p class="muted">No scrimmages played yet. They occur on Days 2, 4, and 6.</p>';
    } else {
      html += '<table class="camp-scrimmage-table">';
      html += '<thead><tr>';
      html += '<th>Day</th><th>Red Team</th><th>Blue Team</th><th>Result</th>';
      html += '</tr></thead><tbody>';
      
      for (var i = 0; i < scrimmages.length; i++) {
        var game = scrimmages[i];
        var result = game.redScore > game.blueScore ? '🔴 Red Wins' :
                     game.blueScore > game.redScore ? '🔵 Blue Wins' :
                     '⚪ Tie';
        
        html += '<tr>';
        html += '<td>Day ' + game.day + '</td>';
        html += '<td style="text-align:center; font-weight:bold; font-size:1.2em;">' + game.redScore + '</td>';
        html += '<td style="text-align:center; font-weight:bold; font-size:1.2em;">' + game.blueScore + '</td>';
        html += '<td>' + result + '</td>';
        html += '</tr>';
      }
      
      html += '</tbody></table>';
    }
    
    html += '</div>';
    
    return html;
  };
  
  /**
   * Simulate a training camp scrimmage
   */
  TL.simulateCampScrimmage = function(division) {
    var gs = TL.GameState;
    var rng = TL.RNG;
    
    // Get all players for division
    var allPlayers = TL.Selectors.getAllPlayers(gs.user.org, division);
    
    if (!allPlayers || allPlayers.length === 0) {
      return null;
    }
    
    // Randomly assign to Red and Blue teams
    var shuffled = allPlayers.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = rng.int(0, i);
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    
    var mid = Math.floor(shuffled.length / 2);
    var redTeam = shuffled.slice(0, mid);
    var blueTeam = shuffled.slice(mid);
    
    // Calculate team strengths (simple average OVR)
    var redOVR = 0;
    for (var r = 0; r < redTeam.length; r++) {
      redOVR += redTeam[r].ovr || 50;
    }
    redOVR /= redTeam.length;
    
    var blueOVR = 0;
    for (var b = 0; b < blueTeam.length; b++) {
      blueOVR += blueTeam[b].ovr || 50;
    }
    blueOVR /= blueTeam.length;
    
    // Simulate score (Box Lacrosse typical: 8-18 goals per team)
    var redScore = Math.floor(8 + rng.random() * (redOVR / 10) + rng.random() * 5);
    var blueScore = Math.floor(8 + rng.random() * (blueOVR / 10) + rng.random() * 5);
    
    // Clamp scores
    redScore = Math.max(5, Math.min(20, redScore));
    blueScore = Math.max(5, Math.min(20, blueScore));
    
    // Store scrimmage result
    if (!gs.campScrimmages) {
      gs.campScrimmages = {};
    }
    if (!gs.campScrimmages[division]) {
      gs.campScrimmages[division] = [];
    }
    
    gs.campScrimmages[division].push({
      day: gs.day,
      redScore: redScore,
      blueScore: blueScore,
      redTeam: redTeam.map(function(p) { return p.id; }),
      blueTeam: blueTeam.map(function(p) { return p.id; })
    });
    
    return {
      redScore: redScore,
      blueScore: blueScore
    };
  };
  
  console.log('✅ Training Camp Scrimmages module loaded');
})();
