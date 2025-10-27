(function(){
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};

  // Lightweight mount helper
  TL.UI.mount = function(html){
    var root = document.getElementById('main-content') || document.getElementById('app') || document.getElementById('panel-main') || document.body;
    root.innerHTML = html;
  };

  // Render the Setup screen
  TL.UI.renderSetup = function(){
    // Get teams from the correct location
    var teams = (window.TL && TL.Teams) ? TL.Teams : {};
    var teamsArray = Object.keys(teams);
    
    var currentOrg = (TL.GameState && TL.GameState.user && TL.GameState.user.org) || teamsArray[0] || 'Hawks';
    var currentName = (TL.GameState && TL.GameState.user && TL.GameState.user.name) || '';

    function teamButton(org, team){
      var selected = (org === currentOrg) ? ' selected' : '';
      var logo = (team && team.logo) || 'assets/logos/TLM_256.webp';
      var name = (team && (team.mascot || team.name || org)) || org;
      return [
        '<button class="team-card team-btn'+selected+'" data-action="select-team" data-team="'+org+'">',
          '<img class="team-logo-small" alt="'+org+'" src="'+logo+'">',
          '<div class="team-name-small">'+name+'</div>',
        '</button>'
      ].join('');
    }

    var teamsHtml = teamsArray.map(function(org){
      return teamButton(org, teams[org]);
    }).join('');

    var headerHtml = [
      '<header class="tlm-topbar">',
        '<div class="tlm-left"><img src="assets/logos/TLM_256.webp" alt="TLM" class="tlm-logo-top"></div>',
        '<h1 class="tlm-title">TallyLax Youth Box Lacrosse Manager</h1>',
      '</header>'
    ].join('');

    var pageHtml = [
      headerHtml,
      '<section class="screen-select-team">',
        '<div class="team-side">',
          '<h1 class="screen-title">Choose Your Organization</h1>',
          '<div class="team-grid" data-role="team-buttons">', teamsHtml, '</div>',
        '</div>',
        '<aside class="signup-panel" id="signup-panel">',
          '<h2>President Details</h2>',
          '<label class="field"><span>President Name</span>',
            '<input type="text" id="president-name" autocomplete="name" placeholder="Your name" value="'+(currentName||'')+'" maxlength="30">',
          '</label>',
          '<button class="btn-primary btn-large" id="btn-accept">Accept & Start</button>',
          '<p class="signup-hint">Org: <span id="orgPreview">'+currentOrg+'</span></p>',
        '</aside>',
      '</section>'
    ].join('');

    TL.UI.mount(pageHtml);

    // Wire team selection
    var grid = document.querySelector('[data-role="team-buttons"]');
    if (grid){
      grid.addEventListener('click', function(e){
        var btn = e.target.closest('.team-btn');
        if (!btn) return;
        var org = btn.getAttribute('data-team');
        // Update selected state
        Array.prototype.forEach.call(grid.querySelectorAll('.team-btn.selected'), function(b){ b.classList.remove('selected'); });
        btn.classList.add('selected');
        // Update preview
        var nameEl = document.getElementById('orgPreview');
        if (nameEl) nameEl.textContent = org;
        if (TL.Router && TL.Router.route) {
          TL.Router.route('select-team', org, null);
        }
      });
    }

    // Accept & Start button
    var accept = document.getElementById('btn-accept');
    if (accept){
      accept.addEventListener('click', function(){
        var org = (document.getElementById('orgPreview')||{}).textContent || currentOrg;
        var name = (document.getElementById('president-name')||{}).value || '';
        if (!TL.GameState) TL.GameState = { user: {} };
        TL.GameState.user.org = org;
        TL.GameState.user.name = name;
        if (TL.Router && TL.Router.route) {
          TL.Router.route('start-game', null, null);
        }
      });
    }
    
    console.log('✅ Setup screen rendered with', teamsArray.length, 'teams');
  };
})();
