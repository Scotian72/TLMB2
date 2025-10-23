
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{}; var K=TL.Constants;
  TL.TeamList = K.ORGS.map(function(o){ return { org:o, colors:['#7aa2ff','#e9ecff'] }; });
})();
window.TallyLax = window.TallyLax || {}; var TL = window.TallyLax; TL.Constants = TL.Constants || {}; TL.Constants.ORGS = (TL.TeamList||[]).map(t=>t.org); TL.getTeam = (org)=> (TL.TeamList||[]).find(t=>t.org===org);
