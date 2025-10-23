/**
 * data/traits.js - Player and Parent Traits System
 * NO modern syntax - var and function keywords only
 */
;(function() {
    'use strict';
    
    var TL = window.TallyLax || (window.TallyLax = {});
    
    // Trait definitions
    var PLAYER_TRAITS = {
        VOCAL_LEADER: {
            id: 'vocal_leader',
            name: 'Vocal Leader',
            description: 'Natural team communicator',
            effects: { leadership: 3, chemistry: 2 },
            positive: true
        },
        HARD_WORKER: {
            id: 'hard_worker',
            name: 'Hard Worker',
            description: 'Gives maximum effort',
            effects: { progression: 1.15, morale: 2 },
            positive: true
        },
        CLUTCH: {
            id: 'clutch',
            name: 'Clutch Performer',
            description: 'Performs well under pressure',
            effects: { consistency: 5 },
            positive: true
        },
        COACHABLE: {
            id: 'coachable',
            name: 'Coachable',
            description: 'Responds well to coaching',
            effects: { progression: 1.1 },
            positive: true
        },
        TEAM_PLAYER: {
            id: 'team_player',
            name: 'Team Player',
            description: 'Puts team first',
            effects: { chemistry: 3 },
            positive: true
        },
        LAZY: {
            id: 'lazy',
            name: 'Lazy',
            description: 'Lacks work ethic',
            effects: { progression: 0.85, morale: -2 },
            positive: false
        },
        SELFISH: {
            id: 'selfish',
            name: 'Selfish',
            description: 'Prioritizes self over team',
            effects: { chemistry: -3 },
            positive: false
        },
        INJURY_PRONE: {
            id: 'injury_prone',
            name: 'Injury Prone',
            description: 'Gets injured more often',
            effects: { durability: -5 },
            positive: false
        },
        HOT_HEAD: {
            id: 'hot_head',
            name: 'Hot Head',
            description: 'Takes bad penalties',
            effects: { discipline: -5 },
            positive: false
        }
    };
    
    var PARENT_TRAITS = {
        SUPPORTIVE: {
            id: 'supportive',
            name: 'Supportive',
            description: 'Very encouraging',
            effects: { parentMorale: 2 }
        },
        DEMANDING: {
            id: 'demanding',
            name: 'Demanding',
            description: 'High expectations',
            effects: { parentMorale: -1, pressure: 1 }
        },
        RELAXED: {
            id: 'relaxed',
            name: 'Relaxed',
            description: 'Easy-going attitude',
            effects: { parentMorale: 1 }
        },
        INVOLVED: {
            id: 'involved',
            name: 'Very Involved',
            description: 'Highly engaged',
            effects: { parentMorale: 1 }
        }
    };
    
    function generatePlayerTraits(age, position) {
        var traits = [];
        var maxTraits = age >= 15 ? 2 : 1;
        var traitChance = age >= 15 ? 0.6 : 0.4;
        
        var allTraits = Object.keys(PLAYER_TRAITS);
        var positiveTraits = [];
        var negativeTraits = [];
        
        for (var i = 0; i < allTraits.length; i++) {
            var key = allTraits[i];
            if (PLAYER_TRAITS[key].positive) {
                positiveTraits.push(key);
            } else {
                negativeTraits.push(key);
            }
        }
        
        if (TL.RNG && TL.RNG.float(0, 1) < traitChance && positiveTraits.length > 0) {
            var posIdx = TL.RNG.int(0, positiveTraits.length - 1);
            traits.push(positiveTraits[posIdx].toLowerCase());
        }
        
        var negChance = age >= 15 ? 0.2 : 0.1;
        if (traits.length < maxTraits && TL.RNG && TL.RNG.float(0, 1) < negChance && negativeTraits.length > 0) {
            var negIdx = TL.RNG.int(0, negativeTraits.length - 1);
            traits.push(negativeTraits[negIdx].toLowerCase());
        }
        
        return traits;
    }
    
    function applyTraitEffects(player, traitId) {
        if (!player || !traitId) return;
        
        var trait = PLAYER_TRAITS[traitId.toUpperCase()];
        if (!trait || !trait.effects) return;
        
        if (trait.effects.leadership && player.leadership !== undefined) {
            player.leadership = Math.max(0, Math.min(100, player.leadership + trait.effects.leadership));
        }
        if (trait.effects.chemistry) {
            player.chemistryBonus = (player.chemistryBonus || 0) + trait.effects.chemistry;
        }
        if (trait.effects.consistency && player.consistency !== undefined) {
            player.consistency = Math.max(0, Math.min(100, player.consistency + trait.effects.consistency));
        }
        if (trait.effects.durability && player.durability !== undefined) {
            player.durability = Math.max(0, Math.min(100, player.durability + trait.effects.durability));
        }
        if (trait.effects.discipline && player.discipline !== undefined) {
            player.discipline = Math.max(0, Math.min(100, player.discipline + trait.effects.discipline));
        }
        if (trait.effects.progression) {
            player.progressionModifier = (player.progressionModifier || 1.0) * trait.effects.progression;
        }
        if (trait.effects.morale) {
            player.morale = Math.max(0, Math.min(100, (player.morale || 70) + trait.effects.morale));
        }
    }
    
    function generateParentTraits() {
        var traits = [];
        var allParentTraits = Object.keys(PARENT_TRAITS);
        
        if (TL.RNG && TL.RNG.float(0, 1) < 0.7 && allParentTraits.length > 0) {
            var idx = TL.RNG.int(0, allParentTraits.length - 1);
            traits.push(allParentTraits[idx].toLowerCase());
        }
        
        return traits;
    }
    
    function getTraitDefinition(traitId) {
        if (!traitId) return null;
        return PLAYER_TRAITS[traitId.toUpperCase()] || PARENT_TRAITS[traitId.toUpperCase()] || null;
    }
    
    function getTraitName(traitId) {
        var trait = getTraitDefinition(traitId);
        return trait ? trait.name : traitId;
    }
    
    function isPositiveTrait(traitId) {
        var trait = getTraitDefinition(traitId);
        return trait && trait.positive === true;
    }
    
    TL.Traits = {
        PLAYER_TRAITS: PLAYER_TRAITS,
        PARENT_TRAITS: PARENT_TRAITS,
        generatePlayerTraits: generatePlayerTraits,
        generateParentTraits: generateParentTraits,
        applyTraitEffects: applyTraitEffects,
        getTraitDefinition: getTraitDefinition,
        getTraitName: getTraitName,
        isPositiveTrait: isPositiveTrait
    };
    
    console.log('✅ data/traits.js loaded');
})();
