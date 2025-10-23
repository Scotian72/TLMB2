
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.Playoffs = {
    start:function(){
      var D=TL.Constants.DIVISIONS, L=['A','B'];
      TL.GameState.playoffs = { started:true, rounds:{} };
      for(var d=0; d<D.length; d++){
        for(var li=0; li<L.length; li++){
          var div=D[d], lvl=L[li];
          var seeds = TL.StandingsUtil.topN(div,lvl,8);
          if(seeds.length<8) continue;
          TL.GameState.playoffs.rounds[div+lvl] = {
            qf: [
              {home:seeds[0].team, away:seeds[7].team},
              {home:seeds[3].team, away:seeds[4].team},
              {home:seeds[2].team, away:seeds[5].team},
              {home:seeds[1].team, away:seeds[6].team}
            ],
            sf: [], f: [], champ:null
          };
        }
      }
    },
    advanceRound:function(key){
      var R = TL.GameState.playoffs && TL.GameState.playoffs.rounds && TL.GameState.playoffs.rounds[key]; if(!R) return;
      if(R.qf && R.sf.length===0){
        var winners=[]; for(var i=0;i<R.qf.length;i++){ var g=this._play(key,R.qf[i].home,R.qf[i].away); winners.push(g.winner); }
        R.sf=[{home:winners[0],away:winners[1]},{home:winners[2],away:winners[3]}]; return;
      }
      if(R.sf && R.f.length===0){
        var winners=[]; for(var j=0;j<R.sf.length;j++){ var g=this._play(key,R.sf[j].home,R.sf[j].away); winners.push(g.winner); }
        R.f=[{home:winners[0],away:winners[1]}]; return;
      }
      if(R.f && R.f.length>0 && !R.champ){ var g=this._play(key,R.f[0].home,R.f[0].away); R.champ=g.winner; }
    },
    _play:function(key, homeOrg, awayOrg){
      var div = key.slice(0,3), lvl = key.slice(3);
      var day = TL.GameState.day;
      var g={ id:'po_'+key+'_'+day+'_'+homeOrg+'_'+awayOrg, day:day, division:div, teamLevel:lvl, homeOrg:homeOrg, awayOrg:awayOrg, status:'scheduled' };
      TL.OpponentManager.ensureRoster(homeOrg, div, lvl);
      TL.OpponentManager.ensureRoster(awayOrg, div, lvl);
      g = TL.GameSimulator.simulateGame(g);
      TL.GameState.gameLog.push(g);
      TL.StandingsUtil.recordGame(div,lvl, g.homeOrg, g.awayOrg, g.result.home, g.result.away);
      TL.GameState.news.unshift({title:'Playoffs '+div+lvl, body: homeOrg+' vs '+awayOrg+' • FINAL '+g.result.home+'-'+g.result.away});
      return { id:g.id, winner:(g.result.home>g.result.away? g.homeOrg : g.awayOrg) };
    }
  };
})();