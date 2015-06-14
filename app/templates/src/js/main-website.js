<% if (moduleLoader == "requirejs") { %>
(function () {
    'use strict';

    console.log('gruntlate');

    if (typeof define === 'function' && define.amd) {
        require(['module-a'], function (moduleA) {
            moduleA.log();
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        // commonjs
        var moduleA = require('module-a');
        moduleA.log();
    } else {
        window.moduleA.log();
    }
})();
<% } else { %>
console.log('gruntlate');
<% } %>
