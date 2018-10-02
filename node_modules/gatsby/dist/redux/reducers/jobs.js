"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

var _require = require(`common-tags`),
    oneLine = _require.oneLine;

var moment = require(`moment`);

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { active: [], done: [] };
  var action = arguments[1];

  switch (action.type) {
    case `CREATE_JOB`:
    case `SET_JOB`:
      {
        if (!action.payload.id) {
          throw new Error(`An ID must be provided when creating or setting job`);
        }
        var index = _.findIndex(state.active, function (j) {
          return j.id === action.payload.id;
        });
        var mergedJob = _.merge(state.active[index], (0, _extends3.default)({}, action.payload, {
          createdAt: Date.now(),
          plugin: action.plugin
        }));
        if (index !== -1) {
          return {
            done: state.done,
            active: [].concat(state.active.slice(0, index).concat([mergedJob]).concat(state.active.slice(index + 1)))
          };
        } else {
          return {
            done: state.done,
            active: state.active.concat([(0, _extends3.default)({}, action.payload, {
              createdAt: Date.now(),
              plugin: action.plugin
            })])
          };
        }
      }
    case `END_JOB`:
      {
        if (!action.payload.id) {
          throw new Error(`An ID must be provided when ending a job`);
        }
        var completedAt = Date.now();
        var job = state.active.find(function (j) {
          return j.id === action.payload.id;
        });
        if (!job) {
          throw new Error(oneLine`
          The plugin "${_.get(action, `plugin.name`, `anonymous`)}"
          tried to end a job with the id "${action.payload.id}"
          that either hasn't yet been created or has already been ended`);
        }

        return {
          done: state.done.concat([(0, _extends3.default)({}, job, {
            completedAt,
            runTime: moment(completedAt).diff(moment(job.createdAt))
          })]),
          active: state.active.filter(function (j) {
            return j.id !== action.payload.id;
          })
        };
      }
  }

  return state;
};
//# sourceMappingURL=jobs.js.map