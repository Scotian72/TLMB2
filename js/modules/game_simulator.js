

// === Additive: Scrimmage Simulator ===
(function(){
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.Modules = TL.Modules || {};
  TL.Modules.GameSim = TL.Modules.GameSim || {};

  function rndInt(min,max){
    var r = (TL.RNG && TL.RNG.random) ? TL.RNG.random() : Math.random();
    return Math.floor(r*(max-min+1))+min;
  }

  TL.Modules.GameSim.simulateScrimmage = function(game){
    var GS = TL.GameState;
    GS.results = GS.results || [];
    GS.playerStats = GS.playerStats || {};
    var homeId = game.homeId, awayId = game.awayId;

    // Simple scoring model uses lines/overall
    function teamScore(teamId){
      var roster = (GS.rosters && GS.rosters[teamId]) || [];
      var ov = roster.reduce(function(s,pid){ var pl=GS.players[pid]||{}; return s + (pl.overall||30); },0) / Math.max(1,roster.length);
      var base = Math.round((ov-20)/5); // rough scale
      return Math.max(3, rndInt(base, base+10));
    }

    var homeScore = teamScore(homeId);
    var awayScore = teamScore(awayId);

    // assign simple per-player stats
    function assignStats(teamId, goals){
      var roster = (GS.rosters && GS.rosters[teamId]) || [];
      if (roster.length === 0) return;
      // random distribute goals to runners
      var runners = roster.filter(function(pid){ return (GS.players[pid]||{}).pos !== 'G'; });
      for (var g=0; g<goals; g++){
        var scorer = runners[rndInt(0, Math.max(0, runners.length-1))] || roster[0];
        var stat = (GS.playerStats[scorer] = GS.playerStats[scorer] || { g:0, a:0, s:0 });
        stat.g += 1; stat.s += 1;
      }
      // goalie saves estimate
      var goalie = roster.find(function(pid){ return (GS.players[pid]||{}).pos === 'G'; }) || roster[0];
      var gst = (GS.playerStats[goalie] = GS.playerStats[goalie] || { g:0, a:0, s:0, sv:0 });
      gst.sv = (gst.sv||0) + rndInt(5,20);
    }

    assignStats(homeId, homeScore);
    assignStats(awayId, awayScore);

    game.result = { home: homeScore, away: awayScore };
    game.status = "completed";
    GS.results.push(game);
    return game;
  };
})();
