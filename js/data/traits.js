// js/data/traits.js - Player Traits System
(function() {
    'use strict';
    window.TallyLax = window.TallyLax || {};
    
    var Traits = {
        
        // Get all traits for a position
        getAllTraits: function(position) {
            if (position === 'Goalie') {
                return this.goalieTraits;
            } else {
                return this.runnerTraits;
            }
        },
        
        // Get specific trait by name
        getTrait: function(traitName) {
            var allTraits = this.runnerTraits.concat(this.goalieTraits);
            for (var i = 0; i < allTraits.length; i++) {
                if (allTraits[i].name === traitName) {
                    return allTraits[i];
                }
            }
            return null;
        },
        
        // Runner traits
        runnerTraits: [
            // Positive - Offensive
            { name: 'Natural Scorer', type: 'positive', archetype: 'offensive', effects: { shooting: 5, offense: 3 }, description: 'Has a knack for finding the net' },
            { name: 'Playmaker', type: 'positive', archetype: 'offensive', effects: { passing: 5, lacrosseIQ: 3 }, description: 'Sets up teammates brilliantly' },
            { name: 'Quick Release', type: 'positive', archetype: 'offensive', effects: { shooting: 4, cradling: 2 }, description: 'Gets shots off quickly' },
            { name: 'Clutch Performer', type: 'positive', archetype: 'offensive', effects: { shooting: 3, leadership: 3 }, description: 'Performs best under pressure' },
            
            // Positive - Defensive
            { name: 'Shutdown Defender', type: 'positive', archetype: 'defensive', effects: { defense: 5, positioning: 3 }, description: 'Locks down opponents' },
            { name: 'Physical', type: 'positive', archetype: 'defensive', effects: { defense: 4, hustle: 2 }, description: 'Plays tough, physical lacrosse' },
            { name: 'Maritime Tough', type: 'positive', archetype: 'defensive', effects: { defense: 3, endurance: 3 }, description: 'East Coast grit and determination' },
            { name: 'Ball Hawk', type: 'positive', archetype: 'defensive', effects: { defense: 3, positioning: 3 }, description: 'Creates turnovers consistently' },
            
            // Positive - Balanced
            { name: 'Two-Way Player', type: 'positive', archetype: 'balanced', effects: { offense: 3, defense: 3 }, description: 'Contributes at both ends' },
            { name: 'High Lacrosse IQ', type: 'positive', archetype: 'balanced', effects: { lacrosseIQ: 5, positioning: 3 }, description: 'Reads the game exceptionally well' },
            { name: 'Natural Athlete', type: 'positive', archetype: 'balanced', effects: { speed: 4, endurance: 2 }, description: 'Superior athletic ability' },
            { name: 'Team Leader', type: 'positive', archetype: 'balanced', effects: { leadership: 5, lacrosseIQ: 2 }, description: 'Natural leader on and off the court' },
            { name: 'Coachable', type: 'positive', archetype: 'balanced', effects: { lacrosseIQ: 3, positioning: 2 }, description: 'Learns quickly and applies feedback' },
            { name: 'Motor', type: 'positive', archetype: 'balanced', effects: { hustle: 5, endurance: 3 }, description: 'Never stops working' },
            { name: 'Quick Feet', type: 'positive', archetype: 'balanced', effects: { speed: 5, positioning: 2 }, description: 'Exceptional foot speed' },
            
            // Negative
            { name: 'Inconsistent', type: 'negative', effects: { lacrosseIQ: -3, positioning: -2 }, description: 'Performance varies game to game' },
            { name: 'Hot Head', type: 'negative', effects: { leadership: -4, lacrosseIQ: -2 }, description: 'Takes undisciplined penalties' },
            { name: 'Low Stamina', type: 'negative', effects: { endurance: -5, hustle: -2 }, description: 'Tires quickly during games' },
            { name: 'Weak Stick', type: 'negative', effects: { cradling: -4, passing: -2 }, description: 'Struggles with stick skills' },
            { name: 'Soft Hands', type: 'negative', effects: { defense: -4, hustle: -2 }, description: 'Avoids physical play' }
        ],
        
        // Goalie traits
        goalieTraits: [
            // Positive
            { name: 'Acrobatic', type: 'positive', effects: { reflexes: 5, highShots: 3 }, description: 'Makes spectacular saves' },
            { name: 'Calm Under Pressure', type: 'positive', effects: { mentalToughness: 5, positioning: 2 }, description: 'Stays composed in crucial moments' },
            { name: 'Quick Reflexes', type: 'positive', effects: { reflexes: 5, stickSide: 2 }, description: 'Lightning-fast reactions' },
            { name: 'Vocal Leader', type: 'positive', effects: { communication: 5, clearing: 2 }, description: 'Commands the defense' },
            { name: 'Rebound Control', type: 'positive', effects: { reboundControl: 5, positioning: 2 }, description: 'Controls loose balls expertly' },
            { name: 'Positional Goalie', type: 'positive', effects: { positioning: 5, lowShots: 2 }, description: 'Always in the right spot' },
            
            // Negative
            { name: 'Inconsistent', type: 'negative', effects: { mentalToughness: -4, reflexes: -2 }, description: 'Performance varies widely' },
            { name: 'Lets In Soft Goals', type: 'negative', effects: { reflexes: -3, positioning: -3 }, description: 'Prone to easy goals' },
            { name: 'Poor Clearing', type: 'negative', effects: { clearing: -5 }, description: 'Struggles to start offense' },
            { name: 'Nervous', type: 'negative', effects: { mentalToughness: -5, communication: -2 }, description: 'Gets rattled easily' }
        ]
    };
    
    window.TallyLax.Traits = Traits;
    console.log('âœ… Traits loaded successfully');
})();
