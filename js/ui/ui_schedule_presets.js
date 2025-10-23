
;(function(){ 'use strict';
  document.addEventListener('click', function(e){
    var el=e.target.closest('[data-action="presetGP"]'); if(!el) return;
    var gp=parseInt(el.getAttribute('data-param'),10);
    if(!isNaN(gp)){
      TallyLax.GameState.config.targetGP = gp;
      TallyLax.SeasonManager.startNewSeason('PRESET'+gp);
      TallyLax.UIDashboard.show();
    }
  });
})();