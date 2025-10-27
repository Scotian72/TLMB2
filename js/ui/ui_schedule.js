(function () {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.UI = TL.UI || {};

  TL.UI.showSchedule = function (div, level) { this.renderSchedule(div, level); };

  TL.UI.renderSchedule = function (div, level) {
    var mount = document.getElementById('main-content') || document.body;
    var org = TL.GameState && TL.GameState.user && TL.GameState.user.org || 'Ravens';
    var games = (TL.Selectors && TL.Selectors.getSchedule && TL.Selectors.getSchedule(org, div, level)) || [];
    mount.innerHTML = '<div id=\"sched-filter\"></div><div id=\"sched-list\"></div>';
    this.renderDivLevelSelector(div, level, document.getElementById('sched-filter'));
    var list = games.map(function(g){ return '<li>Day '+g.day+': '+g.home+' vs '+g.away+' @ '+(g.venue||'TBD')+'</li>'; }).join('');
    document.getElementById('sched-list').innerHTML = '<ul>'+(list || '<li>No games scheduled.</li>')+'</ul>';
  };

  TL.UI.renderDivLevelSelector = function (div, level, mount) {
    if (!mount) return;
    var html = ''+
    '<label>Division <select id=\"sched-div\">'+ ['U9','U11','U13','U15','U17'].map(function(d){return '<option '+(d===div?'selected':'')+'>'+d+'</option>';}).join('') +'</select></label>'+
    '<label>Level <select id=\"sched-lvl\">'+ ['A','B'].map(function(L){return '<option '+(L===level?'selected':'')+'>'+L+'</option>';}).join('') +'</select></label>'+
    '<button id=\"sched-go\">Go</button>';
    mount.innerHTML = html;
    mount.querySelector('#sched-go').addEventListener('click', function(){
      var nd = mount.querySelector('#sched-div').value;
      var nl = mount.querySelector('#sched-lvl').value;
      if (TL.Router && TL.Router.route) TL.Router.route('schedule', nd, nl);
    });
  };
  
  console.log('✅ UISchedule loaded');
})();