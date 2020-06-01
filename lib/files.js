/*
Copyright © Magento, Inc. All rights reserved.
See COPYING.txt for license details.
*/

const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = {

    /**
     * Copy all template files to users current directory
     *
     * @param {string} vendor
     * @param {string} templateType
     * @param {string} contentType
     */
    copyTemplate(vendor, templateType, contentType) {

        const templateDirectory = templateType === 'Custom'
            ? `${path.join(__dirname, '../')}templates/${templateType.toLowerCase()}`
            : `${path.join(__dirname, '../')}templates/${contentType.toLowerCase()}`;

        const currentDirectory = process.cwd();
        const vendorDirectoryExists = fs.existsSync(path.join(currentDirectory, vendor));

        if (fs.existsSync(templateDirectory)) {
            shell.cp('-R', `${templateDirectory}/*`, currentDirectory);
            console.log(`${chalk.white('\n✔ Template files copied.')}`);
        } else {
            console.error('\nThe requested template wasn’t found.');
            process.exit(1);
        }

        if (vendorDirectoryExists) {
            shell.mv('[VENDOR]/[MODULE]', vendor); // Move module to existing Vendor directory.
            shell.rm('-rf', '[VENDOR]'); // Remove empty [VENDOR] directory.
        } else {
            shell.mv('[VENDOR]', vendor); // Rename [VENDOR] directory to user's Vendor name.
        }
    },

    /**
     * Replace template placeholders in directory and file names.
     *
     * @param {object} moduleAnswers
     */
    replaceFileNamePlaceholders(moduleAnswers) {
        shell.cd(moduleAnswers.vendor);
        const currentDirectory = process.cwd();
        const questionAnswers = Object.entries(moduleAnswers);
        const pathsNotRenamed = [];
        let previousPathName = '';

        console.log(`${chalk.white('✔ Renaming template directories and files.')}`);
        for (const [questionName, answer] of questionAnswers) {

            const PLACEHOLDER = `[${questionName.toUpperCase()}]`; // match placeholder case in templates
            const ANSWER = answer;

            shell.find(currentDirectory)

                .filter(function (pathName) {
                    const fileIsVisible = pathName.split('/').pop().indexOf('.', 0) !== 0;
                    const fileHasPlaceholder = pathName.split('/').pop().indexOf(PLACEHOLDER) > -1;
                    return fileIsVisible && fileHasPlaceholder;
                })

                // For each placeholder loop, the paths must be sorted from longest to shortest
                // so that the placeholders at the end of the longest paths are replaced first.
                // This ensures that we don't change the path names for subsequent placeholder loops.
                .sort((a, b) => (b.split('/') || []).length - (a.split('/') || []).length)

                .forEach(function (pathName) {
                    const pathBeforePlaceholder = pathName.substring(0, pathName.lastIndexOf(PLACEHOLDER));
                    const pathWithPlaceholder = pathName.substring(pathName.lastIndexOf(PLACEHOLDER, pathName.length));
                    const newPathName = pathBeforePlaceholder + pathWithPlaceholder.replace(PLACEHOLDER, ANSWER);
                    let placeholderName = chalk.red(`${pathName.split('/').pop()}`);
                    let placeholderValue = chalk.yellow(`${newPathName.split('/').pop()}`);
                    const separator = chalk.white('--> Already Exists:');
                    let chalkPathName = chalk.red(`${pathName}`);
                    let chalkNewPathName = chalk.yellow(`${newPathName}`);

                    // Only rename `newPath` if it doesn't already exist.
                    // If the path already exists, add it to the pathsNotRenamed array to display in console.
                    if (!shell.test('-e', newPathName)) {
                        shell.mv(pathName, newPathName);
                    } else {
                        console.log(`\nThe ${placeholderName} placeholder was not replaced with ${placeholderValue} in the\nfollowing path(s) because the directory or file names already exist:` );
                        pathsNotRenamed.push(`${chalkPathName} ${separator} ${chalkNewPathName}`);
                    }
                }
            );

            if (pathsNotRenamed.length) {
                for (let pathNotRenamed of pathsNotRenamed) {
                    if (pathNotRenamed === previousPathName) continue;
                    shell.echo(`${pathNotRenamed}`);
                    previousPathName = pathNotRenamed;
                }
            }
        }

        if (pathsNotRenamed.length === 0){
            console.log(`${chalk.white('✔ Template directories and files renamed.')}`);
        } else {
            console.log('');
            console.log(`${chalk.yellowBright('Recommended Action:\n')}${chalk.green('Delete the module just created and run pbmodules again, but choose a different module name.')}`);
            console.log('');
        }
        shell.cd('..');
    },

    /**
     *  Replace template placeholders in file contents.
     *
     * @param {object} moduleAnswers
     */
    replaceFileContentPlaceholders(moduleAnswers) {
        shell.cd(moduleAnswers.vendor);
        const files = shell.ls('-Rl', '.');

        for (const file of files) {
            if (file.isFile()) {
                const questionAnswers = Object.entries(moduleAnswers);
                for (const [questionName, answer] of questionAnswers) {

                    // for shelljs.sed, the global flag must be specified using a regex object. /g flag doesn't work.
                    const placeholder = new RegExp(`\\[${questionName.toUpperCase()}\\]`, "g");
                    shell.sed('-i', placeholder, answer.toString(), file.name);
                }
            }
        }
        console.log(`${chalk.white('✔ File placeholders replaced.')}`);
        shell.cd('..');
    }
}
