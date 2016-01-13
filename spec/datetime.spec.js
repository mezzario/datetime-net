/// <reference path="../typings/tsd.d.ts"/>
"use strict";
var datetime_1 = require("../src/datetime");
var datetime_2 = require("../src/datetime");
describe("DateTime", function () {
    it("can be created from Date", function () {
        var date = new Date();
        var dateTime = new datetime_1.default(date);
        expect(dateTime.getTicks()).toBe(date.getTime());
        expect(dateTime.getKind()).toBe(datetime_2.DateTimeKind.Unspecified);
    });
    it("can be created from MS string", function () {
        var ticks = -11644473600000;
        var s = "/Date(" + ticks + ")/";
        var dateTime = new datetime_1.default(s);
        expect(dateTime.getTicks()).toBe(ticks);
        expect(dateTime.getKind()).toBe(datetime_2.DateTimeKind.Utc);
    });
    it("can be created from ISO string", function () {
        var s = "1799-06-06T22:30:42.329Z";
        var date = new Date(s);
        var dateTime = new datetime_1.default(s);
        expect(dateTime.getTicks()).toBe(date.getTime());
        expect(dateTime.getKind()).toBe(datetime_2.DateTimeKind.Utc);
        expect(dateTime.getYears()).toBe(1799);
        expect(dateTime.getHours()).toBe(22);
    });
    it("can humanize date", function () {
        expect(datetime_1.default.now().incHours(-4).humanize()).toBe("4h ago");
        expect(datetime_1.default.now().incMinutes(4).humanize()).toBe("in 4m");
    });
});
//# sourceMappingURL=datetime.spec.js.map