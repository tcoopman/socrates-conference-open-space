/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 75);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var isDate = __webpack_require__(23);

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var DEFAULT_ADDITIONAL_DIGITS = 2;

var parseTokenDateTimeDelimeter = /[T ]/;
var parseTokenPlainTime = /:/;

// year tokens
var parseTokenYY = /^(\d{2})$/;
var parseTokensYYY = [/^([+-]\d{2})$/, // 0 additional digits
/^([+-]\d{3})$/, // 1 additional digit
/^([+-]\d{4})$/ // 2 additional digits
];

var parseTokenYYYY = /^(\d{4})/;
var parseTokensYYYYY = [/^([+-]\d{4})/, // 0 additional digits
/^([+-]\d{5})/, // 1 additional digit
/^([+-]\d{6})/ // 2 additional digits
];

// date tokens
var parseTokenMM = /^-(\d{2})$/;
var parseTokenDDD = /^-?(\d{3})$/;
var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/;
var parseTokenWww = /^-?W(\d{2})$/;
var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/;

// time tokens
var parseTokenHH = /^(\d{2}([.,]\d*)?)$/;
var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/;
var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/;

// timezone tokens
var parseTokenTimezone = /([Z+-].*)$/;
var parseTokenTimezoneZ = /^(Z)$/;
var parseTokenTimezoneHH = /^([+-])(\d{2})$/;
var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/;

/**
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If an argument is a string, the function tries to parse it.
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If all above fails, the function passes the given argument to Date constructor.
 *
 * @param {Date|String|Number} argument - the value to convert
 * @param {Object} [options] - the object with options
 * @param {0 | 1 | 2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @returns {Date} the parsed date in the local time zone
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * var result = parse('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Parse string '+02014101',
 * // if the additional number of digits in the extended year format is 1:
 * var result = parse('+02014101', {additionalDigits: 1})
 * //=> Fri Apr 11 2014 00:00:00
 */
function parse(argument, dirtyOptions) {
  if (isDate(argument)) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument !== 'string') {
    return new Date(argument);
  }

  var options = dirtyOptions || {};
  var additionalDigits = options.additionalDigits;
  if (additionalDigits == null) {
    additionalDigits = DEFAULT_ADDITIONAL_DIGITS;
  } else {
    additionalDigits = Number(additionalDigits);
  }

  var dateStrings = splitDateString(argument);

  var parseYearResult = parseYear(dateStrings.date, additionalDigits);
  var year = parseYearResult.year;
  var restDateString = parseYearResult.restDateString;

  var date = parseDate(restDateString, year);

  if (date) {
    var timestamp = date.getTime();
    var time = 0;
    var offset;

    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
    }

    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
    } else {
      // get offset accurate to hour in timezones that change offset
      offset = new Date(timestamp + time).getTimezoneOffset();
      offset = new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE).getTimezoneOffset();
    }

    return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE);
  } else {
    return new Date(argument);
  }
}

function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(parseTokenDateTimeDelimeter);
  var timeString;

  if (parseTokenPlainTime.test(array[0])) {
    dateStrings.date = null;
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
  }

  if (timeString) {
    var token = parseTokenTimezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString, additionalDigits) {
  var parseTokenYYY = parseTokensYYY[additionalDigits];
  var parseTokenYYYYY = parseTokensYYYYY[additionalDigits];

  var token;

  // YYYY or ±YYYYY
  token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString);
  if (token) {
    var yearString = token[1];
    return {
      year: parseInt(yearString, 10),
      restDateString: dateString.slice(yearString.length)
    };
  }

  // YY or ±YYY
  token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString);
  if (token) {
    var centuryString = token[1];
    return {
      year: parseInt(centuryString, 10) * 100,
      restDateString: dateString.slice(centuryString.length)
    };
  }

  // Invalid ISO-formatted year
  return {
    year: null
  };
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) {
    return null;
  }

  var token;
  var date;
  var month;
  var week;

  // YYYY
  if (dateString.length === 0) {
    date = new Date(0);
    date.setUTCFullYear(year);
    return date;
  }

  // YYYY-MM
  token = parseTokenMM.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    date.setUTCFullYear(year, month);
    return date;
  }

  // YYYY-DDD or YYYYDDD
  token = parseTokenDDD.exec(dateString);
  if (token) {
    date = new Date(0);
    var dayOfYear = parseInt(token[1], 10);
    date.setUTCFullYear(year, 0, dayOfYear);
    return date;
  }

  // YYYY-MM-DD or YYYYMMDD
  token = parseTokenMMDD.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    var day = parseInt(token[2], 10);
    date.setUTCFullYear(year, month, day);
    return date;
  }

  // YYYY-Www or YYYYWww
  token = parseTokenWww.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    return dayOfISOYear(year, week);
  }

  // YYYY-Www-D or YYYYWwwD
  token = parseTokenWwwD.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    var dayOfWeek = parseInt(token[2], 10) - 1;
    return dayOfISOYear(year, week, dayOfWeek);
  }

  // Invalid ISO-formatted date
  return null;
}

function parseTime(timeString) {
  var token;
  var hours;
  var minutes;

  // hh
  token = parseTokenHH.exec(timeString);
  if (token) {
    hours = parseFloat(token[1].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR;
  }

  // hh:mm or hhmm
  token = parseTokenHHMM.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseFloat(token[2].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
  }

  // hh:mm:ss or hhmmss
  token = parseTokenHHMMSS.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseInt(token[2], 10);
    var seconds = parseFloat(token[3].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000;
  }

  // Invalid ISO-formatted time
  return null;
}

function parseTimezone(timezoneString) {
  var token;
  var absoluteOffset;

  // Z
  token = parseTokenTimezoneZ.exec(timezoneString);
  if (token) {
    return 0;
  }

  // ±hh
  token = parseTokenTimezoneHH.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60;
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  }

  // ±hh:mm or ±hhmm
  token = parseTokenTimezoneHHMM.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  }

  return 0;
}

function dayOfISOYear(isoYear, week, day) {
  week = week || 0;
  day = day || 0;
  var date = new Date(0);
  date.setUTCFullYear(isoYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

module.exports = parse;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export out_of_memory */
/* unused harmony export sys_error */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return failure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return invalid_argument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return end_of_file; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return division_by_zero; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return not_found; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return match_failure; });
/* unused harmony export stack_overflow */
/* unused harmony export sys_blocked_io */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return assert_failure; });
/* unused harmony export undefined_recursive_module */


var out_of_memory = /* tuple */["Out_of_memory", 0];

var sys_error = /* tuple */["Sys_error", -1];

var failure = /* tuple */["Failure", -2];

var invalid_argument = /* tuple */["Invalid_argument", -3];

var end_of_file = /* tuple */["End_of_file", -4];

var division_by_zero = /* tuple */["Division_by_zero", -5];

var not_found = /* tuple */["Not_found", -6];

var match_failure = /* tuple */["Match_failure", -7];

var stack_overflow = /* tuple */["Stack_overflow", -8];

var sys_blocked_io = /* tuple */["Sys_blocked_io", -9];

var assert_failure = /* tuple */["Assert_failure", -10];

var undefined_recursive_module = /* tuple */["Undefined_recursive_module", -11];

out_of_memory.tag = 248;

sys_error.tag = 248;

failure.tag = 248;

invalid_argument.tag = 248;

end_of_file.tag = 248;

division_by_zero.tag = 248;

not_found.tag = 248;

match_failure.tag = 248;

stack_overflow.tag = 248;

sys_blocked_io.tag = 248;

assert_failure.tag = 248;

undefined_recursive_module.tag = 248;


/*  Not a pure module */

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export app */
/* unused harmony export curry_1 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _1; });
/* unused harmony export __1 */
/* unused harmony export curry_2 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _2; });
/* unused harmony export __2 */
/* unused harmony export curry_3 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return _3; });
/* unused harmony export __3 */
/* unused harmony export curry_4 */
/* unused harmony export _4 */
/* unused harmony export __4 */
/* unused harmony export curry_5 */
/* unused harmony export _5 */
/* unused harmony export __5 */
/* unused harmony export curry_6 */
/* unused harmony export _6 */
/* unused harmony export __6 */
/* unused harmony export curry_7 */
/* unused harmony export _7 */
/* unused harmony export __7 */
/* unused harmony export curry_8 */
/* unused harmony export _8 */
/* unused harmony export __8 */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_array_js__ = __webpack_require__(22);




function app(_f, _args) {
  while (true) {
    var args = _args;
    var f = _f;
    var arity = f.length;
    var arity$1 = arity ? arity : 1;
    var len = args.length;
    var d = arity$1 - len | 0;
    if (d) {
      if (d < 0) {
        _args = __WEBPACK_IMPORTED_MODULE_0__caml_array_js__["e" /* caml_array_sub */](args, arity$1, -d | 0);
        _f = f.apply(null, __WEBPACK_IMPORTED_MODULE_0__caml_array_js__["e" /* caml_array_sub */](args, 0, arity$1));
        continue;
      } else {
        return function (f, args) {
          return function (x) {
            return app(f, args.concat( /* array */[x]));
          };
        }(f, args);
      }
    } else {
      return f.apply(null, args);
    }
  };
}

function curry_1(o, a0, arity) {
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        return o(a0);
      case 2:
        return function (param) {
          return o(a0, param);
        };
      case 3:
        return function (param, param$1) {
          return o(a0, param, param$1);
        };
      case 4:
        return function (param, param$1, param$2) {
          return o(a0, param, param$1, param$2);
        };
      case 5:
        return function (param, param$1, param$2, param$3) {
          return o(a0, param, param$1, param$2, param$3);
        };
      case 6:
        return function (param, param$1, param$2, param$3, param$4) {
          return o(a0, param, param$1, param$2, param$3, param$4);
        };
      case 7:
        return function (param, param$1, param$2, param$3, param$4, param$5) {
          return o(a0, param, param$1, param$2, param$3, param$4, param$5);
        };

    }
  }
}

function _1(o, a0) {
  var arity = o.length;
  if (arity === 1) {
    return o(a0);
  } else {
    return curry_1(o, a0, arity);
  }
}

function __1(o) {
  var arity = o.length;
  if (arity === 1) {
    return o;
  } else {
    return function (a0) {
      return _1(o, a0);
    };
  }
}

function curry_2(o, a0, a1, arity) {
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0, a1]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        return app(o(a0), /* array */[a1]);
      case 2:
        return o(a0, a1);
      case 3:
        return function (param) {
          return o(a0, a1, param);
        };
      case 4:
        return function (param, param$1) {
          return o(a0, a1, param, param$1);
        };
      case 5:
        return function (param, param$1, param$2) {
          return o(a0, a1, param, param$1, param$2);
        };
      case 6:
        return function (param, param$1, param$2, param$3) {
          return o(a0, a1, param, param$1, param$2, param$3);
        };
      case 7:
        return function (param, param$1, param$2, param$3, param$4) {
          return o(a0, a1, param, param$1, param$2, param$3, param$4);
        };

    }
  }
}

function _2(o, a0, a1) {
  var arity = o.length;
  if (arity === 2) {
    return o(a0, a1);
  } else {
    return curry_2(o, a0, a1, arity);
  }
}

function __2(o) {
  var arity = o.length;
  if (arity === 2) {
    return o;
  } else {
    return function (a0, a1) {
      return _2(o, a0, a1);
    };
  }
}

function curry_3(o, a0, a1, a2, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0, a1, a2]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        exit = 1;
        break;
      case 2:
        return app(o(a0, a1), /* array */[a2]);
      case 3:
        return o(a0, a1, a2);
      case 4:
        return function (param) {
          return o(a0, a1, a2, param);
        };
      case 5:
        return function (param, param$1) {
          return o(a0, a1, a2, param, param$1);
        };
      case 6:
        return function (param, param$1, param$2) {
          return o(a0, a1, a2, param, param$1, param$2);
        };
      case 7:
        return function (param, param$1, param$2, param$3) {
          return o(a0, a1, a2, param, param$1, param$2, param$3);
        };

    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[a1, a2]);
  }
}

function _3(o, a0, a1, a2) {
  var arity = o.length;
  if (arity === 3) {
    return o(a0, a1, a2);
  } else {
    return curry_3(o, a0, a1, a2, arity);
  }
}

function __3(o) {
  var arity = o.length;
  if (arity === 3) {
    return o;
  } else {
    return function (a0, a1, a2) {
      return _3(o, a0, a1, a2);
    };
  }
}

function curry_4(o, a0, a1, a2, a3, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0, a1, a2, a3]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        exit = 1;
        break;
      case 2:
        return app(o(a0, a1), /* array */[a2, a3]);
      case 3:
        return app(o(a0, a1, a2), /* array */[a3]);
      case 4:
        return o(a0, a1, a2, a3);
      case 5:
        return function (param) {
          return o(a0, a1, a2, a3, param);
        };
      case 6:
        return function (param, param$1) {
          return o(a0, a1, a2, a3, param, param$1);
        };
      case 7:
        return function (param, param$1, param$2) {
          return o(a0, a1, a2, a3, param, param$1, param$2);
        };

    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[a1, a2, a3]);
  }
}

function _4(o, a0, a1, a2, a3) {
  var arity = o.length;
  if (arity === 4) {
    return o(a0, a1, a2, a3);
  } else {
    return curry_4(o, a0, a1, a2, a3, arity);
  }
}

function __4(o) {
  var arity = o.length;
  if (arity === 4) {
    return o;
  } else {
    return function (a0, a1, a2, a3) {
      return _4(o, a0, a1, a2, a3);
    };
  }
}

function curry_5(o, a0, a1, a2, a3, a4, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0, a1, a2, a3, a4]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        exit = 1;
        break;
      case 2:
        return app(o(a0, a1), /* array */[a2, a3, a4]);
      case 3:
        return app(o(a0, a1, a2), /* array */[a3, a4]);
      case 4:
        return app(o(a0, a1, a2, a3), /* array */[a4]);
      case 5:
        return o(a0, a1, a2, a3, a4);
      case 6:
        return function (param) {
          return o(a0, a1, a2, a3, a4, param);
        };
      case 7:
        return function (param, param$1) {
          return o(a0, a1, a2, a3, a4, param, param$1);
        };

    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[a1, a2, a3, a4]);
  }
}

function _5(o, a0, a1, a2, a3, a4) {
  var arity = o.length;
  if (arity === 5) {
    return o(a0, a1, a2, a3, a4);
  } else {
    return curry_5(o, a0, a1, a2, a3, a4, arity);
  }
}

function __5(o) {
  var arity = o.length;
  if (arity === 5) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4) {
      return _5(o, a0, a1, a2, a3, a4);
    };
  }
}

function curry_6(o, a0, a1, a2, a3, a4, a5, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0, a1, a2, a3, a4, a5]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        exit = 1;
        break;
      case 2:
        return app(o(a0, a1), /* array */[a2, a3, a4, a5]);
      case 3:
        return app(o(a0, a1, a2), /* array */[a3, a4, a5]);
      case 4:
        return app(o(a0, a1, a2, a3), /* array */[a4, a5]);
      case 5:
        return app(o(a0, a1, a2, a3, a4), /* array */[a5]);
      case 6:
        return o(a0, a1, a2, a3, a4, a5);
      case 7:
        return function (param) {
          return o(a0, a1, a2, a3, a4, a5, param);
        };

    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[a1, a2, a3, a4, a5]);
  }
}

function _6(o, a0, a1, a2, a3, a4, a5) {
  var arity = o.length;
  if (arity === 6) {
    return o(a0, a1, a2, a3, a4, a5);
  } else {
    return curry_6(o, a0, a1, a2, a3, a4, a5, arity);
  }
}

function __6(o) {
  var arity = o.length;
  if (arity === 6) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4, a5) {
      return _6(o, a0, a1, a2, a3, a4, a5);
    };
  }
}

function curry_7(o, a0, a1, a2, a3, a4, a5, a6, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0, a1, a2, a3, a4, a5, a6]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        exit = 1;
        break;
      case 2:
        return app(o(a0, a1), /* array */[a2, a3, a4, a5, a6]);
      case 3:
        return app(o(a0, a1, a2), /* array */[a3, a4, a5, a6]);
      case 4:
        return app(o(a0, a1, a2, a3), /* array */[a4, a5, a6]);
      case 5:
        return app(o(a0, a1, a2, a3, a4), /* array */[a5, a6]);
      case 6:
        return app(o(a0, a1, a2, a3, a4, a5), /* array */[a6]);
      case 7:
        return o(a0, a1, a2, a3, a4, a5, a6);

    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[a1, a2, a3, a4, a5, a6]);
  }
}

function _7(o, a0, a1, a2, a3, a4, a5, a6) {
  var arity = o.length;
  if (arity === 7) {
    return o(a0, a1, a2, a3, a4, a5, a6);
  } else {
    return curry_7(o, a0, a1, a2, a3, a4, a5, a6, arity);
  }
}

function __7(o) {
  var arity = o.length;
  if (arity === 7) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4, a5, a6) {
      return _7(o, a0, a1, a2, a3, a4, a5, a6);
    };
  }
}

function curry_8(o, a0, a1, a2, a3, a4, a5, a6, a7, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0, a1, a2, a3, a4, a5, a6, a7]);
  } else {
    switch (arity) {
      case 0:
      case 1:
        exit = 1;
        break;
      case 2:
        return app(o(a0, a1), /* array */[a2, a3, a4, a5, a6, a7]);
      case 3:
        return app(o(a0, a1, a2), /* array */[a3, a4, a5, a6, a7]);
      case 4:
        return app(o(a0, a1, a2, a3), /* array */[a4, a5, a6, a7]);
      case 5:
        return app(o(a0, a1, a2, a3, a4), /* array */[a5, a6, a7]);
      case 6:
        return app(o(a0, a1, a2, a3, a4, a5), /* array */[a6, a7]);
      case 7:
        return app(o(a0, a1, a2, a3, a4, a5, a6), /* array */[a7]);

    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[a1, a2, a3, a4, a5, a6, a7]);
  }
}

function _8(o, a0, a1, a2, a3, a4, a5, a6, a7) {
  var arity = o.length;
  if (arity === 8) {
    return o(a0, a1, a2, a3, a4, a5, a6, a7);
  } else {
    return curry_8(o, a0, a1, a2, a3, a4, a5, a6, a7, arity);
  }
}

function __8(o) {
  var arity = o.length;
  if (arity === 8) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4, a5, a6, a7) {
      return _8(o, a0, a1, a2, a3, a4, a5, a6, a7);
    };
  }
}


/* No side effect */

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return length; });
/* unused harmony export hd */
/* unused harmony export tl */
/* unused harmony export nth */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return rev; });
/* unused harmony export append */
/* unused harmony export rev_append */
/* unused harmony export concat */
/* unused harmony export flatten */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return iter; });
/* unused harmony export iteri */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return map; });
/* unused harmony export mapi */
/* unused harmony export rev_map */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fold_left; });
/* unused harmony export fold_right */
/* unused harmony export iter2 */
/* unused harmony export map2 */
/* unused harmony export rev_map2 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return fold_left2; });
/* unused harmony export fold_right2 */
/* unused harmony export for_all */
/* unused harmony export exists */
/* unused harmony export for_all2 */
/* unused harmony export exists2 */
/* unused harmony export mem */
/* unused harmony export memq */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return find; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return filter; });
/* unused harmony export find_all */
/* unused harmony export partition */
/* unused harmony export assoc */
/* unused harmony export assq */
/* unused harmony export mem_assoc */
/* unused harmony export mem_assq */
/* unused harmony export remove_assoc */
/* unused harmony export remove_assq */
/* unused harmony export split */
/* unused harmony export combine */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return sort; });
/* unused harmony export stable_sort */
/* unused harmony export fast_sort */
/* unused harmony export sort_uniq */
/* unused harmony export merge */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caml_obj_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pervasives_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__ = __webpack_require__(1);







function length(l) {
  var _len = 0;
  var _param = l;
  while (true) {
    var param = _param;
    var len = _len;
    if (param) {
      _param = param[1];
      _len = len + 1 | 0;
      continue;
    } else {
      return len;
    }
  };
}

function hd(param) {
  if (param) {
    return param[0];
  } else {
    throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["d" /* failure */], "hd"];
  }
}

function tl(param) {
  if (param) {
    return param[1];
  } else {
    throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["d" /* failure */], "tl"];
  }
}

function nth(l, n) {
  if (n < 0) {
    throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.nth"];
  } else {
    var _l = l;
    var _n = n;
    while (true) {
      var n$1 = _n;
      var l$1 = _l;
      if (l$1) {
        if (n$1) {
          _n = n$1 - 1 | 0;
          _l = l$1[1];
          continue;
        } else {
          return l$1[0];
        }
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["d" /* failure */], "nth"];
      }
    };
  }
}

function rev_append(_l1, _l2) {
  while (true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      _l2 = /* :: */[l1[0], l2];
      _l1 = l1[1];
      continue;
    } else {
      return l2;
    }
  };
}

function rev(l) {
  return rev_append(l, /* [] */0);
}

function flatten(param) {
  if (param) {
    return __WEBPACK_IMPORTED_MODULE_2__pervasives_js__["a" /* $at */](param[0], flatten(param[1]));
  } else {
    return (/* [] */0
    );
  }
}

function map(f, param) {
  if (param) {
    var r = __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, param[0]);
    return (/* :: */[r, map(f, param[1])]
    );
  } else {
    return (/* [] */0
    );
  }
}

function mapi(i, f, param) {
  if (param) {
    var r = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, i, param[0]);
    return (/* :: */[r, mapi(i + 1 | 0, f, param[1])]
    );
  } else {
    return (/* [] */0
    );
  }
}

function mapi$1(f, l) {
  return mapi(0, f, l);
}

function rev_map(f, l) {
  var _accu = /* [] */0;
  var _param = l;
  while (true) {
    var param = _param;
    var accu = _accu;
    if (param) {
      _param = param[1];
      _accu = /* :: */[__WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, param[0]), accu];
      continue;
    } else {
      return accu;
    }
  };
}

function iter(f, _param) {
  while (true) {
    var param = _param;
    if (param) {
      __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, param[0]);
      _param = param[1];
      continue;
    } else {
      return (/* () */0
      );
    }
  };
}

function iteri(f, l) {
  var _i = 0;
  var f$1 = f;
  var _param = l;
  while (true) {
    var param = _param;
    var i = _i;
    if (param) {
      __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f$1, i, param[0]);
      _param = param[1];
      _i = i + 1 | 0;
      continue;
    } else {
      return (/* () */0
      );
    }
  };
}

function fold_left(f, _accu, _l) {
  while (true) {
    var l = _l;
    var accu = _accu;
    if (l) {
      _l = l[1];
      _accu = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, accu, l[0]);
      continue;
    } else {
      return accu;
    }
  };
}

function fold_right(f, l, accu) {
  if (l) {
    return __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, l[0], fold_right(f, l[1], accu));
  } else {
    return accu;
  }
}

function map2(f, l1, l2) {
  if (l1) {
    if (l2) {
      var r = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, l1[0], l2[0]);
      return (/* :: */[r, map2(f, l1[1], l2[1])]
      );
    } else {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.map2"];
    }
  } else if (l2) {
    throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.map2"];
  } else {
    return (/* [] */0
    );
  }
}

function rev_map2(f, l1, l2) {
  var _accu = /* [] */0;
  var _l1 = l1;
  var _l2 = l2;
  while (true) {
    var l2$1 = _l2;
    var l1$1 = _l1;
    var accu = _accu;
    if (l1$1) {
      if (l2$1) {
        _l2 = l2$1[1];
        _l1 = l1$1[1];
        _accu = /* :: */[__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, l1$1[0], l2$1[0]), accu];
        continue;
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.rev_map2"];
      }
    } else if (l2$1) {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.rev_map2"];
    } else {
      return accu;
    }
  };
}

function iter2(f, _l1, _l2) {
  while (true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      if (l2) {
        __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, l1[0], l2[0]);
        _l2 = l2[1];
        _l1 = l1[1];
        continue;
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.iter2"];
      }
    } else if (l2) {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.iter2"];
    } else {
      return (/* () */0
      );
    }
  };
}

function fold_left2(f, _accu, _l1, _l2) {
  while (true) {
    var l2 = _l2;
    var l1 = _l1;
    var accu = _accu;
    if (l1) {
      if (l2) {
        _l2 = l2[1];
        _l1 = l1[1];
        _accu = __WEBPACK_IMPORTED_MODULE_0__curry_js__["c" /* _3 */](f, accu, l1[0], l2[0]);
        continue;
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.fold_left2"];
      }
    } else if (l2) {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.fold_left2"];
    } else {
      return accu;
    }
  };
}

function fold_right2(f, l1, l2, accu) {
  if (l1) {
    if (l2) {
      return __WEBPACK_IMPORTED_MODULE_0__curry_js__["c" /* _3 */](f, l1[0], l2[0], fold_right2(f, l1[1], l2[1], accu));
    } else {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.fold_right2"];
    }
  } else if (l2) {
    throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.fold_right2"];
  } else {
    return accu;
  }
}

function for_all(p, _param) {
  while (true) {
    var param = _param;
    if (param) {
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](p, param[0])) {
        _param = param[1];
        continue;
      } else {
        return (/* false */0
        );
      }
    } else {
      return (/* true */1
      );
    }
  };
}

function exists(p, _param) {
  while (true) {
    var param = _param;
    if (param) {
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](p, param[0])) {
        return (/* true */1
        );
      } else {
        _param = param[1];
        continue;
      }
    } else {
      return (/* false */0
      );
    }
  };
}

function for_all2(p, _l1, _l2) {
  while (true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      if (l2) {
        if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](p, l1[0], l2[0])) {
          _l2 = l2[1];
          _l1 = l1[1];
          continue;
        } else {
          return (/* false */0
          );
        }
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.for_all2"];
      }
    } else if (l2) {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.for_all2"];
    } else {
      return (/* true */1
      );
    }
  };
}

function exists2(p, _l1, _l2) {
  while (true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      if (l2) {
        if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](p, l1[0], l2[0])) {
          return (/* true */1
          );
        } else {
          _l2 = l2[1];
          _l1 = l1[1];
          continue;
        }
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.exists2"];
      }
    } else if (l2) {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.exists2"];
    } else {
      return (/* false */0
      );
    }
  };
}

function mem(x, _param) {
  while (true) {
    var param = _param;
    if (param) {
      if (__WEBPACK_IMPORTED_MODULE_1__caml_obj_js__["a" /* caml_compare */](param[0], x)) {
        _param = param[1];
        continue;
      } else {
        return (/* true */1
        );
      }
    } else {
      return (/* false */0
      );
    }
  };
}

function memq(x, _param) {
  while (true) {
    var param = _param;
    if (param) {
      if (param[0] === x) {
        return (/* true */1
        );
      } else {
        _param = param[1];
        continue;
      }
    } else {
      return (/* false */0
      );
    }
  };
}

function assoc(x, _param) {
  while (true) {
    var param = _param;
    if (param) {
      var match = param[0];
      if (__WEBPACK_IMPORTED_MODULE_1__caml_obj_js__["a" /* caml_compare */](match[0], x)) {
        _param = param[1];
        continue;
      } else {
        return match[1];
      }
    } else {
      throw __WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["g" /* not_found */];
    }
  };
}

function assq(x, _param) {
  while (true) {
    var param = _param;
    if (param) {
      var match = param[0];
      if (match[0] === x) {
        return match[1];
      } else {
        _param = param[1];
        continue;
      }
    } else {
      throw __WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["g" /* not_found */];
    }
  };
}

function mem_assoc(x, _param) {
  while (true) {
    var param = _param;
    if (param) {
      if (__WEBPACK_IMPORTED_MODULE_1__caml_obj_js__["a" /* caml_compare */](param[0][0], x)) {
        _param = param[1];
        continue;
      } else {
        return (/* true */1
        );
      }
    } else {
      return (/* false */0
      );
    }
  };
}

function mem_assq(x, _param) {
  while (true) {
    var param = _param;
    if (param) {
      if (param[0][0] === x) {
        return (/* true */1
        );
      } else {
        _param = param[1];
        continue;
      }
    } else {
      return (/* false */0
      );
    }
  };
}

function remove_assoc(x, param) {
  if (param) {
    var l = param[1];
    var pair = param[0];
    if (__WEBPACK_IMPORTED_MODULE_1__caml_obj_js__["a" /* caml_compare */](pair[0], x)) {
      return (/* :: */[pair, remove_assoc(x, l)]
      );
    } else {
      return l;
    }
  } else {
    return (/* [] */0
    );
  }
}

function remove_assq(x, param) {
  if (param) {
    var l = param[1];
    var pair = param[0];
    if (pair[0] === x) {
      return l;
    } else {
      return (/* :: */[pair, remove_assq(x, l)]
      );
    }
  } else {
    return (/* [] */0
    );
  }
}

function find(p, _param) {
  while (true) {
    var param = _param;
    if (param) {
      var x = param[0];
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](p, x)) {
        return x;
      } else {
        _param = param[1];
        continue;
      }
    } else {
      throw __WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["g" /* not_found */];
    }
  };
}

function find_all(p) {
  return function (param) {
    var _accu = /* [] */0;
    var _param = param;
    while (true) {
      var param$1 = _param;
      var accu = _accu;
      if (param$1) {
        var l = param$1[1];
        var x = param$1[0];
        if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](p, x)) {
          _param = l;
          _accu = /* :: */[x, accu];
          continue;
        } else {
          _param = l;
          continue;
        }
      } else {
        return rev_append(accu, /* [] */0);
      }
    };
  };
}

function partition(p, l) {
  var _yes = /* [] */0;
  var _no = /* [] */0;
  var _param = l;
  while (true) {
    var param = _param;
    var no = _no;
    var yes = _yes;
    if (param) {
      var l$1 = param[1];
      var x = param[0];
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](p, x)) {
        _param = l$1;
        _yes = /* :: */[x, yes];
        continue;
      } else {
        _param = l$1;
        _no = /* :: */[x, no];
        continue;
      }
    } else {
      return (/* tuple */[rev_append(yes, /* [] */0), rev_append(no, /* [] */0)]
      );
    }
  };
}

function split(param) {
  if (param) {
    var match = param[0];
    var match$1 = split(param[1]);
    return (/* tuple */[
      /* :: */[match[0], match$1[0]],
      /* :: */[match[1], match$1[1]]]
    );
  } else {
    return (/* tuple */[
      /* [] */0,
      /* [] */0]
    );
  }
}

function combine(l1, l2) {
  if (l1) {
    if (l2) {
      return (/* :: */[
        /* tuple */[l1[0], l2[0]], combine(l1[1], l2[1])]
      );
    } else {
      throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.combine"];
    }
  } else if (l2) {
    throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["e" /* invalid_argument */], "List.combine"];
  } else {
    return (/* [] */0
    );
  }
}

function merge(cmp, l1, l2) {
  if (l1) {
    if (l2) {
      var h2 = l2[0];
      var h1 = l1[0];
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, h1, h2) <= 0) {
        return (/* :: */[h1, merge(cmp, l1[1], l2)]
        );
      } else {
        return (/* :: */[h2, merge(cmp, l1, l2[1])]
        );
      }
    } else {
      return l1;
    }
  } else {
    return l2;
  }
}

function chop(_k, _l) {
  while (true) {
    var l = _l;
    var k = _k;
    if (k) {
      if (l) {
        _l = l[1];
        _k = k - 1 | 0;
        continue;
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["a" /* assert_failure */], ["list.ml", 223, 11]];
      }
    } else {
      return l;
    }
  };
}

function stable_sort(cmp, l) {
  var sort = function (n, l) {
    var exit = 0;
    if (n !== 2) {
      if (n !== 3) {
        exit = 1;
      } else if (l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x2) <= 0) {
              if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3) <= 0) {
                return (/* :: */[x1,
                  /* :: */[x2,
                  /* :: */[x3,
                  /* [] */0]]]
                );
              } else if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3) <= 0) {
                return (/* :: */[x1,
                  /* :: */[x3,
                  /* :: */[x2,
                  /* [] */0]]]
                );
              } else {
                return (/* :: */[x3,
                  /* :: */[x1,
                  /* :: */[x2,
                  /* [] */0]]]
                );
              }
            } else if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3) <= 0) {
              return (/* :: */[x2,
                /* :: */[x1,
                /* :: */[x3,
                /* [] */0]]]
              );
            } else if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3) <= 0) {
              return (/* :: */[x2,
                /* :: */[x3,
                /* :: */[x1,
                /* [] */0]]]
              );
            } else {
              return (/* :: */[x3,
                /* :: */[x2,
                /* :: */[x1,
                /* [] */0]]]
              );
            }
          } else {
            exit = 1;
          }
        } else {
          exit = 1;
        }
      } else {
        exit = 1;
      }
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1$1, x2$1) <= 0) {
          return (/* :: */[x1$1,
            /* :: */[x2$1,
            /* [] */0]]
          );
        } else {
          return (/* :: */[x2$1,
            /* :: */[x1$1,
            /* [] */0]]
          );
        }
      } else {
        exit = 1;
      }
    } else {
      exit = 1;
    }
    if (exit === 1) {
      var n1 = n >> 1;
      var n2 = n - n1 | 0;
      var l2 = chop(n1, l);
      var s1 = rev_sort(n1, l);
      var s2 = rev_sort(n2, l2);
      var _l1 = s1;
      var _l2 = s2;
      var _accu = /* [] */0;
      while (true) {
        var accu = _accu;
        var l2$1 = _l2;
        var l1 = _l1;
        if (l1) {
          if (l2$1) {
            var h2 = l2$1[0];
            var h1 = l1[0];
            if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, h1, h2) > 0) {
              _accu = /* :: */[h1, accu];
              _l1 = l1[1];
              continue;
            } else {
              _accu = /* :: */[h2, accu];
              _l2 = l2$1[1];
              continue;
            }
          } else {
            return rev_append(l1, accu);
          }
        } else {
          return rev_append(l2$1, accu);
        }
      };
    }
  };
  var rev_sort = function (n, l) {
    var exit = 0;
    if (n !== 2) {
      if (n !== 3) {
        exit = 1;
      } else if (l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x2) > 0) {
              if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3) > 0) {
                return (/* :: */[x1,
                  /* :: */[x2,
                  /* :: */[x3,
                  /* [] */0]]]
                );
              } else if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3) > 0) {
                return (/* :: */[x1,
                  /* :: */[x3,
                  /* :: */[x2,
                  /* [] */0]]]
                );
              } else {
                return (/* :: */[x3,
                  /* :: */[x1,
                  /* :: */[x2,
                  /* [] */0]]]
                );
              }
            } else if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3) > 0) {
              return (/* :: */[x2,
                /* :: */[x1,
                /* :: */[x3,
                /* [] */0]]]
              );
            } else if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3) > 0) {
              return (/* :: */[x2,
                /* :: */[x3,
                /* :: */[x1,
                /* [] */0]]]
              );
            } else {
              return (/* :: */[x3,
                /* :: */[x2,
                /* :: */[x1,
                /* [] */0]]]
              );
            }
          } else {
            exit = 1;
          }
        } else {
          exit = 1;
        }
      } else {
        exit = 1;
      }
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1$1, x2$1) > 0) {
          return (/* :: */[x1$1,
            /* :: */[x2$1,
            /* [] */0]]
          );
        } else {
          return (/* :: */[x2$1,
            /* :: */[x1$1,
            /* [] */0]]
          );
        }
      } else {
        exit = 1;
      }
    } else {
      exit = 1;
    }
    if (exit === 1) {
      var n1 = n >> 1;
      var n2 = n - n1 | 0;
      var l2 = chop(n1, l);
      var s1 = sort(n1, l);
      var s2 = sort(n2, l2);
      var _l1 = s1;
      var _l2 = s2;
      var _accu = /* [] */0;
      while (true) {
        var accu = _accu;
        var l2$1 = _l2;
        var l1 = _l1;
        if (l1) {
          if (l2$1) {
            var h2 = l2$1[0];
            var h1 = l1[0];
            if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, h1, h2) <= 0) {
              _accu = /* :: */[h1, accu];
              _l1 = l1[1];
              continue;
            } else {
              _accu = /* :: */[h2, accu];
              _l2 = l2$1[1];
              continue;
            }
          } else {
            return rev_append(l1, accu);
          }
        } else {
          return rev_append(l2$1, accu);
        }
      };
    }
  };
  var len = length(l);
  if (len < 2) {
    return l;
  } else {
    return sort(len, l);
  }
}

function sort_uniq(cmp, l) {
  var sort = function (n, l) {
    var exit = 0;
    if (n !== 2) {
      if (n !== 3) {
        exit = 1;
      } else if (l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            var c = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x2);
            if (c) {
              if (c < 0) {
                var c$1 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3);
                if (c$1) {
                  if (c$1 < 0) {
                    return (/* :: */[x1,
                      /* :: */[x2,
                      /* :: */[x3,
                      /* [] */0]]]
                    );
                  } else {
                    var c$2 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3);
                    if (c$2) {
                      if (c$2 < 0) {
                        return (/* :: */[x1,
                          /* :: */[x3,
                          /* :: */[x2,
                          /* [] */0]]]
                        );
                      } else {
                        return (/* :: */[x3,
                          /* :: */[x1,
                          /* :: */[x2,
                          /* [] */0]]]
                        );
                      }
                    } else {
                      return (/* :: */[x1,
                        /* :: */[x2,
                        /* [] */0]]
                      );
                    }
                  }
                } else {
                  return (/* :: */[x1,
                    /* :: */[x2,
                    /* [] */0]]
                  );
                }
              } else {
                var c$3 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3);
                if (c$3) {
                  if (c$3 < 0) {
                    return (/* :: */[x2,
                      /* :: */[x1,
                      /* :: */[x3,
                      /* [] */0]]]
                    );
                  } else {
                    var c$4 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3);
                    if (c$4) {
                      if (c$4 < 0) {
                        return (/* :: */[x2,
                          /* :: */[x3,
                          /* :: */[x1,
                          /* [] */0]]]
                        );
                      } else {
                        return (/* :: */[x3,
                          /* :: */[x2,
                          /* :: */[x1,
                          /* [] */0]]]
                        );
                      }
                    } else {
                      return (/* :: */[x2,
                        /* :: */[x1,
                        /* [] */0]]
                      );
                    }
                  }
                } else {
                  return (/* :: */[x2,
                    /* :: */[x1,
                    /* [] */0]]
                  );
                }
              }
            } else {
              var c$5 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3);
              if (c$5) {
                if (c$5 < 0) {
                  return (/* :: */[x2,
                    /* :: */[x3,
                    /* [] */0]]
                  );
                } else {
                  return (/* :: */[x3,
                    /* :: */[x2,
                    /* [] */0]]
                  );
                }
              } else {
                return (/* :: */[x2,
                  /* [] */0]
                );
              }
            }
          } else {
            exit = 1;
          }
        } else {
          exit = 1;
        }
      } else {
        exit = 1;
      }
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        var c$6 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1$1, x2$1);
        if (c$6) {
          if (c$6 < 0) {
            return (/* :: */[x1$1,
              /* :: */[x2$1,
              /* [] */0]]
            );
          } else {
            return (/* :: */[x2$1,
              /* :: */[x1$1,
              /* [] */0]]
            );
          }
        } else {
          return (/* :: */[x1$1,
            /* [] */0]
          );
        }
      } else {
        exit = 1;
      }
    } else {
      exit = 1;
    }
    if (exit === 1) {
      var n1 = n >> 1;
      var n2 = n - n1 | 0;
      var l2 = chop(n1, l);
      var s1 = rev_sort(n1, l);
      var s2 = rev_sort(n2, l2);
      var _l1 = s1;
      var _l2 = s2;
      var _accu = /* [] */0;
      while (true) {
        var accu = _accu;
        var l2$1 = _l2;
        var l1 = _l1;
        if (l1) {
          if (l2$1) {
            var t2 = l2$1[1];
            var h2 = l2$1[0];
            var t1 = l1[1];
            var h1 = l1[0];
            var c$7 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, h1, h2);
            if (c$7) {
              if (c$7 > 0) {
                _accu = /* :: */[h1, accu];
                _l1 = t1;
                continue;
              } else {
                _accu = /* :: */[h2, accu];
                _l2 = t2;
                continue;
              }
            } else {
              _accu = /* :: */[h1, accu];
              _l2 = t2;
              _l1 = t1;
              continue;
            }
          } else {
            return rev_append(l1, accu);
          }
        } else {
          return rev_append(l2$1, accu);
        }
      };
    }
  };
  var rev_sort = function (n, l) {
    var exit = 0;
    if (n !== 2) {
      if (n !== 3) {
        exit = 1;
      } else if (l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            var c = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x2);
            if (c) {
              if (c > 0) {
                var c$1 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3);
                if (c$1) {
                  if (c$1 > 0) {
                    return (/* :: */[x1,
                      /* :: */[x2,
                      /* :: */[x3,
                      /* [] */0]]]
                    );
                  } else {
                    var c$2 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3);
                    if (c$2) {
                      if (c$2 > 0) {
                        return (/* :: */[x1,
                          /* :: */[x3,
                          /* :: */[x2,
                          /* [] */0]]]
                        );
                      } else {
                        return (/* :: */[x3,
                          /* :: */[x1,
                          /* :: */[x2,
                          /* [] */0]]]
                        );
                      }
                    } else {
                      return (/* :: */[x1,
                        /* :: */[x2,
                        /* [] */0]]
                      );
                    }
                  }
                } else {
                  return (/* :: */[x1,
                    /* :: */[x2,
                    /* [] */0]]
                  );
                }
              } else {
                var c$3 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1, x3);
                if (c$3) {
                  if (c$3 > 0) {
                    return (/* :: */[x2,
                      /* :: */[x1,
                      /* :: */[x3,
                      /* [] */0]]]
                    );
                  } else {
                    var c$4 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3);
                    if (c$4) {
                      if (c$4 > 0) {
                        return (/* :: */[x2,
                          /* :: */[x3,
                          /* :: */[x1,
                          /* [] */0]]]
                        );
                      } else {
                        return (/* :: */[x3,
                          /* :: */[x2,
                          /* :: */[x1,
                          /* [] */0]]]
                        );
                      }
                    } else {
                      return (/* :: */[x2,
                        /* :: */[x1,
                        /* [] */0]]
                      );
                    }
                  }
                } else {
                  return (/* :: */[x2,
                    /* :: */[x1,
                    /* [] */0]]
                  );
                }
              }
            } else {
              var c$5 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x2, x3);
              if (c$5) {
                if (c$5 > 0) {
                  return (/* :: */[x2,
                    /* :: */[x3,
                    /* [] */0]]
                  );
                } else {
                  return (/* :: */[x3,
                    /* :: */[x2,
                    /* [] */0]]
                  );
                }
              } else {
                return (/* :: */[x2,
                  /* [] */0]
                );
              }
            }
          } else {
            exit = 1;
          }
        } else {
          exit = 1;
        }
      } else {
        exit = 1;
      }
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        var c$6 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, x1$1, x2$1);
        if (c$6) {
          if (c$6 > 0) {
            return (/* :: */[x1$1,
              /* :: */[x2$1,
              /* [] */0]]
            );
          } else {
            return (/* :: */[x2$1,
              /* :: */[x1$1,
              /* [] */0]]
            );
          }
        } else {
          return (/* :: */[x1$1,
            /* [] */0]
          );
        }
      } else {
        exit = 1;
      }
    } else {
      exit = 1;
    }
    if (exit === 1) {
      var n1 = n >> 1;
      var n2 = n - n1 | 0;
      var l2 = chop(n1, l);
      var s1 = sort(n1, l);
      var s2 = sort(n2, l2);
      var _l1 = s1;
      var _l2 = s2;
      var _accu = /* [] */0;
      while (true) {
        var accu = _accu;
        var l2$1 = _l2;
        var l1 = _l1;
        if (l1) {
          if (l2$1) {
            var t2 = l2$1[1];
            var h2 = l2$1[0];
            var t1 = l1[1];
            var h1 = l1[0];
            var c$7 = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, h1, h2);
            if (c$7) {
              if (c$7 < 0) {
                _accu = /* :: */[h1, accu];
                _l1 = t1;
                continue;
              } else {
                _accu = /* :: */[h2, accu];
                _l2 = t2;
                continue;
              }
            } else {
              _accu = /* :: */[h1, accu];
              _l2 = t2;
              _l1 = t1;
              continue;
            }
          } else {
            return rev_append(l1, accu);
          }
        } else {
          return rev_append(l2$1, accu);
        }
      };
    }
  };
  var len = length(l);
  if (len < 2) {
    return l;
  } else {
    return sort(len, l);
  }
}

var append = __WEBPACK_IMPORTED_MODULE_2__pervasives_js__["a" /* $at */];

var concat = flatten;

var filter = find_all;

var sort = stable_sort;

var fast_sort = stable_sort;


/* No side effect */

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __; });


function __(tag, block) {
  block.tag = tag;
  return block;
}


/* No side effect */

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var startOfISOWeek = __webpack_require__(6);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the ISO week-numbering year
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * var result = getISOYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOYear(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();

  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);

  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

module.exports = getISOYear;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var startOfWeek = __webpack_require__(18);

/**
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of an ISO week
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * var result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(dirtyDate) {
  return startOfWeek(dirtyDate, { weekStartsOn: 1 });
}

module.exports = startOfISOWeek;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(dirtyDate) {
  var date = parse(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfDay;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export caml_obj_dup */
/* unused harmony export caml_obj_truncate */
/* unused harmony export caml_lazy_make_forward */
/* unused harmony export caml_update_dummy */
/* unused harmony export caml_int_compare */
/* unused harmony export caml_int32_compare */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return caml_nativeint_compare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return caml_compare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return caml_equal; });
/* unused harmony export caml_notequal */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return caml_greaterequal; });
/* unused harmony export caml_greaterthan */
/* unused harmony export caml_lessthan */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return caml_lessequal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__ = __webpack_require__(1);





function caml_obj_dup(x) {
  var len = x.length | 0;
  var v = new Array(len);
  for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
    v[i] = x[i];
  }
  v.tag = x.tag | 0;
  return v;
}

function caml_obj_truncate(x, new_size) {
  var len = x.length | 0;
  if (new_size <= 0 || new_size > len) {
    throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["e" /* invalid_argument */], "Obj.truncate"];
  } else if (len !== new_size) {
    for (var i = new_size, i_finish = len - 1 | 0; i <= i_finish; ++i) {
      x[i] = 0;
    }
    x.length = new_size;
    return (/* () */0
    );
  } else {
    return 0;
  }
}

function caml_lazy_make_forward(x) {
  return __WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](250, [x]);
}

function caml_update_dummy(x, y) {
  var len = y.length | 0;
  for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
    x[i] = y[i];
  }
  var y_tag = y.tag | 0;
  if (y_tag !== 0) {
    x.tag = y_tag;
    return (/* () */0
    );
  } else {
    return 0;
  }
}

function caml_int_compare(x, y) {
  if (x < y) {
    return -1;
  } else if (x === y) {
    return 0;
  } else {
    return 1;
  }
}

function caml_compare(_a, _b) {
  while (true) {
    var b = _b;
    var a = _a;
    if (a === b) {
      return 0;
    } else {
      var a_type = typeof a;
      var b_type = typeof b;
      if (a_type === "string") {
        var x = a;
        var y = b;
        if (x < y) {
          return -1;
        } else if (x === y) {
          return 0;
        } else {
          return 1;
        }
      } else {
        var is_a_number = +(a_type === "number");
        var is_b_number = +(b_type === "number");
        if (is_a_number !== 0) {
          if (is_b_number !== 0) {
            return caml_int_compare(a, b);
          } else {
            return -1;
          }
        } else if (is_b_number !== 0) {
          return 1;
        } else if (a_type === "boolean" || a_type === "undefined" || a === null) {
          var x$1 = a;
          var y$1 = b;
          if (x$1 === y$1) {
            return 0;
          } else if (x$1 < y$1) {
            return -1;
          } else {
            return 1;
          }
        } else if (a_type === "function" || b_type === "function") {
          throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["e" /* invalid_argument */], "compare: functional value"];
        } else {
          var tag_a = a.tag | 0;
          var tag_b = b.tag | 0;
          if (tag_a === 250) {
            _a = a[0];
            continue;
          } else if (tag_b === 250) {
            _b = b[0];
            continue;
          } else if (tag_a === 248) {
            return caml_int_compare(a[1], b[1]);
          } else if (tag_a === 251) {
            throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["e" /* invalid_argument */], "equal: abstract value"];
          } else if (tag_a !== tag_b) {
            if (tag_a < tag_b) {
              return -1;
            } else {
              return 1;
            }
          } else {
            var len_a = a.length | 0;
            var len_b = b.length | 0;
            if (len_a === len_b) {
              var a$1 = a;
              var b$1 = b;
              var _i = 0;
              var same_length = len_a;
              while (true) {
                var i = _i;
                if (i === same_length) {
                  return 0;
                } else {
                  var res = caml_compare(a$1[i], b$1[i]);
                  if (res !== 0) {
                    return res;
                  } else {
                    _i = i + 1 | 0;
                    continue;
                  }
                }
              };
            } else if (len_a < len_b) {
              var a$2 = a;
              var b$2 = b;
              var _i$1 = 0;
              var short_length = len_a;
              while (true) {
                var i$1 = _i$1;
                if (i$1 === short_length) {
                  return -1;
                } else {
                  var res$1 = caml_compare(a$2[i$1], b$2[i$1]);
                  if (res$1 !== 0) {
                    return res$1;
                  } else {
                    _i$1 = i$1 + 1 | 0;
                    continue;
                  }
                }
              };
            } else {
              var a$3 = a;
              var b$3 = b;
              var _i$2 = 0;
              var short_length$1 = len_b;
              while (true) {
                var i$2 = _i$2;
                if (i$2 === short_length$1) {
                  return 1;
                } else {
                  var res$2 = caml_compare(a$3[i$2], b$3[i$2]);
                  if (res$2 !== 0) {
                    return res$2;
                  } else {
                    _i$2 = i$2 + 1 | 0;
                    continue;
                  }
                }
              };
            }
          }
        }
      }
    }
  };
}

function caml_equal(_a, _b) {
  while (true) {
    var b = _b;
    var a = _a;
    if (a === b) {
      return (/* true */1
      );
    } else {
      var a_type = typeof a;
      if (a_type === "string" || a_type === "number" || a_type === "boolean" || a_type === "undefined" || a === null) {
        return (/* false */0
        );
      } else {
        var b_type = typeof b;
        if (a_type === "function" || b_type === "function") {
          throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["e" /* invalid_argument */], "equal: functional value"];
        } else if (b_type === "number" || b_type === "undefined" || b === null) {
          return (/* false */0
          );
        } else {
          var tag_a = a.tag | 0;
          var tag_b = b.tag | 0;
          if (tag_a === 250) {
            _a = a[0];
            continue;
          } else if (tag_b === 250) {
            _b = b[0];
            continue;
          } else if (tag_a === 248) {
            return +(a[1] === b[1]);
          } else if (tag_a === 251) {
            throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["e" /* invalid_argument */], "equal: abstract value"];
          } else if (tag_a !== tag_b) {
            return (/* false */0
            );
          } else {
            var len_a = a.length | 0;
            var len_b = b.length | 0;
            if (len_a === len_b) {
              var a$1 = a;
              var b$1 = b;
              var _i = 0;
              var same_length = len_a;
              while (true) {
                var i = _i;
                if (i === same_length) {
                  return (/* true */1
                  );
                } else if (caml_equal(a$1[i], b$1[i])) {
                  _i = i + 1 | 0;
                  continue;
                } else {
                  return (/* false */0
                  );
                }
              };
            } else {
              return (/* false */0
              );
            }
          }
        }
      }
    }
  };
}

function caml_notequal(a, b) {
  return 1 - caml_equal(a, b);
}

function caml_greaterequal(a, b) {
  return +(caml_compare(a, b) >= 0);
}

function caml_greaterthan(a, b) {
  return +(caml_compare(a, b) > 0);
}

function caml_lessequal(a, b) {
  return +(caml_compare(a, b) <= 0);
}

function caml_lessthan(a, b) {
  return +(caml_compare(a, b) < 0);
}

var caml_int32_compare = caml_int_compare;

var caml_nativeint_compare = caml_int_compare;


/* No side effect */

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be added
 * @returns {Date} the new date with the days added
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * var result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */
function addDays(dirtyDate, dirtyAmount) {
  var date = parse(dirtyDate);
  var amount = Number(dirtyAmount);
  date.setDate(date.getDate() + amount);
  return date;
}

module.exports = addDays;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be added
 * @returns {Date} the new date with the milliseconds added
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds(dirtyDate, dirtyAmount) {
  var timestamp = parse(dirtyDate).getTime();
  var amount = Number(dirtyAmount);
  return new Date(timestamp + amount);
}

module.exports = addMilliseconds;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var getISOYear = __webpack_require__(5);
var startOfISOWeek = __webpack_require__(6);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of an ISO year
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * var result = startOfISOYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOYear(dirtyDate) {
  var year = getISOYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  return date;
}

module.exports = startOfISOYear;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @param {Date|String|Number} dateLeft - the first date to compare
 * @param {Date|String|Number} dateRight - the second date to compare
 * @returns {Number} the result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * var result = compareAsc(
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * )
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * var result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */
function compareAsc(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var timeLeft = dateLeft.getTime();
  var dateRight = parse(dirtyDateRight);
  var timeRight = dateRight.getTime();

  if (timeLeft < timeRight) {
    return -1;
  } else if (timeLeft > timeRight) {
    return 1;
  } else {
    return 0;
  }
}

module.exports = compareAsc;

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export invalid_arg */
/* unused harmony export failwith */
/* unused harmony export Exit */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return min; });
/* unused harmony export max */
/* unused harmony export abs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return max_int; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return min_int; });
/* unused harmony export lnot */
/* unused harmony export infinity */
/* unused harmony export neg_infinity */
/* unused harmony export nan */
/* unused harmony export max_float */
/* unused harmony export min_float */
/* unused harmony export epsilon_float */
/* unused harmony export $caret */
/* unused harmony export char_of_int */
/* unused harmony export string_of_bool */
/* unused harmony export bool_of_string */
/* unused harmony export string_of_int */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return string_of_float; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return $at; });
/* unused harmony export stdin */
/* unused harmony export stdout */
/* unused harmony export stderr */
/* unused harmony export print_char */
/* unused harmony export print_string */
/* unused harmony export print_bytes */
/* unused harmony export print_int */
/* unused harmony export print_float */
/* unused harmony export print_endline */
/* unused harmony export print_newline */
/* unused harmony export prerr_char */
/* unused harmony export prerr_string */
/* unused harmony export prerr_bytes */
/* unused harmony export prerr_int */
/* unused harmony export prerr_float */
/* unused harmony export prerr_endline */
/* unused harmony export prerr_newline */
/* unused harmony export read_line */
/* unused harmony export read_int */
/* unused harmony export read_float */
/* unused harmony export open_out */
/* unused harmony export open_out_bin */
/* unused harmony export open_out_gen */
/* unused harmony export flush */
/* unused harmony export flush_all */
/* unused harmony export output_char */
/* unused harmony export output_string */
/* unused harmony export output_bytes */
/* unused harmony export output */
/* unused harmony export output_substring */
/* unused harmony export output_byte */
/* unused harmony export output_binary_int */
/* unused harmony export output_value */
/* unused harmony export seek_out */
/* unused harmony export pos_out */
/* unused harmony export out_channel_length */
/* unused harmony export close_out */
/* unused harmony export close_out_noerr */
/* unused harmony export set_binary_mode_out */
/* unused harmony export open_in */
/* unused harmony export open_in_bin */
/* unused harmony export open_in_gen */
/* unused harmony export input_char */
/* unused harmony export input_line */
/* unused harmony export input */
/* unused harmony export really_input */
/* unused harmony export really_input_string */
/* unused harmony export input_byte */
/* unused harmony export input_binary_int */
/* unused harmony export input_value */
/* unused harmony export seek_in */
/* unused harmony export pos_in */
/* unused harmony export in_channel_length */
/* unused harmony export close_in */
/* unused harmony export close_in_noerr */
/* unused harmony export set_binary_mode_in */
/* unused harmony export LargeFile */
/* unused harmony export string_of_format */
/* unused harmony export $caret$caret */
/* unused harmony export exit */
/* unused harmony export at_exit */
/* unused harmony export valid_float_lexem */
/* unused harmony export unsafe_really_input */
/* unused harmony export do_at_exit */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caml_io_js__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__caml_obj_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__caml_sys_js__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__caml_format_js__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__caml_string_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__caml_exceptions_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__camlinternalFormatBasics_js__ = __webpack_require__(83);













function failwith(s) {
  throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["d" /* failure */], s];
}

function invalid_arg(s) {
  throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["e" /* invalid_argument */], s];
}

var Exit = __WEBPACK_IMPORTED_MODULE_6__caml_exceptions_js__["a" /* create */]("Pervasives.Exit");

function min(x, y) {
  if (__WEBPACK_IMPORTED_MODULE_2__caml_obj_js__["d" /* caml_lessequal */](x, y)) {
    return x;
  } else {
    return y;
  }
}

function max(x, y) {
  if (__WEBPACK_IMPORTED_MODULE_2__caml_obj_js__["c" /* caml_greaterequal */](x, y)) {
    return x;
  } else {
    return y;
  }
}

function abs(x) {
  if (x >= 0) {
    return x;
  } else {
    return -x | 0;
  }
}

function lnot(x) {
  return x ^ -1;
}

var min_int = -2147483648;

function $caret(a, b) {
  return a + b;
}

function char_of_int(n) {
  if (n < 0 || n > 255) {
    throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["e" /* invalid_argument */], "char_of_int"];
  } else {
    return n;
  }
}

function string_of_bool(b) {
  if (b) {
    return "true";
  } else {
    return "false";
  }
}

function bool_of_string(param) {
  switch (param) {
    case "false":
      return (/* false */0
      );
    case "true":
      return (/* true */1
      );
    default:
      throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["e" /* invalid_argument */], "bool_of_string"];
  }
}

function string_of_int(param) {
  return "" + param;
}

function valid_float_lexem(s) {
  var l = s.length;
  var _i = 0;
  while (true) {
    var i = _i;
    if (i >= l) {
      return $caret(s, ".");
    } else {
      var match = __WEBPACK_IMPORTED_MODULE_5__caml_string_js__["h" /* get */](s, i);
      if (match >= 48) {
        if (match >= 58) {
          return s;
        } else {
          _i = i + 1 | 0;
          continue;
        }
      } else if (match !== 45) {
        return s;
      } else {
        _i = i + 1 | 0;
        continue;
      }
    }
  };
}

function string_of_float(f) {
  return valid_float_lexem(__WEBPACK_IMPORTED_MODULE_4__caml_format_js__["b" /* caml_format_float */]("%.12g", f));
}

function $at(l1, l2) {
  if (l1) {
    return (/* :: */[l1[0], $at(l1[1], l2)]
    );
  } else {
    return l2;
  }
}

var stdin = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["i" /* stdin */];

var stdout = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["j" /* stdout */];

var stderr = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["h" /* stderr */];

function open_out_gen(_, _$1, _$2) {
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["d" /* caml_ml_open_descriptor_out */](__WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_sys_open not implemented by bucklescript yet\n"));
}

function open_out(name) {
  return open_out_gen( /* :: */[
  /* Open_wronly */1,
  /* :: */[
  /* Open_creat */3,
  /* :: */[
  /* Open_trunc */4,
  /* :: */[
  /* Open_text */7,
  /* [] */0]]]], 438, name);
}

function open_out_bin(name) {
  return open_out_gen( /* :: */[
  /* Open_wronly */1,
  /* :: */[
  /* Open_creat */3,
  /* :: */[
  /* Open_trunc */4,
  /* :: */[
  /* Open_binary */6,
  /* [] */0]]]], 438, name);
}

function flush_all() {
  var _param = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["e" /* caml_ml_out_channels_list */]( /* () */0);
  while (true) {
    var param = _param;
    if (param) {
      try {
        __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](param[0]);
      } catch (exn) {}
      _param = param[1];
      continue;
    } else {
      return (/* () */0
      );
    }
  };
}

function output_bytes(oc, s) {
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["f" /* caml_ml_output */](oc, s, 0, s.length);
}

function output_string(oc, s) {
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["f" /* caml_ml_output */](oc, s, 0, s.length);
}

function output(oc, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["e" /* invalid_argument */], "output"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["f" /* caml_ml_output */](oc, s, ofs, len);
  }
}

function output_substring(oc, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["e" /* invalid_argument */], "output_substring"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["f" /* caml_ml_output */](oc, s, ofs, len);
  }
}

function output_value(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_output_value not implemented by bucklescript yet\n");
}

function close_out(oc) {
  __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](oc);
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_close_channel not implemented by bucklescript yet\n");
}

function close_out_noerr(oc) {
  try {
    __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](oc);
  } catch (exn) {}
  try {
    return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_close_channel not implemented by bucklescript yet\n");
  } catch (exn$1) {
    return (/* () */0
    );
  }
}

function open_in_gen(_, _$1, _$2) {
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["c" /* caml_ml_open_descriptor_in */](__WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_sys_open not implemented by bucklescript yet\n"));
}

function open_in(name) {
  return open_in_gen( /* :: */[
  /* Open_rdonly */0,
  /* :: */[
  /* Open_text */7,
  /* [] */0]], 0, name);
}

function open_in_bin(name) {
  return open_in_gen( /* :: */[
  /* Open_rdonly */0,
  /* :: */[
  /* Open_binary */6,
  /* [] */0]], 0, name);
}

function input(_, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["e" /* invalid_argument */], "input"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_input not implemented by bucklescript yet\n");
  }
}

function unsafe_really_input(_, _$1, _ofs, _len) {
  while (true) {
    var len = _len;
    var ofs = _ofs;
    if (len <= 0) {
      return (/* () */0
      );
    } else {
      var r = __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_input not implemented by bucklescript yet\n");
      if (r) {
        _len = len - r | 0;
        _ofs = ofs + r | 0;
        continue;
      } else {
        throw __WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["c" /* end_of_file */];
      }
    }
  };
}

function really_input(ic, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["e" /* invalid_argument */], "really_input"];
  } else {
    return unsafe_really_input(ic, s, ofs, len);
  }
}

function really_input_string(ic, len) {
  var s = __WEBPACK_IMPORTED_MODULE_5__caml_string_js__["e" /* caml_create_string */](len);
  really_input(ic, s, 0, len);
  return __WEBPACK_IMPORTED_MODULE_5__caml_string_js__["b" /* bytes_to_string */](s);
}

function input_line(chan) {
  var build_result = function (buf, _pos, _param) {
    while (true) {
      var param = _param;
      var pos = _pos;
      if (param) {
        var hd = param[0];
        var len = hd.length;
        __WEBPACK_IMPORTED_MODULE_5__caml_string_js__["c" /* caml_blit_bytes */](hd, 0, buf, pos - len | 0, len);
        _param = param[1];
        _pos = pos - len | 0;
        continue;
      } else {
        return buf;
      }
    };
  };
  var scan = function (_accu, _len) {
    while (true) {
      var len = _len;
      var accu = _accu;
      var n = __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_input_scan_line not implemented by bucklescript yet\n");
      if (n) {
        if (n > 0) {
          var res = __WEBPACK_IMPORTED_MODULE_5__caml_string_js__["e" /* caml_create_string */](n - 1 | 0);
          __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_input not implemented by bucklescript yet\n");
          __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["b" /* caml_ml_input_char */](chan);
          if (accu) {
            var len$1 = (len + n | 0) - 1 | 0;
            return build_result(__WEBPACK_IMPORTED_MODULE_5__caml_string_js__["e" /* caml_create_string */](len$1), len$1, /* :: */[res, accu]);
          } else {
            return res;
          }
        } else {
          var beg = __WEBPACK_IMPORTED_MODULE_5__caml_string_js__["e" /* caml_create_string */](-n | 0);
          __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_input not implemented by bucklescript yet\n");
          _len = len - n | 0;
          _accu = /* :: */[beg, accu];
          continue;
        }
      } else if (accu) {
        return build_result(__WEBPACK_IMPORTED_MODULE_5__caml_string_js__["e" /* caml_create_string */](len), len, accu);
      } else {
        throw __WEBPACK_IMPORTED_MODULE_8__caml_builtin_exceptions_js__["c" /* end_of_file */];
      }
    };
  };
  return __WEBPACK_IMPORTED_MODULE_5__caml_string_js__["b" /* bytes_to_string */](scan( /* [] */0, 0));
}

function close_in_noerr() {
  try {
    return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_close_channel not implemented by bucklescript yet\n");
  } catch (exn) {
    return (/* () */0
    );
  }
}

function print_char(c) {
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["g" /* caml_ml_output_char */](stdout, c);
}

function print_string(s) {
  return output_string(stdout, s);
}

function print_bytes(s) {
  return output_bytes(stdout, s);
}

function print_int(i) {
  return output_string(stdout, "" + i);
}

function print_float(f) {
  return output_string(stdout, valid_float_lexem(__WEBPACK_IMPORTED_MODULE_4__caml_format_js__["b" /* caml_format_float */]("%.12g", f)));
}

function print_endline(param) {
  console.log(param);
  return 0;
}

function print_newline() {
  __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["g" /* caml_ml_output_char */](stdout, /* "\n" */10);
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](stdout);
}

function prerr_char(c) {
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["g" /* caml_ml_output_char */](stderr, c);
}

function prerr_string(s) {
  return output_string(stderr, s);
}

function prerr_bytes(s) {
  return output_bytes(stderr, s);
}

function prerr_int(i) {
  return output_string(stderr, "" + i);
}

function prerr_float(f) {
  return output_string(stderr, valid_float_lexem(__WEBPACK_IMPORTED_MODULE_4__caml_format_js__["b" /* caml_format_float */]("%.12g", f)));
}

function prerr_endline(param) {
  console.error(param);
  return 0;
}

function prerr_newline() {
  __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["g" /* caml_ml_output_char */](stderr, /* "\n" */10);
  return __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](stderr);
}

function read_line() {
  __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](stdout);
  return input_line(stdin);
}

function read_int() {
  return __WEBPACK_IMPORTED_MODULE_4__caml_format_js__["c" /* caml_int_of_string */]((__WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](stdout), input_line(stdin)));
}

function read_float() {
  return __WEBPACK_IMPORTED_MODULE_4__caml_format_js__["a" /* caml_float_of_string */]((__WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */](stdout), input_line(stdin)));
}

function string_of_format(param) {
  return param[1];
}

function $caret$caret(param, param$1) {
  return (/* Format */[__WEBPACK_IMPORTED_MODULE_9__camlinternalFormatBasics_js__["a" /* concat_fmt */](param[0], param$1[0]), $caret(param[1], $caret("%,", param$1[1]))]
  );
}

var exit_function = [flush_all];

function at_exit(f) {
  var g = exit_function[0];
  exit_function[0] = function () {
    __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, /* () */0);
    return __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](g, /* () */0);
  };
  return (/* () */0
  );
}

function do_at_exit() {
  return __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](exit_function[0], /* () */0);
}

function exit(retcode) {
  do_at_exit( /* () */0);
  return __WEBPACK_IMPORTED_MODULE_3__caml_sys_js__["a" /* caml_sys_exit */](retcode);
}

var max_int = 2147483647;

var infinity = Infinity;

var neg_infinity = -Infinity;

var nan = NaN;

var max_float = Number.MAX_VALUE;

var min_float = Number.MIN_VALUE;

var epsilon_float = 2.220446049250313e-16;

var flush = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["a" /* caml_ml_flush */];

var output_char = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["g" /* caml_ml_output_char */];

var output_byte = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["g" /* caml_ml_output_char */];

function output_binary_int(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_output_int not implemented by bucklescript yet\n");
}

function seek_out(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_seek_out not implemented by bucklescript yet\n");
}

function pos_out() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_pos_out not implemented by bucklescript yet\n");
}

function out_channel_length() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_channel_size not implemented by bucklescript yet\n");
}

function set_binary_mode_out(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_set_binary_mode not implemented by bucklescript yet\n");
}

var input_char = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["b" /* caml_ml_input_char */];

var input_byte = __WEBPACK_IMPORTED_MODULE_1__caml_io_js__["b" /* caml_ml_input_char */];

function input_binary_int() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_input_int not implemented by bucklescript yet\n");
}

function input_value() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_input_value not implemented by bucklescript yet\n");
}

function seek_in(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_seek_in not implemented by bucklescript yet\n");
}

function pos_in() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_pos_in not implemented by bucklescript yet\n");
}

function in_channel_length() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_channel_size not implemented by bucklescript yet\n");
}

function close_in() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_close_channel not implemented by bucklescript yet\n");
}

function set_binary_mode_in(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_set_binary_mode not implemented by bucklescript yet\n");
}

function LargeFile_000(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_seek_out_64 not implemented by bucklescript yet\n");
}

function LargeFile_001() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_pos_out_64 not implemented by bucklescript yet\n");
}

function LargeFile_002() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_channel_size_64 not implemented by bucklescript yet\n");
}

function LargeFile_003(_, _$1) {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_seek_in_64 not implemented by bucklescript yet\n");
}

function LargeFile_004() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_pos_in_64 not implemented by bucklescript yet\n");
}

function LargeFile_005() {
  return __WEBPACK_IMPORTED_MODULE_7__caml_missing_polyfill_js__["a" /* not_implemented */]("caml_ml_channel_size_64 not implemented by bucklescript yet\n");
}

var LargeFile = [LargeFile_000, LargeFile_001, LargeFile_002, LargeFile_003, LargeFile_004, LargeFile_005];


/* No side effect */

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export div */
/* unused harmony export mod_ */
/* unused harmony export caml_bswap16 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return caml_int32_bswap; });
/* unused harmony export caml_nativeint_bswap */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return imul; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__ = __webpack_require__(1);




function div(x, y) {
  if (y === 0) {
    throw __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["b" /* division_by_zero */];
  } else {
    return x / y | 0;
  }
}

function mod_(x, y) {
  if (y === 0) {
    throw __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["b" /* division_by_zero */];
  } else {
    return x % y;
  }
}

function caml_bswap16(x) {
  return (x & 255) << 8 | (x & 65280) >>> 8;
}

function caml_int32_bswap(x) {
  return (x & 255) << 24 | (x & 65280) << 8 | (x & 16711680) >>> 8 | (x & 4278190080) >>> 24;
}

var imul = Math.imul || function (x, y) {
  y |= 0;return ((x >> 16) * y << 16) + (x & 0xffff) * y | 0;
};

var caml_nativeint_bswap = caml_int32_bswap;


/* imul Not a pure module */

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bytes_of_string; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return bytes_to_string; });
/* unused harmony export caml_is_printable */
/* unused harmony export caml_string_of_char_array */
/* unused harmony export caml_string_get */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return caml_string_compare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return caml_create_string; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return caml_fill_string; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return caml_blit_string; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return caml_blit_bytes; });
/* unused harmony export caml_string_get16 */
/* unused harmony export caml_string_get32 */
/* unused harmony export string_of_char */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return get; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__ = __webpack_require__(1);




function string_of_char(prim) {
  return String.fromCharCode(prim);
}

function caml_string_get(s, i) {
  if (i >= s.length || i < 0) {
    throw [__WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["e" /* invalid_argument */], "index out of bounds"];
  } else {
    return s.charCodeAt(i);
  }
}

function caml_create_string(len) {
  if (len < 0) {
    throw [__WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.create"];
  } else {
    return new Array(len);
  }
}

function caml_string_compare(s1, s2) {
  if (s1 === s2) {
    return 0;
  } else if (s1 < s2) {
    return -1;
  } else {
    return 1;
  }
}

function caml_fill_string(s, i, l, c) {
  if (l > 0) {
    for (var k = i, k_finish = (l + i | 0) - 1 | 0; k <= k_finish; ++k) {
      s[k] = c;
    }
    return (/* () */0
    );
  } else {
    return 0;
  }
}

function caml_blit_string(s1, i1, s2, i2, len) {
  if (len > 0) {
    var off1 = s1.length - i1 | 0;
    if (len <= off1) {
      for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
        s2[i2 + i | 0] = s1.charCodeAt(i1 + i | 0);
      }
      return (/* () */0
      );
    } else {
      for (var i$1 = 0, i_finish$1 = off1 - 1 | 0; i$1 <= i_finish$1; ++i$1) {
        s2[i2 + i$1 | 0] = s1.charCodeAt(i1 + i$1 | 0);
      }
      for (var i$2 = off1, i_finish$2 = len - 1 | 0; i$2 <= i_finish$2; ++i$2) {
        s2[i2 + i$2 | 0] = /* "\000" */0;
      }
      return (/* () */0
      );
    }
  } else {
    return 0;
  }
}

function caml_blit_bytes(s1, i1, s2, i2, len) {
  if (len > 0) {
    if (s1 === s2) {
      var s1$1 = s1;
      var i1$1 = i1;
      var i2$1 = i2;
      var len$1 = len;
      if (i1$1 < i2$1) {
        var range_a = (s1$1.length - i2$1 | 0) - 1 | 0;
        var range_b = len$1 - 1 | 0;
        var range = range_a > range_b ? range_b : range_a;
        for (var j = range; j >= 0; --j) {
          s1$1[i2$1 + j | 0] = s1$1[i1$1 + j | 0];
        }
        return (/* () */0
        );
      } else if (i1$1 > i2$1) {
        var range_a$1 = (s1$1.length - i1$1 | 0) - 1 | 0;
        var range_b$1 = len$1 - 1 | 0;
        var range$1 = range_a$1 > range_b$1 ? range_b$1 : range_a$1;
        for (var k = 0; k <= range$1; ++k) {
          s1$1[i2$1 + k | 0] = s1$1[i1$1 + k | 0];
        }
        return (/* () */0
        );
      } else {
        return 0;
      }
    } else {
      var off1 = s1.length - i1 | 0;
      if (len <= off1) {
        for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
          s2[i2 + i | 0] = s1[i1 + i | 0];
        }
        return (/* () */0
        );
      } else {
        for (var i$1 = 0, i_finish$1 = off1 - 1 | 0; i$1 <= i_finish$1; ++i$1) {
          s2[i2 + i$1 | 0] = s1[i1 + i$1 | 0];
        }
        for (var i$2 = off1, i_finish$2 = len - 1 | 0; i$2 <= i_finish$2; ++i$2) {
          s2[i2 + i$2 | 0] = /* "\000" */0;
        }
        return (/* () */0
        );
      }
    }
  } else {
    return 0;
  }
}

function bytes_of_string(s) {
  var len = s.length;
  var res = new Array(len);
  for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
    res[i] = s.charCodeAt(i);
  }
  return res;
}

function bytes_to_string(a) {
  var bytes = a;
  var i = 0;
  var len = a.length;
  var s = "";
  var s_len = len;
  if (i === 0 && len <= 4096 && len === bytes.length) {
    return String.fromCharCode.apply(null, bytes);
  } else {
    var offset = 0;
    while (s_len > 0) {
      var next = s_len < 1024 ? s_len : 1024;
      var tmp_bytes = new Array(next);
      caml_blit_bytes(bytes, offset, tmp_bytes, 0, next);
      s = s + String.fromCharCode.apply(null, tmp_bytes);
      s_len = s_len - next | 0;
      offset = offset + next | 0;
    };
    return s;
  }
}

function caml_string_of_char_array(chars) {
  var len = chars.length;
  var bytes = new Array(len);
  for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
    bytes[i] = chars[i];
  }
  return bytes_to_string(bytes);
}

function caml_is_printable(c) {
  if (c > 31) {
    return +(c < 127);
  } else {
    return (/* false */0
    );
  }
}

function caml_string_get16(s, i) {
  return s.charCodeAt(i) + (s.charCodeAt(i + 1 | 0) << 8) | 0;
}

function caml_string_get32(s, i) {
  return ((s.charCodeAt(i) + (s.charCodeAt(i + 1 | 0) << 8) | 0) + (s.charCodeAt(i + 2 | 0) << 16) | 0) + (s.charCodeAt(i + 3 | 0) << 24) | 0;
}

function get(s, i) {
  if (i < 0 || i >= s.length) {
    throw [__WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["e" /* invalid_argument */], "index out of bounds"];
  } else {
    return s.charCodeAt(i);
  }
}


/* No side effect */

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export caml_set_oo_id */
/* unused harmony export get_id */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isCamlExceptionOrOpenVariant; });


var id = [0];

function caml_set_oo_id(b) {
  b[1] = id[0];
  id[0] += 1;
  return b;
}

function get_id() {
  id[0] += 1;
  return id[0];
}

function create(str) {
  var v_001 = get_id( /* () */0);
  var v = /* tuple */[str, v_001];
  v.tag = 248;
  return v;
}

function isCamlExceptionOrOpenVariant(e) {
  if (e === undefined) {
    return (/* false */0
    );
  } else if (e.tag === 248) {
    return (/* true */1
    );
  } else {
    var slot = e[0];
    if (slot !== undefined) {
      return +(slot.tag === 248);
    } else {
      return (/* false */0
      );
    }
  }
}


/* No side effect */

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return noNode; });
/* unused harmony export comment */
/* unused harmony export text */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fullnode; });
/* unused harmony export node */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return lazyGen; });
/* unused harmony export noProp */
/* unused harmony export prop */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return onCB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return onMsg; });
/* unused harmony export attribute */
/* unused harmony export data */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return style; });
/* unused harmony export styles */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return renderToHtmlString; });
/* unused harmony export emptyEventHandler */
/* unused harmony export emptyEventCB */
/* unused harmony export eventHandler */
/* unused harmony export eventHandler_GetCB */
/* unused harmony export compareEventHandlerTypes */
/* unused harmony export eventHandler_Register */
/* unused harmony export eventHandler_Unregister */
/* unused harmony export eventHandler_Mutate */
/* unused harmony export patchVNodesOnElems_PropertiesApply_Add */
/* unused harmony export patchVNodesOnElems_PropertiesApply_Remove */
/* unused harmony export patchVNodesOnElems_PropertiesApply_RemoveAdd */
/* unused harmony export patchVNodesOnElems_PropertiesApply_Mutate */
/* unused harmony export patchVNodesOnElems_PropertiesApply */
/* unused harmony export patchVNodesOnElems_Properties */
/* unused harmony export genEmptyProps */
/* unused harmony export mapEmptyProps */
/* unused harmony export patchVNodesOnElems_ReplaceNode */
/* unused harmony export patchVNodesOnElems_CreateElement */
/* unused harmony export patchVNodesOnElems_MutateNode */
/* unused harmony export patchVNodesOnElems */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return patchVNodesIntoElement; });
/* unused harmony export patchVNodeIntoElement */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return wrapCallbacks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return map; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bs_platform_lib_es6_caml_obj_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__web_node_js__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__web_document_js__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__ = __webpack_require__(1);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE












var noNode = /* CommentNode */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](0, [""]);

function comment(s) {
  return (/* CommentNode */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](0, [s])
  );
}

function text(s) {
  return (/* Text */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](1, [s])
  );
}

function fullnode(namespace, tagName, key, unique, props, vdoms) {
  return (/* Node */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](2, [namespace, tagName, key, unique, props, vdoms])
  );
}

function node($staropt$star, tagName, $staropt$star$1, $staropt$star$2, props, vdoms) {
  var namespace = $staropt$star ? $staropt$star[0] : "";
  var key = $staropt$star$1 ? $staropt$star$1[0] : "";
  var unique = $staropt$star$2 ? $staropt$star$2[0] : "";
  return fullnode(namespace, tagName, key, unique, props, vdoms);
}

function lazyGen(key, fn) {
  return (/* LazyGen */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](3, [key, fn, [noNode]])
  );
}

function prop(key, value) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](0, [key, value])
  );
}

function onCB(name, key, cb) {
  return (/* Event */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](3, [name,
    /* EventHandlerCallback */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](0, [key, cb]), [/* None */0]])
  );
}

function onMsg(name, msg) {
  return (/* Event */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](3, [name,
    /* EventHandlerMsg */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](1, [msg]), [/* None */0]])
  );
}

function attribute(namespace, key, value) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](1, [namespace, key, value])
  );
}

function data(key, value) {
  return (/* Data */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](2, [key, value])
  );
}

function style(key, value) {
  return (/* Style */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](4, [/* :: */[
    /* tuple */[key, value],
    /* [] */0]])
  );
}

function styles(s) {
  return (/* Style */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](4, [s])
  );
}

function renderToHtmlString(_param) {
  while (true) {
    var param = _param;
    switch (param.tag | 0) {
      case 0:
        return "<!-- " + (param[0] + " -->");
      case 1:
        return param[0];
      case 2:
        var tagName = param[1];
        var namespace = param[0];
        return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", /* :: */["<",
        /* :: */[namespace,
        /* :: */[namespace === "" ? "" : ":",
        /* :: */[tagName,
        /* :: */[__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function (p) {
          var param = p;
          if (typeof param === "number") {
            return "";
          } else {
            switch (param.tag | 0) {
              case 0:
                return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", /* :: */[" ",
                /* :: */[param[0],
                /* :: */["=\"",
                /* :: */[param[1],
                /* :: */["\"",
                /* [] */0]]]]]);
              case 1:
                return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", /* :: */[" ",
                /* :: */[param[1],
                /* :: */["=\"",
                /* :: */[param[2],
                /* :: */["\"",
                /* [] */0]]]]]);
              case 2:
                return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", /* :: */[" data-",
                /* :: */[param[0],
                /* :: */["=\"",
                /* :: */[param[1],
                /* :: */["\"",
                /* [] */0]]]]]);
              case 3:
                return "";
              case 4:
                return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", /* :: */[" style=\"",
                /* :: */[__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */](";", __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function (param) {
                  return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", /* :: */[param[0],
                  /* :: */[":",
                  /* :: */[param[1],
                  /* :: */[";",
                  /* [] */0]]]]);
                }, param[0])),
                /* :: */["\"",
                /* [] */0]]]);

            }
          }
        }, param[4])),
        /* :: */[">",
        /* :: */[__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_string_js__["a" /* concat */]("", __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](renderToHtmlString, param[5])),
        /* :: */["</",
        /* :: */[tagName,
        /* :: */[">",
        /* [] */0]]]]]]]]]]);
      case 3:
        _param = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[1], /* () */0);
        continue;
      case 4:
        _param = param[1];
        continue;

    }
  };
}

function emptyEventHandler() {
  return (/* () */0
  );
}

function emptyEventCB() {
  return (/* None */0
  );
}

function eventHandler(callbacks, cb) {
  return function (ev) {
    var match = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](cb[0], ev);
    if (match) {
      return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](callbacks[0][/* enqueue */0], match[0]);
    } else {
      return (/* () */0
      );
    }
  };
}

function eventHandler_GetCB(param) {
  if (param.tag) {
    var msg = param[0];
    return function () {
      return (/* Some */[msg]
      );
    };
  } else {
    return param[1];
  }
}

function compareEventHandlerTypes(left, param) {
  if (param.tag) {
    if (!left.tag || !__WEBPACK_IMPORTED_MODULE_4_bs_platform_lib_es6_caml_obj_js__["b" /* caml_equal */](param[0], left[0])) {
      return (/* false */0
      );
    } else {
      return (/* true */1
      );
    }
  } else if (!left.tag && param[0] === left[0]) {
    return (/* true */1
    );
  } else {
    return (/* false */0
    );
  }
}

function eventHandler_Register(callbacks, elem, name, handlerType) {
  var cb = [eventHandler_GetCB(handlerType)];
  var handler = eventHandler(callbacks, cb);
  __WEBPACK_IMPORTED_MODULE_5__web_node_js__["a" /* addEventListener */](elem, name, handler, /* false */0);
  return (/* Some */[/* record */[
    /* handler */handler,
    /* cb */cb]]
  );
}

function eventHandler_Unregister(elem, name, param) {
  if (param) {
    __WEBPACK_IMPORTED_MODULE_5__web_node_js__["d" /* removeEventListener */](elem, name, param[0][/* handler */0], /* false */0);
    return (/* None */0
    );
  } else {
    return (/* None */0
    );
  }
}

function eventHandler_Mutate(callbacks, elem, oldName, newName, oldHandlerType, newHandlerType, oldCache, newCache) {
  var match = oldCache[0];
  if (match) {
    if (oldName === newName) {
      newCache[0] = oldCache[0];
      if (compareEventHandlerTypes(oldHandlerType, newHandlerType)) {
        return (/* () */0
        );
      } else {
        var cb = eventHandler_GetCB(newHandlerType);
        match[0][/* cb */1][0] = cb;
        return (/* () */0
        );
      }
    } else {
      oldCache[0] = eventHandler_Unregister(elem, oldName, oldCache[0]);
      newCache[0] = eventHandler_Register(callbacks, elem, newName, newHandlerType);
      return (/* () */0
      );
    }
  } else {
    newCache[0] = eventHandler_Register(callbacks, elem, newName, newHandlerType);
    return (/* () */0
    );
  }
}

function patchVNodesOnElems_PropertiesApply_Add(callbacks, elem, _, param) {
  if (typeof param === "number") {
    return (/* () */0
    );
  } else {
    switch (param.tag | 0) {
      case 0:
        elem[param[0]] = param[1];
        return (/* () */0
        );
      case 1:
        return __WEBPACK_IMPORTED_MODULE_5__web_node_js__["e" /* setAttributeNsOptional */](elem, param[0], param[1], param[2]);
      case 2:
        console.log( /* tuple */["TODO:  Add Data Unhandled", param[0], param[1]]);
        throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "TODO:  Add Data Unhandled"];
      case 3:
        param[2][0] = eventHandler_Register(callbacks, elem, param[0], param[1]);
        return (/* () */0
        );
      case 4:
        return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["c" /* fold_left */](function (_, param) {
          return __WEBPACK_IMPORTED_MODULE_5__web_node_js__["f" /* setStyleProperty */](elem, /* None */0, param[0], param[1]);
        }, /* () */0, param[0]);

    }
  }
}

function patchVNodesOnElems_PropertiesApply_Remove(_, elem, _$1, param) {
  if (typeof param === "number") {
    return (/* () */0
    );
  } else {
    switch (param.tag | 0) {
      case 0:
        elem[param[0]] = undefined;
        return (/* () */0
        );
      case 1:
        return __WEBPACK_IMPORTED_MODULE_5__web_node_js__["c" /* removeAttributeNsOptional */](elem, param[0], param[1]);
      case 2:
        console.log( /* tuple */["TODO:  Remove Data Unhandled", param[0], param[1]]);
        throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "TODO:  Remove Data Unhandled"];
      case 3:
        var cache = param[2];
        cache[0] = eventHandler_Unregister(elem, param[0], cache[0]);
        return (/* () */0
        );
      case 4:
        return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["c" /* fold_left */](function (_, param) {
          return __WEBPACK_IMPORTED_MODULE_5__web_node_js__["f" /* setStyleProperty */](elem, /* None */0, param[0], null);
        }, /* () */0, param[0]);

    }
  }
}

function patchVNodesOnElems_PropertiesApply_RemoveAdd(callbacks, elem, idx, oldProp, newProp) {
  patchVNodesOnElems_PropertiesApply_Remove(callbacks, elem, idx, oldProp);
  patchVNodesOnElems_PropertiesApply_Add(callbacks, elem, idx, newProp);
  return (/* () */0
  );
}

function patchVNodesOnElems_PropertiesApply_Mutate(_, elem, _$1, oldProp, _newProp) {
  if (typeof _newProp === "number") {
    throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "This should never be called as all entries through NoProp are gated."];
  } else {
    switch (_newProp.tag | 0) {
      case 0:
        elem[_newProp[0]] = _newProp[1];
        return (/* () */0
        );
      case 1:
        return __WEBPACK_IMPORTED_MODULE_5__web_node_js__["e" /* setAttributeNsOptional */](elem, _newProp[0], _newProp[1], _newProp[2]);
      case 2:
        console.log( /* tuple */["TODO:  Mutate Data Unhandled", _newProp[0], _newProp[1]]);
        throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "TODO:  Mutate Data Unhandled"];
      case 3:
        throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "This will never be called because it is gated"];
      case 4:
        if (typeof oldProp === "number") {
          throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "Passed a non-Style to a new Style as a Mutations while the old Style is not actually a style!"];
        } else if (oldProp.tag === 4) {
          return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["d" /* fold_left2 */](function (_, param, param$1) {
            var nv = param$1[1];
            var nk = param$1[0];
            var ok = param[0];
            if (ok === nk) {
              if (param[1] === nv) {
                return (/* () */0
                );
              } else {
                return __WEBPACK_IMPORTED_MODULE_5__web_node_js__["f" /* setStyleProperty */](elem, /* None */0, nk, nv);
              }
            } else {
              __WEBPACK_IMPORTED_MODULE_5__web_node_js__["f" /* setStyleProperty */](elem, /* None */0, ok, null);
              return __WEBPACK_IMPORTED_MODULE_5__web_node_js__["f" /* setStyleProperty */](elem, /* None */0, nk, nv);
            }
          }, /* () */0, oldProp[0], _newProp[0]);
        } else {
          throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "Passed a non-Style to a new Style as a Mutations while the old Style is not actually a style!"];
        }
        break;

    }
  }
}

function patchVNodesOnElems_PropertiesApply(callbacks, elem, _idx, _oldProperties, _newProperties) {
  while (true) {
    var newProperties = _newProperties;
    var oldProperties = _oldProperties;
    var idx = _idx;
    if (oldProperties) {
      var _oldProp = oldProperties[0];
      var exit = 0;
      if (newProperties) {
        if (typeof _oldProp === "number") {
          if (typeof newProperties[0] === "number") {
            _newProperties = newProperties[1];
            _oldProperties = oldProperties[1];
            _idx = idx + 1 | 0;
            continue;
          } else {
            exit = 1;
          }
        } else {
          switch (_oldProp.tag | 0) {
            case 0:
              var newProp = newProperties[0];
              if (typeof newProp === "number") {
                exit = 1;
              } else if (newProp.tag) {
                exit = 1;
              } else {
                if (!(_oldProp[0] === newProp[0] && _oldProp[1] === newProp[1])) {
                  patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp);
                }
                _newProperties = newProperties[1];
                _oldProperties = oldProperties[1];
                _idx = idx + 1 | 0;
                continue;
              }
              break;
            case 1:
              var newProp$1 = newProperties[0];
              if (typeof newProp$1 === "number") {
                exit = 1;
              } else if (newProp$1.tag === 1) {
                if (!(_oldProp[0] === newProp$1[0] && _oldProp[1] === newProp$1[1] && _oldProp[2] === newProp$1[2])) {
                  patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp$1);
                }
                _newProperties = newProperties[1];
                _oldProperties = oldProperties[1];
                _idx = idx + 1 | 0;
                continue;
              } else {
                exit = 1;
              }
              break;
            case 2:
              var newProp$2 = newProperties[0];
              if (typeof newProp$2 === "number") {
                exit = 1;
              } else if (newProp$2.tag === 2) {
                if (!(_oldProp[0] === newProp$2[0] && _oldProp[1] === newProp$2[1])) {
                  patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp$2);
                }
                _newProperties = newProperties[1];
                _oldProperties = oldProperties[1];
                _idx = idx + 1 | 0;
                continue;
              } else {
                exit = 1;
              }
              break;
            case 3:
              var _newProp = newProperties[0];
              if (typeof _newProp === "number") {
                exit = 1;
              } else if (_newProp.tag === 3) {
                eventHandler_Mutate(callbacks, elem, _oldProp[0], _newProp[0], _oldProp[1], _newProp[1], _oldProp[2], _newProp[2]);
                _newProperties = newProperties[1];
                _oldProperties = oldProperties[1];
                _idx = idx + 1 | 0;
                continue;
              } else {
                exit = 1;
              }
              break;
            case 4:
              var newProp$3 = newProperties[0];
              if (typeof newProp$3 === "number") {
                exit = 1;
              } else if (newProp$3.tag === 4) {
                if (!__WEBPACK_IMPORTED_MODULE_4_bs_platform_lib_es6_caml_obj_js__["b" /* caml_equal */](_oldProp[0], newProp$3[0])) {
                  patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp$3);
                }
                _newProperties = newProperties[1];
                _oldProperties = oldProperties[1];
                _idx = idx + 1 | 0;
                continue;
              } else {
                exit = 1;
              }
              break;

          }
        }
      } else {
        return (/* false */0
        );
      }
      if (exit === 1) {
        patchVNodesOnElems_PropertiesApply_RemoveAdd(callbacks, elem, idx, _oldProp, newProperties[0]);
        _newProperties = newProperties[1];
        _oldProperties = oldProperties[1];
        _idx = idx + 1 | 0;
        continue;
      }
    } else if (newProperties) {
      return (/* false */0
      );
    } else {
      return (/* true */1
      );
    }
  };
}

function patchVNodesOnElems_Properties(callbacks, elem, oldProperties, newProperties) {
  return patchVNodesOnElems_PropertiesApply(callbacks, elem, 0, oldProperties, newProperties);
}

function genEmptyProps(length) {
  var _lst = /* [] */0;
  var _len = length;
  while (true) {
    var len = _len;
    var lst = _lst;
    if (len !== 0) {
      _len = len - 1 | 0;
      _lst = /* :: */[
      /* NoProp */0, lst];
      continue;
    } else {
      return lst;
    }
  };
}

function mapEmptyProps(props) {
  return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function () {
    return (/* NoProp */0
    );
  }, props);
}

function patchVNodesOnElems_ReplaceNode(callbacks, elem, elems, idx, param) {
  if (param.tag === 2) {
    var newProperties = param[4];
    var oldChild = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
    var newChild = __WEBPACK_IMPORTED_MODULE_7__web_document_js__["a" /* createElementNsOptional */](param[0], param[1]);
    var match = patchVNodesOnElems_Properties(callbacks, newChild, __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function () {
      return (/* NoProp */0
      );
    }, newProperties), newProperties);
    if (match !== 0) {
      var childChildren = newChild.childNodes;
      patchVNodesOnElems(callbacks, newChild, childChildren, 0, /* [] */0, param[5]);
      __WEBPACK_IMPORTED_MODULE_5__web_node_js__["b" /* insertBefore */](elem, newChild, oldChild);
      elem.removeChild(oldChild);
      return (/* () */0
      );
    } else {
      throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["f" /* match_failure */], ["/home/thomas/Workspace/socrates/open-space/node_modules/bucklescript-tea/src/vdom.ml", 319, 30]];
    }
  } else {
    throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "Node replacement should never be passed anything but a node itself"];
  }
}

function patchVNodesOnElems_CreateElement(_callbacks, _param) {
  while (true) {
    var param = _param;
    var callbacks = _callbacks;
    switch (param.tag | 0) {
      case 0:
        var text = param[0];
        return document.createComment(text);
      case 1:
        var text$1 = param[0];
        return document.createTextNode(text$1);
      case 2:
        var newProperties = param[4];
        var newChild = __WEBPACK_IMPORTED_MODULE_7__web_document_js__["a" /* createElementNsOptional */](param[0], param[1]);
        var match = patchVNodesOnElems_Properties(callbacks, newChild, __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function () {
          return (/* NoProp */0
          );
        }, newProperties), newProperties);
        if (match !== 0) {
          var childChildren = newChild.childNodes;
          patchVNodesOnElems(callbacks, newChild, childChildren, 0, /* [] */0, param[5]);
          return newChild;
        } else {
          throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["f" /* match_failure */], ["/home/thomas/Workspace/socrates/open-space/node_modules/bucklescript-tea/src/vdom.ml", 333, 30]];
        }
        break;
      case 3:
        var vdom = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[1], /* () */0);
        param[2][0] = vdom;
        _param = vdom;
        continue;
      case 4:
        _param = param[1];
        _callbacks = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[0], callbacks);
        continue;

    }
  };
}

function patchVNodesOnElems_MutateNode(callbacks, elem, elems, idx, oldNode, newNode) {
  if (oldNode.tag === 2) {
    if (newNode.tag === 2) {
      if (oldNode[3] !== newNode[3] || oldNode[1] !== newNode[1]) {
        return patchVNodesOnElems_ReplaceNode(callbacks, elem, elems, idx, newNode);
      } else {
        var child = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
        var childChildren = child.childNodes;
        if (!patchVNodesOnElems_Properties(callbacks, child, oldNode[4], newNode[4])) {
          console.log("VDom:  Failed swapping properties because the property list length changed, use `noProp` to swap properties instead, not by altering the list structure.  This is a massive inefficiency until this issue is resolved.");
          patchVNodesOnElems_ReplaceNode(callbacks, elem, elems, idx, newNode);
        }
        return patchVNodesOnElems(callbacks, child, childChildren, 0, oldNode[5], newNode[5]);
      }
    } else {
      throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "Non-node passed to patchVNodesOnElems_MutateNode"];
    }
  } else {
    throw [__WEBPACK_IMPORTED_MODULE_8_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "Non-node passed to patchVNodesOnElems_MutateNode"];
  }
}

function patchVNodesOnElems(callbacks, elem, elems, _idx, _oldVNodes, _newVNodes) {
  while (true) {
    var newVNodes = _newVNodes;
    var oldVNodes = _oldVNodes;
    var idx = _idx;
    if (oldVNodes) {
      var oldNode = oldVNodes[0];
      var exit = 0;
      switch (oldNode.tag | 0) {
        case 0:
          if (newVNodes) {
            var match = newVNodes[0];
            if (match.tag) {
              exit = 1;
            } else if (oldNode[0] === match[0]) {
              _newVNodes = newVNodes[1];
              _oldVNodes = oldVNodes[1];
              _idx = idx + 1 | 0;
              continue;
            } else {
              exit = 1;
            }
          } else {
            exit = 1;
          }
          break;
        case 1:
          if (newVNodes) {
            var match$1 = newVNodes[0];
            if (match$1.tag === 1) {
              var newText = match$1[0];
              if (oldNode[0] !== newText) {
                var child = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
                child.nodeValue = newText;
              }
              _newVNodes = newVNodes[1];
              _oldVNodes = oldVNodes[1];
              _idx = idx + 1 | 0;
              continue;
            } else {
              exit = 1;
            }
          } else {
            exit = 1;
          }
          break;
        case 2:
          if (newVNodes) {
            var newNode = newVNodes[0];
            if (newNode.tag === 2) {
              var newRest = newVNodes[1];
              var newKey = newNode[2];
              var newTagName = newNode[1];
              var newNamespace = newNode[0];
              var oldRest = oldVNodes[1];
              var oldKey = oldNode[2];
              var oldTagName = oldNode[1];
              var oldNamespace = oldNode[0];
              if (oldKey === newKey && oldKey !== "") {
                _newVNodes = newRest;
                _oldVNodes = oldRest;
                _idx = idx + 1 | 0;
                continue;
              } else if (oldKey === "" || newKey === "") {
                patchVNodesOnElems_MutateNode(callbacks, elem, elems, idx, oldNode, newNode);
                _newVNodes = newRest;
                _oldVNodes = oldRest;
                _idx = idx + 1 | 0;
                continue;
              } else {
                var exit$1 = 0;
                var exit$2 = 0;
                if (oldRest) {
                  var match$2 = oldRest[0];
                  if (match$2.tag === 2) {
                    var olderRest = oldRest[1];
                    var olderKey = match$2[2];
                    var olderTagName = match$2[1];
                    var olderNamespace = match$2[0];
                    var exit$3 = 0;
                    if (newRest) {
                      var match$3 = newRest[0];
                      if (match$3.tag === 2) {
                        if (olderNamespace === newNamespace && olderTagName === newTagName && olderKey === newKey && oldNamespace === match$3[0] && oldTagName === match$3[1] && oldKey === match$3[2]) {
                          var firstChild = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
                          var secondChild = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx + 1 | 0);
                          elem.removeChild(secondChild);
                          __WEBPACK_IMPORTED_MODULE_5__web_node_js__["b" /* insertBefore */](elem, secondChild, firstChild);
                          _newVNodes = newRest[1];
                          _oldVNodes = olderRest;
                          _idx = idx + 2 | 0;
                          continue;
                        } else {
                          exit$3 = 4;
                        }
                      } else {
                        exit$3 = 4;
                      }
                    } else {
                      exit$3 = 4;
                    }
                    if (exit$3 === 4) {
                      if (olderNamespace === newNamespace && olderTagName === newTagName && olderKey === newKey) {
                        var oldChild = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
                        elem.removeChild(oldChild);
                        _newVNodes = newRest;
                        _oldVNodes = olderRest;
                        _idx = idx + 1 | 0;
                        continue;
                      } else {
                        exit$2 = 3;
                      }
                    }
                  } else {
                    exit$2 = 3;
                  }
                } else {
                  exit$2 = 3;
                }
                if (exit$2 === 3) {
                  if (newRest) {
                    var match$4 = newRest[0];
                    if (match$4.tag === 2) {
                      if (oldNamespace === match$4[0] && oldTagName === match$4[1] && oldKey === match$4[2]) {
                        var oldChild$1 = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
                        var newChild = patchVNodesOnElems_CreateElement(callbacks, newNode);
                        __WEBPACK_IMPORTED_MODULE_5__web_node_js__["b" /* insertBefore */](elem, newChild, oldChild$1);
                        _newVNodes = newRest;
                        _idx = idx + 1 | 0;
                        continue;
                      } else {
                        exit$1 = 2;
                      }
                    } else {
                      exit$1 = 2;
                    }
                  } else {
                    exit$1 = 2;
                  }
                }
                if (exit$1 === 2) {
                  patchVNodesOnElems_MutateNode(callbacks, elem, elems, idx, oldNode, newNode);
                  _newVNodes = newRest;
                  _oldVNodes = oldRest;
                  _idx = idx + 1 | 0;
                  continue;
                }
              }
            } else {
              exit = 1;
            }
          } else {
            exit = 1;
          }
          break;
        case 3:
          if (newVNodes) {
            var match$5 = newVNodes[0];
            if (match$5.tag === 3) {
              var newRest$1 = newVNodes[1];
              var newCache = match$5[2];
              var newGen = match$5[1];
              var newKey$1 = match$5[0];
              var oldRest$1 = oldVNodes[1];
              var oldCache = oldNode[2];
              var oldKey$1 = oldNode[0];
              if (oldKey$1 === newKey$1) {
                newCache[0] = oldCache[0];
                _newVNodes = newRest$1;
                _oldVNodes = oldRest$1;
                _idx = idx + 1 | 0;
                continue;
              } else {
                var exit$4 = 0;
                var exit$5 = 0;
                if (oldRest$1) {
                  var match$6 = oldRest$1[0];
                  if (match$6.tag === 3) {
                    var olderRest$1 = oldRest$1[1];
                    var olderKey$1 = match$6[0];
                    var exit$6 = 0;
                    if (newRest$1) {
                      var match$7 = newRest$1[0];
                      if (match$7.tag === 3) {
                        if (olderKey$1 === newKey$1 && oldKey$1 === match$7[0]) {
                          var firstChild$1 = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
                          var secondChild$1 = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx + 1 | 0);
                          elem.removeChild(secondChild$1);
                          __WEBPACK_IMPORTED_MODULE_5__web_node_js__["b" /* insertBefore */](elem, secondChild$1, firstChild$1);
                          _newVNodes = newRest$1[1];
                          _oldVNodes = olderRest$1;
                          _idx = idx + 2 | 0;
                          continue;
                        } else {
                          exit$6 = 4;
                        }
                      } else {
                        exit$6 = 4;
                      }
                    } else {
                      exit$6 = 4;
                    }
                    if (exit$6 === 4) {
                      if (olderKey$1 === newKey$1) {
                        var oldChild$2 = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
                        elem.removeChild(oldChild$2);
                        var oldVdom = match$6[2][0];
                        newCache[0] = oldVdom;
                        _newVNodes = newRest$1;
                        _oldVNodes = olderRest$1;
                        _idx = idx + 1 | 0;
                        continue;
                      } else {
                        exit$5 = 3;
                      }
                    }
                  } else {
                    exit$5 = 3;
                  }
                } else {
                  exit$5 = 3;
                }
                if (exit$5 === 3) {
                  if (newRest$1) {
                    var match$8 = newRest$1[0];
                    if (match$8.tag === 3) {
                      if (match$8[0] === oldKey$1) {
                        var oldChild$3 = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
                        var newVdom = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](newGen, /* () */0);
                        newCache[0] = newVdom;
                        var newChild$1 = patchVNodesOnElems_CreateElement(callbacks, newVdom);
                        __WEBPACK_IMPORTED_MODULE_5__web_node_js__["b" /* insertBefore */](elem, newChild$1, oldChild$3);
                        _newVNodes = newRest$1;
                        _idx = idx + 1 | 0;
                        continue;
                      } else {
                        exit$4 = 2;
                      }
                    } else {
                      exit$4 = 2;
                    }
                  } else {
                    exit$4 = 2;
                  }
                }
                if (exit$4 === 2) {
                  var oldVdom$1 = oldCache[0];
                  var newVdom$1 = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](newGen, /* () */0);
                  newCache[0] = newVdom$1;
                  _newVNodes = /* :: */[newVdom$1, newRest$1];
                  _oldVNodes = /* :: */[oldVdom$1, oldRest$1];
                  continue;
                }
              }
            } else {
              exit = 1;
            }
          } else {
            exit = 1;
          }
          break;
        case 4:
          _oldVNodes = /* :: */[oldNode[1], oldVNodes[1]];
          continue;

      }
      if (exit === 1) {
        var oldRest$2 = oldVNodes[1];
        if (newVNodes) {
          var newNode$1 = newVNodes[0];
          if (newNode$1.tag === 4) {
            patchVNodesOnElems(__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](newNode$1[0], callbacks), elem, elems, idx, /* :: */[oldNode,
            /* [] */0], /* :: */[newNode$1[1],
            /* [] */0]);
            _newVNodes = newVNodes[1];
            _oldVNodes = oldRest$2;
            _idx = idx + 1 | 0;
            continue;
          } else {
            var oldChild$4 = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
            var newChild$2 = patchVNodesOnElems_CreateElement(callbacks, newNode$1);
            __WEBPACK_IMPORTED_MODULE_5__web_node_js__["b" /* insertBefore */](elem, newChild$2, oldChild$4);
            elem.removeChild(oldChild$4);
            _newVNodes = newVNodes[1];
            _oldVNodes = oldRest$2;
            _idx = idx + 1 | 0;
            continue;
          }
        } else {
          var child$1 = __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_array_js__["c" /* caml_array_get */](elems, idx);
          elem.removeChild(child$1);
          _newVNodes = /* [] */0;
          _oldVNodes = oldRest$2;
          continue;
        }
      }
    } else if (newVNodes) {
      var newChild$3 = patchVNodesOnElems_CreateElement(callbacks, newVNodes[0]);
      elem.appendChild(newChild$3);
      _newVNodes = newVNodes[1];
      _oldVNodes = /* [] */0;
      _idx = idx + 1 | 0;
      continue;
    } else {
      return (/* () */0
      );
    }
  };
}

function patchVNodesIntoElement(callbacks, elem, oldVNodes, newVNodes) {
  var elems = elem.childNodes;
  patchVNodesOnElems(callbacks, elem, elems, 0, oldVNodes, newVNodes);
  return newVNodes;
}

function patchVNodeIntoElement(callbacks, elem, oldVNode, newVNode) {
  return patchVNodesIntoElement(callbacks, elem, /* :: */[oldVNode,
  /* [] */0], /* :: */[newVNode,
  /* [] */0]);
}

function wrapCallbacks(func, callbacks) {
  return [/* record */[/* enqueue */function (msg) {
    return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](callbacks[0][/* enqueue */0], __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](func, msg));
  }]];
}

function map(func, vdom) {
  var tagger = function (callbacks) {
    return [/* record */[/* enqueue */function (msg) {
      return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](callbacks[0][/* enqueue */0], __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](func, msg));
    }]];
  };
  return (/* Tagger */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](4, [tagger, vdom])
  );
}

var noProp = /* NoProp */0;


/* No side effect */

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the start of a week
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(dirtyDate, dirtyOptions) {
  var weekStartsOn = dirtyOptions ? Number(dirtyOptions.weekStartsOn) || 0 : 0;

  var date = parse(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfWeek;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var startOfDay = __webpack_require__(7);

var MILLISECONDS_IN_MINUTE = 60000;
var MILLISECONDS_IN_DAY = 86400000;

/**
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar days
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * var result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 */
function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  var startOfDayLeft = startOfDay(dirtyDateLeft);
  var startOfDayRight = startOfDay(dirtyDateRight);

  var timestampLeft = startOfDayLeft.getTime() - startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  var timestampRight = startOfDayRight.getTime() - startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a day is not constant
  // (e.g. it's different in the day of the daylight saving time clock shift)
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
}

module.exports = differenceInCalendarDays;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var getDaysInMonth = __webpack_require__(24);

/**
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be added
 * @returns {Date} the new date with the months added
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * var result = addMonths(new Date(2014, 8, 1), 5)
 * //=> Sun Feb 01 2015 00:00:00
 */
function addMonths(dirtyDate, dirtyAmount) {
  var date = parse(dirtyDate);
  var amount = Number(dirtyAmount);
  var desiredMonth = date.getMonth() + amount;
  var dateWithDesiredMonth = new Date(0);
  dateWithDesiredMonth.setFullYear(date.getFullYear(), desiredMonth, 1);
  dateWithDesiredMonth.setHours(0, 0, 0, 0);
  var daysInMonth = getDaysInMonth(dateWithDesiredMonth);
  // Set the last day of the new month
  // if the original date was the last day of the longer month
  date.setMonth(desiredMonth, Math.min(daysInMonth, date.getDate()));
  return date;
}

module.exports = addMonths;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of milliseconds
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * var result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);
  return dateLeft.getTime() - dateRight.getTime();
}

module.exports = differenceInMilliseconds;

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return caml_array_sub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return caml_array_concat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return caml_make_vect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return caml_array_blit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return caml_array_get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return caml_array_set; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__ = __webpack_require__(1);




function caml_array_sub(x, offset, len) {
  var result = new Array(len);
  var j = 0;
  var i = offset;
  while (j < len) {
    result[j] = x[i];
    j = j + 1 | 0;
    i = i + 1 | 0;
  };
  return result;
}

function len(_acc, _l) {
  while (true) {
    var l = _l;
    var acc = _acc;
    if (l) {
      _l = l[1];
      _acc = l[0].length + acc | 0;
      continue;
    } else {
      return acc;
    }
  };
}

function fill(arr, _i, _l) {
  while (true) {
    var l = _l;
    var i = _i;
    if (l) {
      var x = l[0];
      var l$1 = x.length;
      var k = i;
      var j = 0;
      while (j < l$1) {
        arr[k] = x[j];
        k = k + 1 | 0;
        j = j + 1 | 0;
      };
      _l = l[1];
      _i = k;
      continue;
    } else {
      return (/* () */0
      );
    }
  };
}

function caml_array_concat(l) {
  var v = len(0, l);
  var result = new Array(v);
  fill(result, 0, l);
  return result;
}

function caml_array_set(xs, index, newval) {
  if (index < 0 || index >= xs.length) {
    throw [__WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["e" /* invalid_argument */], "index out of bounds"];
  } else {
    xs[index] = newval;
    return (/* () */0
    );
  }
}

function caml_array_get(xs, index) {
  if (index < 0 || index >= xs.length) {
    throw [__WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["e" /* invalid_argument */], "index out of bounds"];
  } else {
    return xs[index];
  }
}

function caml_make_vect(len, init) {
  var b = new Array(len);
  for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
    b[i] = init;
  }
  return b;
}

function caml_array_blit(a1, i1, a2, i2, len) {
  if (i2 <= i1) {
    for (var j = 0, j_finish = len - 1 | 0; j <= j_finish; ++j) {
      a2[j + i2 | 0] = a1[j + i1 | 0];
    }
    return (/* () */0
    );
  } else {
    for (var j$1 = len - 1 | 0; j$1 >= 0; --j$1) {
      a2[j$1 + i2 | 0] = a1[j$1 + i1 | 0];
    }
    return (/* () */0
    );
  }
}


/* No side effect */

/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * @category Common Helpers
 * @summary Is the given argument an instance of Date?
 *
 * @description
 * Is the given argument an instance of Date?
 *
 * @param {*} argument - the argument to check
 * @returns {Boolean} the given argument is an instance of Date
 *
 * @example
 * // Is 'mayonnaise' a Date?
 * var result = isDate('mayonnaise')
 * //=> false
 */
function isDate(argument) {
  return argument instanceof Date;
}

module.exports = isDate;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Get the number of days in a month of the given date.
 *
 * @description
 * Get the number of days in a month of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the number of days in a month
 *
 * @example
 * // How many days are in February 2000?
 * var result = getDaysInMonth(new Date(2000, 1))
 * //=> 29
 */
function getDaysInMonth(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();
  var monthIndex = date.getMonth();
  var lastDayOfMonth = new Date(0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

module.exports = getDaysInMonth;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var addDays = __webpack_require__(9);

/**
 * @category Week Helpers
 * @summary Add the specified number of weeks to the given date.
 *
 * @description
 * Add the specified number of week to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of weeks to be added
 * @returns {Date} the new date with the weeks added
 *
 * @example
 * // Add 4 weeks to 1 September 2014:
 * var result = addWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Sep 29 2014 00:00:00
 */
function addWeeks(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  var days = amount * 7;
  return addDays(dirtyDate, days);
}

module.exports = addWeeks;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Compare the two dates reverse chronologically and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return -1 if the first date is after the second,
 * 1 if the first date is before the second or 0 if dates are equal.
 *
 * @param {Date|String|Number} dateLeft - the first date to compare
 * @param {Date|String|Number} dateRight - the second date to compare
 * @returns {Number} the result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989 reverse chronologically:
 * var result = compareDesc(
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * )
 * //=> 1
 *
 * @example
 * // Sort the array of dates in reverse chronological order:
 * var result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareDesc)
 * //=> [
 * //   Sun Jul 02 1995 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Wed Feb 11 1987 00:00:00
 * // ]
 */
function compareDesc(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var timeLeft = dateLeft.getTime();
  var dateRight = parse(dirtyDateRight);
  var timeRight = dateRight.getTime();

  if (timeLeft > timeRight) {
    return -1;
  } else if (timeLeft < timeRight) {
    return 1;
  } else {
    return 0;
  }
}

module.exports = compareDesc;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var differenceInCalendarMonths = __webpack_require__(48);
var compareAsc = __webpack_require__(12);

/**
 * @category Month Helpers
 * @summary Get the number of full months between the given dates.
 *
 * @description
 * Get the number of full months between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of full months
 *
 * @example
 * // How many full months are between 31 January 2014 and 1 September 2014?
 * var result = differenceInMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 7
 */
function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);

  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
  dateLeft.setMonth(dateLeft.getMonth() - sign * difference);

  // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
  // If so, result must be decreased by 1 in absolute value
  var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;
  return sign * (difference - isLastMonthNotFull);
}

module.exports = differenceInMonths;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var differenceInMilliseconds = __webpack_require__(21);

/**
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of seconds
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * var result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds(dirtyDateLeft, dirtyDateRight) {
  var diff = differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) / 1000;
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

module.exports = differenceInSeconds;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var buildDistanceInWordsLocale = __webpack_require__(105);
var buildFormatLocale = __webpack_require__(106);

/**
 * @category Locales
 * @summary English locale.
 */
module.exports = {
  distanceInWords: buildDistanceInWordsLocale(),
  format: buildFormatLocale()
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of a day
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * var result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */
function endOfDay(dirtyDate) {
  var date = parse(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

module.exports = endOfDay;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var startOfISOWeek = __webpack_require__(6);
var startOfISOYear = __webpack_require__(11);

var MILLISECONDS_IN_WEEK = 604800000;

/**
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the ISO week
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * var result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(dirtyDate) {
  var date = parse(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOYear(date).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

module.exports = getISOWeek;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var startOfWeek = __webpack_require__(18);

/**
 * @category Week Helpers
 * @summary Are the given dates in the same week?
 *
 * @description
 * Are the given dates in the same week?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Boolean} the dates are in the same week
 *
 * @example
 * // Are 31 August 2014 and 4 September 2014 in the same week?
 * var result = isSameWeek(
 *   new Date(2014, 7, 31),
 *   new Date(2014, 8, 4)
 * )
 * //=> true
 *
 * @example
 * // If week starts with Monday,
 * // are 31 August 2014 and 4 September 2014 in the same week?
 * var result = isSameWeek(
 *   new Date(2014, 7, 31),
 *   new Date(2014, 8, 4),
 *   {weekStartsOn: 1}
 * )
 * //=> false
 */
function isSameWeek(dirtyDateLeft, dirtyDateRight, dirtyOptions) {
  var dateLeftStartOfWeek = startOfWeek(dirtyDateLeft, dirtyOptions);
  var dateRightStartOfWeek = startOfWeek(dirtyDateRight, dirtyOptions);

  return dateLeftStartOfWeek.getTime() === dateRightStartOfWeek.getTime();
}

module.exports = isSameWeek;

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return repeat; });


var repeat = String.prototype.repeat && function (count, self) {
    return self.repeat(count);
} || function (count, self) {
    if (self.length == 0 || count == 0) {
        return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (self.length * count >= 1 << 28) {
        throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (;;) {
        if ((count & 1) == 1) {
            rpt += self;
        }
        count >>>= 1;
        if (count == 0) {
            break;
        }
        self += self;
    }
    return rpt;
};


/* repeat Not a pure module */

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export init */
/* unused harmony export make_matrix */
/* unused harmony export create_matrix */
/* unused harmony export append */
/* unused harmony export concat */
/* unused harmony export sub */
/* unused harmony export copy */
/* unused harmony export fill */
/* unused harmony export blit */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return to_list; });
/* unused harmony export of_list */
/* unused harmony export iter */
/* unused harmony export map */
/* unused harmony export iteri */
/* unused harmony export mapi */
/* unused harmony export fold_left */
/* unused harmony export fold_right */
/* unused harmony export sort */
/* unused harmony export stable_sort */
/* unused harmony export fast_sort */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__js_exn_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__caml_array_js__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__caml_exceptions_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__ = __webpack_require__(1);








function init(l, f) {
  if (l) {
    if (l < 0) {
      throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["e" /* invalid_argument */], "Array.init"];
    } else {
      var res = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["f" /* caml_make_vect */](l, __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, 0));
      for (var i = 1, i_finish = l - 1 | 0; i <= i_finish; ++i) {
        res[i] = __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, i);
      }
      return res;
    }
  } else {
    return (/* array */[]
    );
  }
}

function make_matrix(sx, sy, init) {
  var res = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["f" /* caml_make_vect */](sx, /* array */[]);
  for (var x = 0, x_finish = sx - 1 | 0; x <= x_finish; ++x) {
    res[x] = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["f" /* caml_make_vect */](sy, init);
  }
  return res;
}

function copy(a) {
  var l = a.length;
  if (l) {
    return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["e" /* caml_array_sub */](a, 0, l);
  } else {
    return (/* array */[]
    );
  }
}

function append(a1, a2) {
  var l1 = a1.length;
  if (l1) {
    if (a2.length) {
      return a1.concat(a2);
    } else {
      return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["e" /* caml_array_sub */](a1, 0, l1);
    }
  } else {
    return copy(a2);
  }
}

function sub(a, ofs, len) {
  if (len < 0 || ofs > (a.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["e" /* invalid_argument */], "Array.sub"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["e" /* caml_array_sub */](a, ofs, len);
  }
}

function fill(a, ofs, len, v) {
  if (ofs < 0 || len < 0 || ofs > (a.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["e" /* invalid_argument */], "Array.fill"];
  } else {
    for (var i = ofs, i_finish = (ofs + len | 0) - 1 | 0; i <= i_finish; ++i) {
      a[i] = v;
    }
    return (/* () */0
    );
  }
}

function blit(a1, ofs1, a2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (a1.length - len | 0) || ofs2 < 0 || ofs2 > (a2.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["e" /* invalid_argument */], "Array.blit"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["a" /* caml_array_blit */](a1, ofs1, a2, ofs2, len);
  }
}

function iter(f, a) {
  for (var i = 0, i_finish = a.length - 1 | 0; i <= i_finish; ++i) {
    __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, a[i]);
  }
  return (/* () */0
  );
}

function map(f, a) {
  var l = a.length;
  if (l) {
    var r = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["f" /* caml_make_vect */](l, __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, a[0]));
    for (var i = 1, i_finish = l - 1 | 0; i <= i_finish; ++i) {
      r[i] = __WEBPACK_IMPORTED_MODULE_0__curry_js__["a" /* _1 */](f, a[i]);
    }
    return r;
  } else {
    return (/* array */[]
    );
  }
}

function iteri(f, a) {
  for (var i = 0, i_finish = a.length - 1 | 0; i <= i_finish; ++i) {
    __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, i, a[i]);
  }
  return (/* () */0
  );
}

function mapi(f, a) {
  var l = a.length;
  if (l) {
    var r = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["f" /* caml_make_vect */](l, __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, 0, a[0]));
    for (var i = 1, i_finish = l - 1 | 0; i <= i_finish; ++i) {
      r[i] = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, i, a[i]);
    }
    return r;
  } else {
    return (/* array */[]
    );
  }
}

function to_list(a) {
  var _i = a.length - 1 | 0;
  var _res = /* [] */0;
  while (true) {
    var res = _res;
    var i = _i;
    if (i < 0) {
      return res;
    } else {
      _res = /* :: */[a[i], res];
      _i = i - 1 | 0;
      continue;
    }
  };
}

function list_length(_accu, _param) {
  while (true) {
    var param = _param;
    var accu = _accu;
    if (param) {
      _param = param[1];
      _accu = accu + 1 | 0;
      continue;
    } else {
      return accu;
    }
  };
}

function of_list(l) {
  if (l) {
    var a = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["f" /* caml_make_vect */](list_length(0, l), l[0]);
    var _i = 1;
    var _param = l[1];
    while (true) {
      var param = _param;
      var i = _i;
      if (param) {
        a[i] = param[0];
        _param = param[1];
        _i = i + 1 | 0;
        continue;
      } else {
        return a;
      }
    };
  } else {
    return (/* array */[]
    );
  }
}

function fold_left(f, x, a) {
  var r = x;
  for (var i = 0, i_finish = a.length - 1 | 0; i <= i_finish; ++i) {
    r = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, r, a[i]);
  }
  return r;
}

function fold_right(f, a, x) {
  var r = x;
  for (var i = a.length - 1 | 0; i >= 0; --i) {
    r = __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](f, a[i], r);
  }
  return r;
}

var Bottom = __WEBPACK_IMPORTED_MODULE_3__caml_exceptions_js__["a" /* create */]("Array.Bottom");

function sort(cmp, a) {
  var maxson = function (l, i) {
    var i31 = ((i + i | 0) + i | 0) + 1 | 0;
    var x = i31;
    if ((i31 + 2 | 0) < l) {
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i31), __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i31 + 1 | 0)) < 0) {
        x = i31 + 1 | 0;
      }
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, x), __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i31 + 2 | 0)) < 0) {
        x = i31 + 2 | 0;
      }
      return x;
    } else if ((i31 + 1 | 0) < l && __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i31), __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i31 + 1 | 0)) < 0) {
      return i31 + 1 | 0;
    } else if (i31 < l) {
      return i31;
    } else {
      throw [Bottom, i];
    }
  };
  var trickle = function (l, i, e) {
    try {
      var l$1 = l;
      var _i = i;
      var e$1 = e;
      while (true) {
        var i$1 = _i;
        var j = maxson(l$1, i$1);
        if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, j), e$1) > 0) {
          __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, i$1, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, j));
          _i = j;
          continue;
        } else {
          return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, i$1, e$1);
        }
      };
    } catch (raw_exn) {
      var exn = __WEBPACK_IMPORTED_MODULE_1__js_exn_js__["a" /* internalToOCamlException */](raw_exn);
      if (exn[0] === Bottom) {
        return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, exn[1], e);
      } else {
        throw exn;
      }
    }
  };
  var bubble = function (l, i) {
    try {
      var l$1 = l;
      var _i = i;
      while (true) {
        var i$1 = _i;
        var j = maxson(l$1, i$1);
        __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, i$1, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, j));
        _i = j;
        continue;
      };
    } catch (raw_exn) {
      var exn = __WEBPACK_IMPORTED_MODULE_1__js_exn_js__["a" /* internalToOCamlException */](raw_exn);
      if (exn[0] === Bottom) {
        return exn[1];
      } else {
        throw exn;
      }
    }
  };
  var trickleup = function (_i, e) {
    while (true) {
      var i = _i;
      var father = (i - 1 | 0) / 3 | 0;
      if (i === father) {
        throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["a" /* assert_failure */], ["array.ml", 168, 4]];
      }
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, father), e) < 0) {
        __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, i, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, father));
        if (father > 0) {
          _i = father;
          continue;
        } else {
          return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, 0, e);
        }
      } else {
        return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, i, e);
      }
    };
  };
  var l = a.length;
  for (var i = ((l + 1 | 0) / 3 | 0) - 1 | 0; i >= 0; --i) {
    trickle(l, i, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i));
  }
  for (var i$1 = l - 1 | 0; i$1 >= 2; --i$1) {
    var e = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i$1);
    __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, i$1, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, 0));
    trickleup(bubble(i$1, 0), e);
  }
  if (l > 1) {
    var e$1 = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, 1);
    __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, 1, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, 0));
    return __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](a, 0, e$1);
  } else {
    return 0;
  }
}

function stable_sort(cmp, a) {
  var merge = function (src1ofs, src1len, src2, src2ofs, src2len, dst, dstofs) {
    var src1r = src1ofs + src1len | 0;
    var src2r = src2ofs + src2len | 0;
    var _i1 = src1ofs;
    var _s1 = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, src1ofs);
    var _i2 = src2ofs;
    var _s2 = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](src2, src2ofs);
    var _d = dstofs;
    while (true) {
      var d = _d;
      var s2 = _s2;
      var i2 = _i2;
      var s1 = _s1;
      var i1 = _i1;
      if (__WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, s1, s2) <= 0) {
        __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](dst, d, s1);
        var i1$1 = i1 + 1 | 0;
        if (i1$1 < src1r) {
          _d = d + 1 | 0;
          _s1 = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, i1$1);
          _i1 = i1$1;
          continue;
        } else {
          return blit(src2, i2, dst, d + 1 | 0, src2r - i2 | 0);
        }
      } else {
        __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](dst, d, s2);
        var i2$1 = i2 + 1 | 0;
        if (i2$1 < src2r) {
          _d = d + 1 | 0;
          _s2 = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](src2, i2$1);
          _i2 = i2$1;
          continue;
        } else {
          return blit(a, i1, dst, d + 1 | 0, src1r - i1 | 0);
        }
      }
    };
  };
  var isortto = function (srcofs, dst, dstofs, len) {
    for (var i = 0, i_finish = len - 1 | 0; i <= i_finish; ++i) {
      var e = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, srcofs + i | 0);
      var j = (dstofs + i | 0) - 1 | 0;
      while (j >= dstofs && __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](cmp, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](dst, j), e) > 0) {
        __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](dst, j + 1 | 0, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](dst, j));
        j = j - 1 | 0;
      };
      __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["d" /* caml_array_set */](dst, j + 1 | 0, e);
    }
    return (/* () */0
    );
  };
  var sortto = function (srcofs, dst, dstofs, len) {
    if (len <= 5) {
      return isortto(srcofs, dst, dstofs, len);
    } else {
      var l1 = len / 2 | 0;
      var l2 = len - l1 | 0;
      sortto(srcofs + l1 | 0, dst, dstofs + l1 | 0, l2);
      sortto(srcofs, a, srcofs + l2 | 0, l1);
      return merge(srcofs + l2 | 0, l1, dst, dstofs + l1 | 0, l2, dst, dstofs);
    }
  };
  var l = a.length;
  if (l <= 5) {
    return isortto(0, a, 0, l);
  } else {
    var l1 = l / 2 | 0;
    var l2 = l - l1 | 0;
    var t = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["f" /* caml_make_vect */](l2, __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["c" /* caml_array_get */](a, 0));
    sortto(l1, t, 0, l2);
    sortto(0, a, l2, l1);
    return merge(l2, l1, t, 0, l2, a, 0);
  }
}

var create_matrix = make_matrix;

var concat = __WEBPACK_IMPORTED_MODULE_2__caml_array_js__["b" /* caml_array_concat */];

var fast_sort = stable_sort;


/* No side effect */

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export $$Error */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return internalToOCamlException; });
/* unused harmony export raiseError */
/* unused harmony export raiseEvalError */
/* unused harmony export raiseRangeError */
/* unused harmony export raiseReferenceError */
/* unused harmony export raiseSyntaxError */
/* unused harmony export raiseTypeError */
/* unused harmony export raiseUriError */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_exceptions_js__ = __webpack_require__(16);




var $$Error = __WEBPACK_IMPORTED_MODULE_0__caml_exceptions_js__["a" /* create */]("Js_exn.Error");

function internalToOCamlException(e) {
  if (__WEBPACK_IMPORTED_MODULE_0__caml_exceptions_js__["b" /* isCamlExceptionOrOpenVariant */](e)) {
    return e;
  } else {
    return [$$Error, e];
  }
}

function raiseError(str) {
  throw new Error(str);
}

function raiseEvalError(str) {
  throw new EvalError(str);
}

function raiseRangeError(str) {
  throw new RangeError(str);
}

function raiseReferenceError(str) {
  throw new ReferenceError(str);
}

function raiseSyntaxError(str) {
  throw new SyntaxError(str);
}

function raiseTypeError(str) {
  throw new TypeError(str);
}

function raiseUriError(str) {
  throw new URIError(str);
}


/* No side effect */

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export make */
/* unused harmony export init */
/* unused harmony export copy */
/* unused harmony export sub */
/* unused harmony export fill */
/* unused harmony export blit */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return concat; });
/* unused harmony export iter */
/* unused harmony export iteri */
/* unused harmony export map */
/* unused harmony export mapi */
/* unused harmony export trim */
/* unused harmony export escaped */
/* unused harmony export index */
/* unused harmony export rindex */
/* unused harmony export index_from */
/* unused harmony export rindex_from */
/* unused harmony export contains */
/* unused harmony export contains_from */
/* unused harmony export rcontains_from */
/* unused harmony export uppercase */
/* unused harmony export lowercase */
/* unused harmony export capitalize */
/* unused harmony export uncapitalize */
/* unused harmony export compare */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bytes_js__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__caml_int32_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__caml_string_js__ = __webpack_require__(15);







function make(n, c) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["n" /* make */](n, c));
}

function init(n, f) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["j" /* init */](n, f));
}

function copy(s) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["e" /* copy */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
}

function sub(s, ofs, len) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["t" /* sub */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), ofs, len));
}

function concat(sep, l) {
  if (l) {
    var hd = l[0];
    var num = [0];
    var len = [0];
    __WEBPACK_IMPORTED_MODULE_0__list_js__["e" /* iter */](function (s) {
      num[0] = num[0] + 1 | 0;
      len[0] = len[0] + s.length | 0;
      return (/* () */0
      );
    }, l);
    var r = __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["e" /* caml_create_string */](len[0] + __WEBPACK_IMPORTED_MODULE_2__caml_int32_js__["b" /* imul */](sep.length, num[0] - 1 | 0) | 0);
    __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["d" /* caml_blit_string */](hd, 0, r, 0, hd.length);
    var pos = [hd.length];
    __WEBPACK_IMPORTED_MODULE_0__list_js__["e" /* iter */](function (s) {
      __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["d" /* caml_blit_string */](sep, 0, r, pos[0], sep.length);
      pos[0] = pos[0] + sep.length | 0;
      __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["d" /* caml_blit_string */](s, 0, r, pos[0], s.length);
      pos[0] = pos[0] + s.length | 0;
      return (/* () */0
      );
    }, l[1]);
    return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](r);
  } else {
    return "";
  }
}

function iter(f, s) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["k" /* iter */](f, __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s));
}

function iteri(f, s) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["l" /* iteri */](f, __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s));
}

function map(f, s) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["o" /* map */](f, __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
}

function mapi(f, s) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["p" /* mapi */](f, __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
}

function is_space(param) {
  var switcher = param - 9 | 0;
  if (switcher > 4 || switcher < 0) {
    if (switcher !== 23) {
      return (/* false */0
      );
    } else {
      return (/* true */1
      );
    }
  } else if (switcher !== 2) {
    return (/* true */1
    );
  } else {
    return (/* false */0
    );
  }
}

function trim(s) {
  if (s === "" || !(is_space(s.charCodeAt(0)) || is_space(s.charCodeAt(s.length - 1 | 0)))) {
    return s;
  } else {
    return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["u" /* trim */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
  }
}

function escaped(s) {
  var needs_escape = function (_i) {
    while (true) {
      var i = _i;
      if (i >= s.length) {
        return (/* false */0
        );
      } else {
        var match = s.charCodeAt(i);
        if (match >= 32) {
          var switcher = match - 34 | 0;
          if (switcher > 58 || switcher < 0) {
            if (switcher >= 93) {
              return (/* true */1
              );
            } else {
              _i = i + 1 | 0;
              continue;
            }
          } else if (switcher > 57 || switcher < 1) {
            return (/* true */1
            );
          } else {
            _i = i + 1 | 0;
            continue;
          }
        } else {
          return (/* true */1
          );
        }
      }
    };
  };
  if (needs_escape(0)) {
    return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["f" /* escaped */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
  } else {
    return s;
  }
}

function index(s, c) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["h" /* index */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), c);
}

function rindex(s, c) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["r" /* rindex */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), c);
}

function index_from(s, i, c) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["i" /* index_from */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), i, c);
}

function rindex_from(s, i, c) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["s" /* rindex_from */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), i, c);
}

function contains(s, c) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["c" /* contains */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), c);
}

function contains_from(s, i, c) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["d" /* contains_from */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), i, c);
}

function rcontains_from(s, i, c) {
  return __WEBPACK_IMPORTED_MODULE_1__bytes_js__["q" /* rcontains_from */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s), i, c);
}

function uppercase(s) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["w" /* uppercase */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
}

function lowercase(s) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["m" /* lowercase */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
}

function capitalize(s) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["b" /* capitalize */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
}

function uncapitalize(s) {
  return __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["b" /* bytes_to_string */](__WEBPACK_IMPORTED_MODULE_1__bytes_js__["v" /* uncapitalize */](__WEBPACK_IMPORTED_MODULE_3__caml_string_js__["a" /* bytes_of_string */](s)));
}

var compare = __WEBPACK_IMPORTED_MODULE_3__caml_string_js__["g" /* caml_string_compare */];

var fill = __WEBPACK_IMPORTED_MODULE_1__bytes_js__["g" /* fill */];

var blit = __WEBPACK_IMPORTED_MODULE_1__bytes_js__["a" /* blit_string */];


/* No side effect */

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return none; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return batch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return call; });
/* unused harmony export fnMsg */
/* unused harmony export msg */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return run; });
/* unused harmony export map */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vdom_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__ = __webpack_require__(2);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE







function batch(cmds) {
  return (/* Batch */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [cmds])
  );
}

function call(call$1) {
  return (/* EnqueueCall */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](2, [call$1])
  );
}

function fnMsg(fnMsg$1) {
  return (/* EnqueueCall */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](2, [function (callbacks) {
      return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](callbacks[0][/* enqueue */0], __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](fnMsg$1, /* () */0));
    }])
  );
}

function msg(msg$1) {
  return (/* EnqueueCall */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](2, [function (callbacks) {
      return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](callbacks[0][/* enqueue */0], msg$1);
    }])
  );
}

function run(callbacks, param) {
  if (typeof param === "number") {
    return (/* () */0
    );
  } else {
    switch (param.tag | 0) {
      case 1:
        return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["c" /* fold_left */](function (_, cmd) {
          return run(callbacks, cmd);
        }, /* () */0, param[0]);
      case 0:
      case 2:
        return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[0], callbacks);

    }
  }
}

function map(func, cmd) {
  return (/* Tagger */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, [function (callbacks) {
      return run(__WEBPACK_IMPORTED_MODULE_1__vdom_js__["j" /* wrapCallbacks */](func, callbacks), cmd);
    }])
  );
}

var none = /* NoCmd */0;


/* No side effect */

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return none; });
/* unused harmony export batch */
/* unused harmony export registration */
/* unused harmony export map */
/* unused harmony export mapFunc */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return run; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__ = __webpack_require__(2);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE






function batch(subs) {
  return (/* Batch */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](0, [subs])
  );
}

function registration(key, enableCall) {
  return (/* Registration */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](1, [key, function (callbacks) {
      return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](enableCall, callbacks[0]);
    }, [/* None */0]])
  );
}

function map(msgMapper, sub) {
  var func = function (callbacks) {
    return [/* record */[/* enqueue */function (userMsg) {
      return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](callbacks[0][/* enqueue */0], __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](msgMapper, userMsg));
    }]];
  };
  return (/* Mapper */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](2, [func, sub])
  );
}

function mapFunc(func, sub) {
  return (/* Mapper */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](2, [func, sub])
  );
}

function run(oldCallbacks, newCallbacks, oldSub, newSub) {
  var enable = function (_callbacks, _param) {
    while (true) {
      var param = _param;
      var callbacks = _callbacks;
      if (typeof param === "number") {
        return (/* () */0
        );
      } else {
        switch (param.tag | 0) {
          case 0:
            var subs = param[0];
            if (subs) {
              return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["e" /* iter */](function (callbacks) {
                return function (param) {
                  return enable(callbacks, param);
                };
              }(callbacks), subs);
            } else {
              return (/* () */0
              );
            }
          case 1:
            param[2][0] = /* Some */[__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[1], callbacks)];
            return (/* () */0
            );
          case 2:
            var subCallbacks = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[0], callbacks);
            _param = param[1];
            _callbacks = subCallbacks;
            continue;

        }
      }
    };
  };
  var disable = function (_callbacks, _param) {
    while (true) {
      var param = _param;
      var callbacks = _callbacks;
      if (typeof param === "number") {
        return (/* () */0
        );
      } else {
        switch (param.tag | 0) {
          case 0:
            var subs = param[0];
            if (subs) {
              return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["e" /* iter */](function (callbacks) {
                return function (param) {
                  return disable(callbacks, param);
                };
              }(callbacks), subs);
            } else {
              return (/* () */0
              );
            }
          case 1:
            var diCB = param[2];
            var match = diCB[0];
            if (match) {
              diCB[0] = /* None */0;
              return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](match[0], /* () */0);
            } else {
              return (/* () */0
              );
            }
          case 2:
            var subCallbacks = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[0], callbacks);
            _param = param[1];
            _callbacks = subCallbacks;
            continue;

        }
      }
    };
  };
  var exit = 0;
  if (typeof oldSub === "number") {
    if (typeof newSub === "number") {
      return newSub;
    } else {
      exit = 1;
    }
  } else {
    switch (oldSub.tag | 0) {
      case 0:
        if (typeof newSub === "number") {
          exit = 1;
        } else if (newSub.tag) {
          exit = 1;
        } else {
          var aux = function (_oldList, _newList) {
            while (true) {
              var newList = _newList;
              var oldList = _oldList;
              if (oldList) {
                var oldRest = oldList[1];
                var oldSubSub = oldList[0];
                if (newList) {
                  run(oldCallbacks, newCallbacks, oldSubSub, newList[0]);
                  _newList = newList[1];
                  _oldList = oldRest;
                  continue;
                } else {
                  disable(oldCallbacks, oldSubSub);
                  _newList = /* [] */0;
                  _oldList = oldRest;
                  continue;
                }
              } else if (newList) {
                enable(newCallbacks, newList[0]);
                _newList = newList[1];
                _oldList = /* [] */0;
                continue;
              } else {
                return (/* () */0
                );
              }
            };
          };
          aux(oldSub[0], newSub[0]);
          return newSub;
        }
        break;
      case 1:
        if (typeof newSub === "number") {
          exit = 1;
        } else if (newSub.tag === 1) {
          if (oldSub[0] === newSub[0]) {
            newSub[2][0] = oldSub[2][0];
            return newSub;
          } else {
            exit = 1;
          }
        } else {
          exit = 1;
        }
        break;
      case 2:
        if (typeof newSub === "number") {
          exit = 1;
        } else if (newSub.tag === 2) {
          var olderCallbacks = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](oldSub[0], oldCallbacks);
          var newerCallbacks = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](newSub[0], newCallbacks);
          run(olderCallbacks, newerCallbacks, oldSub[1], newSub[1]);
          return newSub;
        } else {
          exit = 1;
        }
        break;

    }
  }
  if (exit === 1) {
    disable(oldCallbacks, oldSub);
    enable(newCallbacks, newSub);
    return newSub;
  }
}

var none = /* NoSub */0;


/* No side effect */

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var addMilliseconds = __webpack_require__(10);

var MILLISECONDS_IN_HOUR = 3600000;

/**
 * @category Hour Helpers
 * @summary Add the specified number of hours to the given date.
 *
 * @description
 * Add the specified number of hours to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of hours to be added
 * @returns {Date} the new date with the hours added
 *
 * @example
 * // Add 2 hours to 10 July 2014 23:00:00:
 * var result = addHours(new Date(2014, 6, 10, 23, 0), 2)
 * //=> Fri Jul 11 2014 01:00:00
 */
function addHours(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_HOUR);
}

module.exports = addHours;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var getISOYear = __webpack_require__(5);
var setISOYear = __webpack_require__(42);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Add the specified number of ISO week-numbering years to the given date.
 *
 * @description
 * Add the specified number of ISO week-numbering years to the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of ISO week-numbering years to be added
 * @returns {Date} the new date with the ISO week-numbering years added
 *
 * @example
 * // Add 5 ISO week-numbering years to 2 July 2010:
 * var result = addISOYears(new Date(2010, 6, 2), 5)
 * //=> Fri Jun 26 2015 00:00:00
 */
function addISOYears(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return setISOYear(dirtyDate, getISOYear(dirtyDate) + amount);
}

module.exports = addISOYears;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var startOfISOYear = __webpack_require__(11);
var differenceInCalendarDays = __webpack_require__(19);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Set the ISO week-numbering year to the given date.
 *
 * @description
 * Set the ISO week-numbering year to the given date,
 * saving the week number and the weekday number.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} isoYear - the ISO week-numbering year of the new date
 * @returns {Date} the new date with the ISO week-numbering year setted
 *
 * @example
 * // Set ISO week-numbering year 2007 to 29 December 2008:
 * var result = setISOYear(new Date(2008, 11, 29), 2007)
 * //=> Mon Jan 01 2007 00:00:00
 */
function setISOYear(dirtyDate, dirtyISOYear) {
  var date = parse(dirtyDate);
  var isoYear = Number(dirtyISOYear);
  var diff = differenceInCalendarDays(date, startOfISOYear(date));
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setFullYear(isoYear, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  date = startOfISOYear(fourthOfJanuary);
  date.setDate(date.getDate() + diff);
  return date;
}

module.exports = setISOYear;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var addMilliseconds = __webpack_require__(10);

var MILLISECONDS_IN_MINUTE = 60000;

/**
 * @category Minute Helpers
 * @summary Add the specified number of minutes to the given date.
 *
 * @description
 * Add the specified number of minutes to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of minutes to be added
 * @returns {Date} the new date with the minutes added
 *
 * @example
 * // Add 30 minutes to 10 July 2014 12:00:00:
 * var result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 12:30:00
 */
function addMinutes(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
}

module.exports = addMinutes;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var addMonths = __webpack_require__(20);

/**
 * @category Quarter Helpers
 * @summary Add the specified number of year quarters to the given date.
 *
 * @description
 * Add the specified number of year quarters to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of quarters to be added
 * @returns {Date} the new date with the quarters added
 *
 * @example
 * // Add 1 quarter to 1 September 2014:
 * var result = addQuarters(new Date(2014, 8, 1), 1)
 * //=> Mon Dec 01 2014 00:00:00
 */
function addQuarters(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  var months = amount * 3;
  return addMonths(dirtyDate, months);
}

module.exports = addQuarters;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var addMilliseconds = __webpack_require__(10);

/**
 * @category Second Helpers
 * @summary Add the specified number of seconds to the given date.
 *
 * @description
 * Add the specified number of seconds to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of seconds to be added
 * @returns {Date} the new date with the seconds added
 *
 * @example
 * // Add 30 seconds to 10 July 2014 12:45:00:
 * var result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
 * //=> Thu Jul 10 2014 12:45:30
 */
function addSeconds(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * 1000);
}

module.exports = addSeconds;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var addMonths = __webpack_require__(20);

/**
 * @category Year Helpers
 * @summary Add the specified number of years to the given date.
 *
 * @description
 * Add the specified number of years to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of years to be added
 * @returns {Date} the new date with the years added
 *
 * @example
 * // Add 5 years to 1 September 2014:
 * var result = addYears(new Date(2014, 8, 1), 5)
 * //=> Sun Sep 01 2019 00:00:00
 */
function addYears(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addMonths(dirtyDate, amount * 12);
}

module.exports = addYears;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var getISOYear = __webpack_require__(5);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the number of calendar ISO week-numbering years between the given dates.
 *
 * @description
 * Get the number of calendar ISO week-numbering years between the given dates.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar ISO week-numbering years
 *
 * @example
 * // How many calendar ISO week-numbering years are 1 January 2010 and 1 January 2012?
 * var result = differenceInCalendarISOYears(
 *   new Date(2012, 0, 1),
 *   new Date(2010, 0, 1)
 * )
 * //=> 2
 */
function differenceInCalendarISOYears(dirtyDateLeft, dirtyDateRight) {
  return getISOYear(dirtyDateLeft) - getISOYear(dirtyDateRight);
}

module.exports = differenceInCalendarISOYears;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Get the number of calendar months between the given dates.
 *
 * @description
 * Get the number of calendar months between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar months
 *
 * @example
 * // How many calendar months are between 31 January 2014 and 1 September 2014?
 * var result = differenceInCalendarMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 8
 */
function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);

  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var monthDiff = dateLeft.getMonth() - dateRight.getMonth();

  return yearDiff * 12 + monthDiff;
}

module.exports = differenceInCalendarMonths;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Quarter Helpers
 * @summary Get the year quarter of the given date.
 *
 * @description
 * Get the year quarter of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the quarter
 *
 * @example
 * // Which quarter is 2 July 2014?
 * var result = getQuarter(new Date(2014, 6, 2))
 * //=> 3
 */
function getQuarter(dirtyDate) {
  var date = parse(dirtyDate);
  var quarter = Math.floor(date.getMonth() / 3) + 1;
  return quarter;
}

module.exports = getQuarter;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Get the number of calendar years between the given dates.
 *
 * @description
 * Get the number of calendar years between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar years
 *
 * @example
 * // How many calendar years are between 31 December 2013 and 11 February 2015?
 * var result = differenceInCalendarYears(
 *   new Date(2015, 1, 11),
 *   new Date(2013, 11, 31)
 * )
 * //=> 2
 */
function differenceInCalendarYears(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);

  return dateLeft.getFullYear() - dateRight.getFullYear();
}

module.exports = differenceInCalendarYears;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var differenceInCalendarDays = __webpack_require__(19);
var compareAsc = __webpack_require__(12);

/**
 * @category Day Helpers
 * @summary Get the number of full days between the given dates.
 *
 * @description
 * Get the number of full days between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of full days
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * var result = differenceInDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 365
 */
function differenceInDays(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);

  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight));
  dateLeft.setDate(dateLeft.getDate() - sign * difference);

  // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
  // If so, result must be decreased by 1 in absolute value
  var isLastDayNotFull = compareAsc(dateLeft, dateRight) === -sign;
  return sign * (difference - isLastDayNotFull);
}

module.exports = differenceInDays;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var addISOYears = __webpack_require__(41);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Subtract the specified number of ISO week-numbering years from the given date.
 *
 * @description
 * Subtract the specified number of ISO week-numbering years from the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of ISO week-numbering years to be subtracted
 * @returns {Date} the new date with the ISO week-numbering years subtracted
 *
 * @example
 * // Subtract 5 ISO week-numbering years from 1 September 2014:
 * var result = subISOYears(new Date(2014, 8, 1), 5)
 * //=> Mon Aug 31 2009 00:00:00
 */
function subISOYears(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addISOYears(dirtyDate, -amount);
}

module.exports = subISOYears;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var compareDesc = __webpack_require__(26);
var parse = __webpack_require__(0);
var differenceInSeconds = __webpack_require__(28);
var differenceInMonths = __webpack_require__(27);
var enLocale = __webpack_require__(29);

var MINUTES_IN_DAY = 1440;
var MINUTES_IN_ALMOST_TWO_DAYS = 2520;
var MINUTES_IN_MONTH = 43200;
var MINUTES_IN_TWO_MONTHS = 86400;

/**
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words.
 *
 * | Distance between dates                                            | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance between dates | Result               |
 * |------------------------|----------------------|
 * | 0 secs ... 5 secs      | less than 5 seconds  |
 * | 5 secs ... 10 secs     | less than 10 seconds |
 * | 10 secs ... 20 secs    | less than 20 seconds |
 * | 20 secs ... 40 secs    | half a minute        |
 * | 40 secs ... 60 secs    | less than a minute   |
 * | 60 secs ... 90 secs    | 1 minute             |
 *
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @param {Date|String|Number} date - the other date
 * @param {Object} [options] - the object with options
 * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
 * @param {Boolean} [options.addSuffix=false] - result indicates if the second date is earlier or later than the first
 * @param {Object} [options.locale=enLocale] - the locale object
 * @returns {String} the distance in words
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * var result = distanceInWords(
 *   new Date(2014, 6, 2),
 *   new Date(2015, 0, 1)
 * )
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00, including seconds?
 * var result = distanceInWords(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0),
 *   {includeSeconds: true}
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * var result = distanceInWords(
 *   new Date(2016, 0, 1),
 *   new Date(2015, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'about 1 year ago'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * var eoLocale = require('date-fns/locale/eo')
 * var result = distanceInWords(
 *   new Date(2016, 7, 1),
 *   new Date(2015, 0, 1),
 *   {locale: eoLocale}
 * )
 * //=> 'pli ol 1 jaro'
 */
function distanceInWords(dirtyDateToCompare, dirtyDate, dirtyOptions) {
  var options = dirtyOptions || {};

  var comparison = compareDesc(dirtyDateToCompare, dirtyDate);

  var locale = options.locale;
  var localize = enLocale.distanceInWords.localize;
  if (locale && locale.distanceInWords && locale.distanceInWords.localize) {
    localize = locale.distanceInWords.localize;
  }

  var localizeOptions = {
    addSuffix: Boolean(options.addSuffix),
    comparison: comparison
  };

  var dateLeft, dateRight;
  if (comparison > 0) {
    dateLeft = parse(dirtyDateToCompare);
    dateRight = parse(dirtyDate);
  } else {
    dateLeft = parse(dirtyDate);
    dateRight = parse(dirtyDateToCompare);
  }

  var seconds = differenceInSeconds(dateRight, dateLeft);
  var offset = dateRight.getTimezoneOffset() - dateLeft.getTimezoneOffset();
  var minutes = Math.round(seconds / 60) - offset;
  var months;

  // 0 up to 2 mins
  if (minutes < 2) {
    if (options.includeSeconds) {
      if (seconds < 5) {
        return localize('lessThanXSeconds', 5, localizeOptions);
      } else if (seconds < 10) {
        return localize('lessThanXSeconds', 10, localizeOptions);
      } else if (seconds < 20) {
        return localize('lessThanXSeconds', 20, localizeOptions);
      } else if (seconds < 40) {
        return localize('halfAMinute', null, localizeOptions);
      } else if (seconds < 60) {
        return localize('lessThanXMinutes', 1, localizeOptions);
      } else {
        return localize('xMinutes', 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return localize('lessThanXMinutes', 1, localizeOptions);
      } else {
        return localize('xMinutes', minutes, localizeOptions);
      }
    }

    // 2 mins up to 0.75 hrs
  } else if (minutes < 45) {
    return localize('xMinutes', minutes, localizeOptions);

    // 0.75 hrs up to 1.5 hrs
  } else if (minutes < 90) {
    return localize('aboutXHours', 1, localizeOptions);

    // 1.5 hrs up to 24 hrs
  } else if (minutes < MINUTES_IN_DAY) {
    var hours = Math.round(minutes / 60);
    return localize('aboutXHours', hours, localizeOptions);

    // 1 day up to 1.75 days
  } else if (minutes < MINUTES_IN_ALMOST_TWO_DAYS) {
    return localize('xDays', 1, localizeOptions);

    // 1.75 days up to 30 days
  } else if (minutes < MINUTES_IN_MONTH) {
    var days = Math.round(minutes / MINUTES_IN_DAY);
    return localize('xDays', days, localizeOptions);

    // 1 month up to 2 months
  } else if (minutes < MINUTES_IN_TWO_MONTHS) {
    months = Math.round(minutes / MINUTES_IN_MONTH);
    return localize('aboutXMonths', months, localizeOptions);
  }

  months = differenceInMonths(dateRight, dateLeft);

  // 2 months up to 12 months
  if (months < 12) {
    var nearestMonth = Math.round(minutes / MINUTES_IN_MONTH);
    return localize('xMonths', nearestMonth, localizeOptions);

    // 1 year up to max Date
  } else {
    var monthsSinceStartOfYear = months % 12;
    var years = Math.floor(months / 12);

    // N years up to 1 years 3 months
    if (monthsSinceStartOfYear < 3) {
      return localize('aboutXYears', years, localizeOptions);

      // N years 3 months up to N years 9 months
    } else if (monthsSinceStartOfYear < 9) {
      return localize('overXYears', years, localizeOptions);

      // N years 9 months up to N year 12 months
    } else {
      return localize('almostXYears', years + 1, localizeOptions);
    }
  }
}

module.exports = distanceInWords;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Week Helpers
 * @summary Return the end of a week for the given date.
 *
 * @description
 * Return the end of a week for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the end of a week
 *
 * @example
 * // The end of a week for 2 September 2014 11:55:00:
 * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sat Sep 06 2014 23:59:59.999
 *
 * @example
 * // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
 * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
 * //=> Sun Sep 07 2014 23:59:59.999
 */
function endOfWeek(dirtyDate, dirtyOptions) {
  var weekStartsOn = dirtyOptions ? Number(dirtyOptions.weekStartsOn) || 0 : 0;

  var date = parse(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date;
}

module.exports = endOfWeek;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of a month
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * var result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfMonth(dirtyDate) {
  var date = parse(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

module.exports = endOfMonth;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var startOfYear = __webpack_require__(57);
var differenceInCalendarDays = __webpack_require__(19);

/**
 * @category Day Helpers
 * @summary Get the day of the year of the given date.
 *
 * @description
 * Get the day of the year of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the day of year
 *
 * @example
 * // Which day of the year is 2 July 2014?
 * var result = getDayOfYear(new Date(2014, 6, 2))
 * //=> 183
 */
function getDayOfYear(dirtyDate) {
  var date = parse(dirtyDate);
  var diff = differenceInCalendarDays(date, startOfYear(date));
  var dayOfYear = diff + 1;
  return dayOfYear;
}

module.exports = getDayOfYear;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Return the start of a year for the given date.
 *
 * @description
 * Return the start of a year for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a year
 *
 * @example
 * // The start of a year for 2 September 2014 11:55:00:
 * var result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Jan 01 2014 00:00:00
 */
function startOfYear(dirtyDate) {
  var cleanDate = parse(dirtyDate);
  var date = new Date(0);
  date.setFullYear(cleanDate.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfYear;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var isDate = __webpack_require__(23);

/**
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {Date} date - the date to check
 * @returns {Boolean} the date is valid
 * @throws {TypeError} argument must be an instance of Date
 *
 * @example
 * // For the valid date:
 * var result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the invalid date:
 * var result = isValid(new Date(''))
 * //=> false
 */
function isValid(dirtyDate) {
  if (isDate(dirtyDate)) {
    return !isNaN(dirtyDate);
  } else {
    throw new TypeError(toString.call(dirtyDate) + ' is not an instance of Date');
  }
}

module.exports = isValid;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Is the given date in the leap year?
 *
 * @description
 * Is the given date in the leap year?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in the leap year
 *
 * @example
 * // Is 1 September 2012 in the leap year?
 * var result = isLeapYear(new Date(2012, 8, 1))
 * //=> true
 */
function isLeapYear(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}

module.exports = isLeapYear;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Get the day of the ISO week of the given date.
 *
 * @description
 * Get the day of the ISO week of the given date,
 * which is 7 for Sunday, 1 for Monday etc.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the day of ISO week
 *
 * @example
 * // Which day of the ISO week is 26 February 2012?
 * var result = getISODay(new Date(2012, 1, 26))
 * //=> 7
 */
function getISODay(dirtyDate) {
  var date = parse(dirtyDate);
  var day = date.getDay();

  if (day === 0) {
    day = 7;
  }

  return day;
}

module.exports = getISODay;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var startOfHour = __webpack_require__(62);

/**
 * @category Hour Helpers
 * @summary Are the given dates in the same hour?
 *
 * @description
 * Are the given dates in the same hour?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same hour
 *
 * @example
 * // Are 4 September 2014 06:00:00 and 4 September 06:30:00 in the same hour?
 * var result = isSameHour(
 *   new Date(2014, 8, 4, 6, 0),
 *   new Date(2014, 8, 4, 6, 30)
 * )
 * //=> true
 */
function isSameHour(dirtyDateLeft, dirtyDateRight) {
  var dateLeftStartOfHour = startOfHour(dirtyDateLeft);
  var dateRightStartOfHour = startOfHour(dirtyDateRight);

  return dateLeftStartOfHour.getTime() === dateRightStartOfHour.getTime();
}

module.exports = isSameHour;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Hour Helpers
 * @summary Return the start of an hour for the given date.
 *
 * @description
 * Return the start of an hour for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of an hour
 *
 * @example
 * // The start of an hour for 2 September 2014 11:55:00:
 * var result = startOfHour(new Date(2014, 8, 2, 11, 55))
 * //=> Tue Sep 02 2014 11:00:00
 */
function startOfHour(dirtyDate) {
  var date = parse(dirtyDate);
  date.setMinutes(0, 0, 0);
  return date;
}

module.exports = startOfHour;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var isSameWeek = __webpack_require__(32);

/**
 * @category ISO Week Helpers
 * @summary Are the given dates in the same ISO week?
 *
 * @description
 * Are the given dates in the same ISO week?
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same ISO week
 *
 * @example
 * // Are 1 September 2014 and 7 September 2014 in the same ISO week?
 * var result = isSameISOWeek(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 8, 7)
 * )
 * //=> true
 */
function isSameISOWeek(dirtyDateLeft, dirtyDateRight) {
  return isSameWeek(dirtyDateLeft, dirtyDateRight, { weekStartsOn: 1 });
}

module.exports = isSameISOWeek;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var startOfISOYear = __webpack_require__(11);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Are the given dates in the same ISO week-numbering year?
 *
 * @description
 * Are the given dates in the same ISO week-numbering year?
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same ISO week-numbering year
 *
 * @example
 * // Are 29 December 2003 and 2 January 2005 in the same ISO week-numbering year?
 * var result = isSameISOYear(
 *   new Date(2003, 11, 29),
 *   new Date(2005, 0, 2)
 * )
 * //=> true
 */
function isSameISOYear(dirtyDateLeft, dirtyDateRight) {
  var dateLeftStartOfYear = startOfISOYear(dirtyDateLeft);
  var dateRightStartOfYear = startOfISOYear(dirtyDateRight);

  return dateLeftStartOfYear.getTime() === dateRightStartOfYear.getTime();
}

module.exports = isSameISOYear;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var startOfMinute = __webpack_require__(66);

/**
 * @category Minute Helpers
 * @summary Are the given dates in the same minute?
 *
 * @description
 * Are the given dates in the same minute?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same minute
 *
 * @example
 * // Are 4 September 2014 06:30:00 and 4 September 2014 06:30:15
 * // in the same minute?
 * var result = isSameMinute(
 *   new Date(2014, 8, 4, 6, 30),
 *   new Date(2014, 8, 4, 6, 30, 15)
 * )
 * //=> true
 */
function isSameMinute(dirtyDateLeft, dirtyDateRight) {
  var dateLeftStartOfMinute = startOfMinute(dirtyDateLeft);
  var dateRightStartOfMinute = startOfMinute(dirtyDateRight);

  return dateLeftStartOfMinute.getTime() === dateRightStartOfMinute.getTime();
}

module.exports = isSameMinute;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Minute Helpers
 * @summary Return the start of a minute for the given date.
 *
 * @description
 * Return the start of a minute for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a minute
 *
 * @example
 * // The start of a minute for 1 December 2014 22:15:45.400:
 * var result = startOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:00
 */
function startOfMinute(dirtyDate) {
  var date = parse(dirtyDate);
  date.setSeconds(0, 0);
  return date;
}

module.exports = startOfMinute;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Are the given dates in the same month?
 *
 * @description
 * Are the given dates in the same month?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same month
 *
 * @example
 * // Are 2 September 2014 and 25 September 2014 in the same month?
 * var result = isSameMonth(
 *   new Date(2014, 8, 2),
 *   new Date(2014, 8, 25)
 * )
 * //=> true
 */
function isSameMonth(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear() && dateLeft.getMonth() === dateRight.getMonth();
}

module.exports = isSameMonth;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var startOfQuarter = __webpack_require__(69);

/**
 * @category Quarter Helpers
 * @summary Are the given dates in the same year quarter?
 *
 * @description
 * Are the given dates in the same year quarter?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same quarter
 *
 * @example
 * // Are 1 January 2014 and 8 March 2014 in the same quarter?
 * var result = isSameQuarter(
 *   new Date(2014, 0, 1),
 *   new Date(2014, 2, 8)
 * )
 * //=> true
 */
function isSameQuarter(dirtyDateLeft, dirtyDateRight) {
  var dateLeftStartOfQuarter = startOfQuarter(dirtyDateLeft);
  var dateRightStartOfQuarter = startOfQuarter(dirtyDateRight);

  return dateLeftStartOfQuarter.getTime() === dateRightStartOfQuarter.getTime();
}

module.exports = isSameQuarter;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Quarter Helpers
 * @summary Return the start of a year quarter for the given date.
 *
 * @description
 * Return the start of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a quarter
 *
 * @example
 * // The start of a quarter for 2 September 2014 11:55:00:
 * var result = startOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Jul 01 2014 00:00:00
 */
function startOfQuarter(dirtyDate) {
  var date = parse(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3;
  date.setMonth(month, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfQuarter;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var startOfSecond = __webpack_require__(71);

/**
 * @category Second Helpers
 * @summary Are the given dates in the same second?
 *
 * @description
 * Are the given dates in the same second?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same second
 *
 * @example
 * // Are 4 September 2014 06:30:15.000 and 4 September 2014 06:30.15.500
 * // in the same second?
 * var result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 30, 15),
 *   new Date(2014, 8, 4, 6, 30, 15, 500)
 * )
 * //=> true
 */
function isSameSecond(dirtyDateLeft, dirtyDateRight) {
  var dateLeftStartOfSecond = startOfSecond(dirtyDateLeft);
  var dateRightStartOfSecond = startOfSecond(dirtyDateRight);

  return dateLeftStartOfSecond.getTime() === dateRightStartOfSecond.getTime();
}

module.exports = isSameSecond;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Second Helpers
 * @summary Return the start of a second for the given date.
 *
 * @description
 * Return the start of a second for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a second
 *
 * @example
 * // The start of a second for 1 December 2014 22:15:45.400:
 * var result = startOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:45.000
 */
function startOfSecond(dirtyDate) {
  var date = parse(dirtyDate);
  date.setMilliseconds(0);
  return date;
}

module.exports = startOfSecond;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Are the given dates in the same year?
 *
 * @description
 * Are the given dates in the same year?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same year
 *
 * @example
 * // Are 2 September 2014 and 25 September 2014 in the same year?
 * var result = isSameYear(
 *   new Date(2014, 8, 2),
 *   new Date(2014, 8, 25)
 * )
 * //=> true
 */
function isSameYear(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear();
}

module.exports = isSameYear;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Week Helpers
 * @summary Return the last day of a week for the given date.
 *
 * @description
 * Return the last day of a week for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the last day of a week
 *
 * @example
 * // The last day of a week for 2 September 2014 11:55:00:
 * var result = lastDayOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sat Sep 06 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the last day of the week for 2 September 2014 11:55:00:
 * var result = lastDayOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
 * //=> Sun Sep 07 2014 00:00:00
 */
function lastDayOfWeek(dirtyDate, dirtyOptions) {
  var weekStartsOn = dirtyOptions ? Number(dirtyOptions.weekStartsOn) || 0 : 0;

  var date = parse(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + diff);
  return date;
}

module.exports = lastDayOfWeek;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var getDaysInMonth = __webpack_require__(24);

/**
 * @category Month Helpers
 * @summary Set the month to the given date.
 *
 * @description
 * Set the month to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} month - the month of the new date
 * @returns {Date} the new date with the month setted
 *
 * @example
 * // Set February to 1 September 2014:
 * var result = setMonth(new Date(2014, 8, 1), 1)
 * //=> Sat Feb 01 2014 00:00:00
 */
function setMonth(dirtyDate, dirtyMonth) {
  var date = parse(dirtyDate);
  var month = Number(dirtyMonth);
  var year = date.getFullYear();
  var day = date.getDate();

  var dateWithDesiredMonth = new Date(0);
  dateWithDesiredMonth.setFullYear(year, month, 15);
  dateWithDesiredMonth.setHours(0, 0, 0, 0);
  var daysInMonth = getDaysInMonth(dateWithDesiredMonth);
  // Set the last day of the new month
  // if the original date was the last day of the longer month
  date.setMonth(month, Math.min(day, daysInMonth));
  return date;
}

module.exports = setMonth;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(76);


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Main_bs__ = __webpack_require__(77);


Object(__WEBPACK_IMPORTED_MODULE_0__Main_bs__["a" /* main */])(document.body);

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export decodeFromGoogleSheets */
/* unused harmony export decodeSlots */
/* unused harmony export initializeSlots */
/* unused harmony export toggleMenu */
/* unused harmony export setPage */
/* unused harmony export Room */
/* unused harmony export init */
/* unused harmony export safeFind */
/* unused harmony export update */
/* unused harmony export viewSlot */
/* unused harmony export viewUpcoming */
/* unused harmony export viewCurrent */
/* unused harmony export viewInfo */
/* unused harmony export viewSlotInfoForRoom */
/* unused harmony export viewMap */
/* unused harmony export view */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return main; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_array_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bucklescript_tea_src_tea_app_js__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_bucklescript_tea_src_tea_cmd_js__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_bucklescript_tea_src_tea_sub_js__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_date_fns__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_date_fns___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_date_fns__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_bs_platform_lib_es6_js_option_js__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_bs_platform_lib_es6_pervasives_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__ = __webpack_require__(196);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE

















function decodeFromGoogleSheets(json) {
  return (/* record */[
    /* name */__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](__WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["b" /* at */]( /* :: */["gsx$name",
    /* :: */["$t",
    /* [] */0]], __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["c" /* string */]), json),
    /* description */__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](__WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["b" /* at */]( /* :: */["gsx$description",
    /* :: */["$t",
    /* [] */0]], __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["c" /* string */]), json),
    /* start */new Date(__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](__WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["b" /* at */]( /* :: */["gsx$start",
    /* :: */["$t",
    /* [] */0]], __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["c" /* string */]), json)),
    /* roomName */__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](__WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["b" /* at */]( /* :: */["gsx$roomname",
    /* :: */["$t",
    /* [] */0]], __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["c" /* string */]), json),
    /* owner */__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](__WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["b" /* at */]( /* :: */["gsx$owner",
    /* :: */["$t",
    /* [] */0]], __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["c" /* string */]), json),
    /* ownerTwitter */__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](__WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["b" /* at */]( /* :: */["gsx$ownertwitter",
    /* :: */["$t",
    /* [] */0]], __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["c" /* string */]), json)]
  );
}

function decodeSlots(json) {
  return __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_array_js__["a" /* to_list */](__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](__WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["b" /* at */]( /* :: */["feed",
  /* :: */["entry",
  /* [] */0]], function (param) {
    return __WEBPACK_IMPORTED_MODULE_12_bs_json_src_Json_decode_js__["a" /* array */](decodeFromGoogleSheets, param);
  }), json));
}

function initializeSlots(param_0) {
  return (/* InitializeSlots */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, [param_0])
  );
}

function setPage(param_0) {
  return (/* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [param_0])
  );
}

var Room = /* module */[];

function init() {
  var initCmds = __WEBPACK_IMPORTED_MODULE_5_bucklescript_tea_src_tea_cmd_js__["b" /* call */](function (callbacks) {
    fetch("/dev_app.json").then(function (prim) {
      return prim.json();
    }).then(function (json) {
      console.log(json);
      __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](callbacks[0][/* enqueue */0], /* InitializeSlots */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, [decodeSlots(json)]));
      return Promise.resolve( /* () */0);
    });
    return (/* () */0
    );
  });
  return (/* tuple */[
    /* record */[
    /* slots : [] */0,
    /* rooms : :: */[
    /* record */[
    /* name */"Lesse",
    /* color */"#ccbdcf",
    /* x */30,
    /* y */2,
    /* width */16,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"LHomme",
    /* color */"#e2d3d4",
    /* x */54.5,
    /* y */6,
    /* width */18.5,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Semois",
    /* color */"#bfb15d",
    /* x */61,
    /* y */13,
    /* width */16,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Sambre",
    /* color */"#5555ff",
    /* x */7,
    /* y */45,
    /* width */16,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Meuse",
    /* color */"#d7b569",
    /* x */33,
    /* y */41,
    /* width */16,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Sambre et Meuse",
    /* color */"#3eaec7",
    /* x */6,
    /* y */88,
    /* width */33,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Wamme",
    /* color */"#d87d10",
    /* x */50,
    /* y */50,
    /* width */16,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Vesdre",
    /* color */"#d99367",
    /* x */40,
    /* y */90,
    /* width */16,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Ourthe",
    /* color */"#c1cac0",
    /* x */65,
    /* y */56,
    /* width */16,
    /* height */9],
    /* :: */[
    /* record */[
    /* name */"Ambleve",
    /* color */"#dcd07e",
    /* x */63,
    /* y */92,
    /* width */18,
    /* height */8],
    /* [] */0]]]]]]]]]],
    /* page : Map */[/* None */0],
    /* menuVisible : false */0], __WEBPACK_IMPORTED_MODULE_5_bucklescript_tea_src_tea_cmd_js__["a" /* batch */]( /* :: */[initCmds,
    /* [] */0])]
  );
}

function safeFind(f, l) {
  try {
    return (/* Some */[__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["b" /* find */](f, l)]
    );
  } catch (exn) {
    return (/* None */0
    );
  }
}

function update(model, param) {
  if (typeof param === "number") {
    return (/* tuple */[
      /* record */[
      /* slots */model[/* slots */0],
      /* rooms */model[/* rooms */1],
      /* page */model[/* page */2],
      /* menuVisible */1 - model[/* menuVisible */3]], __WEBPACK_IMPORTED_MODULE_5_bucklescript_tea_src_tea_cmd_js__["c" /* none */]]
    );
  } else if (param.tag) {
    return (/* tuple */[
      /* record */[
      /* slots */model[/* slots */0],
      /* rooms */model[/* rooms */1],
      /* page */param[0],
      /* menuVisible : false */0], __WEBPACK_IMPORTED_MODULE_5_bucklescript_tea_src_tea_cmd_js__["c" /* none */]]
    );
  } else {
    return (/* tuple */[
      /* record */[
      /* slots */param[0],
      /* rooms */model[/* rooms */1],
      /* page */model[/* page */2],
      /* menuVisible */model[/* menuVisible */3]], __WEBPACK_IMPORTED_MODULE_5_bucklescript_tea_src_tea_cmd_js__["c" /* none */]]
    );
  }
}

function viewSlot(withRoom, slot) {
  var twitter = slot[/* ownerTwitter */5];
  var twitterUrl = "https://twitter.com/" + (String(twitter) + "");
  return __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["b" /* class$prime */]("slot"),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["b" /* class$prime */]("slot-header"),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["e" /* h2 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](slot[/* name */0]),
  /* [] */0]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["b" /* class$prime */]("slot-extra-info"),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](slot[/* start */2].toLocaleString()),
  /* [] */0]),
  /* :: */[withRoom ? __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [/* Map */[/* Some */[slot[/* roomName */3]]]])),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](slot[/* roomName */3]),
  /* [] */0]),
  /* [] */0]) : __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["i" /* noNode */],
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](slot[/* owner */4]),
  /* [] */0]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["f" /* href */](twitterUrl),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](slot[/* ownerTwitter */5]),
  /* [] */0]),
  /* [] */0]),
  /* [] */0]]]]),
  /* [] */0]]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](slot[/* description */1]),
  /* [] */0]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* [] */0),
  /* [] */0]]]);
}

function viewUpcoming(slots) {
  var upComing = __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["i" /* sort */](function (a, b) {
    return __WEBPACK_IMPORTED_MODULE_9_date_fns__["compareAsc"](a[/* start */2], b[/* start */2]);
  }, __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["a" /* filter */](function (slot) {
    return +(__WEBPACK_IMPORTED_MODULE_9_date_fns__["compareAsc"](slot[/* start */2], new Date()) > 0);
  })(slots));
  return __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function (param) {
    return viewSlot( /* true */1, param);
  }, upComing)),
  /* [] */0]);
}

function viewCurrent(slots) {
  var current = __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["a" /* filter */](function (slot) {
    var start = __WEBPACK_IMPORTED_MODULE_9_date_fns__["startOfHour"](new Date());
    return +__WEBPACK_IMPORTED_MODULE_9_date_fns__["isEqual"](start, slot[/* start */2]);
  })(slots);
  return __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function (param) {
    return viewSlot( /* true */1, param);
  }, current)),
  /* [] */0]);
}

var viewInfo = __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["d" /* h1 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Openspace info"),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["e" /* h2 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("The first morning"),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("We expect you to join us at 09:00 for the introduction of the Market Place, and the opening of the Open Space. Find us at the conference room "),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [/* Map */[/* Some */["Sambre et Meuse"]]])),
/* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Sambre & Meuse"),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["e" /* h2 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Update the openspace"),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["f" /* href */]("https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing"),
/* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("here"),
/* [] */0]),
/* [] */0]]]]]]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["d" /* h1 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Update the openspace"),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["f" /* href */]("https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing"),
/* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("here"),
/* [] */0]),
/* [] */0]]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Link to wiki"),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Phone numbers"),
/* [] */0]),
/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Regular info"),
/* [] */0]),
/* [] */0]]]]]);

function viewSlotInfoForRoom(slots, room) {
  var viewSlots = function (slots) {
    if (slots) {
      return __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function (param) {
        return viewSlot( /* false */0, param);
      }, slots);
    } else {
      return (/* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("No slots booked for this room"),
        /* [] */0]),
        /* [] */0]
      );
    }
  };
  if (room) {
    var room$1 = room[0];
    var slots$1 = __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["a" /* filter */](function (slot) {
      return +(slot[/* roomName */3] === room$1[/* name */0]);
    })(slots);
    return __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["d" /* h1 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](room$1[/* name */0]),
    /* [] */0]),
    /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, viewSlots(slots$1)),
    /* [] */0]]);
  } else {
    return __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["d" /* h1 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Click on a room to see the booked slots"),
    /* [] */0]),
    /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["k" /* p */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Click "),
    /* [] */0]),
    /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["f" /* href */]("https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing"),
    /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("here"),
    /* [] */0]),
    /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */](" to update the slots"),
    /* [] */0]),
    /* [] */0]]]),
    /* [] */0]]);
  }
}

function viewMap(model, roomOption) {
  var activeRoom = __WEBPACK_IMPORTED_MODULE_10_bs_platform_lib_es6_js_option_js__["a" /* andThen */](function (roomName) {
    return safeFind(function (room) {
      return +(room[/* name */0] === roomName);
    }, model[/* rooms */1]);
  }, roomOption);
  var viewRoomCircle = function (room) {
    var $less$ = function (a, b) {
      var str = __WEBPACK_IMPORTED_MODULE_11_bs_platform_lib_es6_pervasives_js__["e" /* string_of_float */](b);
      return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](a, "" + (String(str) + "%"));
    };
    var strokeWidth = activeRoom && activeRoom[0] === room ? "2.5" : "1";
    return __WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__["a" /* g */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [/* Map */[/* Some */[room[/* name */0]]]])),
    /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__["b" /* rect */]( /* None */0, /* None */0, /* :: */[$less$(__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["h" /* x */], room[/* x */2]),
    /* :: */[$less$(__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["j" /* y */], room[/* y */3]),
    /* :: */[$less$(__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["g" /* width */], room[/* width */4]),
    /* :: */[$less$(__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["d" /* height */], room[/* height */5]),
    /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["e" /* stroke */]("black"),
    /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["f" /* strokeWidth */](strokeWidth),
    /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["b" /* fill */](room[/* color */1]),
    /* [] */0]]]]]]], /* [] */0),
    /* :: */[__WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__["f" /* text$prime */]( /* None */0, /* None */0, /* :: */[$less$(__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["h" /* x */], room[/* x */2] + 1),
    /* :: */[$less$(__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["j" /* y */], room[/* y */3] + 3),
    /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["a" /* alignmentBaseline */]("central"),
    /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["c" /* fontSize */]("14"),
    /* [] */0]]]], /* :: */[__WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__["e" /* text */](room[/* name */0]),
    /* [] */0]),
    /* [] */0]]);
  };
  return __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__["c" /* svg */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["g" /* width */]("100vw"),
  /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["d" /* height */]("69vh"),
  /* [] */0]], /* :: */[__WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__["d" /* svgimage */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["i" /* xlinkHref */]("./floorplan.jpg"),
  /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["g" /* width */]("100vw"),
  /* :: */[__WEBPACK_IMPORTED_MODULE_13_bucklescript_tea_src_tea_svg_attributes_js__["d" /* height */]("69vh"),
  /* [] */0]]], /* [] */0),
  /* :: */[__WEBPACK_IMPORTED_MODULE_7_bucklescript_tea_src_tea_svg_js__["a" /* g */]( /* None */0, /* None */0, /* [] */0, __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](viewRoomCircle, model[/* rooms */1])),
  /* [] */0]]),
  /* [] */0]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["b" /* class$prime */]("info"),
  /* [] */0], /* :: */[viewSlotInfoForRoom(model[/* slots */0], activeRoom),
  /* [] */0]),
  /* [] */0]]);
}

function view(model) {
  var class$prime = model[/* menuVisible */3] ? "open" : "";
  var viewHamburger = __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["g" /* id */]("hamburger"),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["b" /* class$prime */](class$prime),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* ToggleMenu */0),
  /* [] */0]]], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* [] */0),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* [] */0),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["l" /* span */]( /* None */0, /* None */0, /* [] */0, /* [] */0),
  /* [] */0]]]);
  var match = model[/* page */2];
  var viewPage;
  if (typeof match === "number") {
    switch (match) {
      case 0:
        viewPage = viewUpcoming(model[/* slots */0]);
        break;
      case 1:
        viewPage = viewCurrent(model[/* slots */0]);
        break;
      case 2:
        viewPage = viewInfo;
        break;

    }
  } else {
    viewPage = viewMap(model, match[0]);
  }
  var match$1 = model[/* menuVisible */3];
  var viewContent = match$1 !== 0 ? __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["n" /* ul */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["h" /* li */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [/* Current */1])),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Current"),
  /* [] */0]),
  /* [] */0]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["h" /* li */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [/* Upcoming */0])),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Upcoming"),
  /* [] */0]),
  /* [] */0]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["h" /* li */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [/* Map */[/* None */0]])),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("OpenSpace Map"),
  /* [] */0]),
  /* [] */0]),
  /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["h" /* li */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["a"]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["j" /* onClick */]( /* SetPage */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [/* Info */2])),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Info"),
  /* [] */0]),
  /* [] */0]),
  /* [] */0]]]]),
  /* [] */0]) : viewPage;
  return __WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["b" /* class$prime */](""),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["c" /* div */]( /* None */0, /* None */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["b" /* class$prime */]("hero"),
  /* [] */0], /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["d" /* h1 */]( /* None */0, /* None */0, /* [] */0, /* :: */[__WEBPACK_IMPORTED_MODULE_8_bucklescript_tea_src_tea_html_js__["m" /* text */]("Socrates Be OpenSpace"),
  /* [] */0]),
  /* :: */[viewHamburger,
  /* [] */0]]),
  /* :: */[viewContent,
  /* [] */0]]);
}

function partial_arg_003() {
  return __WEBPACK_IMPORTED_MODULE_6_bucklescript_tea_src_tea_sub_js__["a" /* none */];
}

var partial_arg = /* record */[
/* init */init,
/* update */update,
/* view */view, partial_arg_003];

function main(param, param$1) {
  return __WEBPACK_IMPORTED_MODULE_4_bucklescript_tea_src_tea_app_js__["a" /* standardProgram */](partial_arg, param, param$1);
}

var toggleMenu = /* ToggleMenu */0;


/* viewInfo Not a pure module */

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export $caret */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return stdin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return stdout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return stderr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return caml_ml_open_descriptor_in; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return caml_ml_open_descriptor_out; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return caml_ml_flush; });
/* unused harmony export node_std_output */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return caml_ml_output; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return caml_ml_output_char; });
/* unused harmony export caml_ml_input */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return caml_ml_input_char; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return caml_ml_out_channels_list; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__ = __webpack_require__(1);





function $caret(prim, prim$1) {
  return prim + prim$1;
}

var stdin = undefined;

var stdout = /* record */[
/* buffer */"",
/* output */function (_, s) {
  var v = s.length - 1 | 0;
  if (typeof process !== "undefined" && process.stdout && process.stdout.write) {
    return process.stdout.write(s);
  } else if (s[v] === "\n") {
    console.log(s.slice(0, v));
    return (/* () */0
    );
  } else {
    console.log(s);
    return (/* () */0
    );
  }
}];

var stderr = /* record */[
/* buffer */"",
/* output */function (_, s) {
  var v = s.length - 1 | 0;
  if (s[v] === "\n") {
    console.log(s.slice(0, v));
    return (/* () */0
    );
  } else {
    console.log(s);
    return (/* () */0
    );
  }
}];

function caml_ml_open_descriptor_in() {
  throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["d" /* failure */], "caml_ml_open_descriptor_in not implemented"];
}

function caml_ml_open_descriptor_out() {
  throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["d" /* failure */], "caml_ml_open_descriptor_out not implemented"];
}

function caml_ml_flush(oc) {
  if (oc[/* buffer */0] !== "") {
    __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](oc[/* output */1], oc, oc[/* buffer */0]);
    oc[/* buffer */0] = "";
    return (/* () */0
    );
  } else {
    return 0;
  }
}

var node_std_output = function (s) {
  return typeof process !== "undefined" && process.stdout && (process.stdout.write(s), true);
};

function caml_ml_output(oc, str, offset, len) {
  var str$1 = offset === 0 && len === str.length ? str : str.slice(offset, len);
  if (typeof process !== "undefined" && process.stdout && process.stdout.write && oc === stdout) {
    return process.stdout.write(str$1);
  } else {
    var id = str$1.lastIndexOf("\n");
    if (id < 0) {
      oc[/* buffer */0] = oc[/* buffer */0] + str$1;
      return (/* () */0
      );
    } else {
      oc[/* buffer */0] = oc[/* buffer */0] + str$1.slice(0, id + 1 | 0);
      caml_ml_flush(oc);
      oc[/* buffer */0] = oc[/* buffer */0] + str$1.slice(id + 1 | 0);
      return (/* () */0
      );
    }
  }
}

function caml_ml_output_char(oc, $$char) {
  return caml_ml_output(oc, String.fromCharCode($$char), 0, 1);
}

function caml_ml_input(_, _$1, _$2, _$3) {
  throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["d" /* failure */], "caml_ml_input ic not implemented"];
}

function caml_ml_input_char() {
  throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["d" /* failure */], "caml_ml_input_char not implemnted"];
}

function caml_ml_out_channels_list() {
  return (/* :: */[stdout,
    /* :: */[stderr,
    /* [] */0]]
  );
}


/* stdin Not a pure module */
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(33)))

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export caml_sys_getenv */
/* unused harmony export caml_sys_time */
/* unused harmony export caml_sys_random_seed */
/* unused harmony export caml_sys_system_command */
/* unused harmony export caml_sys_getcwd */
/* unused harmony export caml_sys_get_argv */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return caml_sys_exit; });
/* unused harmony export caml_sys_is_directory */
/* unused harmony export caml_sys_file_exists */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__ = __webpack_require__(1);




function caml_sys_getenv(s) {
  var match = typeof process === "undefined" ? undefined : process;
  if (match !== undefined) {
    var match$1 = match.env[s];
    if (match$1 !== undefined) {
      return match$1;
    } else {
      throw __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["g" /* not_found */];
    }
  } else {
    throw __WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["g" /* not_found */];
  }
}

function caml_sys_time() {
  var match = typeof process === "undefined" ? undefined : process;
  if (match !== undefined) {
    return match.uptime();
  } else {
    return -1;
  }
}

function caml_sys_random_seed() {
  return (/* array */[((Date.now() | 0) ^ 4294967295) * Math.random() | 0]
  );
}

function caml_sys_system_command() {
  return 127;
}

function caml_sys_getcwd() {
  var match = typeof process === "undefined" ? undefined : process;
  if (match !== undefined) {
    return match.cwd();
  } else {
    return "/";
  }
}

function caml_sys_get_argv() {
  var match = typeof process === "undefined" ? undefined : process;
  if (match !== undefined) {
    if (match.argv == null) {
      return (/* tuple */["",
        /* array */[""]]
      );
    } else {
      return (/* tuple */[match.argv[0], match.argv]
      );
    }
  } else {
    return (/* tuple */["",
      /* array */[""]]
    );
  }
}

function caml_sys_exit(exit_code) {
  var match = typeof process === "undefined" ? undefined : process;
  if (match !== undefined) {
    return match.exit(exit_code);
  } else {
    return (/* () */0
    );
  }
}

function caml_sys_is_directory() {
  throw [__WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["d" /* failure */], "caml_sys_is_directory not implemented"];
}

function caml_sys_file_exists() {
  throw [__WEBPACK_IMPORTED_MODULE_0__caml_builtin_exceptions_js__["d" /* failure */], "caml_sys_file_exists not implemented"];
}


/* No side effect */
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(33)))

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return caml_format_float; });
/* unused harmony export caml_format_int */
/* unused harmony export caml_nativeint_format */
/* unused harmony export caml_int32_format */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return caml_float_of_string; });
/* unused harmony export caml_int64_format */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return caml_int_of_string; });
/* unused harmony export caml_int32_of_string */
/* unused harmony export caml_int64_of_string */
/* unused harmony export caml_nativeint_of_string */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caml_int32_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__caml_utils_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__ = __webpack_require__(1);








function caml_failwith(s) {
  throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], s];
}

function parse_digit(c) {
  if (c >= 65) {
    if (c >= 97) {
      if (c >= 123) {
        return -1;
      } else {
        return c - 87 | 0;
      }
    } else if (c >= 91) {
      return -1;
    } else {
      return c - 55 | 0;
    }
  } else if (c > 57 || c < 48) {
    return -1;
  } else {
    return c - /* "0" */48 | 0;
  }
}

function int_of_string_base(param) {
  switch (param) {
    case 0:
      return 8;
    case 1:
      return 16;
    case 2:
      return 10;
    case 3:
      return 2;

  }
}

function parse_sign_and_base(s) {
  var sign = 1;
  var base = /* Dec */2;
  var i = 0;
  if (s[i] === "-") {
    sign = -1;
    i = i + 1 | 0;
  }
  var match = s.charCodeAt(i);
  var match$1 = s.charCodeAt(i + 1 | 0);
  if (match === 48) {
    if (match$1 >= 89) {
      if (match$1 !== 98) {
        if (match$1 !== 111) {
          if (match$1 === 120) {
            base = /* Hex */1;
            i = i + 2 | 0;
          }
        } else {
          base = /* Oct */0;
          i = i + 2 | 0;
        }
      } else {
        base = /* Bin */3;
        i = i + 2 | 0;
      }
    } else if (match$1 !== 66) {
      if (match$1 !== 79) {
        if (match$1 >= 88) {
          base = /* Hex */1;
          i = i + 2 | 0;
        }
      } else {
        base = /* Oct */0;
        i = i + 2 | 0;
      }
    } else {
      base = /* Bin */3;
      i = i + 2 | 0;
    }
  }
  return (/* tuple */[i, sign, base]
  );
}

function caml_int_of_string(s) {
  var match = parse_sign_and_base(s);
  var i = match[0];
  var base = int_of_string_base(match[2]);
  var threshold = 4294967295;
  var len = s.length;
  var c = i < len ? s.charCodeAt(i) : /* "\000" */0;
  var d = parse_digit(c);
  if (d < 0 || d >= base) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], "int_of_string"];
  }
  var aux = function (_acc, _k) {
    while (true) {
      var k = _k;
      var acc = _acc;
      if (k === len) {
        return acc;
      } else {
        var a = s.charCodeAt(k);
        if (a === /* "_" */95) {
          _k = k + 1 | 0;
          continue;
        } else {
          var v = parse_digit(a);
          if (v < 0 || v >= base) {
            throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], "int_of_string"];
          } else {
            var acc$1 = base * acc + v;
            if (acc$1 > threshold) {
              throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], "int_of_string"];
            } else {
              _k = k + 1 | 0;
              _acc = acc$1;
              continue;
            }
          }
        }
      }
    };
  };
  var res = match[1] * aux(d, i + 1 | 0);
  var or_res = res | 0;
  if (base === 10 && res !== or_res) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], "int_of_string"];
  }
  return or_res;
}

function caml_int64_of_string(s) {
  var match = parse_sign_and_base(s);
  var hbase = match[2];
  var i = match[0];
  var base = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["k" /* of_int32 */](int_of_string_base(hbase));
  var sign = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["k" /* of_int32 */](match[1]);
  var threshold;
  switch (hbase) {
    case 0:
      threshold = /* int64 */[
      /* hi */536870911,
      /* lo */4294967295];
      break;
    case 1:
      threshold = /* int64 */[
      /* hi */268435455,
      /* lo */4294967295];
      break;
    case 2:
      threshold = /* int64 */[
      /* hi */429496729,
      /* lo */2576980377];
      break;
    case 3:
      threshold = /* int64 */[
      /* hi */2147483647,
      /* lo */4294967295];
      break;

  }
  var len = s.length;
  var c = i < len ? s.charCodeAt(i) : /* "\000" */0;
  var d = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["k" /* of_int32 */](parse_digit(c));
  if (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["g" /* lt */](d, /* int64 */[
  /* hi */0,
  /* lo */0]) || __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["e" /* ge */](d, base)) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], "int64_of_string"];
  }
  var aux = function (_acc, _k) {
    while (true) {
      var k = _k;
      var acc = _acc;
      if (k === len) {
        return acc;
      } else {
        var a = s.charCodeAt(k);
        if (a === /* "_" */95) {
          _k = k + 1 | 0;
          continue;
        } else {
          var v = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["k" /* of_int32 */](parse_digit(a));
          if (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["g" /* lt */](v, /* int64 */[
          /* hi */0,
          /* lo */0]) || __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["e" /* ge */](v, base) || __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["f" /* gt */](acc, threshold)) {
            throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], "int64_of_string"];
          } else {
            var acc$1 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["a" /* add */](__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["h" /* mul */](base, acc), v);
            _k = k + 1 | 0;
            _acc = acc$1;
            continue;
          }
        }
      }
    };
  };
  var res = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["h" /* mul */](sign, aux(d, i + 1 | 0));
  var or_res = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["l" /* or_ */](res, /* int64 */[
  /* hi */0,
  /* lo */0]);
  if (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["d" /* eq */](base, /* int64 */[
  /* hi */0,
  /* lo */10]) && __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["j" /* neq */](res, or_res)) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["d" /* failure */], "int64_of_string"];
  }
  return or_res;
}

function int_of_base(param) {
  switch (param) {
    case 0:
      return 8;
    case 1:
      return 16;
    case 2:
      return 10;

  }
}

function lowercase(c) {
  if (c >= /* "A" */65 && c <= /* "Z" */90 || c >= /* "\192" */192 && c <= /* "\214" */214 || c >= /* "\216" */216 && c <= /* "\222" */222) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function parse_format(fmt) {
  var len = fmt.length;
  if (len > 31) {
    throw [__WEBPACK_IMPORTED_MODULE_4__caml_builtin_exceptions_js__["e" /* invalid_argument */], "format_int: format too long"];
  }
  var f = /* record */[
  /* justify */"+",
  /* signstyle */"-",
  /* filter */" ",
  /* alternate : false */0,
  /* base : Dec */2,
  /* signedconv : false */0,
  /* width */0,
  /* uppercase : false */0,
  /* sign */1,
  /* prec */-1,
  /* conv */"f"];
  var _i = 0;
  while (true) {
    var i = _i;
    if (i >= len) {
      return f;
    } else {
      var c = fmt.charCodeAt(i);
      var exit = 0;
      if (c >= 69) {
        if (c >= 88) {
          if (c >= 121) {
            exit = 1;
          } else {
            switch (c - 88 | 0) {
              case 0:
                f[/* base */4] = /* Hex */1;
                f[/* uppercase */7] = /* true */1;
                _i = i + 1 | 0;
                continue;
              case 13:
              case 14:
              case 15:
                exit = 5;
                break;
              case 12:
              case 17:
                exit = 4;
                break;
              case 23:
                f[/* base */4] = /* Oct */0;
                _i = i + 1 | 0;
                continue;
              case 29:
                f[/* base */4] = /* Dec */2;
                _i = i + 1 | 0;
                continue;
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
              case 8:
              case 9:
              case 10:
              case 11:
              case 16:
              case 18:
              case 19:
              case 20:
              case 21:
              case 22:
              case 24:
              case 25:
              case 26:
              case 27:
              case 28:
              case 30:
              case 31:
                exit = 1;
                break;
              case 32:
                f[/* base */4] = /* Hex */1;
                _i = i + 1 | 0;
                continue;

            }
          }
        } else if (c >= 72) {
          exit = 1;
        } else {
          f[/* signedconv */5] = /* true */1;
          f[/* uppercase */7] = /* true */1;
          f[/* conv */10] = String.fromCharCode(lowercase(c));
          _i = i + 1 | 0;
          continue;
        }
      } else {
        var switcher = c - 32 | 0;
        if (switcher > 25 || switcher < 0) {
          exit = 1;
        } else {
          switch (switcher) {
            case 3:
              f[/* alternate */3] = /* true */1;
              _i = i + 1 | 0;
              continue;
            case 0:
            case 11:
              exit = 2;
              break;
            case 13:
              f[/* justify */0] = "-";
              _i = i + 1 | 0;
              continue;
            case 14:
              f[/* prec */9] = 0;
              var j = i + 1 | 0;
              while (function (j) {
                return function () {
                  var w = fmt.charCodeAt(j) - /* "0" */48 | 0;
                  return +(w >= 0 && w <= 9);
                };
              }(j)()) {
                f[/* prec */9] = (__WEBPACK_IMPORTED_MODULE_1__caml_int32_js__["b" /* imul */](f[/* prec */9], 10) + fmt.charCodeAt(j) | 0) - /* "0" */48 | 0;
                j = j + 1 | 0;
              };
              _i = j;
              continue;
            case 1:
            case 2:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 12:
            case 15:
              exit = 1;
              break;
            case 16:
              f[/* filter */2] = "0";
              _i = i + 1 | 0;
              continue;
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
              exit = 3;
              break;

          }
        }
      }
      switch (exit) {
        case 1:
          _i = i + 1 | 0;
          continue;
        case 2:
          f[/* signstyle */1] = String.fromCharCode(c);
          _i = i + 1 | 0;
          continue;
        case 3:
          f[/* width */6] = 0;
          var j$1 = i;
          while (function (j$1) {
            return function () {
              var w = fmt.charCodeAt(j$1) - /* "0" */48 | 0;
              return +(w >= 0 && w <= 9);
            };
          }(j$1)()) {
            f[/* width */6] = (__WEBPACK_IMPORTED_MODULE_1__caml_int32_js__["b" /* imul */](f[/* width */6], 10) + fmt.charCodeAt(j$1) | 0) - /* "0" */48 | 0;
            j$1 = j$1 + 1 | 0;
          };
          _i = j$1;
          continue;
        case 4:
          f[/* signedconv */5] = /* true */1;
          f[/* base */4] = /* Dec */2;
          _i = i + 1 | 0;
          continue;
        case 5:
          f[/* signedconv */5] = /* true */1;
          f[/* conv */10] = String.fromCharCode(c);
          _i = i + 1 | 0;
          continue;

      }
    }
  };
}

function finish_formatting(param, rawbuffer) {
  var justify = param[/* justify */0];
  var signstyle = param[/* signstyle */1];
  var filter = param[/* filter */2];
  var alternate = param[/* alternate */3];
  var base = param[/* base */4];
  var signedconv = param[/* signedconv */5];
  var width = param[/* width */6];
  var uppercase = param[/* uppercase */7];
  var sign = param[/* sign */8];
  var len = rawbuffer.length;
  if (signedconv && (sign < 0 || signstyle !== "-")) {
    len = len + 1 | 0;
  }
  if (alternate) {
    if (base) {
      if (base === /* Hex */1) {
        len = len + 2 | 0;
      }
    } else {
      len = len + 1 | 0;
    }
  }
  var buffer = "";
  if (justify === "+" && filter === " ") {
    for (var i = len, i_finish = width - 1 | 0; i <= i_finish; ++i) {
      buffer = buffer + filter;
    }
  }
  if (signedconv) {
    if (sign < 0) {
      buffer = buffer + "-";
    } else if (signstyle !== "-") {
      buffer = buffer + signstyle;
    }
  }
  if (alternate && base === /* Oct */0) {
    buffer = buffer + "0";
  }
  if (alternate && base === /* Hex */1) {
    buffer = buffer + "0x";
  }
  if (justify === "+" && filter === "0") {
    for (var i$1 = len, i_finish$1 = width - 1 | 0; i$1 <= i_finish$1; ++i$1) {
      buffer = buffer + filter;
    }
  }
  buffer = uppercase ? buffer + rawbuffer.toUpperCase() : buffer + rawbuffer;
  if (justify === "-") {
    for (var i$2 = len, i_finish$2 = width - 1 | 0; i$2 <= i_finish$2; ++i$2) {
      buffer = buffer + " ";
    }
  }
  return buffer;
}

function caml_format_int(fmt, i) {
  if (fmt === "%d") {
    return String(i);
  } else {
    var f = parse_format(fmt);
    var f$1 = f;
    var i$1 = i;
    var i$2 = i$1 < 0 ? f$1[/* signedconv */5] ? (f$1[/* sign */8] = -1, -i$1) : i$1 >>> 0 : i$1;
    var s = i$2.toString(int_of_base(f$1[/* base */4]));
    if (f$1[/* prec */9] >= 0) {
      f$1[/* filter */2] = " ";
      var n = f$1[/* prec */9] - s.length | 0;
      if (n > 0) {
        s = __WEBPACK_IMPORTED_MODULE_3__caml_utils_js__["a" /* repeat */](n, "0") + s;
      }
    }
    return finish_formatting(f$1, s);
  }
}

function caml_int64_format(fmt, x) {
  var f = parse_format(fmt);
  var x$1 = f[/* signedconv */5] && __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["g" /* lt */](x, /* int64 */[
  /* hi */0,
  /* lo */0]) ? (f[/* sign */8] = -1, __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["i" /* neg */](x)) : x;
  var s = "";
  var match = f[/* base */4];
  switch (match) {
    case 0:
      var wbase = /* int64 */[
      /* hi */0,
      /* lo */8];
      var cvtbl = "01234567";
      if (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["g" /* lt */](x$1, /* int64 */[
      /* hi */0,
      /* lo */0])) {
        var y = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["b" /* discard_sign */](x$1);
        var match$1 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](y, wbase);
        var quotient = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["a" /* add */]( /* int64 */[
        /* hi */268435456,
        /* lo */0], match$1[0]);
        var modulus = match$1[1];
        s = String.fromCharCode(cvtbl.charCodeAt(modulus[1] | 0)) + s;
        while (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["j" /* neq */](quotient, /* int64 */[
        /* hi */0,
        /* lo */0])) {
          var match$2 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](quotient, wbase);
          quotient = match$2[0];
          modulus = match$2[1];
          s = String.fromCharCode(cvtbl.charCodeAt(modulus[1] | 0)) + s;
        };
      } else {
        var match$3 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](x$1, wbase);
        var quotient$1 = match$3[0];
        var modulus$1 = match$3[1];
        s = String.fromCharCode(cvtbl.charCodeAt(modulus$1[1] | 0)) + s;
        while (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["j" /* neq */](quotient$1, /* int64 */[
        /* hi */0,
        /* lo */0])) {
          var match$4 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](quotient$1, wbase);
          quotient$1 = match$4[0];
          modulus$1 = match$4[1];
          s = String.fromCharCode(cvtbl.charCodeAt(modulus$1[1] | 0)) + s;
        };
      }
      break;
    case 1:
      s = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["m" /* to_hex */](x$1) + s;
      break;
    case 2:
      var wbase$1 = /* int64 */[
      /* hi */0,
      /* lo */10];
      var cvtbl$1 = "0123456789";
      if (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["g" /* lt */](x$1, /* int64 */[
      /* hi */0,
      /* lo */0])) {
        var y$1 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["b" /* discard_sign */](x$1);
        var match$5 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](y$1, wbase$1);
        var match$6 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["a" /* add */]( /* int64 */[
        /* hi */0,
        /* lo */8], match$5[1]), wbase$1);
        var quotient$2 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["a" /* add */](__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["a" /* add */]( /* int64 */[
        /* hi */214748364,
        /* lo */3435973836], match$5[0]), match$6[0]);
        var modulus$2 = match$6[1];
        s = String.fromCharCode(cvtbl$1.charCodeAt(modulus$2[1] | 0)) + s;
        while (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["j" /* neq */](quotient$2, /* int64 */[
        /* hi */0,
        /* lo */0])) {
          var match$7 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](quotient$2, wbase$1);
          quotient$2 = match$7[0];
          modulus$2 = match$7[1];
          s = String.fromCharCode(cvtbl$1.charCodeAt(modulus$2[1] | 0)) + s;
        };
      } else {
        var match$8 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](x$1, wbase$1);
        var quotient$3 = match$8[0];
        var modulus$3 = match$8[1];
        s = String.fromCharCode(cvtbl$1.charCodeAt(modulus$3[1] | 0)) + s;
        while (__WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["j" /* neq */](quotient$3, /* int64 */[
        /* hi */0,
        /* lo */0])) {
          var match$9 = __WEBPACK_IMPORTED_MODULE_2__caml_int64_js__["c" /* div_mod */](quotient$3, wbase$1);
          quotient$3 = match$9[0];
          modulus$3 = match$9[1];
          s = String.fromCharCode(cvtbl$1.charCodeAt(modulus$3[1] | 0)) + s;
        };
      }
      break;

  }
  if (f[/* prec */9] >= 0) {
    f[/* filter */2] = " ";
    var n = f[/* prec */9] - s.length | 0;
    if (n > 0) {
      s = __WEBPACK_IMPORTED_MODULE_3__caml_utils_js__["a" /* repeat */](n, "0") + s;
    }
  }
  return finish_formatting(f, s);
}

function caml_format_float(fmt, x) {
  var f = parse_format(fmt);
  var prec = f[/* prec */9] < 0 ? 6 : f[/* prec */9];
  var x$1 = x < 0 ? (f[/* sign */8] = -1, -x) : x;
  var s = "";
  if (isNaN(x$1)) {
    s = "nan";
    f[/* filter */2] = " ";
  } else if (isFinite(x$1)) {
    var match = f[/* conv */10];
    switch (match) {
      case "e":
        s = x$1.toExponential(prec);
        var i = s.length;
        if (s[i - 3 | 0] === "e") {
          s = s.slice(0, i - 1 | 0) + ("0" + s.slice(i - 1 | 0));
        }
        break;
      case "f":
        s = x$1.toFixed(prec);
        break;
      case "g":
        var prec$1 = prec !== 0 ? prec : 1;
        s = x$1.toExponential(prec$1 - 1 | 0);
        var j = s.indexOf("e");
        var exp = Number(s.slice(j + 1 | 0)) | 0;
        if (exp < -4 || x$1 >= 1e21 || x$1.toFixed().length > prec$1) {
          var i$1 = j - 1 | 0;
          while (s[i$1] === "0") {
            i$1 = i$1 - 1 | 0;
          };
          if (s[i$1] === ".") {
            i$1 = i$1 - 1 | 0;
          }
          s = s.slice(0, i$1 + 1 | 0) + s.slice(j);
          var i$2 = s.length;
          if (s[i$2 - 3 | 0] === "e") {
            s = s.slice(0, i$2 - 1 | 0) + ("0" + s.slice(i$2 - 1 | 0));
          }
        } else {
          var p = prec$1;
          if (exp < 0) {
            p = p - (exp + 1 | 0) | 0;
            s = x$1.toFixed(p);
          } else {
            while (function () {
              s = x$1.toFixed(p);
              return +(s.length > (prec$1 + 1 | 0));
            }()) {
              p = p - 1 | 0;
            };
          }
          if (p !== 0) {
            var k = s.length - 1 | 0;
            while (s[k] === "0") {
              k = k - 1 | 0;
            };
            if (s[k] === ".") {
              k = k - 1 | 0;
            }
            s = s.slice(0, k + 1 | 0);
          }
        }
        break;
      default:

    }
  } else {
    s = "inf";
    f[/* filter */2] = " ";
  }
  return finish_formatting(f, s);
}

var float_of_string = function (s, caml_failwith) {
  var res = +s;
  if (s.length > 0 && res === res) return res;
  s = s.replace(/_/g, "");
  res = +s;
  if (s.length > 0 && res === res || /^[+-]?nan$/i.test(s)) {
    return res;
  }
  ;
  if (/^ *0x[0-9a-f_]+p[+-]?[0-9_]+/i.test(s)) {
    var pidx = s.indexOf('p');
    pidx = pidx == -1 ? s.indexOf('P') : pidx;
    var exp = +s.substring(pidx + 1);
    res = +s.substring(0, pidx);
    return res * Math.pow(2, exp);
  }
  if (/^\+?inf(inity)?$/i.test(s)) return Infinity;
  if (/^-inf(inity)?$/i.test(s)) return -Infinity;
  caml_failwith("float_of_string");
};

function caml_float_of_string(s) {
  return __WEBPACK_IMPORTED_MODULE_0__curry_js__["b" /* _2 */](float_of_string, s, caml_failwith);
}

var caml_nativeint_format = caml_format_int;

var caml_int32_format = caml_format_int;

var caml_int32_of_string = caml_int_of_string;

var caml_nativeint_of_string = caml_int_of_string;


/* float_of_string Not a pure module */

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export min_int */
/* unused harmony export max_int */
/* unused harmony export one */
/* unused harmony export zero */
/* unused harmony export not */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return of_int32; });
/* unused harmony export to_int32 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return neg; });
/* unused harmony export sub */
/* unused harmony export lsl_ */
/* unused harmony export lsr_ */
/* unused harmony export asr_ */
/* unused harmony export is_zero */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return mul; });
/* unused harmony export xor */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return or_; });
/* unused harmony export and_ */
/* unused harmony export swap */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return eq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return neq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return lt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return gt; });
/* unused harmony export le */
/* unused harmony export to_float */
/* unused harmony export of_float */
/* unused harmony export div */
/* unused harmony export mod_ */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return div_mod; });
/* unused harmony export compare */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return to_hex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return discard_sign; });
/* unused harmony export float_of_bits */
/* unused harmony export bits_of_float */
/* unused harmony export get64 */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_obj_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caml_int32_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__caml_utils_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__ = __webpack_require__(1);







var min_int = /* record */[
/* hi */-2147483648,
/* lo */0];

var max_int = /* record */[
/* hi */134217727,
/* lo */1];

var one = /* record */[
/* hi */0,
/* lo */1];

var zero = /* record */[
/* hi */0,
/* lo */0];

var neg_one = /* record */[
/* hi */-1,
/* lo */4294967295];

function neg_signed(x) {
  return +((x & 2147483648) !== 0);
}

function add(param, param$1) {
  var other_low_ = param$1[/* lo */1];
  var this_low_ = param[/* lo */1];
  var lo = this_low_ + other_low_ & 4294967295;
  var overflow = neg_signed(this_low_) && (neg_signed(other_low_) || !neg_signed(lo)) || neg_signed(other_low_) && !neg_signed(lo) ? 1 : 0;
  var hi = param[/* hi */0] + param$1[/* hi */0] + overflow & 4294967295;
  return (/* record */[
    /* hi */hi,
    /* lo */lo >>> 0]
  );
}

function not(param) {
  var hi = param[/* hi */0] ^ -1;
  var lo = param[/* lo */1] ^ -1;
  return (/* record */[
    /* hi */hi,
    /* lo */lo >>> 0]
  );
}

function eq(x, y) {
  if (x[/* hi */0] === y[/* hi */0]) {
    return +(x[/* lo */1] === y[/* lo */1]);
  } else {
    return (/* false */0
    );
  }
}

function neg(x) {
  if (eq(x, min_int)) {
    return min_int;
  } else {
    return add(not(x), one);
  }
}

function sub(x, y) {
  return add(x, neg(y));
}

function lsl_(x, numBits) {
  if (numBits) {
    var lo = x[/* lo */1];
    if (numBits >= 32) {
      return (/* record */[
        /* hi */lo << (numBits - 32 | 0),
        /* lo */0]
      );
    } else {
      var hi = lo >>> (32 - numBits | 0) | x[/* hi */0] << numBits;
      return (/* record */[
        /* hi */hi,
        /* lo */lo << numBits >>> 0]
      );
    }
  } else {
    return x;
  }
}

function lsr_(x, numBits) {
  if (numBits) {
    var hi = x[/* hi */0];
    var offset = numBits - 32 | 0;
    if (offset) {
      if (offset > 0) {
        var lo = hi >>> offset;
        return (/* record */[
          /* hi */0,
          /* lo */lo >>> 0]
        );
      } else {
        var hi$1 = hi >>> numBits;
        var lo$1 = hi << (-offset | 0) | x[/* lo */1] >>> numBits;
        return (/* record */[
          /* hi */hi$1,
          /* lo */lo$1 >>> 0]
        );
      }
    } else {
      return (/* record */[
        /* hi */0,
        /* lo */hi >>> 0]
      );
    }
  } else {
    return x;
  }
}

function asr_(x, numBits) {
  if (numBits) {
    var hi = x[/* hi */0];
    if (numBits < 32) {
      var hi$1 = hi >> numBits;
      var lo = hi << (32 - numBits | 0) | x[/* lo */1] >>> numBits;
      return (/* record */[
        /* hi */hi$1,
        /* lo */lo >>> 0]
      );
    } else {
      var lo$1 = hi >> (numBits - 32 | 0);
      return (/* record */[
        /* hi */hi >= 0 ? 0 : -1,
        /* lo */lo$1 >>> 0]
      );
    }
  } else {
    return x;
  }
}

function is_zero(param) {
  if (param[/* hi */0] !== 0 || param[/* lo */1] !== 0) {
    return (/* false */0
    );
  } else {
    return (/* true */1
    );
  }
}

function mul(_this, _other) {
  while (true) {
    var other = _other;
    var $$this = _this;
    var exit = 0;
    var lo;
    var this_hi = $$this[/* hi */0];
    var exit$1 = 0;
    var exit$2 = 0;
    var exit$3 = 0;
    if (this_hi !== 0) {
      exit$3 = 4;
    } else if ($$this[/* lo */1] !== 0) {
      exit$3 = 4;
    } else {
      return zero;
    }
    if (exit$3 === 4) {
      if (other[/* hi */0] !== 0) {
        exit$2 = 3;
      } else if (other[/* lo */1] !== 0) {
        exit$2 = 3;
      } else {
        return zero;
      }
    }
    if (exit$2 === 3) {
      if (this_hi !== -2147483648) {
        exit$1 = 2;
      } else if ($$this[/* lo */1] !== 0) {
        exit$1 = 2;
      } else {
        lo = other[/* lo */1];
        exit = 1;
      }
    }
    if (exit$1 === 2) {
      var other_hi = other[/* hi */0];
      var lo$1 = $$this[/* lo */1];
      var exit$4 = 0;
      if (other_hi !== -2147483648) {
        exit$4 = 3;
      } else if (other[/* lo */1] !== 0) {
        exit$4 = 3;
      } else {
        lo = lo$1;
        exit = 1;
      }
      if (exit$4 === 3) {
        var other_lo = other[/* lo */1];
        if (this_hi < 0) {
          if (other_hi < 0) {
            _other = neg(other);
            _this = neg($$this);
            continue;
          } else {
            return neg(mul(neg($$this), other));
          }
        } else if (other_hi < 0) {
          return neg(mul($$this, neg(other)));
        } else {
          var a48 = this_hi >>> 16;
          var a32 = this_hi & 65535;
          var a16 = lo$1 >>> 16;
          var a00 = lo$1 & 65535;
          var b48 = other_hi >>> 16;
          var b32 = other_hi & 65535;
          var b16 = other_lo >>> 16;
          var b00 = other_lo & 65535;
          var c48 = 0;
          var c32 = 0;
          var c16 = 0;
          var c00 = a00 * b00;
          c16 = (c00 >>> 16) + a16 * b00;
          c32 = c16 >>> 16;
          c16 = (c16 & 65535) + a00 * b16;
          c32 = c32 + (c16 >>> 16) + a32 * b00;
          c48 = c32 >>> 16;
          c32 = (c32 & 65535) + a16 * b16;
          c48 += c32 >>> 16;
          c32 = (c32 & 65535) + a00 * b32;
          c48 += c32 >>> 16;
          c32 = c32 & 65535;
          c48 = c48 + (a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48) & 65535;
          var hi = c32 | c48 << 16;
          var lo$2 = c00 & 65535 | (c16 & 65535) << 16;
          return (/* record */[
            /* hi */hi,
            /* lo */lo$2 >>> 0]
          );
        }
      }
    }
    if (exit === 1) {
      if ((lo & 1) === 0) {
        return zero;
      } else {
        return min_int;
      }
    }
  };
}

function swap(param) {
  var hi = __WEBPACK_IMPORTED_MODULE_1__caml_int32_js__["a" /* caml_int32_bswap */](param[/* lo */1]);
  var lo = __WEBPACK_IMPORTED_MODULE_1__caml_int32_js__["a" /* caml_int32_bswap */](param[/* hi */0]);
  return (/* record */[
    /* hi */hi,
    /* lo */lo >>> 0]
  );
}

function xor(param, param$1) {
  return (/* record */[
    /* hi */param[/* hi */0] ^ param$1[/* hi */0],
    /* lo */(param[/* lo */1] ^ param$1[/* lo */1]) >>> 0]
  );
}

function or_(param, param$1) {
  return (/* record */[
    /* hi */param[/* hi */0] | param$1[/* hi */0],
    /* lo */(param[/* lo */1] | param$1[/* lo */1]) >>> 0]
  );
}

function and_(param, param$1) {
  return (/* record */[
    /* hi */param[/* hi */0] & param$1[/* hi */0],
    /* lo */(param[/* lo */1] & param$1[/* lo */1]) >>> 0]
  );
}

function ge(param, param$1) {
  var other_hi = param$1[/* hi */0];
  var hi = param[/* hi */0];
  if (hi > other_hi) {
    return (/* true */1
    );
  } else if (hi < other_hi) {
    return (/* false */0
    );
  } else {
    return +(param[/* lo */1] >= param$1[/* lo */1]);
  }
}

function neq(x, y) {
  return 1 - eq(x, y);
}

function lt(x, y) {
  return 1 - ge(x, y);
}

function gt(x, y) {
  if (x[/* hi */0] > y[/* hi */0]) {
    return (/* true */1
    );
  } else if (x[/* hi */0] < y[/* hi */0]) {
    return (/* false */0
    );
  } else {
    return +(x[/* lo */1] > y[/* lo */1]);
  }
}

function le(x, y) {
  return 1 - gt(x, y);
}

function to_float(param) {
  return param[/* hi */0] * 0x100000000 + param[/* lo */1];
}

var two_ptr_32_dbl = Math.pow(2, 32);

var two_ptr_63_dbl = Math.pow(2, 63);

var neg_two_ptr_63 = -Math.pow(2, 63);

function of_float(x) {
  if (isNaN(x) || !isFinite(x)) {
    return zero;
  } else if (x <= neg_two_ptr_63) {
    return min_int;
  } else if (x + 1 >= two_ptr_63_dbl) {
    return max_int;
  } else if (x < 0) {
    return neg(of_float(-x));
  } else {
    var hi = x / two_ptr_32_dbl | 0;
    var lo = x % two_ptr_32_dbl | 0;
    return (/* record */[
      /* hi */hi,
      /* lo */lo >>> 0]
    );
  }
}

function div(_self, _other) {
  while (true) {
    var other = _other;
    var self = _self;
    var self_hi = self[/* hi */0];
    var exit = 0;
    var exit$1 = 0;
    if (other[/* hi */0] !== 0) {
      exit$1 = 2;
    } else if (other[/* lo */1] !== 0) {
      exit$1 = 2;
    } else {
      throw __WEBPACK_IMPORTED_MODULE_3__caml_builtin_exceptions_js__["b" /* division_by_zero */];
    }
    if (exit$1 === 2) {
      if (self_hi !== -2147483648) {
        if (self_hi !== 0) {
          exit = 1;
        } else if (self[/* lo */1] !== 0) {
          exit = 1;
        } else {
          return zero;
        }
      } else if (self[/* lo */1] !== 0) {
        exit = 1;
      } else if (eq(other, one) || eq(other, neg_one)) {
        return self;
      } else if (eq(other, min_int)) {
        return one;
      } else {
        var other_hi = other[/* hi */0];
        var half_this = asr_(self, 1);
        var approx = lsl_(div(half_this, other), 1);
        var exit$2 = 0;
        if (approx[/* hi */0] !== 0) {
          exit$2 = 3;
        } else if (approx[/* lo */1] !== 0) {
          exit$2 = 3;
        } else if (other_hi < 0) {
          return one;
        } else {
          return neg(one);
        }
        if (exit$2 === 3) {
          var y = mul(other, approx);
          var rem = add(self, neg(y));
          return add(approx, div(rem, other));
        }
      }
    }
    if (exit === 1) {
      var other_hi$1 = other[/* hi */0];
      var exit$3 = 0;
      if (other_hi$1 !== -2147483648) {
        exit$3 = 2;
      } else if (other[/* lo */1] !== 0) {
        exit$3 = 2;
      } else {
        return zero;
      }
      if (exit$3 === 2) {
        if (self_hi < 0) {
          if (other_hi$1 < 0) {
            _other = neg(other);
            _self = neg(self);
            continue;
          } else {
            return neg(div(neg(self), other));
          }
        } else if (other_hi$1 < 0) {
          return neg(div(self, neg(other)));
        } else {
          var res = zero;
          var rem$1 = self;
          while (ge(rem$1, other)) {
            var approx$1 = Math.max(1, Math.floor(to_float(rem$1) / to_float(other)));
            var log2 = Math.ceil(Math.log(approx$1) / Math.LN2);
            var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
            var approxRes = of_float(approx$1);
            var approxRem = mul(approxRes, other);
            while (approxRem[/* hi */0] < 0 || gt(approxRem, rem$1)) {
              approx$1 -= delta;
              approxRes = of_float(approx$1);
              approxRem = mul(approxRes, other);
            };
            if (is_zero(approxRes)) {
              approxRes = one;
            }
            res = add(res, approxRes);
            rem$1 = add(rem$1, neg(approxRem));
          };
          return res;
        }
      }
    }
  };
}

function mod_(self, other) {
  var y = mul(div(self, other), other);
  return add(self, neg(y));
}

function div_mod(self, other) {
  var quotient = div(self, other);
  var y = mul(quotient, other);
  return (/* tuple */[quotient, add(self, neg(y))]
  );
}

function compare(self, other) {
  var v = __WEBPACK_IMPORTED_MODULE_0__caml_obj_js__["e" /* caml_nativeint_compare */](self[/* hi */0], other[/* hi */0]);
  if (v) {
    return v;
  } else {
    return __WEBPACK_IMPORTED_MODULE_0__caml_obj_js__["e" /* caml_nativeint_compare */](self[/* lo */1], other[/* lo */1]);
  }
}

function of_int32(lo) {
  return (/* record */[
    /* hi */lo < 0 ? -1 : 0,
    /* lo */lo >>> 0]
  );
}

function to_int32(x) {
  return x[/* lo */1] | 0;
}

function to_hex(x) {
  var aux = function (v) {
    return (v >>> 0).toString(16);
  };
  var match = x[/* hi */0];
  var match$1 = x[/* lo */1];
  var exit = 0;
  if (match !== 0) {
    exit = 1;
  } else if (match$1 !== 0) {
    exit = 1;
  } else {
    return "0";
  }
  if (exit === 1) {
    if (match$1 !== 0) {
      if (match !== 0) {
        var lo = aux(x[/* lo */1]);
        var pad = 8 - lo.length | 0;
        if (pad <= 0) {
          return aux(x[/* hi */0]) + lo;
        } else {
          return aux(x[/* hi */0]) + (__WEBPACK_IMPORTED_MODULE_2__caml_utils_js__["a" /* repeat */](pad, "0") + lo);
        }
      } else {
        return aux(x[/* lo */1]);
      }
    } else {
      return aux(x[/* hi */0]) + "00000000";
    }
  }
}

function discard_sign(x) {
  return (/* record */[
    /* hi */2147483647 & x[/* hi */0],
    /* lo */x[/* lo */1]]
  );
}

function float_of_bits(x) {
  var int32 = new Int32Array( /* array */[x[/* lo */1], x[/* hi */0]]);
  return new Float64Array(int32.buffer)[0];
}

function bits_of_float(x) {
  var u = new Float64Array( /* float array */[x]);
  var int32 = new Int32Array(u.buffer);
  var x$1 = int32[1];
  var hi = x$1;
  var x$2 = int32[0];
  var lo = x$2;
  return (/* record */[
    /* hi */hi,
    /* lo */lo >>> 0]
  );
}

function get64(s, i) {
  var hi = s.charCodeAt(i + 4 | 0) << 32 | s.charCodeAt(i + 5 | 0) << 40 | s.charCodeAt(i + 6 | 0) << 48 | s.charCodeAt(i + 7 | 0) << 56;
  var lo = s.charCodeAt(i) | s.charCodeAt(i + 1 | 0) << 8 | s.charCodeAt(i + 2 | 0) << 16 | s.charCodeAt(i + 3 | 0) << 24;
  return (/* record */[
    /* hi */hi,
    /* lo */lo >>> 0]
  );
}


/* two_ptr_32_dbl Not a pure module */

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return not_implemented; });


var not_implemented = function (s) {
  throw new Error(s);
};


/* not_implemented Not a pure module */

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export concat_fmtty */
/* unused harmony export erase_rel */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return concat_fmt; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block_js__ = __webpack_require__(4);




function erase_rel(param) {
    if (typeof param === "number") {
        return (/* End_of_fmtty */0
        );
    } else {
        switch (param.tag | 0) {
            case 0:
                return (/* Char_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](0, [erase_rel(param[0])])
                );
            case 1:
                return (/* String_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](1, [erase_rel(param[0])])
                );
            case 2:
                return (/* Int_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](2, [erase_rel(param[0])])
                );
            case 3:
                return (/* Int32_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](3, [erase_rel(param[0])])
                );
            case 4:
                return (/* Nativeint_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](4, [erase_rel(param[0])])
                );
            case 5:
                return (/* Int64_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](5, [erase_rel(param[0])])
                );
            case 6:
                return (/* Float_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](6, [erase_rel(param[0])])
                );
            case 7:
                return (/* Bool_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](7, [erase_rel(param[0])])
                );
            case 8:
                return (/* Format_arg_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](8, [param[0], erase_rel(param[1])])
                );
            case 9:
                var ty1 = param[0];
                return (/* Format_subst_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](9, [ty1, ty1, erase_rel(param[2])])
                );
            case 10:
                return (/* Alpha_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](10, [erase_rel(param[0])])
                );
            case 11:
                return (/* Theta_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](11, [erase_rel(param[0])])
                );
            case 12:
                return (/* Any_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](12, [erase_rel(param[0])])
                );
            case 13:
                return (/* Reader_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](13, [erase_rel(param[0])])
                );
            case 14:
                return (/* Ignored_reader_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](14, [erase_rel(param[0])])
                );

        }
    }
}

function concat_fmtty(fmtty1, fmtty2) {
    if (typeof fmtty1 === "number") {
        return fmtty2;
    } else {
        switch (fmtty1.tag | 0) {
            case 0:
                return (/* Char_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](0, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 1:
                return (/* String_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](1, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 2:
                return (/* Int_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](2, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 3:
                return (/* Int32_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](3, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 4:
                return (/* Nativeint_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](4, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 5:
                return (/* Int64_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](5, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 6:
                return (/* Float_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](6, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 7:
                return (/* Bool_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](7, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 8:
                return (/* Format_arg_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](8, [fmtty1[0], concat_fmtty(fmtty1[1], fmtty2)])
                );
            case 9:
                return (/* Format_subst_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](9, [fmtty1[0], fmtty1[1], concat_fmtty(fmtty1[2], fmtty2)])
                );
            case 10:
                return (/* Alpha_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](10, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 11:
                return (/* Theta_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](11, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 12:
                return (/* Any_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](12, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 13:
                return (/* Reader_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](13, [concat_fmtty(fmtty1[0], fmtty2)])
                );
            case 14:
                return (/* Ignored_reader_ty */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](14, [concat_fmtty(fmtty1[0], fmtty2)])
                );

        }
    }
}

function concat_fmt(fmt1, fmt2) {
    if (typeof fmt1 === "number") {
        return fmt2;
    } else {
        switch (fmt1.tag | 0) {
            case 0:
                return (/* Char */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](0, [concat_fmt(fmt1[0], fmt2)])
                );
            case 1:
                return (/* Caml_char */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](1, [concat_fmt(fmt1[0], fmt2)])
                );
            case 2:
                return (/* String */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](2, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 3:
                return (/* Caml_string */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](3, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 4:
                return (/* Int */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](4, [fmt1[0], fmt1[1], fmt1[2], concat_fmt(fmt1[3], fmt2)])
                );
            case 5:
                return (/* Int32 */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](5, [fmt1[0], fmt1[1], fmt1[2], concat_fmt(fmt1[3], fmt2)])
                );
            case 6:
                return (/* Nativeint */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](6, [fmt1[0], fmt1[1], fmt1[2], concat_fmt(fmt1[3], fmt2)])
                );
            case 7:
                return (/* Int64 */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](7, [fmt1[0], fmt1[1], fmt1[2], concat_fmt(fmt1[3], fmt2)])
                );
            case 8:
                return (/* Float */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](8, [fmt1[0], fmt1[1], fmt1[2], concat_fmt(fmt1[3], fmt2)])
                );
            case 9:
                return (/* Bool */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](9, [concat_fmt(fmt1[0], fmt2)])
                );
            case 10:
                return (/* Flush */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](10, [concat_fmt(fmt1[0], fmt2)])
                );
            case 11:
                return (/* String_literal */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](11, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 12:
                return (/* Char_literal */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](12, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 13:
                return (/* Format_arg */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](13, [fmt1[0], fmt1[1], concat_fmt(fmt1[2], fmt2)])
                );
            case 14:
                return (/* Format_subst */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](14, [fmt1[0], fmt1[1], concat_fmt(fmt1[2], fmt2)])
                );
            case 15:
                return (/* Alpha */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](15, [concat_fmt(fmt1[0], fmt2)])
                );
            case 16:
                return (/* Theta */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](16, [concat_fmt(fmt1[0], fmt2)])
                );
            case 17:
                return (/* Formatting_lit */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](17, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 18:
                return (/* Formatting_gen */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](18, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 19:
                return (/* Reader */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](19, [concat_fmt(fmt1[0], fmt2)])
                );
            case 20:
                return (/* Scan_char_set */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](20, [fmt1[0], fmt1[1], concat_fmt(fmt1[2], fmt2)])
                );
            case 21:
                return (/* Scan_get_counter */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](21, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 22:
                return (/* Scan_next_char */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](22, [concat_fmt(fmt1[0], fmt2)])
                );
            case 23:
                return (/* Ignored_param */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](23, [fmt1[0], concat_fmt(fmt1[1], fmt2)])
                );
            case 24:
                return (/* Custom */__WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* __ */](24, [fmt1[0], fmt1[1], concat_fmt(fmt1[2], fmt2)])
                );

        }
    }
}


/* No side effect */

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export programStateWrapper */
/* unused harmony export programLoop */
/* unused harmony export program */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return standardProgram; });
/* unused harmony export beginnerProgram */
/* unused harmony export map */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__web_js__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vdom_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tea_cmd_js__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tea_sub_js__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_builtin_exceptions_js__ = __webpack_require__(1);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE










function programStateWrapper(initModel, pump, shutdown) {
  var model = [initModel];
  var callbacks = [/* record */[/* enqueue */function () {
    console.log("INVALID enqueue CALL!");
    return (/* () */0
    );
  }]];
  var pumperInterface = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](pump, callbacks);
  var pending = [/* None */0];
  var handler = function (msg) {
    var match = pending[0];
    if (match) {
      pending[0] = /* Some */[/* :: */[msg, match[0]]];
      return (/* () */0
      );
    } else {
      pending[0] = /* Some */[/* [] */0];
      var newModel = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["b" /* _2 */](pumperInterface[/* handleMsg */2], model[0], msg);
      model[0] = newModel;
      var match$1 = pending[0];
      if (match$1) {
        var msgs = match$1[0];
        if (msgs) {
          pending[0] = /* None */0;
          return __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_list_js__["e" /* iter */](handler, __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_list_js__["h" /* rev */](msgs));
        } else {
          pending[0] = /* None */0;
          return (/* () */0
          );
        }
      } else {
        throw [__WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_builtin_exceptions_js__["d" /* failure */], "INVALID message queue state, should never be None during message processing!"];
      }
    }
  };
  var finalizedCBs = /* record */[/* enqueue */handler];
  callbacks[0] = finalizedCBs;
  var pi_requestShutdown = function () {
    callbacks[0] = /* record */[/* enqueue */function () {
      console.log("INVALID message enqueued when shut down");
      return (/* () */0
      );
    }];
    var cmd = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](shutdown, model[0]);
    __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](pumperInterface[/* shutdown */3], cmd);
    return (/* () */0
    );
  };
  var render_string = function () {
    return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](pumperInterface[/* render_string */1], model[0]);
  };
  __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](pumperInterface[/* startup */0], /* () */0);
  return {
    pushMsg: handler,
    shutdown: pi_requestShutdown,
    getHtmlString: render_string
  };
}

function programLoop(update, view, subscriptions, initModel, initCmd, param) {
  if (param) {
    var parentNode = param[0];
    return function (callbacks) {
      var priorRenderedVdom = [/* [] */0];
      var latestModel = [initModel];
      var nextFrameID = [/* None */0];
      var doRender = function () {
        var match = nextFrameID[0];
        if (match) {
          var newVdom_000 = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](view, latestModel[0]);
          var newVdom = /* :: */[newVdom_000,
          /* [] */0];
          var justRenderedVdom = __WEBPACK_IMPORTED_MODULE_2__vdom_js__["g" /* patchVNodesIntoElement */](callbacks, parentNode, priorRenderedVdom[0], newVdom);
          priorRenderedVdom[0] = justRenderedVdom;
          nextFrameID[0] = /* None */0;
          return (/* () */0
          );
        } else {
          return (/* () */0
          );
        }
      };
      var scheduleRender = function () {
        var match = nextFrameID[0];
        if (match) {
          return (/* () */0
          );
        } else {
          nextFrameID[0] = /* Some */[-1];
          return doRender(16);
        }
      };
      var clearPnode = function () {
        while (parentNode.childNodes.length > 0) {
          var match = parentNode.firstChild;
          if (match !== null) {
            parentNode.removeChild(match);
          }
        };
        return (/* () */0
        );
      };
      var oldSub = [/* NoSub */0];
      var handleSubscriptionChange = function (model) {
        var newSub = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](subscriptions, model);
        oldSub[0] = __WEBPACK_IMPORTED_MODULE_5__tea_sub_js__["b" /* run */](callbacks, callbacks, oldSub[0], newSub);
        return (/* () */0
        );
      };
      var handlerStartup = function () {
        clearPnode( /* () */0);
        __WEBPACK_IMPORTED_MODULE_4__tea_cmd_js__["d" /* run */](callbacks, initCmd);
        handleSubscriptionChange(latestModel[0]);
        nextFrameID[0] = /* Some */[-1];
        doRender(16);
        return (/* () */0
        );
      };
      var render_string = function (model) {
        return __WEBPACK_IMPORTED_MODULE_2__vdom_js__["h" /* renderToHtmlString */](__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](view, model));
      };
      var handler = function (model, msg) {
        var match = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["b" /* _2 */](update, model, msg);
        var newModel = match[0];
        latestModel[0] = newModel;
        __WEBPACK_IMPORTED_MODULE_4__tea_cmd_js__["d" /* run */](callbacks, match[1]);
        scheduleRender( /* () */0);
        handleSubscriptionChange(newModel);
        return newModel;
      };
      var handlerShutdown = function (cmd) {
        nextFrameID[0] = /* None */0;
        __WEBPACK_IMPORTED_MODULE_4__tea_cmd_js__["d" /* run */](callbacks, cmd);
        oldSub[0] = __WEBPACK_IMPORTED_MODULE_5__tea_sub_js__["b" /* run */](callbacks, callbacks, oldSub[0], /* NoSub */0);
        priorRenderedVdom[0] = /* [] */0;
        clearPnode( /* () */0);
        return (/* () */0
        );
      };
      return (/* record */[
        /* startup */handlerStartup,
        /* render_string */render_string,
        /* handleMsg */handler,
        /* shutdown */handlerShutdown]
      );
    };
  } else {
    return function (callbacks) {
      var oldSub = [/* NoSub */0];
      var handleSubscriptionChange = function (model) {
        var newSub = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](subscriptions, model);
        oldSub[0] = __WEBPACK_IMPORTED_MODULE_5__tea_sub_js__["b" /* run */](callbacks, callbacks, oldSub[0], newSub);
        return (/* () */0
        );
      };
      return (/* record */[
        /* startup */function () {
          __WEBPACK_IMPORTED_MODULE_4__tea_cmd_js__["d" /* run */](callbacks, initCmd);
          handleSubscriptionChange(initModel);
          return (/* () */0
          );
        },
        /* render_string */function (model) {
          return __WEBPACK_IMPORTED_MODULE_2__vdom_js__["h" /* renderToHtmlString */](__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](view, model));
        },
        /* handleMsg */function (model, msg) {
          var match = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["b" /* _2 */](update, model, msg);
          var newModel = match[0];
          __WEBPACK_IMPORTED_MODULE_4__tea_cmd_js__["d" /* run */](callbacks, match[1]);
          handleSubscriptionChange(newModel);
          return newModel;
        },
        /* shutdown */function (cmd) {
          __WEBPACK_IMPORTED_MODULE_4__tea_cmd_js__["d" /* run */](callbacks, cmd);
          oldSub[0] = __WEBPACK_IMPORTED_MODULE_5__tea_sub_js__["b" /* run */](callbacks, callbacks, oldSub[0], /* NoSub */0);
          return (/* () */0
          );
        }]
      );
    };
  }
}

function program(param, pnode, flags) {
  __WEBPACK_IMPORTED_MODULE_0__web_js__["a" /* polyfills */]( /* () */0);
  var match = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](param[/* init */0], flags);
  var initModel = match[0];
  var opnode = pnode == null ? /* None */0 : [pnode];
  var pumpInterface = programLoop(param[/* update */1], param[/* view */2], param[/* subscriptions */3], initModel, match[1], opnode);
  return programStateWrapper(initModel, pumpInterface, param[/* shutdown */4]);
}

function standardProgram(param, pnode, args) {
  return program( /* record */[
  /* init */param[/* init */0],
  /* update */param[/* update */1],
  /* view */param[/* view */2],
  /* subscriptions */param[/* subscriptions */3],
  /* shutdown */function () {
    return (/* NoCmd */0
    );
  }], pnode, args);
}

function beginnerProgram(param, pnode, _) {
  var update = param[/* update */1];
  var model = param[/* model */0];
  return standardProgram( /* record */[
  /* init */function () {
    return (/* tuple */[model,
      /* NoCmd */0]
    );
  },
  /* update */function (model, msg) {
    return (/* tuple */[__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["b" /* _2 */](update, model, msg),
      /* NoCmd */0]
    );
  },
  /* view */param[/* view */2],
  /* subscriptions */function () {
    return (/* NoSub */0
    );
  }], pnode, /* () */0);
}

var map = __WEBPACK_IMPORTED_MODULE_2__vdom_js__["c" /* map */];


/* No side effect */

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Event */
/* unused harmony export Node */
/* unused harmony export Document */
/* unused harmony export $$Date */
/* unused harmony export Window */
/* unused harmony export Location */
/* unused harmony export Json */
/* unused harmony export $$XMLHttpRequest */
/* unused harmony export FormData */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return polyfills; });
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE


function polyfills() {
  // remove polyfill
  (function () {
    if (!('remove' in Element.prototype)) {
      Element.prototype.remove = function () {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
      };
    };
  })();

  // requestAnimationFrame polyfill
  (function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  })();
  return (/* () */0
  );
}

var Event = 0;

var Node = 0;

var Document = 0;

var $$Date = 0;

var Window = 0;

var Location = 0;

var Json = 0;

var $$XMLHttpRequest = 0;

var FormData = 0;


/* No side effect */

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return make; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return init; });
/* unused harmony export empty */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return copy; });
/* unused harmony export of_string */
/* unused harmony export to_string */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return sub; });
/* unused harmony export sub_string */
/* unused harmony export extend */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return fill; });
/* unused harmony export blit */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return blit_string; });
/* unused harmony export concat */
/* unused harmony export cat */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return iter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return iteri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return mapi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return trim; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return escaped; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return index; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return rindex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return index_from; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return rindex_from; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return contains; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return contains_from; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return rcontains_from; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return uppercase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return lowercase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return uncapitalize; });
/* unused harmony export compare */
/* unused harmony export unsafe_to_string */
/* unused harmony export unsafe_of_string */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__char_js__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__caml_obj_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__caml_int32_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pervasives_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__caml_string_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__ = __webpack_require__(1);











function make(n, c) {
  var s = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](n);
  __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["f" /* caml_fill_string */](s, 0, n, c);
  return s;
}

function init(n, f) {
  var s = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](n);
  for (var i = 0, i_finish = n - 1 | 0; i <= i_finish; ++i) {
    s[i] = __WEBPACK_IMPORTED_MODULE_2__curry_js__["a" /* _1 */](f, i);
  }
  return s;
}

var empty = [];

function copy(s) {
  var len = s.length;
  var r = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](len);
  __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["c" /* caml_blit_bytes */](s, 0, r, 0, len);
  return r;
}

function to_string(b) {
  return __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["b" /* bytes_to_string */](copy(b));
}

function of_string(s) {
  return copy(__WEBPACK_IMPORTED_MODULE_6__caml_string_js__["a" /* bytes_of_string */](s));
}

function sub(s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.sub / Bytes.sub"];
  } else {
    var r = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](len);
    __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["c" /* caml_blit_bytes */](s, ofs, r, 0, len);
    return r;
  }
}

function sub_string(b, ofs, len) {
  return __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["b" /* bytes_to_string */](sub(b, ofs, len));
}

function extend(s, left, right) {
  var len = (s.length + left | 0) + right | 0;
  var r = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](len);
  var match = left < 0 ? /* tuple */[-left | 0, 0] : /* tuple */[0, left];
  var dstoff = match[1];
  var srcoff = match[0];
  var cpylen = __WEBPACK_IMPORTED_MODULE_5__pervasives_js__["c" /* min */](s.length - srcoff | 0, len - dstoff | 0);
  if (cpylen > 0) {
    __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["c" /* caml_blit_bytes */](s, srcoff, r, dstoff, cpylen);
  }
  return r;
}

function fill(s, ofs, len, c) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.fill / Bytes.fill"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["f" /* caml_fill_string */](s, ofs, len, c);
  }
}

function blit(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "Bytes.blit"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["c" /* caml_blit_bytes */](s1, ofs1, s2, ofs2, len);
  }
}

function blit_string(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.blit / Bytes.blit_string"];
  } else {
    return __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["d" /* caml_blit_string */](s1, ofs1, s2, ofs2, len);
  }
}

function iter(f, a) {
  for (var i = 0, i_finish = a.length - 1 | 0; i <= i_finish; ++i) {
    __WEBPACK_IMPORTED_MODULE_2__curry_js__["a" /* _1 */](f, a[i]);
  }
  return (/* () */0
  );
}

function iteri(f, a) {
  for (var i = 0, i_finish = a.length - 1 | 0; i <= i_finish; ++i) {
    __WEBPACK_IMPORTED_MODULE_2__curry_js__["b" /* _2 */](f, i, a[i]);
  }
  return (/* () */0
  );
}

function concat(sep, l) {
  if (l) {
    var hd = l[0];
    var num = [0];
    var len = [0];
    __WEBPACK_IMPORTED_MODULE_1__list_js__["e" /* iter */](function (s) {
      num[0] = num[0] + 1 | 0;
      len[0] = len[0] + s.length | 0;
      return (/* () */0
      );
    }, l);
    var r = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](len[0] + __WEBPACK_IMPORTED_MODULE_4__caml_int32_js__["b" /* imul */](sep.length, num[0] - 1 | 0) | 0);
    __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["c" /* caml_blit_bytes */](hd, 0, r, 0, hd.length);
    var pos = [hd.length];
    __WEBPACK_IMPORTED_MODULE_1__list_js__["e" /* iter */](function (s) {
      __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["c" /* caml_blit_bytes */](sep, 0, r, pos[0], sep.length);
      pos[0] = pos[0] + sep.length | 0;
      __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["c" /* caml_blit_bytes */](s, 0, r, pos[0], s.length);
      pos[0] = pos[0] + s.length | 0;
      return (/* () */0
      );
    }, l[1]);
    return r;
  } else {
    return empty;
  }
}

function cat(a, b) {
  return a.concat(b);
}

function is_space(param) {
  var switcher = param - 9 | 0;
  if (switcher > 4 || switcher < 0) {
    if (switcher !== 23) {
      return (/* false */0
      );
    } else {
      return (/* true */1
      );
    }
  } else if (switcher !== 2) {
    return (/* true */1
    );
  } else {
    return (/* false */0
    );
  }
}

function trim(s) {
  var len = s.length;
  var i = 0;
  while (i < len && is_space(s[i])) {
    i = i + 1 | 0;
  };
  var j = len - 1 | 0;
  while (j >= i && is_space(s[j])) {
    j = j - 1 | 0;
  };
  if (j >= i) {
    return sub(s, i, (j - i | 0) + 1 | 0);
  } else {
    return empty;
  }
}

function escaped(s) {
  var n = 0;
  for (var i = 0, i_finish = s.length - 1 | 0; i <= i_finish; ++i) {
    var match = s[i];
    var tmp;
    if (match >= 32) {
      var switcher = match - 34 | 0;
      tmp = switcher > 58 || switcher < 0 ? switcher >= 93 ? 4 : 1 : switcher > 57 || switcher < 1 ? 2 : 1;
    } else {
      tmp = match >= 11 ? match !== 13 ? 4 : 2 : match >= 8 ? 2 : 4;
    }
    n = n + tmp | 0;
  }
  if (n === s.length) {
    return copy(s);
  } else {
    var s$prime = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](n);
    n = 0;
    for (var i$1 = 0, i_finish$1 = s.length - 1 | 0; i$1 <= i_finish$1; ++i$1) {
      var c = s[i$1];
      var exit = 0;
      if (c >= 35) {
        if (c !== 92) {
          if (c >= 127) {
            exit = 1;
          } else {
            s$prime[n] = c;
          }
        } else {
          exit = 2;
        }
      } else if (c >= 32) {
        if (c >= 34) {
          exit = 2;
        } else {
          s$prime[n] = c;
        }
      } else if (c >= 14) {
        exit = 1;
      } else {
        switch (c) {
          case 8:
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = /* "b" */98;
            break;
          case 9:
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = /* "t" */116;
            break;
          case 10:
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = /* "n" */110;
            break;
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 11:
          case 12:
            exit = 1;
            break;
          case 13:
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = /* "r" */114;
            break;

        }
      }
      switch (exit) {
        case 1:
          s$prime[n] = /* "\\" */92;
          n = n + 1 | 0;
          s$prime[n] = 48 + (c / 100 | 0) | 0;
          n = n + 1 | 0;
          s$prime[n] = 48 + (c / 10 | 0) % 10 | 0;
          n = n + 1 | 0;
          s$prime[n] = 48 + c % 10 | 0;
          break;
        case 2:
          s$prime[n] = /* "\\" */92;
          n = n + 1 | 0;
          s$prime[n] = c;
          break;

      }
      n = n + 1 | 0;
    }
    return s$prime;
  }
}

function map(f, s) {
  var l = s.length;
  if (l) {
    var r = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](l);
    for (var i = 0, i_finish = l - 1 | 0; i <= i_finish; ++i) {
      r[i] = __WEBPACK_IMPORTED_MODULE_2__curry_js__["a" /* _1 */](f, s[i]);
    }
    return r;
  } else {
    return s;
  }
}

function mapi(f, s) {
  var l = s.length;
  if (l) {
    var r = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["e" /* caml_create_string */](l);
    for (var i = 0, i_finish = l - 1 | 0; i <= i_finish; ++i) {
      r[i] = __WEBPACK_IMPORTED_MODULE_2__curry_js__["b" /* _2 */](f, i, s[i]);
    }
    return r;
  } else {
    return s;
  }
}

function uppercase(s) {
  return map(__WEBPACK_IMPORTED_MODULE_0__char_js__["b" /* uppercase */], s);
}

function lowercase(s) {
  return map(__WEBPACK_IMPORTED_MODULE_0__char_js__["a" /* lowercase */], s);
}

function apply1(f, s) {
  if (s.length) {
    var r = copy(s);
    r[0] = __WEBPACK_IMPORTED_MODULE_2__curry_js__["a" /* _1 */](f, s[0]);
    return r;
  } else {
    return s;
  }
}

function capitalize(s) {
  return apply1(__WEBPACK_IMPORTED_MODULE_0__char_js__["b" /* uppercase */], s);
}

function uncapitalize(s) {
  return apply1(__WEBPACK_IMPORTED_MODULE_0__char_js__["a" /* lowercase */], s);
}

function index_rec(s, lim, _i, c) {
  while (true) {
    var i = _i;
    if (i >= lim) {
      throw __WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["g" /* not_found */];
    } else if (s[i] === c) {
      return i;
    } else {
      _i = i + 1 | 0;
      continue;
    }
  };
}

function index(s, c) {
  return index_rec(s, s.length, 0, c);
}

function index_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.index_from / Bytes.index_from"];
  } else {
    return index_rec(s, l, i, c);
  }
}

function rindex_rec(s, _i, c) {
  while (true) {
    var i = _i;
    if (i < 0) {
      throw __WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["g" /* not_found */];
    } else if (s[i] === c) {
      return i;
    } else {
      _i = i - 1 | 0;
      continue;
    }
  };
}

function rindex(s, c) {
  return rindex_rec(s, s.length - 1 | 0, c);
}

function rindex_from(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.rindex_from / Bytes.rindex_from"];
  } else {
    return rindex_rec(s, i, c);
  }
}

function contains_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.contains_from / Bytes.contains_from"];
  } else {
    try {
      index_rec(s, l, i, c);
      return (/* true */1
      );
    } catch (exn) {
      if (exn === __WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["g" /* not_found */]) {
        return (/* false */0
        );
      } else {
        throw exn;
      }
    }
  }
}

function contains(s, c) {
  return contains_from(s, 0, c);
}

function rcontains_from(s, i, c) {
  if (i < 0 || i >= s.length) {
    throw [__WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["e" /* invalid_argument */], "String.rcontains_from / Bytes.rcontains_from"];
  } else {
    try {
      rindex_rec(s, i, c);
      return (/* true */1
      );
    } catch (exn) {
      if (exn === __WEBPACK_IMPORTED_MODULE_7__caml_builtin_exceptions_js__["g" /* not_found */]) {
        return (/* false */0
        );
      } else {
        throw exn;
      }
    }
  }
}

var compare = __WEBPACK_IMPORTED_MODULE_3__caml_obj_js__["a" /* caml_compare */];

var unsafe_to_string = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["b" /* bytes_to_string */];

var unsafe_of_string = __WEBPACK_IMPORTED_MODULE_6__caml_string_js__["a" /* bytes_of_string */];


/* No side effect */

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export chr */
/* unused harmony export escaped */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return lowercase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return uppercase; });
/* unused harmony export compare */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caml_string_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__ = __webpack_require__(1);





function chr(n) {
  if (n < 0 || n > 255) {
    throw [__WEBPACK_IMPORTED_MODULE_1__caml_builtin_exceptions_js__["e" /* invalid_argument */], "Char.chr"];
  } else {
    return n;
  }
}

function escaped(c) {
  var exit = 0;
  if (c >= 40) {
    if (c !== 92) {
      exit = c >= 127 ? 1 : 2;
    } else {
      return "\\\\";
    }
  } else if (c >= 32) {
    if (c >= 39) {
      return "\\'";
    } else {
      exit = 2;
    }
  } else if (c >= 14) {
    exit = 1;
  } else {
    switch (c) {
      case 8:
        return "\\b";
      case 9:
        return "\\t";
      case 10:
        return "\\n";
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 11:
      case 12:
        exit = 1;
        break;
      case 13:
        return "\\r";

    }
  }
  switch (exit) {
    case 1:
      var s = new Array(4);
      s[0] = /* "\\" */92;
      s[1] = 48 + (c / 100 | 0) | 0;
      s[2] = 48 + (c / 10 | 0) % 10 | 0;
      s[3] = 48 + c % 10 | 0;
      return __WEBPACK_IMPORTED_MODULE_0__caml_string_js__["b" /* bytes_to_string */](s);
    case 2:
      var s$1 = new Array(1);
      s$1[0] = c;
      return __WEBPACK_IMPORTED_MODULE_0__caml_string_js__["b" /* bytes_to_string */](s$1);

  }
}

function lowercase(c) {
  if (c >= /* "A" */65 && c <= /* "Z" */90 || c >= /* "\192" */192 && c <= /* "\214" */214 || c >= /* "\216" */216 && c <= /* "\222" */222) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function uppercase(c) {
  if (c >= /* "a" */97 && c <= /* "z" */122 || c >= /* "\224" */224 && c <= /* "\246" */246 || c >= /* "\248" */248 && c <= /* "\254" */254) {
    return c - 32 | 0;
  } else {
    return c;
  }
}

function compare(c1, c2) {
  return c1 - c2 | 0;
}


/* No side effect */

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export style */
/* unused harmony export getStyle */
/* unused harmony export setStyle */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return setStyleProperty; });
/* unused harmony export childNodes */
/* unused harmony export firstChild */
/* unused harmony export appendChild */
/* unused harmony export removeChild */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return insertBefore; });
/* unused harmony export remove */
/* unused harmony export setAttributeNS */
/* unused harmony export setAttribute */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return setAttributeNsOptional; });
/* unused harmony export removeAttributeNS */
/* unused harmony export removeAttribute */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return removeAttributeNsOptional; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addEventListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return removeEventListener; });
/* unused harmony export focus */
/* unused harmony export set_nodeValue */
/* unused harmony export get_nodeValue */
/* unused harmony export remove_polyfill */
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE


function style(n) {
  return n.style;
}

function getStyle(n, key) {
  return n.style[key];
}

function setStyle(n, key, value) {
  n.style[key] = value;
  return (/* () */0
  );
}

function setStyleProperty(n, $staropt$star, key, value) {
  var priority = $staropt$star ? $staropt$star[0] : /* false */0;
  var style = n.style;
  var match = style.setProperty;
  if (match !== undefined) {
    return style.setProperty(key, value, priority ? "important" : null);
  } else {
    return setStyle(n, key, value);
  }
}

function childNodes(n) {
  return n.childNodes;
}

function firstChild(n) {
  return n.firstChild;
}

function appendChild(n, child) {
  return n.appendChild(child);
}

function removeChild(n, child) {
  return n.removeChild(child);
}

function insertBefore(n, child, refNode) {
  return n.insertBefore(child, refNode);
}

function remove(n, child) {
  return n.remove(child);
}

function setAttributeNS(n, namespace, key, value) {
  return n.setAttributeNS(namespace, key, value);
}

function setAttribute(n, key, value) {
  return n.setAttribute(key, value);
}

function setAttributeNsOptional(n, namespace, key, value) {
  if (namespace === "") {
    return n.setAttribute(key, value);
  } else {
    return n.setAttributeNS(namespace, key, value);
  }
}

function removeAttributeNS(n, namespace, key) {
  return n.removeAttributeNS(namespace, key);
}

function removeAttribute(n, key) {
  return n.removeAttribute(key);
}

function removeAttributeNsOptional(n, namespace, key) {
  if (namespace === "") {
    return n.removeAttribute(key);
  } else {
    return n.removeAttributeNS(namespace, key);
  }
}

function addEventListener(n, typ, listener, options) {
  return n.addEventListener(typ, listener, options);
}

function removeEventListener(n, typ, listener, options) {
  return n.removeEventListener(typ, listener, options);
}

function focus(n) {
  return n.focus();
}

function set_nodeValue(n, text) {
  return n.nodeValue = text;
}

function get_nodeValue(n) {
  return n.nodeValue;
}

function remove_polyfill() {
  return (
    // remove polyfill
    function () {
      if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function () {
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        };
      };
    }()
  );
}


/* No side effect */

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export body */
/* unused harmony export createElement */
/* unused harmony export createElementNS */
/* unused harmony export createComment */
/* unused harmony export createTextNode */
/* unused harmony export getElementById */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createElementNsOptional; });
/* unused harmony export $$location */
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE


function body() {
  return document.body;
}

function createElement(typ) {
  return document.createElement(typ);
}

function createElementNS(namespace, key) {
  return document.createElementNS(namespace, key);
}

function createComment(text) {
  return document.createComment(text);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function getElementById(id) {
  return document.getElementById(id);
}

function createElementNsOptional(namespace, tagName) {
  if (namespace === "") {
    return document.createElement(tagName);
  } else {
    return document.createElementNS(namespace, tagName);
  }
}

function $$location() {
  return document.location;
}


/* No side effect */

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Cmds */
/* unused harmony export Attributes */
/* unused harmony export Events */
/* unused harmony export svgNamespace */
/* unused harmony export noNode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return text; });
/* unused harmony export lazy1 */
/* unused harmony export node */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return svg; });
/* unused harmony export foreignObject */
/* unused harmony export animate */
/* unused harmony export animateColor */
/* unused harmony export animateMotion */
/* unused harmony export animateTransform */
/* unused harmony export mpath */
/* unused harmony export set */
/* unused harmony export a */
/* unused harmony export defs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return g; });
/* unused harmony export marker */
/* unused harmony export mask */
/* unused harmony export missingGlyph */
/* unused harmony export pattern */
/* unused harmony export $$switch */
/* unused harmony export symbol */
/* unused harmony export desc */
/* unused harmony export metadata */
/* unused harmony export title */
/* unused harmony export feBlend */
/* unused harmony export feColorMatrix */
/* unused harmony export feComponentTransfer */
/* unused harmony export feComposite */
/* unused harmony export feConvolveMatrix */
/* unused harmony export feDiffuseLighting */
/* unused harmony export feDisplacementMap */
/* unused harmony export feFlood */
/* unused harmony export feFuncA */
/* unused harmony export feFuncB */
/* unused harmony export feFuncG */
/* unused harmony export feFuncR */
/* unused harmony export feGaussianBlur */
/* unused harmony export feImage */
/* unused harmony export feMerge */
/* unused harmony export feMergeNode */
/* unused harmony export feMorphology */
/* unused harmony export feOffset */
/* unused harmony export feSpecularLighting */
/* unused harmony export feTile */
/* unused harmony export feTurbulence */
/* unused harmony export font */
/* unused harmony export fontFace */
/* unused harmony export fontFaceFormat */
/* unused harmony export fontFaceName */
/* unused harmony export fontFaceSrc */
/* unused harmony export fontFaceUri */
/* unused harmony export hkern */
/* unused harmony export vkern */
/* unused harmony export linearGradient */
/* unused harmony export radialGradient */
/* unused harmony export stop */
/* unused harmony export circle */
/* unused harmony export ellipse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return svgimage; });
/* unused harmony export line */
/* unused harmony export path */
/* unused harmony export polygon */
/* unused harmony export polyline */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return rect; });
/* unused harmony export use */
/* unused harmony export feDistantLight */
/* unused harmony export fePointLight */
/* unused harmony export feSpotLight */
/* unused harmony export altGlyph */
/* unused harmony export altGlyphDef */
/* unused harmony export altGlyphItem */
/* unused harmony export glyph */
/* unused harmony export glyphRef */
/* unused harmony export textPath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return text$prime; });
/* unused harmony export tref */
/* unused harmony export tspan */
/* unused harmony export clipPath */
/* unused harmony export svgcolorProfile */
/* unused harmony export cursor */
/* unused harmony export filter */
/* unused harmony export script */
/* unused harmony export style */
/* unused harmony export view */
/* unused harmony export image */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vdom_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__ = __webpack_require__(4);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE





var svgNamespace = "http://www.w3.org/2000/svg";

function text(str) {
  return (/* Text */__WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_block_js__["a" /* __ */](1, [str])
  );
}

var lazy1 = __WEBPACK_IMPORTED_MODULE_0__vdom_js__["b" /* lazyGen */];

function node(tagName, $staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, tagName, key, unique, props, nodes);
}

function svg($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "svg", key, unique, props, nodes);
}

function foreignObject($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "foreignObject", key, unique, props, nodes);
}

function animate($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "animate", key, unique, props, nodes);
}

function animateColor($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "animateColor", key, unique, props, nodes);
}

function animateMotion($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "animateMotion", key, unique, props, nodes);
}

function animateTransform($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "animateTransform", key, unique, props, nodes);
}

function mpath($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "mpath", key, unique, props, nodes);
}

function set($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "set", key, unique, props, nodes);
}

function a($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "a", key, unique, props, nodes);
}

function defs($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "defs", key, unique, props, nodes);
}

function g($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "g", key, unique, props, nodes);
}

function marker($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "marker", key, unique, props, nodes);
}

function mask($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "mask", key, unique, props, nodes);
}

function missingGlyph($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "missingGlyph", key, unique, props, nodes);
}

function pattern($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "pattern", key, unique, props, nodes);
}

function $$switch($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "switch", key, unique, props, nodes);
}

function symbol($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "symbol", key, unique, props, nodes);
}

function desc($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "desc", key, unique, props, nodes);
}

function metadata($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "metadata", key, unique, props, nodes);
}

function title($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "title", key, unique, props, nodes);
}

function feBlend($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feBlend", key, unique, props, nodes);
}

function feColorMatrix($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feColorMatrix", key, unique, props, nodes);
}

function feComponentTransfer($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feComponentTransfer", key, unique, props, nodes);
}

function feComposite($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feComposite", key, unique, props, nodes);
}

function feConvolveMatrix($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feConvolveMatrix", key, unique, props, nodes);
}

function feDiffuseLighting($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feDiffuseLighting", key, unique, props, nodes);
}

function feDisplacementMap($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feDisplacementMap", key, unique, props, nodes);
}

function feFlood($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feFlood", key, unique, props, nodes);
}

function feFuncA($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feFuncA", key, unique, props, nodes);
}

function feFuncB($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feFuncB", key, unique, props, nodes);
}

function feFuncG($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feFuncG", key, unique, props, nodes);
}

function feFuncR($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feFuncR", key, unique, props, nodes);
}

function feGaussianBlur($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feGaussianBlur", key, unique, props, nodes);
}

function feImage($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feImage", key, unique, props, nodes);
}

function feMerge($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feMerge", key, unique, props, nodes);
}

function feMergeNode($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feMergeNode", key, unique, props, nodes);
}

function feMorphology($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feMorphology", key, unique, props, nodes);
}

function feOffset($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feOffset", key, unique, props, nodes);
}

function feSpecularLighting($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feSpecularLighting", key, unique, props, nodes);
}

function feTile($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feTile", key, unique, props, nodes);
}

function feTurbulence($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feTurbulence", key, unique, props, nodes);
}

function font($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "font", key, unique, props, nodes);
}

function fontFace($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "fontFace", key, unique, props, nodes);
}

function fontFaceFormat($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "fontFaceFormat", key, unique, props, nodes);
}

function fontFaceName($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "fontFaceName", key, unique, props, nodes);
}

function fontFaceSrc($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "fontFaceSrc", key, unique, props, nodes);
}

function fontFaceUri($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "fontFaceUri", key, unique, props, nodes);
}

function hkern($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "hkern", key, unique, props, nodes);
}

function vkern($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "vkern", key, unique, props, nodes);
}

function linearGradient($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "linearGradient", key, unique, props, nodes);
}

function radialGradient($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "radialGradient", key, unique, props, nodes);
}

function stop($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "stop", key, unique, props, nodes);
}

function circle($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "circle", key, unique, props, nodes);
}

function ellipse($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "ellipse", key, unique, props, nodes);
}

function svgimage($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "image", key, unique, props, nodes);
}

function line($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "line", key, unique, props, nodes);
}

function path($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "path", key, unique, props, nodes);
}

function polygon($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "polygon", key, unique, props, nodes);
}

function polyline($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "polyline", key, unique, props, nodes);
}

function rect($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "rect", key, unique, props, nodes);
}

function use($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "use", key, unique, props, nodes);
}

function feDistantLight($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feDistantLight", key, unique, props, nodes);
}

function fePointLight($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "fePointLight", key, unique, props, nodes);
}

function feSpotLight($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "feSpotLight", key, unique, props, nodes);
}

function altGlyph($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "altGlyph", key, unique, props, nodes);
}

function altGlyphDef($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "altGlyphDef", key, unique, props, nodes);
}

function altGlyphItem($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "altGlyphItem", key, unique, props, nodes);
}

function glyph($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "glyph", key, unique, props, nodes);
}

function glyphRef($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "glyphRef", key, unique, props, nodes);
}

function textPath($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "textPath", key, unique, props, nodes);
}

function text$prime($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "text", key, unique, props, nodes);
}

function tref($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "tref", key, unique, props, nodes);
}

function tspan($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "tspan", key, unique, props, nodes);
}

function clipPath($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "clipPath", key, unique, props, nodes);
}

function svgcolorProfile($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "colorProfile", key, unique, props, nodes);
}

function cursor($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "cursor", key, unique, props, nodes);
}

function filter($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "filter", key, unique, props, nodes);
}

function script($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "script", key, unique, props, nodes);
}

function style($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "style", key, unique, props, nodes);
}

function view($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "view", key, unique, props, nodes);
}

function image($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_0__vdom_js__["a" /* fullnode */](svgNamespace, "image", key, unique, props, nodes);
}

var Cmds = 0;

var Attributes = 0;

var Events = 0;

var noNode = __WEBPACK_IMPORTED_MODULE_0__vdom_js__["d" /* noNode */];


/* No side effect */

/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Cmds */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return noNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return text; });
/* unused harmony export lazy1 */
/* unused harmony export node */
/* unused harmony export br */
/* unused harmony export br$prime */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return div; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return span; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return p; });
/* unused harmony export pre */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return a; });
/* unused harmony export section */
/* unused harmony export header */
/* unused harmony export footer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return h1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return h2; });
/* unused harmony export h3 */
/* unused harmony export h4 */
/* unused harmony export h5 */
/* unused harmony export h6 */
/* unused harmony export i */
/* unused harmony export strong */
/* unused harmony export button */
/* unused harmony export input$prime */
/* unused harmony export textarea */
/* unused harmony export label */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return ul; });
/* unused harmony export ol */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return li; });
/* unused harmony export table */
/* unused harmony export thead */
/* unused harmony export tfoot */
/* unused harmony export tbody */
/* unused harmony export th */
/* unused harmony export tr */
/* unused harmony export td */
/* unused harmony export progress */
/* unused harmony export img */
/* unused harmony export select */
/* unused harmony export option$prime */
/* unused harmony export form */
/* unused harmony export nav */
/* unused harmony export main */
/* unused harmony export aside */
/* unused harmony export article */
/* unused harmony export details */
/* unused harmony export figcaption */
/* unused harmony export figure */
/* unused harmony export mark */
/* unused harmony export summary */
/* unused harmony export time */
/* unused harmony export noProp */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return id; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return href; });
/* unused harmony export src */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return class$prime; });
/* unused harmony export classList */
/* unused harmony export type$prime */
/* unused harmony export style */
/* unused harmony export styles */
/* unused harmony export placeholder */
/* unused harmony export autofocus */
/* unused harmony export value */
/* unused harmony export name */
/* unused harmony export checked */
/* unused harmony export for$prime */
/* unused harmony export hidden */
/* unused harmony export target */
/* unused harmony export action */
/* unused harmony export method$prime */
/* unused harmony export onCB */
/* unused harmony export onMsg */
/* unused harmony export onInputOpt */
/* unused harmony export onInput */
/* unused harmony export onChangeOpt */
/* unused harmony export onChange */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return onClick; });
/* unused harmony export onDoubleClick */
/* unused harmony export onBlur */
/* unused harmony export onFocus */
/* unused harmony export onCheckOpt */
/* unused harmony export onCheck */
/* unused harmony export onMouseDown */
/* unused harmony export onMouseUp */
/* unused harmony export onMouseEnter */
/* unused harmony export onMouseLeave */
/* unused harmony export onMouseOver */
/* unused harmony export onMouseOut */
/* unused harmony export Attributes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vdom_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bs_platform_lib_es6_string_js__ = __webpack_require__(37);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE








function text(str) {
  return (/* Text */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, [str])
  );
}

var lazy1 = __WEBPACK_IMPORTED_MODULE_1__vdom_js__["b" /* lazyGen */];

function node($staropt$star, tagName, $staropt$star$1, $staropt$star$2, props, nodes) {
  var namespace = $staropt$star ? $staropt$star[0] : "";
  var key = $staropt$star$1 ? $staropt$star$1[0] : "";
  var unique = $staropt$star$2 ? $staropt$star$2[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */](namespace, tagName, key, unique, props, nodes);
}

function br(props) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "br", "br", "br", props, /* [] */0);
}

function br$prime($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "br", key, unique, props, nodes);
}

function div($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "div", key, unique, props, nodes);
}

function span($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "span", key, unique, props, nodes);
}

function p($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "p", key, unique, props, nodes);
}

function pre($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "pre", key, unique, props, nodes);
}

function a($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "a", key, unique, props, nodes);
}

function section($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "section", key, unique, props, nodes);
}

function header($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "header", key, unique, props, nodes);
}

function footer($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "footer", key, unique, props, nodes);
}

function h1($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "h1", key, unique, props, nodes);
}

function h2($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "h2", key, unique, props, nodes);
}

function h3($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "h3", key, unique, props, nodes);
}

function h4($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "h4", key, unique, props, nodes);
}

function h5($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "h5", key, unique, props, nodes);
}

function h6($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "h6", key, unique, props, nodes);
}

function i($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "i", key, unique, props, nodes);
}

function strong($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "strong", key, unique, props, nodes);
}

function button($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "button", key, unique, props, nodes);
}

function input$prime($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "input", key, unique, props, nodes);
}

function textarea($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "textarea", key, unique, props, nodes);
}

function label($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "label", key, unique, props, nodes);
}

function ul($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "ul", key, unique, props, nodes);
}

function ol($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "ol", key, unique, props, nodes);
}

function li($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "li", key, unique, props, nodes);
}

function table($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "table", key, unique, props, nodes);
}

function thead($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "thead", key, unique, props, nodes);
}

function tfoot($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "tfoot", key, unique, props, nodes);
}

function tbody($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "tbody", key, unique, props, nodes);
}

function th($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "th", key, unique, props, nodes);
}

function tr($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "tr", key, unique, props, nodes);
}

function td($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "td", key, unique, props, nodes);
}

function progress($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "progress", key, unique, props, nodes);
}

function img($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "img", key, unique, props, nodes);
}

function select($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "select", key, unique, props, nodes);
}

function option$prime($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "option", key, unique, props, nodes);
}

function form($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "form", key, unique, props, nodes);
}

function nav($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "nav", key, unique, props, nodes);
}

function main($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "main", key, unique, props, nodes);
}

function aside($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "aside", key, unique, props, nodes);
}

function article($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "article", key, unique, props, nodes);
}

function details($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "details", key, unique, props, nodes);
}

function figcaption($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "figcaption", key, unique, props, nodes);
}

function figure($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "figure", key, unique, props, nodes);
}

function mark($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "mark", key, unique, props, nodes);
}

function summary($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "summary", key, unique, props, nodes);
}

function time($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["a" /* fullnode */]("", "time", key, unique, props, nodes);
}

function id(str) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["id", str])
  );
}

function href(str) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "href", str])
  );
}

function src(str) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "src", str])
  );
}

function class$prime(name) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["className", name])
  );
}

function classList(classes) {
  var name = __WEBPACK_IMPORTED_MODULE_4_bs_platform_lib_es6_string_js__["a" /* concat */](" ", __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["g" /* map */](function (param) {
    return param[0];
  }, __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["a" /* filter */](function (param) {
    return param[1];
  })(classes)));
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["className", name])
  );
}

function type$prime(typ) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["type", typ])
  );
}

var style = __WEBPACK_IMPORTED_MODULE_1__vdom_js__["i" /* style */];

function styles(s) {
  return (/* Style */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](4, [s])
  );
}

function placeholder(str) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["placeholder", str])
  );
}

function autofocus(b) {
  if (b) {
    return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["autofocus", "autofocus"])
    );
  } else {
    return (/* NoProp */0
    );
  }
}

function value(str) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["value", str])
  );
}

function name(str) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["name", str])
  );
}

function checked(b) {
  if (b) {
    return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["checked", "checked"])
    );
  } else {
    return (/* NoProp */0
    );
  }
}

function for$prime(str) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["htmlFor", str])
  );
}

function hidden(b) {
  if (b) {
    return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["hidden", "hidden"])
    );
  } else {
    return (/* NoProp */0
    );
  }
}

function target(t) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["target", t])
  );
}

function action(a) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["action", a])
  );
}

function method$prime(m) {
  return (/* RawProp */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](0, ["method", m])
  );
}

var onCB = __WEBPACK_IMPORTED_MODULE_1__vdom_js__["e" /* onCB */];

var onMsg = __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */];

function onInputOpt($staropt$star, msg) {
  var key = $staropt$star ? $staropt$star[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["e" /* onCB */]("input", key, function (ev) {
    var match = ev.target;
    if (match !== undefined) {
      var match$1 = match.value;
      if (match$1 !== undefined) {
        return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](msg, match$1);
      } else {
        return (/* None */0
        );
      }
    } else {
      return (/* None */0
      );
    }
  });
}

function onInput($staropt$star, msg) {
  var key = $staropt$star ? $staropt$star[0] : "";
  return onInputOpt( /* Some */[key], function (ev) {
    return (/* Some */[__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](msg, ev)]
    );
  });
}

function onChangeOpt($staropt$star, msg) {
  var key = $staropt$star ? $staropt$star[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["e" /* onCB */]("change", key, function (ev) {
    var match = ev.target;
    if (match !== undefined) {
      var match$1 = match.value;
      if (match$1 !== undefined) {
        return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](msg, match$1);
      } else {
        return (/* None */0
        );
      }
    } else {
      return (/* None */0
      );
    }
  });
}

function onChange($staropt$star, msg) {
  var key = $staropt$star ? $staropt$star[0] : "";
  return onChangeOpt( /* Some */[key], function (ev) {
    return (/* Some */[__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](msg, ev)]
    );
  });
}

function onClick(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("click", msg);
}

function onDoubleClick(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("dblclick", msg);
}

function onBlur(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("blur", msg);
}

function onFocus(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("focus", msg);
}

function onCheckOpt($staropt$star, msg) {
  var key = $staropt$star ? $staropt$star[0] : "";
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["e" /* onCB */]("change", key, function (ev) {
    var match = ev.target;
    if (match !== undefined) {
      var match$1 = match.checked;
      if (match$1 !== undefined) {
        return __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](msg, match$1);
      } else {
        return (/* None */0
        );
      }
    } else {
      return (/* None */0
      );
    }
  });
}

function onCheck($staropt$star, msg) {
  var key = $staropt$star ? $staropt$star[0] : "";
  return onCheckOpt( /* Some */[key], function (ev) {
    return (/* Some */[__WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_curry_js__["a" /* _1 */](msg, ev)]
    );
  });
}

function onMouseDown(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("mousedown", msg);
}

function onMouseUp(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("mouseup", msg);
}

function onMouseEnter(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("mouseenter", msg);
}

function onMouseLeave(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("mouseleave", msg);
}

function onMouseOver(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("mouseover", msg);
}

function onMouseOut(msg) {
  return __WEBPACK_IMPORTED_MODULE_1__vdom_js__["f" /* onMsg */]("mouseout", msg);
}

function max(value) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "max", value])
  );
}

function min(value) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "min", value])
  );
}

function step(value) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "step", value])
  );
}

function disabled(b) {
  if (b) {
    return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "disabled", "true"])
    );
  } else {
    return (/* NoProp */0
    );
  }
}

function selected(b) {
  if (b) {
    return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "selected", "true"])
    );
  } else {
    return (/* NoProp */0
    );
  }
}

function acceptCharset(c) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "accept-charset", c])
  );
}

function rel(value) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "rel", value])
  );
}

var Attributes = /* module */[
/* max */max,
/* min */min,
/* step */step,
/* disabled */disabled,
/* selected */selected,
/* acceptCharset */acceptCharset,
/* rel */rel];

var Cmds = 0;

var noNode = __WEBPACK_IMPORTED_MODULE_1__vdom_js__["d" /* noNode */];

var noProp = /* NoProp */0;


/* No side effect */

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  addDays: __webpack_require__(9),
  addHours: __webpack_require__(40),
  addISOYears: __webpack_require__(41),
  addMilliseconds: __webpack_require__(10),
  addMinutes: __webpack_require__(43),
  addMonths: __webpack_require__(20),
  addQuarters: __webpack_require__(44),
  addSeconds: __webpack_require__(45),
  addWeeks: __webpack_require__(25),
  addYears: __webpack_require__(46),
  areRangesOverlapping: __webpack_require__(93),
  closestIndexTo: __webpack_require__(94),
  closestTo: __webpack_require__(95),
  compareAsc: __webpack_require__(12),
  compareDesc: __webpack_require__(26),
  differenceInCalendarDays: __webpack_require__(19),
  differenceInCalendarISOWeeks: __webpack_require__(96),
  differenceInCalendarISOYears: __webpack_require__(47),
  differenceInCalendarMonths: __webpack_require__(48),
  differenceInCalendarQuarters: __webpack_require__(97),
  differenceInCalendarWeeks: __webpack_require__(98),
  differenceInCalendarYears: __webpack_require__(50),
  differenceInDays: __webpack_require__(51),
  differenceInHours: __webpack_require__(99),
  differenceInISOYears: __webpack_require__(100),
  differenceInMilliseconds: __webpack_require__(21),
  differenceInMinutes: __webpack_require__(101),
  differenceInMonths: __webpack_require__(27),
  differenceInQuarters: __webpack_require__(102),
  differenceInSeconds: __webpack_require__(28),
  differenceInWeeks: __webpack_require__(103),
  differenceInYears: __webpack_require__(104),
  distanceInWords: __webpack_require__(53),
  distanceInWordsStrict: __webpack_require__(108),
  distanceInWordsToNow: __webpack_require__(109),
  eachDay: __webpack_require__(110),
  endOfDay: __webpack_require__(30),
  endOfHour: __webpack_require__(111),
  endOfISOWeek: __webpack_require__(112),
  endOfISOYear: __webpack_require__(113),
  endOfMinute: __webpack_require__(114),
  endOfMonth: __webpack_require__(55),
  endOfQuarter: __webpack_require__(115),
  endOfSecond: __webpack_require__(116),
  endOfToday: __webpack_require__(117),
  endOfTomorrow: __webpack_require__(118),
  endOfWeek: __webpack_require__(54),
  endOfYear: __webpack_require__(119),
  endOfYesterday: __webpack_require__(120),
  format: __webpack_require__(121),
  getDate: __webpack_require__(122),
  getDay: __webpack_require__(123),
  getDayOfYear: __webpack_require__(56),
  getDaysInMonth: __webpack_require__(24),
  getDaysInYear: __webpack_require__(124),
  getHours: __webpack_require__(125),
  getISODay: __webpack_require__(60),
  getISOWeek: __webpack_require__(31),
  getISOWeeksInYear: __webpack_require__(126),
  getISOYear: __webpack_require__(5),
  getMilliseconds: __webpack_require__(127),
  getMinutes: __webpack_require__(128),
  getMonth: __webpack_require__(129),
  getOverlappingDaysInRanges: __webpack_require__(130),
  getQuarter: __webpack_require__(49),
  getSeconds: __webpack_require__(131),
  getTime: __webpack_require__(132),
  getYear: __webpack_require__(133),
  isAfter: __webpack_require__(134),
  isBefore: __webpack_require__(135),
  isDate: __webpack_require__(23),
  isEqual: __webpack_require__(136),
  isFirstDayOfMonth: __webpack_require__(137),
  isFriday: __webpack_require__(138),
  isFuture: __webpack_require__(139),
  isLastDayOfMonth: __webpack_require__(140),
  isLeapYear: __webpack_require__(59),
  isMonday: __webpack_require__(141),
  isPast: __webpack_require__(142),
  isSameDay: __webpack_require__(143),
  isSameHour: __webpack_require__(61),
  isSameISOWeek: __webpack_require__(63),
  isSameISOYear: __webpack_require__(64),
  isSameMinute: __webpack_require__(65),
  isSameMonth: __webpack_require__(67),
  isSameQuarter: __webpack_require__(68),
  isSameSecond: __webpack_require__(70),
  isSameWeek: __webpack_require__(32),
  isSameYear: __webpack_require__(72),
  isSaturday: __webpack_require__(144),
  isSunday: __webpack_require__(145),
  isThisHour: __webpack_require__(146),
  isThisISOWeek: __webpack_require__(147),
  isThisISOYear: __webpack_require__(148),
  isThisMinute: __webpack_require__(149),
  isThisMonth: __webpack_require__(150),
  isThisQuarter: __webpack_require__(151),
  isThisSecond: __webpack_require__(152),
  isThisWeek: __webpack_require__(153),
  isThisYear: __webpack_require__(154),
  isThursday: __webpack_require__(155),
  isToday: __webpack_require__(156),
  isTomorrow: __webpack_require__(157),
  isTuesday: __webpack_require__(158),
  isValid: __webpack_require__(58),
  isWednesday: __webpack_require__(159),
  isWeekend: __webpack_require__(160),
  isWithinRange: __webpack_require__(161),
  isYesterday: __webpack_require__(162),
  lastDayOfISOWeek: __webpack_require__(163),
  lastDayOfISOYear: __webpack_require__(164),
  lastDayOfMonth: __webpack_require__(165),
  lastDayOfQuarter: __webpack_require__(166),
  lastDayOfWeek: __webpack_require__(73),
  lastDayOfYear: __webpack_require__(167),
  max: __webpack_require__(168),
  min: __webpack_require__(169),
  parse: __webpack_require__(0),
  setDate: __webpack_require__(170),
  setDay: __webpack_require__(171),
  setDayOfYear: __webpack_require__(172),
  setHours: __webpack_require__(173),
  setISODay: __webpack_require__(174),
  setISOWeek: __webpack_require__(175),
  setISOYear: __webpack_require__(42),
  setMilliseconds: __webpack_require__(176),
  setMinutes: __webpack_require__(177),
  setMonth: __webpack_require__(74),
  setQuarter: __webpack_require__(178),
  setSeconds: __webpack_require__(179),
  setYear: __webpack_require__(180),
  startOfDay: __webpack_require__(7),
  startOfHour: __webpack_require__(62),
  startOfISOWeek: __webpack_require__(6),
  startOfISOYear: __webpack_require__(11),
  startOfMinute: __webpack_require__(66),
  startOfMonth: __webpack_require__(181),
  startOfQuarter: __webpack_require__(69),
  startOfSecond: __webpack_require__(71),
  startOfToday: __webpack_require__(182),
  startOfTomorrow: __webpack_require__(183),
  startOfWeek: __webpack_require__(18),
  startOfYear: __webpack_require__(57),
  startOfYesterday: __webpack_require__(184),
  subDays: __webpack_require__(185),
  subHours: __webpack_require__(186),
  subISOYears: __webpack_require__(52),
  subMilliseconds: __webpack_require__(187),
  subMinutes: __webpack_require__(188),
  subMonths: __webpack_require__(189),
  subQuarters: __webpack_require__(190),
  subSeconds: __webpack_require__(191),
  subWeeks: __webpack_require__(192),
  subYears: __webpack_require__(193)
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Range Helpers
 * @summary Is the given date range overlapping with another date range?
 *
 * @description
 * Is the given date range overlapping with another date range?
 *
 * @param {Date|String|Number} initialRangeStartDate - the start of the initial range
 * @param {Date|String|Number} initialRangeEndDate - the end of the initial range
 * @param {Date|String|Number} comparedRangeStartDate - the start of the range to compare it with
 * @param {Date|String|Number} comparedRangeEndDate - the end of the range to compare it with
 * @returns {Boolean} whether the date ranges are overlapping
 * @throws {Error} startDate of a date range cannot be after its endDate
 *
 * @example
 * // For overlapping date ranges:
 * areRangesOverlapping(
 *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 17), new Date(2014, 0, 21)
 * )
 * //=> true
 *
 * @example
 * // For non-overlapping date ranges:
 * areRangesOverlapping(
 *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 21), new Date(2014, 0, 22)
 * )
 * //=> false
 */
function areRangesOverlapping(dirtyInitialRangeStartDate, dirtyInitialRangeEndDate, dirtyComparedRangeStartDate, dirtyComparedRangeEndDate) {
  var initialStartTime = parse(dirtyInitialRangeStartDate).getTime();
  var initialEndTime = parse(dirtyInitialRangeEndDate).getTime();
  var comparedStartTime = parse(dirtyComparedRangeStartDate).getTime();
  var comparedEndTime = parse(dirtyComparedRangeEndDate).getTime();

  if (initialStartTime > initialEndTime || comparedStartTime > comparedEndTime) {
    throw new Error('The start of the range cannot be after the end of the range');
  }

  return initialStartTime < comparedEndTime && comparedStartTime < initialEndTime;
}

module.exports = areRangesOverlapping;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Return an index of the closest date from the array comparing to the given date.
 *
 * @description
 * Return an index of the closest date from the array comparing to the given date.
 *
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @param {Date[]|String[]|Number[]} datesArray - the array to search
 * @returns {Number} an index of the date closest to the given date
 * @throws {TypeError} the second argument must be an instance of Array
 *
 * @example
 * // Which date is closer to 6 September 2015?
 * var dateToCompare = new Date(2015, 8, 6)
 * var datesArray = [
 *   new Date(2015, 0, 1),
 *   new Date(2016, 0, 1),
 *   new Date(2017, 0, 1)
 * ]
 * var result = closestIndexTo(dateToCompare, datesArray)
 * //=> 1
 */
function closestIndexTo(dirtyDateToCompare, dirtyDatesArray) {
  if (!(dirtyDatesArray instanceof Array)) {
    throw new TypeError(toString.call(dirtyDatesArray) + ' is not an instance of Array');
  }

  var dateToCompare = parse(dirtyDateToCompare);
  var timeToCompare = dateToCompare.getTime();

  var result;
  var minDistance;

  dirtyDatesArray.forEach(function (dirtyDate, index) {
    var currentDate = parse(dirtyDate);
    var distance = Math.abs(timeToCompare - currentDate.getTime());
    if (result === undefined || distance < minDistance) {
      result = index;
      minDistance = distance;
    }
  });

  return result;
}

module.exports = closestIndexTo;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Return a date from the array closest to the given date.
 *
 * @description
 * Return a date from the array closest to the given date.
 *
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @param {Date[]|String[]|Number[]} datesArray - the array to search
 * @returns {Date} the date from the array closest to the given date
 * @throws {TypeError} the second argument must be an instance of Array
 *
 * @example
 * // Which date is closer to 6 September 2015: 1 January 2000 or 1 January 2030?
 * var dateToCompare = new Date(2015, 8, 6)
 * var result = closestTo(dateToCompare, [
 *   new Date(2000, 0, 1),
 *   new Date(2030, 0, 1)
 * ])
 * //=> Tue Jan 01 2030 00:00:00
 */
function closestTo(dirtyDateToCompare, dirtyDatesArray) {
  if (!(dirtyDatesArray instanceof Array)) {
    throw new TypeError(toString.call(dirtyDatesArray) + ' is not an instance of Array');
  }

  var dateToCompare = parse(dirtyDateToCompare);
  var timeToCompare = dateToCompare.getTime();

  var result;
  var minDistance;

  dirtyDatesArray.forEach(function (dirtyDate) {
    var currentDate = parse(dirtyDate);
    var distance = Math.abs(timeToCompare - currentDate.getTime());
    if (result === undefined || distance < minDistance) {
      result = currentDate;
      minDistance = distance;
    }
  });

  return result;
}

module.exports = closestTo;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var startOfISOWeek = __webpack_require__(6);

var MILLISECONDS_IN_MINUTE = 60000;
var MILLISECONDS_IN_WEEK = 604800000;

/**
 * @category ISO Week Helpers
 * @summary Get the number of calendar ISO weeks between the given dates.
 *
 * @description
 * Get the number of calendar ISO weeks between the given dates.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar ISO weeks
 *
 * @example
 * // How many calendar ISO weeks are between 6 July 2014 and 21 July 2014?
 * var result = differenceInCalendarISOWeeks(
 *   new Date(2014, 6, 21),
 *   new Date(2014, 6, 6)
 * )
 * //=> 3
 */
function differenceInCalendarISOWeeks(dirtyDateLeft, dirtyDateRight) {
  var startOfISOWeekLeft = startOfISOWeek(dirtyDateLeft);
  var startOfISOWeekRight = startOfISOWeek(dirtyDateRight);

  var timestampLeft = startOfISOWeekLeft.getTime() - startOfISOWeekLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  var timestampRight = startOfISOWeekRight.getTime() - startOfISOWeekRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_WEEK);
}

module.exports = differenceInCalendarISOWeeks;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var getQuarter = __webpack_require__(49);
var parse = __webpack_require__(0);

/**
 * @category Quarter Helpers
 * @summary Get the number of calendar quarters between the given dates.
 *
 * @description
 * Get the number of calendar quarters between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar quarters
 *
 * @example
 * // How many calendar quarters are between 31 December 2013 and 2 July 2014?
 * var result = differenceInCalendarQuarters(
 *   new Date(2014, 6, 2),
 *   new Date(2013, 11, 31)
 * )
 * //=> 3
 */
function differenceInCalendarQuarters(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);

  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var quarterDiff = getQuarter(dateLeft) - getQuarter(dateRight);

  return yearDiff * 4 + quarterDiff;
}

module.exports = differenceInCalendarQuarters;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var startOfWeek = __webpack_require__(18);

var MILLISECONDS_IN_MINUTE = 60000;
var MILLISECONDS_IN_WEEK = 604800000;

/**
 * @category Week Helpers
 * @summary Get the number of calendar weeks between the given dates.
 *
 * @description
 * Get the number of calendar weeks between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Number} the number of calendar weeks
 *
 * @example
 * // How many calendar weeks are between 5 July 2014 and 20 July 2014?
 * var result = differenceInCalendarWeeks(
 *   new Date(2014, 6, 20),
 *   new Date(2014, 6, 5)
 * )
 * //=> 3
 *
 * @example
 * // If the week starts on Monday,
 * // how many calendar weeks are between 5 July 2014 and 20 July 2014?
 * var result = differenceInCalendarWeeks(
 *   new Date(2014, 6, 20),
 *   new Date(2014, 6, 5),
 *   {weekStartsOn: 1}
 * )
 * //=> 2
 */
function differenceInCalendarWeeks(dirtyDateLeft, dirtyDateRight, dirtyOptions) {
  var startOfWeekLeft = startOfWeek(dirtyDateLeft, dirtyOptions);
  var startOfWeekRight = startOfWeek(dirtyDateRight, dirtyOptions);

  var timestampLeft = startOfWeekLeft.getTime() - startOfWeekLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  var timestampRight = startOfWeekRight.getTime() - startOfWeekRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_WEEK);
}

module.exports = differenceInCalendarWeeks;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var differenceInMilliseconds = __webpack_require__(21);

var MILLISECONDS_IN_HOUR = 3600000;

/**
 * @category Hour Helpers
 * @summary Get the number of hours between the given dates.
 *
 * @description
 * Get the number of hours between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of hours
 *
 * @example
 * // How many hours are between 2 July 2014 06:50:00 and 2 July 2014 19:00:00?
 * var result = differenceInHours(
 *   new Date(2014, 6, 2, 19, 0),
 *   new Date(2014, 6, 2, 6, 50)
 * )
 * //=> 12
 */
function differenceInHours(dirtyDateLeft, dirtyDateRight) {
  var diff = differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) / MILLISECONDS_IN_HOUR;
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

module.exports = differenceInHours;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var differenceInCalendarISOYears = __webpack_require__(47);
var compareAsc = __webpack_require__(12);
var subISOYears = __webpack_require__(52);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the number of full ISO week-numbering years between the given dates.
 *
 * @description
 * Get the number of full ISO week-numbering years between the given dates.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of full ISO week-numbering years
 *
 * @example
 * // How many full ISO week-numbering years are between 1 January 2010 and 1 January 2012?
 * var result = differenceInISOYears(
 *   new Date(2012, 0, 1),
 *   new Date(2010, 0, 1)
 * )
 * //=> 1
 */
function differenceInISOYears(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);

  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarISOYears(dateLeft, dateRight));
  dateLeft = subISOYears(dateLeft, sign * difference);

  // Math.abs(diff in full ISO years - diff in calendar ISO years) === 1
  // if last calendar ISO year is not full
  // If so, result must be decreased by 1 in absolute value
  var isLastISOYearNotFull = compareAsc(dateLeft, dateRight) === -sign;
  return sign * (difference - isLastISOYearNotFull);
}

module.exports = differenceInISOYears;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var differenceInMilliseconds = __webpack_require__(21);

var MILLISECONDS_IN_MINUTE = 60000;

/**
 * @category Minute Helpers
 * @summary Get the number of minutes between the given dates.
 *
 * @description
 * Get the number of minutes between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of minutes
 *
 * @example
 * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
 * var result = differenceInMinutes(
 *   new Date(2014, 6, 2, 12, 20, 0),
 *   new Date(2014, 6, 2, 12, 7, 59)
 * )
 * //=> 12
 */
function differenceInMinutes(dirtyDateLeft, dirtyDateRight) {
  var diff = differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) / MILLISECONDS_IN_MINUTE;
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

module.exports = differenceInMinutes;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var differenceInMonths = __webpack_require__(27);

/**
 * @category Quarter Helpers
 * @summary Get the number of full quarters between the given dates.
 *
 * @description
 * Get the number of full quarters between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of full quarters
 *
 * @example
 * // How many full quarters are between 31 December 2013 and 2 July 2014?
 * var result = differenceInQuarters(
 *   new Date(2014, 6, 2),
 *   new Date(2013, 11, 31)
 * )
 * //=> 2
 */
function differenceInQuarters(dirtyDateLeft, dirtyDateRight) {
  var diff = differenceInMonths(dirtyDateLeft, dirtyDateRight) / 3;
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

module.exports = differenceInQuarters;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var differenceInDays = __webpack_require__(51);

/**
 * @category Week Helpers
 * @summary Get the number of full weeks between the given dates.
 *
 * @description
 * Get the number of full weeks between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of full weeks
 *
 * @example
 * // How many full weeks are between 5 July 2014 and 20 July 2014?
 * var result = differenceInWeeks(
 *   new Date(2014, 6, 20),
 *   new Date(2014, 6, 5)
 * )
 * //=> 2
 */
function differenceInWeeks(dirtyDateLeft, dirtyDateRight) {
  var diff = differenceInDays(dirtyDateLeft, dirtyDateRight) / 7;
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

module.exports = differenceInWeeks;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var differenceInCalendarYears = __webpack_require__(50);
var compareAsc = __webpack_require__(12);

/**
 * @category Year Helpers
 * @summary Get the number of full years between the given dates.
 *
 * @description
 * Get the number of full years between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of full years
 *
 * @example
 * // How many full years are between 31 December 2013 and 11 February 2015?
 * var result = differenceInYears(
 *   new Date(2015, 1, 11),
 *   new Date(2013, 11, 31)
 * )
 * //=> 1
 */
function differenceInYears(dirtyDateLeft, dirtyDateRight) {
  var dateLeft = parse(dirtyDateLeft);
  var dateRight = parse(dirtyDateRight);

  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarYears(dateLeft, dateRight));
  dateLeft.setFullYear(dateLeft.getFullYear() - sign * difference);

  // Math.abs(diff in full years - diff in calendar years) === 1 if last calendar year is not full
  // If so, result must be decreased by 1 in absolute value
  var isLastYearNotFull = compareAsc(dateLeft, dateRight) === -sign;
  return sign * (difference - isLastYearNotFull);
}

module.exports = differenceInYears;

/***/ }),
/* 105 */
/***/ (function(module, exports) {

function buildDistanceInWordsLocale() {
  var distanceInWordsLocale = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds'
    },

    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds'
    },

    halfAMinute: 'half a minute',

    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes'
    },

    xMinutes: {
      one: '1 minute',
      other: '{{count}} minutes'
    },

    aboutXHours: {
      one: 'about 1 hour',
      other: 'about {{count}} hours'
    },

    xHours: {
      one: '1 hour',
      other: '{{count}} hours'
    },

    xDays: {
      one: '1 day',
      other: '{{count}} days'
    },

    aboutXMonths: {
      one: 'about 1 month',
      other: 'about {{count}} months'
    },

    xMonths: {
      one: '1 month',
      other: '{{count}} months'
    },

    aboutXYears: {
      one: 'about 1 year',
      other: 'about {{count}} years'
    },

    xYears: {
      one: '1 year',
      other: '{{count}} years'
    },

    overXYears: {
      one: 'over 1 year',
      other: 'over {{count}} years'
    },

    almostXYears: {
      one: 'almost 1 year',
      other: 'almost {{count}} years'
    }
  };

  function localize(token, count, options) {
    options = options || {};

    var result;
    if (typeof distanceInWordsLocale[token] === 'string') {
      result = distanceInWordsLocale[token];
    } else if (count === 1) {
      result = distanceInWordsLocale[token].one;
    } else {
      result = distanceInWordsLocale[token].other.replace('{{count}}', count);
    }

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return 'in ' + result;
      } else {
        return result + ' ago';
      }
    }

    return result;
  }

  return {
    localize: localize
  };
}

module.exports = buildDistanceInWordsLocale;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var buildFormattingTokensRegExp = __webpack_require__(107);

function buildFormatLocale() {
  // Note: in English, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.
  var months3char = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var weekdays2char = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var weekdays3char = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var meridiemUppercase = ['AM', 'PM'];
  var meridiemLowercase = ['am', 'pm'];
  var meridiemFull = ['a.m.', 'p.m.'];

  var formatters = {
    // Month: Jan, Feb, ..., Dec
    'MMM': function (date) {
      return months3char[date.getMonth()];
    },

    // Month: January, February, ..., December
    'MMMM': function (date) {
      return monthsFull[date.getMonth()];
    },

    // Day of week: Su, Mo, ..., Sa
    'dd': function (date) {
      return weekdays2char[date.getDay()];
    },

    // Day of week: Sun, Mon, ..., Sat
    'ddd': function (date) {
      return weekdays3char[date.getDay()];
    },

    // Day of week: Sunday, Monday, ..., Saturday
    'dddd': function (date) {
      return weekdaysFull[date.getDay()];
    },

    // AM, PM
    'A': function (date) {
      return date.getHours() / 12 >= 1 ? meridiemUppercase[1] : meridiemUppercase[0];
    },

    // am, pm
    'a': function (date) {
      return date.getHours() / 12 >= 1 ? meridiemLowercase[1] : meridiemLowercase[0];
    },

    // a.m., p.m.
    'aa': function (date) {
      return date.getHours() / 12 >= 1 ? meridiemFull[1] : meridiemFull[0];
    }

    // Generate ordinal version of formatters: M -> Mo, D -> Do, etc.
  };var ordinalFormatters = ['M', 'D', 'DDD', 'd', 'Q', 'W'];
  ordinalFormatters.forEach(function (formatterToken) {
    formatters[formatterToken + 'o'] = function (date, formatters) {
      return ordinal(formatters[formatterToken](date));
    };
  });

  return {
    formatters: formatters,
    formattingTokensRegExp: buildFormattingTokensRegExp(formatters)
  };
}

function ordinal(number) {
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';
      case 2:
        return number + 'nd';
      case 3:
        return number + 'rd';
    }
  }
  return number + 'th';
}

module.exports = buildFormatLocale;

/***/ }),
/* 107 */
/***/ (function(module, exports) {

var commonFormatterKeys = ['M', 'MM', 'Q', 'D', 'DD', 'DDD', 'DDDD', 'd', 'E', 'W', 'WW', 'YY', 'YYYY', 'GG', 'GGGG', 'H', 'HH', 'h', 'hh', 'm', 'mm', 's', 'ss', 'S', 'SS', 'SSS', 'Z', 'ZZ', 'X', 'x'];

function buildFormattingTokensRegExp(formatters) {
  var formatterKeys = [];
  for (var key in formatters) {
    if (formatters.hasOwnProperty(key)) {
      formatterKeys.push(key);
    }
  }

  var formattingTokens = commonFormatterKeys.concat(formatterKeys).sort().reverse();
  var formattingTokensRegExp = new RegExp('(\\[[^\\[]*\\])|(\\\\)?' + '(' + formattingTokens.join('|') + '|.)', 'g');

  return formattingTokensRegExp;
}

module.exports = buildFormattingTokensRegExp;

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var compareDesc = __webpack_require__(26);
var parse = __webpack_require__(0);
var differenceInSeconds = __webpack_require__(28);
var enLocale = __webpack_require__(29);

var MINUTES_IN_DAY = 1440;
var MINUTES_IN_MONTH = 43200;
var MINUTES_IN_YEAR = 525600;

/**
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words, using strict units.
 * This is like `distanceInWords`, but does not use helpers like 'almost', 'over',
 * 'less than' and the like.
 *
 * | Distance between dates | Result              |
 * |------------------------|---------------------|
 * | 0 ... 59 secs          | [0..59] seconds     |
 * | 1 ... 59 mins          | [1..59] minutes     |
 * | 1 ... 23 hrs           | [1..23] hours       |
 * | 1 ... 29 days          | [1..29] days        |
 * | 1 ... 11 months        | [1..11] months      |
 * | 1 ... N years          | [1..N]  years       |
 *
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @param {Date|String|Number} date - the other date
 * @param {Object} [options] - the object with options
 * @param {Boolean} [options.addSuffix=false] - result indicates if the second date is earlier or later than the first
 * @param {'s'|'m'|'h'|'d'|'M'|'Y'} [options.unit] - if specified, will force a unit
 * @param {'floor'|'ceil'|'round'} [options.partialMethod='floor'] - which way to round partial units
 * @param {Object} [options.locale=enLocale] - the locale object
 * @returns {String} the distance in words
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * var result = distanceInWordsStrict(
 *   new Date(2014, 6, 2),
 *   new Date(2015, 0, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00?
 * var result = distanceInWordsStrict(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0),
 * )
 * //=> '15 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * var result = distanceInWordsStrict(
 *   new Date(2016, 0, 1),
 *   new Date(2015, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> '1 year ago'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, in minutes?
 * var result = distanceInWordsStrict(
 *   new Date(2016, 0, 1),
 *   new Date(2015, 0, 1),
 *   {unit: 'm'}
 * )
 * //=> '525600 minutes'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 28 January 2015, in months, rounded up?
 * var result = distanceInWordsStrict(
 *   new Date(2015, 0, 28),
 *   new Date(2015, 0, 1),
 *   {unit: 'M', partialMethod: 'ceil'}
 * )
 * //=> '1 month'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * var eoLocale = require('date-fns/locale/eo')
 * var result = distanceInWordsStrict(
 *   new Date(2016, 7, 1),
 *   new Date(2015, 0, 1),
 *   {locale: eoLocale}
 * )
 * //=> '1 jaro'
 */
function distanceInWordsStrict(dirtyDateToCompare, dirtyDate, dirtyOptions) {
  var options = dirtyOptions || {};

  var comparison = compareDesc(dirtyDateToCompare, dirtyDate);

  var locale = options.locale;
  var localize = enLocale.distanceInWords.localize;
  if (locale && locale.distanceInWords && locale.distanceInWords.localize) {
    localize = locale.distanceInWords.localize;
  }

  var localizeOptions = {
    addSuffix: Boolean(options.addSuffix),
    comparison: comparison
  };

  var dateLeft, dateRight;
  if (comparison > 0) {
    dateLeft = parse(dirtyDateToCompare);
    dateRight = parse(dirtyDate);
  } else {
    dateLeft = parse(dirtyDate);
    dateRight = parse(dirtyDateToCompare);
  }

  var unit;
  var mathPartial = Math[options.partialMethod ? String(options.partialMethod) : 'floor'];
  var seconds = differenceInSeconds(dateRight, dateLeft);
  var offset = dateRight.getTimezoneOffset() - dateLeft.getTimezoneOffset();
  var minutes = mathPartial(seconds / 60) - offset;
  var hours, days, months, years;

  if (options.unit) {
    unit = String(options.unit);
  } else {
    if (minutes < 1) {
      unit = 's';
    } else if (minutes < 60) {
      unit = 'm';
    } else if (minutes < MINUTES_IN_DAY) {
      unit = 'h';
    } else if (minutes < MINUTES_IN_MONTH) {
      unit = 'd';
    } else if (minutes < MINUTES_IN_YEAR) {
      unit = 'M';
    } else {
      unit = 'Y';
    }
  }

  // 0 up to 60 seconds
  if (unit === 's') {
    return localize('xSeconds', seconds, localizeOptions);

    // 1 up to 60 mins
  } else if (unit === 'm') {
    return localize('xMinutes', minutes, localizeOptions);

    // 1 up to 24 hours
  } else if (unit === 'h') {
    hours = mathPartial(minutes / 60);
    return localize('xHours', hours, localizeOptions);

    // 1 up to 30 days
  } else if (unit === 'd') {
    days = mathPartial(minutes / MINUTES_IN_DAY);
    return localize('xDays', days, localizeOptions);

    // 1 up to 12 months
  } else if (unit === 'M') {
    months = mathPartial(minutes / MINUTES_IN_MONTH);
    return localize('xMonths', months, localizeOptions);

    // 1 year up to max Date
  } else if (unit === 'Y') {
    years = mathPartial(minutes / MINUTES_IN_YEAR);
    return localize('xYears', years, localizeOptions);
  }

  throw new Error('Unknown unit: ' + unit);
}

module.exports = distanceInWordsStrict;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var distanceInWords = __webpack_require__(53);

/**
 * @category Common Helpers
 * @summary Return the distance between the given date and now in words.
 *
 * @description
 * Return the distance between the given date and now in words.
 *
 * | Distance to now                                                   | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance to now     | Result               |
 * |---------------------|----------------------|
 * | 0 secs ... 5 secs   | less than 5 seconds  |
 * | 5 secs ... 10 secs  | less than 10 seconds |
 * | 10 secs ... 20 secs | less than 20 seconds |
 * | 20 secs ... 40 secs | half a minute        |
 * | 40 secs ... 60 secs | less than a minute   |
 * | 60 secs ... 90 secs | 1 minute             |
 *
 * @param {Date|String|Number} date - the given date
 * @param {Object} [options] - the object with options
 * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
 * @param {Boolean} [options.addSuffix=false] - result specifies if the second date is earlier or later than the first
 * @param {Object} [options.locale=enLocale] - the locale object
 * @returns {String} the distance in words
 *
 * @example
 * // If today is 1 January 2015, what is the distance to 2 July 2014?
 * var result = distanceInWordsToNow(
 *   new Date(2014, 6, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // If now is 1 January 2015 00:00:00,
 * // what is the distance to 1 January 2015 00:00:15, including seconds?
 * var result = distanceInWordsToNow(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   {includeSeconds: true}
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016, with a suffix?
 * var result = distanceInWordsToNow(
 *   new Date(2016, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'in about 1 year'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 August 2016 in Esperanto?
 * var eoLocale = require('date-fns/locale/eo')
 * var result = distanceInWordsToNow(
 *   new Date(2016, 7, 1),
 *   {locale: eoLocale}
 * )
 * //=> 'pli ol 1 jaro'
 */
function distanceInWordsToNow(dirtyDate, dirtyOptions) {
  return distanceInWords(Date.now(), dirtyDate, dirtyOptions);
}

module.exports = distanceInWordsToNow;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Day Helpers
 * @summary Return the array of dates within the specified range.
 *
 * @description
 * Return the array of dates within the specified range.
 *
 * @param {Date|String|Number} startDate - the first date
 * @param {Date|String|Number} endDate - the last date
 * @param {Number} [step=1] - the step between each day
 * @returns {Date[]} the array with starts of days from the day of startDate to the day of endDate
 * @throws {Error} startDate cannot be after endDate
 *
 * @example
 * // Each day between 6 October 2014 and 10 October 2014:
 * var result = eachDay(
 *   new Date(2014, 9, 6),
 *   new Date(2014, 9, 10)
 * )
 * //=> [
 * //   Mon Oct 06 2014 00:00:00,
 * //   Tue Oct 07 2014 00:00:00,
 * //   Wed Oct 08 2014 00:00:00,
 * //   Thu Oct 09 2014 00:00:00,
 * //   Fri Oct 10 2014 00:00:00
 * // ]
 */
function eachDay(dirtyStartDate, dirtyEndDate, dirtyStep) {
  var startDate = parse(dirtyStartDate);
  var endDate = parse(dirtyEndDate);
  var step = dirtyStep !== undefined ? dirtyStep : 1;

  var endTime = endDate.getTime();

  if (startDate.getTime() > endTime) {
    throw new Error('The first date cannot be after the second date');
  }

  var dates = [];

  var currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate.getTime() <= endTime) {
    dates.push(parse(currentDate));
    currentDate.setDate(currentDate.getDate() + step);
  }

  return dates;
}

module.exports = eachDay;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Hour Helpers
 * @summary Return the end of an hour for the given date.
 *
 * @description
 * Return the end of an hour for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of an hour
 *
 * @example
 * // The end of an hour for 2 September 2014 11:55:00:
 * var result = endOfHour(new Date(2014, 8, 2, 11, 55))
 * //=> Tue Sep 02 2014 11:59:59.999
 */
function endOfHour(dirtyDate) {
  var date = parse(dirtyDate);
  date.setMinutes(59, 59, 999);
  return date;
}

module.exports = endOfHour;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var endOfWeek = __webpack_require__(54);

/**
 * @category ISO Week Helpers
 * @summary Return the end of an ISO week for the given date.
 *
 * @description
 * Return the end of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of an ISO week
 *
 * @example
 * // The end of an ISO week for 2 September 2014 11:55:00:
 * var result = endOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Sep 07 2014 23:59:59.999
 */
function endOfISOWeek(dirtyDate) {
  return endOfWeek(dirtyDate, { weekStartsOn: 1 });
}

module.exports = endOfISOWeek;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var getISOYear = __webpack_require__(5);
var startOfISOWeek = __webpack_require__(6);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the end of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the end of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of an ISO week-numbering year
 *
 * @example
 * // The end of an ISO week-numbering year for 2 July 2005:
 * var result = endOfISOYear(new Date(2005, 6, 2))
 * //=> Sun Jan 01 2006 23:59:59.999
 */
function endOfISOYear(dirtyDate) {
  var year = getISOYear(dirtyDate);
  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuaryOfNextYear);
  date.setMilliseconds(date.getMilliseconds() - 1);
  return date;
}

module.exports = endOfISOYear;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Minute Helpers
 * @summary Return the end of a minute for the given date.
 *
 * @description
 * Return the end of a minute for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of a minute
 *
 * @example
 * // The end of a minute for 1 December 2014 22:15:45.400:
 * var result = endOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:59.999
 */
function endOfMinute(dirtyDate) {
  var date = parse(dirtyDate);
  date.setSeconds(59, 999);
  return date;
}

module.exports = endOfMinute;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Quarter Helpers
 * @summary Return the end of a year quarter for the given date.
 *
 * @description
 * Return the end of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of a quarter
 *
 * @example
 * // The end of a quarter for 2 September 2014 11:55:00:
 * var result = endOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfQuarter(dirtyDate) {
  var date = parse(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3 + 3;
  date.setMonth(month, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

module.exports = endOfQuarter;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Second Helpers
 * @summary Return the end of a second for the given date.
 *
 * @description
 * Return the end of a second for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of a second
 *
 * @example
 * // The end of a second for 1 December 2014 22:15:45.400:
 * var result = endOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:45.999
 */
function endOfSecond(dirtyDate) {
  var date = parse(dirtyDate);
  date.setMilliseconds(999);
  return date;
}

module.exports = endOfSecond;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var endOfDay = __webpack_require__(30);

/**
 * @category Day Helpers
 * @summary Return the end of today.
 *
 * @description
 * Return the end of today.
 *
 * @returns {Date} the end of today
 *
 * @example
 * // If today is 6 October 2014:
 * var result = endOfToday()
 * //=> Mon Oct 6 2014 23:59:59.999
 */
function endOfToday() {
  return endOfDay(new Date());
}

module.exports = endOfToday;

/***/ }),
/* 118 */
/***/ (function(module, exports) {

/**
 * @category Day Helpers
 * @summary Return the end of tomorrow.
 *
 * @description
 * Return the end of tomorrow.
 *
 * @returns {Date} the end of tomorrow
 *
 * @example
 * // If today is 6 October 2014:
 * var result = endOfTomorrow()
 * //=> Tue Oct 7 2014 23:59:59.999
 */
function endOfTomorrow() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();

  var date = new Date(0);
  date.setFullYear(year, month, day + 1);
  date.setHours(23, 59, 59, 999);
  return date;
}

module.exports = endOfTomorrow;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Return the end of a year for the given date.
 *
 * @description
 * Return the end of a year for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of a year
 *
 * @example
 * // The end of a year for 2 September 2014 11:55:00:
 * var result = endOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Dec 31 2014 23:59:59.999
 */
function endOfYear(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();
  date.setFullYear(year + 1, 0, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

module.exports = endOfYear;

/***/ }),
/* 120 */
/***/ (function(module, exports) {

/**
 * @category Day Helpers
 * @summary Return the end of yesterday.
 *
 * @description
 * Return the end of yesterday.
 *
 * @returns {Date} the end of yesterday
 *
 * @example
 * // If today is 6 October 2014:
 * var result = endOfYesterday()
 * //=> Sun Oct 5 2014 23:59:59.999
 */
function endOfYesterday() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();

  var date = new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(23, 59, 59, 999);
  return date;
}

module.exports = endOfYesterday;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var getDayOfYear = __webpack_require__(56);
var getISOWeek = __webpack_require__(31);
var getISOYear = __webpack_require__(5);
var parse = __webpack_require__(0);
var isValid = __webpack_require__(58);
var enLocale = __webpack_require__(29);

/**
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format.
 *
 * Accepted tokens:
 * | Unit                    | Token | Result examples                  |
 * |-------------------------|-------|----------------------------------|
 * | Month                   | M     | 1, 2, ..., 12                    |
 * |                         | Mo    | 1st, 2nd, ..., 12th              |
 * |                         | MM    | 01, 02, ..., 12                  |
 * |                         | MMM   | Jan, Feb, ..., Dec               |
 * |                         | MMMM  | January, February, ..., December |
 * | Quarter                 | Q     | 1, 2, 3, 4                       |
 * |                         | Qo    | 1st, 2nd, 3rd, 4th               |
 * | Day of month            | D     | 1, 2, ..., 31                    |
 * |                         | Do    | 1st, 2nd, ..., 31st              |
 * |                         | DD    | 01, 02, ..., 31                  |
 * | Day of year             | DDD   | 1, 2, ..., 366                   |
 * |                         | DDDo  | 1st, 2nd, ..., 366th             |
 * |                         | DDDD  | 001, 002, ..., 366               |
 * | Day of week             | d     | 0, 1, ..., 6                     |
 * |                         | do    | 0th, 1st, ..., 6th               |
 * |                         | dd    | Su, Mo, ..., Sa                  |
 * |                         | ddd   | Sun, Mon, ..., Sat               |
 * |                         | dddd  | Sunday, Monday, ..., Saturday    |
 * | Day of ISO week         | E     | 1, 2, ..., 7                     |
 * | ISO week                | W     | 1, 2, ..., 53                    |
 * |                         | Wo    | 1st, 2nd, ..., 53rd              |
 * |                         | WW    | 01, 02, ..., 53                  |
 * | Year                    | YY    | 00, 01, ..., 99                  |
 * |                         | YYYY  | 1900, 1901, ..., 2099            |
 * | ISO week-numbering year | GG    | 00, 01, ..., 99                  |
 * |                         | GGGG  | 1900, 1901, ..., 2099            |
 * | AM/PM                   | A     | AM, PM                           |
 * |                         | a     | am, pm                           |
 * |                         | aa    | a.m., p.m.                       |
 * | Hour                    | H     | 0, 1, ... 23                     |
 * |                         | HH    | 00, 01, ... 23                   |
 * |                         | h     | 1, 2, ..., 12                    |
 * |                         | hh    | 01, 02, ..., 12                  |
 * | Minute                  | m     | 0, 1, ..., 59                    |
 * |                         | mm    | 00, 01, ..., 59                  |
 * | Second                  | s     | 0, 1, ..., 59                    |
 * |                         | ss    | 00, 01, ..., 59                  |
 * | 1/10 of second          | S     | 0, 1, ..., 9                     |
 * | 1/100 of second         | SS    | 00, 01, ..., 99                  |
 * | Millisecond             | SSS   | 000, 001, ..., 999               |
 * | Timezone                | Z     | -01:00, +00:00, ... +12:00       |
 * |                         | ZZ    | -0100, +0000, ..., +1200         |
 * | Seconds timestamp       | X     | 512969520                        |
 * | Milliseconds timestamp  | x     | 512969520900                     |
 *
 * The characters wrapped in square brackets are escaped.
 *
 * The result may vary by locale.
 *
 * @param {Date|String|Number} date - the original date
 * @param {String} [format='YYYY-MM-DDTHH:mm:ss.SSSZ'] - the string of tokens
 * @param {Object} [options] - the object with options
 * @param {Object} [options.locale=enLocale] - the locale object
 * @returns {String} the formatted date string
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * var result = format(
 *   new Date(2014, 1, 11),
 *   'MM/DD/YYYY'
 * )
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * var eoLocale = require('date-fns/locale/eo')
 * var result = format(
 *   new Date(2014, 6, 2),
 *   'Do [de] MMMM YYYY',
 *   {locale: eoLocale}
 * )
 * //=> '2-a de julio 2014'
 */
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
  var formatStr = dirtyFormatStr ? String(dirtyFormatStr) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  var options = dirtyOptions || {};

  var locale = options.locale;
  var localeFormatters = enLocale.format.formatters;
  var formattingTokensRegExp = enLocale.format.formattingTokensRegExp;
  if (locale && locale.format && locale.format.formatters) {
    localeFormatters = locale.format.formatters;

    if (locale.format.formattingTokensRegExp) {
      formattingTokensRegExp = locale.format.formattingTokensRegExp;
    }
  }

  var date = parse(dirtyDate);

  if (!isValid(date)) {
    return 'Invalid Date';
  }

  var formatFn = buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp);

  return formatFn(date);
}

var formatters = {
  // Month: 1, 2, ..., 12
  'M': function (date) {
    return date.getMonth() + 1;
  },

  // Month: 01, 02, ..., 12
  'MM': function (date) {
    return addLeadingZeros(date.getMonth() + 1, 2);
  },

  // Quarter: 1, 2, 3, 4
  'Q': function (date) {
    return Math.ceil((date.getMonth() + 1) / 3);
  },

  // Day of month: 1, 2, ..., 31
  'D': function (date) {
    return date.getDate();
  },

  // Day of month: 01, 02, ..., 31
  'DD': function (date) {
    return addLeadingZeros(date.getDate(), 2);
  },

  // Day of year: 1, 2, ..., 366
  'DDD': function (date) {
    return getDayOfYear(date);
  },

  // Day of year: 001, 002, ..., 366
  'DDDD': function (date) {
    return addLeadingZeros(getDayOfYear(date), 3);
  },

  // Day of week: 0, 1, ..., 6
  'd': function (date) {
    return date.getDay();
  },

  // Day of ISO week: 1, 2, ..., 7
  'E': function (date) {
    return date.getDay() || 7;
  },

  // ISO week: 1, 2, ..., 53
  'W': function (date) {
    return getISOWeek(date);
  },

  // ISO week: 01, 02, ..., 53
  'WW': function (date) {
    return addLeadingZeros(getISOWeek(date), 2);
  },

  // Year: 00, 01, ..., 99
  'YY': function (date) {
    return addLeadingZeros(date.getFullYear(), 4).substr(2);
  },

  // Year: 1900, 1901, ..., 2099
  'YYYY': function (date) {
    return addLeadingZeros(date.getFullYear(), 4);
  },

  // ISO week-numbering year: 00, 01, ..., 99
  'GG': function (date) {
    return String(getISOYear(date)).substr(2);
  },

  // ISO week-numbering year: 1900, 1901, ..., 2099
  'GGGG': function (date) {
    return getISOYear(date);
  },

  // Hour: 0, 1, ... 23
  'H': function (date) {
    return date.getHours();
  },

  // Hour: 00, 01, ..., 23
  'HH': function (date) {
    return addLeadingZeros(date.getHours(), 2);
  },

  // Hour: 1, 2, ..., 12
  'h': function (date) {
    var hours = date.getHours();
    if (hours === 0) {
      return 12;
    } else if (hours > 12) {
      return hours % 12;
    } else {
      return hours;
    }
  },

  // Hour: 01, 02, ..., 12
  'hh': function (date) {
    return addLeadingZeros(formatters['h'](date), 2);
  },

  // Minute: 0, 1, ..., 59
  'm': function (date) {
    return date.getMinutes();
  },

  // Minute: 00, 01, ..., 59
  'mm': function (date) {
    return addLeadingZeros(date.getMinutes(), 2);
  },

  // Second: 0, 1, ..., 59
  's': function (date) {
    return date.getSeconds();
  },

  // Second: 00, 01, ..., 59
  'ss': function (date) {
    return addLeadingZeros(date.getSeconds(), 2);
  },

  // 1/10 of second: 0, 1, ..., 9
  'S': function (date) {
    return Math.floor(date.getMilliseconds() / 100);
  },

  // 1/100 of second: 00, 01, ..., 99
  'SS': function (date) {
    return addLeadingZeros(Math.floor(date.getMilliseconds() / 10), 2);
  },

  // Millisecond: 000, 001, ..., 999
  'SSS': function (date) {
    return addLeadingZeros(date.getMilliseconds(), 3);
  },

  // Timezone: -01:00, +00:00, ... +12:00
  'Z': function (date) {
    return formatTimezone(date.getTimezoneOffset(), ':');
  },

  // Timezone: -0100, +0000, ... +1200
  'ZZ': function (date) {
    return formatTimezone(date.getTimezoneOffset());
  },

  // Seconds timestamp: 512969520
  'X': function (date) {
    return Math.floor(date.getTime() / 1000);
  },

  // Milliseconds timestamp: 512969520900
  'x': function (date) {
    return date.getTime();
  }
};

function buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp) {
  var array = formatStr.match(formattingTokensRegExp);
  var length = array.length;

  var i;
  var formatter;
  for (i = 0; i < length; i++) {
    formatter = localeFormatters[array[i]] || formatters[array[i]];
    if (formatter) {
      array[i] = formatter;
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }

  return function (date) {
    var output = '';
    for (var i = 0; i < length; i++) {
      if (array[i] instanceof Function) {
        output += array[i](date, formatters);
      } else {
        output += array[i];
      }
    }
    return output;
  };
}

function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|]$/g, '');
  }
  return input.replace(/\\/g, '');
}

function formatTimezone(offset, delimeter) {
  delimeter = delimeter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2);
}

function addLeadingZeros(number, targetLength) {
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}

module.exports = format;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Day Helpers
 * @summary Get the day of the month of the given date.
 *
 * @description
 * Get the day of the month of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the day of month
 *
 * @example
 * // Which day of the month is 29 February 2012?
 * var result = getDate(new Date(2012, 1, 29))
 * //=> 29
 */
function getDate(dirtyDate) {
  var date = parse(dirtyDate);
  var dayOfMonth = date.getDate();
  return dayOfMonth;
}

module.exports = getDate;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Get the day of the week of the given date.
 *
 * @description
 * Get the day of the week of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the day of week
 *
 * @example
 * // Which day of the week is 29 February 2012?
 * var result = getDay(new Date(2012, 1, 29))
 * //=> 3
 */
function getDay(dirtyDate) {
  var date = parse(dirtyDate);
  var day = date.getDay();
  return day;
}

module.exports = getDay;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var isLeapYear = __webpack_require__(59);

/**
 * @category Year Helpers
 * @summary Get the number of days in a year of the given date.
 *
 * @description
 * Get the number of days in a year of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the number of days in a year
 *
 * @example
 * // How many days are in 2012?
 * var result = getDaysInYear(new Date(2012, 0, 1))
 * //=> 366
 */
function getDaysInYear(dirtyDate) {
  return isLeapYear(dirtyDate) ? 366 : 365;
}

module.exports = getDaysInYear;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Hour Helpers
 * @summary Get the hours of the given date.
 *
 * @description
 * Get the hours of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the hours
 *
 * @example
 * // Get the hours of 29 February 2012 11:45:00:
 * var result = getHours(new Date(2012, 1, 29, 11, 45))
 * //=> 11
 */
function getHours(dirtyDate) {
  var date = parse(dirtyDate);
  var hours = date.getHours();
  return hours;
}

module.exports = getHours;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var startOfISOYear = __webpack_require__(11);
var addWeeks = __webpack_require__(25);

var MILLISECONDS_IN_WEEK = 604800000;

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the number of weeks in an ISO week-numbering year of the given date.
 *
 * @description
 * Get the number of weeks in an ISO week-numbering year of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the number of ISO weeks in a year
 *
 * @example
 * // How many weeks are in ISO week-numbering year 2015?
 * var result = getISOWeeksInYear(new Date(2015, 1, 11))
 * //=> 53
 */
function getISOWeeksInYear(dirtyDate) {
  var thisYear = startOfISOYear(dirtyDate);
  var nextYear = startOfISOYear(addWeeks(thisYear, 60));
  var diff = nextYear.valueOf() - thisYear.valueOf();
  // Round the number of weeks to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK);
}

module.exports = getISOWeeksInYear;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Millisecond Helpers
 * @summary Get the milliseconds of the given date.
 *
 * @description
 * Get the milliseconds of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the milliseconds
 *
 * @example
 * // Get the milliseconds of 29 February 2012 11:45:05.123:
 * var result = getMilliseconds(new Date(2012, 1, 29, 11, 45, 5, 123))
 * //=> 123
 */
function getMilliseconds(dirtyDate) {
  var date = parse(dirtyDate);
  var milliseconds = date.getMilliseconds();
  return milliseconds;
}

module.exports = getMilliseconds;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Minute Helpers
 * @summary Get the minutes of the given date.
 *
 * @description
 * Get the minutes of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the minutes
 *
 * @example
 * // Get the minutes of 29 February 2012 11:45:05:
 * var result = getMinutes(new Date(2012, 1, 29, 11, 45, 5))
 * //=> 45
 */
function getMinutes(dirtyDate) {
  var date = parse(dirtyDate);
  var minutes = date.getMinutes();
  return minutes;
}

module.exports = getMinutes;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Get the month of the given date.
 *
 * @description
 * Get the month of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the month
 *
 * @example
 * // Which month is 29 February 2012?
 * var result = getMonth(new Date(2012, 1, 29))
 * //=> 1
 */
function getMonth(dirtyDate) {
  var date = parse(dirtyDate);
  var month = date.getMonth();
  return month;
}

module.exports = getMonth;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

var MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

/**
 * @category Range Helpers
 * @summary Get the number of days that overlap in two date ranges
 *
 * @description
 * Get the number of days that overlap in two date ranges
 *
 * @param {Date|String|Number} initialRangeStartDate - the start of the initial range
 * @param {Date|String|Number} initialRangeEndDate - the end of the initial range
 * @param {Date|String|Number} comparedRangeStartDate - the start of the range to compare it with
 * @param {Date|String|Number} comparedRangeEndDate - the end of the range to compare it with
 * @returns {Number} the number of days that overlap in two date ranges
 * @throws {Error} startDate of a date range cannot be after its endDate
 *
 * @example
 * // For overlapping date ranges adds 1 for each started overlapping day:
 * getOverlappingDaysInRanges(
 *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 17), new Date(2014, 0, 21)
 * )
 * //=> 3
 *
 * @example
 * // For non-overlapping date ranges returns 0:
 * getOverlappingDaysInRanges(
 *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 21), new Date(2014, 0, 22)
 * )
 * //=> 0
 */
function getOverlappingDaysInRanges(dirtyInitialRangeStartDate, dirtyInitialRangeEndDate, dirtyComparedRangeStartDate, dirtyComparedRangeEndDate) {
  var initialStartTime = parse(dirtyInitialRangeStartDate).getTime();
  var initialEndTime = parse(dirtyInitialRangeEndDate).getTime();
  var comparedStartTime = parse(dirtyComparedRangeStartDate).getTime();
  var comparedEndTime = parse(dirtyComparedRangeEndDate).getTime();

  if (initialStartTime > initialEndTime || comparedStartTime > comparedEndTime) {
    throw new Error('The start of the range cannot be after the end of the range');
  }

  var isOverlapping = initialStartTime < comparedEndTime && comparedStartTime < initialEndTime;

  if (!isOverlapping) {
    return 0;
  }

  var overlapStartDate = comparedStartTime < initialStartTime ? initialStartTime : comparedStartTime;

  var overlapEndDate = comparedEndTime > initialEndTime ? initialEndTime : comparedEndTime;

  var differenceInMs = overlapEndDate - overlapStartDate;

  return Math.ceil(differenceInMs / MILLISECONDS_IN_DAY);
}

module.exports = getOverlappingDaysInRanges;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Second Helpers
 * @summary Get the seconds of the given date.
 *
 * @description
 * Get the seconds of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the seconds
 *
 * @example
 * // Get the seconds of 29 February 2012 11:45:05.123:
 * var result = getSeconds(new Date(2012, 1, 29, 11, 45, 5, 123))
 * //=> 5
 */
function getSeconds(dirtyDate) {
  var date = parse(dirtyDate);
  var seconds = date.getSeconds();
  return seconds;
}

module.exports = getSeconds;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Timestamp Helpers
 * @summary Get the milliseconds timestamp of the given date.
 *
 * @description
 * Get the milliseconds timestamp of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the timestamp
 *
 * @example
 * // Get the timestamp of 29 February 2012 11:45:05.123:
 * var result = getTime(new Date(2012, 1, 29, 11, 45, 5, 123))
 * //=> 1330515905123
 */
function getTime(dirtyDate) {
  var date = parse(dirtyDate);
  var timestamp = date.getTime();
  return timestamp;
}

module.exports = getTime;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Get the year of the given date.
 *
 * @description
 * Get the year of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the year
 *
 * @example
 * // Which year is 2 July 2014?
 * var result = getYear(new Date(2014, 6, 2))
 * //=> 2014
 */
function getYear(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();
  return year;
}

module.exports = getYear;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Is the first date after the second one?
 *
 * @description
 * Is the first date after the second one?
 *
 * @param {Date|String|Number} date - the date that should be after the other one to return true
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @returns {Boolean} the first date is after the second date
 *
 * @example
 * // Is 10 July 1989 after 11 February 1987?
 * var result = isAfter(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> true
 */
function isAfter(dirtyDate, dirtyDateToCompare) {
  var date = parse(dirtyDate);
  var dateToCompare = parse(dirtyDateToCompare);
  return date.getTime() > dateToCompare.getTime();
}

module.exports = isAfter;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Is the first date before the second one?
 *
 * @description
 * Is the first date before the second one?
 *
 * @param {Date|String|Number} date - the date that should be before the other one to return true
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @returns {Boolean} the first date is before the second date
 *
 * @example
 * // Is 10 July 1989 before 11 February 1987?
 * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> false
 */
function isBefore(dirtyDate, dirtyDateToCompare) {
  var date = parse(dirtyDate);
  var dateToCompare = parse(dirtyDateToCompare);
  return date.getTime() < dateToCompare.getTime();
}

module.exports = isBefore;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Are the given dates equal?
 *
 * @description
 * Are the given dates equal?
 *
 * @param {Date|String|Number} dateLeft - the first date to compare
 * @param {Date|String|Number} dateRight - the second date to compare
 * @returns {Boolean} the dates are equal
 *
 * @example
 * // Are 2 July 2014 06:30:45.000 and 2 July 2014 06:30:45.500 equal?
 * var result = isEqual(
 *   new Date(2014, 6, 2, 6, 30, 45, 0)
 *   new Date(2014, 6, 2, 6, 30, 45, 500)
 * )
 * //=> false
 */
function isEqual(dirtyLeftDate, dirtyRightDate) {
  var dateLeft = parse(dirtyLeftDate);
  var dateRight = parse(dirtyRightDate);
  return dateLeft.getTime() === dateRight.getTime();
}

module.exports = isEqual;

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Is the given date the first day of a month?
 *
 * @description
 * Is the given date the first day of a month?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is the first day of a month
 *
 * @example
 * // Is 1 September 2014 the first day of a month?
 * var result = isFirstDayOfMonth(new Date(2014, 8, 1))
 * //=> true
 */
function isFirstDayOfMonth(dirtyDate) {
  return parse(dirtyDate).getDate() === 1;
}

module.exports = isFirstDayOfMonth;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Is the given date Friday?
 *
 * @description
 * Is the given date Friday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is Friday
 *
 * @example
 * // Is 26 September 2014 Friday?
 * var result = isFriday(new Date(2014, 8, 26))
 * //=> true
 */
function isFriday(dirtyDate) {
  return parse(dirtyDate).getDay() === 5;
}

module.exports = isFriday;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Is the given date in the future?
 *
 * @description
 * Is the given date in the future?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in the future
 *
 * @example
 * // If today is 6 October 2014, is 31 December 2014 in the future?
 * var result = isFuture(new Date(2014, 11, 31))
 * //=> true
 */
function isFuture(dirtyDate) {
  return parse(dirtyDate).getTime() > new Date().getTime();
}

module.exports = isFuture;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var endOfDay = __webpack_require__(30);
var endOfMonth = __webpack_require__(55);

/**
 * @category Month Helpers
 * @summary Is the given date the last day of a month?
 *
 * @description
 * Is the given date the last day of a month?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is the last day of a month
 *
 * @example
 * // Is 28 February 2014 the last day of a month?
 * var result = isLastDayOfMonth(new Date(2014, 1, 28))
 * //=> true
 */
function isLastDayOfMonth(dirtyDate) {
  var date = parse(dirtyDate);
  return endOfDay(date).getTime() === endOfMonth(date).getTime();
}

module.exports = isLastDayOfMonth;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Is the given date Monday?
 *
 * @description
 * Is the given date Monday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is Monday
 *
 * @example
 * // Is 22 September 2014 Monday?
 * var result = isMonday(new Date(2014, 8, 22))
 * //=> true
 */
function isMonday(dirtyDate) {
  return parse(dirtyDate).getDay() === 1;
}

module.exports = isMonday;

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Is the given date in the past?
 *
 * @description
 * Is the given date in the past?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in the past
 *
 * @example
 * // If today is 6 October 2014, is 2 July 2014 in the past?
 * var result = isPast(new Date(2014, 6, 2))
 * //=> true
 */
function isPast(dirtyDate) {
  return parse(dirtyDate).getTime() < new Date().getTime();
}

module.exports = isPast;

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var startOfDay = __webpack_require__(7);

/**
 * @category Day Helpers
 * @summary Are the given dates in the same day?
 *
 * @description
 * Are the given dates in the same day?
 *
 * @param {Date|String|Number} dateLeft - the first date to check
 * @param {Date|String|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same day
 *
 * @example
 * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
 * var result = isSameDay(
 *   new Date(2014, 8, 4, 6, 0),
 *   new Date(2014, 8, 4, 18, 0)
 * )
 * //=> true
 */
function isSameDay(dirtyDateLeft, dirtyDateRight) {
  var dateLeftStartOfDay = startOfDay(dirtyDateLeft);
  var dateRightStartOfDay = startOfDay(dirtyDateRight);

  return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
}

module.exports = isSameDay;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Is the given date Saturday?
 *
 * @description
 * Is the given date Saturday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is Saturday
 *
 * @example
 * // Is 27 September 2014 Saturday?
 * var result = isSaturday(new Date(2014, 8, 27))
 * //=> true
 */
function isSaturday(dirtyDate) {
  return parse(dirtyDate).getDay() === 6;
}

module.exports = isSaturday;

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Is the given date Sunday?
 *
 * @description
 * Is the given date Sunday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is Sunday
 *
 * @example
 * // Is 21 September 2014 Sunday?
 * var result = isSunday(new Date(2014, 8, 21))
 * //=> true
 */
function isSunday(dirtyDate) {
  return parse(dirtyDate).getDay() === 0;
}

module.exports = isSunday;

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var isSameHour = __webpack_require__(61);

/**
 * @category Hour Helpers
 * @summary Is the given date in the same hour as the current date?
 *
 * @description
 * Is the given date in the same hour as the current date?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this hour
 *
 * @example
 * // If now is 25 September 2014 18:30:15.500,
 * // is 25 September 2014 18:00:00 in this hour?
 * var result = isThisHour(new Date(2014, 8, 25, 18))
 * //=> true
 */
function isThisHour(dirtyDate) {
  return isSameHour(new Date(), dirtyDate);
}

module.exports = isThisHour;

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var isSameISOWeek = __webpack_require__(63);

/**
 * @category ISO Week Helpers
 * @summary Is the given date in the same ISO week as the current date?
 *
 * @description
 * Is the given date in the same ISO week as the current date?
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this ISO week
 *
 * @example
 * // If today is 25 September 2014, is 22 September 2014 in this ISO week?
 * var result = isThisISOWeek(new Date(2014, 8, 22))
 * //=> true
 */
function isThisISOWeek(dirtyDate) {
  return isSameISOWeek(new Date(), dirtyDate);
}

module.exports = isThisISOWeek;

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var isSameISOYear = __webpack_require__(64);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Is the given date in the same ISO week-numbering year as the current date?
 *
 * @description
 * Is the given date in the same ISO week-numbering year as the current date?
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this ISO week-numbering year
 *
 * @example
 * // If today is 25 September 2014,
 * // is 30 December 2013 in this ISO week-numbering year?
 * var result = isThisISOYear(new Date(2013, 11, 30))
 * //=> true
 */
function isThisISOYear(dirtyDate) {
  return isSameISOYear(new Date(), dirtyDate);
}

module.exports = isThisISOYear;

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var isSameMinute = __webpack_require__(65);

/**
 * @category Minute Helpers
 * @summary Is the given date in the same minute as the current date?
 *
 * @description
 * Is the given date in the same minute as the current date?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this minute
 *
 * @example
 * // If now is 25 September 2014 18:30:15.500,
 * // is 25 September 2014 18:30:00 in this minute?
 * var result = isThisMinute(new Date(2014, 8, 25, 18, 30))
 * //=> true
 */
function isThisMinute(dirtyDate) {
  return isSameMinute(new Date(), dirtyDate);
}

module.exports = isThisMinute;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var isSameMonth = __webpack_require__(67);

/**
 * @category Month Helpers
 * @summary Is the given date in the same month as the current date?
 *
 * @description
 * Is the given date in the same month as the current date?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this month
 *
 * @example
 * // If today is 25 September 2014, is 15 September 2014 in this month?
 * var result = isThisMonth(new Date(2014, 8, 15))
 * //=> true
 */
function isThisMonth(dirtyDate) {
  return isSameMonth(new Date(), dirtyDate);
}

module.exports = isThisMonth;

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var isSameQuarter = __webpack_require__(68);

/**
 * @category Quarter Helpers
 * @summary Is the given date in the same quarter as the current date?
 *
 * @description
 * Is the given date in the same quarter as the current date?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this quarter
 *
 * @example
 * // If today is 25 September 2014, is 2 July 2014 in this quarter?
 * var result = isThisQuarter(new Date(2014, 6, 2))
 * //=> true
 */
function isThisQuarter(dirtyDate) {
  return isSameQuarter(new Date(), dirtyDate);
}

module.exports = isThisQuarter;

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var isSameSecond = __webpack_require__(70);

/**
 * @category Second Helpers
 * @summary Is the given date in the same second as the current date?
 *
 * @description
 * Is the given date in the same second as the current date?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this second
 *
 * @example
 * // If now is 25 September 2014 18:30:15.500,
 * // is 25 September 2014 18:30:15.000 in this second?
 * var result = isThisSecond(new Date(2014, 8, 25, 18, 30, 15))
 * //=> true
 */
function isThisSecond(dirtyDate) {
  return isSameSecond(new Date(), dirtyDate);
}

module.exports = isThisSecond;

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var isSameWeek = __webpack_require__(32);

/**
 * @category Week Helpers
 * @summary Is the given date in the same week as the current date?
 *
 * @description
 * Is the given date in the same week as the current date?
 *
 * @param {Date|String|Number} date - the date to check
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Boolean} the date is in this week
 *
 * @example
 * // If today is 25 September 2014, is 21 September 2014 in this week?
 * var result = isThisWeek(new Date(2014, 8, 21))
 * //=> true
 *
 * @example
 * // If today is 25 September 2014 and week starts with Monday
 * // is 21 September 2014 in this week?
 * var result = isThisWeek(new Date(2014, 8, 21), {weekStartsOn: 1})
 * //=> false
 */
function isThisWeek(dirtyDate, dirtyOptions) {
  return isSameWeek(new Date(), dirtyDate, dirtyOptions);
}

module.exports = isThisWeek;

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var isSameYear = __webpack_require__(72);

/**
 * @category Year Helpers
 * @summary Is the given date in the same year as the current date?
 *
 * @description
 * Is the given date in the same year as the current date?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is in this year
 *
 * @example
 * // If today is 25 September 2014, is 2 July 2014 in this year?
 * var result = isThisYear(new Date(2014, 6, 2))
 * //=> true
 */
function isThisYear(dirtyDate) {
  return isSameYear(new Date(), dirtyDate);
}

module.exports = isThisYear;

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Is the given date Thursday?
 *
 * @description
 * Is the given date Thursday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is Thursday
 *
 * @example
 * // Is 25 September 2014 Thursday?
 * var result = isThursday(new Date(2014, 8, 25))
 * //=> true
 */
function isThursday(dirtyDate) {
  return parse(dirtyDate).getDay() === 4;
}

module.exports = isThursday;

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var startOfDay = __webpack_require__(7);

/**
 * @category Day Helpers
 * @summary Is the given date today?
 *
 * @description
 * Is the given date today?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is today
 *
 * @example
 * // If today is 6 October 2014, is 6 October 14:00:00 today?
 * var result = isToday(new Date(2014, 9, 6, 14, 0))
 * //=> true
 */
function isToday(dirtyDate) {
  return startOfDay(dirtyDate).getTime() === startOfDay(new Date()).getTime();
}

module.exports = isToday;

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var startOfDay = __webpack_require__(7);

/**
 * @category Day Helpers
 * @summary Is the given date tomorrow?
 *
 * @description
 * Is the given date tomorrow?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is tomorrow
 *
 * @example
 * // If today is 6 October 2014, is 7 October 14:00:00 tomorrow?
 * var result = isTomorrow(new Date(2014, 9, 7, 14, 0))
 * //=> true
 */
function isTomorrow(dirtyDate) {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return startOfDay(dirtyDate).getTime() === startOfDay(tomorrow).getTime();
}

module.exports = isTomorrow;

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Is the given date Tuesday?
 *
 * @description
 * Is the given date Tuesday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is Tuesday
 *
 * @example
 * // Is 23 September 2014 Tuesday?
 * var result = isTuesday(new Date(2014, 8, 23))
 * //=> true
 */
function isTuesday(dirtyDate) {
  return parse(dirtyDate).getDay() === 2;
}

module.exports = isTuesday;

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Is the given date Wednesday?
 *
 * @description
 * Is the given date Wednesday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is Wednesday
 *
 * @example
 * // Is 24 September 2014 Wednesday?
 * var result = isWednesday(new Date(2014, 8, 24))
 * //=> true
 */
function isWednesday(dirtyDate) {
  return parse(dirtyDate).getDay() === 3;
}

module.exports = isWednesday;

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Weekday Helpers
 * @summary Does the given date fall on a weekend?
 *
 * @description
 * Does the given date fall on a weekend?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date falls on a weekend
 *
 * @example
 * // Does 5 October 2014 fall on a weekend?
 * var result = isWeekend(new Date(2014, 9, 5))
 * //=> true
 */
function isWeekend(dirtyDate) {
  var date = parse(dirtyDate);
  var day = date.getDay();
  return day === 0 || day === 6;
}

module.exports = isWeekend;

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Range Helpers
 * @summary Is the given date within the range?
 *
 * @description
 * Is the given date within the range?
 *
 * @param {Date|String|Number} date - the date to check
 * @param {Date|String|Number} startDate - the start of range
 * @param {Date|String|Number} endDate - the end of range
 * @returns {Boolean} the date is within the range
 * @throws {Error} startDate cannot be after endDate
 *
 * @example
 * // For the date within the range:
 * isWithinRange(
 *   new Date(2014, 0, 3), new Date(2014, 0, 1), new Date(2014, 0, 7)
 * )
 * //=> true
 *
 * @example
 * // For the date outside of the range:
 * isWithinRange(
 *   new Date(2014, 0, 10), new Date(2014, 0, 1), new Date(2014, 0, 7)
 * )
 * //=> false
 */
function isWithinRange(dirtyDate, dirtyStartDate, dirtyEndDate) {
  var time = parse(dirtyDate).getTime();
  var startTime = parse(dirtyStartDate).getTime();
  var endTime = parse(dirtyEndDate).getTime();

  if (startTime > endTime) {
    throw new Error('The start of the range cannot be after the end of the range');
  }

  return time >= startTime && time <= endTime;
}

module.exports = isWithinRange;

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var startOfDay = __webpack_require__(7);

/**
 * @category Day Helpers
 * @summary Is the given date yesterday?
 *
 * @description
 * Is the given date yesterday?
 *
 * @param {Date|String|Number} date - the date to check
 * @returns {Boolean} the date is yesterday
 *
 * @example
 * // If today is 6 October 2014, is 5 October 14:00:00 yesterday?
 * var result = isYesterday(new Date(2014, 9, 5, 14, 0))
 * //=> true
 */
function isYesterday(dirtyDate) {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return startOfDay(dirtyDate).getTime() === startOfDay(yesterday).getTime();
}

module.exports = isYesterday;

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var lastDayOfWeek = __webpack_require__(73);

/**
 * @category ISO Week Helpers
 * @summary Return the last day of an ISO week for the given date.
 *
 * @description
 * Return the last day of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the last day of an ISO week
 *
 * @example
 * // The last day of an ISO week for 2 September 2014 11:55:00:
 * var result = lastDayOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Sep 07 2014 00:00:00
 */
function lastDayOfISOWeek(dirtyDate) {
  return lastDayOfWeek(dirtyDate, { weekStartsOn: 1 });
}

module.exports = lastDayOfISOWeek;

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var getISOYear = __webpack_require__(5);
var startOfISOWeek = __webpack_require__(6);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the last day of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the last day of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the end of an ISO week-numbering year
 *
 * @example
 * // The last day of an ISO week-numbering year for 2 July 2005:
 * var result = lastDayOfISOYear(new Date(2005, 6, 2))
 * //=> Sun Jan 01 2006 00:00:00
 */
function lastDayOfISOYear(dirtyDate) {
  var year = getISOYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setFullYear(year + 1, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  date.setDate(date.getDate() - 1);
  return date;
}

module.exports = lastDayOfISOYear;

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Return the last day of a month for the given date.
 *
 * @description
 * Return the last day of a month for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the last day of a month
 *
 * @example
 * // The last day of a month for 2 September 2014 11:55:00:
 * var result = lastDayOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 00:00:00
 */
function lastDayOfMonth(dirtyDate) {
  var date = parse(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = lastDayOfMonth;

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Quarter Helpers
 * @summary Return the last day of a year quarter for the given date.
 *
 * @description
 * Return the last day of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the last day of a quarter
 *
 * @example
 * // The last day of a quarter for 2 September 2014 11:55:00:
 * var result = lastDayOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 00:00:00
 */
function lastDayOfQuarter(dirtyDate) {
  var date = parse(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3 + 3;
  date.setMonth(month, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = lastDayOfQuarter;

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Return the last day of a year for the given date.
 *
 * @description
 * Return the last day of a year for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the last day of a year
 *
 * @example
 * // The last day of a year for 2 September 2014 11:55:00:
 * var result = lastDayOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Dec 31 2014 00:00:00
 */
function lastDayOfYear(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();
  date.setFullYear(year + 1, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = lastDayOfYear;

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Return the latest of the given dates.
 *
 * @description
 * Return the latest of the given dates.
 *
 * @param {...(Date|String|Number)} dates - the dates to compare
 * @returns {Date} the latest of the dates
 *
 * @example
 * // Which of these dates is the latest?
 * var result = max(
 *   new Date(1989, 6, 10),
 *   new Date(1987, 1, 11),
 *   new Date(1995, 6, 2),
 *   new Date(1990, 0, 1)
 * )
 * //=> Sun Jul 02 1995 00:00:00
 */
function max() {
  var dirtyDates = Array.prototype.slice.call(arguments);
  var dates = dirtyDates.map(function (dirtyDate) {
    return parse(dirtyDate);
  });
  var latestTimestamp = Math.max.apply(null, dates);
  return new Date(latestTimestamp);
}

module.exports = max;

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Common Helpers
 * @summary Return the earliest of the given dates.
 *
 * @description
 * Return the earliest of the given dates.
 *
 * @param {...(Date|String|Number)} dates - the dates to compare
 * @returns {Date} the earliest of the dates
 *
 * @example
 * // Which of these dates is the earliest?
 * var result = min(
 *   new Date(1989, 6, 10),
 *   new Date(1987, 1, 11),
 *   new Date(1995, 6, 2),
 *   new Date(1990, 0, 1)
 * )
 * //=> Wed Feb 11 1987 00:00:00
 */
function min() {
  var dirtyDates = Array.prototype.slice.call(arguments);
  var dates = dirtyDates.map(function (dirtyDate) {
    return parse(dirtyDate);
  });
  var earliestTimestamp = Math.min.apply(null, dates);
  return new Date(earliestTimestamp);
}

module.exports = min;

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Day Helpers
 * @summary Set the day of the month to the given date.
 *
 * @description
 * Set the day of the month to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} dayOfMonth - the day of the month of the new date
 * @returns {Date} the new date with the day of the month setted
 *
 * @example
 * // Set the 30th day of the month to 1 September 2014:
 * var result = setDate(new Date(2014, 8, 1), 30)
 * //=> Tue Sep 30 2014 00:00:00
 */
function setDate(dirtyDate, dirtyDayOfMonth) {
  var date = parse(dirtyDate);
  var dayOfMonth = Number(dirtyDayOfMonth);
  date.setDate(dayOfMonth);
  return date;
}

module.exports = setDate;

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var addDays = __webpack_require__(9);

/**
 * @category Weekday Helpers
 * @summary Set the day of the week to the given date.
 *
 * @description
 * Set the day of the week to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} day - the day of the week of the new date
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the new date with the day of the week setted
 *
 * @example
 * // Set Sunday to 1 September 2014:
 * var result = setDay(new Date(2014, 8, 1), 0)
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If week starts with Monday, set Sunday to 1 September 2014:
 * var result = setDay(new Date(2014, 8, 1), 0, {weekStartsOn: 1})
 * //=> Sun Sep 07 2014 00:00:00
 */
function setDay(dirtyDate, dirtyDay, dirtyOptions) {
  var weekStartsOn = dirtyOptions ? Number(dirtyOptions.weekStartsOn) || 0 : 0;
  var date = parse(dirtyDate);
  var day = Number(dirtyDay);
  var currentDay = date.getDay();

  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;

  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  return addDays(date, diff);
}

module.exports = setDay;

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Day Helpers
 * @summary Set the day of the year to the given date.
 *
 * @description
 * Set the day of the year to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} dayOfYear - the day of the year of the new date
 * @returns {Date} the new date with the day of the year setted
 *
 * @example
 * // Set the 2nd day of the year to 2 July 2014:
 * var result = setDayOfYear(new Date(2014, 6, 2), 2)
 * //=> Thu Jan 02 2014 00:00:00
 */
function setDayOfYear(dirtyDate, dirtyDayOfYear) {
  var date = parse(dirtyDate);
  var dayOfYear = Number(dirtyDayOfYear);
  date.setMonth(0);
  date.setDate(dayOfYear);
  return date;
}

module.exports = setDayOfYear;

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Hour Helpers
 * @summary Set the hours to the given date.
 *
 * @description
 * Set the hours to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} hours - the hours of the new date
 * @returns {Date} the new date with the hours setted
 *
 * @example
 * // Set 4 hours to 1 September 2014 11:30:00:
 * var result = setHours(new Date(2014, 8, 1, 11, 30), 4)
 * //=> Mon Sep 01 2014 04:30:00
 */
function setHours(dirtyDate, dirtyHours) {
  var date = parse(dirtyDate);
  var hours = Number(dirtyHours);
  date.setHours(hours);
  return date;
}

module.exports = setHours;

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var addDays = __webpack_require__(9);
var getISODay = __webpack_require__(60);

/**
 * @category Weekday Helpers
 * @summary Set the day of the ISO week to the given date.
 *
 * @description
 * Set the day of the ISO week to the given date.
 * ISO week starts with Monday.
 * 7 is the index of Sunday, 1 is the index of Monday etc.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} day - the day of the ISO week of the new date
 * @returns {Date} the new date with the day of the ISO week setted
 *
 * @example
 * // Set Sunday to 1 September 2014:
 * var result = setISODay(new Date(2014, 8, 1), 7)
 * //=> Sun Sep 07 2014 00:00:00
 */
function setISODay(dirtyDate, dirtyDay) {
  var date = parse(dirtyDate);
  var day = Number(dirtyDay);
  var currentDay = getISODay(date);
  var diff = day - currentDay;
  return addDays(date, diff);
}

module.exports = setISODay;

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var getISOWeek = __webpack_require__(31);

/**
 * @category ISO Week Helpers
 * @summary Set the ISO week to the given date.
 *
 * @description
 * Set the ISO week to the given date, saving the weekday number.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} isoWeek - the ISO week of the new date
 * @returns {Date} the new date with the ISO week setted
 *
 * @example
 * // Set the 53rd ISO week to 7 August 2004:
 * var result = setISOWeek(new Date(2004, 7, 7), 53)
 * //=> Sat Jan 01 2005 00:00:00
 */
function setISOWeek(dirtyDate, dirtyISOWeek) {
  var date = parse(dirtyDate);
  var isoWeek = Number(dirtyISOWeek);
  var diff = getISOWeek(date) - isoWeek;
  date.setDate(date.getDate() - diff * 7);
  return date;
}

module.exports = setISOWeek;

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Millisecond Helpers
 * @summary Set the milliseconds to the given date.
 *
 * @description
 * Set the milliseconds to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} milliseconds - the milliseconds of the new date
 * @returns {Date} the new date with the milliseconds setted
 *
 * @example
 * // Set 300 milliseconds to 1 September 2014 11:30:40.500:
 * var result = setMilliseconds(new Date(2014, 8, 1, 11, 30, 40, 500), 300)
 * //=> Mon Sep 01 2014 11:30:40.300
 */
function setMilliseconds(dirtyDate, dirtyMilliseconds) {
  var date = parse(dirtyDate);
  var milliseconds = Number(dirtyMilliseconds);
  date.setMilliseconds(milliseconds);
  return date;
}

module.exports = setMilliseconds;

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Minute Helpers
 * @summary Set the minutes to the given date.
 *
 * @description
 * Set the minutes to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} minutes - the minutes of the new date
 * @returns {Date} the new date with the minutes setted
 *
 * @example
 * // Set 45 minutes to 1 September 2014 11:30:40:
 * var result = setMinutes(new Date(2014, 8, 1, 11, 30, 40), 45)
 * //=> Mon Sep 01 2014 11:45:40
 */
function setMinutes(dirtyDate, dirtyMinutes) {
  var date = parse(dirtyDate);
  var minutes = Number(dirtyMinutes);
  date.setMinutes(minutes);
  return date;
}

module.exports = setMinutes;

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);
var setMonth = __webpack_require__(74);

/**
 * @category Quarter Helpers
 * @summary Set the year quarter to the given date.
 *
 * @description
 * Set the year quarter to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} quarter - the quarter of the new date
 * @returns {Date} the new date with the quarter setted
 *
 * @example
 * // Set the 2nd quarter to 2 July 2014:
 * var result = setQuarter(new Date(2014, 6, 2), 2)
 * //=> Wed Apr 02 2014 00:00:00
 */
function setQuarter(dirtyDate, dirtyQuarter) {
  var date = parse(dirtyDate);
  var quarter = Number(dirtyQuarter);
  var oldQuarter = Math.floor(date.getMonth() / 3) + 1;
  var diff = quarter - oldQuarter;
  return setMonth(date, date.getMonth() + diff * 3);
}

module.exports = setQuarter;

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Second Helpers
 * @summary Set the seconds to the given date.
 *
 * @description
 * Set the seconds to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} seconds - the seconds of the new date
 * @returns {Date} the new date with the seconds setted
 *
 * @example
 * // Set 45 seconds to 1 September 2014 11:30:40:
 * var result = setSeconds(new Date(2014, 8, 1, 11, 30, 40), 45)
 * //=> Mon Sep 01 2014 11:30:45
 */
function setSeconds(dirtyDate, dirtySeconds) {
  var date = parse(dirtyDate);
  var seconds = Number(dirtySeconds);
  date.setSeconds(seconds);
  return date;
}

module.exports = setSeconds;

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Year Helpers
 * @summary Set the year to the given date.
 *
 * @description
 * Set the year to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} year - the year of the new date
 * @returns {Date} the new date with the year setted
 *
 * @example
 * // Set year 2013 to 1 September 2014:
 * var result = setYear(new Date(2014, 8, 1), 2013)
 * //=> Sun Sep 01 2013 00:00:00
 */
function setYear(dirtyDate, dirtyYear) {
  var date = parse(dirtyDate);
  var year = Number(dirtyYear);
  date.setFullYear(year);
  return date;
}

module.exports = setYear;

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(0);

/**
 * @category Month Helpers
 * @summary Return the start of a month for the given date.
 *
 * @description
 * Return the start of a month for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a month
 *
 * @example
 * // The start of a month for 2 September 2014 11:55:00:
 * var result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfMonth(dirtyDate) {
  var date = parse(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfMonth;

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var startOfDay = __webpack_require__(7);

/**
 * @category Day Helpers
 * @summary Return the start of today.
 *
 * @description
 * Return the start of today.
 *
 * @returns {Date} the start of today
 *
 * @example
 * // If today is 6 October 2014:
 * var result = startOfToday()
 * //=> Mon Oct 6 2014 00:00:00
 */
function startOfToday() {
  return startOfDay(new Date());
}

module.exports = startOfToday;

/***/ }),
/* 183 */
/***/ (function(module, exports) {

/**
 * @category Day Helpers
 * @summary Return the start of tomorrow.
 *
 * @description
 * Return the start of tomorrow.
 *
 * @returns {Date} the start of tomorrow
 *
 * @example
 * // If today is 6 October 2014:
 * var result = startOfTomorrow()
 * //=> Tue Oct 7 2014 00:00:00
 */
function startOfTomorrow() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();

  var date = new Date(0);
  date.setFullYear(year, month, day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfTomorrow;

/***/ }),
/* 184 */
/***/ (function(module, exports) {

/**
 * @category Day Helpers
 * @summary Return the start of yesterday.
 *
 * @description
 * Return the start of yesterday.
 *
 * @returns {Date} the start of yesterday
 *
 * @example
 * // If today is 6 October 2014:
 * var result = startOfYesterday()
 * //=> Sun Oct 5 2014 00:00:00
 */
function startOfYesterday() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();

  var date = new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfYesterday;

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var addDays = __webpack_require__(9);

/**
 * @category Day Helpers
 * @summary Subtract the specified number of days from the given date.
 *
 * @description
 * Subtract the specified number of days from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be subtracted
 * @returns {Date} the new date with the days subtracted
 *
 * @example
 * // Subtract 10 days from 1 September 2014:
 * var result = subDays(new Date(2014, 8, 1), 10)
 * //=> Fri Aug 22 2014 00:00:00
 */
function subDays(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addDays(dirtyDate, -amount);
}

module.exports = subDays;

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

var addHours = __webpack_require__(40);

/**
 * @category Hour Helpers
 * @summary Subtract the specified number of hours from the given date.
 *
 * @description
 * Subtract the specified number of hours from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of hours to be subtracted
 * @returns {Date} the new date with the hours subtracted
 *
 * @example
 * // Subtract 2 hours from 11 July 2014 01:00:00:
 * var result = subHours(new Date(2014, 6, 11, 1, 0), 2)
 * //=> Thu Jul 10 2014 23:00:00
 */
function subHours(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addHours(dirtyDate, -amount);
}

module.exports = subHours;

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

var addMilliseconds = __webpack_require__(10);

/**
 * @category Millisecond Helpers
 * @summary Subtract the specified number of milliseconds from the given date.
 *
 * @description
 * Subtract the specified number of milliseconds from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be subtracted
 * @returns {Date} the new date with the milliseconds subtracted
 *
 * @example
 * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
 * var result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:29.250
 */
function subMilliseconds(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}

module.exports = subMilliseconds;

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

var addMinutes = __webpack_require__(43);

/**
 * @category Minute Helpers
 * @summary Subtract the specified number of minutes from the given date.
 *
 * @description
 * Subtract the specified number of minutes from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of minutes to be subtracted
 * @returns {Date} the new date with the mintues subtracted
 *
 * @example
 * // Subtract 30 minutes from 10 July 2014 12:00:00:
 * var result = subMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 11:30:00
 */
function subMinutes(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addMinutes(dirtyDate, -amount);
}

module.exports = subMinutes;

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

var addMonths = __webpack_require__(20);

/**
 * @category Month Helpers
 * @summary Subtract the specified number of months from the given date.
 *
 * @description
 * Subtract the specified number of months from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be subtracted
 * @returns {Date} the new date with the months subtracted
 *
 * @example
 * // Subtract 5 months from 1 February 2015:
 * var result = subMonths(new Date(2015, 1, 1), 5)
 * //=> Mon Sep 01 2014 00:00:00
 */
function subMonths(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addMonths(dirtyDate, -amount);
}

module.exports = subMonths;

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var addQuarters = __webpack_require__(44);

/**
 * @category Quarter Helpers
 * @summary Subtract the specified number of year quarters from the given date.
 *
 * @description
 * Subtract the specified number of year quarters from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of quarters to be subtracted
 * @returns {Date} the new date with the quarters subtracted
 *
 * @example
 * // Subtract 3 quarters from 1 September 2014:
 * var result = subQuarters(new Date(2014, 8, 1), 3)
 * //=> Sun Dec 01 2013 00:00:00
 */
function subQuarters(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addQuarters(dirtyDate, -amount);
}

module.exports = subQuarters;

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var addSeconds = __webpack_require__(45);

/**
 * @category Second Helpers
 * @summary Subtract the specified number of seconds from the given date.
 *
 * @description
 * Subtract the specified number of seconds from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of seconds to be subtracted
 * @returns {Date} the new date with the seconds subtracted
 *
 * @example
 * // Subtract 30 seconds from 10 July 2014 12:45:00:
 * var result = subSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
 * //=> Thu Jul 10 2014 12:44:30
 */
function subSeconds(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addSeconds(dirtyDate, -amount);
}

module.exports = subSeconds;

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var addWeeks = __webpack_require__(25);

/**
 * @category Week Helpers
 * @summary Subtract the specified number of weeks from the given date.
 *
 * @description
 * Subtract the specified number of weeks from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of weeks to be subtracted
 * @returns {Date} the new date with the weeks subtracted
 *
 * @example
 * // Subtract 4 weeks from 1 September 2014:
 * var result = subWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Aug 04 2014 00:00:00
 */
function subWeeks(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addWeeks(dirtyDate, -amount);
}

module.exports = subWeeks;

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var addYears = __webpack_require__(46);

/**
 * @category Year Helpers
 * @summary Subtract the specified number of years from the given date.
 *
 * @description
 * Subtract the specified number of years from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of years to be subtracted
 * @returns {Date} the new date with the years subtracted
 *
 * @example
 * // Subtract 5 years from 1 September 2014:
 * var result = subYears(new Date(2014, 8, 1), 5)
 * //=> Tue Sep 01 2009 00:00:00
 */
function subYears(dirtyDate, dirtyAmount) {
  var amount = Number(dirtyAmount);
  return addYears(dirtyDate, -amount);
}

module.exports = subYears;

/***/ }),
/* 194 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DecodeError */
/* unused harmony export $$boolean */
/* unused harmony export bool */
/* unused harmony export $$float */
/* unused harmony export $$int */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return string; });
/* unused harmony export nullable */
/* unused harmony export nullAs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return array; });
/* unused harmony export list */
/* unused harmony export pair */
/* unused harmony export dict */
/* unused harmony export field */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return at; });
/* unused harmony export optional */
/* unused harmony export oneOf */
/* unused harmony export either */
/* unused harmony export withDefault */
/* unused harmony export map */
/* unused harmony export andThen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_array_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_js_exn_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bs_platform_lib_es6_js_math_js__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_bs_platform_lib_es6_caml_exceptions_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_builtin_exceptions_js__ = __webpack_require__(1);










function _isInteger(value) {
  if (isFinite(value)) {
    return +(__WEBPACK_IMPORTED_MODULE_4_bs_platform_lib_es6_js_math_js__["a" /* floor */](value) === value);
  } else {
    return (/* false */0
    );
  }
}

var DecodeError = __WEBPACK_IMPORTED_MODULE_5_bs_platform_lib_es6_caml_exceptions_js__["a" /* create */]("Json_decode.DecodeError");

function $$boolean(json) {
  if (typeof json === "boolean") {
    return json;
  } else {
    throw [DecodeError, "Expected boolean, got " + JSON.stringify(json)];
  }
}

function bool(json) {
  return +$$boolean(json);
}

function $$float(json) {
  if (typeof json === "number") {
    return json;
  } else {
    throw [DecodeError, "Expected number, got " + JSON.stringify(json)];
  }
}

function $$int(json) {
  var f = $$float(json);
  if (_isInteger(f)) {
    return f;
  } else {
    throw [DecodeError, "Expected integer, got " + JSON.stringify(json)];
  }
}

function string(json) {
  if (typeof json === "string") {
    return json;
  } else {
    throw [DecodeError, "Expected string, got " + JSON.stringify(json)];
  }
}

function nullable(decode, json) {
  if (json === null) {
    return null;
  } else {
    return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decode, json);
  }
}

function nullAs(value, json) {
  if (json === null) {
    return value;
  } else {
    throw [DecodeError, "Expected null, got " + JSON.stringify(json)];
  }
}

function array(decode, json) {
  if (Array.isArray(json)) {
    var length = json.length;
    var target = new Array(length);
    for (var i = 0, i_finish = length - 1 | 0; i <= i_finish; ++i) {
      var value = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decode, json[i]);
      target[i] = value;
    }
    return target;
  } else {
    throw [DecodeError, "Expected array, got " + JSON.stringify(json)];
  }
}

function list(decode, json) {
  return __WEBPACK_IMPORTED_MODULE_1_bs_platform_lib_es6_array_js__["a" /* to_list */](array(decode, json));
}

function pair(left, right, json) {
  if (Array.isArray(json)) {
    var length = json.length;
    if (length === 2) {
      return (/* tuple */[__WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](left, json[0]), __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](right, json[1])]
      );
    } else {
      throw [DecodeError, "Expected array of length 2, got array of length " + (String(length) + "")];
    }
  } else {
    throw [DecodeError, "Expected array, got " + JSON.stringify(json)];
  }
}

function dict(decode, json) {
  if (typeof json === "object" && !Array.isArray(json) && json !== null) {
    var keys = Object.keys(json);
    var l = keys.length;
    var target = {};
    for (var i = 0, i_finish = l - 1 | 0; i <= i_finish; ++i) {
      var key = keys[i];
      var value = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decode, json[key]);
      target[key] = value;
    }
    return target;
  } else {
    throw [DecodeError, "Expected object, got " + JSON.stringify(json)];
  }
}

function field(key, decode, json) {
  if (typeof json === "object" && !Array.isArray(json) && json !== null) {
    var match = json[key];
    if (match !== undefined) {
      return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decode, match);
    } else {
      throw [DecodeError, "Expected field \'" + (String(key) + "\'")];
    }
  } else {
    throw [DecodeError, "Expected object, got " + JSON.stringify(json)];
  }
}

function at(key_path, decoder) {
  if (key_path) {
    var rest = key_path[1];
    var key = key_path[0];
    if (rest) {
      var partial_arg = at(rest, decoder);
      return function (param) {
        return field(key, partial_arg, param);
      };
    } else {
      return function (param) {
        return field(key, decoder, param);
      };
    }
  } else {
    throw [__WEBPACK_IMPORTED_MODULE_6_bs_platform_lib_es6_caml_builtin_exceptions_js__["e" /* invalid_argument */], "Expected key_path to contain at least one element"];
  }
}

function optional(decode, json) {
  var exit = 0;
  var v;
  try {
    v = __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decode, json);
    exit = 1;
  } catch (raw_exn) {
    var exn = __WEBPACK_IMPORTED_MODULE_3_bs_platform_lib_es6_js_exn_js__["a" /* internalToOCamlException */](raw_exn);
    if (exn[0] === DecodeError) {
      return (/* None */0
      );
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    return (/* Some */[v]
    );
  }
}

function oneOf(_decoders, json) {
  while (true) {
    var decoders = _decoders;
    if (decoders) {
      try {
        return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decoders[0], json);
      } catch (exn) {
        _decoders = decoders[1];
        continue;
      }
    } else {
      var length = __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_list_js__["f" /* length */](decoders);
      throw [DecodeError, "Expected oneOf " + (String(length) + ", got ") + JSON.stringify(json)];
    }
  };
}

function either(a, b) {
  var partial_arg_001 = /* :: */[b,
  /* [] */0];
  var partial_arg = /* :: */[a, partial_arg_001];
  return function (param) {
    return oneOf(partial_arg, param);
  };
}

function withDefault($$default, decode, json) {
  try {
    return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decode, json);
  } catch (exn) {
    return $$default;
  }
}

function map(f, decode, json) {
  return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](f, __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](decode, json));
}

function andThen(b, a, json) {
  return __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["b" /* _2 */](b, __WEBPACK_IMPORTED_MODULE_2_bs_platform_lib_es6_curry_js__["a" /* _1 */](a, json), json);
}


/* No side effect */

/***/ }),
/* 195 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export unsafe_ceil */
/* unused harmony export ceil_int */
/* unused harmony export ceil */
/* unused harmony export unsafe_floor */
/* unused harmony export floor_int */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return floor; });
/* unused harmony export random_int */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pervasives_js__ = __webpack_require__(13);




function unsafe_ceil(prim) {
  return Math.ceil(prim);
}

function ceil_int(f) {
  if (f > __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["b" /* max_int */]) {
    return __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["b" /* max_int */];
  } else if (f < __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["d" /* min_int */]) {
    return __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["d" /* min_int */];
  } else {
    return Math.ceil(f);
  }
}

function unsafe_floor(prim) {
  return Math.floor(prim);
}

function floor_int(f) {
  if (f > __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["b" /* max_int */]) {
    return __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["b" /* max_int */];
  } else if (f < __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["d" /* min_int */]) {
    return __WEBPACK_IMPORTED_MODULE_0__pervasives_js__["d" /* min_int */];
  } else {
    return Math.floor(f);
  }
}

function random_int(min, max) {
  return floor_int(Math.random() * (max - min | 0)) + min | 0;
}

var ceil = ceil_int;

var floor = floor_int;


/* No side effect */

/***/ }),
/* 196 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export accentHeight */
/* unused harmony export accelerate */
/* unused harmony export accumulate */
/* unused harmony export additive */
/* unused harmony export alphabetic */
/* unused harmony export allowReorder */
/* unused harmony export amplitude */
/* unused harmony export arabicForm */
/* unused harmony export ascent */
/* unused harmony export attributeName */
/* unused harmony export attributeType */
/* unused harmony export autoReverse */
/* unused harmony export azimuth */
/* unused harmony export baseFrequency */
/* unused harmony export baseProfile */
/* unused harmony export bbox */
/* unused harmony export begin$prime */
/* unused harmony export bias */
/* unused harmony export by */
/* unused harmony export calcMode */
/* unused harmony export capHeight */
/* unused harmony export class$prime */
/* unused harmony export clipPathUnits */
/* unused harmony export contentScriptType */
/* unused harmony export contentStyleType */
/* unused harmony export cx */
/* unused harmony export cy */
/* unused harmony export d */
/* unused harmony export decelerate */
/* unused harmony export descent */
/* unused harmony export diffuseConstant */
/* unused harmony export divisor */
/* unused harmony export dur */
/* unused harmony export dx */
/* unused harmony export dy */
/* unused harmony export edgeMode */
/* unused harmony export elevation */
/* unused harmony export end$prime */
/* unused harmony export exponent */
/* unused harmony export externalResourcesRequired */
/* unused harmony export filterRes */
/* unused harmony export filterUnits */
/* unused harmony export format */
/* unused harmony export from */
/* unused harmony export fx */
/* unused harmony export fy */
/* unused harmony export g1 */
/* unused harmony export g2 */
/* unused harmony export glyphName */
/* unused harmony export glyphRef */
/* unused harmony export gradientTransform */
/* unused harmony export gradientUnits */
/* unused harmony export hanging */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return height; });
/* unused harmony export horizAdvX */
/* unused harmony export horizOriginX */
/* unused harmony export horizOriginY */
/* unused harmony export id */
/* unused harmony export ideographic */
/* unused harmony export in$prime */
/* unused harmony export in2 */
/* unused harmony export intercept */
/* unused harmony export k */
/* unused harmony export k1 */
/* unused harmony export k2 */
/* unused harmony export k3 */
/* unused harmony export k4 */
/* unused harmony export kernelMatrix */
/* unused harmony export kernelUnitLength */
/* unused harmony export keyPoints */
/* unused harmony export keySplines */
/* unused harmony export keyTimes */
/* unused harmony export lang */
/* unused harmony export lengthAdjust */
/* unused harmony export limitingConeAngle */
/* unused harmony export local */
/* unused harmony export markerHeight */
/* unused harmony export markerUnits */
/* unused harmony export markerWidth */
/* unused harmony export maskContentUnits */
/* unused harmony export maskUnits */
/* unused harmony export mathematical */
/* unused harmony export max */
/* unused harmony export media */
/* unused harmony export method$prime */
/* unused harmony export min */
/* unused harmony export mode */
/* unused harmony export name */
/* unused harmony export numOctaves */
/* unused harmony export offset */
/* unused harmony export operator */
/* unused harmony export order */
/* unused harmony export orient */
/* unused harmony export orientation */
/* unused harmony export origin */
/* unused harmony export overlinePosition */
/* unused harmony export overlineThickness */
/* unused harmony export panose1 */
/* unused harmony export path */
/* unused harmony export pathLength */
/* unused harmony export patternContentUnits */
/* unused harmony export patternTransform */
/* unused harmony export patternUnits */
/* unused harmony export pointOrder */
/* unused harmony export points */
/* unused harmony export pointsAtX */
/* unused harmony export pointsAtY */
/* unused harmony export pointsAtZ */
/* unused harmony export preserveAlpha */
/* unused harmony export preserveAspectRatio */
/* unused harmony export primitiveUnits */
/* unused harmony export r */
/* unused harmony export radius */
/* unused harmony export refX */
/* unused harmony export refY */
/* unused harmony export renderingIntent */
/* unused harmony export repeatCount */
/* unused harmony export repeatDur */
/* unused harmony export requiredExtensions */
/* unused harmony export requiredFeatures */
/* unused harmony export restart */
/* unused harmony export result */
/* unused harmony export rotate */
/* unused harmony export rx */
/* unused harmony export ry */
/* unused harmony export scale */
/* unused harmony export seed */
/* unused harmony export slope */
/* unused harmony export spacing */
/* unused harmony export specularConstant */
/* unused harmony export specularExponent */
/* unused harmony export speed */
/* unused harmony export spreadMethod */
/* unused harmony export startOffset */
/* unused harmony export stdDeviation */
/* unused harmony export stemh */
/* unused harmony export stemv */
/* unused harmony export stitchTiles */
/* unused harmony export strikethroughPosition */
/* unused harmony export strikethroughThickness */
/* unused harmony export string */
/* unused harmony export style */
/* unused harmony export surfaceScale */
/* unused harmony export systemLanguage */
/* unused harmony export tableValues */
/* unused harmony export target */
/* unused harmony export targetX */
/* unused harmony export targetY */
/* unused harmony export textLength */
/* unused harmony export title */
/* unused harmony export to$prime */
/* unused harmony export transform */
/* unused harmony export type$prime */
/* unused harmony export u1 */
/* unused harmony export u2 */
/* unused harmony export underlinePosition */
/* unused harmony export underlineThickness */
/* unused harmony export unicode */
/* unused harmony export unicodeRange */
/* unused harmony export unitsPerEm */
/* unused harmony export vAlphabetic */
/* unused harmony export vHanging */
/* unused harmony export vIdeographic */
/* unused harmony export vMathematical */
/* unused harmony export values */
/* unused harmony export version */
/* unused harmony export vertAdvY */
/* unused harmony export vertOriginX */
/* unused harmony export vertOriginY */
/* unused harmony export viewBox */
/* unused harmony export viewTarget */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return width; });
/* unused harmony export widths */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return x; });
/* unused harmony export xHeight */
/* unused harmony export x1 */
/* unused harmony export x2 */
/* unused harmony export xChannelSelector */
/* unused harmony export xlinkActuate */
/* unused harmony export xlinkArcrole */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return xlinkHref; });
/* unused harmony export xlinkRole */
/* unused harmony export xlinkShow */
/* unused harmony export xlinkTitle */
/* unused harmony export xlinkType */
/* unused harmony export xmlBase */
/* unused harmony export xmlLang */
/* unused harmony export xmlSpace */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return y; });
/* unused harmony export y1 */
/* unused harmony export y2 */
/* unused harmony export yChannelSelector */
/* unused harmony export z */
/* unused harmony export zoomAndPan */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return alignmentBaseline; });
/* unused harmony export baselineShift */
/* unused harmony export clipPath */
/* unused harmony export clipRule */
/* unused harmony export clip */
/* unused harmony export colorInterpolationFilters */
/* unused harmony export colorInterpolation */
/* unused harmony export colorProfile */
/* unused harmony export colorRendering */
/* unused harmony export color */
/* unused harmony export cursor */
/* unused harmony export direction */
/* unused harmony export display */
/* unused harmony export dominantBaseline */
/* unused harmony export enableBackground */
/* unused harmony export fillOpacity */
/* unused harmony export fillRule */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return fill; });
/* unused harmony export filter */
/* unused harmony export floodColor */
/* unused harmony export floodOpacity */
/* unused harmony export fontFamily */
/* unused harmony export fontSizeAdjust */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fontSize; });
/* unused harmony export fontStretch */
/* unused harmony export fontStyle */
/* unused harmony export fontVariant */
/* unused harmony export fontWeight */
/* unused harmony export glyphOrientationHorizontal */
/* unused harmony export glyphOrientationVertical */
/* unused harmony export imageRendering */
/* unused harmony export kerning */
/* unused harmony export letterSpacing */
/* unused harmony export lightingColor */
/* unused harmony export markerEnd */
/* unused harmony export markerMid */
/* unused harmony export markerStart */
/* unused harmony export mask */
/* unused harmony export opacity */
/* unused harmony export overflow */
/* unused harmony export pointerEvents */
/* unused harmony export shapeRendering */
/* unused harmony export stopColor */
/* unused harmony export stopOpacity */
/* unused harmony export strokeDasharray */
/* unused harmony export strokeDashoffset */
/* unused harmony export strokeLinecap */
/* unused harmony export strokeLinejoin */
/* unused harmony export strokeMiterlimit */
/* unused harmony export strokeOpacity */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return strokeWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return stroke; });
/* unused harmony export textAnchor */
/* unused harmony export textDecoration */
/* unused harmony export textRendering */
/* unused harmony export unicodeBidi */
/* unused harmony export visibility */
/* unused harmony export wordSpacing */
/* unused harmony export writingMode */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__ = __webpack_require__(4);
// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE




function accentHeight(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "accent-height", v])
  );
}

function accelerate(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "accelerate", v])
  );
}

function accumulate(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "accumulate", v])
  );
}

function additive(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "additive", v])
  );
}

function alphabetic(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "alphabetic", v])
  );
}

function allowReorder(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "allowReorder", v])
  );
}

function amplitude(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "amplitude", v])
  );
}

function arabicForm(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "arabic-form", v])
  );
}

function ascent(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "ascent", v])
  );
}

function attributeName(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "attributeName", v])
  );
}

function attributeType(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "attributeType", v])
  );
}

function autoReverse(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "autoReverse", v])
  );
}

function azimuth(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "azimuth", v])
  );
}

function baseFrequency(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "baseFrequency", v])
  );
}

function baseProfile(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "baseProfile", v])
  );
}

function bbox(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "bbox", v])
  );
}

function begin$prime(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "begin", v])
  );
}

function bias(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "bias", v])
  );
}

function by(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "by", v])
  );
}

function calcMode(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "calcMode", v])
  );
}

function capHeight(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "cap-height", v])
  );
}

function class$prime(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "class", v])
  );
}

function clipPathUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "clipPathUnits", v])
  );
}

function contentScriptType(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "contentScriptType", v])
  );
}

function contentStyleType(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "contentStyleType", v])
  );
}

function cx(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "cx", v])
  );
}

function cy(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "cy", v])
  );
}

function d(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "d", v])
  );
}

function decelerate(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "decelerate", v])
  );
}

function descent(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "descent", v])
  );
}

function diffuseConstant(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "diffuseConstant", v])
  );
}

function divisor(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "divisor", v])
  );
}

function dur(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "dur", v])
  );
}

function dx(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "dx", v])
  );
}

function dy(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "dy", v])
  );
}

function edgeMode(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "edgeMode", v])
  );
}

function elevation(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "elevation", v])
  );
}

function end$prime(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "end", v])
  );
}

function exponent(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "exponent", v])
  );
}

function externalResourcesRequired(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "externalResourcesRequired", v])
  );
}

function filterRes(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "filterRes", v])
  );
}

function filterUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "filterUnits", v])
  );
}

function format(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "format", v])
  );
}

function from(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "from", v])
  );
}

function fx(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "fx", v])
  );
}

function fy(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "fy", v])
  );
}

function g1(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "g1", v])
  );
}

function g2(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "g2", v])
  );
}

function glyphName(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "glyph-name", v])
  );
}

function glyphRef(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "glyphRef", v])
  );
}

function gradientTransform(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "gradientTransform", v])
  );
}

function gradientUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "gradientUnits", v])
  );
}

function hanging(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "hanging", v])
  );
}

function height(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "height", v])
  );
}

function horizAdvX(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "horiz-adv-x", v])
  );
}

function horizOriginX(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "horiz-origin-x", v])
  );
}

function horizOriginY(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "horiz-origin-y", v])
  );
}

function id(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "id", v])
  );
}

function ideographic(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "ideographic", v])
  );
}

function in$prime(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "in", v])
  );
}

function in2(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "in2", v])
  );
}

function intercept(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "intercept", v])
  );
}

function k(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "k", v])
  );
}

function k1(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "k1", v])
  );
}

function k2(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "k2", v])
  );
}

function k3(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "k3", v])
  );
}

function k4(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "k4", v])
  );
}

function kernelMatrix(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "kernelMatrix", v])
  );
}

function kernelUnitLength(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "kernelUnitLength", v])
  );
}

function keyPoints(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "keyPoints", v])
  );
}

function keySplines(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "keySplines", v])
  );
}

function keyTimes(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "keyTimes", v])
  );
}

function lang(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "lang", v])
  );
}

function lengthAdjust(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "lengthAdjust", v])
  );
}

function limitingConeAngle(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "limitingConeAngle", v])
  );
}

function local(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "local", v])
  );
}

function markerHeight(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "markerHeight", v])
  );
}

function markerUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "markerUnits", v])
  );
}

function markerWidth(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "markerWidth", v])
  );
}

function maskContentUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "maskContentUnits", v])
  );
}

function maskUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "maskUnits", v])
  );
}

function mathematical(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "mathematical", v])
  );
}

function max(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "max", v])
  );
}

function media(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "media", v])
  );
}

function method$prime(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "method", v])
  );
}

function min(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "min", v])
  );
}

function mode(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "mode", v])
  );
}

function name(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "name", v])
  );
}

function numOctaves(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "numOctaves", v])
  );
}

function offset(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "offset", v])
  );
}

function operator(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "operator", v])
  );
}

function order(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "order", v])
  );
}

function orient(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "orient", v])
  );
}

function orientation(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "orientation", v])
  );
}

function origin(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "origin", v])
  );
}

function overlinePosition(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "overline-position", v])
  );
}

function overlineThickness(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "overline-thickness", v])
  );
}

function panose1(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "panose-1", v])
  );
}

function path(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "path", v])
  );
}

function pathLength(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "pathLength", v])
  );
}

function patternContentUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "patternContentUnits", v])
  );
}

function patternTransform(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "patternTransform", v])
  );
}

function patternUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "patternUnits", v])
  );
}

function pointOrder(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "point-order", v])
  );
}

function points(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "points", v])
  );
}

function pointsAtX(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "pointsAtX", v])
  );
}

function pointsAtY(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "pointsAtY", v])
  );
}

function pointsAtZ(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "pointsAtZ", v])
  );
}

function preserveAlpha(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "preserveAlpha", v])
  );
}

function preserveAspectRatio(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "preserveAspectRatio", v])
  );
}

function primitiveUnits(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "primitiveUnits", v])
  );
}

function r(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "r", v])
  );
}

function radius(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "radius", v])
  );
}

function refX(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "refX", v])
  );
}

function refY(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "refY", v])
  );
}

function renderingIntent(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "rendering-intent", v])
  );
}

function repeatCount(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "repeatCount", v])
  );
}

function repeatDur(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "repeatDur", v])
  );
}

function requiredExtensions(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "requiredExtensions", v])
  );
}

function requiredFeatures(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "requiredFeatures", v])
  );
}

function restart(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "restart", v])
  );
}

function result(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "result", v])
  );
}

function rotate(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "rotate", v])
  );
}

function rx(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "rx", v])
  );
}

function ry(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "ry", v])
  );
}

function scale(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "scale", v])
  );
}

function seed(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "seed", v])
  );
}

function slope(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "slope", v])
  );
}

function spacing(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "spacing", v])
  );
}

function specularConstant(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "specularConstant", v])
  );
}

function specularExponent(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "specularExponent", v])
  );
}

function speed(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "speed", v])
  );
}

function spreadMethod(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "spreadMethod", v])
  );
}

function startOffset(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "startOffset", v])
  );
}

function stdDeviation(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stdDeviation", v])
  );
}

function stemh(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stemh", v])
  );
}

function stemv(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stemv", v])
  );
}

function stitchTiles(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stitchTiles", v])
  );
}

function strikethroughPosition(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "strikethrough-position", v])
  );
}

function strikethroughThickness(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "strikethrough-thickness", v])
  );
}

function string(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "string", v])
  );
}

function style(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "style", v])
  );
}

function surfaceScale(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "surfaceScale", v])
  );
}

function systemLanguage(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "systemLanguage", v])
  );
}

function tableValues(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "tableValues", v])
  );
}

function target(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "target", v])
  );
}

function targetX(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "targetX", v])
  );
}

function targetY(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "targetY", v])
  );
}

function textLength(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "textLength", v])
  );
}

function title(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "title", v])
  );
}

function to$prime(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "to", v])
  );
}

function transform(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "transform", v])
  );
}

function type$prime(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "type", v])
  );
}

function u1(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "u1", v])
  );
}

function u2(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "u2", v])
  );
}

function underlinePosition(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "underline-position", v])
  );
}

function underlineThickness(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "underline-thickness", v])
  );
}

function unicode(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "unicode", v])
  );
}

function unicodeRange(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "unicode-range", v])
  );
}

function unitsPerEm(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "units-per-em", v])
  );
}

function vAlphabetic(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "v-alphabetic", v])
  );
}

function vHanging(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "v-hanging", v])
  );
}

function vIdeographic(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "v-ideographic", v])
  );
}

function vMathematical(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "v-mathematical", v])
  );
}

function values(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "values", v])
  );
}

function version(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "version", v])
  );
}

function vertAdvY(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "vert-adv-y", v])
  );
}

function vertOriginX(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "vert-origin-x", v])
  );
}

function vertOriginY(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "vert-origin-y", v])
  );
}

function viewBox(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "viewBox", v])
  );
}

function viewTarget(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "viewTarget", v])
  );
}

function width(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "width", v])
  );
}

function widths(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "widths", v])
  );
}

function x(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "x", v])
  );
}

function xHeight(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "x-height", v])
  );
}

function x1(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "x1", v])
  );
}

function x2(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "x2", v])
  );
}

function xChannelSelector(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "xChannelSelector", v])
  );
}

function xlinkActuate(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/1999/xlink", "xlink:actuate", v])
  );
}

function xlinkArcrole(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/1999/xlink", "xlink:arcrole", v])
  );
}

function xlinkHref(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/1999/xlink", "xlink:href", v])
  );
}

function xlinkRole(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/1999/xlink", "xlink:role", v])
  );
}

function xlinkShow(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/1999/xlink", "xlink:show", v])
  );
}

function xlinkTitle(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/1999/xlink", "xlink:title", v])
  );
}

function xlinkType(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/1999/xlink", "xlink:type", v])
  );
}

function xmlBase(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/XML/1998/namespace", "xml:base", v])
  );
}

function xmlLang(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/XML/1998/namespace", "xml:lang", v])
  );
}

function xmlSpace(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["http://www.w3.org/XML/1998/namespace", "xml:space", v])
  );
}

function y(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "y", v])
  );
}

function y1(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "y1", v])
  );
}

function y2(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "y2", v])
  );
}

function yChannelSelector(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "yChannelSelector", v])
  );
}

function z(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "z", v])
  );
}

function zoomAndPan(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "zoomAndPan", v])
  );
}

function alignmentBaseline(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "alignment-baseline", v])
  );
}

function baselineShift(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "baseline-shift", v])
  );
}

function clipPath(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "clip-path", v])
  );
}

function clipRule(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "clip-rule", v])
  );
}

function clip(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "clip", v])
  );
}

function colorInterpolationFilters(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "color-interpolation-filters", v])
  );
}

function colorInterpolation(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "color-interpolation", v])
  );
}

function colorProfile(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "color-profile", v])
  );
}

function colorRendering(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "color-rendering", v])
  );
}

function color(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "color", v])
  );
}

function cursor(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "cursor", v])
  );
}

function direction(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "direction", v])
  );
}

function display(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "display", v])
  );
}

function dominantBaseline(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "dominant-baseline", v])
  );
}

function enableBackground(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "enable-background", v])
  );
}

function fillOpacity(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "fill-opacity", v])
  );
}

function fillRule(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "fill-rule", v])
  );
}

function fill(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "fill", v])
  );
}

function filter(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "filter", v])
  );
}

function floodColor(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "flood-color", v])
  );
}

function floodOpacity(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "flood-opacity", v])
  );
}

function fontFamily(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "font-family", v])
  );
}

function fontSizeAdjust(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "font-size-adjust", v])
  );
}

function fontSize(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "font-size", v])
  );
}

function fontStretch(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "font-stretch", v])
  );
}

function fontStyle(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "font-style", v])
  );
}

function fontVariant(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "font-variant", v])
  );
}

function fontWeight(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "font-weight", v])
  );
}

function glyphOrientationHorizontal(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "glyph-orientation-horizontal", v])
  );
}

function glyphOrientationVertical(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "glyph-orientation-vertical", v])
  );
}

function imageRendering(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "image-rendering", v])
  );
}

function kerning(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "kerning", v])
  );
}

function letterSpacing(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "letter-spacing", v])
  );
}

function lightingColor(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "lighting-color", v])
  );
}

function markerEnd(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "marker-end", v])
  );
}

function markerMid(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "marker-mid", v])
  );
}

function markerStart(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "marker-start", v])
  );
}

function mask(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "mask", v])
  );
}

function opacity(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "opacity", v])
  );
}

function overflow(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "overflow", v])
  );
}

function pointerEvents(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "pointer-events", v])
  );
}

function shapeRendering(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "shape-rendering", v])
  );
}

function stopColor(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stop-color", v])
  );
}

function stopOpacity(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stop-opacity", v])
  );
}

function strokeDasharray(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke-dasharray", v])
  );
}

function strokeDashoffset(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke-dashoffset", v])
  );
}

function strokeLinecap(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke-linecap", v])
  );
}

function strokeLinejoin(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke-linejoin", v])
  );
}

function strokeMiterlimit(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke-miterlimit", v])
  );
}

function strokeOpacity(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke-opacity", v])
  );
}

function strokeWidth(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke-width", v])
  );
}

function stroke(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "stroke", v])
  );
}

function textAnchor(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "text-anchor", v])
  );
}

function textDecoration(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "text-decoration", v])
  );
}

function textRendering(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "text-rendering", v])
  );
}

function unicodeBidi(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "unicode-bidi", v])
  );
}

function visibility(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "visibility", v])
  );
}

function wordSpacing(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "word-spacing", v])
  );
}

function writingMode(v) {
  return (/* Attribute */__WEBPACK_IMPORTED_MODULE_0_bs_platform_lib_es6_block_js__["a" /* __ */](1, ["", "writing-mode", v])
  );
}


/* No side effect */

/***/ }),
/* 197 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export some */
/* unused harmony export isSome */
/* unused harmony export isSomeValue */
/* unused harmony export isNone */
/* unused harmony export getExn */
/* unused harmony export equal */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return andThen; });
/* unused harmony export map */
/* unused harmony export getWithDefault */
/* unused harmony export $$default */
/* unused harmony export default */
/* unused harmony export filter */
/* unused harmony export firstSome */


function some(x) {
  return (/* Some */[x]
  );
}

function isSome(param) {
  if (param) {
    return (/* true */1
    );
  } else {
    return (/* false */0
    );
  }
}

function isSomeValue(eq, v, x) {
  if (x) {
    return eq(v, x[0]);
  } else {
    return (/* false */0
    );
  }
}

function isNone(param) {
  if (param) {
    return (/* false */0
    );
  } else {
    return (/* true */1
    );
  }
}

function getExn(x) {
  if (x) {
    return x[0];
  } else {
    throw new Error("Bs_option.getExn");
  }
}

function equal(eq, a, b) {
  if (a) {
    if (b) {
      return eq(a[0], b[0]);
    } else {
      return (/* false */0
      );
    }
  } else {
    return +(b === /* None */0);
  }
}

function andThen(f, x) {
  if (x) {
    return f(x[0]);
  } else {
    return (/* None */0
    );
  }
}

function map(f, x) {
  if (x) {
    return (/* Some */[f(x[0])]
    );
  } else {
    return (/* None */0
    );
  }
}

function getWithDefault(a, x) {
  if (x) {
    return x[0];
  } else {
    return a;
  }
}

function filter(f, x) {
  if (x) {
    var x$1 = x[0];
    if (f(x$1)) {
      return (/* Some */[x$1]
      );
    } else {
      return (/* None */0
      );
    }
  } else {
    return (/* None */0
    );
  }
}

function firstSome(a, b) {
  if (a) {
    return a;
  } else if (b) {
    return b;
  } else {
    return (/* None */0
    );
  }
}

var $$default = getWithDefault;


/* No side effect */

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map