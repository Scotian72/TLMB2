
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{}; var K=TL.Constants;
  TL.GameState = {
    day: 1,
    config: { targetGP: 40 },
    user: { org: K.ORGS[0] },
    lines: { mode: 'Alternate' },
    divisions: { U11:{players:[]}, U13:{players:[]}, U15:{players:[]}, U17:{players:[]}},
    gameLog: [],
    news: [],
    standings: {},
    opponentRosters: {},
    playoffs: { started:false, rounds:{} }
  };
})();