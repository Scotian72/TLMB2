(function(){
  'use strict';
  var TL = window.TL = window.TL || {};

  function onAdvance(payload){
    var GS = TL.GameState;
    var day = (payload && payload.day) || (GS && GS.day) || 1;
    if (TL.Modules && TL.Modules.Camp && TL.Modules.Camp.runDay){
      TL.Modules.Camp.runDay(day);
    }
  }

  if (TL.EventBus && TL.EventBus.on){
    TL.EventBus.on('DayAdvanced', onAdvance);
  }

  // Fallback: if there is a global "Advance Day" button with id advance-day,
  // attach a click listener to trigger camp in case event is not wired.
  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.getElementById('advance-day');
    if (btn){
      btn.addEventListener('click', function(){
        try{
          onAdvance();
        }catch(e){ console.error(e); }
      });
    }
  });
})();