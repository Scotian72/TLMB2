/* @tlos:6.2
 * role: core
 * name: rng.js
 * reads: GameState.rngSeed
 * writes: window.TallyLax.RNG
 * contracts: seeded RNG, deterministic, no stray Math.random() in sim paths
 */

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    
    /**
     * RNG - Deterministic Seeded Random Number Generator
     * 
     * Uses a simple LCG (Linear Congruential Generator) for determinism.
     * All simulation logic MUST use RNG methods, never Math.random().
     */
    var RNG = {
        
        // Internal state
        _seed: null,
        _state: null,
        
        /**
         * Initialize RNG with seed
         * @param {number} seed - Seed value (from GameState)
         */
        init: function(seed) {
            this._seed = seed || 12345;
            this._state = this._seed;
            console.log('RNG initialized with seed:', this._seed);
        },
        
        /**
         * Get next random value [0, 1)
         * @returns {number} Random float [0, 1)
         */
        next: function() {
            if (this._state === null) {
                console.warn('RNG not initialized, using GameState seed');
                var GS = TL.GameState;
                this.init(GS ? GS.rngSeed : 12345);
            }
            
            // LCG parameters (from Numerical Recipes)
            var a = 1664525;
            var c = 1013904223;
            var m = Math.pow(2, 32);
            
            this._state = (a * this._state + c) % m;
            return this._state / m;
        },
        
        /**
         * Get random integer [min, max] inclusive
         * @param {number} min - Minimum value
         * @param {number} max - Maximum value
         * @returns {number} Random integer
         */
        int: function(min, max) {
            return Math.floor(this.next() * (max - min + 1)) + min;
        },
        
        /**
         * Get random float [min, max)
         * @param {number} min - Minimum value
         * @param {number} max - Maximum value
         * @returns {number} Random float
         */
        float: function(min, max) {
            return this.next() * (max - min) + min;
        },
        
        /**
         * Pick random element from array
         * @param {Array} arr - Array to pick from
         * @returns {*} Random element
         */
        pick: function(arr) {
            if (!arr || arr.length === 0) {
                return null;
            }
            var idx = this.int(0, arr.length - 1);
            return arr[idx];
        },
        
        /**
         * Pick random element from array with weights
         * @param {Array} arr - Array of elements
         * @param {Array} weights - Array of weights (same length as arr)
         * @returns {*} Weighted random element
         */
        pickWeighted: function(arr, weights) {
            if (!arr || arr.length === 0) {
                return null;
            }
            
            if (!weights || weights.length !== arr.length) {
                console.warn('pickWeighted: invalid weights, using uniform');
                return this.pick(arr);
            }
            
            // Calculate total weight
            var total = 0;
            for (var i = 0; i < weights.length; i++) {
                total += weights[i];
            }
            
            if (total <= 0) {
                console.warn('pickWeighted: zero total weight, using uniform');
                return this.pick(arr);
            }
            
            // Select random point in weight distribution
            var roll = this.float(0, total);
            var cumulative = 0;
            
            for (var j = 0; j < arr.length; j++) {
                cumulative += weights[j];
                if (roll <= cumulative) {
                    return arr[j];
                }
            }
            
            // Fallback (should never reach)
            return arr[arr.length - 1];
        },
        
        /**
         * Shuffle array in-place (Fisher-Yates)
         * @param {Array} arr - Array to shuffle
         * @returns {Array} Shuffled array (same reference)
         */
        shuffle: function(arr) {
            if (!arr || arr.length <= 1) {
                return arr;
            }
            
            for (var i = arr.length - 1; i > 0; i--) {
                var j = this.int(0, i);
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            
            return arr;
        },
        
        /**
         * Roll dice (returns true if roll <= chance)
         * @param {number} chance - Probability [0, 1]
         * @returns {boolean} True if successful
         */
        roll: function(chance) {
            return this.next() <= chance;
        },
        
        /**
         * Get random boolean
         * @returns {boolean} Random true/false
         */
        bool: function() {
            return this.next() < 0.5;
        },
        
        /**
         * Sample from normal distribution (Box-Muller transform)
         * @param {number} mean - Mean value
         * @param {number} stdDev - Standard deviation
         * @returns {number} Random value from normal distribution
         */
        normal: function(mean, stdDev) {
            var u1 = this.next();
            var u2 = this.next();
            
            // Box-Muller transform
            var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            
            return z0 * stdDev + mean;
        },
        
        /**
         * Reset RNG to original seed
         */
        reset: function() {
            this._state = this._seed;
            console.log('RNG reset to seed:', this._seed);
        },
        
        /**
         * Get current seed (for save/load)
         * @returns {number} Current seed
         */
        getSeed: function() {
            return this._seed;
        },
        
        /**
         * Get current state (for save/load)
         * @returns {number} Current state
         */
        getState: function() {
            return this._state;
        },
        
        /**
         * Set state (for save/load)
         * @param {number} state - State to restore
         */
        setState: function(state) {
            this._state = state;
        }
    };
    
    // Export
    TL.RNG = RNG;
    
    console.log('âœ… RNG loaded');
    
})();
