
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.Selectors = {
    standings: function(div,lvl){ TL.GameState.standings[div]=TL.GameState.standings[div]||{A:{},B:{}}; return TL.GameState.standings[div][lvl]; }
  };
})();