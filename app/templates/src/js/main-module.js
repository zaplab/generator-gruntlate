<% if (moduleLoader == "requirejs") { %>
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['module-a'], function (moduleA) {
            return factory(moduleA);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        // commonjs
        module.exports = factory(require('module-a'));
    } else {
        root.main = factory(window.moduleA);
    }
}(this, function (moduleA) {
    console.log('gruntlate');
    moduleA.log();
}));
<% } else { %>
console.log('gruntlate');
<% } %>
