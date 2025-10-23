
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UILines = { show:function(){
    var root=document.getElementById('root');
    root.insertAdjacentHTML('beforeend','<div class="panel"><h3>Lines</h3><div>goalie rotation <select id="rotMode"><option>Alternate</option><option>Hot Hand</option><option>Starter Heavy</option></select></div></div>');
    var el=document.getElementById('rotMode'); el.value=(TL.GameState.lines && TL.GameState.lines.mode)||'Alternate';
    el.addEventListener('change', function(){ TL.GameState.lines = TL.GameState.lines||{}; TL.GameState.lines.mode=this.value; });
  }};
})();