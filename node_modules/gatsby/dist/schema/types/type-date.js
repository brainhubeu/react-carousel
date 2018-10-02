"use strict";

exports.__esModule = true;
exports.shouldInfer = shouldInfer;
exports.getType = getType;
var moment = require(`moment`);

var _require = require(`graphql`),
    GraphQLString = _require.GraphQLString,
    GraphQLBoolean = _require.GraphQLBoolean,
    GraphQLScalarType = _require.GraphQLScalarType,
    Kind = _require.Kind;

var _ = require(`lodash`);

var _require2 = require(`common-tags`),
    oneLine = _require2.oneLine;

var ISO_8601_FORMAT = [`YYYY`, `YYYY-MM`, `YYYY-MM-DD`, `YYYYMMDD`,

// Local Time
`YYYY-MM-DDTHH`, `YYYY-MM-DDTHH:mm`, `YYYY-MM-DDTHHmm`, `YYYY-MM-DDTHH:mm:ss`, `YYYY-MM-DDTHHmmss`, `YYYY-MM-DDTHH:mm:ss.SSS`, `YYYY-MM-DDTHHmmss.SSS`,

// Coordinated Universal Time (UTC)
`YYYY-MM-DDTHHZ`, `YYYY-MM-DDTHH:mmZ`, `YYYY-MM-DDTHHmmZ`, `YYYY-MM-DDTHH:mm:ssZ`, `YYYY-MM-DDTHHmmssZ`, `YYYY-MM-DDTHH:mm:ss.SSSZ`, `YYYY-MM-DDTHHmmss.SSSZ`, `YYYY-[W]WW`, `YYYY[W]WW`, `YYYY-[W]WW-E`, `YYYY[W]WWE`, `YYYY-DDDD`, `YYYYDDDD`];

// Check if this is a date.
// All the allowed ISO 8601 date-time formats used.
function shouldInfer(value) {
  var momentDate = moment.utc(value, ISO_8601_FORMAT, true);
  return momentDate.isValid() && typeof value !== `number`;
}

var GraphQLDate = exports.GraphQLDate = new GraphQLScalarType({
  name: `Date`,
  description: oneLine`
    A date string, such as 2007-12-03, compliant with the ISO 8601 standard 
    for representation of dates and times using the Gregorian calendar.`,
  serialize: String,
  parseValue: String,
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? ast.value : undefined;
  }
});

var type = Object.freeze({
  type: GraphQLDate,
  args: {
    formatString: {
      type: GraphQLString,
      description: oneLine`
        Format the date using Moment.js' date tokens e.g.
        "date(formatString: "YYYY MMMM DD)"
        See https://momentjs.com/docs/#/displaying/format/
        for documentation for different tokens`
    },
    fromNow: {
      type: GraphQLBoolean,
      description: oneLine`
        Returns a string generated with Moment.js' fromNow function`
    },
    difference: {
      type: GraphQLString,
      description: oneLine`
        Returns the difference between this date and the current time.
        Defaults to miliseconds but you can also pass in as the
        measurement years, months, weeks, days, hours, minutes,
        and seconds.`
    },
    locale: {
      type: GraphQLString,
      description: oneLine`
        Configures the locale Moment.js will use to format the date.`
    }
  },
  resolve(source, args, context, _ref) {
    var fieldName = _ref.fieldName;

    var date = void 0;
    if (source[fieldName]) {
      date = JSON.parse(JSON.stringify(source[fieldName]));
    } else {
      return null;
    }

    if (_.isPlainObject(args)) {
      var fromNow = args.fromNow,
          difference = args.difference,
          formatString = args.formatString,
          _args$locale = args.locale,
          locale = _args$locale === undefined ? `en` : _args$locale;

      if (formatString) {
        return moment.utc(date, ISO_8601_FORMAT, true).locale(locale).format(formatString);
      } else if (fromNow) {
        return moment.utc(date, ISO_8601_FORMAT, true).locale(locale).fromNow();
      } else if (difference) {
        return moment().diff(moment.utc(date, ISO_8601_FORMAT, true).locale(locale), difference);
      }
    }

    return date;
  }
});

function getType() {
  return type;
}
//# sourceMappingURL=type-date.js.map