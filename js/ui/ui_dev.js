
window.TallyLax = window.TallyLax || {};
(function(TL){
  TL.UIDev = { show: function(){
      var root = document.getElementById('root') || document.getElementById('app-content') || document.body;
      var html = '<div class="panel"><h3>Developer Console</h3><div class="muted">Run built-in checks over the current state.</div>'+
                 '<div class="flex" style="margin-top:8px"><button class="btn" data-action="runDiagnostics">Run Checks</button></div>'+
                 '<pre id="diagOut" style="white-space:pre-wrap;background:#0d1027;border:1px solid #262a60;border-radius:8px;padding:8px;margin-top:8px;max-height:420px;overflow:auto"></pre>'+
                 '</div>'; root.insertAdjacentHTML('beforeend', html);
  }};
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-action]'); if(!el) return;
    if(el.getAttribute('data-action')==='runDiagnostics'){
      var res = TallyLax.Diagnostics.run(); var pre = document.getElementById('diagOut'); if(pre){ pre.textContent = JSON.stringify(res, null, 2); }
    }
  });
})(window.TallyLax);
