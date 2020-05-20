/*
Copyright © Magento, Inc. All rights reserved.
See COPYING.txt for license details.
*/

module.exports = {

    /**
     * Set up additional placeholders for templates and comments.
     *
     * @param {object} moduleAnswers
     * @param {string} vendor
     * @param {string} contentType
     */
    setupPlaceholders(moduleAnswers, vendor, contentType) {

        moduleAnswers.FRONTEND_STYLES_SOURCE = `Source: Magento/PageBuilder/view/frontend/web/css/source/content-type/${moduleAnswers.CONTENTTYPELC}/`
        moduleAnswers.ADMIN_STYLES_SOURCE = `Source: Magento/PageBuilder/view/adminhtml/web/css/source/content-type/${moduleAnswers.CONTENTTYPELC}/`
        moduleAnswers.OVERRIDE_DEFAULT_STYLES_COMMENT = 'Override the DEFAULT appearance styles here.';
        moduleAnswers.OVERRIDE_STYLES_COMMENT = 'Override the appearance styles for';

        moduleAnswers.MODULE_LESS_COMMENT_ADMIN = 'This file is the convention for exporting your admin style sheets.';
        moduleAnswers.MODULE_LESS_COMMENT_FRONTEND = 'This file is the convention for exporting your frontend style sheets.';
        moduleAnswers.IMPORT_LESS_COMMENT = 'This file imports all appearance less files.';
        moduleAnswers.DEFAULT_LESS_COMMENT = 'Default appearance styles.';
        moduleAnswers.EXAMPLE_FIELD_COMMENT = 'Example extension field. Remove or reconfigure as needed.';
        moduleAnswers.CONFIG_COMMENT = 'Add or change styles, attributes, elements, and appearances as needed.';
        moduleAnswers.REMOVE_COMMENT = 'Be sure to remove any appearances, elements, and template references you are not overriding.';

        moduleAnswers.MASTER_TEMPLATE_COMMENT =
            `By default, this template is not in use. If you need to override and use it, 
  you must also change the appearance master_template reference in the config file 
  to point to THIS appearance template instead of the native Magento_PageBuilder template.`;
        moduleAnswers.PREVIEW_TEMPLATE_COMMENT =
            `By default, this template is not in use. If you need to override and use it, 
  you must also change the appearance preview_template reference in the config file 
  to point to THIS appearance template instead of the native Magento_PageBuilder template.`;
    }
}
