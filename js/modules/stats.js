(function(){
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.Modules = TL.Modules || {};

  TL.Modules.Stats = {
    apply: function(game){
      // In this minimal pass, TL.Modules.GameSim already wrote per-player stats into GS.playerStats.
      // This function is a placeholder to extend: persist to season totals, camp sheets, etc.
      var GS = TL.GameState;
      GS.campHistory = GS.campHistory || [];
      GS.campHistory.push({
        id: game.id,
        day: game.day,
        orgId: game.orgId,
        division: game.division,
        result: game.result,
        homeId: game.homeId,
        awayId: game.awayId
      });
    }
  };
})();