(function(){
  'use strict';
  var TL = window.TL = window.TL || {};

  function log(msg){
    var el = document.getElementById('tl-diagnostics');
    if (!el){
      el = document.createElement('div');
      el.id = 'tl-diagnostics';
      el.style.cssText = 'position:fixed;right:10px;bottom:10px;padding:8px 10px;background:#111;color:#fff;font:12px/1.3 monospace;border-radius:8px;opacity:0.9;z-index:99999;max-width:320px;';
      document.body.appendChild(el);
    }
    var line = document.createElement('div');
    line.textContent = (new Date()).toLocaleTimeString() + ' - ' + msg;
    el.appendChild(line);
    while (el.childNodes.length > 10) el.removeChild(el.firstChild);
  }

  if (TL.EventBus && TL.EventBus.on){
    TL.EventBus.on('CampScrimmageCompleted', function(p){ log('CampScrimmageCompleted: '+(p.games||[]).length+' games'); });
    TL.EventBus.on('DayAdvanced', function(p){ log('DayAdvanced to '+(p && p.day)); });
  }
})();