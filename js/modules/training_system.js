
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.TrainingSystem = {
    judgement:function(div){
      // Split to A/B by OVR, ensure goalies present
      var pl=(TL.GameState.divisions[div].players||[]).slice().sort(function(a,b){return (b.ovr||50)-(a.ovr||50)});
      var mid=Math.ceil(pl.length/2);
      for(var i=0;i<pl.length;i++){ pl[i].team = (i<mid)?'A':'B'; }
      // Guarantee goalie on each side
      var G = pl.filter(function(x){return x.position==='Goalie';});
      if(G.length>=2){ G[0].team='A'; G[1].team='B'; }
      else if(G.length===1){ G[0].team='A'; }
    }
  };
})();