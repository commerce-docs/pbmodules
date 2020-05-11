/*
 * Questions for user
 * --------------------
 * The answers to the following questions are stored
 * in the names of each question object defined below.
 * These names (in their uppercase form) are [placeholders]
 * in the template directories, file names, and file contents.
 * And those placeholders are replaced with the user answers.
 */

const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = {
  askModuleQuestions: () => {

    let pascalCase = new RegExp(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/);
    let titleCase = new RegExp(/^\s*([A-Z]\w*\s*)*$/);

    const moduleQuestions = [
      {
        name: 'vendor',
        type: 'input',
        message: chalk.yellow('Enter the vendor name for your module (PascalCase):'),
        default: 'MyVendor',
        validate: thisAnswer => pascalCase.test(thisAnswer) ? true : 'Please use PascalCase.'
      },
      {
        name: 'module',
        type: 'input',
        message: chalk.yellow('Enter the name of your module (PascalCase):'),
        default: 'PageBuilderModule',
        validate: thisAnswer => pascalCase.test(thisAnswer) ? true : 'Please use PascalCase.'
      },
      {
        name: 'moduleDescription',
        type: 'input',
        message: chalk.yellow('Enter a description for your module:'),
        default: 'Page Builder module for my content type.'
      },
      {
        name: 'templateType',
        type: 'list',
        message: chalk.yellow('Create a custom content type or extend an existing content type?'),
        choices: ['Extend', 'Custom'],
        default: 'Extend'
      },
      {
        name: 'contentType',
        type: 'input',
        message: chalk.yellow('Enter a name for your custom content type (Capitalized or PascalCase):'),
        default: 'MyContentType',
        validate: thisAnswer => pascalCase.test(thisAnswer) ? true : 'Please Capitalize or use PascalCase.',
        when: priorAnswers => priorAnswers['templateType'] === 'Custom',
      },
      {
        name: 'contentType',
        type: 'list',
        message: chalk.yellow('Which content type do you want to extend?:'),
        choices: ['Row','Column','Column-Group','Tabs','Tab-Item','Text','Heading','Buttons','Button-Item','Divider','Html','Image','Video','Banner','Slider','Slide','Map','Block','Products'],
        default: 'Row',
        when: priorAnswers => priorAnswers['templateType'] === 'Extend',
      },
      {
        name: 'menuName',
        type: 'input',
        message: chalk.yellow('Enter the menu name for your content type (Title Case):'),
        default: 'My Type',
        validate: thisAnswer => titleCase.test(thisAnswer) ? true : 'Please use Title Case.',
        when: priorAnswers => priorAnswers['templateType'] === 'Custom',
      }
    ];
    return inquirer.prompt(moduleQuestions);
  }
}
