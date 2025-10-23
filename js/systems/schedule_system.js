
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{}; var K=TL.Constants;
  TL.ScheduleSystem = {
    phase: function(day){
      if(day<=7) return 'camp';
      if(day<=90) return 'season';
      return 'playoffs';
    }
  };
})();