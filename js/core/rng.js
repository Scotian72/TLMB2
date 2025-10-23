
;(function(){ 'use strict';
  var TL=window.TallyLax=window.TallyLax||{};
  TL.RNG = {
    seed: 123456789,
    rand: function(){ this.seed = (1103515245*this.seed + 12345) % 2147483648; return this.seed/2147483648; },
    int: function(a,b){ return a + Math.floor(this.rand()*(b-a+1)); },
    pick: function(arr){ return arr[Math.floor(this.rand()*arr.length)] || arr[0]; }
  };
})();