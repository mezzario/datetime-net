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
  abbreviatedDatePattern: string
  abbreviatedDayNames: string[]
  abbreviatedMonthDayPattern: string
  abbreviatedMonthNames: string[]
  abbreviatedShortDatePattern: string
  dateCompsOrder: string
  dayNames: string[]
  maxSupportedDate: Date | DateTime | string | number
  minSupportedDate: Date | DateTime | string | number
  monthNames: string[]
  shortDatePattern: string
  shortestDatePattern: string
  shortMonthDayPattern: string
  shortTimePattern: string
  twoDigitYearMax: number
}

export interface DateTimeHumanizeFormats {
  dateDaysAgo: string
  dateInDays: string
  dateInWeek: string
  dateTimeAndZone: string
  dateTimeCombined: string
  dateToday: string
  dateTomorrow: string
  dateWeekAgo: string
  dateYesterday: string
  timeHourAgo: string
  timeHoursAgo: string
  timeInHour: string
  timeInHours: string
  timeInMinute: string
  timeInMinutes: string
  timeInSecond: string
  timeInSeconds: string
  timeMinuteAgo: string
  timeMinutesAgo: string
  timeSecondAgo: string
  timeSecondsAgo: string
}

export interface DateTimeRangeFormats {
  dateTimeFromFormat: string
  dateTimeToFormat: string
  dateTimeRangeFormat: string
  timeFromFormat: string
  timeToFormat: string
  timeRangeFormat: string
}

export interface DateTimeHumanizeOptions {
  useDate?: boolean
  useTime?: boolean
  alwaysWithTime?: boolean
  singleLine?: boolean
  separator?: string
  dateTimeNow?: Date | DateTime | string | number
}

export default class DateTime {
  static MsDateRe: RegExp
  static IsoDateRe: RegExp

  kind: DateTimeKind
  value: Date

  constructor(value?: Date | DateTime | string | number)
  constructor(year?: number, month?: number, day?: number, hour?: number, minute?: number, sec?: number, msec?: number)

  getYears(): number
  getMonths(): number
  getTotalMonths(): number
  getDays(): number
  getDayOfWeek(): number
  getHours(): number
  getMinutes(): number
  getSeconds(): number
  getMilliseconds(): number
  getTicks(): number
  getKind(): DateTimeKind

  setYears(value: number): this
  setMonths(value: number): this
  setDays(value: number): this
  setHours(value: number): this
  setMinutes(value: number): this
  setSeconds(value: number): this
  setMilliseconds(value: number): this
  setTicks(value: number): this
  setKind(value: DateTimeKind): this

  incYears(value?: number): this
  incMonths(value?: number): this
  incDays(value?: number): this
  incHours(value?: number): this
  incMinutes(value?: number): this
  incSeconds(value?: number): this
  incMilliseconds(value?: number): this
  incTicks(value?: number): this

  addYears(value?: number): DateTime
  addMonths(value?: number): DateTime
  addDays(value?: number): DateTime
  addHours(value?: number): DateTime
  addMinutes(value?: number): DateTime
  addSeconds(value?: number): DateTime
  addMilliseconds(value?: number): DateTime
  addTicks(value?: number): DateTime

  floor(to: "year" | "month" | "day" | "hour" | "minute" | "second"): this
  toLocalTime(): DateTime
  toUniversalTime(): DateTime
  getDate(): DateTime
  setDate(value: Date | DateTime | string | number)
  setDate(year: number, month: number, day?: number)
  getTime(): DateTime
  setTime(value: Date | DateTime | string | number): DateTime
  setTime(hour: number, min: number, sec?: number, msec?: number): DateTime
  valueOf(): number
  toString(): string
  compareTo(value: Date | DateTime | string | number, floorTo?: string): number
  humanize(options?: DateTimeHumanizeOptions, localeConfig?, humanizeFormats?)
  toDisplayString(options?: DateTimeHumanizeOptions, localeConfig?)
  format(mask: string, localeConfig?): string

  static getTimezoneOffsetTicks(): number
  static cast(value: Date | DateTime | string | number): DateTime
  static utcNow(): DateTime
  static now(): DateTime
  static getTimezoneOffset(): number
  static is24HoursPattern(pattern: string): boolean
  static parseDate(s: string, localeConfig?): DateTime
  static parseTime(s: string): DateTime
  static parseDateTime(s: string, localeConfig?): DateTime
  static getShortenedRangeText(from: Date | DateTime | string | number, to: Date | DateTime | string | number, mode: DateTimeMode, localeConfig?, rangeFormats?)
}
