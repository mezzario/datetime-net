"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.trim = function (s) {
        return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
    Utils.pad = function (v, len) {
        if (len === void 0) { len = 2; }
        var s = String(v);
        while (s.length < len)
            s = "0" + s;
        return s;
    };
    Utils.isUpperCase = function (ch) {
        return Utils.isAlphaChar(ch) && ch.toUpperCase() === ch;
    };
    Utils.isAlphaChar = function (ch) {
        return ch.toLowerCase() !== ch.toUpperCase();
    };
    Utils.objectAssign = function (target) {
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
    };
    return Utils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Utils;
//# sourceMappingURL=utils.js.map