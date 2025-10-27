/**
 * TallyLax Teams (v6.2)
 * 12 Maritime Box Lacrosse organizations
 * Contract: Unique identities; Branding.apply(org) updates CSS
 */

(function() {
  'use strict';

  var Teams = {
    Hawks: {
      name: 'Hawks',
      mascot: 'Hawks',
      logo: 'assets/logos/hawks.webp',
      colors: {
        primary: '#8B1538',
        secondary: '#FFD700',
        accent: '#1A1A1A'
      },
      motto: 'Soar Above'
    },
    
    Owls: {
      name: 'Owls',
      mascot: 'Owls',
      logo: 'assets/logos/owls.webp',
      colors: {
        primary: '#4A5568',
        secondary: '#F7931E',
        accent: '#2D3748'
      },
      motto: 'Wisdom in Motion'
    },
    
    Eagles: {
      name: 'Eagles',
      mascot: 'Eagles',
      logo: 'assets/logos/eagles.webp',
      colors: {
        primary: '#1E3A8A',
        secondary: '#FBBF24',
        accent: '#111827'
      },
      motto: 'Flight of Champions'
    },
    
    Lynx: {
      name: 'Lynx',
      mascot: 'Lynx',
      logo: 'assets/logos/lynx.webp',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#064E3B'
      },
      motto: 'Stealth and Speed'
    },
    
    Wolves: {
      name: 'Wolves',
      mascot: 'Wolves',
      logo: 'assets/logos/wolves.webp',
      colors: {
        primary: '#374151',
        secondary: '#9CA3AF',
        accent: '#1F2937'
      },
      motto: 'Pack Mentality'
    },
    
    Coyotes: {
      name: 'Coyotes',
      mascot: 'Coyotes',
      logo: 'assets/logos/coyotes.webp',
      colors: {
        primary: '#92400E',
        secondary: '#F59E0B',
        accent: '#78350F'
      },
      motto: 'Cunning and Quick'
    },
    
    Moose: {
      name: 'Moose',
      mascot: 'Moose',
      logo: 'assets/logos/moose.webp',
      colors: {
        primary: '#7C2D12',
        secondary: '#DC2626',
        accent: '#991B1B'
      },
      motto: 'Northern Strength'
    },
    
    Bears: {
      name: 'Bears',
      mascot: 'Bears',
      logo: 'assets/logos/bears.webp',
      colors: {
        primary: '#44403C',
        secondary: '#A8A29E',
        accent: '#292524'
      },
      motto: 'Power and Pride'
    },
    
    Beavers: {
      name: 'Beavers',
      mascot: 'Beavers',
      logo: 'assets/logos/beavers.webp',
      colors: {
        primary: '#713F12',
        secondary: '#F97316',
        accent: '#92400E'
      },
      motto: 'Build the Future'
    },
    
    Otters: {
      name: 'Otters',
      mascot: 'Otters',
      logo: 'assets/logos/otters.webp',
      colors: {
        primary: '#1E40AF',
        secondary: '#60A5FA',
        accent: '#1E3A8A'
      },
      motto: 'Flow Like Water'
    },
    
    Ravens: {
      name: 'Ravens',
      mascot: 'Ravens',
      logo: 'assets/logos/ravens.webp',
      colors: {
        primary: '#312E81',
        secondary: '#8B5CF6',
        accent: '#1E1B4B'
      },
      motto: 'Never Surrender'
    },
    
    Foxes: {
      name: 'Foxes',
      mascot: 'Foxes',
      logo: 'assets/logos/foxes.webp',
      colors: {
        primary: '#BE185D',
        secondary: '#F472B6',
        accent: '#9F1239'
      },
      motto: 'Clever and Bold'
    }
  };

  var Branding = {
    // Apply team branding to CSS
    apply: function(org) {
      var team = Teams[org];
      if (!team) {
        console.error('Team not found:', org);
        return;
      }
      
      var root = document.documentElement;
      root.style.setProperty('--color-primary', team.colors.primary);
      root.style.setProperty('--color-secondary', team.colors.secondary);
      root.style.setProperty('--color-accent', team.colors.accent);
      
      console.log('Branding applied:', org);
    },
    
    // Get team info
    getTeam: function(org) {
      return Teams[org] || null;
    },
    
    // Get all teams
    getAllTeams: function() {
      return Teams;
    }
  };

  // Export to global namespace
  window.TallyLax = window.TallyLax || {};
  window.TallyLax.Teams = Teams;
  window.TallyLax.Branding = Branding;
  window.TL = window.TallyLax; // Alias
})();
