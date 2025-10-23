
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UIPlayoffs = {
    show:function(){
      if(!TL.GameState.playoffs || !TL.GameState.playoffs.rounds) return;
      var keys=Object.keys(TL.GameState.playoffs.rounds); if(keys.length===0) return;
      var root=document.getElementById('root');
      var html='<div class="panel"><h3>Playoffs</h3><div class="hlist">';
      keys.forEach(function(k){
        var R=TL.GameState.playoffs.rounds[k], champ=R.champ?(' - <span class="badge">'+R.champ+'</span>'):'';
        html+='<div class="card"><div><strong>'+k+'</strong>'+champ+'</div><div class="hlist" style="margin-top:6px"><button class="btn" data-action="advPO" data-param="'+k+'">Advance '+k+'</button></div></div>';
      });
      html+='</div><div class="muted">QF → SF → Final. Press Advance to simulate rounds.</div></div>';
      root.insertAdjacentHTML('beforeend', html);
    }
  };
})();