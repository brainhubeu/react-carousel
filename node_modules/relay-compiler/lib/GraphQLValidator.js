/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule GraphQLValidator
 * @format
 */

'use strict';

var _require = require('graphql'),
    ArgumentsOfCorrectTypeRule = _require.ArgumentsOfCorrectTypeRule,
    DefaultValuesOfCorrectTypeRule = _require.DefaultValuesOfCorrectTypeRule,
    formatError = _require.formatError,
    FragmentsOnCompositeTypesRule = _require.FragmentsOnCompositeTypesRule,
    KnownArgumentNamesRule = _require.KnownArgumentNamesRule,
    KnownTypeNamesRule = _require.KnownTypeNamesRule,
    LoneAnonymousOperationRule = _require.LoneAnonymousOperationRule,
    NoFragmentCyclesRule = _require.NoFragmentCyclesRule,
    NoUnusedVariablesRule = _require.NoUnusedVariablesRule,
    PossibleFragmentSpreadsRule = _require.PossibleFragmentSpreadsRule,
    ProvidedNonNullArgumentsRule = _require.ProvidedNonNullArgumentsRule,
    ScalarLeafsRule = _require.ScalarLeafsRule,
    UniqueArgumentNamesRule = _require.UniqueArgumentNamesRule,
    UniqueFragmentNamesRule = _require.UniqueFragmentNamesRule,
    UniqueInputFieldNamesRule = _require.UniqueInputFieldNamesRule,
    UniqueOperationNamesRule = _require.UniqueOperationNamesRule,
    UniqueVariableNamesRule = _require.UniqueVariableNamesRule,
    validate = _require.validate,
    VariablesAreInputTypesRule = _require.VariablesAreInputTypesRule,
    VariablesInAllowedPositionRule = _require.VariablesInAllowedPositionRule;

function validateOrThrow(document, schema, rules) {
  var validationErrors = validate(schema, document, rules);
  if (validationErrors && validationErrors.length > 0) {
    var formattedErrors = validationErrors.map(formatError);
    var errorMessages = validationErrors.map(function (e) {
      return e.source ? e.source.name + ': ' + e.message : e.message;
    });

    var error = new Error(require('util').format('You supplied a GraphQL document with validation errors:\n%s', errorMessages.join('\n')));
    error.validationErrors = formattedErrors;
    throw error;
  }
}

module.exports = {
  GLOBAL_RULES: [KnownArgumentNamesRule,
  // TODO #19327202 Relay Classic generates some fragments in runtime, so Relay
  // Modern queries might reference fragments unknown in build time
  //KnownFragmentNamesRule,
  NoFragmentCyclesRule,
  // TODO #19327144 Because of @argumentDefinitions, this validation
  // incorrectly marks some fragment variables as undefined.
  // NoUndefinedVariablesRule,
  // TODO #19327202 Queries generated dynamically with Relay Classic might use
  // unused fragments
  // NoUnusedFragmentsRule,
  NoUnusedVariablesRule,
  // TODO #19327202 Relay Classic auto-resolves overlapping fields by
  // generating aliases
  //OverlappingFieldsCanBeMergedRule,
  ProvidedNonNullArgumentsRule, UniqueArgumentNamesRule, UniqueFragmentNamesRule, UniqueInputFieldNamesRule, UniqueOperationNamesRule, UniqueVariableNamesRule],
  LOCAL_RULES: [ArgumentsOfCorrectTypeRule, DefaultValuesOfCorrectTypeRule,
  // TODO #13818691: make this aware of @fixme_fat_interface
  // FieldsOnCorrectTypeRule,
  FragmentsOnCompositeTypesRule, KnownTypeNamesRule,
  // TODO #17737009: Enable this after cleaning up existing issues
  // KnownDirectivesRule,
  LoneAnonymousOperationRule, PossibleFragmentSpreadsRule, ScalarLeafsRule, VariablesAreInputTypesRule, VariablesInAllowedPositionRule],
  validate: validateOrThrow
};