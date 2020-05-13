const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

module.exports = {

    /**
     * Copy all template files to users current directory
     *
     * @param {string} template
     */
    copyTemplate(contentType) {
        const templateDirectory = `${path.join(__dirname, '../')}templates/${contentType.toLowerCase()}`;
        const currentDirectory = process.cwd();

        if (fs.existsSync(templateDirectory)) {
            shell.cp('-R', `${templateDirectory}/*`, currentDirectory);
            console.log('✔ Template files copied.');
        } else {
            console.error('The requested template wasn’t found.');
            process.exit(1);
        }
    },

    /**
     * Set up additional placeholders for templates and comments.
     *
     * @param {object} moduleAnswers
     * @param {string} vendor
     * @param {string} contentType
     */
    setupPlaceholders(moduleAnswers, vendor, contentType) {
        moduleAnswers.VENDORLC = vendor.toLowerCase();
        moduleAnswers.CONTENTTYPELC = contentType.toLowerCase();
        moduleAnswers.CONTENTTYPESC = contentType.replace(/-/g, "_").toLowerCase();

        moduleAnswers.MODULE_LESS_COMMENT_ADMIN = 'This file is the convention for exporting your admin style sheets.';
        moduleAnswers.MODULE_LESS_COMMENT_FRONTEND = 'This file is the convention for exporting your frontend style sheets.';
        moduleAnswers.IMPORT_LESS_COMMENT = 'This file imports all appearance less files.';
        moduleAnswers.DEFAULT_LESS_COMMENT = 'Default appearance styles.';
        moduleAnswers.EXAMPLE_FIELD_COMMENT = 'Example extension field. Remove or reconfigure as needed.';
        moduleAnswers.CONFIG_COMMENT = 'Add or change styles, attributes, elements, and appearances as needed.';
        moduleAnswers.REMOVE_COMMENT = 'Be sure to remove any appearances, elements, and template references you are not overriding.';
        moduleAnswers.MASTER_TEMPLATE_COMMENT =
            'By default, this template is not in use. If you need to override and use it, \n' +
            '  you must also change the appearance `master_template` reference in the config file \n' +
            '  to point to THIS appearance template instead of the native `Magento_PageBuilder` template.';
        moduleAnswers.PREVIEW_TEMPLATE_COMMENT =
            'By default, this template is not in use. If you need to override and use it, \n' +
            '  you must also change the appearance `preview_template` reference in the config file \n' +
            '  to point to THIS appearance template instead of the native `Magento_PageBuilder` template.';
    },

    /**
     * Replace template placeholders in directory and file names.
     *
     * @param {object} moduleAnswers
     */
    replaceFileNamePlaceholders(moduleAnswers) {
        const questionAnswers = Object.entries(moduleAnswers);
        for (const [question, answer] of questionAnswers) {
            renameDirectoriesAndFiles(`[${question.toUpperCase()}]`, answer);
        }
        console.log('✔ Template directories and files renamed.');
    },

    /**
     *  Replace template placeholders in file contents.
     *
     * @param {object} moduleAnswers
     */
    replaceFileContentPlaceholders(moduleAnswers) {
        const files = shell.ls('-Rl', '.');

        for (const file of files) {
            if (file.isFile()) {
                const questionAnswers = Object.entries(moduleAnswers);
                for (const [question, answer] of questionAnswers) {
                    // for shelljs.sed, the global flag must be specified using a regex object. /g flag doesn't work.
                    const placeholder = new RegExp(`\\[${question.toUpperCase()}\\]`, "g");
                    shell.sed('-i', placeholder, answer.toString(), file.name);
                }
            }
        }
        console.log('✔ File placeholders replaced.');
    }
}

/**
 * Rename directories and files by finding and replacing placeholders.
 *
 * @param {string} placeholder
 * @param {string} answer
 */
function renameDirectoriesAndFiles(placeholder, answer) {
    const PLACEHOLDER = placeholder;
    const ANSWER = answer;
    const currentDirectory = process.cwd();
    const pathsNotRenamed = [];

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

            // Only rename `newPath` if it doesn't already exist.
            // If the path already exists, add it to the pathsNotRenamed array to display in console.
            if (!shell.test('-e', newPathName)) {
                shell.mv(pathName, newPathName);
            } else {
                console.log(`${pathName.split('/').pop()}\n${newPathName.split('/').pop()}`)
                pathsNotRenamed.push(`${pathName} --> ${newPathName}`);
            }
        });

    if (pathsNotRenamed.length) {
        shell.echo(`${pathsNotRenamed.length} path(s) not renamed because the file or directory name already exists:`);
        for (const pathNotRenamed of pathsNotRenamed) {
            shell.echo(`+ ${pathNotRenamed}`);
        }
    }
}
