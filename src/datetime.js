import * as Utils from "./utils"
import Locale from "./locale/en"

export const DateTimeKind = {
  Unspecified: 0,
  Utc: 1,
  Local: 2,
}

export const DateTimeMode = {
  DateTime: 0,
  Date: 1,
  Time: 2,
}

export default class DateTime {
  static MsDateRe = /\/Date\((-?\d+)\)\//
  static IsoDateRe = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/

  constructor (yearOrTicksOrDate, month, day, hour, minute, sec, msec) {
    let ticksOrDate
    this.kind = DateTimeKind.Unspecified

    if (typeof yearOrTicksOrDate === "undefined") {
      ticksOrDate = new Date().getTime() + DateTime.getTimezoneOffsetTicks()
      this.kind = DateTimeKind.Local
    }
    else if (typeof month === "undefined") {
      ticksOrDate = yearOrTicksOrDate

      if (typeof ticksOrDate === "string") {
        const ticks = DateTime.MsDateRe.exec(ticksOrDate)

        if (ticks !== null) {
          ticksOrDate = +ticks[1]
          this.kind = DateTimeKind.Utc
        }
        else if (DateTime.IsoDateRe.test(ticksOrDate))
          this.kind = DateTimeKind.Utc
      }
      else if (ticksOrDate instanceof DateTime)
        this.kind = yearOrTicksOrDate.kind
    }
    else {
      ticksOrDate = Date.UTC(yearOrTicksOrDate, month - 1, day || 1, hour || 0, minute || 0, sec || 0, msec || 0)
      this.kind = DateTimeKind.Local
    }

    this.value = new Date(ticksOrDate instanceof DateTime ? ticksOrDate.getTicks() : ticksOrDate)
  }

  getYears()                 { return this.value.getUTCFullYear() }
  getMonths()                { return this.value.getUTCMonth() + 1 }
  getTotalMonths()           { return Math.abs(this.getYears()) * 12 + this.getMonths() }
  getDays()                  { return this.value.getUTCDate() }
  getDayOfWeek()             { return this.value.getUTCDay() }
  getHours()                 { return this.value.getUTCHours() }
  getMinutes()               { return this.value.getUTCMinutes() }
  getSeconds()               { return this.value.getUTCSeconds() }
  getMilliseconds()          { return this.value.getUTCMilliseconds() }
  getTicks()                 { return this.value.getTime() }
  getKind()                  { return this.kind }

  setYears(value)            { this.value.setUTCFullYear(value); return this }
  setMonths(value)           { this.value.setUTCMonth(value - 1); return this }
  setDays(value)             { this.value.setUTCDate(value); return this }
  setHours(value)            { this.value.setUTCHours(value); return this }
  setMinutes(value)          { this.value.setUTCMinutes(value); return this }
  setSeconds(value)          { this.value.setUTCSeconds(value); return this }
  setMilliseconds(value)     { this.value.setUTCMilliseconds(value); return this }
  setTicks(value)            { this.value = new Date(value); return this }
  setKind(value)             { this.kind = value; return this }

  incYears(value = 1)        { return this.setYears(this.getYears() + value) }
  incMonths(value = 1)       { return this.setMonths(this.getMonths() + value) }
  incDays(value = 1)         { return this.setDays(this.getDays() + value) }
  incHours(value = 1)        { return this.setHours(this.getHours() + value) }
  incMinutes(value = 1)      { return this.setMinutes(this.getMinutes() + value) }
  incSeconds(value = 1)      { return this.setSeconds(this.getSeconds() + value) }
  incMilliseconds(value = 1) { return this.setMilliseconds(this.getMilliseconds() + value) }
  incTicks(value = 1)        { return this.setTicks(this.getTicks() + value) }

  addYears(value = 1)        { return new DateTime(this).incYears(value) }
  addMonths(value = 1)       { return new DateTime(this).incMonths(value) }
  addDays(value = 1)         { return new DateTime(this).incDays(value) }
  addHours(value = 1)        { return new DateTime(this).incHours(value) }
  addMinutes(value = 1)      { return new DateTime(this).incMinutes(value) }
  addSeconds(value = 1)      { return new DateTime(this).incSeconds(value) }
  addMilliseconds(value = 1) { return new DateTime(this).incMilliseconds(value) }
  addTicks(value = 1)        { return new DateTime(this).incTicks(value) }

  floor(to)                  { return this.setTicks(DateTime._floorTicks(this, to)) }

