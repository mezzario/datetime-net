/// <reference path="../typings/tsd.d.ts"/>

import DateTime from "../src/datetime";
import { DateTimeKind } from "../src/datetime";

describe("DateTime", () => {
    it("can be created from Date", () => {
        let date = new Date();
        let dateTime = new DateTime(date);

        expect(dateTime.getTicks()).toBe(date.getTime());
        expect(dateTime.getKind()).toBe(DateTimeKind.Unspecified);
    });

    it("can be created from MS string", () => {
        let ticks = -11644473600000;
        let s = `/Date(${ticks})/`;
        let dateTime = new DateTime(s);

        expect(dateTime.getTicks()).toBe(ticks);
        expect(dateTime.getKind()).toBe(DateTimeKind.Utc);
    });

    it("can be created from ISO string", () => {
        let s = "1799-06-06T22:30:42.329Z";
        let date = new Date(s);
        let dateTime = new DateTime(s);

        expect(dateTime.getTicks()).toBe(date.getTime());
        expect(dateTime.getKind()).toBe(DateTimeKind.Utc);
        expect(dateTime.getYears()).toBe(1799);
        expect(dateTime.getHours()).toBe(22);
    });

    it("can humanize date", () => {
        expect(DateTime.now().incHours(-4).humanize()).toBe("4h ago");
        expect(DateTime.now().incMinutes(4).humanize()).toBe("in 4m");
    });
});
