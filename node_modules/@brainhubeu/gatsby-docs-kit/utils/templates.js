'use strict';
const path = require('path');
const { fileExists } = require('./fs');

const TEMPLATE_DEFAULT_FILE_NAME = 'default';

const TEMPLATE_FILES_EXTENSTION = '.js';

const TEMPLATE_MAIN_DIR_PATH = 'src/templates';

/**
 * Get template file name based on name speciefied in config
 * @param {String} templateName template name (from config)
 * @return {String} file name, e.g. `default.js`
 */
const getTemplateFileName = templateName => `${templateName ? templateName : TEMPLATE_DEFAULT_FILE_NAME}${TEMPLATE_FILES_EXTENSTION}`;

/**
 * Get path to local (declared within this package) template
 * @param {String} templateFileName
 * @return {String} file path, e.g. `/.../.../default.js`
 */
const getLocalTemplatePath = templateFileName => path.resolve(`${__dirname}/../src/templates/${templateFileName}`);

/**
 * Get path to templates speciefied in gatsby main dir
 * @param {String} templateFileName
 * @return {String} file path, e.g. `/.../.../default.js`
 */
const getMainDirTemplatePath = templateFileName => path.resolve(path.join(TEMPLATE_MAIN_DIR_PATH, templateFileName));


/**
 * Get path to template
 * @param {String} templateName template name (from config)
 * @return {String} file path, e.g. `/.../.../default.js`
 */
const getTemplatePath = templateName => {
  const templateFileName = getTemplateFileName(templateName);

  return fileExists(getLocalTemplatePath(templateFileName))
    ? getLocalTemplatePath(templateFileName)
    : getMainDirTemplatePath(templateFileName);
};


exports.getTemplatePath = getTemplatePath;
