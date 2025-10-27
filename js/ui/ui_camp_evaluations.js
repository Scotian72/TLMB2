/**
 * Training Camp Player Evaluations
 * AI-generated suggestions for player placement
 */
(function() {
  'use strict';
  var TL = window.TL || {};
  
  /**
   * Generate evaluation for a player
   */
  TL.evaluatePlayer = function(player) {
    if (!player) return null;
    
    var ovr = player.ovr || 50;
    var position = player.position;
    
    var evaluation = {
      grade: '',
      recommendation: '',
      strengths: [],
      weaknesses: [],
      teamSuggestion: ''
    };
    
    // Determine grade
    if (ovr >= 75) {
      evaluation.grade = 'A+';
      evaluation.teamSuggestion = 'A Team Starter';
    } else if (ovr >= 70) {
      evaluation.grade = 'A';
      evaluation.teamSuggestion = 'A Team';
    } else if (ovr >= 65) {
      evaluation.grade = 'A-';
      evaluation.teamSuggestion = 'A Team Depth';
    } else if (ovr >= 60) {
      evaluation.grade = 'B+';
      evaluation.teamSuggestion = 'B Team Starter';
    } else if (ovr >= 55) {
      evaluation.grade = 'B';
      evaluation.teamSuggestion = 'B Team';
    } else if (ovr >= 50) {
      evaluation.grade = 'B-';
      evaluation.teamSuggestion = 'B Team Depth';
    } else {
      evaluation.grade = 'C';
      evaluation.teamSuggestion = 'B Team Development';
    }
    
    // Analyze strengths and weaknesses
    if (position === 'G' || position === 'Goalie') {
      // Goalie analysis
      if ((player.reflexes || 50) >= 65) evaluation.strengths.push('Excellent reflexes');
      if ((player.positioning || 50) >= 65) evaluation.strengths.push('Strong positioning');
      if ((player.handSpeed || 50) >= 65) evaluation.strengths.push('Quick hands');
      
      if ((player.reflexes || 50) < 45) evaluation.weaknesses.push('Needs reflex work');
      if ((player.angles || 50) < 45) evaluation.weaknesses.push('Angle play needs development');
    } else {
      // Runner analysis
      if ((player.finishing || 50) >= 65) evaluation.strengths.push('Clinical finisher');
      if ((player.passing || 50) >= 65) evaluation.strengths.push('Great playmaker');
      if ((player.transSpeed || 50) >= 65) evaluation.strengths.push('Excellent speed');
      if ((player.defenseIQ || 50) >= 65) evaluation.strengths.push('Strong defender');
      
      if ((player.finishing || 50) < 45) evaluation.weaknesses.push('Finishing needs work');
      if ((player.discipline || 50) < 45) evaluation.weaknesses.push('Discipline concerns');
      if ((player.balance || 50) < 45) evaluation.weaknesses.push('Balance training needed');
    }
    
    // Generate recommendation
    if (evaluation.strengths.length >= 3) {
      evaluation.recommendation = 'Elite prospect with multiple standout abilities. Prioritize for A Team.';
    } else if (evaluation.strengths.length >= 2) {
      evaluation.recommendation = 'Solid player with clear strengths. Good A Team candidate.';
    } else if (evaluation.strengths.length >= 1) {
      evaluation.recommendation = 'Developing player with some bright spots. B Team with A Team potential.';
    } else {
      evaluation.recommendation = 'Needs focused development. B Team for now, lots of upside.';
    }
    
    return evaluation;
  };
  
  /**
   * Render evaluation report for division
   */
  TL.renderCampEvaluationReport = function(division) {
    var gs = TL.GameState;
    var org = gs.user.org;
    
    var allPlayers = TL.Selectors.getAllPlayers(org, division);
    
    if (!allPlayers || allPlayers.length === 0) {
      return '<p class="muted">No players to evaluate</p>';
    }
    
    // Sort by OVR
    allPlayers.sort(function(a, b) {
      return (b.ovr || 50) - (a.ovr || 50);
    });
    
    var html = '<div class="camp-evaluation-report">';
    html += '<h2>📊 Training Camp Evaluation Report - ' + division + '</h2>';
    html += '<p class="report-intro">AI-generated player assessments and team recommendations</p>';
    
    html += '<table class="evaluation-table">';
    html += '<thead><tr>';
    html += '<th>Player</th><th>Pos</th><th>OVR</th><th>Grade</th><th>Recommendation</th><th>Suggested Team</th>';
    html += '</tr></thead><tbody>';
    
    for (var i = 0; i < allPlayers.length; i++) {
      var player = allPlayers[i];
      var playerEval = TL.evaluatePlayer(player);
      
      var gradeClass = playerEval.grade.indexOf('A') === 0 ? 'grade-a' :
                       playerEval.grade.indexOf('B') === 0 ? 'grade-b' :
                       'grade-c';
      
      html += '<tr>';
      html += '<td>' + (player.firstName || '') + ' ' + (player.lastName || '') + '</td>';
      html += '<td>' + (player.position || 'R') + '</td>';
      html += '<td>' + Math.round(player.ovr || 50) + '</td>';
      html += '<td class="' + gradeClass + '">' + playerEval.grade + '</td>';
      html += '<td class="eval-recommendation">' + playerEval.recommendation + '</td>';
      html += '<td class="team-suggestion">' + playerEval.teamSuggestion + '</td>';
      html += '</tr>';
    }
    
    html += '</tbody></table>';
    html += '</div>';
    
    return html;
  };
  
  console.log('✅ Training Camp Evaluations module loaded');
})();
