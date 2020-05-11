const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

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
            console.log('✔ Template files copied.');
        } else {
            console.error('The requested template wasn’t found.');
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
        console.log('✔ Template directories and files renamed.');
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
        console.log('✔ File placeholders replaced.');
        shell.cd('..');
    }
}
