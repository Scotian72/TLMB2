
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.PlayerGen = {
    make: function(opts){
      var id='p_'+Math.random().toString(36).slice(2);
      var pos = opts && opts.position || (Math.random()<0.12?'Goalie':'Runner');
      var ovr = 45 + Math.floor(Math.random()*30);
      return { id:id, name: (window.TL_NAMES||['Alex'])[Math.floor(Math.random()*(window.TL_NAMES||['Alex']).length)], division:opts.div, team:opts.lvl||'A', position:pos, ovr:ovr, morale:70+Math.floor(Math.random()*20), seasonStats:{GP:0,G:0,A:0,S:0,PIM:0,GB:0,TO:0,CTO:0,BLK:0,FO:0,FOW:0} };
    }
  };
})();