  toLocalTime()              { return this._convertTime(true) }
  toUniversalTime()          { return this._convertTime(false) }

  getDate() {
    return new DateTime(this).floor("day").setKind(DateTimeKind.Unspecified)
  }

  setDate(value, month, day) {
    if (value instanceof Date
      || value instanceof DateTime
      || typeof month === "undefined")
    {
      const temp = DateTime.cast(value)
      value = temp.getYears()
      month = temp.getMonths()
      day = temp.getDays()
    }

    return this
      .setYears(value)
      .setMonths(month)
      .setDays(day || 1)
  }

  getTime() {
    return new DateTime(1970, 1, 1, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds())
      .setKind(DateTimeKind.Unspecified)
  }

  setTime(value, min, sec, msec) {
    if (value instanceof Date
      || value instanceof DateTime
      || typeof min === "undefined")
    {
      const temp = DateTime.cast(value)
      value = temp.getHours()
      min = temp.getMinutes()
      sec = temp.getSeconds()
      msec = temp.getMilliseconds()
    }

    return this
      .setHours(value)
      .setMinutes(min)
      .setSeconds(sec || 0)
      .setMilliseconds(msec || 0)
  }

  valueOf() {
    return this.getTicks()
  }

  toString() {
    return this.format("yyyy-MM-dd HH:mm:ss.l")
      + (this.getKind() === DateTimeKind.Local ? " (local)" : "")
      + (this.getKind() === DateTimeKind.Utc ? " (utc)" : "")
  }

  compareTo(value, floorTo) {
    const dateTime1 = this
    let dateTime2 = DateTime.cast(value)

    if (dateTime1.getKind() !== dateTime2.getKind()
      && dateTime1.getKind() !== DateTimeKind.Unspecified
      && dateTime2.getKind() !== DateTimeKind.Unspecified)
    {
      dateTime2 = dateTime1.getKind() === DateTimeKind.Utc
        ? dateTime2.toUniversalTime()
        : dateTime2.toLocalTime()
    }

    return DateTime._floorTicks(dateTime1, floorTo) - DateTime._floorTicks(dateTime2, floorTo)
  }

