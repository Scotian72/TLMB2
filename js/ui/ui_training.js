
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UITraining = {
    open:function(){
      var org=(TL.GameState.user&&TL.GameState.user.org)||TL.Constants.ORGS[0];
      var div='U13', lvl='A';
      var ros=TL.OpponentManager.ensureRoster(org, div, lvl);
      var budget=100;
      var rows=ros.slice(0,18).map(function(p){
        return '<tr data-pid="'+p.id+'"><td>'+p.name+'</td>'+
               '<td><input type="number" class="input drill" data-k="cond" min="0" max="20" value="0"/></td>'+
               '<td><input type="number" class="input drill" data-k="stick" min="0" max="20" value="0"/></td>'+
               '<td><input type="number" class="input drill" data-k="faceoff" min="0" max="20" value="0"/></td>'+
               '<td><input type="number" class="input drill" data-k="goalie" min="0" max="20" value="'+(p.position==='Goalie'?2:0)+'"/></td>'+
               '</tr>';
      }).join('');
      var html='<div class="modal" id="campModal"><div class="sheet">'+
        '<h3>Training Camp — '+org+' '+div+lvl+'</h3>'+
        '<div class="muted">Distribute up to <strong id="campBudget">'+budget+'</strong> points across drills.</div>'+
        '<table class="grid"><thead><tr><th>Player</th><th>Conditioning</th><th>Stick Skills</th><th>Faceoffs</th><th>Goalie Reaction</th></tr></thead><tbody>'+rows+'</tbody></table>'+
        '<div class="flex" style="margin-top:8px"><button class="btn" data-action="runCamp">Run Camp</button><span class="right"></span><button class="btn" data-action="closeCamp">Close</button></div>'+
      '</div></div>';
      document.body.insertAdjacentHTML('beforeend', html);
      function updateBudget(){
        var pts=0; document.querySelectorAll('#campModal .drill').forEach(function(i){ pts += parseInt(i.value||'0',10)||0; });
        document.getElementById('campBudget').textContent = Math.max(0, budget-pts);
      }
      document.querySelectorAll('#campModal .drill').forEach(function(i){ i.addEventListener('input', updateBudget); });
    }
  };
  document.addEventListener('click', function(e){
    var el=e.target.closest('[data-action]'); if(!el) return;
    var TLx=window.TallyLax;
    if(el.getAttribute('data-action')==='runCamp'){
      var org=(TLx.GameState.user&&TLx.GameState.user.org)||TLx.Constants.ORGS[0];
      var div='U13', lvl='A';
      var ros=TLx.OpponentManager.ensureRoster(org,div,lvl);
      var lines=[]; // narrative lines
      document.querySelectorAll('#campModal tbody tr').forEach(function(row){
        var pid=row.getAttribute('data-pid');
        var p=ros.find(function(x){return x.id===pid}); if(!p) return;
        var cond=parseInt(row.querySelector('[data-k="cond"]').value||'0',10)||0;
        var stick=parseInt(row.querySelector('[data-k="stick"]').value||'0',10)||0;
        var face=parseInt(row.querySelector('[data-k="faceoff"]').value||'0',10)||0;
        var goalie=parseInt(row.querySelector('[data-k="goalie"]').value||'0',10)||0;
        var delta = Math.min(3, Math.floor((cond+stick+face+goalie)/15)); // small durable bump
        if(delta>0){ p.ovr = Math.min(99, (p.ovr||50)+delta); p.devLog=p.devLog||[]; p.devLog.push('Camp +'+delta+' OVR from focused drills'); }
        // morale swing
        if((cond+stick+face+goalie)>10){ p.morale=Math.min(99,(p.morale||70)+1); } else { p.morale=Math.max(30,(p.morale||70)-1); }
        // parent morale note
        if(delta>=2){ p.parentMorale=Math.min(99,(p.parentMorale||70)+1); }
        // tiny injury chance if > 18 points on a single player
        if((cond+stick+face+goalie)>=18 && Math.random()<0.04 && (!p.injury)){ p.injury={type:'camp knock', days: int(2+Math.random()*4)}; }
        lines.push(p.name+' worked '+(delta>0?('well (+%d OVR)'%delta):'hard')+'.');
      });
      TLx.GameState.news.unshift({title:'Training Camp Complete', body: lines.slice(0,6).join(' ')});
      alert('Camp complete. Development logs updated.');
    }
    else if(el.getAttribute('data-action')==='closeCamp'){
      var m=document.getElementById('campModal'); if(m) m.remove();
    }
  });
})();