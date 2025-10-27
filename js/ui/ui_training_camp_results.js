(function(){
  'use strict';
  var TL = window.TL = window.TL || {};

  function ensurePanel(){
    var el = document.getElementById('camp-results');
    if (!el) {
      el = document.createElement('div');
      el.id = 'camp-results';
      el.className = 'camp-results-panel';
      var host = document.getElementById('main') || document.body;
      host.appendChild(el);
    }
    return el;
  }

  function render(payload){
    var el = ensurePanel();
    var html = '<h3>Training Camp Results - Day ' + payload.day + '</h3>';
    html += '<div class="camp-results-list">';
    (payload.games || []).forEach(function(g){
      html += '<div class="camp-game">';
      html += '<div><strong>' + (g.orgId||'Org') + ' ' + (g.division||'Div') + '</strong></div>';
      html += '<div>'+ (g.homeId||'Home') +' <b>'+ (g.result && g.result.home || 0) +'</b> - ';
      html += '<b>'+ (g.result && g.result.away || 0) +'</b> '+ (g.awayId||'Away') +'</div>';
      html += '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  if (TL.EventBus && TL.EventBus.on){
    TL.EventBus.on('CampScrimmageCompleted', render);
  }
})();