export default class Utils
{
    static trim(s: string) {
        return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    }

    static pad(v, len = 2) {
        let s = String(v);
        while (s.length < len)
            s = "0" + s;
        return s;
    }

    static isUpperCase(ch: string) {
        return Utils.isAlphaChar(ch) && ch.toUpperCase() === ch;
    }

    static isAlphaChar(ch: string) {
        return ch.toLowerCase() !== ch.toUpperCase();
    }

    static objectAssign(target, ...sources: any[]) {
        "use strict";

        if (target === undefined || target === null)
            throw new TypeError("Cannot convert undefined or null to object");

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null)
                for (var nextKey in source)
                    if (source.hasOwnProperty(nextKey))
                        output[nextKey] = source[nextKey];
        }

        return output;
    }
}
