/**
 * TallyLax RNG (v6.2)
 * Deterministic seeded random number generator
 * Contract: All randomness uses this; reproducible with same seed
 */

(function() {
  'use strict';

  var RNG = {
    seed: null,
    
    // Initialize with seed
    init: function(seed) {
      this.seed = seed || Date.now();
      return this.seed;
    },
    
    // Get current seed
    getSeed: function() {
      return this.seed;
    },
    
    // Generate next random number [0, 1)
    random: function() {
      if (this.seed === null) {
        this.init();
      }
      
      // Simple LCG (Linear Congruential Generator)
      this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
      return this.seed / 0x80000000;
    },
    
    // Random integer [min, max] inclusive
    int: function(min, max) {
      return Math.floor(this.random() * (max - min + 1)) + min;
    },
    
    // Random float [min, max)
    float: function(min, max) {
      return this.random() * (max - min) + min;
    },
    
    // Random choice from array
    choice: function(arr) {
      if (!arr || arr.length === 0) return null;
      return arr[this.int(0, arr.length - 1)];
    },
    
    // Shuffle array (Fisher-Yates)
    shuffle: function(arr) {
      var shuffled = arr.slice();
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = this.int(0, i);
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      return shuffled;
    },
    
    // Weighted choice
    weighted: function(items, weights) {
      if (!items || items.length === 0) return null;
      if (!weights || weights.length !== items.length) return this.choice(items);
      
      var total = 0;
      for (var i = 0; i < weights.length; i++) {
        total += weights[i];
      }
      
      var rand = this.random() * total;
      var sum = 0;
      
      for (var j = 0; j < items.length; j++) {
        sum += weights[j];
        if (rand < sum) {
          return items[j];
        }
      }
      
      return items[items.length - 1];
    },
    
    // Gaussian (normal) distribution using Box-Muller transform
    gaussian: function(mean, stdDev) {
      mean = mean || 0;
      stdDev = stdDev || 1;
      
      var u1 = this.random();
      var u2 = this.random();
      var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      return z0 * stdDev + mean;
    }
  };

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.RNG = RNG;
  window.TL = window.TallyLax; // Alias
})();
