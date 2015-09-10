var lodash = require('lodash'),
	moment = require('moment'),
	handlebars = require('handlebars');

var getStack = function (context) {
	return context.$$layoutStack || (
			context.$$layoutStack = []
		);
};

var applyStack = function (context) {
	var stack = getStack(context);

	while (stack.length) {
		stack.shift()(context);
	}
};

var getActions = function (context) {
	return context.$$layoutActions || (
			context.$$layoutActions = {}
		);
};

var getActionsByName = function (context, name) {
	var actions = getActions(context);

	return actions[name] || (
			actions[name] = []
		);
};

var applyAction = function (val, action) {
	switch (action.mode) {
		case 'append':
			return val + action.fn(this);

		case 'prepend':
			return action.fn(this) + val;

		case 'replace':
			return action.fn(this);

		default:
			return val;
	}
};

var mixin = function (target) {
	var arg,
		key,
		len = arguments.length,
		i = 1;

	for (; i < len; i++) {
		arg = arguments[i];

		if (!arg) {
			continue;
		}

		for (key in arg) {
			if (arg.hasOwnProperty(key)) {
				target[key] = arg[key];
			}
		}
	}

	return target;
};

function getLastArgument(args) {
	var last = Array.prototype.slice.call(args, args.length - 1, args.length);

	return last[0];
}

module.exports = new function () {
	var helpers = {
		extend: function (name, customContext, options) {
			// Make `customContext` optional
			if (arguments.length < 3) {
				options = customContext;
				customContext = null;
			}

			options = options || {};

			var fn = options.fn || lodash.noop,
				context = Object.create(this || /* istanbul ignore next */ {}),
				template = handlebars.partials[name];

			// Mix custom context and hash into context
			mixin(context, customContext, options.hash);

			// Partial template required
			if (!template) {
				throw new Error('Missing partial: \'' + name + '\'');
			}

			// Compile partial, if needed
			if (typeof template !== 'function') {
				template = handlebars.compile(template);
			}

			// Add overrides to stack
			getStack(context).push(fn);

			// Render partial
			return template(context, {
				data: handlebars.createFrame(options.data),
				helpers: options.helpers
			});
		},
		embed: function () {
			var context = Object.create(this || {});

			// Reset context
			context.$$layoutStack = null;
			context.$$layoutActions = null;

			// Extend
			return helpers.extend.apply(context, arguments);
		},
		block: function (name, options) {
			options = options || {};

			var fn = options.fn || lodash.noop,
				context = this || {};

			applyStack(context);

			return getActionsByName(context, name).reduce(
				applyAction.bind(context),
				fn(context)
			);
		},
		content: function (name, options) {
			options = options || {};

			var fn = options.fn,
				hash = options.hash || {},
				mode = hash.mode || 'replace',
				context = this || {};

			applyStack(context);

			// Getter
			if (!fn) {
				return name in getActions(context);
			}

			// Setter
			getActionsByName(context, name).push({
				mode: mode.toLowerCase(),
				fn: fn
			});
		},
		any: function (array, options) {
			if (arguments.length < 2) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}
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

			return array.slice(count);
		},
		before: function (array, count, options) {
			if (arguments.length < 3) {
				options = getLastArgument(arguments);
				return options ? options.inverse(this) : '';
			}

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
				var test = utils.unwrapFunctionArgument(arguments[i]);

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
				validVals = Array.prototype.slice.call(arguments, 1, arguments.length - 1),
				options = validVals.pop();

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
			return args;
		},
		repeat: function (until, options) {
			var context = this, output = [], fn, inverse, data, contextPath, i = 0;

			options = getLastArgument(arguments);
			if (arguments.length < 2) {
				return options ? options.inverse(this) : '';
			}
			fn = options.fn;
			inverse = options.inverse;
			if (isNaN(until)) {
				return inverse(this);
			}
			if (options.data) {
				contextPath = handlebars.Utils.appendContextPath(options.data.contextPath, until) + '.';
			}
			if (options.data) {
				data = handlebars.createFrame(options.data);
			}
			function execIteration(index, last) {
				if (data) {
					data.index = index;
					data.first = index === 0;
					data.last = !!last;
					if (contextPath) {
						data.contextPath = contextPath + index;
					}
				}
				output.push(fn(context, {
					data: data,
					blockParams: handlebars.Utils.blockParams([context, index], [contextPath + index, null])
				}));
			}

			for (; i < until; i++) {
				execIteration(i, i === until - 1);
			}
			if (i === 0) {
				output = inverse(this);
			}

			return output;
		},
		timeago: function (date, options) {
			if (!options) {
				return '';
			}

			return lodash.capitalize(moment(date).fromNow());
		},
		link: function (url, options) {
			if (arguments.length < 2) {
				return '';
			}
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
		},
		serialize: function (context, options) {
			return new handlebars.SafeString(JSON.stringify(options ? utils.unwrapFunctionArgument(context) : {}));
		},
		uniqueId: function (options) {
			if (options.data._uniqueMaxId) {
				return options.data._uniqueMaxId;
			}
			return (options.data._uniqueMaxId = lodash.uniqueId('id-'));
		},
		target: function (behavior, options) {
			var target = '_self';

			if (options && behavior === 'New Window') {
				target = '_blank';
			}

			return target;
		}
	};
};
