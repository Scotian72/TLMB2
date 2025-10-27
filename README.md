# 🥍 TallyLax Manager v6.2 - Complete Edition

## Box Lacrosse Management Game - Fully Fixed & Ready to Play

---

## 🎮 What's New in v6.2

### ✅ ALL TRAINING CAMP ISSUES FIXED

1. **White Text Throughout** - Perfect visibility on all screens
2. **Clickable Player Cards** - Click any player to see their full profile
3. **Training Camp Advances** - Days 1-7 with clinics and scrimmages
4. **Smart Jersey Assignment** - Best players (by OVR) get first choice
5. **3 Favorite Numbers** - Each player has 3 favorite jersey numbers
6. **Proper Display** - Shows "30, 33, 45" instead of "303345"
7. **Colored Attribute Bars** - Green/Blue/Orange/Red with 200px width
8. **AI Team Sorting** - All 11 opponent teams auto-sort A/B on day 7
9. **Daily Scrimmages** - Realistic gameplay with stat tracking
10. **Complete Stats** - LB, CTO, TO, PIM all tracked properly

---

## 🚀 Quick Start (3 Steps)

### 1. Extract the ZIP
Unzip `tallylax-v6.2-complete.zip` to any folder

### 2. Open in Browser
Double-click `index.html` to start playing

### 3. Start New Game
- Pick your organization (12 teams available)
- Enter your name
- Start managing!

---

## 📁 File Structure

```
tallylax-v6.2-complete/
├── index.html              ← START HERE
├── README.md              ← You are here
│
├── css/
│   ├── main.css
│   └── components/
│       ├── _tables.css
│       ├── _training_camp.css    ← Fixed white text
│       └── _save-load.css
│
├── js/
│   ├── core/              ← Foundation (loads first)
│   │   ├── constants.js
│   │   ├── game_state.js
│   │   ├── selectors.js
│   │   ├── rng.js
│   │   ├── keys.js
│   │   └── router.js      ← LOADS LAST
│   │
│   ├── data/              ← Static data
│   │   ├── teams.js       ← 12 organizations
│   │   └── traits.js      ← Player traits
│   │
│   ├── modules/           ← Game mechanics
│   │   ├── player_generator.js
│   │   ├── jersey_manager.js    ← NEW: Smart jersey system
│   │   └── season_manager.js    ← FIXED: Camp advancement
│   │
│   └── ui/                ← User interface
│       ├── ui_helpers.js
│       ├── ui_setup.js
│       ├── ui_dashboard.js
│       ├── ui_player_card.js    ← FIXED: Colored bars
│       ├── ui_roster.js
│       ├── ui_training_camp.js  ← FIXED: Clickable cards
│       ├── ui_training_camp_dashboard.js  ← NEW
│       ├── ui_stats.js
│       └── ui_calendar.js
│
└── images/                ← Team logos (12 .webp files)
    ├── hawks.webp
    ├── owls.webp
    └── ... (10 more)
```

---

## 🎯 Game Features

### Training Camp (Days 1-7)
- **Daily Clinics**: Defense (Day 2), Offense (Day 4), Conditioning (Day 6)
- **Daily Scrimmages**: Red vs Blue with realistic stats
- **Player Evaluation**: Click any player to see full profile
- **Team Assignment**: Auto-sort or manual A/B assignment
- **Jersey Selection**: Smart system prevents conflicts

### Player Management
- **Complete Attributes**: 12 runner, 10 goalie attributes
- **Full Stats Tracking**: GP, G, A, P, S, SOG, LB, CTO, TO, PIM, FO
- **Visual Indicators**: Color-coded attribute bars
- **Development**: Track player growth through devLog
- **Morale System**: Player and parent morale

### Organizations
- **12 Teams**: Hawks, Owls, Eagles, Lynx, Wolves, Coyotes, Moose, Bears, Beavers, Otters, Ravens, Foxes
- **5 Divisions**: U9, U11, U13, U15, U17
- **A/B Teams**: Each division splits into competitive tiers

---

