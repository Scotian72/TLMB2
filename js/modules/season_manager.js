
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{}; var K=TL.Constants;
  TL.SeasonManager = {
    startNewSeason:function(seed){
      if(seed){ TL.RNG.seed = 123456; }
      TL.GameState.day = 1;
      TL.GameState.gameLog = [];
      TL.GameState.news = [];
      TL.GameState.standings = {};
      TL.GameState.playoffs = { started:false, rounds:{} };
      // seed user division players
      ['U11','U13','U15','U17'].forEach(function(div){
        var arr=[]; for(var i=0;i<22;i++){ arr.push(TL.PlayerGen.make({div:div,lvl:(i<11?'A':'B')})); }
        TL.GameState.divisions[div].players = arr;
      });
      TL.GameState.news.unshift({title:'Camp Opens', body:'Orientation complete. Captains named; jerseys assigned.'});
    },
    advanceDay:function(){
      var d = TL.GameState.day;
      var ph = TL.ScheduleSystem.phase(d);
      if(ph==='camp'){
        TL.UITrainingCamp.runDay(d);
        TL.GameState.day = d+1; TL.DevelopmentSystem.tickDay(); TL.NewsGen.daily(); if(TL.GameState.day%7===1){ TL.NewsGen.weekly(); }
      } else if(ph==='season'){
        // create a light slate: each division+level 4 games per day among ORGS
        K.DIVISIONS.forEach(function(div){
          ['A','B'].forEach(function(lvl){
            var orgs = K.Constants? K.Constants.ORGS : TL.Constants.ORGS;
          });
        });
        // schedule: pair sequential orgs
        for(var di=0; di<K.DIVISIONS.length; di++){
          var div=K.DIVISIONS[di];
          ['A','B'].forEach(function(lvl){
            var O=K.ORGS.slice();
            for(var i=0;i<O.length;i+=2){
              var home=O[i], away=O[(i+1)%O.length];
              var g={ id:'g_'+d+'_'+div+'_'+lvl+'_'+home+'_'+away, day:d, division:div, teamLevel:lvl, homeOrg:home, awayOrg:away, status:'scheduled'};
              TL.GameSimulator.simulateGame(g);
              TL.GameState.gameLog.push(g);
              TL.StandingsUtil.recordGame(div,lvl, g.homeOrg, g.awayOrg, g.result.home, g.result.away);
            }
            O.push(O.shift());
          });
        }
        TL.GameState.news.unshift({title:'Gameday '+d, body:'Full slate complete.'});
        TL.GameState.day = d+1; TL.DevelopmentSystem.tickDay(); TL.NewsGen.daily(); if(TL.GameState.day%7===1){ TL.NewsGen.weekly(); }
        if (TL.ScheduleSystem.phase(TL.GameState.day)==='playoffs' && !(TL.GameState.playoffs && TL.GameState.playoffs.started)) { TL.Playoffs.start(); }
      } else {
        // playoffs phase: user advances via UI Playoffs panel
        TL.GameState.day = d+1;
      }
    }
  };
})();