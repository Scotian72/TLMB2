// js/core/router.js
// COMPREHENSIVE ROUTER - All actions in one place (LOADS LAST)

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    
    var Router = {
        init: function() {
            console.log('🔄 Router initializing...');
            this.bindActions();
            this.route('setup');
            console.log('✅ TallyLax Router v6.2 initialized');
        },
        
        bindActions: function() {
            var self = this;
            document.addEventListener('click', function(e) {
                var target = e.target;
                while (target && target !== document) {
                    var action = target.getAttribute('data-action');
                    if (action) {
                        e.preventDefault();
                        var param = target.getAttribute('data-param');
                        var param2 = target.getAttribute('data-param2');
                        self.route(action, param, param2);
                        return;
                    }
                    target = target.parentElement;
                }
            });
        },
        
        route: function(action, param, param2) {
            console.log('Route:', action, param, param2);
            
            switch (action) {
                case 'setup':
                    if (TL.UISetup && TL.UISetup.show) TL.UISetup.show();
                    break;
                case 'select-team':
                    if (param && TL.Branding && TL.Branding.apply) TL.Branding.apply(param);
                    break;
                case 'start-game':
                    this.handleStartGame();
                    break;
                case 'dashboard':
                    if (TL.UIDashboard && TL.UIDashboard.show) TL.UIDashboard.show();
                    break;
                case 'training-camp-dashboard':
                    if (TL.UITrainingCampDashboard && TL.UITrainingCampDashboard.show) TL.UITrainingCampDashboard.show();
                    break;
                case 'runcamp':
                    if (TL.UITrainingCamp && TL.UITrainingCamp.show) TL.UITrainingCamp.show(param);
                    break;
                case 'advance-camp-day':
                    if (TL.SeasonManager && TL.SeasonManager.advanceCampDay) {
                        TL.SeasonManager.advanceCampDay();
                        if (TL.UITrainingCampDashboard && TL.UITrainingCampDashboard.show) TL.UITrainingCampDashboard.show();
                    }
                    break;
                case 'auto-sort-team':
                    if (TL.SeasonManager && TL.SeasonManager.sortTeamsAB && param) {
                        TL.SeasonManager.sortTeamsAB(TL.GameState.user.org, param);
                        if (TL.UITrainingCamp && TL.UITrainingCamp.show) TL.UITrainingCamp.show(param);
                    }
                    break;
                case 'auto-assign-all-teams':
                    if (TL.SeasonManager && TL.SeasonManager.autoSortAllOrganizations) {
                        TL.SeasonManager.autoSortAllOrganizations();
                        if (TL.UITrainingCampDashboard && TL.UITrainingCampDashboard.show) TL.UITrainingCampDashboard.show();
                    }
                    break;
                case 'player-card':
                    if (TL.UIPlayerCard && TL.UIPlayerCard.show && param) TL.UIPlayerCard.show(param);
                    break;
                case 'roster':
                    if (TL.UIRoster && TL.UIRoster.show) TL.UIRoster.show(param, param2);
                    break;
                case 'advance-day':
                    if (TL.SeasonManager && TL.SeasonManager.advanceDay) {
                        TL.SeasonManager.advanceDay();
                        if (TL.UIDashboard && TL.UIDashboard.show) TL.UIDashboard.show();
                    }
                    break;
                default:
                    console.warn('Unknown action:', action);
            }
        },
        
        handleStartGame: function() {
            var state = TL.GameState;
            var name = document.getElementById('president-name');
            var selectedOrg = document.querySelector('.team-card.selected');
            
            if (!name || !name.value) { alert('Please enter your name'); return; }
            if (!selectedOrg) { alert('Please select an organization'); return; }
            
            var org = selectedOrg.getAttribute('data-org');
            state.user.name = name.value;
            state.user.org = org;
            
            console.log('Game started:', name.value, org);
            console.log('Auto-generating rosters for all organizations...');
            
            if (TL.PlayerGenerator && TL.PlayerGenerator.generateOrganizationRosters) {
                state.orgs.forEach(function(orgName) {
                    TL.PlayerGenerator.generateOrganizationRosters(orgName);
                });
            }
            
            if (TL.JerseyManager && TL.JerseyManager.assignAllDivisionJerseys) {
                TL.JerseyManager.assignAllDivisionJerseys(state);
            }
            
            if (TL.RNG && TL.RNG.init) TL.RNG.init(Date.now());
            
            this.route('training-camp-dashboard');
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { Router.init(); });
    } else {
        Router.init();
    }
    
    TL.Router = Router;
})();
