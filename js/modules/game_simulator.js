
;(function(){ 'use strict';
  // Forecheck tweak helpers
  var _cfg = (window.TallyLax&&window.TallyLax.GameState&&window.TallyLax.GameState.config)||{};
  var _fore = _cfg.forecheck || 'Standard';
  function _tweakShots(x){ return Math.round(x * (_fore==='Aggressive'?1.03:(_fore==='Conservative'?0.98:1.00))); }
  function _tweakTurnovers(x){ return Math.round(x * (_fore==='Aggressive'?1.02:(_fore==='Conservative'?0.98:1.00))); }
  var TL=window.TallyLax=window.TallyLax||{};
  TL.GameSimulator = {
    simulateGame:function(g){
      var home = TL.OpponentManager.ensureRoster(g.homeOrg, g.division, g.teamLevel);
      var away = TL.OpponentManager.ensureRoster(g.awayOrg, g.division, g.teamLevel);
      function makeLineup(org,div,lvl, roster){
        var runners=roster.filter(function(p){return p.position!=='Goalie';});
        var mode = (TL.GameState.lines && TL.GameState.lines.mode) || 'Alternate';
        var startId = TL.GoalieManager.pickStarter(org,div,lvl, mode);
        var gk = roster.find(function(p){return p.id===startId;}) || roster.find(function(p){return p.position==='Goalie';}) || {name:'Emergency G', ovr:50, id:'g_x'};
        return { runners:runners.slice(0,10), goalie:gk };
      }
      var LUh = makeLineup(g.homeOrg, g.division, g.teamLevel, home), LUa = makeLineup(g.awayOrg, g.division, g.teamLevel, away);
      function simShots(str){ var base = 30 + Math.round((str-50)/2) + Math.floor((TL.RNG.rand()-0.5)*8); return Math.max(18, Math.min(55, base)); }
      var sh = simShots(48), sa = simShots(48);
      var saveHome = 0.6 + (LUh.goalie.ovr-50)/200, saveAway= 0.6 + (LUa.goalie.ovr-50)/200;
      var gh = Math.max(0, Math.round(sh*(1-saveAway)*0.55) + TL.RNG.int(0,3));
      var ga = Math.max(0, Math.round(sa*(1-saveHome)*0.55) + TL.RNG.int(0,3));
      function distrib(runners, goals, shots){
        var list=[], i;
        for(i=0;i<shots;i++){ var s=TL.RNG.pick(runners); s.gameStats=s.gameStats||{}; s.gameStats.S=(s.gameStats.S||0)+1;
          s.gameStats.GB=(s.gameStats.GB||0) + (TL.RNG.int(0,4)==0?1:0);
          s.gameStats.CTO=(s.gameStats.CTO||0) + (TL.RNG.int(0,12)==0?1:0);
          s.gameStats.BLK=(s.gameStats.BLK||0) + (TL.RNG.int(0,14)==0?1:0);
          s.gameStats.TO=(s.gameStats.TO||0) + (TL.RNG.int(0,10)==0?1:0);
        }
        for(i=0;i<goals;i++){ var shooter=TL.RNG.pick(runners), assist=TL.RNG.pick(runners); if(assist.id===shooter.id) assist=null;
          shooter.gameStats.G=(shooter.gameStats.G||0)+1; if(assist){ assist.gameStats.A=(assist.gameStats.A||0)+1; }
          list.push({ pid: shooter.id, G:1, A: assist?1:0, S:TL.RNG.int(1,7), GB:0, CTO:0, PIM:0 });
        }
        // faceoffs
        var taker=TL.RNG.pick(runners), FO=TL.RNG.int(10,40), FOW=TL.RNG.int(int(FO*0.35), int(FO*0.65));
        taker.gameStats.FO=(taker.gameStats.FO||0)+FO; taker.gameStats.FOW=(taker.gameStats.FOW||0)+FOW;
        runners.forEach(function(p){
          p.seasonStats=p.seasonStats||{GP:0}; p.seasonStats.GP+=1;
          for(var k in p.gameStats){ p.seasonStats[k]=(p.seasonStats[k]||0)+p.gameStats[k]; }
          p.gameStats={};
        });
        return list;
      }
      var boxH = distrib(LUh.runners, gh, sh), boxA=distrib(LUa.runners, ga, sa);
      var sva = (sh>0)? (sh - ga)/sh : 1.0, svh = (sa>0)? (sa - gh)/sa : 1.0;
      function goalieMarks(sa,ga){ var svpct = (sa>0)? (sa-ga)/sa : 1.0; return { QS: (svpct>=0.915 || ga<=2)?1:0, RBS: (ga>=5 && svpct<=0.850)?1:0 }; }
      var gmH = goalieMarks(sa, gh), gmA=goalieMarks(sh, ga);
      g.status='final'; g.result={home: gh, away: ga};
      g.boxscore={
        home:{goalie:LUh.goalie.id, players:boxH, team:{S:sh}, svpct:sva, SA:sh, GA:ga, QS:gmA.QS, RBS:gmA.RBS},
        away:{goalie:LUa.goalie.id, players:boxA, team:{S:sa}, svpct:svh, SA:sa, GA:gh, QS:gmH.QS, RBS:gmH.RBS}
      };
      // season goalie booking
      function book(roster, gid, SA, GA, QS, RBS){
        var gk = roster.find(function(p){return p.id===gid;}); if(!gk) return;
        gk.seasonGoalie = gk.seasonGoalie || {GP:0,GS:0,TOI:0,SA:0,SV:0,GA:0,SO:0,QS:0,RBS:0};
        gk.seasonGoalie.GP += 1; gk.seasonGoalie.GS += 1;
        gk.seasonGoalie.SA += SA; gk.seasonGoalie.GA += GA; gk.seasonGoalie.SV += Math.max(0, SA-GA);
        gk.seasonGoalie.QS += QS; gk.seasonGoalie.RBS += RBS;
      }
      book(home, LUh.goalie.id, sh, ga, gmA.QS, gmA.RBS);
      book(away, LUa.goalie.id, sa, gh, gmH.QS, gmH.RBS);
      TL.GoalieManager.recordGA(g.homeOrg, g.division, g.teamLevel, LUh.goalie.id, ga);
      TL.GoalieManager.recordGA(g.awayOrg, g.division, g.teamLevel, LUa.goalie.id, gh);
      return g;
    }
  };
})();