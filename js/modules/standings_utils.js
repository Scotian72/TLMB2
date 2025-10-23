
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  function record(table, team, gf, ga, w){
    table[team] = table[team] || {W:0,L:0,GF:0,GA:0,PTS:0,GP:0, H2H:{}};
    table[team].GF += gf; table[team].GA += ga; table[team].GP += 1;
    if(w){ table[team].W += 1; table[team].PTS += 2; } else { table[team].L += 1; }
  }
  TL.StandingsUtil = {
    ensure:function(div,lvl){ TL.GameState.standings[div] = TL.GameState.standings[div] || {A:{},B:{}}; return TL.GameState.standings[div][lvl] = TL.GameState.standings[div][lvl] || {}; },
    recordGame:function(div,lvl,home,away,homeGF,awayGF){
      var table = this.ensure(div,lvl);
      record(table, home, homeGF, awayGF, homeGF>awayGF);
      record(table, away, awayGF, homeGF, awayGF>homeGF);
      table[home].H2H[away] = (table[home].H2H[away]||0) + (homeGF>awayGF?1:0);
      table[away].H2H[home] = (table[away].H2H[home]||0) + (awayGF>homeGF?1:0);
    },
    sorted:function(div,lvl){
      var t=this.ensure(div,lvl), rows=Object.keys(t).map(function(k){ var r=t[k]; return {team:k, W:r.W||0, L:r.L||0, GF:r.GF||0, GA:r.GA||0, PTS:r.PTS||0, GP:r.GP||0, H2H:r.H2H||{}}; });
      rows.sort(function(a,b){
        if(b.PTS!==a.PTS) return b.PTS-a.PTS;
        var wpA = a.GP>0? a.W/a.GP : 0, wpB = b.GP>0? b.W/b.GP : 0;
        if(wpB!==wpA) return wpB-wpA;
        var diffA = a.GF-a.GA, diffB=b.GF-b.GA;
        if(diffB!==diffA) return diffB-diffA;
        var h2h = (a.H2H[b.team]||0) - (b.H2H[a.team]||0);
        if(h2h!==0) return -h2h;
        return (a.team<b.team)?-1:1;
      });
      return rows;
    },
    topN:function(div,lvl,n){ return this.sorted(div,lvl).slice(0,n); }
  };
})();