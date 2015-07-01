
<% if (moduleLoader == "requirejs") { %>
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function () {
            return factory();
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        root.moduleA = factory();
    }
}(this, function () {
    return {
        log: function () {
            console.log('module-a');
        }
    };
}));
<% } else { %>
console.log('gruntlate');
<% } %>
