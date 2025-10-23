
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.UITrainingCamp = {
    show:function(){
      var root=document.getElementById('root');
      var d=TL.GameState.day, phase=TL.ScheduleSystem.phase(d);
      var agenda={1:'Orientation & Jerseys',2:'Exhibition #1',3:'Defensive Clinic',4:'Exhibition #2',5:'Offensive+Special Teams',6:'Exhibition #3',7:'Judgement Day'};
      var info = (phase==='camp')? ('Day '+d+': '+agenda[d]) : 'Camp complete.';
      root.insertAdjacentHTML('beforeend','<div class="panel"><h3>Training Camp</h3><div class="muted">'+info+'</div></div>');
    },
    runDay:function(day){
      var divs=['U11','U13','U15','U17'];
      if(day===2 || day===4 || day===6){
        divs.forEach(function(div){
          var opp = TL.RNG.pick(TL.Constants.ORGS.filter(function(o){return o!==TL.GameState.user.org;}));
          var gA={ id:'exh_'+day+'_'+div+'_A', day:day, division:div, teamLevel:'A', homeOrg:TL.GameState.user.org, awayOrg:opp, status:'scheduled' };
          var gB={ id:'exh_'+day+'_'+div+'_B', day:day, division:div, teamLevel:'B', homeOrg:opp, awayOrg:TL.GameState.user.org, status:'scheduled' };
          TL.GameSimulator.simulateGame(gA); TL.GameState.gameLog.push(gA);
          TL.GameSimulator.simulateGame(gB); TL.GameState.gameLog.push(gB);
        });
        TL.GameState.news.unshift({title:'Camp Exhibition', body:'Exhibitions completed with rotation.'});
      } else if(day===3){
        TL.GameState.news.unshift({title:'Defensive Clinic', body:'GB/CTO emphasis.'});
      } else if(day===5){
        TL.GameState.news.unshift({title:'Offense Clinic', body:'Special teams tuned.'});
      } else if(day===7){
        divs.forEach(function(div){ TL.TrainingSystem.judgement(div); });
        TL.GameState.news.unshift({title:'Judgement Day', body:'A/B rosters finalized; goalie on each side.'});
      }
    }
  };
})();