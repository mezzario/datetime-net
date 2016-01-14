/// <reference path="../typings/tsd.d.ts" />
"use strict";
var Utils = require("./utils");
var en_1 = require("./locale/en");
(function (DateTimeKind) {
    DateTimeKind[DateTimeKind["Unspecified"] = 0] = "Unspecified";
    DateTimeKind[DateTimeKind["Utc"] = 1] = "Utc";
    DateTimeKind[DateTimeKind["Local"] = 2] = "Local";
})(exports.DateTimeKind || (exports.DateTimeKind = {}));
var DateTimeKind = exports.DateTimeKind;
(function (DateTimeMode) {
    DateTimeMode[DateTimeMode["DateTime"] = 0] = "DateTime";
    DateTimeMode[DateTimeMode["Date"] = 1] = "Date";
    DateTimeMode[DateTimeMode["Time"] = 2] = "Time";
})(exports.DateTimeMode || (exports.DateTimeMode = {}));
var DateTimeMode = exports.DateTimeMode;
var DateTime = (function () {
    function DateTime(yearOrTicksOrDate, month, day, hour, minute, sec, msec) {
        this.kind = DateTimeKind.Unspecified;
        var ticksOrDate;
        if (typeof yearOrTicksOrDate === "undefined") {
            ticksOrDate = new Date().getTime() + DateTime.getTimezoneOffsetTicks();
            this.kind = DateTimeKind.Local;
        }
        else if (typeof month === "undefined") {
            ticksOrDate = yearOrTicksOrDate;
            if (typeof ticksOrDate === "string") {
                var ticks = DateTime.MsDateRe.exec(ticksOrDate);
                if (ticks !== null) {
                    ticksOrDate = +ticks[1];
                    this.kind = DateTimeKind.Utc;
                }
                else if (DateTime.IsoDateRe.test(ticksOrDate))
                    this.kind = DateTimeKind.Utc;
            }
            else if (ticksOrDate instanceof DateTime)
                this.kind = yearOrTicksOrDate.kind;
        }
        else {
            ticksOrDate = Date.UTC(yearOrTicksOrDate, month - 1, day || 1, hour || 0, minute || 0, sec || 0, msec || 0);
            this.kind = DateTimeKind.Local;
        }
        this.value = new Date(ticksOrDate instanceof DateTime ? ticksOrDate.getTicks() : ticksOrDate);
    }
    DateTime.prototype.getYears = function () { return this.value.getUTCFullYear(); };
    DateTime.prototype.getMonths = function () { return this.value.getUTCMonth() + 1; };
    DateTime.prototype.getTotalMonths = function () { return Math.abs(this.getYears()) * 12 + this.getMonths(); };
    DateTime.prototype.getDays = function () { return this.value.getUTCDate(); };
    DateTime.prototype.getDayOfWeek = function () { return this.value.getUTCDay(); };
    DateTime.prototype.getHours = function () { return this.value.getUTCHours(); };
    DateTime.prototype.getMinutes = function () { return this.value.getUTCMinutes(); };
    DateTime.prototype.getSeconds = function () { return this.value.getUTCSeconds(); };
    DateTime.prototype.getMilliseconds = function () { return this.value.getUTCMilliseconds(); };
    DateTime.prototype.getTicks = function () { return this.value.getTime(); };
    DateTime.prototype.getKind = function () { return this.kind; };
    DateTime.prototype.setYears = function (value) { this.value.setUTCFullYear(value); return this; };
    DateTime.prototype.setMonths = function (value) { this.value.setUTCMonth(value - 1); return this; };
    DateTime.prototype.setDays = function (value) { this.value.setUTCDate(value); return this; };
    DateTime.prototype.setHours = function (value) { this.value.setUTCHours(value); return this; };
    DateTime.prototype.setMinutes = function (value) { this.value.setUTCMinutes(value); return this; };
    DateTime.prototype.setSeconds = function (value) { this.value.setUTCSeconds(value); return this; };
    DateTime.prototype.setMilliseconds = function (value) { this.value.setUTCMilliseconds(value); return this; };
    DateTime.prototype.setTicks = function (value) { this.value = new Date(value); return this; };
    DateTime.prototype.setKind = function (value) { this.kind = value; return this; };
    DateTime.prototype.incYears = function (value) {
        if (value === void 0) { value = 1; }
        return this.setYears(this.getYears() + value);
    };
    DateTime.prototype.incMonths = function (value) {
        if (value === void 0) { value = 1; }
        return this.setMonths(this.getMonths() + value);
    };
    DateTime.prototype.incDays = function (value) {
        if (value === void 0) { value = 1; }
        return this.setDays(this.getDays() + value);
    };
    DateTime.prototype.incHours = function (value) {
        if (value === void 0) { value = 1; }
        return this.setHours(this.getHours() + value);
    };
    DateTime.prototype.incMinutes = function (value) {
        if (value === void 0) { value = 1; }
        return this.setMinutes(this.getMinutes() + value);
    };
    DateTime.prototype.incSeconds = function (value) {
        if (value === void 0) { value = 1; }
        return this.setSeconds(this.getSeconds() + value);
    };
    DateTime.prototype.incMilliseconds = function (value) {
        if (value === void 0) { value = 1; }
        return this.setMilliseconds(this.getMilliseconds() + value);
    };
    DateTime.prototype.incTicks = function (value) {
        if (value === void 0) { value = 1; }
        return this.setTicks(this.getTicks() + value);
    };
    DateTime.prototype.addYears = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incYears(value);
    };
    DateTime.prototype.addMonths = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incMonths(value);
    };
    DateTime.prototype.addDays = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incDays(value);
    };
    DateTime.prototype.addHours = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incHours(value);
    };
    DateTime.prototype.addMinutes = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incMinutes(value);
    };
    DateTime.prototype.addSeconds = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incSeconds(value);
    };
    DateTime.prototype.addMilliseconds = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incMilliseconds(value);
    };
    DateTime.prototype.addTicks = function (value) {
        if (value === void 0) { value = 1; }
        return new DateTime(this).incTicks(value);
    };
    DateTime.prototype.floor = function (to) { return this.setTicks(DateTime.floorTicks(this, to)); };
    DateTime.prototype.toLocalTime = function () { return this.convertTime(true); };
    DateTime.prototype.toUniversalTime = function () { return this.convertTime(false); };
    DateTime.prototype.getDate = function () {
        return new DateTime(this).floor("day").setKind(DateTimeKind.Unspecified);
    };
    DateTime.prototype.setDate = function (value, month, day) {
        if (value instanceof Date
            || value instanceof DateTime
            || typeof month === "undefined") {
            var temp = DateTime.cast(value);
            value = temp.getYears();
            month = temp.getMonths();
            day = temp.getDays();
        }
        return this
            .setYears(value)
            .setMonths(month)
            .setDays(day || 1);
    };
    DateTime.prototype.getTime = function () {
        return new DateTime(1970, 1, 1, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds())
            .setKind(DateTimeKind.Unspecified);
    };
    DateTime.prototype.setTime = function (value, min, sec, msec) {
        if (value instanceof Date
            || value instanceof DateTime
            || typeof min === "undefined") {
            var temp = DateTime.cast(value);
            value = temp.getHours();
            min = temp.getMinutes();
            sec = temp.getSeconds();
            msec = temp.getMilliseconds();
        }
        return this
            .setHours(value)
            .setMinutes(min)
            .setSeconds(sec || 0)
            .setMilliseconds(msec || 0);
    };
    DateTime.prototype.valueOf = function () {
        return this.getTicks();
    };
    DateTime.prototype.toString = function () {
        return this.format("yyyy-MM-dd HH:mm:ss.l")
            + (this.getKind() === DateTimeKind.Local ? " (local)" : "")
            + (this.getKind() === DateTimeKind.Utc ? " (utc)" : "");
    };
    DateTime.prototype.compareTo = function (value, floorTo) {
        var dateTime1 = this;
        var dateTime2 = DateTime.cast(value);
        if (dateTime1.getKind() !== dateTime2.getKind()
            && dateTime1.getKind() !== DateTimeKind.Unspecified
            && dateTime2.getKind() !== DateTimeKind.Unspecified) {
            dateTime2 = dateTime1.getKind() === DateTimeKind.Utc
                ? dateTime2.toUniversalTime()
                : dateTime2.toLocalTime();
        }
        return DateTime.floorTicks(dateTime1, floorTo) - DateTime.floorTicks(dateTime2, floorTo);
    };
    DateTime.prototype.humanize = function (options, localeConfig, humanizeFormats) {
        if (localeConfig === void 0) { localeConfig = en_1.default.config; }
        if (humanizeFormats === void 0) { humanizeFormats = en_1.default.humanizeFormats.short; }
        options = Utils.objectAssign({
            useDate: true,
            useTime: true,
            alwaysWithTime: true,
            singleLine: true,
            separator: "|"
        }, options);
        if (!options.useDate && !options.useTime)
            throw "DateTime.toSimpleText: one of the 'options.useDate' or 'options.useTime' must be true";
        var fmts = humanizeFormats;
        var dateTimeNow = DateTime.cast(options.dateTimeNow);
        var dateStr = "";
        var timeStr = "";
        if (options.useDate) {
            var temp = new DateTime(dateTimeNow);
            var crLeft = this.compareTo(temp.incDays(-7), "day");
            var crRight = this.compareTo(temp.incDays(14), "day");
            if (crLeft >= 0 && crRight <= 0) {
                var res = [];
                res[0] = fmts.dateWeekAgo;
                res[6] = fmts.dateYesterday;
                res[7] = fmts.dateToday;
                res[8] = fmts.dateTomorrow;
                res[14] = fmts.dateInWeek;
                for (var i = -7; i <= 7; i++) {
                    if (this.compareTo(dateTimeNow.addDays(i), "day") === 0) {
                        dateStr = res[i + 7] || (i < 0 ? fmts.dateDaysAgo.replace("{0}", String(-i)) : fmts.dateInDays.replace("{0}", String(i)));
                        break;
                    }
                }
            }
            else {
                if (this.getYears() === dateTimeNow.getYears())
                    dateStr = this.format(localeConfig.abbreviatedMonthDayPattern);
                else if (this.getYears() > localeConfig.twoDigitYearMax - 100 && this.getYears() <= localeConfig.twoDigitYearMax)
                    dateStr = this.format(localeConfig.abbreviatedShortDatePattern);
                else
                    dateStr = this.format(localeConfig.abbreviatedDatePattern);
            }
        }
        if (options.useTime) {
            if (this.compareTo(dateTimeNow, "day") === 0)
                dateStr = "";
            var periodMsecs = ((23 * 60 + 29) * 60 + 59) * 1000 + 999; // number of milliseconds in 23:29:59.999
            var temp = new DateTime(dateTimeNow);
            var crLeft = this.compareTo(temp.incMilliseconds(-periodMsecs));
            var crRight = this.compareTo(temp.incMilliseconds(periodMsecs * 2));
            if (crLeft >= 0 && crRight <= 0) {
                dateStr = "";
                var diffMsecs = this.getTicks() - dateTimeNow.getTicks();
                if (Math.abs(diffMsecs) < 59 * 1000 + 500) {
                    var val = +(diffMsecs / 1000).toFixed();
                    timeStr = (Math.abs(val) <= 1)
                        ? (val <= 0
                            ? fmts.timeSecondAgo
                            : fmts.timeInSecond)
                        : (val < 0
                            ? fmts.timeSecondsAgo.replace("{0}", String(Math.abs(val)))
                            : fmts.timeInSeconds.replace("{0}", String(val)));
                }
                else if (Math.abs(diffMsecs) < (59 * 60 + 29) * 1000 + 500) {
                    var val = +(diffMsecs / (60 * 1000)).toFixed();
                    timeStr = (Math.abs(val) <= 1)
                        ? (val <= 0
                            ? fmts.timeMinuteAgo
                            : fmts.timeInMinute)
                        : (val < 0
                            ? fmts.timeMinutesAgo.replace("{0}", String(Math.abs(val)))
                            : fmts.timeInMinutes.replace("{0}", String(val)));
                }
                else {
                    var val = +(diffMsecs / (60 * 60 * 1000)).toFixed();
                    timeStr = (Math.abs(val) <= 1)
                        ? (val <= 0
                            ? fmts.timeHourAgo
                            : fmts.timeInHour)
                        : (val < 0
                            ? fmts.timeHoursAgo.replace("{0}", String(Math.abs(val)))
                            : fmts.timeInHours.replace("{0}", String(val)));
                }
            }
            else if (options.alwaysWithTime)
                timeStr = this.format(localeConfig.shortTimePattern);
        }
        return options.singleLine
            ? (dateStr && timeStr
                ? fmts.dateTimeCombined
                    .replace("{0}", dateStr.replace(options.separator, " "))
                    .replace("{1}", timeStr.replace(options.separator, " "))
                : dateStr.replace(options.separator, " ") + timeStr.replace(options.separator, " "))
            : (dateStr && timeStr
                ? [dateStr.replace(options.separator, " "), timeStr.replace(options.separator, " ")]
                : (dateStr
                    ? dateStr.split(options.separator)
                    : timeStr.split(options.separator)));
    };
    DateTime.prototype.toDisplayString = function (options, localeConfig) {
        if (localeConfig === void 0) { localeConfig = en_1.default.config; }
        options = Utils.objectAssign({}, options);
        options.dateTimeNow = DateTime.now().setYears(localeConfig.twoDigitYearMax - 100 - 1);
        return this.humanize(options, localeConfig);
    };
    // http://blog.stevenlevithan.com/archives/date-time-format/comment-page-3
    DateTime.prototype.format = function (mask, localeConfig) {
        if (localeConfig === void 0) { localeConfig = en_1.default.config; }
        var token = /d{1,4}|M{1,4}|y{1,4}|([Hhms])\1?|tt|[Ll]|"[^"]*"|'[^']*'/g;
        var pad = Utils.pad;
        var d = this.getDays(), D = this.getDayOfWeek(), M = this.getMonths(), y = this.getYears(), H = this.getHours(), m = this.getMinutes(), s = this.getSeconds(), L = this.getMilliseconds(), flags = {
            d: d,
            dd: pad(d),
            ddd: localeConfig.abbreviatedDayNames[D],
            dddd: localeConfig.dayNames[D],
            M: M,
            MM: pad(M),
            MMM: localeConfig.abbreviatedMonthNames[M - 1],
            MMMM: localeConfig.monthNames[M - 1],
            y: Number(String(y).slice(2)),
            yy: String(y).slice(2),
            yyy: pad(y, 3),
            yyyy: pad(y, 4),
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            m: m,
            mm: pad(m),
            s: s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            tt: H < 12 ? "AM" : "PM"
        };
        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
    DateTime.prototype.convertTime = function (toLocal) {
        var result = new DateTime(this);
        if ((toLocal && (result.getKind() !== DateTimeKind.Local))
            || (!toLocal && (result.getKind() !== DateTimeKind.Utc))) {
            return result
                .incMilliseconds(DateTime.getTimezoneOffsetTicks() * (toLocal ? 1 : -1))
                .setKind(toLocal ? DateTimeKind.Local : DateTimeKind.Utc);
        }
        return result;
    };
    DateTime.getTimezoneOffsetTicks = function () {
        var now = new Date();
        var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        return now.getTime() - nowUtc.getTime();
    };
    DateTime.cast = function (value) {
        return (value instanceof DateTime) ? value : new DateTime(value);
    };
    DateTime.utcNow = function () {
        return new DateTime().toUniversalTime();
    };
    DateTime.now = function () {
        return new DateTime();
    };
    DateTime.getTimezoneOffset = function () {
        return +(DateTime.getTimezoneOffsetTicks() / 60 / 60 / 1000).toFixed(1);
    };
    DateTime.is24HoursPattern = function (pattern) {
        var hourFormat = new RegExp("h+", "i").exec(pattern);
        return !hourFormat || Utils.isUpperCase(hourFormat[0]);
    };
    DateTime.parseDate = function (s, localeConfig) {
        if (localeConfig === void 0) { localeConfig = en_1.default.config; }
        var re = /^(\d{1,4})(([\.\-\/ ] ?(\d{1,2})([\.\-\/ ] ?(\d{1,4}))?(?:$| +.*$))|$)/i;
        var matches = re.exec(Utils.trim(s));
        if (matches) {
            var parts = [matches[1]];
            if (matches[4] != null)
                parts[1] = matches[4];
            if (matches[6] != null)
                parts[2] = matches[6];
            var curDate = DateTime.now();
            var co = localeConfig.dateCompsOrder;
            var year = (parts.length === 3) ? +parts[co.indexOf("y")] : curDate.getYears();
            var month = (parts.length >= 2) ? +parts[(parts.length === 2 ? co.replace("y", "") : co).indexOf("m")] : curDate.getMonths();
            var day = (parts.length === 1) ? +parts[0] : +parts[(parts.length === 2 ? co.replace("y", "") : co).indexOf("d")];
            if ((year >= 1) && (year <= 9999)
                && (month >= 1) && (month <= 12)
                && (day >= 1) && (day <= 31)) {
                if (year < 100) {
                    var major = Math.round(localeConfig.twoDigitYearMax / 100) * 100;
                    var minor = localeConfig.twoDigitYearMax - major;
                    year = (year <= minor) ? (major + year) : (major + year - 100);
                }
                var date = new DateTime(year, month, day);
                if (!isNaN(date.getTicks())
                    && date.getYears() === year
                    && date.getMonths() === month
                    && date.getDays() === day
                    && date.getTicks() >= DateTime.cast(localeConfig.minSupportedDate).getTicks()
                    && date.getTicks() <= DateTime.cast(localeConfig.maxSupportedDate).getTicks()) {
                    return date;
                }
            }
        }
        return null;
    };
    DateTime.parseTime = function (s) {
        var re = /^(0?\d|1\d|2[0-3]|am?|pm?)(([\.\: ](0?\d|[1-5]\d|am?|pm?)([\.\: ](0?\d|[1-5]\d|am?|pm?))?(?:$| +.*$))|$)/i;
        var matches = re.exec(Utils.trim(s));
        if (matches) {
            var parts = [matches[1]];
            if (matches[4] != null)
                parts[1] = matches[4];
            if (matches[6] != null)
                parts[2] = matches[6];
            var periodCount = 0;
            var numbers = [];
            var am = true;
            for (var i = 0, j = 0; i < parts.length; i++) {
                var n = parseInt(parts[i], 10);
                if (isNaN(n)) {
                    am = (parts[i][0].toLowerCase() === "a");
                    n = (am ? -1 : -2);
                    periodCount++;
                }
                else
                    numbers[j++] = n;
                if (periodCount > 1 || (parts.length === 3 && i === 1 && n < 0))
                    return null;
            }
            if (!numbers.length)
                return null;
            var hours = numbers[0];
            var mins = (numbers.length > 1) ? numbers[1] : 0;
            if (hours > 12 && periodCount && am)
                return null;
            if (hours === 12 && periodCount && am)
                hours = 0;
            if (hours < 12 && !am)
                hours += 12;
            return new DateTime(0).setTime(hours, mins);
        }
        return null;
    };
    DateTime.parseDateTime = function (s, localeConfig) {
        if (localeConfig === void 0) { localeConfig = en_1.default.config; }
        var parts = Utils.trim(s).split(/\s+/);
        var timeStartIndex = -1;
        var periodIndex = -1;
        for (var i = parts.length - 1; i >= 0; i--) {
            if ((timeStartIndex < 0) && (parts[i].indexOf(":") >= 0))
                timeStartIndex = i;
            if ((periodIndex < 0) && parts[i].toLowerCase().match(/^am?|pm?$/))
                periodIndex = i;
        }
        if ((periodIndex >= 0) && (timeStartIndex >= 0) && (periodIndex < timeStartIndex))
            timeStartIndex = periodIndex;
        else if ((periodIndex >= 0) && (timeStartIndex < 0))
            timeStartIndex = periodIndex + ((periodIndex === parts.length - 1) ? -1 : 0);
        else if (timeStartIndex < 0)
            timeStartIndex = parts.length - (parts.length >= 5 ? 2 : (parts.length > 1 ? 1 : 0));
        var dateParts = parts.slice(0, timeStartIndex);
        var timeParts = parts.slice(timeStartIndex);
        if (!dateParts.length && !timeParts.length)
            return null;
        var date = dateParts.length
            ? DateTime.parseDate(dateParts.join(" "), localeConfig)
            : DateTime.now().setTime(0);
        if (!date)
            return null;
        if (timeParts.length) {
            var time = DateTime.parseTime(timeParts.join(" "));
            if (!time)
                return null;
            date.setTime(time);
        }
        return date.setKind(DateTimeKind.Unspecified);
    };
    DateTime.getShortenedRangeText = function (from, to, mode, localeConfig, rangeFormats) {
        if (localeConfig === void 0) { localeConfig = en_1.default.config; }
        if (rangeFormats === void 0) { rangeFormats = en_1.default.rangeFormats; }
        var valueFrom = from ? DateTime.cast(from) : null;
        var valueTo = to ? DateTime.cast(to) : null;
        if (mode === DateTimeMode.DateTime) {
            if (valueFrom)
                valueFrom = valueFrom.toLocalTime();
            if (valueTo)
                valueTo = valueTo.toLocalTime();
        }
        var now = DateTime.now();
        var fromFormat = (mode === DateTimeMode.Time ? rangeFormats.timeFromFormat : rangeFormats.dateTimeFromFormat);
        var toFormat = (mode === DateTimeMode.Time ? rangeFormats.timeToFormat : rangeFormats.dateTimeToFormat);
        var rangeFormat = (mode === DateTimeMode.Time ? rangeFormats.timeRangeFormat : rangeFormats.dateTimeRangeFormat);
        var formatDate = function (date) {
            var year = date.getYears();
            if (now.getYears() === year)
                return date.format(localeConfig.shortMonthDayPattern);
            if (year > localeConfig.twoDigitYearMax - 100 && year <= localeConfig.twoDigitYearMax)
                return date.format(localeConfig.shortestDatePattern);
            return date.format(localeConfig.shortDatePattern);
        };
        var formatTime = function (time) { return time.format(localeConfig.shortTimePattern); };
        var formatValue = function (dateTime) {
            var subMode = mode;
            if (mode === DateTimeMode.DateTime)
                if (valueFrom
                    && valueTo
                    && dateTime === valueTo
                    && valueFrom.compareTo(valueTo) !== 0
                    && valueFrom.compareTo(valueTo, "day") === 0) {
                    subMode = DateTimeMode.Time;
                }
                else if (dateTime.getTime().getTicks() === 0
                    && (!valueFrom || !valueTo || valueTo.compareTo(valueFrom.addDays()) >= 0)) {
                    subMode = DateTimeMode.Date;
                    if (dateTime === valueTo)
                        dateTime = valueTo.addDays(-1);
                }
            switch (subMode) {
                case DateTimeMode.DateTime: return formatDate(dateTime) + " " + formatTime(dateTime);
                case DateTimeMode.Date: return formatDate(dateTime);
                case DateTimeMode.Time: return formatTime(dateTime);
                default: throw "DateTime.getShortenedRangeText: invalid mode";
            }
        };
        var valueFromFormatted = valueFrom ? formatValue(valueFrom) : "";
        var valueToFormatted = valueTo ? formatValue(valueTo) : "";
        var text = valueFrom && valueTo
            ? (valueFromFormatted === valueToFormatted
                ? valueFromFormatted
                : rangeFormat.replace("{0}", valueFromFormatted).replace("{1}", valueToFormatted))
            : (valueFrom
                ? fromFormat.replace("{0}", valueFromFormatted)
                : toFormat.replace("{0}", valueToFormatted));
        text = Utils.trim(text.replace("{1}", "").replace("{2}", ""));
        return text;
    };
    DateTime.floorTicks = function (dateTime, floorTo) {
        if (floorTo === void 0) { floorTo = "none"; }
        var toYear = (floorTo === "year");
        var toMonth = (floorTo === "month");
        var toDay = (floorTo === "day");
        var toHour = (floorTo === "hour");
        var toMinute = (floorTo === "minute");
        var toSecond = (floorTo === "second");
        var noFloor = (floorTo === "none");
        if (!toYear && !toMonth && !toDay && !toHour && !toMinute && !toSecond && !noFloor)
            throw "DateTime.compareTo: invalid 'floorTo' format";
        return noFloor ? dateTime.getTicks() : Date.UTC(dateTime.getYears(), toYear ? 0 : dateTime.getMonths() - 1, (toYear || toMonth) ? 1 : dateTime.getDays(), (toYear || toMonth || toDay) ? 0 : dateTime.getHours(), (toYear || toMonth || toDay || toHour) ? 0 : dateTime.getMinutes(), (toYear || toMonth || toDay || toHour || toMinute) ? 0 : dateTime.getSeconds(), (toYear || toMonth || toDay || toHour || toMinute || toSecond) ? 0 : dateTime.getMilliseconds());
    };
    DateTime.MsDateRe = /\/Date\((\-?\d+)\)\//;
    DateTime.IsoDateRe = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;
    return DateTime;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DateTime;
//# sourceMappingURL=datetime.js.map