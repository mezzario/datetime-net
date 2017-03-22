export default {
    config: {
        dateCompsOrder: "mdy",
        minSupportedDate: "0000-01-01T00:00:00.000Z",
        maxSupportedDate: "9999-12-31T23:59:59.999Z",
        abbreviatedDayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
        ],
        monthNames: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        abbreviatedMonthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        dayNames: [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        shortDateTimePattern: "M/d/yyyy h:mm tt",
        abbreviatedDatePattern: "d MMM yyyy",
        abbreviatedShortDatePattern: "d MMM yyyy",
        shortDatePattern: "M/d/yyyy",
        shortestDatePattern: "M/d/yy",
        abbreviatedMonthDayPattern: "d MMM",
        shortMonthDayPattern: "M/d",
        shortTimePattern: "h:mm tt",
        twoDigitYearMax: 2029
    },

    humanizeFormats: {
        full: {
            dateDaysAgo: "{0} days|ago",
            dateInDays: "in {0}|days",
            dateInWeek: "in a|week",
            dateTimeAndZone: "{0} ({1})",
            dateTimeCombined: "{0}, {1}",
            dateToday: "today",
            dateTomorrow: "tomorrow",
            dateWeekAgo: "a week|ago",
            dateYesterday: "yesterday",
            dimeInSeconds: "in {0}|seconds",
            localLabel: "local",
            timeHourAgo: "an hour|ago",
            timeHoursAgo: "{0} hours|ago",
            timeInHour: "in an|hour",
            timeInHours: "in {0}|hours",
            timeInMinute: "in a|minute",
            timeInMinutes: "in {0}|minutes",
            timeInSecond: "in a|second",
            timeInSeconds: "in {0}|seconds",
            timeMinuteAgo: "a minute|ago",
            timeMinutesAgo: "{0} minutes|ago",
            timeSecondAgo: "a second|ago",
            timeSecondsAgo: "{0} seconds|ago",
            utcLabel: "utc"
        },

        short: {
            dateDaysAgo: "{0}d|ago",
            dateInDays: "in|{0}d",
            dateInWeek: "in a|week",
            dateTimeAndZone: "{0} ({1})",
            dateTimeCombined: "{0}, {1}",
            dateToday: "today",
            dateTomorrow: "tomorrow",
            dateWeekAgo: "a week|ago",
            dateYesterday: "yesterday",
            localLabel: "local",
            timeHourAgo: "1h|ago",
            timeHoursAgo: "{0}h|ago",
            timeInHour: "in|1h",
            timeInHours: "in|{0}h",
            timeInMinute: "in|1m",
            timeInMinutes: "in|{0}m",
            timeInSecond: "in|1s",
            timeInSeconds: "in|{0}s",
            timeMinuteAgo: "1m|ago",
            timeMinutesAgo: "{0}m|ago",
            timeSecondAgo: "1s|ago",
            timeSecondsAgo: "{0}s|ago",
            utcLabel: "utc"
        }
    },

    rangeFormats: {
        dateTimeFromFormat: "from {0} {1}",
        dateTimeToFormat: "to {0} {1}",
        dateTimeRangeFormat: "from {0} to {1} {2}",
        timeFromFormat: "from {0} {1}",
        timeToFormat: "to {0} {1}",
        timeRangeFormat: "from {0} to {1} {2}"
    }
}
