define(['jquery', 'moment', 'lodash'], function ($, moment, lodash) {
	function unwrapFunctionArgument(argument) {
		return lodash.isFunction(argument) ? argument() : argument;
	}

	function getLastArgument(args) {
		var last = Array.prototype.slice.call(args, args.length - 1, args.length);

		return last[0];
	}

	return {
		any: function (array, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			array = unwrapFunctionArgument(array);

			if (array.length > 0) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		lengthEqual: function (array, length, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			array = unwrapFunctionArgument(array);
			length = unwrapFunctionArgument(length);

			if (array.length === length) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		empty: function (array, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			array = unwrapFunctionArgument(array);

			if (array.length <= 0) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		after: function (array, count, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			array = unwrapFunctionArgument(array);
			count = unwrapFunctionArgument(count);

			return array.slice(count);
		},
		before: function (array, count, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			array = unwrapFunctionArgument(array);
			count = unwrapFunctionArgument(count);

			return array.slice(0, -count);
		},
		first: function (array, count, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			if (options === undefined) {
				options = arguments[1];
				arguments[1] = undefined;
			}
			array = unwrapFunctionArgument(array);
			count = unwrapFunctionArgument(count);

			if (count === undefined) {
				return array[0];
			} else {
				return array.slice(0, count);
			}
		},
		last: function (array, count, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			if (options === undefined) {
				options = arguments[1];
				arguments[1] = undefined;
			}
			array = unwrapFunctionArgument(array);
			count = unwrapFunctionArgument(count);

			if (count === undefined) {
				return array[array.length - 1];
			} else {
				return array.slice(-count);
			}
		},
		contains: function (str, pattern, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			str = unwrapFunctionArgument(str);
			pattern = unwrapFunctionArgument(pattern);

			if (str.indexOf(pattern) !== -1) {
				return options.fn(this);
			}
			return options.inverse(this);
		},
		and: function (op1, op2, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			if (options === undefined) {
				options = arguments[1];
				arguments[1] = undefined;
			}
			op1 = unwrapFunctionArgument(op1);
			op2 = unwrapFunctionArgument(op2);

			if (op1 && (op2 || op2 === undefined)) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		gt: function (value, op, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			value = unwrapFunctionArgument(value);
			op = unwrapFunctionArgument(op);

			if (value > op) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		gte: function (value, op, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			value = unwrapFunctionArgument(value);
			op = unwrapFunctionArgument(op);

			if (value >= op) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		is: function (value, op, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			value = unwrapFunctionArgument(value);
			op = unwrapFunctionArgument(op);

			if (value === op) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		isArray: function (value, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			value = unwrapFunctionArgument(value);

			if (typeof testArr == "object" && value.constructor === Array) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		isnt: function (value, op, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			value = unwrapFunctionArgument(value);
			op = unwrapFunctionArgument(op);

			if (value !== op) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		lt: function (value, op, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			value = unwrapFunctionArgument(value);
			op = unwrapFunctionArgument(op);

			if (value < op) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		lte: function (value, op, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			value = unwrapFunctionArgument(value);
			op = unwrapFunctionArgument(op);

			if (value <= op) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		or: function (op1, op2, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			if (options === undefined) {
				options = arguments[1];
				arguments[1] = undefined;
			}
			op1 = unwrapFunctionArgument(op1);
			op2 = unwrapFunctionArgument(op2);

			if (op1 || op2) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		ifNth: function (nr, v, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			nr = unwrapFunctionArgument(nr);
			v = unwrapFunctionArgument(v);

			v = v + 1;
			if (v % nr === 0) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		compare: function (left, operator, right, options) {
			if (arguments.length < 4) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}

			var operators = {
				'==': function (l, r) {
					return l == r;
				},
				'===': function (l, r) {
					return l === r;
				},
				'!=': function (l, r) {
					return l != r;
				},
				'!==': function (l, r) {
					return l !== r;
				},
				'<': function (l, r) {
					return l < r;
				},
				'>': function (l, r) {
					return l > r;
				},
				'<=': function (l, r) {
					return l <= r;
				},
				'>=': function (l, r) {
					return l >= r;
				},
				'typeof': function (l, r) {
					return typeof l == r;
				}
			}, result;

			left = unwrapFunctionArgument(left);
			operator = unwrapFunctionArgument(operator);
			right = unwrapFunctionArgument(right);
			if (!operators[operator]) {
				throw new Error('Helper "compare" doesn\'t know the operator ' + operator);
			}
			result = operators[operator](left, right);
			if (result) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		ifAny: function () {
			var argLength = arguments.length - 1,
				content = arguments[argLength],
				success = true,
				i = 0;

			while (i < argLength) {
				var test = unwrapFunctionArgument(arguments[i]);

				if (!test) {
					success = false;
					break;
				}
				i += 1;
			}
			if (argLength > 0 && success) {
				return content.fn(this);
			} else {
				return content.inverse(this);
			}
		},
		ifEven: function (conditional, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
			conditional = unwrapFunctionArgument(conditional);
			if ((conditional % 2) == 0) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		'in': function () {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}

			var testVal = arguments[0],
				validVals = lodash.map(Array.prototype.slice.call(arguments, 1, arguments.length - 1), function (arg) {
					return unwrapFunctionArgument(arg);
				}),
				options = validVals.pop();

			testVal = unwrapFunctionArgument(testVal);
			if (validVals.indexOf(testVal) !== -1) {
				return options.fn(this);
			}
			else {
				return options.inverse(this);
			}
		},
		array: function () {
			if (arguments.length < 2) {
				return [];
			}

			var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

			// pops context
			args.pop();
			return lodash.map(args, function (arg) {
				return unwrapFunctionArgument(arg);
			});
		},
		repeat: function (until, options) {
			var result = [];

			if (!options) {
				return result;
			}
			until = parseInt(lodash.isFunction(until) ? until() : until);
			if (isNaN(until)) {
				return result;
			}
			for (var i = 0; i < until; i++) {
				result.push(options.fn(options.scope.add({'@index': i}).add(this)));
			}
			return result;
		},
		target: function (behavior, options) {
			return function (el) {
				var $el = $(el), target = '_self';

				if (!options) {
					options = behavior;
				}
				switch (behavior) {
					case 'New Window':
						target = '_blank';
						break;
					case 'Modal':
						target = 'modal';
						break;
					default:
						break;
				}
				if (target === 'modal') {
					$el.attr('role', 'modal');
				}
				else {
					$el.attr('target', target);
				}
			}
		},
		timeago: function (date, options) {
			if (!options) {
				return '';
			}
			var lang = options && options.hash && options.hash.lang || $('html').attr('lang') || 'en',
				prevLocale = moment.locale(),
				str;

			moment.locale(lang);
			str = lodash.capitalize(moment(new Date(unwrapFunctionArgument(date))).fromNow());
			moment.locale(prevLocale);
			return str;
		},
		moment: function (date, format, options) {
			var options = getLastArgument(arguments),
				date = format && date || new Date().valueOf(),
				prevLocale = moment.locale(),
				lang,
				format,
				str;

			if (!options) {
				return '';
			}
			lang = options && options.hash && options.hash.lang || $('html').attr('lang') || 'en';
			date = unwrapFunctionArgument(date);
			format = arguments.length > 2 && format || options && options.hash && options.hash.format || 'YYYY-MM-DD';
			format = unwrapFunctionArgument(format);
			moment.locale(lang);
			str = moment(new Date(date), format, lang);
			moment.locale(prevLocale);
			return str;
		},
		link: function (url, options) {
			if (arguments.length < 2) {
				return '';
			}
			url = unwrapFunctionArgument(url);
			if (!lodash.isString(url)) {
				url = '';
			}

			var hash = options.hash && options.hash.hash;

			if (hash) {
				var hashPos = url.indexOf('#');

				if (hashPos === -1) {
					hash = '#' + hash;
					hashPos = url.length;
				}
				else {
					hashPos += 1;
				}
				url = url.substr(0, hashPos) + hash;
			}

			return url;
		}
	}
});
