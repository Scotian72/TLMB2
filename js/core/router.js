/**
 * TallyLax Router (v6.2) - COMPREHENSIVE TRAINING CAMP FIX
 * Central routing system - MUST LOAD LAST
 * 
 * ✅ FIXED: Training camp stops at day 7
 * ✅ FIXED: Day counter updates properly
 * ✅ FIXED: Phase management (training camp → regular season)
 * ✅ FIXED: Player card routing works correctly
 */

(function() {
  'use strict';
  
  var Router = {
    
    /**
     * Route to a view
     */
    route: function(action, param, param2) {
      console.log('Route:', action, param, param2);
      
      switch(action) {
        case 'setup':
          TL.UI.renderSetup();
          break;
          
        case 'select-team':
          if (param) {
            this.selectTeam(param);
          }
          break;
          
        case 'start-game':
          this.startGame();
          break;
          
        case 'dashboard':
          TL.UI.renderDashboard();
          break;
          
        case 'organization':
          TL.UI.renderOrganization();
          break;
          
        case 'league-organizations':
          TL.UI.renderLeagueOrganizations();
          break;
          
        case 'view-org-roster':
          TL.UI.renderOrgRoster(param, param2);
          break;
          
        case 'view-org-roster-level':
          // param = org, param2 = division, additional param3 would be level
          TL.UI.renderOrgRoster(param, param2, this.getParam3());
          break;
          
        case 'roster':
          TL.UI.renderRoster(param, param2);
          break;
          
        case 'player-card':
          TL.UI.renderPlayerCard(param);
          break;
          
        case 'edit-player':
          TL.UI.renderPlayerEditor(param);
          break;
          
        case 'runcamp':
          // Check if training camp is over
          if (TL.GameState.day > TL.Constants.TRAINING_CAMP_END_DAY) {
            TL.UI.showBanner('Training camp has ended. Season is underway!', 'info');
            this.route('dashboard');
            return;
          }
          TL.UI.renderTrainingCamp(param);
          break;
          
        case 'training-camp-dashboard':
          // Check if training camp is over
          if (TL.GameState.day > TL.Constants.TRAINING_CAMP_END_DAY) {
            TL.UI.showBanner('Training camp has ended. Season is underway!', 'info');
            this.route('dashboard');
            return;
          }
          TL.UI.renderTrainingCampDashboard();
          break;
          
        case 'lines':
          TL.UI.renderLines(param, param2);
          break;
          
        case 'schedule':
          TL.UI.renderSchedule();
          break;
          
        case 'standings':
          TL.UI.renderStandings();
          break;
          
        case 'advance-camp-day':
          this.advanceCampDay(param);
          break;
          
        case 'advance-day':
          this.advanceDay();
          break;
          
        case 'manual-assign-teams':
          this.manualAssignTeams(param);
          break;
          
        case 'auto-assign-teams':
          this.autoAssignTeams(param);
          break;
          
        case 'auto-assign-all-teams':
          this.autoAssignAllTeams();
          break;
          
        case 'set-all-lines-all-teams':
          this.setAllLinesAllTeams();
          break;
          
        case 'complete-training-camp':
          this.completeTrainingCamp(param);
          break;
          
        case 'complete-all-camps':
          this.completeAllCamps();
          break;
          
        case 'save':
          TL.UI.showBanner('Save functionality coming soon', 'info');
          break;
          
        case 'load':
          TL.UI.showBanner('Load functionality coming soon', 'info');
          break;
          
        default:
          console.warn('Unknown route:', action);
          TL.UI.showBanner('Unknown action: ' + action, 'error');
      }
    },
    
    /**
     * Select team during setup
     */
    selectTeam: function(org) {
      var gs = TL.GameState;
      gs.user.org = org;
      TL.Branding.apply(org);
      console.log('Team selected:', org);
      TL.UI.renderSetup();
    },
    
    /**
     * Start the game after setup
     */
    startGame: function() {
      var gs = TL.GameState;
      
      if (!gs.user.name || !gs.user.org) {
        TL.UI.showBanner('Please enter your name and select a team', 'error');
        return;
      }
      
      console.log('Game started:', gs.user.name, gs.user.org);
      
      // Set initial phase to training camp
      gs.phase = TL.Constants.PHASES.TRAINING_CAMP;
      gs.day = TL.Constants.TRAINING_CAMP_START_DAY;
      
      // Generate all rosters
      console.log('Auto-generating rosters for all organizations...');
      var orgs = TL.Constants.ORGANIZATIONS;
      for (var i = 0; i < orgs.length; i++) {
        TL.PlayerGenerator.generateOrgRosters(orgs[i]);
        console.log('✓ Generated rosters for', orgs[i]);
      }
      
      console.log('Total players created:', Object.keys(gs.players).length);
      console.log('Players are in Training Camps - ready to assign to teams');
      
      // Generate schedule
      console.log('Auto-generating schedule...');
      TL.ScheduleSystem.initialize();
      console.log('Schedule generated successfully!');
      
      // Hide sidebar during game (will show after setup)
      var sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.remove('hidden');
      }
      
      // Update day counter
      this.updateDayCounter();
      
      // Show training camp dashboard
      this.route('training-camp-dashboard');
    },
    
    /**
     * Update day counter in header
     */
    updateDayCounter: function() {
      var gs = TL.GameState;
      var dayNumberEl = document.querySelector('.day-number');
      var dayLabelEl = document.querySelector('.day-label');
      var phaseLabel = document.querySelector('.phase-label');
      
      if (dayNumberEl) {
        dayNumberEl.textContent = gs.day;
      }
      
      if (dayLabelEl) {
        dayLabelEl.textContent = 'Day ' + gs.day + ' of ' + TL.Constants.SEASON_LENGTH_DAYS;
      }
      
      if (phaseLabel) {
        var phase = this.getCurrentPhaseDisplay();
        phaseLabel.textContent = phase;
      }
    },
    
    /**
     * Get current phase display text
     */
    getCurrentPhaseDisplay: function() {
      var gs = TL.GameState;
      
      if (gs.day <= TL.Constants.TRAINING_CAMP_END_DAY) {
        return '🏕️ Training Camp (Day ' + gs.day + '/7)';
      } else if (gs.day <= 38) {
        return '🏆 Regular Season - Segment 1';
      } else if (gs.day <= 49) {
        return '🎪 Tournament 1';
      } else if (gs.day <= 80) {
        return '🏆 Regular Season - Segment 2';
      } else if (gs.day <= 91) {
        return '☕ Mid-Season Break';
      } else if (gs.day <= 122) {
        return '🏆 Regular Season - Segment 3';
      } else if (gs.day <= 133) {
        return '🎪 Tournament 2';
      } else if (gs.day <= 164) {
        return '🏆 Regular Season - Segment 4';
      } else if (gs.day <= 195) {
        return '🏅 Playoffs';
      } else if (gs.day <= 199) {
        return '📊 Debrief & Reports';
      } else if (gs.day === 200) {
        return '🏆 Awards Day';
      } else {
        return '🌴 Off-Season';
      }
    },
    
    /**
     * Advance a single day in training camp for a division
     * 🔧 FIXED: Stops at day 7 and requires team assignment
     */
    advanceCampDay: function(division) {
      var gs = TL.GameState;
      var constants = TL.Constants;
      
      // Check if we're at day 7
      if (gs.day >= constants.TRAINING_CAMP_END_DAY) {
        TL.UI.showBanner('⚠️ Training camp ends at Day 7. Please assign all teams before advancing to the regular season.', 'warning');
        
        // Check if teams are assigned
        var allAssigned = this.checkAllTeamsAssigned();
        
        if (allAssigned) {
          TL.UI.showBanner('All teams assigned! Click "Complete All Camps" to start the regular season.', 'success');
        } else {
          TL.UI.showBanner('Please assign all players to A or B teams before completing training camp.', 'error');
        }
        
        return;
      }
      
      // Increment day
      gs.day++;
      
      // Run camp day simulation (clinics, scrimmages, stat updates)
      if (window.TL.SeasonManager && window.TL.SeasonManager.runCampDay) {
        TL.SeasonManager.runCampDay(division);
      }
      
      // Update day counter
      this.updateDayCounter();
      
      // Show banner based on day
      if (gs.day === constants.TRAINING_CAMP_END_DAY) {
        TL.UI.showBanner('🚨 FINAL DAY OF TRAINING CAMP! Assign all teams before advancing.', 'warning');
      } else {
        TL.UI.showBanner('Advanced to Day ' + gs.day + ' of Training Camp', 'success');
      }
      
      // Re-render the training camp view
      TL.UI.renderTrainingCamp(division);
    },
    
    /**
     * Check if all teams are assigned (except U9)
     */
    checkAllTeamsAssigned: function() {
      var gs = TL.GameState;
      var org = gs.user.org;
      var divisions = ['U11', 'U13', 'U15', 'U17']; // Skip U9
      
      for (var i = 0; i < divisions.length; i++) {
        var div = divisions[i];
        var tcRoster = TL.Selectors.roster(org, div, 'TC');
        
        if (tcRoster && tcRoster.length > 0) {
          // Still have unassigned players in training camp
          return false;
        }
      }
      
      return true;
    },
    
    /**
     * Advance day (main game progression)
     * ✅ FIXED: Blocks during training camp if teams not assigned
     */
    advanceDay: function() {
      var gs = TL.GameState;
      
      // ✅ CRITICAL: Check if we're in training camp
      if (gs.day <= TL.Constants.TRAINING_CAMP_END_DAY) {
        // Check if all teams are assigned
        var allAssigned = this.checkAllTeamsAssigned();
        
        if (!allAssigned) {
          TL.UI.showBanner('⚠️ You must assign all players to A/B teams before advancing past training camp! Go to Training Camp Dashboard.', 'error');
          this.route('training-camp-dashboard');
          return;
        }
        
        // If on day 7 and all assigned, advance to day 8 and end camp
        if (gs.day === TL.Constants.TRAINING_CAMP_END_DAY) {
          gs.day++;
          gs.phase = TL.Constants.PHASES.REGULAR;
          TL.UI.showBanner('🏆 Training camp complete! Regular season begins!', 'success');
          this.updateDayCounter();
          this.route('dashboard');
          return;
        }
      }
      
      // Normal day advancement
      gs.day++;
      
      // Update phase if transitioning
      if (gs.day === TL.Constants.TRAINING_CAMP_END_DAY + 1) {
        gs.phase = TL.Constants.PHASES.REGULAR;
        TL.UI.showBanner('🏆 Training camp complete! Regular season begins!', 'success');
      } else {
        TL.UI.showBanner('Advanced to Day ' + gs.day, 'success');
      }
      
      // Update day counter
      this.updateDayCounter();
      
      // Re-render dashboard
      this.route('dashboard');
    },
    
    /**
     * Manual team assignment (placeholder - shows roster view)
     */
    manualAssignTeams: function(division) {
      TL.UI.showBanner('Manual assignment: Use training camp interface to drag players', 'info');
      this.route('runcamp', division);
    },
    
    /**
     * Auto-assign teams for a single division
     */
    autoAssignTeams: function(division) {
      var gs = TL.GameState;
      var org = gs.user.org;
      
      // Get training camp roster
      var tcRoster = TL.Selectors.roster(org, division, 'TC');
      
      if (!tcRoster || tcRoster.length === 0) {
        TL.UI.showBanner('No players in training camp for ' + division, 'error');
        return;
      }
      
      // Sort by OVR
      tcRoster.sort(function(a, b) {
        return (b.ovr || 50) - (a.ovr || 50);
      });
      
      // Split into A and B teams
      var halfPoint = Math.ceil(tcRoster.length / 2);
      
      // Clear existing teams
      gs.divisions[division].players = [];
      
      // Assign to teams
      for (var i = 0; i < tcRoster.length; i++) {
        var player = tcRoster[i];
        if (i < halfPoint) {
          player.level = 'A';
        } else {
          player.level = 'B';
        }
        gs.divisions[division].players.push(player.id);
      }
      
      // Auto-assign jersey numbers
      var assignedA = TL.JerseyManager.autoAssignDivisionJerseys(org, division, 'A');
      var assignedB = TL.JerseyManager.autoAssignDivisionJerseys(org, division, 'B');
      
      TL.UI.showBanner('Teams assigned! A: ' + halfPoint + ' players, B: ' + (tcRoster.length - halfPoint) + ' players. Jerseys assigned: ' + (assignedA + assignedB), 'success');
      
      // Show training camp dashboard
      this.route('training-camp-dashboard');
    },
    
    /**
     * Auto-assign all teams at once
     */
    autoAssignAllTeams: function() {
      var gs = TL.GameState;
      var org = gs.user.org;
      var constants = TL.Constants;
      
      var totalAssigned = 0;
      
      for (var i = 0; i < constants.DIVISIONS.length; i++) {
        var div = constants.DIVISIONS[i];
        
        // Skip U9 (no team split)
        if (div === 'U9') {
          // Just assign jerseys for U9
          var jerseyCount = TL.JerseyManager.autoAssignDivisionJerseys(org, div, 'TC');
          totalAssigned += jerseyCount;
          continue;
        }
        
        // Check if this division has players in training camp
        var tcRoster = TL.Selectors.roster(org, div, 'TC');
        
        if (tcRoster && tcRoster.length > 0) {
          // Sort by OVR
          tcRoster.sort(function(a, b) {
            return (b.ovr || 50) - (a.ovr || 50);
          });
          
          // Split into A and B teams
          var halfPoint = Math.ceil(tcRoster.length / 2);
          
          // Clear existing teams
          gs.divisions[div].players = [];
          
          // Assign to teams
          for (var j = 0; j < tcRoster.length; j++) {
            var player = tcRoster[j];
            if (j < halfPoint) {
              player.level = 'A';
            } else {
              player.level = 'B';
            }
            gs.divisions[div].players.push(player.id);
          }
          
          // Auto-assign jerseys
          var assignedA = TL.JerseyManager.autoAssignDivisionJerseys(org, div, 'A');
          var assignedB = TL.JerseyManager.autoAssignDivisionJerseys(org, div, 'B');
          totalAssigned += assignedA + assignedB;
        }
      }
      
      TL.UI.showBanner('All teams assigned! Total jerseys assigned: ' + totalAssigned, 'success');
      
      // Show training camp dashboard
      this.route('training-camp-dashboard');
    },
    
    /**
     * Complete training camp for a division (U9 only)
     */
    completeTrainingCamp: function(division) {
      // For U9, just assign jerseys
      if (division === 'U9') {
        var gs = TL.GameState;
        var org = gs.user.org;
        var assigned = TL.JerseyManager.autoAssignDivisionJerseys(org, division, 'TC');
        TL.UI.showBanner('U9 training camp complete! ' + assigned + ' jerseys assigned', 'success');
      }
      
      this.route('training-camp-dashboard');
    },
    
    /**
     * Complete all training camps and start regular season
     * 🔧 FIXED: Advances to day 8 and changes phase
     */
    completeAllCamps: function() {
      var gs = TL.GameState;
      
      // Check if all teams are assigned
      if (!this.checkAllTeamsAssigned()) {
        TL.UI.showBanner('⚠️ Please assign all players to teams before completing training camp!', 'error');
        return;
      }
      
      // Auto-assign any remaining teams
      this.autoAssignAllTeams();
      
      // Advance to day 8 (post-training camp)
      gs.day = TL.Constants.TRAINING_CAMP_END_DAY + 1;
      gs.phase = TL.Constants.PHASES.REGULAR;
      
      // Update day counter
      this.updateDayCounter();
      
      TL.UI.showBanner('🏆 All training camps complete! Regular season begins on Day 8!', 'success');
      this.route('dashboard');
    },
    
    /**
     * Set lines for all divisions and levels (one-click convenience)
     */
    setAllLinesAllTeams: function() {
      var gs = TL.GameState;
      var divisions = ['U11', 'U13', 'U15', 'U17'];
      var levels = ['A', 'B'];
      var totalSet = 0;
      var errors = 0;
      
      console.log('Setting lines for all teams...');
      
      for (var i = 0; i < divisions.length; i++) {
        for (var j = 0; j < levels.length; j++) {
          var div = divisions[i];
          var lvl = levels[j];
          
          if (TL.LinesManager && TL.LinesManager.autoSetLines) {
            try {
              var result = TL.LinesManager.autoSetLines(gs.user.org, div, lvl);
              if (result) {
                totalSet++;
                console.log('  ✓ Set lines for ' + div + ' ' + lvl);
              } else {
                errors++;
                console.log('  ✗ Could not set lines for ' + div + ' ' + lvl);
              }
            } catch(e) {
              errors++;
              console.error('  ✗ Error setting lines for ' + div + ' ' + lvl + ':', e);
            }
          }
        }
      }
      
      if (totalSet > 0) {
        var message = '✅ Set lines for ' + totalSet + ' team' + (totalSet !== 1 ? 's' : '') + '!';
        if (errors > 0) {
          message += ' (' + errors + ' skipped due to insufficient players)';
        }
        TL.UI.showBanner(message, 'success');
      } else {
        TL.UI.showBanner('⚠️ Could not set lines. Make sure teams are assigned first.', 'warning');
      }
      
      this.route('lines', 'U11', 'A');
    }
  };
  
  // Export
  window.TL = window.TL || {};
  window.TL.Router = Router;
  
  // Bind all click events with data-action
  document.addEventListener('click', function(e) {
    var target = e.target;
    
    // Handle clicks on player cards (for player card routing)
    if (target.classList.contains('camp-player-card') || target.closest('.camp-player-card')) {
      var card = target.classList.contains('camp-player-card') ? target : target.closest('.camp-player-card');
      var playerId = card.getAttribute('data-player-id');
      
      if (playerId) {
        e.preventDefault();
        Router.route('player-card', playerId);
        return;
      }
    }
    
    // Handle clicks on buttons with data-action
    if (target.hasAttribute('data-action')) {
      e.preventDefault();
      var action = target.getAttribute('data-action');
      var param = target.getAttribute('data-param');
      var param2 = target.getAttribute('data-param2');
      Router.route(action, param, param2);
    }
  });
  
  // Handle dropdown toggles
  document.addEventListener('click', function(e) {
    var target = e.target;
    
    // Division expand/collapse
    if (target.classList.contains('division-header') || target.closest('.division-header')) {
      var header = target.classList.contains('division-header') ? target : target.closest('.division-header');
      var divItem = header.parentElement;
      var teams = divItem.querySelector('.division-teams');
      var icon = header.querySelector('.expand-icon');
      
      if (teams) {
        teams.classList.toggle('hidden');
        if (icon) {
          icon.textContent = teams.classList.contains('hidden') ? '▼' : '▲';
        }
      }
    }
    
    // Nav dropdown toggle
    if (target.classList.contains('nav-dropdown-header') || target.closest('.nav-dropdown-header')) {
      var dropdownHeader = target.classList.contains('nav-dropdown-header') ? target : target.closest('.nav-dropdown-header');
      var dropdown = dropdownHeader.parentElement;
      var content = dropdown.querySelector('.nav-dropdown-content');
      var icon = dropdownHeader.querySelector('.dropdown-icon');
      
      if (content) {
        content.classList.toggle('hidden');
        if (icon) {
          icon.textContent = content.classList.contains('hidden') ? '▼' : '▲';
        }
      }
    }
  });
  
  console.log('✅ TallyLax Router v6.2 initialized (COMPREHENSIVE TRAINING CAMP FIX)');
})();
