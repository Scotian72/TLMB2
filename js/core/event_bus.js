(function(){
  'use strict';
  var TL = window.TL = window.TL || {};
  var bus = TL.EventBus = TL.EventBus || {};
  var listeners = {};

  bus.on = function(type, fn){
    (listeners[type] = listeners[type] || []).push(fn);
  };
  bus.off = function(type, fn){
    if(!listeners[type]) return;
    listeners[type] = listeners[type].filter(function(l){ return l !== fn; });
  };
  bus.emit = function(type, payload){
    (listeners[type] || []).forEach(function(fn){ try{ fn(payload); }catch(e){ console.error(e);} });
  };
})();
