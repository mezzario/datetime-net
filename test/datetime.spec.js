import expect from "expect"
import DateTime, {DateTimeKind} from "../src/datetime"
import {describe, it} from "mocha"

describe("DateTime", () => {
  it("can be created from Date", () => {
    const date = new Date()
    const dateTime = new DateTime(date)

    expect(dateTime.getTicks()).toBe(date.getTime())
    expect(dateTime.getKind()).toBe(DateTimeKind.Unspecified)
  })

  it("can be created from MS string", () => {
    const ticks = -11644473600000
    const s = `/Date(${ticks})/`
    const dateTime = new DateTime(s)

    expect(dateTime.getTicks()).toBe(ticks)
    expect(dateTime.getKind()).toBe(DateTimeKind.Utc)
  })

  it("can be created from ISO string", () => {
    const s = "1799-06-06T22:30:42.329Z"
    const date = new Date(s)
    const dateTime = new DateTime(s)

    expect(dateTime.getTicks()).toBe(date.getTime())
    expect(dateTime.getKind()).toBe(DateTimeKind.Utc)
    expect(dateTime.getYears()).toBe(1799)
    expect(dateTime.getHours()).toBe(22)
  })

  it("can humanize date", () => {
    expect(DateTime.now().incHours(-4).humanize()).toBe("4h ago")
    expect(DateTime.now().incMinutes(4).humanize()).toBe("in 4m")
  })
})
