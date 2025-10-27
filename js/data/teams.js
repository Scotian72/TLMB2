/* @tlos:6.2
 * role: data
 * name: teams.js
 * reads: none
 * writes: window.TallyLax.Teams
 * contracts: 12 org palettes, Branding.apply(org) mutates CSS vars
 */

(function() {
    'use strict';
    
    var TL = window.TallyLax = window.TallyLax || {};
    
    /**
     * Teams - Organization Branding Data
     * 
     * 12 Maritime Box Lacrosse organizations with unique identities
     */
    var Teams = {
        
        // Team Definitions
        data: {
            Hawks: {
                name: 'Hawks',
                mascot: 'Hawk',
                colors: {
                    primary: '#2c5f8d',
                    secondary: '#d4af37',
                    neutral: '#f4f4f4'
                },
                logo: 'assets/logos/hawks.png',
                motto: 'Soar Above'
            },
            
            Owls: {
                name: 'Owls',
                mascot: 'Owl',
                colors: {
                    primary: '#4a2c2a',
                    secondary: '#c17b3a',
                    neutral: '#f9f4ef'
                },
                logo: 'assets/logos/owls.png',
                motto: 'Wisdom and Precision'
            },
            
            Eagles: {
                name: 'Eagles',
                mascot: 'Eagle',
                colors: {
                    primary: '#1a4d2e',
                    secondary: '#d4af37',
                    neutral: '#f0f0f0'
                },
                logo: 'assets/logos/eagles.png',
                motto: 'Strength and Pride'
            },
            
            Lynx: {
                name: 'Lynx',
                mascot: 'Lynx',
                colors: {
                    primary: '#3d3d3d',
                    secondary: '#b8860b',
                    neutral: '#e8e8e8'
                },
                logo: 'assets/logos/lynx.png',
                motto: 'Silent and Swift'
            },
            
            Wolves: {
                name: 'Wolves',
                mascot: 'Wolf',
                colors: {
                    primary: '#4a4a4a',
                    secondary: '#778899',
                    neutral: '#f5f5f5'
                },
                logo: 'assets/logos/wolves.png',
                motto: 'Pack Mentality'
            },
            
            Coyotes: {
                name: 'Coyotes',
                mascot: 'Coyote',
                colors: {
                    primary: '#8b6914',
                    secondary: '#d2b48c',
                    neutral: '#f5f0e8'
                },
                logo: 'assets/logos/coyotes.png',
                motto: 'Cunning and Quick'
            },
            
            Moose: {
                name: 'Moose',
                mascot: 'Moose',
                colors: {
                    primary: '#654321',
                    secondary: '#8b7355',
                    neutral: '#f4efe8'
                },
                logo: 'assets/logos/moose.png',
                motto: 'Power and Endurance'
            },
            
            Bears: {
                name: 'Bears',
                mascot: 'Bear',
                colors: {
                    primary: '#5d3a1a',
                    secondary: '#a0522d',
                    neutral: '#f9f5f0'
                },
                logo: 'assets/logos/bears.png',
                motto: 'Ferocity and Heart'
            },
            
            Beavers: {
                name: 'Beavers',
                mascot: 'Beaver',
                colors: {
                    primary: '#8b4513',
                    secondary: '#d2691e',
                    neutral: '#f5ebe0'
                },
                logo: 'assets/logos/beavers.png',
                motto: 'Hard Work Pays Off'
            },
            
            Otters: {
                name: 'Otters',
                mascot: 'Otter',
                colors: {
                    primary: '#2b547e',
                    secondary: '#87ceeb',
                    neutral: '#f0f8ff'
                },
                logo: 'assets/logos/otters.png',
                motto: 'Flow Like Water'
            },
            
            Ravens: {
                name: 'Ravens',
                mascot: 'Raven',
                colors: {
                    primary: '#1a1a1a',
                    secondary: '#6a0dad',
                    neutral: '#f5f5f5'
                },
                logo: 'assets/logos/ravens.png',
                motto: 'Intelligence Wins'
            },
            
            Foxes: {
                name: 'Foxes',
                mascot: 'Fox',
                colors: {
                    primary: '#cc5500',
                    secondary: '#ff8c00',
                    neutral: '#fff8f0'
                },
                logo: 'assets/logos/foxes.png',
                motto: 'Clever and Bold'
            }
        },
        
        /**
         * Get team data by name
         * @param {string} name - Team name
         * @returns {object|null} Team data or null
         */
        get: function(name) {
            return this.data[name] || null;
        },
        
        /**
         * Get all team names
         * @returns {Array} Array of team names
         */
        list: function() {
            return Object.keys(this.data);
        },
        
        /**
         * Check if team exists
         * @param {string} name - Team name
         * @returns {boolean} True if team exists
         */
        exists: function(name) {
            return this.data.hasOwnProperty(name);
        }
    };
    
    /**
     * Branding - Apply team branding to UI
     * 
     * Mutates CSS custom properties to match team colors
     */
    var Branding = {
        
        /**
         * Apply team branding to page
         * @param {string} orgName - Organization name
         */
        apply: function(orgName) {
            var team = Teams.get(orgName);
            
            if (!team) {
                console.warn('Branding.apply: team not found:', orgName);
                return;
            }
            
            var root = document.documentElement;
            
            // Apply CSS custom properties
            root.style.setProperty('--color-primary', team.colors.primary);
            root.style.setProperty('--color-secondary', team.colors.secondary);
            root.style.setProperty('--color-neutral', team.colors.neutral);
            
            // Also set as data attribute for CSS selectors
            root.setAttribute('data-team', orgName.toLowerCase());
            
            console.log('Branding applied for ' + orgName);
        },
        
        /**
         * Reset branding to defaults
         */
        reset: function() {
            var root = document.documentElement;
            root.style.removeProperty('--color-primary');
            root.style.removeProperty('--color-secondary');
            root.style.removeProperty('--color-neutral');
            root.removeAttribute('data-team');
        }
    };
    
    // Export
    TL.Teams = Teams;
    TL.Branding = Branding;
    
    console.log('âœ… Teams loaded (12 organizations)');
    
})();
