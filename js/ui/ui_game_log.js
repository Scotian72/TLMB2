
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UIGameLog = {
    show:function(){
      var root=document.getElementById('root');
      var recent = TL.GameState.gameLog.slice(-6).reverse();
      var html='<div class="panel"><h3>Game Log</h3><div class="hlist" style="flex-wrap:wrap">'
        + recent.map(function(g){
          return '<div class="card"><div><strong>'+g.awayOrg+' @ '+g.homeOrg+'</strong> ('+g.division+g.teamLevel+')</div>' +
          '<div class="muted">Final '+g.result.home+'-'+g.result.away+'</div>' +
          '<div class="muted">Goalies: H SA '+g.boxscore.away.SA+', GA '+g.boxscore.away.GA+', SV% '+(g.boxscore.home.svpct*100).toFixed(1)+
          ' — A SA '+g.boxscore.home.SA+', GA '+g.boxscore.home.GA+', SV% '+(g.boxscore.away.svpct*100).toFixed(1)+
          ' | QS/RBS H '+g.boxscore.home.QS+'/'+g.boxscore.home.RBS+' A '+g.boxscore.away.QS+'/'+g.boxscore.away.RBS+'</div></div>';
        }).join('')
        + '</div></div>';
      root.insertAdjacentHTML('beforeend', html);
    }
  };
})();