  humanize(
    options,
    localeConfig = Locale.config,
    humanizeFormats = Locale.humanizeFormats.short
  ) {
    options = Object.assign({
      useDate: true,
      useTime: true,
      alwaysWithTime: true,
      singleLine: true,
      separator: "|",
    }, options)

    if (!options.useDate && !options.useTime)
      throw "DateTime.toSimpleText: one of the 'options.useDate' or 'options.useTime' must be true"

    const fmts = humanizeFormats
    const dateTimeNow = DateTime.cast(options.dateTimeNow)
    let dateStr = ""
    let timeStr = ""

    if (options.useDate) {
      const temp = new DateTime(dateTimeNow)
      const crLeft = this.compareTo(temp.incDays(-7), "day")
      const crRight = this.compareTo(temp.incDays(14), "day")

      if (crLeft >= 0 && crRight <= 0) {
        const res = []
        res[0] = fmts.dateWeekAgo
        res[6] = fmts.dateYesterday
        res[7] = fmts.dateToday
        res[8] = fmts.dateTomorrow
        res[14] = fmts.dateInWeek

        for (let i = -7; i <= 7; i++) {
          if (this.compareTo(dateTimeNow.addDays(i), "day") === 0) {
            dateStr = res[i + 7] || (i < 0 ? fmts.dateDaysAgo.replace("{0}", String(-i)) : fmts.dateInDays.replace("{0}", String(i)))
            break
          }
        }
      }
      else {
        if (this.getYears() === dateTimeNow.getYears())
          dateStr = this.format(localeConfig.abbreviatedMonthDayPattern)
        else if (this.getYears() > localeConfig.twoDigitYearMax - 100 && this.getYears() <= localeConfig.twoDigitYearMax)
          dateStr = this.format(localeConfig.abbreviatedShortDatePattern)
        else
          dateStr = this.format(localeConfig.abbreviatedDatePattern)
      }
    }

    if (options.useTime) {
      if (this.compareTo(dateTimeNow, "day") === 0)
        dateStr = ""

      const periodMsecs = ((23 * 60 + 29) * 60 + 59) * 1000 + 999 // number of milliseconds in 23:29:59.999
      const temp = new DateTime(dateTimeNow)
      const crLeft = this.compareTo(temp.incMilliseconds(-periodMsecs))
      const crRight = this.compareTo(temp.incMilliseconds(periodMsecs * 2))

      if (crLeft >= 0 && crRight <= 0) {
        dateStr = ""
        const diffMsecs = this.getTicks() - dateTimeNow.getTicks()

        if (Math.abs(diffMsecs) < 59 * 1000 + 500) {
          const val = +(diffMsecs / 1000).toFixed()
          timeStr = (Math.abs(val) <= 1)
            ? (val <= 0
              ? fmts.timeSecondAgo
              : fmts.timeInSecond)
            : (val < 0
              ? fmts.timeSecondsAgo.replace("{0}", String(Math.abs(val)))
              : fmts.timeInSeconds.replace("{0}", String(val)))
        }
        else if (Math.abs(diffMsecs) < (59 * 60 + 29) * 1000 + 500) {
          const val = +(diffMsecs / (60 * 1000)).toFixed()
          timeStr = (Math.abs(val) <= 1)
            ? (val <= 0
              ? fmts.timeMinuteAgo
              : fmts.timeInMinute)
            : (val < 0
              ? fmts.timeMinutesAgo.replace("{0}", String(Math.abs(val)))
              : fmts.timeInMinutes.replace("{0}", String(val)))
        }
        else {
          const val = +(diffMsecs / (60 * 60 * 1000)).toFixed()
          timeStr = (Math.abs(val) <= 1)
            ? (val <= 0
              ? fmts.timeHourAgo
              : fmts.timeInHour)
            : (val < 0
              ? fmts.timeHoursAgo.replace("{0}", String(Math.abs(val)))
              : fmts.timeInHours.replace("{0}", String(val)))
        }
      }
      else if (options.alwaysWithTime)
        timeStr = this.format(localeConfig.shortTimePattern)
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
          : timeStr.split(options.separator)))
  }

  toDisplayString(options, localeConfig = Locale.config) {
    options = Object.assign({}, options)
    options.dateTimeNow = DateTime.now().setYears(localeConfig.twoDigitYearMax - 100 - 1)
    return this.humanize(options, localeConfig)
  }

  // http://blog.stevenlevithan.com/archives/date-time-format/comment-page-3
  format(mask, localeConfig = Locale.config) {
    const token = /d{1,4}|M{1,4}|y{1,4}|([Hhms])\1?|tt|[Ll]|"[^"]*"|'[^']*'/g
    const pad = (val, len = 2) => String(val).padStart(len, "0")

    const d = this.getDays(),
      D = this.getDayOfWeek(),
      M = this.getMonths(),
      y = this.getYears(),
      H = this.getHours(),
      m = this.getMinutes(),
      s = this.getSeconds(),
      L = this.getMilliseconds(),
      flags = {
        d,
        dd:   pad(d),
        ddd:  localeConfig.abbreviatedDayNames[D],
        dddd: localeConfig.dayNames[D],
        M,
        MM:   pad(M),
        MMM:  localeConfig.abbreviatedMonthNames[M - 1],
        MMMM: localeConfig.monthNames[M - 1],
        y:  Number(String(y).slice(2)),
        yy:   String(y).slice(2),
        yyy:  pad(y, 3),
        yyyy: pad(y, 4),
        h:  H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H,
        HH:   pad(H),
        m,
        mm:   pad(m),
        s,
        ss:   pad(s),
        l:  pad(L, 3),
        L:  pad(L > 99 ? Math.round(L / 10) : L),
        tt:   H < 12 ? "AM" : "PM",
      }

    return mask.replace(token, function($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
    })
  }

  _convertTime(toLocal) {
    const result = new DateTime(this)

    if ((toLocal && (result.getKind() !== DateTimeKind.Local))
      || (!toLocal && (result.getKind() !== DateTimeKind.Utc)))
    {
      return result
        .incMilliseconds(DateTime.getTimezoneOffsetTicks() * (toLocal ? 1 : -1))
        .setKind(toLocal ? DateTimeKind.Local : DateTimeKind.Utc)
    }

    return result
  }

  static getTimezoneOffsetTicks() {
    const now = new Date()

    const nowUtc = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )

    return now.getTime() - nowUtc.getTime()
  }

  static cast(value) {
    return (value instanceof DateTime) ? value : new DateTime(value)
  }

  static utcNow() {
    return new DateTime().toUniversalTime()
  }

  static now() {
    return new DateTime()
  }

  static getTimezoneOffset() {
    return +(DateTime.getTimezoneOffsetTicks() / 60 / 60 / 1000).toFixed(1)
  }

  static is24HoursPattern(pattern) {
    const hourFormat = new RegExp("h+", "i").exec(pattern)
    return !hourFormat || Utils.isUpperCase(hourFormat[0])
  }

  static parseDate(s, localeConfig = Locale.config) {
    const re = /^(\d{1,4})(([.\-/ ] ?(\d{1,2})([.\-/ ] ?(\d{1,4}))?(?:$| +.*$))|$)/i
    const matches = re.exec(s.trim())

    if (matches) {
      const parts = [matches[1]]

      if (matches[4] != null)
        parts[1] = matches[4]

      if (matches[6] != null)
        parts[2] = matches[6]

      const curDate = DateTime.now()
      const co = localeConfig.dateCompsOrder
      let year = (parts.length === 3) ? +parts[co.indexOf("y")] : curDate.getYears()
      const month = (parts.length >= 2) ? +parts[(parts.length === 2 ? co.replace("y", "") : co).indexOf("m")] : curDate.getMonths()
      const day = (parts.length === 1) ? +parts[0] : +parts[(parts.length === 2 ? co.replace("y", "") : co).indexOf("d")]

      if ((year >= 1) && (year <= 9999)
        && (month >= 1) && (month <= 12)
        && (day >= 1) && (day <= 31))
      {
        if (year < 100) {
          const major = Math.round(localeConfig.twoDigitYearMax / 100) * 100
          const minor = localeConfig.twoDigitYearMax - major

          year = (year <= minor) ? (major + year) : (major + year - 100)
        }

        const date = new DateTime(year, month, day)

        if (!isNaN(date.getTicks())
          && date.getYears() === year
          && date.getMonths() === month
          && date.getDays() === day
          && date.getTicks() >= DateTime.cast(localeConfig.minSupportedDate).getTicks()
          && date.getTicks() <= DateTime.cast(localeConfig.maxSupportedDate).getTicks())
        {
          return date
        }
      }
    }

    return null
  }

  static parseTime(s) {
    const re = /^(0?\d|1\d|2[0-3]|am?|pm?)(([.: ](0?\d|[1-5]\d|am?|pm?)([.: ](0?\d|[1-5]\d|am?|pm?))?(?:$| +.*$))|$)/i
    const matches = re.exec(s.trim())

    if (matches) {
      const parts = [matches[1]]

      if (matches[4] != null)
        parts[1] = matches[4]

      if (matches[6] != null)
        parts[2] = matches[6]

      let periodCount = 0
      const numbers = []
      let am = true

      for (let i = 0, j = 0; i < parts.length; i++) {
        let n = parseInt(parts[i], 10)

        if (isNaN(n)) {
          am = (parts[i][0].toLowerCase() === "a")
          n = (am ? -1 : -2)
          periodCount++
        }
        else
          numbers[j++] = n

        if (periodCount > 1 || (parts.length === 3 && i === 1 && n < 0))
          return null
      }

      if (!numbers.length)
        return null

      let hours = numbers[0]
      const mins = (numbers.length > 1) ? numbers[1] : 0

      if (hours > 12 && periodCount && am)
        return null

      if (hours === 12 && periodCount && am)
        hours = 0

      if (hours < 12 && !am)
        hours += 12

      return new DateTime(0).setTime(hours, mins)
    }

    return null
  }

  static parseDateTime(s, localeConfig = Locale.config) {
    const parts = s.trim().split(/\s+/)
    let timeStartIndex = -1
    let periodIndex = -1

    for (let i = parts.length - 1; i >= 0; i--) {
      if ((timeStartIndex < 0) && (parts[i].indexOf(":") >= 0))
        timeStartIndex = i

      if ((periodIndex < 0) && parts[i].toLowerCase().match(/^am?|pm?$/))
        periodIndex = i
    }

    if ((periodIndex >= 0) && (timeStartIndex >= 0) && (periodIndex < timeStartIndex))
      timeStartIndex = periodIndex
    else if ((periodIndex >= 0) && (timeStartIndex < 0))
      timeStartIndex = periodIndex + ((periodIndex === parts.length - 1) ? -1 : 0)
    else if (timeStartIndex < 0)
      timeStartIndex = parts.length - (parts.length >= 5 ? 2 : (parts.length > 1 ? 1 : 0))

    const dateParts = parts.slice(0, timeStartIndex)
    const timeParts = parts.slice(timeStartIndex)

    if (!dateParts.length && !timeParts.length)
      return null

    const date = dateParts.length
      ? DateTime.parseDate(dateParts.join(" "), localeConfig)
      : DateTime.now().setTime(0)

    if (!date)
      return null

    if (timeParts.length) {
      const time = DateTime.parseTime(timeParts.join(" "))
      if (!time)
        return null
      date.setTime(time)
    }

    return date.setKind(DateTimeKind.Unspecified)
  }

  static getShortenedRangeText(
    from,
    to,
    mode,
    localeConfig = Locale.config,
    rangeFormats = Locale.rangeFormats
  ) {
    let valueFrom = from ? DateTime.cast(from) : null
    let valueTo = to ? DateTime.cast(to) : null

    if (mode === DateTimeMode.DateTime) {
      if (valueFrom)
        valueFrom = valueFrom.toLocalTime()

      if (valueTo)
        valueTo = valueTo.toLocalTime()
    }

    const now = DateTime.now()

    const fromFormat = (mode === DateTimeMode.Time ? rangeFormats.timeFromFormat : rangeFormats.dateTimeFromFormat)
    const toFormat = (mode === DateTimeMode.Time ? rangeFormats.timeToFormat : rangeFormats.dateTimeToFormat)
    const rangeFormat = (mode === DateTimeMode.Time ? rangeFormats.timeRangeFormat : rangeFormats.dateTimeRangeFormat)

    const formatDate = function(date) {
      const year = date.getYears()

      if (now.getYears() === year)
        return date.format(localeConfig.shortMonthDayPattern)

      if (year > localeConfig.twoDigitYearMax - 100 && year <= localeConfig.twoDigitYearMax)
        return date.format(localeConfig.shortestDatePattern)

      return date.format(localeConfig.shortDatePattern)
    }

    const formatTime = (time) => time.format(localeConfig.shortTimePattern)

    const formatValue = (dateTime) => {
      let subMode = mode

      if (mode === DateTimeMode.DateTime)
        if (valueFrom
          && valueTo
          && dateTime === valueTo
          && valueFrom.compareTo(valueTo) !== 0
          && valueFrom.compareTo(valueTo, "day") === 0)
        {
          subMode = DateTimeMode.Time
        }
        else if (dateTime.getTime().getTicks() === 0
          && (!valueFrom || !valueTo || valueTo.compareTo(valueFrom.addDays()) >= 0))
        {
          subMode = DateTimeMode.Date

          if (dateTime === valueTo)
            dateTime = valueTo.addDays(-1)
        }

      switch (subMode) {
        case DateTimeMode.DateTime: return formatDate(dateTime) + " " + formatTime(dateTime)
        case DateTimeMode.Date: return formatDate(dateTime)
        case DateTimeMode.Time: return formatTime(dateTime)
        default: throw "DateTime.getShortenedRangeText: invalid mode"
      }
    }

    const valueFromFormatted = valueFrom ? formatValue(valueFrom) : ""
    const valueToFormatted = valueTo ? formatValue(valueTo) : ""

    let text = valueFrom && valueTo
      ? (valueFromFormatted === valueToFormatted
        ? valueFromFormatted
        : rangeFormat.replace("{0}", valueFromFormatted).replace("{1}", valueToFormatted))
      : (valueFrom
        ? fromFormat.replace("{0}", valueFromFormatted)
        : toFormat.replace("{0}", valueToFormatted))

    text = text.replace("{1}", "").replace("{2}", "").trim()

    return text
  }

  static _floorTicks(dateTime, floorTo = "none") {
    const toYear = (floorTo === "year")
    const toMonth = (floorTo === "month")
    const toDay = (floorTo === "day")
    const toHour = (floorTo === "hour")
    const toMinute = (floorTo === "minute")
    const toSecond = (floorTo === "second")
    const noFloor = (floorTo === "none")

    if (!toYear && !toMonth && !toDay && !toHour && !toMinute && !toSecond && !noFloor)
      throw "DateTime.compareTo: invalid 'floorTo' format"

    return noFloor ? dateTime.getTicks() : Date.UTC(
      dateTime.getYears(),
      toYear ? 0 : dateTime.getMonths() - 1,
      (toYear || toMonth) ? 1 : dateTime.getDays(),
      (toYear || toMonth || toDay) ? 0 : dateTime.getHours(),
      (toYear || toMonth || toDay || toHour) ? 0 : dateTime.getMinutes(),
      (toYear || toMonth || toDay || toHour || toMinute) ? 0 : dateTime.getSeconds(),
      (toYear || toMonth || toDay || toHour || toMinute || toSecond) ? 0 : dateTime.getMilliseconds()
    )
  }
}
