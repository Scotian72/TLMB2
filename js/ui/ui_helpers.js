/**
 * TallyLax UI Helpers (v6.2)
 * Common UI utilities and render helpers
 * Contract: No state writes; no event listeners
 */

(function() {
  'use strict';

  var UI = {
    
    // Mount HTML into main content
    mount: function(html) {
      var main = document.getElementById('main-content');
      if (!main) {
        console.error('main-content container not found');
        return false;
      }
      main.innerHTML = html;
      return true;
    },

    // Show/hide sidebar
    showSidebar: function() {
      var sidebar = document.getElementById('sidebar');
      var wrapper = document.getElementById('content-wrapper');
      if (sidebar) {
        sidebar.classList.remove('hidden');
        if (wrapper) {
          wrapper.classList.add('sidebar-open');
        }
      }
    },

    hideSidebar: function() {
      var sidebar = document.getElementById('sidebar');
      var wrapper = document.getElementById('content-wrapper');
      if (sidebar) {
        sidebar.classList.add('hidden');
        if (wrapper) {
          wrapper.classList.remove('sidebar-open');
        }
      }
    },

    // Initialize sidebar interactions
    initializeSidebar: function() {
      var self = this;
      
      // Dropdown functionality
      var dropdownHeaders = document.querySelectorAll('.nav-dropdown-header');
      for (var i = 0; i < dropdownHeaders.length; i++) {
        dropdownHeaders[i].addEventListener('click', function() {
          var dropdown = this.parentNode;
          var content = dropdown.querySelector('.nav-dropdown-content');
          var icon = this.querySelector('.dropdown-icon');
          
          // Close other dropdowns
          var allDropdowns = document.querySelectorAll('.nav-dropdown');
          for (var j = 0; j < allDropdowns.length; j++) {
            if (allDropdowns[j] !== dropdown) {
              allDropdowns[j].classList.remove('expanded');
              var otherContent = allDropdowns[j].querySelector('.nav-dropdown-content');
              var otherIcon = allDropdowns[j].querySelector('.dropdown-icon');
              if (otherContent) {
                otherContent.classList.add('hidden');
              }
              if (otherIcon) {
                otherIcon.textContent = '▼';
              }
            }
          }
          
          // Toggle current dropdown
          if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            dropdown.classList.add('expanded');
            icon.textContent = '▲';
          } else {
            content.classList.add('hidden');
            dropdown.classList.remove('expanded');
            icon.textContent = '▼';
          }
        });
      }
      
      // Division expand/collapse functionality
      var divisionHeaders = document.querySelectorAll('.division-header');
      for (var k = 0; k < divisionHeaders.length; k++) {
        divisionHeaders[k].addEventListener('click', function() {
          var divisionItem = this.parentNode;
          var teamsDiv = divisionItem.querySelector('.division-teams');
          var expandIcon = this.querySelector('.expand-icon');
          
          // Close other divisions
          var allDivisions = document.querySelectorAll('.division-item');
          for (var l = 0; l < allDivisions.length; l++) {
            if (allDivisions[l] !== divisionItem) {
              allDivisions[l].classList.remove('expanded');
              var otherTeams = allDivisions[l].querySelector('.division-teams');
              var otherIcon = allDivisions[l].querySelector('.expand-icon');
              if (otherTeams) {
                otherTeams.classList.add('hidden');
              }
              if (otherIcon) {
                otherIcon.textContent = '▼';
              }
            }
          }
          
          // Toggle current division
          if (teamsDiv.classList.contains('hidden')) {
            teamsDiv.classList.remove('hidden');
            divisionItem.classList.add('expanded');
            expandIcon.textContent = '▲';
          } else {
            teamsDiv.classList.add('hidden');
            divisionItem.classList.remove('expanded');
            expandIcon.textContent = '▼';
          }
        });
      }
      
      // Click outside to close dropdowns
      document.addEventListener('click', function(e) {
        var sidebar = document.getElementById('sidebar');
        if (!sidebar.contains(e.target)) {
          // Close all dropdowns
          var allDropdowns = document.querySelectorAll('.nav-dropdown');
          for (var m = 0; m < allDropdowns.length; m++) {
            allDropdowns[m].classList.remove('expanded');
            var content = allDropdowns[m].querySelector('.nav-dropdown-content');
            var icon = allDropdowns[m].querySelector('.dropdown-icon');
            if (content) {
              content.classList.add('hidden');
            }
            if (icon) {
              icon.textContent = '▼';
            }
          }
          
          // Close all divisions
          var allDivisions = document.querySelectorAll('.division-item');
          for (var n = 0; n < allDivisions.length; n++) {
            allDivisions[n].classList.remove('expanded');
            var teams = allDivisions[n].querySelector('.division-teams');
            var divIcon = allDivisions[n].querySelector('.expand-icon');
            if (teams) {
              teams.classList.add('hidden');
            }
            if (divIcon) {
              divIcon.textContent = '▼';
            }
          }
        }
      });
    },

    // Update active nav button
    setActiveNavButton: function(action, division, level) {
      // Remove all active states
      var buttons = document.querySelectorAll('.nav-button, .team-button');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
      }
      
      // Find and activate the matching button
      var selector = '[data-action="' + action + '"]';
      if (division) {
        selector += '[data-param="' + division + '"]';
      }
      if (level) {
        selector += '[data-param2="' + level + '"]';
      }
      
      var activeButton = document.querySelector(selector);
      if (activeButton) {
        activeButton.classList.add('active');
        
        // Expand parent division if it's a team button
        var divisionItem = activeButton.closest('.division-item');
        if (divisionItem) {
          var teamsDiv = divisionItem.querySelector('.division-teams');
          var expandIcon = divisionItem.querySelector('.expand-icon');
          if (teamsDiv.classList.contains('hidden')) {
            teamsDiv.classList.remove('hidden');
            divisionItem.classList.add('expanded');
            expandIcon.textContent = '▲';
          }
        }
      }
    },
    
    // Show banner message
    showBanner: function(message, type) {
      type = type || 'info';
      
      var banner = document.getElementById('banner');
      if (!banner) {
        // Create banner if it doesn't exist
        banner = document.createElement('div');
        banner.id = 'banner';
        banner.className = 'banner';
        document.body.appendChild(banner);
      }
      
      banner.className = 'banner banner-' + type + ' banner-show';
      banner.textContent = message;
      
      // Auto-hide after 3 seconds
      setTimeout(function() {
        banner.className = 'banner';
      }, 3000);
    },
    
    // Format date (day number to readable)
    formatDay: function(day) {
      return 'Day ' + day;
    },
    
    // Format phase
    formatPhase: function(phase) {
      if (!phase) return '';
      return phase.charAt(0).toUpperCase() + phase.slice(1);
    },
    
    // Escape HTML
    escapeHtml: function(text) {
      if (!text) return '';
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    
    // Create option HTML
    option: function(value, text, selected) {
      var sel = selected ? ' selected' : '';
      return '<option value="' + this.escapeHtml(value) + '"' + sel + '>' + 
             this.escapeHtml(text) + '</option>';
    },
    
    // Create button HTML
    button: function(action, text, param, param2) {
      var html = '<button data-action="' + this.escapeHtml(action) + '"';
      if (param) {
        html += ' data-param="' + this.escapeHtml(param) + '"';
      }
      if (param2) {
        html += ' data-param2="' + this.escapeHtml(param2) + '"';
      }
      html += '>' + this.escapeHtml(text) + '</button>';
      return html;
    },
    
    // Create link HTML
    link: function(action, text, param, param2, className) {
      var html = '<a href="#" data-action="' + this.escapeHtml(action) + '"';
      if (param) {
        html += ' data-param="' + this.escapeHtml(param) + '"';
      }
      if (param2) {
        html += ' data-param2="' + this.escapeHtml(param2) + '"';
      }
      if (className) {
        html += ' class="' + this.escapeHtml(className) + '"';
      }
      html += '>' + this.escapeHtml(text) + '</a>';
      return html;
    },
    
    // Format number with commas
    formatNumber: function(num) {
      if (typeof num !== 'number') return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Format percentage
    formatPercent: function(num, decimals) {
      decimals = decimals || 1;
      if (typeof num !== 'number') return '0%';
      return (num * 100).toFixed(decimals) + '%';
    },
    
    // Format record (W-L)
    formatRecord: function(wins, losses) {
      return wins + '-' + losses;
    }
  };

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.UI = UI;
  window.TL = window.TallyLax; // Alias
})();
