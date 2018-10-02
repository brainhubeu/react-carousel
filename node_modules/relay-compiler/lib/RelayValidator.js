/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayValidator
 * @format
 */

'use strict';

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    Validator = _require.Validator;

var GLOBAL_RULES = Validator.GLOBAL_RULES,
    LOCAL_RULES = Validator.LOCAL_RULES,
    validate = Validator.validate;


function DisallowIdAsAliasValidationRule(context) {
  return {
    Field: function Field(field) {
      if (field.alias && field.alias.value === 'id' && field.name.value !== 'id') {
        throw new Error('RelayValidator: Relay does not allow aliasing fields to `id`. ' + 'This name is reserved for the globally unique `id` field on ' + '`Node`.');
      }
    }
  };
}

var relayGlobalRules = GLOBAL_RULES;

var relayLocalRules = [].concat((0, _toConsumableArray3['default'])(LOCAL_RULES), [DisallowIdAsAliasValidationRule]);

module.exports = {
  GLOBAL_RULES: relayGlobalRules,
  LOCAL_RULES: relayLocalRules,
  validate: validate
};