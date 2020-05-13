/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(["Magento_PageBuilder/js/utils/object"], function (_object) {

  /**
   * Example of custom converter to simplify the entry of opacity
   * as a number from 0 to 100, as a percentage instead of a decimal.
   */

  var OpacityInPercent = (function() {
    "use strict";

    function OpacityInPercent() {}

    var proto = OpacityInPercent.prototype;

    proto.fromDom = function fromDom(value) {
      return value * 100;
    };

    proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);

      if (value) {
        return value / 100;
      }
    };

    return OpacityInPercent;
  })();

  return OpacityInPercent;
});
//# sourceMappingURL=opacity-in-percent.js.map
