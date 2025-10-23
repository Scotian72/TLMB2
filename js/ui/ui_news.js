
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.News = {
    panel:function(){
      var root=document.getElementById('root');
      var html='<div class="panel"><h3>News</h3><div class="hlist">'
        + TL.GameState.news.slice(0,5).map(function(n){ return '<div class="card"><div><strong>'+n.title+'</strong></div><div class="muted">'+n.body+'</div></div>'; }).join('')
        + '</div></div>';
      root.insertAdjacentHTML('beforeend', html);
    },
    pushDay:function(){
      TL.GameState.news.unshift({title:'Day '+TL.GameState.day, body:'Team activities recorded.'});
    }
  };
})();