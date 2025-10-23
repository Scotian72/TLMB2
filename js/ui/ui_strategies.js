
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UIStrategies = {
    show:function(){
      var root=document.getElementById('root');
      var cfg=TL.GameState.config=TL.GameState.config||{};
      var gk = cfg.goalieMode || 'Balanced';
      var fore = cfg.forecheck || 'Standard';
      var html='<div class="panel"><h3>Team Strategies</h3>'+
        '<div class="grid-cards">'+
        '<div class="card"><div><strong>Goalie Rotation</strong></div>'+
        '<div class="muted">How starts are allocated.</div>'+
        '<div class="flex"><label><input type="radio" name="gkm" value="Balanced" '+(gk==='Balanced'?'checked':'')+'> Balanced</label>'+
        '<label><input type="radio" name="gkm" value="Hot Hand" '+(gk==='Hot Hand'?'checked':'')+'> Hot Hand</label>'+
        '<label><input type="radio" name="gkm" value="Starter Heavy" '+(gk==='Starter Heavy'?'checked':'')+'> Starter Heavy</label></div></div>'+
        '<div class="card"><div><strong>Forecheck</strong></div>'+
        '<div class="muted">Affects shots/turnovers balance slightly.</div>'+
        '<select id="foreSel" class="input"><option '+(fore==='Standard'?'selected':'')+'>Standard</option><option '+(fore==='Aggressive'?'selected':'')+'>Aggressive</option><option '+(fore==='Conservative'?'selected':'')+'>Conservative</option></select>'+
        '</div>'+
        '</div>'+
        '<div class="flex" style="margin-top:8px"><button class="btn" data-action="saveStrategies">Save</button></div></div>';
      root.insertAdjacentHTML('beforeend', html);
    }
  };
  document.addEventListener('click', function(e){
    var el=e.target.closest('[data-action]'); if(!el) return;
    if(el.getAttribute('data-action')==='saveStrategies'){
      var gks = document.querySelector('input[name="gkm"]:checked'); var fore=document.getElementById('foreSel');
      var cfg=TL.GameState.config=TL.GameState.config||{};
      if(gks) cfg.goalieMode=gks.value;
      if(fore) cfg.forecheck=fore.value;
      if(window.alert) alert('Strategies saved: '+cfg.goalieMode+' / '+cfg.forecheck);
    }
  });
})();