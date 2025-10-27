/* @tlos:6.2
 * role: ui
 * name: ui_setup.js
 * reads: Teams, Constants
 * writes: window.TallyLax.UISetup
 * contracts: welcome experience, team selection, no event listeners (router owns)
 */

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    
    /**
     * UISetup - Welcome & Team Selection
     * 
     * The first experience - where you become the President.
     */
    var UISetup = {
        
        selectedTeam: null,
        userName: '',
        
        /**
         * Show setup screen
         */
        show: function() {
            var H = TL.UIHelpers;
            
            H.hideChrome();
            
            var html = this._renderWelcome();
            H.mount(html);
            
            // Store reference to inputs (will be read by router)
            this._bindInputs();
        },
        
        /**
         * Render welcome screen
         * @private
         */
        _renderWelcome: function() {
            var html = '<div class="setup-container">';
            
            // Header
            html += '<div class="setup-header">';
            html += '<h1 class="setup-title">TallyLax Manager</h1>';
            html += '<p class="setup-subtitle">Youth Box Lacrosse Organization Simulator</p>';
            html += '<p class="setup-subtitle">Maritime Region â€¢ U9 through U17</p>';
            html += '</div>';
            
            // Introduction
            html += '<div class="setup-section">';
            html += '<p class="text-center mb-lg" style="font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.8;">';
            html += 'One organization is seeking a President to lead their youth program through a 200-day season. ';
            html += 'Your decisions will shape player development, team chemistry, and the future of the sport in your community.';
            html += '</p>';
            html += '</div>';
            
            // Team Selection
            html += '<div class="setup-section">';
            html += '<h2 class="section-title">Select Your Organization</h2>';
            html += this._renderTeamGrid();
            html += '</div>';
            
            // Name Entry
            html += '<div class="setup-section" style="max-width: 500px; margin: 0 auto;">';
            html += '<div class="form-group">';
            html += '<label class="form-label">Your Name</label>';
            html += '<input type="text" id="user-name-input" class="form-input" placeholder="Enter your name" maxlength="30">';
            html += '</div>';
            html += '</div>';
            
            // Start Button
            html += '<div class="setup-section text-center">';
            html += '<button id="start-game-btn" class="btn btn-primary btn-center" data-action="start-game" disabled>';
            html += 'Accept Position';
            html += '</button>';
            html += '<p id="setup-error" class="mt-md" style="color: var(--color-danger); display: none;"></p>';
            html += '</div>';
            
            html += '</div>';
            
            return html;
        },
        
        /**
         * Render team grid
         * @private
         */
        _renderTeamGrid: function() {
            var teams = TL.Teams.list();
            var html = '<div class="team-grid">';
            
            for (var i = 0; i < teams.length; i++) {
                var teamName = teams[i];
                var team = TL.Teams.get(teamName);
                
                html += this._renderTeamCard(team);
            }
            
            html += '</div>';
            return html;
        },
        
        /**
         * Render individual team card
         * @private
         */
        _renderTeamCard: function(team) {
            var html = '<div class="team-card" data-team="' + team.name + '" ';
            html += 'style="--team-primary: ' + team.colors.primary + '; --team-secondary: ' + team.colors.secondary + ';">';
            
            // Logo
            html += '<img src="' + team.logo + '" alt="' + team.name + '" class="team-logo-large">';
            
            // Name
            html += '<h3 class="team-card-name">' + team.name + '</h3>';
            
            // Mascot
            html += '<p class="team-card-mascot">' + team.mascot + '</p>';
            
            // Motto
            html += '<p class="team-card-mascot" style="font-style: italic; margin-top: 0.5rem;">';
            html += '"' + team.motto + '"';
            html += '</p>';
            
            html += '</div>';
            return html;
        },
        
        /**
         * Bind input listeners (internal only, not routed)
         * @private
         */
        _bindInputs: function() {
            var self = this;
            
            // Team card clicks
            var cards = document.querySelectorAll('.team-card');
            for (var i = 0; i < cards.length; i++) {
                cards[i].addEventListener('click', function() {
                    self._selectTeam(this.getAttribute('data-team'));
                });
            }
            
            // Name input
            var nameInput = document.getElementById('user-name-input');
            if (nameInput) {
                nameInput.addEventListener('input', function() {
                    self._updateName(this.value);
                });
            }
        },
        
        /**
         * Handle team selection
         * @private
         */
        _selectTeam: function(teamName) {
            this.selectedTeam = teamName;
            
            // Update UI
            var cards = document.querySelectorAll('.team-card');
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (card.getAttribute('data-team') === teamName) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            }
            
            // Apply branding preview
            TL.Branding.apply(teamName);
            
            // Check if can start
            this._validateSetup();
        },
        
        /**
         * Handle name input
         * @private
         */
        _updateName: function(name) {
            this.userName = name.trim();
            this._validateSetup();
        },
        
        /**
         * Validate setup and enable/disable start button
         * @private
         */
        _validateSetup: function() {
            var btn = document.getElementById('start-game-btn');
            var error = document.getElementById('setup-error');
            
            if (!btn) {
                return;
            }
            
            var valid = this.selectedTeam && this.userName.length >= 2;
            
            if (valid) {
                btn.disabled = false;
                if (error) {
                    error.style.display = 'none';
                }
            } else {
                btn.disabled = true;
                if (error && this.userName.length > 0 && this.userName.length < 2) {
                    error.textContent = 'Name must be at least 2 characters';
                    error.style.display = 'block';
                }
            }
        },
        
        /**
         * Get setup data (called by router)
         * @returns {object} {userName, teamName}
         */
        getData: function() {
            return {
                userName: this.userName,
                teamName: this.selectedTeam
            };
        },
        
        /**
         * Validate that setup is complete
         * @returns {boolean} True if ready to start
         */
        isValid: function() {
            return !!(this.selectedTeam && this.userName.length >= 2);
        }
    };
    
    // Export
    TL.UISetup = UISetup;
    
    console.log('âœ… UISetup loaded');
    
})();
