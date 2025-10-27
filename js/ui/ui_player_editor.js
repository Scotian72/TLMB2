/**
 * Player Editor UI (v6.2) - NEW MODULE
 * Allows editing player names and jersey numbers
 * Contract: Provides interface to manually edit player details
 */

(function() {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};
  
  /**
   * Render player editor
   */
  TL.UI.renderPlayerEditor = function(playerId) {
    var gs = TL.GameState;
    var player = gs.players[playerId];
    
    if (!player) {
      TL.UI.mount('<div class="error">Player not found</div>');
      return;
    }
    
    var html = '<div class="player-editor-container">';
    
    // Header
    html += '<div class="editor-header">';
    html += '<h1>Edit Player</h1>';
    html += '<button class="btn-back" data-action="player-card" data-param="' + playerId + '">← Back to Player Card</button>';
    html += '</div>';
    
    // Current info display
    html += '<div class="current-info">';
    html += '<h2>Current Information</h2>';
    html += '<p><strong>Name:</strong> ' + player.name + '</p>';
    html += '<p><strong>Jersey:</strong> ' + (player.jersey || 'Not assigned') + '</p>';
    html += '<p><strong>Organization:</strong> ' + player.org + '</p>';
    html += '<p><strong>Division:</strong> ' + player.division + ' ' + player.level + '</p>';
    html += '<p><strong>Position:</strong> ' + player.position + '</p>';
    html += '</div>';
    
    // Edit form
    html += '<div class="edit-form">';
    html += '<h2>Edit Information</h2>';
    
    // Name editor
    html += '<div class="form-group">';
    html += '<label for="edit-name">Player Name:</label>';
    html += '<input type="text" id="edit-name" class="form-input" value="' + player.name + '" maxlength="50">';
    html += '</div>';
    
    // Jersey editor with validation
    html += '<div class="form-group">';
    html += '<label for="edit-jersey">Jersey Number:</label>';
    html += '<input type="number" id="edit-jersey" class="form-input" value="' + (player.jersey || '') + '" min="0" max="99">';
    
    // Show available numbers
    var summary = TL.JerseyManager.getDivisionJerseySummary(player.org, player.division);
    html += '<p class="form-help">';
    if (player.position === 'goalie') {
      html += 'Goalie numbers available: ' + summary.availableGoalie.slice(0, 5).join(', ');
      if (summary.availableGoalie.length > 5) {
        html += '...';
      }
    } else {
      html += 'Available runner numbers: ' + summary.availableRunner.slice(0, 10).join(', ');
      if (summary.availableRunner.length > 10) {
        html += '... (' + summary.availableRunner.length + ' total available)';
      }
    }
    html += '</p>';
    
    // Show favorite numbers
    if (player.favoriteJerseys && player.favoriteJerseys.length > 0) {
      html += '<p class="form-help">';
      html += '<strong>Player\'s Favorites:</strong> ' + player.favoriteJerseys.join(', ');
      html += '</p>';
    }
    
    html += '</div>';
    
    // Save button
    html += '<div class="form-actions">';
    html += '<button class="btn-primary" id="save-player-edits" data-player-id="' + playerId + '">Save Changes</button>';
    html += '<button class="btn-secondary" data-action="player-card" data-param="' + playerId + '">Cancel</button>';
    html += '</div>';
    
    html += '</div>';
    
    html += '</div>';
    
    TL.UI.mount(html);
    
    // Add event listener for save button
    var saveBtn = document.getElementById('save-player-edits');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        TL.UI._savePlayerEdits(playerId);
      });
    }
    
    console.log('✅ Player editor rendered for:', player.name);
  };
  
  /**
   * Save player edits
   */
  TL.UI._savePlayerEdits = function(playerId) {
    var gs = TL.GameState;
    var player = gs.players[playerId];
    
    if (!player) {
      TL.UI.showBanner('Player not found', 'error');
      return;
    }
    
    // Get new values
    var nameInput = document.getElementById('edit-name');
    var jerseyInput = document.getElementById('edit-jersey');
    
    if (!nameInput || !jerseyInput) {
      TL.UI.showBanner('Form elements not found', 'error');
      return;
    }
    
    var newName = nameInput.value.trim();
    var newJersey = parseInt(jerseyInput.value, 10);
    
    var hasChanges = false;
    
    // Validate and update name
    if (newName && newName !== player.name) {
      if (newName.length < 2) {
        TL.UI.showBanner('Name must be at least 2 characters', 'error');
        return;
      }
      player.name = newName;
      hasChanges = true;
    }
    
    // Validate and update jersey
    if (!isNaN(newJersey) && newJersey !== player.jersey) {
      var result = TL.JerseyManager.setPlayerJersey(playerId, newJersey);
      if (result.success) {
        hasChanges = true;
      } else {
        TL.UI.showBanner(result.error, 'error');
        return;
      }
    }
    
    if (hasChanges) {
      TL.UI.showBanner('Player updated successfully!', 'success');
      // Return to player card
      setTimeout(function() {
        TL.Router.route('player-card', playerId);
      }, 500);
    } else {
      TL.UI.showBanner('No changes made', 'info');
    }
  };
  
  console.log('✅ UIPlayerEditor loaded');
  
})();
