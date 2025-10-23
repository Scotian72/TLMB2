
window.TallyLax = window.TallyLax || {};
(function(TL){
  TL.Diagnostics = { run: function(){
      var res = { version: 'v108.3b', checks: [] };
      try{
        var log = (TL.GameState && TL.GameState.gameLog) || [];
        var slice = log.slice(-200);
        var ha = {home:0, away:0}; slice.forEach(function(g){ if(g && g.result){ ha.home++; ha.away++; }});
        res.checks.push({name:'Home/Away entries count (per game both sides)', value: ha});
        var gm = TL.GoalieManager && TL.GoalieManager._rot, fatigueSamples=0, fatigueNonZero=0;
        if(gm){ Object.keys(gm).forEach(function(k){ var f=gm[k].fatigue||{}; Object.keys(f).forEach(function(pid){ fatigueSamples++; if((f[pid]||0)>0) fatigueNonZero++; }); }); }
        res.checks.push({name:'Goalie fatigue tracked', value: {samples:fatigueSamples, nonZero:fatigueNonZero}});
        var news = (TL.GameState && TL.GameState.news) || []; res.checks.push({name:'News entries (recent)', value: news.slice(0,5)});
        var teams = TL.TeamList || []; res.checks.push({name:'Teams count', value: teams.length});
        return res;
      }catch(e){ return { error: String(e) }; }
  }};
})(window.TallyLax);
