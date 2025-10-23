
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UILeaders = {
    show:function(){
      var root=document.getElementById('root');
      function collectTop(key){
        var out=[], ORGS=TL.Constants.ORGS, DIVS=['U11','U13','U15','U17'];
        DIVS.forEach(function(div){
          ORGS.forEach(function(org){
            ['A','B'].forEach(function(lvl){
              var ros = TL.OpponentManager.ensureRoster(org, div, lvl);
              ros.filter(function(p){return p.position!=='Goalie';}).forEach(function(pl){
                var s=pl.seasonStats||{}; var val=s[key]||0;
                if(key==='Pts') val=(s.G||0)+(s.A||0);
                if(key==='FO%') val=(s.FO>0? (s.FOW||0)/s.FO*100 : 0);
                out.push({name:pl.name, level:div+lvl, val:val});
              });
            });
          });
        });
        return out.sort(function(a,b){return (b.val||0)-(a.val||0)}).slice(0,10);
      }
      function goalieTop(key){
        var out=[], ORGS=TL.Constants.ORGS, DIVS=['U11','U13','U15','U17'];
        DIVS.forEach(function(div){
          ORGS.forEach(function(org){
            ['A','B'].forEach(function(lvl){
              var ros = TL.OpponentManager.ensureRoster(org, div, lvl);
              ros.filter(function(p){return p.position==='Goalie';}).forEach(function(gk){
                var s=gk.seasonGoalie||{}; var v=0;
                if(key==='SV%') v=(s.SA>0? (s.SV||0)/s.SA*100 : 100);
                if(key==='GAA') v=(s.GP>0? (s.GA||0)/s.GP : 0);
                if(key==='QS') v=(s.QS||0);
                out.push({name:gk.name, level:div+lvl, val:v});
              });
            });
          });
        });
        return out.sort(function(a,b){return (b.val||0)-(a.val||0)}).slice(0,10);
      }
      function table(title,key,goalie){
        var rows=(goalie?goalieTop(key):collectTop(key)).map(function(r){ return '<tr><td>'+r.name+'</td><td>'+r.level+'</td><td class="mono">'+(typeof r.val==='number'? r.val.toFixed((key==='GAA')?2:1) : r.val)+'</td></tr>'; }).join('');
        return '<div class="card"><h4>'+title+'</h4><table class="table"><thead><tr><th>Name</th><th>Level</th><th>'+key+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
      }
      var html='<div class="panel"><h3>Leaders — Skaters</h3><div class="hlist" style="flex-wrap:wrap">'+
        table('Goals','G') + table('Points','Pts') + table('Ground Balls','GB') + table('Caused TO','CTO') + table('Faceoff %','FO%') +
        '</div></div><div class="panel"><h3>Leaders — Goalies</h3><div class="hlist" style="flex-wrap:wrap">'+
        table('Save %','SV%',true) + table('GAA','GAA',true) + table('Quality Starts','QS',true) +
        '</div></div>';
      root.insertAdjacentHTML('beforeend', html);
    }
  };
})();