(function(){
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.Modules = TL.Modules || {};

  TL.Modules.Camp = {
    runDay: function(day){
      var GS = TL.GameState;
      TL.Systems = TL.Systems || {};
      var Schedule = TL.Systems.Schedule;
      var Lines = (TL.Modules && TL.Modules.Lines) || {};
      var GameSim = (TL.Modules && TL.Modules.GameSim) || {};
      var Stats = (TL.Modules && TL.Modules.Stats) || {};

      if(!Schedule || !Schedule.createCampScrimmages){
        console.warn("Schedule.createCampScrimmages missing");
        return [];
      }
      var games = Schedule.createCampScrimmages(day);
      games.forEach(function(g){
        // roster & lines
        Lines.ensureRoster(g.orgId, g.division, g.homeId);
        Lines.ensureRoster(g.orgId, g.division, g.awayId);
        Lines.ensureCampLines(g.homeId);
        Lines.ensureCampLines(g.awayId);
        // simulate
        GameSim.simulateScrimmage(g);
        // apply/persist
        if (Stats.apply) Stats.apply(g);
      });
      // notify UI
      if (TL.EventBus && TL.EventBus.emit) {
        TL.EventBus.emit('CampScrimmageCompleted', { day: day, games: games });
      }
      return games;
    }
  };
})();