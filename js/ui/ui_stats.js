// js/ui/ui_stats.js - FIXED: Display points and all stats correctly
(function() {
    'use strict';
    window.TallyLax = window.TallyLax || {};
    
    var UIStats = {
        
        showDivisionStats: function(division) {
            console.log('ðŸ“Š Showing division stats for ' + division);
            window.TallyLax.UINavigation.setActiveNavItem('stats');
            
            var state = window.TallyLax.GameState;
            if (!state.divisions[division]) {
                document.getElementById('main-content-panel').innerHTML = '<p>Invalid division.</p>';
                return;
            }
            
            this.showTeamStats(division, 'A');
        },
        
        showTeamStats: function(division, teamType) {
            console.log('ðŸ“Š Showing team stats for ' + division + ' ' + teamType + '-Team');
            
            var state = window.TallyLax.GameState;
            var players = state.divisions[division].players.filter(function(p) {
                return p.team === teamType;
            });
            
            var runners = players.filter(function(p) { return p.position !== 'Goalie'; });
            var goalies = players.filter(function(p) { return p.position === 'Goalie'; });
            
            var html = '<div class="stats-page">';
            html += '<div class="stats-header">';
            html += '<h2>' + division + ' ' + teamType + '-Team Statistics</h2>';
            html += '<div class="stats-tabs">';
            html += '<button data-action="showDivisionStats" data-division="' + division + '" class="tab-button">Overview</button>';
            html += '<button data-action="showTeamStats" data-division="' + division + '" data-team="A" class="tab-button ' + (teamType === 'A' ? 'active' : '') + '">A-Team Stats</button>';
            html += '<button data-action="showTeamStats" data-division="' + division + '" data-team="B" class="tab-button ' + (teamType === 'B' ? 'active' : '') + '">B-Team Stats</button>';
            html += '<button data-action="showLeaders" data-division="' + division + '" class="tab-button">League Leaders</button>';
            html += '</div>';
            html += '</div>';
            
            html += '<div class="stats-section"><h3>Runner Statistics</h3>' + this.renderRunnerStatsTable(runners) + '</div>';
            html += '<div class="stats-section"><h3>Goalie Statistics</h3>' + this.renderGoalieStatsTable(goalies) + '</div>';
            html += '</div>';
            
            document.getElementById('main-content-panel').innerHTML = html;
        },
        
        renderRunnerStatsTable: function(runners) {
            // FIX: Calculate points for sorting
            runners.sort(function(a, b) {
                var aPoints = (a.seasonStats.goals || 0) + (a.seasonStats.assists || 0);
                var bPoints = (b.seasonStats.goals || 0) + (b.seasonStats.assists || 0);
                return bPoints - aPoints;
            });
            
            var html = '<div class="stats-table-container"><table class="stats-table"><thead><tr>';
            html += '<th>Player</th><th>GP</th><th>G</th><th>A</th><th>P</th><th>SOG</th><th>SH%</th>';
            html += '<th>FO</th><th>FO%</th><th>LB</th><th>TO</th><th>CT</th><th>PIM</th>';
            html += '</tr></thead><tbody>';
            
            runners.forEach(function(p) {
                var stats = p.seasonStats || {};
                var goals = stats.goals || 0;
                var assists = stats.assists || 0;
                var points = goals + assists;  // FIX: Calculate points
                var sog = stats.shotsOnNet || 0;
                var shotPct = sog > 0 ? ((goals / sog) * 100).toFixed(1) : '0.0';
                var foWon = stats.faceoffsWon || 0;
                var foTaken = stats.faceoffsTaken || 0;
                var foPct = foTaken > 0 ? ((foWon / foTaken) * 100).toFixed(1) : '0.0';
                
                html += '<tr data-action="viewPlayerDetail" data-player-id="' + p.id + '" style="cursor: pointer;">';
                html += '<td class="player-name-cell">' + p.name + '</td>';
                html += '<td>' + (stats.gamesPlayed || 0) + '</td>';
                html += '<td>' + goals + '</td>';
                html += '<td>' + assists + '</td>';
                html += '<td><strong>' + points + '</strong></td>';  // FIX: Show calculated points
                html += '<td>' + sog + '</td>';
                html += '<td>' + shotPct + '%</td>';
                html += '<td>' + foTaken + '</td>';  // FIX: Show faceoffs taken
                html += '<td>' + foPct + '%</td>';
                html += '<td>' + (stats.looseBalls || 0) + '</td>';
                html += '<td>' + (stats.turnovers || 0) + '</td>';  // FIX: Show turnovers
                html += '<td>' + (stats.causedTurnovers || 0) + '</td>';  // FIX: Show caused turnovers
                html += '<td>' + (stats.penalties || 0) + '</td>';  // FIX: Show penalty minutes
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
            return html;
        },
        
        renderGoalieStatsTable: function(goalies) {
            goalies.sort(function(a, b) {
                var aSvPct = (a.seasonStats.shotsAgainst || 0) > 0 ? ((a.seasonStats.saves || 0) / (a.seasonStats.shotsAgainst || 0)) : 0;
                var bSvPct = (b.seasonStats.shotsAgainst || 0) > 0 ? ((b.seasonStats.saves || 0) / (b.seasonStats.shotsAgainst || 0)) : 0;
                return bSvPct - aSvPct;
            });
            
            var html = '<div class="stats-table-container"><table class="stats-table"><thead><tr><th>Player</th><th>GP</th><th>W</th><th>L</th><th>T</th><th>SA</th><th>SV</th><th>GA</th><th>SV%</th><th>GAA</th></tr></thead><tbody>';
            goalies.forEach(function(p) {
                var stats = p.seasonStats || {};
                var sa = stats.shotsAgainst || 0;
                var gp = stats.gamesPlayed || 0;
                var svPct = sa > 0 ? (((stats.saves || 0) / sa) * 100).toFixed(1) : '0.0';
                var gaa = gp > 0 ? ((stats.goalsAllowed || 0) / gp).toFixed(2) : '0.00';
                
                html += '<tr data-action="viewPlayerDetail" data-player-id="' + p.id + '" style="cursor: pointer;">';
                html += '<td class="player-name-cell">' + p.name + '</td>';
                html += '<td>' + gp + '</td>';
                html += '<td>' + (stats.wins || 0) + '</td>';
                html += '<td>' + (stats.losses || 0) + '</td>';
                html += '<td>' + (stats.ties || 0) + '</td>';  // FIX: Show ties
                html += '<td>' + sa + '</td>';
                html += '<td>' + (stats.saves || 0) + '</td>';
                html += '<td>' + (stats.goalsAllowed || 0) + '</td>';
                html += '<td><strong>' + svPct + '%</strong></td>';
                html += '<td>' + gaa + '</td>';
                html += '</tr>';
            });
            html += '</tbody></table></div>';
            return html;
        },
        
        showLeaders: function(division) {
            console.log('Showing league leaders for ' + division);
            
            var html = '<div class="stats-page">';
            html += '<div class="stats-header">';
            html += '<h2>' + division + ' League Leaders</h2>';
            html += '<div class="stats-tabs">';
            html += '<button data-action="showDivisionStats" data-division="' + division + '" class="tab-button">Overview</button>';
            html += '<button data-action="showTeamStats" data-division="' + division + '" data-team="A" class="tab-button">A-Team Stats</button>';
            html += '<button data-action="showTeamStats" data-division="' + division + '" data-team="B" class="tab-button">B-Team Stats</button>';
            html += '<button data-action="showLeaders" data-division="' + division + '" class="tab-button active">League Leaders</button>';
            html += '</div></div>';
            
            var allPlayers = this.getAllLeaguePlayers(division);
            
            html += '<div class="leaders-grid">';
            html += '<div class="leader-category"><h3>Points Leaders</h3>' + this.renderLeaderList(allPlayers, 'points', 10) + '</div>';
            html += '<div class="leader-category"><h3>Goals Leaders</h3>' + this.renderLeaderList(allPlayers, 'goals', 10) + '</div>';
            html += '<div class="leader-category"><h3>Assists Leaders</h3>' + this.renderLeaderList(allPlayers, 'assists', 10) + '</div>';
            
            var goalies = allPlayers.filter(function(p) { return p.position === 'Goalie'; });
            html += '<div class="leader-category"><h3>Save % Leaders (Goalies)</h3>' + this.renderGoalieLeaderList(goalies, 10) + '</div>';
            html += '</div></div>';
            
            document.getElementById('main-content-panel').innerHTML = html;
        },
        
        getAllLeaguePlayers: function(division) {
            var state = window.TallyLax.GameState;
            var allPlayers = [];
            
            // Get your team players
            var yourPlayers = state.divisions[division].players;
            allPlayers = allPlayers.concat(yourPlayers);
            
            // Get opponent players
            var opponents = window.TallyLax.OpponentTeams.list;
            opponents.forEach(function(org) {
                var aTeam = window.TallyLax.OpponentManager.getOpponentRoster(org, division, 'A') || [];
                var bTeam = window.TallyLax.OpponentManager.getOpponentRoster(org, division, 'B') || [];
                allPlayers = allPlayers.concat(aTeam, bTeam);
            });
            
            return allPlayers;
        },
        
        renderLeaderList: function(players, stat, count) {
            var runners = players.filter(function(p) { return p.position !== 'Goalie'; });
            
            // FIX: Calculate points if needed
            if (stat === 'points') {
                runners.forEach(function(p) {
                    if (!p.seasonStats.points) {
                        p.seasonStats.points = (p.seasonStats.goals || 0) + (p.seasonStats.assists || 0);
                    }
                });
            }
            
            runners.sort(function(a, b) {
                return (b.seasonStats[stat] || 0) - (a.seasonStats[stat] || 0);
            });
            
            var html = '<ol>';
            for (var i = 0; i < Math.min(count, runners.length); i++) {
                var p = runners[i];
                var value = stat === 'points' ? (p.seasonStats.goals || 0) + (p.seasonStats.assists || 0) : (p.seasonStats[stat] || 0);
                html += '<li>' + p.name + ' - ' + value + '</li>';
            }
            html += '</ol>';
            return html;
        },
        
        renderGoalieLeaderList: function(goalies, count) {
            goalies = goalies.filter(function(g) {
                return (g.seasonStats.shotsAgainst || 0) >= 10;
            });
            
            goalies.sort(function(a, b) {
                var aSvPct = (a.seasonStats.shotsAgainst || 0) > 0 ? ((a.seasonStats.saves || 0) / (a.seasonStats.shotsAgainst || 0)) : 0;
                var bSvPct = (b.seasonStats.shotsAgainst || 0) > 0 ? ((b.seasonStats.saves || 0) / (b.seasonStats.shotsAgainst || 0)) : 0;
                return bSvPct - aSvPct;
            });
            
            var html = '<ol>';
            for (var i = 0; i < Math.min(count, goalies.length); i++) {
                var g = goalies[i];
                var svPct = ((g.seasonStats.saves || 0) / (g.seasonStats.shotsAgainst || 1) * 100).toFixed(1);
                html += '<li>' + g.name + ' - ' + svPct + '%</li>';
            }
            html += '</ol>';
            return html;
        }
    };
    
    window.TallyLax.UIStats = UIStats;
    console.log('âœ… UIStats loaded - FIXED points calculation');
})();
