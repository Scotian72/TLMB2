/**
 * UI Lines - Drag & Drop Lines Manager for U11-U17
 * Box Lacrosse: 5 runners per line + goalie rotation
 */
(function () {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};

  var POSITIONS = ['R1', 'R2', 'R3', 'R4', 'R5']; // Box Lacrosse: 5 runners per line
  var draggedPlayer = null;

  /**
   * Render lines manager
   */
  TL.UI.renderLines = function (div, level) {
    var gs = TL.GameState;
    var org = gs.user.org;
    
    // Get roster
    var roster = TL.Selectors.getRoster(org, div, level);
    if (!roster || !roster.runners) {
      TL.UI.mount('<div class="error">Roster not found. Please generate rosters first.</div>');
      return;
    }
    
    // Initialize lines if needed
    var linesKey = TL.Keys.key(org, div, level);
    if (!gs.lines) gs.lines = {};
    if (!gs.lines[linesKey]) {
      gs.lines[linesKey] = {
        L1: [], L2: [], L3: [], L4: [],
        PP: [], PK: [],
        goalieRotation: 'Alternate', // Alternate, Balanced, HotHand
        starterGoalie: null
      };
    }
    
    var lines = gs.lines[linesKey];
    var runners = roster.runners || [];
    var goalies = roster.goalies || [];
    
    var html = '<div class="lines-container">';
    
    // Set All Lines Button (Global Action)
    html += '<div class="lines-global-actions" style="';
    html += '  margin-bottom: 20px; ';
    html += '  padding: 15px; ';
    html += '  background: rgba(255, 255, 255, 0.05); ';
    html += '  border-radius: 8px; ';
    html += '  border: 1px solid rgba(255, 255, 255, 0.1); ';
    html += '  text-align: center;';
    html += '">';
    html += '  <button class="btn btn-primary" ';
    html += '    data-action="set-all-lines-all-teams" ';
    html += '    style="';
    html += '      font-size: 16px; ';
    html += '      padding: 12px 24px; ';
    html += '      font-weight: 600;';
    html += '    ">';
    html += '    ⚡ Set All Lines (All Teams)';
    html += '  </button>';
    html += '  <p style="';
    html += '    margin-top: 10px; ';
    html += '    margin-bottom: 0; ';
    html += '    font-size: 13px; ';
    html += '    opacity: 0.8; ';
    html += '    color: white;';
    html += '  ">';
    html += '    Auto-sets L1-L4 and PP/PK units for all divisions (U11 A/B, U13 A/B, U15 A/B, U17 A/B)';
    html += '  </p>';
    html += '</div>';
    
    // Header
    html += '<div class="lines-header">';
    html += '<button class="btn-back" data-action="roster" data-param="' + div + '" data-param2="' + level + '">← Back to Roster</button>';
    html += '<h1>🥍 ' + org + ' ' + div + ' Team ' + level + ' - Lines</h1>';
    html += '</div>';
    
    // Instructions
    html += '<div class="lines-instructions">';
    html += '<p><strong>Drag and drop</strong> players into line slots. Box Lacrosse uses 5 runners per line.</p>';
    html += '<p><strong>Auto-Fill</strong> will create balanced lines based on player ratings.</p>';
    html += '</div>';
    
    // Action buttons
    html += '<div class="lines-actions">';
    html += '<button class="btn-primary" id="auto-fill-lines">⚡ Auto-Fill All Lines</button>';
    html += '<button class="btn-secondary" id="clear-lines">🗑️ Clear All Lines</button>';
    html += '<button class="btn-success" id="save-lines">💾 Save Lines</button>';
    html += '</div>';
    
    // Lines display
    html += '<div class="lines-grid">';
    
    // Four main lines (L1-L4)
    for (var i = 1; i <= 4; i++) {
      html += buildLineCard('L' + i, lines['L' + i], i, runners);
    }
    
    html += '</div>';
    
    // Special teams
    html += '<div class="special-teams">';
    html += '<h2>Special Teams</h2>';
    html += '<div class="lines-grid">';
    html += buildLineCard('PP', lines.PP, 'PP', runners, 'Power Play');
    html += buildLineCard('PK', lines.PK, 'PK', runners, 'Penalty Kill');
    html += '</div>';
    html += '</div>';
    
    // Goalie management
    html += '<div class="goalie-section">';
    html += '<h2>Goalie Rotation</h2>';
    html += '<div class="goalie-controls">';
    html += '<label>Strategy: ';
    html += '<select id="goalie-rotation">';
    html += '<option value="Alternate"' + (lines.goalieRotation === 'Alternate' ? ' selected' : '') + '>Alternate Games</option>';
    html += '<option value="Balanced"' + (lines.goalieRotation === 'Balanced' ? ' selected' : '') + '>Balanced Minutes</option>';
    html += '<option value="HotHand"' + (lines.goalieRotation === 'HotHand' ? ' selected' : '') + '>Hot Hand</option>';
    html += '</select>';
    html += '</label>';
    html += '<label>Starter: ';
    html += '<select id="starter-goalie">';
    html += '<option value="">-- Select Starter --</option>';
    for (var g = 0; g < goalies.length; g++) {
      var goalie = goalies[g];
      var selected = lines.starterGoalie === goalie.id ? ' selected' : '';
      html += '<option value="' + goalie.id + '"' + selected + '>' + goalie.name + ' (' + goalie.ovr + ' OVR)</option>';
    }
    html += '</select>';
    html += '</label>';
    html += '</div>';
    html += '</div>';
    
    // Available players pool
    html += '<div class="available-players">';
    html += '<h2>Available Players</h2>';
    html += '<div class="player-pool" id="player-pool">';
    
    // Show unassigned runners
    var assignedRunners = getAllAssignedRunners(lines);
    for (var r = 0; r < runners.length; r++) {
      var runner = runners[r];
      if (assignedRunners.indexOf(runner.id) === -1) {
        html += buildPlayerChip(runner);
      }
    }
    
    if (assignedRunners.length === runners.length) {
      html += '<p class="text-muted">All runners assigned to lines</p>';
    }
    
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    
    TL.UI.mount(html);
    
    // Wire up drag and drop
    initializeDragAndDrop();
    
    // Wire up buttons
    document.getElementById('auto-fill-lines').addEventListener('click', function() {
      autoFillLines(div, level);
    });
    
    document.getElementById('clear-lines').addEventListener('click', function() {
      if (confirm('Clear all line assignments?')) {
        clearLines(div, level);
      }
    });
    
    document.getElementById('save-lines').addEventListener('click', function() {
      saveLines(div, level);
    });
    
    document.getElementById('goalie-rotation').addEventListener('change', function() {
      var linesKey = TL.Keys.key(org, div, level);
      TL.GameState.lines[linesKey].goalieRotation = this.value;
    });
    
    document.getElementById('starter-goalie').addEventListener('change', function() {
      var linesKey = TL.Keys.key(org, div, level);
      TL.GameState.lines[linesKey].starterGoalie = this.value;
    });
    
    console.log('Lines Manager rendered:', org, div, level);
  };
  
  /**
   * Build a line card (L1-L4, PP, PK)
   */
  function buildLineCard(lineId, players, lineNum, allRunners, customName) {
    var html = '<div class="line-card" data-line="' + lineId + '">';
    html += '<h3>Line ' + (customName || lineNum) + '</h3>';
    html += '<div class="line-slots">';
    
    // 5 runner slots (Box Lacrosse)
    for (var i = 0; i < 5; i++) {
      var player = players[i];
      var posLabel = POSITIONS[i];
      
      html += '<div class="line-slot" data-position="' + i + '" data-pos-label="' + posLabel + '">';
      html += '<div class="slot-label">' + posLabel + '</div>';
      
      if (player) {
        html += buildPlayerChip(player);
      } else {
        html += '<div class="slot-empty">Drop player here</div>';
      }
      
      html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    return html;
  }
  
  /**
   * Build a draggable player chip
   */
  function buildPlayerChip(player) {
    var html = '<div class="player-chip" draggable="true" data-player-id="' + player.id + '">';
    html += '<span class="player-number">#' + (player.jersey || '??') + '</span>';
    html += '<span class="player-name">' + player.name + '</span>';
    html += '<span class="player-ovr">' + (player.ovr || 50) + '</span>';
    html += '</div>';
    return html;
  }
  
  /**
   * Get all assigned runner IDs
   */
  function getAllAssignedRunners(lines) {
    var assigned = [];
    var lineKeys = ['L1', 'L2', 'L3', 'L4', 'PP', 'PK'];
    for (var i = 0; i < lineKeys.length; i++) {
      var line = lines[lineKeys[i]];
      for (var j = 0; j < line.length; j++) {
        if (line[j] && assigned.indexOf(line[j].id) === -1) {
          assigned.push(line[j].id);
        }
      }
    }
    return assigned;
  }
  
  /**
   * Initialize drag and drop
   */
  function initializeDragAndDrop() {
    var playerChips = document.querySelectorAll('.player-chip');
    var slots = document.querySelectorAll('.line-slot');
    var pool = document.getElementById('player-pool');
    
    // Make player chips draggable
    for (var i = 0; i < playerChips.length; i++) {
      playerChips[i].addEventListener('dragstart', handleDragStart);
      playerChips[i].addEventListener('dragend', handleDragEnd);
    }
    
    // Make slots droppable
    for (var j = 0; j < slots.length; j++) {
      slots[j].addEventListener('dragover', handleDragOver);
      slots[j].addEventListener('drop', handleDrop);
      slots[j].addEventListener('dragleave', handleDragLeave);
    }
    
    // Make pool droppable
    if (pool) {
      pool.addEventListener('dragover', handleDragOver);
      pool.addEventListener('drop', handlePoolDrop);
    }
  }
  
  /**
   * Drag event handlers
   */
  function handleDragStart(e) {
    draggedPlayer = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
  
  function handleDragEnd(e) {
    this.style.opacity = '1';
    // Remove all drag-over classes
    var slots = document.querySelectorAll('.line-slot');
    for (var i = 0; i < slots.length; i++) {
      slots[i].classList.remove('drag-over');
    }
  }
  
  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    var slot = e.currentTarget;
    if (slot.classList.contains('line-slot')) {
      slot.classList.add('drag-over');
    }
    
    return false;
  }
  
  function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }
  
  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    e.preventDefault();
    
    var slot = e.currentTarget;
    slot.classList.remove('drag-over');
    
    if (draggedPlayer) {
      // Remove existing player chip in slot
      var existingChip = slot.querySelector('.player-chip');
      if (existingChip) {
        // Move existing player back to pool
        document.getElementById('player-pool').appendChild(existingChip);
      }
      
      // Remove empty slot message
      var emptyMsg = slot.querySelector('.slot-empty');
      if (emptyMsg) {
        emptyMsg.remove();
      }
      
      // Add dropped player to slot
      slot.appendChild(draggedPlayer);
      
      // Update game state
      updateLinesInGameState();
    }
    
    return false;
  }
  
  function handlePoolDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    e.preventDefault();
    
    if (draggedPlayer && draggedPlayer.parentNode.classList.contains('line-slot')) {
      // Remove from line slot
      var oldSlot = draggedPlayer.parentNode;
      
      // Add back to pool
      document.getElementById('player-pool').appendChild(draggedPlayer);
      
      // Add empty message back to slot
      var emptyMsg = document.createElement('div');
      emptyMsg.className = 'slot-empty';
      emptyMsg.textContent = 'Drop player here';
      oldSlot.appendChild(emptyMsg);
      
      // Update game state
      updateLinesInGameState();
    }
    
    return false;
  }
  
  /**
   * Update lines in game state
   */
  function updateLinesInGameState() {
    // Get current context from the page
    var header = document.querySelector('.lines-header h1');
    if (!header) return;
    
    var headerText = header.textContent;
    var parts = headerText.split(' ');
    var org = parts[1];
    var div = parts[2];
    var level = parts[4];
    
    var linesKey = TL.Keys.key(org, div, level);
    var gs = TL.GameState;
    
    if (!gs.lines[linesKey]) return;
    
    var lineKeys = ['L1', 'L2', 'L3', 'L4', 'PP', 'PK'];
    
    for (var i = 0; i < lineKeys.length; i++) {
      var lineId = lineKeys[i];
      var lineCard = document.querySelector('[data-line="' + lineId + '"]');
      if (!lineCard) continue;
      
      var slots = lineCard.querySelectorAll('.line-slot');
      var lineArray = [];
      
      for (var j = 0; j < slots.length; j++) {
        var chip = slots[j].querySelector('.player-chip');
        if (chip) {
          var playerId = chip.getAttribute('data-player-id');
          var player = findPlayerById(playerId);
          if (player) {
            lineArray.push(player);
          }
        }
      }
      
      gs.lines[linesKey][lineId] = lineArray;
    }
  }
  
  /**
   * Find player by ID
   */
  function findPlayerById(playerId) {
    var gs = TL.GameState;
    return gs.players[playerId] || null;
  }
  
  /**
   * Auto-fill lines with balanced distribution
   */
  function autoFillLines(div, level) {
    var gs = TL.GameState;
    var org = gs.user.org;
    var roster = TL.Selectors.getRoster(org, div, level);
    
    if (!roster || !roster.runners || roster.runners.length < 20) {
      alert('Need at least 20 runners to auto-fill lines');
      return;
    }
    
    var runners = roster.runners.slice(); // Copy array
    
    // Sort by OVR descending
    runners.sort(function(a, b) {
      return (b.ovr || 50) - (a.ovr || 50);
    });
    
    var linesKey = TL.Keys.key(org, div, level);
    
    // Distribute top players across lines (snake draft style)
    gs.lines[linesKey].L1 = [runners[0], runners[7], runners[8], runners[15], runners[16]];
    gs.lines[linesKey].L2 = [runners[1], runners[6], runners[9], runners[14], runners[17]];
    gs.lines[linesKey].L3 = [runners[2], runners[5], runners[10], runners[13], runners[18]];
    gs.lines[linesKey].L4 = [runners[3], runners[4], runners[11], runners[12], runners[19]];
    
    // PP: Best offensive players
    gs.lines[linesKey].PP = [runners[0], runners[1], runners[2], runners[3], runners[4]];
    
    // PK: Best defensive players
    gs.lines[linesKey].PK = [runners[5], runners[6], runners[7], runners[8], runners[9]];
    
    // Re-render
    TL.UI.renderLines(div, level);
    
    alert('Lines auto-filled with balanced distribution!');
  }
  
  /**
   * Clear all lines
   */
  function clearLines(div, level) {
    var gs = TL.GameState;
    var org = gs.user.org;
    var linesKey = TL.Keys.key(org, div, level);
    
    gs.lines[linesKey] = {
      L1: [], L2: [], L3: [], L4: [],
      PP: [], PK: [],
      goalieRotation: gs.lines[linesKey].goalieRotation,
      starterGoalie: gs.lines[linesKey].starterGoalie
    };
    
    TL.UI.renderLines(div, level);
  }
  
  /**
   * Save lines
   */
  function saveLines(div, level) {
    updateLinesInGameState();
    alert('Lines saved successfully!');
  }
  
  console.log('✅ UILines loaded');
})();
