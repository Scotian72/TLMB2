
;(function(){ 'use strict';
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-action]'); if(!el) return;
    var a = el.getAttribute('data-action'); var p = el.getAttribute('data-param');
    switch(a){
      case 'advanceDay': TallyLax.SeasonManager.advanceDay(); TallyLax.News.pushDay(); TallyLax.UIDashboard.show(); break;
      case 'presetGP': /* handled in ui_schedule_presets */ break;
      case 'advPO': TallyLax.Playoffs.advanceRound(p); TallyLax.UIDashboard.show(); break;
      default: console.warn('Unknown action', a);
    }
  });
})();