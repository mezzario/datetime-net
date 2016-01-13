import Utils from "./utils";
import Locale from "./locale/en";

export enum DateTimeKind {
    Unspecified,
    Utc,
    Local
}

export enum DateTimeMode {
    DateTime,
    Date,
    Time
}

export interface DateTimeLocaleConfig {
    abbreviatedDatePattern: string;
    abbreviatedDayNames: string[];
    abbreviatedMonthDayPattern: string;
    abbreviatedMonthNames: string[];
    abbreviatedShortDatePattern: string;
    dateCompsOrder: string;
    dayNames: string[];
    maxSupportedDate: Date | DateTime | string | number;
    minSupportedDate: Date | DateTime | string | number;
    monthNames: string[];
    shortDatePattern: string;
    shortestDatePattern: string;
    shortMonthDayPattern: string;
    shortTimePattern: string;
    twoDigitYearMax: number;
}

export interface DateTimeHumanizeFormats {
    dateDaysAgo: string;
    dateInDays: string;
    dateInWeek: string;
    dateTimeAndZone: string;
    dateTimeCombined: string;
    dateToday: string;
    dateTomorrow: string;
    dateWeekAgo: string;
    dateYesterday: string;
    localLabel: string;
    timeHourAgo: string;
    timeHoursAgo: string;
    timeInHour: string;
    timeInHours: string;
    timeInMinute: string;
    timeInMinutes: string;
    timeInSecond: string;
    timeInSeconds: string;
    timeMinuteAgo: string;
    timeMinutesAgo: string;
    timeSecondAgo: string;
    timeSecondsAgo: string;
    utcLabel: string;
}

export interface DateTimeRangeFormats {
    dateTimeFromFormat: string;
    dateTimeToFormat: string;
    dateTimeRangeFormat: string;
    timeFromFormat: string;
    timeToFormat: string;
    timeRangeFormat: string;
}

export interface DateTimeHumanizeOptions {
    useDate?: boolean;
    useTime?: boolean;
    alwaysWithTime?: boolean;
    singleLine?: boolean;
    separator?: string;
    dateTimeNow?: Date | DateTime | string | number;
}

export default class DateTime
{
    static MsDateRe = /\/Date\((\-?\d+)\)\//;
    static IsoDateRe = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;

    kind = DateTimeKind.Unspecified;
    value: Date;

