/**
 * ui/dashboard.js - Dashboard with Team Branding (SIMPLIFIED)
 */
;(function() {
    'use strict';
    
    var TL = window.TallyLax || {};
    
    function show(params) {
        var container = document.getElementById('main-content');
        if (!container) {
            console.error('main-content container not found!');
            return;
        }
        
        var GS = TL.GameState;
        var phase = TL.GameStateFactory ? TL.GameStateFactory.getPhase() : 'camp';
        
        container.innerHTML = '';
        
        // Build header HTML with team branding
        var headerHTML = '<div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem;">';
        
        // Team logo and info
        if (GS.user && GS.user.org) {
            var teams = (TL.Teams && TL.Teams.getAll) ? TL.Teams.getAll() : [];
            var userTeam = teams.find(function(t) { return t.name === GS.user.org; });
            
            if (userTeam) {
                headerHTML += '<div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 12px; border: 2px solid #e2e8f0; padding: 8px;">';
                headerHTML += '<img src="' + userTeam.logo + '" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="' + userTeam.name + '">';
                headerHTML += '</div>';
                headerHTML += '<div>';
                headerHTML += '<h1 style="font-size: 1.75rem; font-weight: 700; margin: 0;">' + userTeam.name + '</h1>';
                headerHTML += '<p style="margin: 0; color: #64748b;">' + GS.user.name + '</p>';
                headerHTML += '<p style="margin: 0; color: #64748b; font-size: 0.875rem;">President</p>';
                headerHTML += '</div>';
            }
        } else {
            headerHTML += '<h1 style="font-size: 2rem; margin: 0;">TallyLax Manager</h1>';
        }
        
        // Season info
        headerHTML += '<div style="margin-left: auto; text-align: right;">';
        headerHTML += '<p style="margin: 0; color: #64748b; font-size: 0.875rem;">Season ' + (GS.seasonYear || 1) + '</p>';
        headerHTML += '<p style="margin: 0; font-size: 1.25rem; font-weight: 600;">Day ' + (GS.day || 1) + '</p>';
        headerHTML += '<p style="margin: 0; color: #64748b; font-size: 0.875rem;">' + getPhaseDisplay(phase) + '</p>';
        headerHTML += '</div></div>';
        
        container.innerHTML = headerHTML;
        
        // Action buttons
        var actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;';
        
        if (!GS.divisions.U11.players || GS.divisions.U11.players.length === 0) {
            actionsDiv.innerHTML = '<button class="btn btn-primary" data-action="startNewSeason">New Season</button>';
            container.appendChild(actionsDiv);
            container.innerHTML += '<div class="card"><h2>Welcome to TallyLax Manager!</h2><p>Start a new season to begin.</p></div>';
            return;
        }
        
        actionsDiv.innerHTML = '<button class="btn btn-primary" data-action="advanceDay">Advance Day</button>' +
            '<button class="btn btn-primary" data-action="simWeek">Sim Week</button>';
        
        if (phase === 'camp') {
            actionsDiv.innerHTML += '<button class="btn btn-secondary" data-action="autoCompleteCamp">Auto Complete Camp</button>';
        }
        
        container.appendChild(actionsDiv);
        
        // Stats cards
        var totalPlayers = 0;
        Object.keys(GS.divisions).forEach(function(div) {
            totalPlayers += (GS.divisions[div].players || []).length;
        });
        
        var statsHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">';
        statsHTML += createStatCard('Total Players', totalPlayers);
        statsHTML += createStatCard('Games Played', Object.keys(GS.gameLog || {}).length);
        statsHTML += createStatCard('Days Remaining', 200 - (GS.day || 1));
        statsHTML += createStatCard('Avg Morale', calculateAvgMorale() + '%');
        statsHTML += '</div>';
        
        container.innerHTML += statsHTML;
        
        // Division table
        var tableHTML = '<div class="card"><h3 style="margin-bottom: 1rem;">Division Overview</h3>';
        tableHTML += '<table class="table"><thead><tr>';
        tableHTML += '<th>Division</th><th>Players</th><th>A Team</th><th>B Team</th><th>Avg OVR</th><th>Actions</th>';
        tableHTML += '</tr></thead><tbody>';
        
        ['U11', 'U13', 'U15', 'U17'].forEach(function(div) {
            var players = GS.divisions[div].players || [];
            var aTeam = players.filter(function(p) { return p.level === 'A'; }).length;
            var bTeam = players.filter(function(p) { return p.level === 'B'; }).length;
            var avgOvr = players.length > 0 ? 
                Math.round(players.reduce(function(sum, p) { return sum + (p.ovr || 50); }, 0) / players.length) : 0;
            
            tableHTML += '<tr>';
            tableHTML += '<td><strong>' + div + '</strong></td>';
            tableHTML += '<td>' + players.length + '</td>';
            tableHTML += '<td>' + aTeam + '</td>';
            tableHTML += '<td>' + bTeam + '</td>';
            tableHTML += '<td>' + avgOvr + '</td>';
            tableHTML += '<td><button class="btn btn-secondary" data-action="roster" data-param="' + div + '">View Roster</button></td>';
            tableHTML += '</tr>';
        });
        
        tableHTML += '</tbody></table></div>';
        container.innerHTML += tableHTML;
        
        // News
        showRecentNews(container, GS);
    }
    
    function createStatCard(label, value) {
        return '<div class="card" style="text-align: center;">' +
            '<div style="font-size: 2rem; font-weight: 700; color: #2563eb;">' + value + '</div>' +
            '<div style="color: #64748b; font-size: 0.875rem;">' + label + '</div>' +
            '</div>';
    }
    
    function calculateAvgMorale() {
        var GS = TL.GameState;
        var total = 0;
        var count = 0;
        
        Object.keys(GS.divisions).forEach(function(div) {
            var players = GS.divisions[div].players || [];
            players.forEach(function(p) {
                if (p.morale !== undefined) {
                    total += p.morale;
                    count++;
                }
            });
        });
        
        return count > 0 ? Math.round(total / count) : 70;
    }
    
    function getPhaseDisplay(phase) {
        var phases = {
            'camp': 'Training Camp',
            'segment1': 'Regular Season',
            'segment2': 'Regular Season',
            'segment3': 'Regular Season',
            'segment4': 'Regular Season',
            'midbreak': 'Mid-Season Break',
            'laxfest': 'LaxFest Tournament',
            'founders': 'Founders Cup',
            'playoffs': 'Playoffs',
            'awards': 'Awards'
        };
        return phases[phase] || 'Season';
    }
    
    function showRecentNews(container, GS) {
        var news = GS.news || [];
        if (news.length === 0) return;
        
        var newsHTML = '<div class="card"><h3 style="margin-bottom: 1rem;">Recent News</h3>';
        news.slice(-5).reverse().forEach(function(item) {
            newsHTML += '<div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">';
            newsHTML += '<div style="color: #64748b; font-size: 0.875rem;">Day ' + item.day + '</div>';
            newsHTML += '<div>' + item.text + '</div>';
            newsHTML += '</div>';
        });
        newsHTML += '</div>';
        container.innerHTML += newsHTML;
    }
    
    TL.UIDashboard = {
        show: show
    };
    
    console.log('✅ ui/dashboard.js loaded (with team branding)');
})();
