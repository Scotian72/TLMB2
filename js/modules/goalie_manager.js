
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.GoalieManager = {
    _rot: {},
    key:function(org,div,lvl){ return [org,div,lvl].join('|'); },
    initForRoster:function(org,div,lvl, roster){
      var k=this.key(org,div,lvl);
      if(!this._rot[k]){
        var ids = roster.filter(function(p){return p.position==='Goalie';}).map(function(p){return p.id;});
        if(ids.length===0){ ids=['g_x']; }
        this._rot[k] = { idx: 0, ids: ids, starts:{} };
      } else {
        var ids = roster.filter(function(p){return p.position==='Goalie';}).map(function(p){return p.id;});
        if(ids.length>0) this._rot[k].ids = ids;
      }
    },
    pickStarter:function(org,div,lvl, mode){ mode = (window.TallyLax.GameState && window.TallyLax.GameState.config && window.TallyLax.GameState.config.goalieMode) || mode;
      var rot = this._rot[this.key(org,div,lvl)];
      if(!rot){ return null; }
      var i = rot.idx % rot.ids.length;
      var id = rot.ids[i];
      if(mode==='Starter Heavy' && rot.ids.length>=2){ id = rot.ids[0]; rot.idx = (rot.idx+ (Math.random()<0.2?1:0)) % rot.ids.length; }
      else if(mode==='Hot Hand'){
        var best=id, bestAvg=999;
        for(var j=0;j<rot.ids.length;j++){
          var g=rot.ids[j], s=rot.starts[g]||{GA:0,GS:0}; var avg = s.GS>0? s.GA/s.GS : 3.5;
          if(avg<bestAvg){ bestAvg=avg; best=g; }
        }
        id=best; rot.idx = (rot.idx+1)%rot.ids.length;
      } else { rot.idx = (rot.idx+1)%rot.ids.length; }
      rot.starts[id]=rot.starts[id]||{GA:0,GS:0}; rot.starts[id].GS += 1; return id;
    },
    recordGA:function(org,div,lvl, goalieId, GA){
      var rot = this._rot[this.key(org,div,lvl)]; if(!rot) return;
      rot.starts[goalieId]=rot.starts[goalieId]||{GA:0,GS:0};
      rot.starts[goalieId].GA += (GA||0);
    }
  };
})();