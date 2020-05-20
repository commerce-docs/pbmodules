#!/usr/bin/env node

/*
Copyright © Magento, Inc. All rights reserved.
See COPYING.txt for license details.
*/

const clear = require('clear');
const chalk = require('chalk');
const {textSync} = require('figlet');
const questions = require('./lib/questions');
const files = require('./lib/files');
const placeholders = require('./lib/placeholders');

// Clear terminal and display ASCII art
clear();
console.log(
    chalk.greenBright(textSync("PB Modules", {horizontalLayout: "fitted", font: "Standard"}))
);

const start = async () => {
    try {
        const moduleAnswers = await questions.askModuleQuestions();
        const {vendor, templateType, contentType} = moduleAnswers;

        placeholders.setupPlaceholders(moduleAnswers, vendor, contentType);

        files.copyTemplate(vendor, templateType, contentType);
        files.replaceFileNamePlaceholders(moduleAnswers);
        files.replaceFileContentPlaceholders(moduleAnswers);

    } catch (e) {
        console.error(e);
    } finally {
        console.log('✔ Page Builder module complete!')
    }
};

start();