## 🎮 How to Play

### Starting a New Game
1. Click "New Game" on setup screen
2. Select your organization
3. Enter your name as GM
4. Click "Start Game"

### Training Camp (Days 1-7)
1. **View Camp Dashboard** - See all divisions
2. **Select Division** - U9, U11, U13, U15, or U17
3. **Evaluate Players** - Click any player card for details
4. **Advance Day** - Run clinics and scrimmages
5. **Day 7** - All teams auto-sort to A/B
6. **Day 8** - Regular season begins

### Regular Season
- View rosters by division and level (A/B)
- Check standings and stats
- Advance through the season
- Make roster decisions

---

## 🔧 Technical Details

### ES5 Compliant
- No arrow functions
- No let/const (var only)
- No template literals
- IE11 compatible

### Sacred Data Flow
- **UI**: Read-only via Selectors
- **Modules**: Write to GameState
- **No DOM manipulation in modules**
- **Router handles all navigation**

### Load Order (Critical)
1. Core (constants, state, rng, keys)
2. Data (teams, traits)
3. Modules (generators, managers)
4. UI (views and components)
5. **Router (MUST BE LAST)**

---

## 🐛 Troubleshooting

### Game won't load?
- Check browser console for errors
- Ensure all files extracted properly
- Try Chrome or Firefox (latest versions)

### Player cards not clickable?
- Refresh page (Ctrl+F5 to clear cache)
- Check that router.js loaded last

### Text hard to read?
- Should be white on dark background
- Check _training_camp.css is present

### Camp won't advance?
- Click "Advance to Day X" button
- Check console for error messages
- Ensure season_manager.js loaded

---

## 📊 Complete Feature List

### Player Features
- ✅ 12 runner attributes (shooting, passing, defense, etc.)
- ✅ 10 goalie attributes (reflexes, positioning, etc.)
- ✅ 3 favorite jersey numbers per player
- ✅ Smart jersey conflict resolution
- ✅ Traits and parent traits
- ✅ Morale tracking
- ✅ Complete stat tracking (LB, CTO, TO)
- ✅ Development logging
- ✅ Color-coded attribute display

### Training Camp Features
- ✅ 7-day camp schedule
- ✅ Daily clinics (Defense, Offense, Conditioning)
- ✅ Daily scrimmages with stats
- ✅ Player evaluation
- ✅ Clickable player cards
- ✅ Auto and manual team sorting
- ✅ Jersey assignment
- ✅ White text for visibility

### Management Features
- ✅ 12 organizations
- ✅ 5 age divisions
- ✅ A/B team system
- ✅ Roster management
- ✅ Stats tracking
- ✅ Season progression

---

## 💾 Save System

### Auto-Save
- Game state saved to browser localStorage
- Persists between sessions

### Manual Save
- Export .tlxsave file
- Import to restore game

---

## 🏆 Credits

**Game Design**: Box Lacrosse Management Simulation
**Version**: 6.2 Complete Edition
**Platform**: Web Browser (HTML5 + JavaScript ES5)
**Date**: October 26, 2025

---

## 📝 Version History

### v6.2 (Current)
- ✅ Fixed all training camp issues
- ✅ Smart jersey system
- ✅ Complete stat tracking
- ✅ Enhanced UI/UX
- ✅ Performance improvements

### v6.0
- Initial release
- Basic training camp
- Player generation
- Team management

---

## 🎯 Known Limitations

- Browser-based (no mobile app yet)
- Single player only
- English language only
- Requires modern browser

---

## 🔮 Future Enhancements

- Regular season gameplay
- Playoff tournaments
- Advanced tactics
- Player injuries
- Contract negotiations
- Draft system
- Historical records

---

## 📧 Support

For issues or questions:
1. Check console for errors (F12)
2. Verify file structure
3. Clear browser cache
4. Try different browser

---

## 🎮 Enjoy TallyLax!

Start your career as a youth box lacrosse manager today!

**Good luck, Coach!** 🥍

---

**© 2025 TallyLax Manager | All Rights Reserved**
