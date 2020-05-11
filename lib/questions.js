/*
Copyright © Magento, Inc. All rights reserved.
See COPYING.txt for license details.
*/

/*
 * Questions for user
 * --------------------
 * The answers to the following questions are stored
 * in the names of each question object defined below.
 * These names (in their uppercase form) are [placeholders]
 * in the template directories, file names, and file contents.
 * The placeholders are then replaced with the user answers.
 */

const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = {
  askModuleQuestions: () => {

    const pascalCase = new RegExp(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/);
    const titleCase = new RegExp(/^\s*([A-Z]\w*\s*)*$/);

    const moduleQuestions = [
      {
        name: 'templateType',
        type: 'list',
        message: chalk.green(`${chalk.yellow('Extend content type')} OR create ${chalk.yellow('custom content type')}?`),
        choices: ['Extend', 'Custom'],
        default: 'Extend'
      },
      {
        name: 'contentType',
        type: 'list',
        message: chalk.green(`Choose a ${chalk.yellow('Page Builder content type')} to extend:`),
        choices: ['Row','Column','Column-Group','Tabs','Tab-Item','Text','Heading','Buttons',
              'Button-Item','Divider','Html','Image','Video','Banner','Slider','Slide','Map','Block','Products'],
        default: 'Row',
        when: priorAnswers => priorAnswers['templateType'] === 'Extend',
      },
      {
        name: 'contentType',
        type: 'input',
        message: chalk.green(`Enter ${chalk.yellow('custom name')} (Capitalized or PascalCase):`),
        default: 'MyCustomType',
        validate: thisAnswer => pascalCase.test(thisAnswer) ? true : 'Please Capitalize or use PascalCase.',
        when: priorAnswers => priorAnswers['templateType'] === 'Custom',
      },
      {
        name: 'menuName',
        type: 'input',
        message: chalk.green(`Enter custom ${chalk.yellow('menu name')} (Title Case):`),
        default: priorAnswers => `${priorAnswers['contentType'].replace(/([a-z0-9])([A-Z])/g, '$1 $2')}`,
        validate: thisAnswer => titleCase.test(thisAnswer) ? true : 'Please use Title Case.',
        when: priorAnswers => priorAnswers['templateType'] === 'Custom',
      },
      {
        name: 'vendor',
        type: 'input',
        message: chalk.green(`Enter your ${chalk.yellow('vendor name')} (PascalCase):`),
        default: 'MyVendor',
        validate: thisAnswer => pascalCase.test(thisAnswer) ? true : 'Please use PascalCase.'
      },
      {
        name: 'module',
        type: 'input',
        message: chalk.green(`Enter your ${chalk.yellow('module name')} (PascalCase):`),
        default: priorAnswers => priorAnswers['templateType'] === 'Custom'
            ? priorAnswers['contentType']
            : `My${priorAnswers['contentType'].replace(/-/g, "")}Extension`,
        validate: thisAnswer => pascalCase.test(thisAnswer) ? true : 'Please use PascalCase.'
      },
      {
        name: 'moduleDescription',
        type: 'input',
        message: chalk.green(`Enter your ${chalk.yellow('module description')}:`),
        default: priorAnswers => `Page Builder content type for ${priorAnswers['module']}.`
      },
    ];
    return inquirer.prompt(moduleQuestions);
  }
}
