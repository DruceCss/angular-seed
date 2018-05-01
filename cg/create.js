'use strict';

let fs = require('fs'),
    l = require('./log.js');

// node cg.js create [type] [name]
module.exports = function () {

    let type = process.argv[3];
    let name = process.argv[4];
    let path = '';
    let path_to = '';
    let template_path = '';

    switch (type) {
        case 'component': {
            path = 'app/components';
            path_to = path+'/'+name;
            template_path = 'cg/templates/component';
            create();

            break;
        }
        default: {
            l.warn('Component '+ type + ' not defined');
        }
    }

    function create() {
        if (!checkDirExist()) {
            let templates = getTemplateDirFiles();
            let operation_finished = 0;

            fs.mkdirSync(path_to);

            for (let i=0; i<templates.length; i++) {
                fs.readFile(template_path+'/'+templates[i], function (err, data) {
                    if (err) throw err;

                    save(transform(data), templates[i].replace('name', name), function () {
                        operation_finished++;

                        if (operation_finished === templates.length) {
                            l.success(`Congratulation, create ${type} ${name} successful finished!`)
                        }
                    });
                });
            }

            return;
        }

        l.error('Cannot duplicate '+ type +' '+name);
        return '';
    }

    function transform(data) {
        let reg    = new RegExp('{{ name(:.*)? }}', 'g');
        let string = data.toString();

        return string.replace(reg, replacer);
    }

    function save(data, name, cb) {
        cb = cb || function () {return true;};
        fs.writeFile(path_to+'/'+name, data, cb);
    }
    
    function checkDirExist() {
        return fs.existsSync(path_to);
    }

    function getTemplateDirFiles() {
        return fs.readdirSync(template_path);
    }

    function replacer(match) {
        match = match.replace(/{{|}}| /g, '');
        match = match.replace('name', name);

        let match_filter = match.match(/:(.*)/);

        if (match_filter) {
            return filter(match, match_filter[1]);
        } else {
            return match;
        }
    }

    function filter(data, type) {

        if (type === 'camelCase') {
            let match = data.match(/-/);

            if (match) {
                data = data.replace(/-|_|:camelCase/, '');
                let _data = strToArr(data);
                    _data[match.index] = _data[match.index].toUpperCase();

                data = _data.join('');
            }

            data = data.replace(':camelCase', '');

            return data;
        }
    }

    function strToArr(str) {
        return str.split('');
    }

    return {}
};