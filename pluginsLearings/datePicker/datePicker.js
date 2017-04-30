/*datePicker*/
define('datePicker', ['jquery', 'exports'], function($, exports) {
    /*datePicker*/
    exports.picker = function(settings) {
        //some common useful function tools here
        var utils = {
            getCurrentDate: function() {
                var dates = {};
                var date = new Date();
                dates.year = date.getFullYear();
                dates.month = date.getMonth();
                dates.day = date.getDate();
                return dates
            },
            getWeekDay: function(year, month, day) {
                var date = new Date(year, month, day);
                return date.getDay();
            },
            caculate_month_table_rows: function(year, month, first_weekDay) {
                var m_days = utils.m_days(year);
                var m_day = m_days[month];
                return Math.ceil((m_day + first_weekDay) / 7);
            },
            isLeap: function(year) {
                return (year % 100 == 0 ? res = (year % 400 == 0 ? 1 : 0) : res = (year % 4 == 0 ? 1 : 0));
            },
            //caculate how many days that this year' every month has
            m_days: function(year) {
                m_days = new Array(31, 28 + utils.isLeap(year), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31);
                return m_days;
            },
            monthNames: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ], // Names of months for drop-down and formatting
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
            setDayNames: function(beginOn) {
                //begin on monday
                if (beginOn === "Monday") {
                    utils.dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ];
                    utils.dayNamesShort = ["MON", "TUE", "WEN", "THR", "FRI", "SAT", "SUN", ];
                }
            },
            changePickedDate: function(target, newDate) {
                utils.refreshCalendarAfterChangePickedDate(target, newDate);
                utils.refreshSelectAfterChangePickedDate(target, newDate);
                pickdDate.year = newDate.year;
                pickdDate.month = newDate.month;
                pickdDate.day = newDate.day;
            },
            refreshCalendarAfterChangePickedDate: function(target, newDate) {
                target.children(".calendar-container").remove();
                this.reRenderCalendar(newDate, target);
            },
            reRenderCalendar: function(newDate, target) {
                new calendar(newDate, target);
            },
            refreshSelectAfterChangePickedDate: function(target, newDate) {
                var daySelect = $(target.find("select")[0]);
                var monthSelect = $(target.find("select")[1]);
                var yearSelect = $(target.find("select")[2]);
                this.checkIsLeapYearFebruary(yearSelect.val(), newDate.year, monthSelect.val(), function() {
                    day_month_year_select.prototype.re_generate_day_options(newDate.year, newDate.month, newDate.day, daySelect);
                });
                this.refreshSelectSingle(daySelect, newDate.day - 1, newDate.day);
                this.refreshSelectSingle(monthSelect, newDate.month, utils.monthNames[newDate.month]);
                var yearIndex = +newDate.year - settings.minYear;
                this.refreshSelectSingle(yearSelect, yearIndex, newDate.year);
            },
            refreshSelectSingle: function(selectEl, newIndex, newVal) {
                selectEl.children().removeAttr("selected");
                $(selectEl.children()[newIndex]).attr("selected", "selected");
                selectEl.val(newVal);
            },
            checkIsLeapYearFebruary: function(originYear, newYear, month, callback) {
                //if changed leap year to another year or nonleap year to leap year and month is Febuary
                //we will change m_day and reGenerate day options
                if (utils.isLeap(originYear) !== utils.isLeap(newYear)) {
                    originYear = newYear;
                    if (month == "February") {
                        callback();
                    }
                }
            },
            //default bengin on sunday
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
            dayNamesShort: ["SUN", "MON", "TUE", "WEN", "THR", "FRI", "SAT"]
        };
        //if user set week start day is monday ,then we reset the bengin on day
        utils.setDayNames(settings.beginOn);
        var dayEl = $(settings.daySelectEl),
            monthEl = $(settings.monthSelectEl),
            yearEl = $(settings.yearSelectEl),
            iconEl = $(settings.iconEl),
            containerEl = dayEl.parent().parent("ul"),
            pickdDate = {};

        function day_month_year_select() {
            this._init();
            this._changes_select();
        }
        $.extend(day_month_year_select.prototype, {
            _init: function() {
                this._set_pickdDate();
                this._generate_year_options();
                this._generate_month_options();
                this._set_current_date();
            },
            _set_pickdDate: function() {
                pickdDate.year = utils.getCurrentDate().year;
                pickdDate.month = utils.getCurrentDate().month;
                pickdDate.day = utils.getCurrentDate().day;
            },
            //set today' date as select default value
            _set_current_date: function() {
                yearEl.children().last().attr("selected", "selected");
                $(monthEl.children()[pickdDate.month]).attr("selected", "selected");
                var m_day = this.caculate_m_day(pickdDate.year, pickdDate.month);
                this._generate_day_options(m_day);
                $(dayEl.children()[pickdDate.day - 1]).attr("selected", "selected");
            },
            //generate option element behind select element
            _generate_option: function(value) {
                var option = $("<option value='" + value + "'>" + value + "</option>");
                return option;
            },
            _generate_day_options: function(m_day) {
                var _this = this;
                for (var i = 1; i <= m_day; i++) {
                    dayEl.append(_this._generate_option(i));
                }
            },
            _generate_month_options: function() {
                var _this = this;
                for (var i = 0; i < utils.monthNames.length; i++) {
                    monthEl.append(_this._generate_option(utils.monthNames[i]));
                }
            },
            _generate_year_options: function() {
                var _this = this;
                var year = pickdDate.year;
                for (var i = settings.minYear; i <= year; i++) {
                    yearEl.append(_this._generate_option(i));
                }
            },
            caculate_m_day: function(year, month) {
                var m_day = utils.m_days(year)[month];
                return m_day;
            },
            _changes_select: function() {
                this._change_year();
                this._change_month();
                this._change_day();
            },
            _change_year: function() {
                var _this = this;
                yearEl.on('change', function() {
                    var self = this;
                    //if changed leap year to another year or nonleap year to leap year and month is Febuary
                    //we will change m_day and reGenerate day options
                    utils.checkIsLeapYearFebruary(pickdDate.year, $(this).val(), monthEl.val(), function() {
                        _this.re_generate_day_options($(self).val(), pickdDate.month, pickdDate.day, dayEl)
                    });
                    pickdDate.year = $(this).val();
                });
            },
            _change_month: function() {
                var _this = this;
                monthEl.on('change', function() {
                    pickdDate.month = this.selectedIndex;
                    _this.re_generate_day_options(pickdDate.year, pickdDate.month, pickdDate.day, dayEl);
                });
            },
            _change_day: function() {
                dayEl.on('change', function() {
                    pickdDate.day = +$(this).val();
                });
            },
            re_generate_day_options: function(year, month, day, dayEl) {
                dayEl.children().remove();
                var m_day = this.caculate_m_day(year, month);
                this._generate_day_options(m_day);
                $(dayEl.children()[+day - 1]).attr("selected", "selected");
            }

        });
        new day_month_year_select();

        function calendar(date, container) {
            this._init(date, container);
        }
        $.extend(calendar.prototype, {
            _init: function(date, container) {
                this._render_calendar(date, container);
            },
            _destory_calendar: function(calendar) {
                calendar.fadeOut().remove();
            },
            _render_calendar: function(date, container) {
                var calendar_container = this._render_calendar_container();
                var calendar_header = this._render_calendar_header(date);
                var calendar_weeks = this._render_calendar_weeks();
                var calendar_days = this._render_calendar_days(date);
                var triangle_btn = $("<div class='calendar-triangle'></div>");
                container.append(calendar_container);
                calendar_container.append(calendar_header).append(calendar_weeks).append(calendar_days).append(triangle_btn);
            },
            _render_calendar_container: function() {
                var calendar_container = $("<div class='calendar-container'></div>");
                return calendar_container;
            },
            _render_calendar_header: function(date) {
                var calendar_header = $("<div class='calendar-header'></div>");
                var calendar_prev = $("<div class='calendar-prev'><span class='fa fa-angle-left'></span></div>");
                var calendar_next = $("<div class='calendar-next'><span class='fa fa-angle-right'></span></div>");
                var month_and_year_text_container = $("<h3 class='month-year-text-container'></h3>");
                var month_text = $("<span class='month-text'>" + utils.monthNames[date.month] + "</span>");
                var year_text = $("<span class='year-text'>" + date.year + "</span>");
                var calendar_header_btn_container = this._render_calendar_header_btn_container();
                month_and_year_text_container.append(month_text).append(year_text);
                calendar_header.append(calendar_header_btn_container).append(calendar_prev).append(month_and_year_text_container).append(calendar_next);
                return calendar_header
            },
            _render_calendar_header_btn_container: function() {
                var calendar_header_btn_container = $("<div class='calendar-header-btn-container'></div>");
                var today_btn = this._generate_today_reset_btn();
                var close_btn = this._generate_close_calendar_btn();
                calendar_header_btn_container.append(today_btn).append(close_btn);
                return calendar_header_btn_container;
            },
            _render_calendar_weeks: function() {
                var calendar_weeks = $("<ul class='calendar-weeks'></ul>");
                for (var i = 0; i < utils.dayNamesShort.length; i++) {
                    var week = $("<li class='calendar-week'>" + utils.dayNamesShort[i] + "</li>");
                    calendar_weeks.append(week);
                }
                return calendar_weeks;
            },
            _render_calendar_days: function(date) {
                var calendar_days = $("<div class='calendar-days'></div>");
                var calendar_table = $("<table></table>");
                var calendar_tbody = this._generate_month_days(date.year, date.month, 1, date);
                calendar_table.append(calendar_tbody);
                calendar_days.append(calendar_table);
                return calendar_days
            },
            _generate_month_days: function(year, month, day, date) {
                var calendar_tbody = $("<tbody></tbody>");
                var first_weekDay = utils.getWeekDay(year, month, day);
                //if user set week start day is monday ,then we reset the bengin on day
                if (settings.beginOn === "Monday") {
                    first_weekDay--
                }
                var rows = utils.caculate_month_table_rows(year, month, first_weekDay);
                var m_day = utils.m_days(year)[month];
                var prev_m_day = utils.m_days(year)[month - 1];
                var first_line = this._generate_month_days_first_line(first_weekDay, prev_m_day, date);
                calendar_tbody.append(first_line);
                this._generate_month_days_remain_lines(calendar_tbody, first_weekDay, rows, m_day, date);
                return calendar_tbody
            },
            _generate_month_days_first_line: function(first_weekDay, prev_m_day, date) {
                var tr = $("<tr></tr>");
                var _this = this;
                var index = 1;
                for (var i = 0; i < 7; i++) {
                    var td = $("<td style='width:36.8px;text-align:center;'></td>");
                    if (i >= first_weekDay) {
                        td.append(_this._generate_td_inner_a(index));
                        _this._set_picked_date_highlight(td, index, date);
                        index++
                    } else {
                        var a = _this._generate_td_inner_a(_this._generate_prev_month_days_first_line(first_weekDay, prev_m_day, i));
                        td.append(a);
                        td.addClass("last-month");
                    }
                    tr.append(td);
                }
                return tr
            },
            _generate_td_inner_a: function(i) {
                var a = $("<a class='calendar-days-a'></a>");
                a.append(i);
                return a
            },
            _generate_prev_month_days_first_line: function(first_weekDay, prev_m_day, i) {
                var index = prev_m_day - first_weekDay + i + 1;
                return index
            },
            _generate_month_days_remain_lines: function(calendar_tbody, first_weekDay, rows, m_day, date) {
                var _this = this;
                var index = 7 - first_weekDay;
                var isNextM = false;
                for (var i = 0; i < rows - 1; i++) {
                    var tr = $("<tr></tr>");
                    for (var j = 0; j < 7; j++) {
                        var td = $("<td style='width:36.8px;text-align:center;'></td>");
                        if (index > m_day - 1) {
                            index = 0;
                            isNextM = true;
                        }
                        if (isNextM) {
                            td.addClass("next-month")
                        } else {
                            _this._set_picked_date_highlight(td, index + 1, date);
                        }
                        index++
                        td.append(_this._generate_td_inner_a(index));
                        tr.append(td);
                    }
                    calendar_tbody.append(tr);
                }
            },
            _generate_today_reset_btn: function() {
                var btn = $("<input class='calendar-today-reset' type='button' value='Today'>");
                btn.on("click", function(e) {
                    var date = utils.getCurrentDate();
                    var target = $(this).parents(".register-input-container-group");
                    utils.changePickedDate(target, date);
                });
                return btn
            },
            _generate_close_calendar_btn: function() {
                var _this = this;
                var btn = $("<span class='fa fa-close close-calendar'></span>");
                btn.on("click", function(e) {
                    var calendar = $(this).parents(".calendar-container");
                    _this._destory_calendar(calendar);
                });
                return btn
            },
            _set_picked_date_highlight: function(td, i, date) {
                if (date.day === i) {
                    td.addClass("pickd-day");
                }
            }
        });

        function events() {
            this._init();
        }
        $.extend(events.prototype, {
            _init: function() {
                this._iconEl_click();
                this._document_click();
            },
            _iconEl_click: function() {
                iconEl.click(function(e) {
                    calendar.prototype._destory_calendar($(".calendar-container"));
                    new calendar(pickdDate, containerEl);
                });
            },
            _document_click: function() {
                $(document).on("click", function(e) {
                    //if user clicked element is not in calendar, then we fade out the calendar
                    if (!!!$(e.target).parents(".register-input-container-group").length && !!$(".calendar-container")) {
                        if (e.target.className !== "calendar-today-reset") {
                            calendar.prototype._destory_calendar($(".calendar-container"));
                        }
                    }
                });
            },
            _prev_month:function(){

            },
            _next_month:function(){
                
            }
        });
        new events();

    }

});
