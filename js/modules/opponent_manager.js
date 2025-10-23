
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{}; var K=TL.Constants; var Keys=window.Keys;
  TL.OpponentManager = {
    ensureRoster: function(org, div, lvl){
      var key = Keys.key(org,div,lvl);
      if(!TL.GameState.opponentRosters[key]){
        var arr=[], i;
        for(i=0;i<16;i++){ arr.push(TL.PlayerGen.make({div:div,lvl:lvl})); }
        for(i=0;i<2;i++){ var g=TL.PlayerGen.make({div:div,lvl:lvl, position:'Goalie'}); g.position='Goalie'; g.seasonGoalie={GP:0,GS:0,TOI:0,SA:0,SV:0,GA:0,SO:0,QS:0,RBS:0}; arr.push(g); }
        TL.GameState.opponentRosters[key]=arr;
      }
      TL.GoalieManager.initForRoster(org, div, lvl, TL.GameState.opponentRosters[key]);
      return TL.GameState.opponentRosters[key];
    }
  };
})();