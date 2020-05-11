define([
    'Magento_PageBuilder/js/content-type/preview',
], function (
    PreviewBase,
) {
    'use strict';

    var $super;

    /**
     * Quote content type preview class
     *
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewBase.call(this, parent, config, stageId);
    }

    Preview.prototype = Object.create(PreviewBase.prototype);
    $super = PreviewBase.prototype;

    /**
     * Modify the options returned by the content type
     *
     * @returns {*}
     */
    Preview.prototype.retrieveOptions = function () {
        var options = $super.retrieveOptions.call(this, arguments);

        // Customize options here

        return options;
    };

    return Preview;
});
