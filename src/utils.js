/// <reference path="../typings/tsd.d.ts" />
"use strict";
function trim(s) {
    return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
exports.trim = trim;
function pad(v, len) {
    if (len === void 0) { len = 2; }
    var s = String(v);
    while (s.length < len)
        s = "0" + s;
    return s;
}
exports.pad = pad;
function isUpperCase(ch) {
    return isAlphaChar(ch) && ch.toUpperCase() === ch;
}
exports.isUpperCase = isUpperCase;
function isAlphaChar(ch) {
    return ch.toLowerCase() !== ch.toUpperCase();
}
exports.isAlphaChar = isAlphaChar;
function objectAssign(target) {
    "use strict";
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
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
exports.objectAssign = objectAssign;
//# sourceMappingURL=utils.js.map