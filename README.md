# datetime-net
A JavaScript DateTime class inspired by .NET

### Install

`yarn add datetime-net`

or

`npm i datetime-net -S`

### API

```typescript
class DateTime {
    static MsDateRe: RegExp
    static IsoDateRe: RegExp

    kind: DateTimeKind // Unspecified, Utc, Local
    value: Date

    constructor(value?: Date | DateTime | string | number)
    constructor(year?: number, month?: number, day?: number, hour?: number, minute?: number, sec?: number, msec?: number)

    // get date or time components
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

    // set date or time components;
    // chaining is available;
    // current instance updated
    setYears(value: number): this
    setMonths(value: number): this
    setDays(value: number): this
    setHours(value: number): this
    setMinutes(value: number): this
    setSeconds(value: number): this
    setMilliseconds(value: number): this
    setTicks(value: number): this
    setKind(value: DateTimeKind): this

    // increment/decrement date or time components;
    // chaining is available;
    // current instance updated
    incYears(value?: number): this
    incMonths(value?: number): this
    incDays(value?: number): this
    incHours(value?: number): this
    incMinutes(value?: number): this
    incSeconds(value?: number): this
    incMilliseconds(value?: number): this
    incTicks(value?: number): this

    // increment/decrement date or time components;
    // new instance is created as a result
    addYears(value?: number): DateTime
    addMonths(value?: number): DateTime
    addDays(value?: number): DateTime
    addHours(value?: number): DateTime
    addMinutes(value?: number): DateTime
    addSeconds(value?: number): DateTime
    addMilliseconds(value?: number): DateTime
    addTicks(value?: number): DateTime

    // get/set date part
    getDate(): DateTime
    setDate(value: Date | DateTime | string | number)
    setDate(year: number, month: number, day?: number)

    // get/set time part
    getTime(): DateTime
    setTime(value: Date | DateTime | string | number): DateTime
    setTime(hour: number, min: number, sec?: number, msec?: number): DateTime

    floor(to: "year" | "month" | "day" | "hour" | "minute" | "second"): this
    toLocalTime(): DateTime
    toUniversalTime(): DateTime
    compareTo(value: Date | DateTime | string | number, floorTo?: string): number
    humanize(options?: DateTimeHumanizeOptions, localeConfig?, humanizeFormats?)
    toDisplayString(options?: DateTimeHumanizeOptions, localeConfig?)
    format(mask: string, localeConfig?): string

    valueOf(): number
    toString(): string

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
```
