
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UIStandings = {
    show:function(){
      var root=document.getElementById('root'); var div='U13', lvl='A';
      var rows = TL.StandingsUtil.sorted(div,lvl);
      var html='<div class="panel"><h3>Standings '+div+lvl+' (PTS • W • GF • GA)</h3><div class="scroll"><table class="table"><thead><tr><th>#</th><th>Team</th><th>PTS</th><th>W</th><th>GF</th><th>GA</th></tr></thead><tbody>'
        + rows.map(function(x,i){ return '<tr><td>'+(i+1)+'</td><td><a class="link" data-action="openTeam" data-param="'+x.team+'|'+div+'|'+lvl+'">'+x.team+'</a></td><td>'+x.PTS+'</td><td>'+x.W+'</td><td>'+x.GF+'</td><td>'+x.GA+'</td></tr>'; }).join('')
        + '</tbody></table></div></div>';
      root.insertAdjacentHTML('beforeend', html);
    }
  };
})();