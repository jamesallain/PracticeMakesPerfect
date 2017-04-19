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
            getWeekDay:function(year,month,day){
            	var date = new Date(year,month,day);
            	return date.getDay();
            },
            caculate_month_table_rows:function(year,month,first_weekDay){
            	var m_days = utils.m_days(year);
            	var m_day = m_days[month];
            	return Math.ceil((m_day + first_weekDay)/7);
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
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        }
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
                    //if changed leap year to another year or nonleap year to leap year and month is Febuary
                    //we will change m_day and reGenerate day options
                    if (utils.isLeap(pickdDate.year) !== utils.isLeap($(this).val())) {
                        pickdDate.year = $(this).val();
                        if (monthEl.val() == "February") {
                        	_this.re_generate_day_options();
                        }
                    }
                    pickdDate.year = $(this).val();
                });
            },
            _change_month: function() {
            	var _this =this;
                monthEl.on('change', function() {
                    pickdDate.month = this.selectedIndex;
                    _this.re_generate_day_options();
                });
            },
            _change_day: function() {
                dayEl.on('change', function() {
                    pickdDate.day = +$(this).val();
                });
            },
            re_generate_day_options: function() {
                dayEl.children().remove();
                var m_day = this.caculate_m_day(pickdDate.year, pickdDate.month);
                this._generate_day_options(m_day);
                $(dayEl.children()[+pickdDate.day - 1]).attr("selected", "selected");
            }

        });
        new day_month_year_select();
        function calendar(){
        	this._init();
        }
        $.extend(calendar.prototype,{
        	_init:function(){
        		var _this = this;
        		iconEl.click(function(e){
        			_this._render_calendar();
        		});
        	},
        	_render_calendar:function(){
        		var calendar_container = this._render_calendar_container();
        		var calendar_header = this._render_calendar_header();
        		var calendar_weeks = this._render_calendar_weeks();
        		var calendar_days  =this._render_calendar_days();
        		containerEl.append(calendar_container);
        		calendar_container.append(calendar_header).append(calendar_weeks).append(calendar_days);
        	},
        	_render_calendar_container:function(){
        		var calendar_container = $("<div class='calendar-container'></div>");
        		return calendar_container;
        	},
        	_render_calendar_header:function(){
        		var calendar_header = $("<div class='calendar-header'></div>");
        		var calendar_prev = $("<div class='calendar-prev'><span class='fa fa-arrow-left'></span></div>");
        		var calendar_next = $("<div class='calendar-next'><span class='fa fa-arrow-right'></span></div>");
        		var month_and_year_text_container = $("<h3 class='month-year-text-container'></h3>");
        		var month_text = $("<span class='month-text'>"+utils.monthNames[pickdDate.month]+"</span>");
        		var year_text = $("<span class='year-text'>"+pickdDate.year+"</span>");
        		month_and_year_text_container.append(month_text).append(year_text);
        		calendar_header.append(calendar_prev).append(month_and_year_text_container).append(calendar_next);
        		return calendar_header
        	},
        	_render_calendar_weeks:function(){
        		var calendar_weeks = $("<ul class='calendar-weeks'></ul>");
        		for(var i=0; i<utils.dayNamesShort.length;i++){
        			var week = $("<li class='calendar-week'>"+utils.dayNamesShort[i]+"</li>");
        			calendar_weeks.append(week);
        		}
        		return calendar_weeks;
        	},
        	_render_calendar_days:function(){
        		var calendar_days = $("<div class='calendar-days'></div>");
        		var calendar_table = $("<table></table>");
        		var calendar_tbody = this._generate_month_days(pickdDate.year,pickdDate.month,1);
        		calendar_table.append(calendar_tbody);
        		calendar_days.append(calendar_table);
        		return calendar_days
        	},
        	_generate_month_days:function(year,month,day){
        		var calendar_tbody = $("<tbody></tbody>");
        		var first_weekDay = utils.getWeekDay(year,month,day);
        		var rows = utils.caculate_month_table_rows(year,month,first_weekDay);
        		var m_day = utils.m_days(year)[month];
        		var first_line= this._generate_month_days_first_line(first_weekDay);
        		calendar_tbody.append(first_line);
        		this._generate_month_days_remain_lines(calendar_tbody,first_weekDay,rows,m_day);
        		return calendar_tbody
        	},
        	_generate_month_days_first_line:function(first_weekDay){
        		var tr = $("<tr></tr>");
        		var index =1;
        		for(var i =0; i<7; i++){
        			var td = $("<td style='width:36.8px;text-align:center;'></td>");
        			if(i>=first_weekDay){
        				td.append(index);
        				index++
        			}
        			tr.append(td);
        		}
        		return tr
        	},
        	_generate_month_days_remain_lines:function(calendar_tbody,first_weekDay,rows,m_day){
        		var _this = this;
        		var index = 7-first_weekDay;
        		for(var i =0; i<rows-1;i++){
        			var tr = $("<tr></tr>");
        			for(var j =0; j<7; j++){
        				if(index>m_day-1){
        					index =0;
        				}
        				index++
        				var td = $("<td style='width:36.8px;text-align:center;'>"+index+"</td>");
        				tr.append(td);
        			}
        			calendar_tbody.append(tr);
        		}
        	}

        });
        new calendar();
    }

});
