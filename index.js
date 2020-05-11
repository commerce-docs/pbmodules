#!/usr/bin/env node

const clear = require('clear');
const chalk = require('chalk');
const {textSync} = require('figlet');
const questions = require('./lib/questions');
const files = require('./lib/files');

// Clear terminal and display ASCII art
clear();
console.log(
    chalk.greenBright(textSync("PB Modules", {horizontalLayout: "fitted", font: "Standard"}))
);

const start = async () => {
    try {
        const moduleAnswers = await questions.askModuleQuestions();
        const {vendor, contentType} = moduleAnswers;

        files.copyTemplate(contentType);
        files.setupPlaceholders(moduleAnswers, vendor, contentType);
        files.replaceFileNamePlaceholders(moduleAnswers);
        files.replaceFileContentPlaceholders(moduleAnswers);

    } catch (e) {
        console.error(e);
    } finally {
        console.log('✔ Module complete!')
    }
};

start();
