// js/ui/ui_calendar.js - In-Game Season Calendar (FIXED)
(function() {
    'use strict';
    window.TallyLax = window.TallyLax || {};
    
    var UICalendar = {
        currentMonthOffset: 0,
        
        show: function() {
            var state = window.TallyLax.GameState;
            var headerTitle = document.getElementById('main-header-title');
            if (headerTitle) {
                headerTitle.textContent = 'Season Calendar';
            }
            this.currentMonthOffset = Math.floor((state.currentDay - 1) / 28);
            
            this.render();
        },

        navigate: function(direction) {
            this.currentMonthOffset += direction;
            if (this.currentMonthOffset < 0) this.currentMonthOffset = 0;
            if (this.currentMonthOffset > 6) this.currentMonthOffset = 6;
            
            this.render();
        },
        
        getGamesForDay: function(day) {
            var state = window.TallyLax.GameState;
            if (!state.schedule || !state.schedule[day]) {
                return [];
            }
            return state.schedule[day];
        },
        
        getUserGamesForDay: function(day) {
            var games = this.getGamesForDay(day);
            return games.filter(function(g) {
                return g.homeTeam && g.homeTeam.indexOf('Kespek Bears') === 0 ||
                       g.awayTeam && g.awayTeam.indexOf('Kespek Bears') === 0;
            });
        },
        
        getSeasonPhase: function(day) {
            if (day <= 5) return 'Training Camp';
            if (day >= 6 && day <= 36) return 'Regular Season - Segment 1';
            if (day >= 37 && day <= 47) return 'Tournament 1';
            if (day >= 48 && day <= 78) return 'Regular Season - Segment 2';
            if (day >= 79 && day <= 89) return 'Mid-Season Break';
            if (day >= 90 && day <= 120) return 'Regular Season - Segment 3';
            if (day >= 121 && day <= 131) return 'Tournament 2';
            if (day >= 132 && day <= 162) return 'Regular Season - Segment 4';
            if (day >= 163 && day <= 196) return 'Playoffs';
            if (day === 197) return 'Season Awards';
            return 'Off-Season';
        },
        
        render: function() {
            var mainContent = document.getElementById('main-content-panel');
            var monthName = 'Month ' + (this.currentMonthOffset + 1);
            var seasonName = 'Season ' + window.TallyLax.GameState.currentSeason;

            var html = '<div class="calendar-container">';
            html += '<div class="calendar-header">';
            html += '<h2>' + seasonName + ' - ' + monthName + '</h2>';
            html += '<div class="calendar-nav btn-group">';
            html += '<button class="btn btn-secondary" onclick="window.TallyLax.UICalendar.navigate(-1)">&lt; Prev</button>';
            html += '<button class="btn btn-secondary" onclick="window.TallyLax.UICalendar.navigate(1)">Next &gt;</button>';
            html += '</div></div>';

            html += '<div class="calendar-grid">';
            
            // Day headers
            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            daysOfWeek.forEach(function(day) {
                html += '<div class="day-header">' + day + '</div>';
            });

            var startDay = (this.currentMonthOffset * 28) + 1;
            var endDay = startDay + 27;

            for (var i = startDay; i <= endDay; i++) {
                var day = i;
                if (day > 197) {
                     html += '<div class="day-cell other-month"></div>';
                     continue;
                }

                var classes = 'day-cell';
                var markers = '';
                
                if (day === window.TallyLax.GameState.currentDay) {
                    classes += ' current-day';
                }

                var userGamesToday = this.getUserGamesForDay(day);

                if (userGamesToday.length > 0) {
                    markers += '<span class="event-marker game-day">Game Day</span>';
                }

                var phase = this.getSeasonPhase(day);
                if (phase.includes('Tournament')) {
                    markers += '<span class="event-marker tournament">Tournament</span>';
                } else if (phase.includes('Playoffs')) {
                    markers += '<span class="event-marker playoffs">Playoffs</span>';
                } else if (phase.includes('Break')) {
                     markers += '<span class="event-marker break">Break</span>';
                }

                html += '<div class="' + classes + '">';
                html += day;
                html += '<div class="event-markers">' + markers + '</div>';
                html += '</div>';
            }

            html += '</div></div>';
            mainContent.innerHTML = html;
        }
    };
    
    window.TallyLax.UICalendar = UICalendar;
    console.log('âœ… UICalendar loaded');
})();
