/* @tlos:6.2
 * role: ui
 * name: ui_helpers.js
 * reads: GameState (via Selectors), Teams
 * writes: window.TallyLax.UIHelpers
 * contracts: mount helpers, common render functions, no state mutations
 */

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    
    /**
     * UIHelpers - Common UI Utilities
     * 
     * Provides mounting and rendering helpers for all UI modules.
     * NO event listeners here - router.js owns all clicks.
     */
    var UIHelpers = {
        
        /**
         * Mount HTML to main content area
         * @param {string} html - HTML string to mount
         */
        mount: function(html) {
            var container = document.getElementById('main-content');
            if (!container) {
                console.error('main-content container not found');
                return;
            }
            container.innerHTML = html;
        },
        
        /**
         * Show top bar and navigation
         */
        showChrome: function() {
            var topBar = document.getElementById('top-bar');
            var mainNav = document.getElementById('main-nav');
            
            if (topBar) {
                topBar.classList.remove('hidden');
            }
            if (mainNav) {
                mainNav.classList.remove('hidden');
            }
        },
        
        /**
         * Hide top bar and navigation
         */
        hideChrome: function() {
            var topBar = document.getElementById('top-bar');
            var mainNav = document.getElementById('main-nav');
            
            if (topBar) {
                topBar.classList.add('hidden');
            }
            if (mainNav) {
                mainNav.classList.add('hidden');
            }
        },
        
        /**
         * Update top bar with current game state
         */
        updateTopBar: function() {
            var S = TL.Selectors;
            var user = S.user();
            var team = TL.Teams.get(user.org);
            
            // Team logo
            var logoEl = document.getElementById('team-logo');
            if (logoEl && team) {
                logoEl.src = team.logo;
                logoEl.alt = team.name + ' Logo';
            }
            
            // Team name
            var nameEl = document.getElementById('team-name');
            if (nameEl) {
                nameEl.textContent = user.org;
            }
            
            // User title
            var titleEl = document.getElementById('user-title');
            if (titleEl) {
                titleEl.textContent = user.name + ' - ' + user.title;
            }
            
            // Season info
            var yearEl = document.getElementById('season-year');
            if (yearEl) {
                yearEl.textContent = 'Season ' + S.seasonYear();
            }
            
            var dayEl = document.getElementById('current-day');
            if (dayEl) {
                dayEl.textContent = 'Day ' + S.day();
            }
            
            var phaseEl = document.getElementById('current-phase');
            if (phaseEl) {
                phaseEl.textContent = S.phaseLabel();
            }
        },
        
        /**
         * Create a section header
         * @param {string} title - Section title
         * @returns {string} HTML string
         */
        sectionHeader: function(title) {
            return '<h2 class="section-title">' + this.escape(title) + '</h2>';
        },
        
        /**
         * Create a banner message
         * @param {string} message - Message text
         * @param {string} type - Banner type (success, warning, danger)
         * @returns {string} HTML string
         */
        banner: function(message, type) {
            var className = 'banner banner-' + (type || 'info');
            return '<div class="' + className + '">' + this.escape(message) + '</div>';
        },
        
        /**
         * Escape HTML to prevent XSS
         * @param {string} str - String to escape
         * @returns {string} Escaped string
         */
        escape: function(str) {
            if (!str) {
                return '';
            }
            var div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        
        /**
         * Format a number with commas
         * @param {number} num - Number to format
         * @returns {string} Formatted number
         */
        formatNumber: function(num) {
            if (typeof num !== 'number') {
                return '0';
            }
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        
        /**
         * Clamp a value between min and max
         * @param {number} value - Value to clamp
         * @param {number} min - Minimum value
         * @param {number} max - Maximum value
         * @returns {number} Clamped value
         */
        clamp: function(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },
        
        /**
         * Create a button
         * @param {string} text - Button text
         * @param {string} action - data-action value
         * @param {string} className - CSS class name
         * @returns {string} HTML string
         */
        button: function(text, action, className) {
            var cls = className || 'btn btn-primary';
            return '<button class="' + cls + '" data-action="' + action + '">' + 
                   this.escape(text) + '</button>';
        },
        
        /**
         * Create empty state message
         * @param {string} message - Empty state message
         * @returns {string} HTML string
         */
        emptyState: function(message) {
            return '<div class="empty-state">' +
                   '<p class="empty-state-message">' + this.escape(message) + '</p>' +
                   '</div>';
        },
        
        /**
         * Set active nav button
         * @param {string} action - Action name to highlight
         */
        setActiveNav: function(action) {
            var buttons = document.querySelectorAll('.nav-btn');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                var btnAction = btn.getAttribute('data-action');
                
                if (btnAction === action) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        }
    };
    
    // Export
    TL.UIHelpers = UIHelpers;
    
    console.log('âœ… UIHelpers loaded');
    
})();
