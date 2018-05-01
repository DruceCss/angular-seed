'use strict';

let fs = require('fs'),
    readline = require('readline'),
    os = require('os'),
    l = require('./log.js'),
    cfg = require('./config');

module.exports = function () {

    function component(name) {
        let module    = `<script src="components/${name}/${name}.module.js"></script>`;
        let component = `<script src="components/${name}/${name}.component.js"></script>`;

        let index = fs.readFileSync(cfg.path.index, cfg.charset);
        let content = `${module}${os.EOL}${component}${os.EOL}<!-- components end -->`;

        index = index.replace(/<!-- components end -->/g, content);

        fs.writeFileSync(cfg.path.index, index);
    }

    return {
        component: component
    }
};