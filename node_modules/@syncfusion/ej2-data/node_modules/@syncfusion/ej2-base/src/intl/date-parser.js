import { IntlBase as base } from './intl-base';
import { ParserBase as parser } from './parser-base';
import { isUndefined, throwError, getValue, isNullOrUndefined, isBlazor } from '../util';
import { datePartMatcher } from './date-formatter';
import { HijriParser } from '../hijri-parser';
var standalone = 'stand-alone';
var latnRegex = /^[0-9]*$/;
var timeSetter = {
    minute: 'setMinutes',
    hour: 'setHours',
    second: 'setSeconds',
    day: 'setDate',
    month: 'setMonth',
    milliseconds: 'setMilliseconds'
};
var month = 'months';
/**
 * Date Parser.
 *
 * @private
 */
var DateParser = /** @class */ (function () {
    function DateParser() {
    }
    /**
     * Returns the parser function for given skeleton.
     *
     * @param {string} culture -  Specifies the culture name to be which formatting.
     * @param {DateFormatOptions} option - Specific the format in which string date  will be parsed.
     * @param {Object} cldr - Specifies the global cldr data collection.
     * @returns {Function} ?
     */
    DateParser.dateParser = function (culture, option, cldr) {
        var _this = this;
        var dependable = base.getDependables(cldr, culture, option.calendar);
        var numOptions = parser.getCurrentNumericOptions(dependable.parserObject, parser.getNumberingSystem(cldr), false, isBlazor());
        var parseOptions = {};
        if (isBlazor() && option.isServerRendered) {
            option = base.compareBlazorDateFormats(option, culture);
        }
        var resPattern = option.format ||
            base.getResultantPattern(option.skeleton, dependable.dateObject, option.type, false, isBlazor() ? culture : '');
        var regexString = '';
        var hourOnly;
        if (isUndefined(resPattern)) {
            throwError('Format options or type given must be invalid');
        }
        else {
            resPattern = base.ConvertDateToWeekFormat(resPattern);
            parseOptions = { isIslamic: base.islamicRegex.test(option.calendar), pattern: resPattern, evalposition: {}, culture: culture };
            var patternMatch = resPattern.match(base.dateParseRegex) || [];
            var length_1 = patternMatch.length;
            var gmtCorrection = 0;
            var zCorrectTemp = 0;
            var isgmtTraversed = false;
            var nRegx = numOptions.numericRegex;
            var numMapper = isBlazor() ? dependable.parserObject.numbers
                : parser.getNumberMapper(dependable.parserObject, parser.getNumberingSystem(cldr));
            for (var i = 0; i < length_1; i++) {
                var str = patternMatch[parseInt(i.toString(), 10)];
                var len = str.length;
                var char = (str[0] === 'K') ? 'h' : str[0];
                var isNumber = void 0;
                var canUpdate = void 0;
                var charKey = datePartMatcher["" + char];
                var optional = (len === 2) ? '' : '?';
                if (isgmtTraversed) {
                    gmtCorrection = zCorrectTemp;
                    isgmtTraversed = false;
                }
                switch (char) {
                    case 'E':
                    case 'c': {
                        var weekData = void 0;
                        if (isBlazor()) {
                            weekData = getValue('days.' + base.monthIndex["" + len], dependable.dateObject);
                        }
                        else {
                            weekData = dependable.dateObject["" + base.days]["" + standalone][base.monthIndex["" + len]];
                        }
                        var weekObject = parser.reverseObject(weekData);
                        regexString += '(' + Object.keys(weekObject).join('|') + ')';
                        break;
                    }
                    case 'M':
                    case 'L':
                    case 'd':
                    case 'm':
                    case 's':
                    case 'h':
                    case 'H':
                    case 'f':
                        canUpdate = true;
                        if ((char === 'M' || char === 'L') && len > 2) {
                            var monthData = void 0;
                            if (isBlazor()) {
                                monthData = getValue('months.' + base.monthIndex["" + len], dependable.dateObject);
                            }
                            else {
                                monthData = dependable.dateObject["" + month]["" + standalone][base.monthIndex["" + len]];
                            }
                            parseOptions["" + charKey] = parser.reverseObject(monthData);
                            regexString += '(' + Object.keys(parseOptions["" + charKey]).join('|') + ')';
                        }
                        else if (char === 'f') {
                            if (len > 3) {
                                continue;
                            }
                            isNumber = true;
                            regexString += '(' + nRegx + nRegx + '?' + nRegx + '?' + ')';
                        }
                        else {
                            isNumber = true;
                            regexString += '(' + nRegx + nRegx + optional + ')';
                        }
                        if (char === 'h') {
                            parseOptions.hour12 = true;
                        }
                        break;
                    case 'W': {
                        var opt = len === 1 ? '?' : '';
                        regexString += '(' + nRegx + opt + nRegx + ')';
                        break;
                    }
                    case 'y':
                        canUpdate = isNumber = true;
                        if (len === 2) {
                            regexString += '(' + nRegx + nRegx + ')';
                        }
                        else {
                            regexString += '(' + nRegx + '{' + len + ',})';
                        }
                        break;
                    case 'a': {
                        canUpdate = true;
                        var periodValur = isBlazor() ?
                            getValue('dayPeriods', dependable.dateObject) :
                            getValue('dayPeriods.format.wide', dependable.dateObject);
                        parseOptions["" + charKey] = parser.reverseObject(periodValur);
                        regexString += '(' + Object.keys(parseOptions["" + charKey]).join('|') + ')';
                        break;
                    }
                    case 'G': {
                        canUpdate = true;
                        var eText = (len <= 3) ? 'eraAbbr' : (len === 4) ? 'eraNames' : 'eraNarrow';
                        parseOptions["" + charKey] = parser.reverseObject(isBlazor() ?
                            getValue('eras', dependable.dateObject) : getValue('eras.' + eText, dependable.dateObject));
                        regexString += '(' + Object.keys(parseOptions["" + charKey]).join('|') + '?)';
                        break;
                    }
                    case 'z': {
                        var tval = new Date().getTimezoneOffset();
                        canUpdate = (tval !== 0);
                        parseOptions["" + charKey] = getValue('dates.timeZoneNames', dependable.parserObject);
                        var tzone = parseOptions["" + charKey];
                        hourOnly = (len < 4);
                        var hpattern = hourOnly ? '+H;-H' : tzone.hourFormat;
                        hpattern = hpattern.replace(/:/g, numMapper.timeSeparator);
                        regexString += '(' + this.parseTimeZoneRegx(hpattern, tzone, nRegx) + ')?';
                        isgmtTraversed = true;
                        zCorrectTemp = hourOnly ? 6 : 12;
                        break;
                    }
                    case '\'': {
                        var iString = str.replace(/'/g, '');
                        regexString += '(' + iString + ')?';
                        break;
                    }
                    default:
                        regexString += '([\\D])';
                        break;
                }
                if (canUpdate) {
                    parseOptions.evalposition["" + charKey] = { isNumber: isNumber, pos: i + 1 + gmtCorrection, hourOnly: hourOnly };
                }
                if (i === length_1 - 1 && !isNullOrUndefined(regexString)) {
                    var regExp = RegExp;
                    parseOptions.parserRegex = new regExp('^' + regexString + '$', 'i');
                }
            }
        }
        return function (value) {
            var parsedDateParts = _this.internalDateParse(value, parseOptions, numOptions);
            if (isNullOrUndefined(parsedDateParts) || !Object.keys(parsedDateParts).length) {
                return null;
            }
            if (parseOptions.isIslamic) {
                var dobj = {};
                var tYear = parsedDateParts.year;
                var tDate = parsedDateParts.day;
                var tMonth = parsedDateParts.month;
                var ystrig = tYear ? (tYear + '') : '';
                var is2DigitYear = (ystrig.length === 2);
                if (!tYear || !tMonth || !tDate || is2DigitYear) {
                    dobj = HijriParser.getHijriDate(new Date());
                }
                if (is2DigitYear) {
                    tYear = parseInt((dobj.year + '').slice(0, 2) + ystrig, 10);
                }
                var dateObject = HijriParser.toGregorian(tYear || dobj.year, tMonth || dobj.month, tDate || dobj.date);
                parsedDateParts.year = dateObject.getFullYear();
                parsedDateParts.month = dateObject.getMonth() + 1;
                parsedDateParts.day = dateObject.getDate();
            }
            return _this.getDateObject(parsedDateParts);
        };
    };
    /**
     * Returns date object for provided date options
     *
     * @param {DateParts} options ?
     * @param {Date} value ?
     * @returns {Date} ?
     */
    DateParser.getDateObject = function (options, value) {
        var res = value || new Date();
        res.setMilliseconds(0);
        var tKeys = ['hour', 'minute', 'second', 'milliseconds', 'month', 'day'];
        var y = options.year;
        var desig = options.designator;
        var tzone = options.timeZone;
        if (!isUndefined(y)) {
            var len = (y + '').length;
            var typedYearString = options.typedYearString || '';
            var isPaddedAncientYear = /^0{2,3}\d{1,2}$/.test(typedYearString);
            if (len <= 2 && !isPaddedAncientYear) {
                var century = Math.floor(res.getFullYear() / 100) * 100;
                y += century;
            }
            if (isPaddedAncientYear) {
                return null;
            }
            res.setFullYear(y);
        }
        for (var _i = 0, tKeys_1 = tKeys; _i < tKeys_1.length; _i++) {
            var key = tKeys_1[_i];
            var tValue = options["" + key];
            if (isUndefined(tValue) && key === 'day') {
                res.setDate(1);
            }
            if (!isUndefined(tValue)) {
                if (key === 'month') {
                    tValue -= 1;
                    if (tValue < 0 || tValue > 11) {
                        return new Date('invalid');
                    }
                    var pDate = res.getDate();
                    res.setDate(1);
                    res[timeSetter["" + key]](tValue);
                    var lDate = new Date(res.getFullYear(), tValue + 1, 0).getDate();
                    res.setDate(pDate < lDate ? pDate : lDate);
                }
                else {
                    if (key === 'day') {
                        var lastDay = new Date(res.getFullYear(), res.getMonth() + 1, 0).getDate();
                        if ((tValue < 1 || tValue > lastDay)) {
                            return null;
                        }
                    }
                    if (key === 'hour') {
                        var is12h = options.hour12;
                        if (is12h) {
                            if (tValue < 1 || tValue > 12) {
                                return null;
                            }
                        }
                        else {
                            if (tValue < 0 || tValue > 23) {
                                return null;
                            }
                        }
                    }
                    else if (key === 'minute' || key === 'second') {
                        if (tValue < 0 || tValue > 59) {
                            return null;
                        }
                    }
                    else if (key === 'milliseconds') {
                        if (tValue < 0 || tValue > 999) {
                            return null;
                        }
                    }
                    res["" + timeSetter["" + key]](tValue);
                }
            }
        }
        if (!isUndefined(desig)) {
            var hour = res.getHours();
            if (desig === 'pm') {
                res.setHours(hour + (hour === 12 ? 0 : 12));
            }
            else if (hour === 12) {
                res.setHours(0);
            }
        }
        if (!isUndefined(tzone)) {
            var tzValue = tzone - res.getTimezoneOffset();
            if (tzValue !== 0) {
                res.setMinutes(res.getMinutes() + tzValue);
            }
        }
        return res;
    };
    /**
     * Returns date parsing options for provided value along with parse and numeric options
     *
     * @param {string} value ?
     * @param {ParseOptions} parseOptions ?
     * @param {NumericOptions} num ?
     * @returns {DateParts} ?
     */
    DateParser.internalDateParse = function (value, parseOptions, num) {
        var matches = value.match(parseOptions.parserRegex);
        var retOptions = { 'hour': 0, 'minute': 0, 'second': 0 };
        if (isNullOrUndefined(matches)) {
            return null;
        }
        else {
            var props = Object.keys(parseOptions.evalposition);
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var prop = props_1[_i];
                var curObject = parseOptions.evalposition["" + prop];
                var matchString = matches[curObject.pos];
                if (curObject.isNumber) {
                    retOptions["" + prop] = this.internalNumberParser(matchString, num);
                    if (prop === 'year' && !isNullOrUndefined(matchString)) {
                        retOptions.typedYearString = matchString.trim();
                    }
                }
                else {
                    if (prop === 'timeZone' && !isUndefined(matchString)) {
                        var pos = curObject.pos;
                        var val = void 0;
                        var tmatch = matches[pos + 1];
                        var flag = !isUndefined(tmatch);
                        if (curObject.hourOnly) {
                            val = this.getZoneValue(flag, tmatch, matches[pos + 4], num) * 60;
                        }
                        else {
                            val = this.getZoneValue(flag, tmatch, matches[pos + 7], num) * 60;
                            val += this.getZoneValue(flag, matches[pos + 4], matches[pos + 10], num);
                        }
                        if (!isNullOrUndefined(val)) {
                            retOptions["" + prop] = val;
                        }
                    }
                    else {
                        var cultureOptions = ['en-US', 'en-MH', 'en-MP'];
                        matchString = ((prop === 'month') && (!parseOptions.isIslamic) && (parseOptions.culture === 'en' || parseOptions.culture === 'en-GB' || parseOptions.culture === 'en-US'))
                            ? matchString[0].toUpperCase() + matchString.substring(1).toLowerCase() : matchString;
                        matchString = ((prop !== 'month') && (prop === 'designator') && parseOptions.culture && parseOptions.culture.indexOf('en-') !== -1 && cultureOptions.indexOf(parseOptions.culture) === -1)
                            ? matchString.toLowerCase() : matchString;
                        retOptions["" + prop] = parseOptions["" + prop]["" + matchString];
                    }
                }
            }
            if (parseOptions.hour12) {
                retOptions.hour12 = true;
            }
        }
        return retOptions;
    };
    /**
     * Returns parsed number for provided Numeric string and Numeric Options
     *
     * @param {string} value ?
     * @param {NumericOptions} option ?
     * @returns {number} ?
     */
    DateParser.internalNumberParser = function (value, option) {
        value = parser.convertValueParts(value, option.numberParseRegex, option.numericPair);
        if (latnRegex.test(value)) {
            return +value;
        }
        return null;
    };
    /**
     * Escapes all regex metacharacters in a string, preserving the {0} placeholder.
     *
     * @param {string} str ? - The input string to escape.
     * @returns {string} ? - The escaped string with {0} preserved.
     */
    DateParser.escapeRegex = function (str) {
        var tempPlaceholder = '__TEMP__';
        var tempStr = str.replace('{0}', tempPlaceholder);
        var metaChars = /[.*+?^${}()|[\]\\]/g;
        var escapedStr = tempStr.replace(metaChars, '\\$&');
        return escapedStr.replace(tempPlaceholder, '{0}');
    };
    /**
     * Returns parsed time zone RegExp for provided hour format and time zone
     *
     * @param {string} hourFormat ?
     * @param {base.TimeZoneOptions} tZone ?
     * @param {string} nRegex ?
     * @returns {string} ?
     */
    DateParser.parseTimeZoneRegx = function (hourFormat, tZone, nRegex) {
        var pattern = tZone.gmtFormat;
        var ret;
        var cRegex = '(' + nRegex + ')' + '(' + nRegex + ')';
        ret = hourFormat.replace('+', '\\+');
        if (hourFormat.indexOf('HH') !== -1) {
            ret = ret.replace(/HH|mm/g, '(' + cRegex + ')');
        }
        else {
            ret = ret.replace(/H|m/g, '(' + cRegex + '?)');
        }
        pattern = this.escapeRegex(pattern);
        var splitStr = (ret.split(';').map(function (str) {
            return pattern.replace('{0}', str);
        }));
        var gmtZeroFormat = this.escapeRegex(tZone.gmtZeroFormat);
        ret = splitStr.join('|') + '|' + gmtZeroFormat;
        return ret;
    };
    /**
     * Returns zone based value.
     *
     * @param {boolean} flag ?
     * @param {string} val1 ?
     * @param {string} val2 ?
     * @param {NumericOptions} num ?
     * @returns {number} ?
     */
    DateParser.getZoneValue = function (flag, val1, val2, num) {
        var ival = flag ? val1 : val2;
        if (!ival) {
            return 0;
        }
        var value = this.internalNumberParser(ival, num);
        if (flag) {
            return -value;
        }
        return value;
    };
    return DateParser;
}());
export { DateParser };