    constructor (value?: Date | DateTime | string | number);
    constructor (year?: number, month?: number, day?: number, hour?: number, minute?: number, sec?: number, msec?: number);
    constructor (yearOrTicksOrDate?, month?: number, day?: number, hour?: number, minute?: number, sec?: number, msec?: number) {
        let ticksOrDate;

        if (typeof yearOrTicksOrDate === "undefined") {
            ticksOrDate = new Date().getTime() + DateTime.getTimezoneOffsetTicks();
            this.kind = DateTimeKind.Local;
        }
        else if (typeof month === "undefined") {
            ticksOrDate = yearOrTicksOrDate;

            if (typeof ticksOrDate === "string") {
                let ticks = DateTime.MsDateRe.exec(ticksOrDate);

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

    getYears()                         { return this.value.getUTCFullYear(); }
    getMonths()                        { return this.value.getUTCMonth() + 1; }
    getTotalMonths()                   { return Math.abs(this.getYears()) * 12 + this.getMonths(); }
    getDays()                          { return this.value.getUTCDate(); }
    getDayOfWeek()                     { return this.value.getUTCDay(); }
    getHours()                         { return this.value.getUTCHours(); }
    getMinutes()                       { return this.value.getUTCMinutes(); }
    getSeconds()                       { return this.value.getUTCSeconds(); }
    getMilliseconds()                  { return this.value.getUTCMilliseconds(); }
    getTicks()                         { return this.value.getTime(); }
    getKind()                          { return this.kind; }

    setYears(value: number)            { this.value.setUTCFullYear(value); return this; }
    setMonths(value: number)           { this.value.setUTCMonth(value - 1); return this; }
    setDays(value: number)             { this.value.setUTCDate(value); return this; }
    setHours(value: number)            { this.value.setUTCHours(value); return this; }
    setMinutes(value: number)          { this.value.setUTCMinutes(value); return this; }
    setSeconds(value: number)          { this.value.setUTCSeconds(value); return this; }
    setMilliseconds(value: number)     { this.value.setUTCMilliseconds(value); return this; }
    setTicks(value: number)            { this.value = new Date(value); return this; }
    setKind(value: DateTimeKind)       { this.kind = value; return this; }

    incYears(value: number = 1)        { return this.setYears(this.getYears() + value); }
    incMonths(value: number = 1)       { return this.setMonths(this.getMonths() + value); }
    incDays(value: number = 1)         { return this.setDays(this.getDays() + value); }
    incHours(value: number = 1)        { return this.setHours(this.getHours() + value); }
    incMinutes(value: number = 1)      { return this.setMinutes(this.getMinutes() + value); }
    incSeconds(value: number = 1)      { return this.setSeconds(this.getSeconds() + value); }
    incMilliseconds(value: number = 1) { return this.setMilliseconds(this.getMilliseconds() + value); }
    incTicks(value: number = 1)        { return this.setTicks(this.getTicks() + value); }

    addYears(value: number = 1)        { return new DateTime(this).incYears(value); }
    addMonths(value: number = 1)       { return new DateTime(this).incMonths(value); }
    addDays(value: number = 1)         { return new DateTime(this).incDays(value); }
    addHours(value: number = 1)        { return new DateTime(this).incHours(value); }
    addMinutes(value: number = 1)      { return new DateTime(this).incMinutes(value); }
    addSeconds(value: number = 1)      { return new DateTime(this).incSeconds(value); }
    addMilliseconds(value: number = 1) { return new DateTime(this).incMilliseconds(value); }
    addTicks(value: number = 1)        { return new DateTime(this).incTicks(value); }

    floor(to)                          { return this.setTicks(DateTime.floorTicks(this, to)); }

    toLocalTime()                      { return this.convertTime(true); }
    toUniversalTime()                  { return this.convertTime(false); }

    getDate() {
        return new DateTime(this).floor("day").setKind(DateTimeKind.Unspecified);
    }

    setDate(value: Date | DateTime | string | number);
    setDate(year: number, month: number, day?: number);
    setDate(value, month?: number, day?: number) {
        if (value instanceof Date
            || value instanceof DateTime
            || typeof month === "undefined")
        {
            let temp = DateTime.cast(value);
            value = temp.getYears();
            month = temp.getMonths();
            day = temp.getDays();
        }

        return this
            .setYears(value)
            .setMonths(month)
            .setDays(day || 1);
    }

    getTime() {
        return new DateTime(1970, 1, 1, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds())
            .setKind(DateTimeKind.Unspecified);
    }

    setTime(value: Date | DateTime | string | number): DateTime;
    setTime(hour: number, min: number, sec?: number, msec?: number): DateTime;
    setTime(value: any, min?: number, sec?: number, msec?: number): DateTime {
        if (value instanceof Date
            || value instanceof DateTime
            || typeof min === "undefined")
        {
            let temp = DateTime.cast(value);
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
    }

    valueOf() {
        return this.getTicks();
    }

    toString() {
        return this.format("yyyy-MM-dd HH:mm:ss.l")
            + (this.getKind() === DateTimeKind.Local ? " (local)" : "")
            + (this.getKind() === DateTimeKind.Utc ? " (utc)" : "");
    }

    compareTo(value: Date | DateTime | string | number, floorTo?: string) {
        let dateTime1 = this;
        let dateTime2 = DateTime.cast(value);

        if (dateTime1.getKind() !== dateTime2.getKind()
            && dateTime1.getKind() !== DateTimeKind.Unspecified
            && dateTime2.getKind() !== DateTimeKind.Unspecified)
        {
            dateTime2 = dateTime1.getKind() === DateTimeKind.Utc
                ? dateTime2.toUniversalTime()
                : dateTime2.toLocalTime();
        }

        return DateTime.floorTicks(dateTime1, floorTo) - DateTime.floorTicks(dateTime2, floorTo);
    }

    humanize(
        options?: DateTimeHumanizeOptions,
        localeConfig = Locale.config,
        humanizeFormats = Locale.humanizeFormats.short
    ) {
        options = Utils.objectAssign({
            useDate: true,
            useTime: true,
            alwaysWithTime: true,
            singleLine: true,
            separator: "|"
        } as DateTimeHumanizeOptions, options);

        if (!options.useDate && !options.useTime)
            throw "DateTime.toSimpleText: one of the 'options.useDate' or 'options.useTime' must be true";

        let fmts = humanizeFormats;
        let dateTimeNow = DateTime.cast(options.dateTimeNow);
        let dateStr = "";
        let timeStr = "";

        if (options.useDate) {
            let temp = new DateTime(dateTimeNow);
            let crLeft = this.compareTo(temp.incDays(-7), "day");
            let crRight = this.compareTo(temp.incDays(14), "day");

            if (crLeft >= 0 && crRight <= 0) {
                let res = <string[]>[];
                res[0] = fmts.dateWeekAgo;
                res[6] = fmts.dateYesterday;
                res[7] = fmts.dateToday;
                res[8] = fmts.dateTomorrow;
                res[14] = fmts.dateInWeek;

                for (let i = -7; i <= 7; i++) {
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

            let periodMsecs = ((23 * 60 + 29) * 60 + 59) * 1000 + 999; // number of milliseconds in 23:29:59.999
            let temp = new DateTime(dateTimeNow);
            let crLeft = this.compareTo(temp.incMilliseconds(-periodMsecs));
            let crRight = this.compareTo(temp.incMilliseconds(periodMsecs * 2));

            if (crLeft >= 0 && crRight <= 0) {
                dateStr = "";
                let diffMsecs = this.getTicks() - dateTimeNow.getTicks();

                if (Math.abs(diffMsecs) < 59 * 1000 + 500) {
                    let val = +(diffMsecs / 1000).toFixed();
                    timeStr = (Math.abs(val) <= 1)
                        ? (val <= 0
                            ? fmts.timeSecondAgo
                            : fmts.timeInSecond)
                        : (val < 0
                            ? fmts.timeSecondsAgo.replace("{0}", String(Math.abs(val)))
                            : fmts.timeInSeconds.replace("{0}", String(val)));
                }
                else if (Math.abs(diffMsecs) < (59 * 60 + 29) * 1000 + 500) {
                    let val = +(diffMsecs / (60 * 1000)).toFixed();
                    timeStr = (Math.abs(val) <= 1)
                        ? (val <= 0
                            ? fmts.timeMinuteAgo
                            : fmts.timeInMinute)
                        : (val < 0
                            ? fmts.timeMinutesAgo.replace("{0}", String(Math.abs(val)))
                            : fmts.timeInMinutes.replace("{0}", String(val)));
                }
                else {
                    let val = +(diffMsecs / (60 * 60 * 1000)).toFixed();
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
                ? <any>[dateStr.replace(options.separator, " "), timeStr.replace(options.separator, " ")]
                : (dateStr
                    ? dateStr.split(options.separator)
                    : timeStr.split(options.separator)));
    }

    toDisplayString(options?: DateTimeHumanizeOptions, localeConfig = Locale.config) {
        options = Utils.objectAssign({}, options);
        options.dateTimeNow = DateTime.now().setYears(localeConfig.twoDigitYearMax - 100 - 1);
        return this.humanize(options, localeConfig);
    }

    // http://blog.stevenlevithan.com/archives/date-time-format/comment-page-3
    format(mask: string, localeConfig = Locale.config) {
        let token = /d{1,4}|M{1,4}|y{1,4}|([Hhms])\1?|tt|[Ll]|"[^"]*"|'[^']*'/g;
        let pad = Utils.pad;

        let d = this.getDays(),
            D = this.getDayOfWeek(),
            M = this.getMonths(),
            y = this.getYears(),
            H = this.getHours(),
            m = this.getMinutes(),
            s = this.getSeconds(),
            L = this.getMilliseconds(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  localeConfig.abbreviatedDayNames[D],
                dddd: localeConfig.dayNames[D],
                M:    M,
                MM:   pad(M),
                MMM:  localeConfig.abbreviatedMonthNames[M - 1],
                MMMM: localeConfig.monthNames[M - 1],
                y:    Number(String(y).slice(2)),
                yy:   String(y).slice(2),
                yyy:  pad(y, 3),
                yyyy: pad(y, 4),
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                m:    m,
                mm:   pad(m),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                tt:   H < 12 ? "AM" : "PM"
            };

        return mask.replace(token, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    }

    private convertTime(toLocal: boolean) {
        let result = new DateTime(this);

        if ((toLocal && (result.getKind() !== DateTimeKind.Local))
            || (!toLocal && (result.getKind() !== DateTimeKind.Utc)))
        {
            return result
                .incMilliseconds(DateTime.getTimezoneOffsetTicks() * (toLocal ? 1 : -1))
                .setKind(toLocal ? DateTimeKind.Local : DateTimeKind.Utc);
        }

        return result;
    }

    static getTimezoneOffsetTicks() {
        let now = new Date();

        let nowUtc = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
        );

        return now.getTime() - nowUtc.getTime();
    }

    static cast(value: Date | DateTime | string | number): DateTime {
        return (value instanceof DateTime) ? value : new DateTime(value);
    }

    static utcNow() {
        return new DateTime().toUniversalTime();
    }

    static now() {
        return new DateTime();
    }

    static getTimezoneOffset() {
        return +(DateTime.getTimezoneOffsetTicks() / 60 / 60 / 1000).toFixed(1);
    }

    static is24HoursPattern(pattern: string) {
        let hourFormat = new RegExp("h+", "i").exec(pattern);
        return !hourFormat || Utils.isUpperCase(hourFormat[0]);
    }

    static parseDate(s: string, localeConfig = Locale.config) {
        let re = /^(\d{1,4})(([\.\-\/ ] ?(\d{1,2})([\.\-\/ ] ?(\d{1,4}))?(?:$| +.*$))|$)/i;
        let matches = re.exec(Utils.trim(s));

        if (matches) {
            let parts = [matches[1]];

            if (matches[4] != null)
                parts[1] = matches[4];

            if (matches[6] != null)
                parts[2] = matches[6];

            let curDate = DateTime.now();
            let co = localeConfig.dateCompsOrder;
            let year = (parts.length === 3) ? +parts[co.indexOf("y")] : curDate.getYears();
            let month = (parts.length >= 2) ? +parts[(parts.length === 2 ? co.replace("y", "") : co).indexOf("m")] : curDate.getMonths();
            let day = (parts.length === 1) ? +parts[0] : +parts[(parts.length === 2 ? co.replace("y", "") : co).indexOf("d")];

            if ((year >= 1) && (year <= 9999)
                && (month >= 1) && (month <= 12)
                && (day >= 1) && (day <= 31))
            {
                if (year < 100) {
                    let major = Math.round(localeConfig.twoDigitYearMax / 100) * 100;
                    let minor = localeConfig.twoDigitYearMax - major;

                    year = (year <= minor) ? (major + year) : (major + year - 100);
                }

                let date = new DateTime(year, month, day);

                if (!isNaN(date.getTicks())
                    && date.getYears() === year
                    && date.getMonths() === month
                    && date.getDays() === day
                    && date.getTicks() >= DateTime.cast(localeConfig.minSupportedDate).getTicks()
                    && date.getTicks() <= DateTime.cast(localeConfig.maxSupportedDate).getTicks())
                {
                    return date;
                }
            }
        }

        return null;
    }

    static parseTime(s: string) {
        let re = /^(0?\d|1\d|2[0-3]|am?|pm?)(([\.\: ](0?\d|[1-5]\d|am?|pm?)([\.\: ](0?\d|[1-5]\d|am?|pm?))?(?:$| +.*$))|$)/i;
        let matches = re.exec(Utils.trim(s));

        if (matches) {
            let parts = [matches[1]];

            if (matches[4] != null)
                parts[1] = matches[4];

            if (matches[6] != null)
                parts[2] = matches[6];

            let periodCount = 0;
            let numbers = [];
            let am = true;

            for (let i = 0, j = 0; i < parts.length; i++) {
                let n = parseInt(parts[i], 10);

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

            let hours = numbers[0];
            let mins = (numbers.length > 1) ? numbers[1] : 0;

            if (hours > 12 && periodCount && am)
                return null;

            if (hours === 12 && periodCount && am)
                hours = 0;

            if (hours < 12 && !am)
                hours += 12;

            return new DateTime(0).setTime(hours, mins);
        }

        return null;
    }

    static parseDateTime(s: string, localeConfig = Locale.config) {
        let parts = Utils.trim(s).split(/\s+/);
        let timeStartIndex = -1;
        let periodIndex = -1;

        for (let i = parts.length - 1; i >= 0; i--) {
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

        let dateParts = parts.slice(0, timeStartIndex);
        let timeParts = parts.slice(timeStartIndex);

        if (!dateParts.length && !timeParts.length)
            return null;

        let date = dateParts.length
            ? DateTime.parseDate(dateParts.join(" "), localeConfig)
            : DateTime.now().setTime(0);

        if (!date)
            return null;

        if (timeParts.length) {
            let time = DateTime.parseTime(timeParts.join(" "));
            if (!time)
                return null;
            date.setTime(time);
        }

        return date.setKind(DateTimeKind.Unspecified);
    }

    static getShortenedRangeText(
        from: Date | DateTime | string | number,
        to: Date | DateTime | string | number,
        mode: DateTimeMode,
        localeConfig = Locale.config,
        rangeFormats = Locale.rangeFormats
    ) {
        let valueFrom = from ? DateTime.cast(from) : null;
        let valueTo = to ? DateTime.cast(to) : null;

        if (mode === DateTimeMode.DateTime) {
            if (valueFrom)
                valueFrom = valueFrom.toLocalTime();

            if (valueTo)
                valueTo = valueTo.toLocalTime();
        }

        let now = DateTime.now();

        let fromFormat = (mode === DateTimeMode.Time ? rangeFormats.timeFromFormat : rangeFormats.dateTimeFromFormat);
        let toFormat = (mode === DateTimeMode.Time ? rangeFormats.timeToFormat : rangeFormats.dateTimeToFormat);
        let rangeFormat = (mode === DateTimeMode.Time ? rangeFormats.timeRangeFormat : rangeFormats.dateTimeRangeFormat);

        let formatDate = function(date: DateTime) {
            let year = date.getYears();

            if (now.getYears() === year)
                return date.format(localeConfig.shortMonthDayPattern);

            if (year > localeConfig.twoDigitYearMax - 100 && year <= localeConfig.twoDigitYearMax)
                return date.format(localeConfig.shortestDatePattern);

            return date.format(localeConfig.shortDatePattern);
        };

        let formatTime = (time: DateTime) => time.format(localeConfig.shortTimePattern);

        let formatValue = (dateTime: DateTime) => {
            let subMode = mode;

            if (mode === DateTimeMode.DateTime)
                if (valueFrom
                    && valueTo
                    && dateTime === valueTo
                    && valueFrom.compareTo(valueTo) !== 0
                    && valueFrom.compareTo(valueTo, "day") === 0)
                {
                    subMode = DateTimeMode.Time;
                }
                else if (dateTime.getTime().getTicks() === 0
                    && (!valueFrom || !valueTo || valueTo.compareTo(valueFrom.addDays()) >= 0))
                {
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

        let valueFromFormatted = valueFrom ? formatValue(valueFrom) : "";
        let valueToFormatted = valueTo ? formatValue(valueTo) : "";

        let text = valueFrom && valueTo
            ? (valueFromFormatted === valueToFormatted
                ? valueFromFormatted
                : rangeFormat.replace("{0}", valueFromFormatted).replace("{1}", valueToFormatted))
            : (valueFrom
                ? fromFormat.replace("{0}", valueFromFormatted)
                : toFormat.replace("{0}", valueToFormatted));

        text = Utils.trim(text.replace("{1}", "").replace("{2}", ""));

        return text;
    }

    private static floorTicks(dateTime: DateTime, floorTo: string = "none") {
        let toYear = (floorTo === "year");
        let toMonth = (floorTo === "month");
        let toDay = (floorTo === "day");
        let toHour = (floorTo === "hour");
        let toMinute = (floorTo === "minute");
        let toSecond = (floorTo === "second");
        let noFloor = (floorTo === "none");

        if (!toYear && !toMonth && !toDay && !toHour && !toMinute && !toSecond && !noFloor)
            throw "DateTime.compareTo: invalid 'floorTo' format";

        return noFloor ? dateTime.getTicks() : Date.UTC(
            dateTime.getYears(),
            toYear ? 0 : dateTime.getMonths() - 1,
            (toYear || toMonth) ? 1 : dateTime.getDays(),
            (toYear || toMonth || toDay) ? 0 : dateTime.getHours(),
            (toYear || toMonth || toDay || toHour) ? 0 : dateTime.getMinutes(),
            (toYear || toMonth || toDay || toHour || toMinute) ? 0 : dateTime.getSeconds(),
            (toYear || toMonth || toDay || toHour || toMinute || toSecond) ? 0 : dateTime.getMilliseconds()
        );
    }
}
