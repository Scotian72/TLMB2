/**
 * core/router.js - Single Router (LOADS LAST)
 * Handles ALL [data-action] clicks in the application
 */
;(function() {
    'use strict';
    
    window.TallyLax = window.TallyLax || {};
    var TL = window.TallyLax;
    
    document.addEventListener('click', function(e) {
        var el = e.target.closest('[data-action]');
        if (!el) return;
        
        e.preventDefault();
        
        var action = el.getAttribute('data-action');
        var param = el.getAttribute('data-param');
        var param2 = el.getAttribute('data-param2');
        
        try {
            switch(action) {
                // === TITLE SCREEN ===
                case 'showTitle':
                    if (TL.UITitle) TL.UITitle.show();
                    break;
                    
                case 'startNewSeasonFromTitle':
                    if (TL.UITitle) TL.UITitle.startNewSeasonFromTitle();
                    break;
                
                // === SEASON MANAGEMENT ===
                case 'startNewSeason':
                    var seed = el.getAttribute('data-seed') || null;
                    if (TL.SeasonManager) TL.SeasonManager.startNewSeason(seed);
                    break;
                    
                case 'advanceDay':
                    if (TL.SeasonManager) TL.SeasonManager.advanceDay();
                    break;
                    
                case 'simWeek':
                    if (TL.SeasonManager) TL.SeasonManager.simWeek();
                    break;
                
                // === NAVIGATION ===
                case 'showDashboard':
                    if (TL.UIDashboard) TL.UIDashboard.show();
                    break;
                    
                case 'showTrainingCamp':
                    var division = param || 'U11';
                    if (TL.UITrainingCamp) TL.UITrainingCamp.show(division);
                    break;
                    
                case 'showRoster':
                    var divRoster = param || 'U11';
                    var levelRoster = param2 || 'A';
                    if (TL.UIRoster) TL.UIRoster.show(divRoster, levelRoster);
                    break;
                    
                case 'showLines':
                    var divLines = param || 'U11';
                    var levelLines = param2 || 'A';
                    if (TL.UILines) TL.UILines.show(divLines, levelLines);
                    break;
                    
                case 'showSchedule':
                    var divSchedule = param || 'U11';
                    if (TL.UISchedule) TL.UISchedule.show(divSchedule);
                    break;
                    
                case 'showStandings':
                    var divStandings = param || 'U11';
                    if (TL.UIStandings) TL.UIStandings.show(divStandings);
                    break;
                    
                case 'showLeaders':
                    var divLeaders = param || 'U11';
                    if (TL.UILeaders) TL.UILeaders.show(divLeaders);
                    break;
                    
                case 'showGameLog':
                    if (TL.UIGameLog) TL.UIGameLog.show();
                    break;
                    
                case 'showCoaching':
                    if (TL.UICoaching) TL.UICoaching.show();
                    break;
                    
                case 'showTraining':
                    if (TL.UITraining) TL.UITraining.show();
                    break;
                    
                case 'showOrganization':
                    if (TL.UIOrganization) TL.UIOrganization.show();
                    break;
                    
                case 'showPlayoffs':
                    if (TL.UIPlayoffs) TL.UIPlayoffs.show();
                    break;
                    
                case 'showTournaments':
                    if (TL.UITournaments) TL.UITournaments.show();
                    break;
                    
                case 'showNews':
                    if (TL.UINews) TL.UINews.show();
                    break;
                
                // === PLAYER ACTIONS ===
                case 'showPlayerCard':
                    var playerId = param;
                    if (TL.UIPlayerCard && playerId) {
                        TL.UIPlayerCard.show(playerId);
                    }
                    break;
                    
                case 'closeModal':
                    closeModal();
                
                // === NAV BAR ALIASES ===
                case 'dashboard':
                    if (TL.UIDashboard) TL.UIDashboard.show();
                    break;
                
                case 'roster':
                    var rDiv = param || 'U11';
                    if (TL.UIRoster) TL.UIRoster.show(rDiv);
                    break;
                
                case 'schedule':
                    if (TL.UISchedule) TL.UISchedule.show(param);
                    break;
                
                case 'standings':
                    if (TL.UIStandings) TL.UIStandings.show(param);
                    break;
                
                case 'training':
                    if (TL.UITraining) TL.UITraining.show();
                    break;
                
                case 'save':
                    if (TL.UISave) TL.UISave.show();
                    break;
                    
                    break;
                
                // === COACHING ACTIONS ===
                case 'assignCoach':
                    var coachId = param;
                    var divCoach = param2;
                    var levelCoach = el.getAttribute('data-param3');
                    if (TL.CoachingSystem && coachId && divCoach && levelCoach) {
                        TL.CoachingSystem.assignCoach(coachId, divCoach, levelCoach);
                        if (TL.UICoaching) TL.UICoaching.show();
                    }
                    break;
                
                // === LINES ACTIONS ===
                case 'autoAssignLines':
                    var divAuto = param;
                    var levelAuto = param2;
                    if (TL.LinesManager && divAuto && levelAuto) {
                        TL.LinesManager.autoAssign(divAuto, levelAuto);
                        if (TL.UILines) TL.UILines.show(divAuto, levelAuto);
                    }
                    break;
                    
                case 'saveLines':
                    if (TL.LinesManager) {
                        TL.LinesManager.saveFromUI();
                        showNotification('Lines saved successfully');
                    }
                    break;
                
                // === TRAINING ACTIONS ===
                case 'setTrainingPlan':
                    var divTraining = param;
                    var levelTraining = param2;
                    var plan = el.getAttribute('data-param3');
                    if (TL.TrainingSystem && divTraining && levelTraining && plan) {
                        TL.TrainingSystem.setPlan(divTraining, levelTraining, plan);
                        if (TL.UITraining) TL.UITraining.show();
                    }
                    break;
                
                // === SAVE/LOAD ===
                case 'saveGame':
                    var slot = param || 'slot1';
                    if (TL.SaveManager) {
                        TL.SaveManager.save(slot);
                        showNotification('Game saved to ' + slot);
                    }
                    break;
                    
                case 'loadGame':
                    var loadSlot = param || 'slot1';
                    if (TL.SaveManager) {
                        TL.SaveManager.load(loadSlot);
                        showNotification('Game loaded from ' + loadSlot);
                        if (TL.UIDashboard) TL.UIDashboard.show();
                    }
                    break;
                
                // === DEFAULT ===
                default:
                    console.warn('Unknown action:', action);
                    showNotification('Action not implemented: ' + action, 'warning');
            }
        } catch (err) {
            console.error('Router error:', action, err);
            showNotification('Error: ' + (err.message || String(err)), 'error');
        }
    });
    
    /**
     * Close modal overlay
     */
    function closeModal() {
        var modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(function(modal) {
            modal.remove();
        });
    }
    
    /**
     * Show notification toast
     */
    function showNotification(message, type) {
        type = type || 'info';
        
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.classList.add('toast-show');
        }, 10);
        
        setTimeout(function() {
            toast.classList.remove('toast-show');
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    /**
     * Navigate to a screen
     */
    function navigate(screenName, params) {
        params = params || {};
        
        var screens = {
            'title': TL.UITitle,
            'dashboard': TL.UIDashboard,
            'trainingCamp': TL.UITrainingCamp,
            'roster': TL.UIRoster,
            'lines': TL.UILines,
            'schedule': TL.UISchedule,
            'standings': TL.UIStandings,
            'leaders': TL.UILeaders,
            'gameLog': TL.UIGameLog,
            'coaching': TL.UICoaching,
            'training': TL.UITraining,
            'organization': TL.UIOrganization,
            'playoffs': TL.UIPlayoffs,
            'tournaments': TL.UITournaments,
            'news': TL.UINews
        };
        
        var screen = screens[screenName];
        if (screen && screen.show) {
            screen.show(params);
        } else {
            console.warn('Screen not found:', screenName);
        }
    }
    
    /**
     * Update day chip in header
     */
    function updateDayChip() {
        var dayChip = document.getElementById('day-chip');
        var phaseChip = document.getElementById('phase-chip');
        
        if (dayChip && TL.GameState) {
            dayChip.textContent = 'Day ' + (TL.GameState.day || 1);
        }
        
        if (phaseChip && TL.GameStateFactory) {
            var phase = TL.GameStateFactory.getPhase(TL.GameState.day);
            phaseChip.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
        }
    }
    
    /**
     * Refresh current screen
     */
    function refresh() {
        updateDayChip();
    }
    
    // Export Router API
    TL.Router = {
        navigate: navigate,
        updateDayChip: updateDayChip,
        refresh: refresh,
        closeModal: closeModal,
        showNotification: showNotification
    };
    
    // Initialize
    updateDayChip();
    
    // Show title screen on load
    if (TL.UITitle) {
        TL.UITitle.show();
    }
    
    console.log('âœ… core/router.js loaded (LAST)');
})();