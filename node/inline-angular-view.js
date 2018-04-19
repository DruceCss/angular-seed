let fs = require('fs');
// -----------------------
// Подменяет все templateUrl из _root на инлайновые template из _template_root
// _root - корневая директория поиска
// _template_root - корневая директория поиска шаблонов
// _ignore - файлы которые необходимо проигнорировать
module.exports = function (_root, _template_root, _ignore) {
    let root = _root || './';
    let template_root = _template_root || './';
    let ignore = _ignore || [];
    let scripts = findAllJs(root);

    replaceTemplateUrlOnTemplate(scripts);
    // -----------------------
    function findAllJs(_local_root) {
        let local_root = _local_root || '';
        let scripts = [];
        let items = fs.readdirSync(local_root);

        for (let i = 0; i < items.length; i++) {
            let current_item = items[i];
            let path = local_root + '/' + current_item;
            let match_js = new RegExp('(.js)$');
            let match_test = new RegExp('(_test.js)$');

            if (!isIgnore(path)) {
                let stats = fs.statSync(path);

                if (stats.isDirectory()) {
                    scripts = scripts.concat(findAllJs(path));
                }

                if (stats.isFile() && match_js.test(current_item) && !match_test.test(current_item)) {
                    scripts.push(path);
                }
            }
        }

        return scripts;
    }
    // -----------------------
    function replaceTemplateUrlOnTemplate(files) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            fs.readFile(file, 'utf8', function (err, _data) {
                // Находим все templateUrl (templateUrl:"view1/view1.html")
                let data = _data.match(/templateUrl:["|'](.*?)["']/g);
                let final_data = _data;

                for (let i=0; i < data.length; i++) {
                    let item = data[i].match(/["'].*?["']/)[0].replace(/"|'/g, "");
                    let inline_file = fs.readFileSync(template_root+'/'+item, 'utf8').replace(/[\r\n\t]/g, "");
                    let safe_quote_inline_file = inline_file.replace(/"/g, "&#34;");

                    final_data = final_data.replace(data[i], 'template:"'+safe_quote_inline_file+'"');
                }

                fs.writeFileSync(file, final_data);

                return true;
            });
        }
    }
    // -----------------------
    function isIgnore(_item) {
        let result = false;

        ignore.forEach(function (item) {
            if (root + '/' + item === _item) {
                result = true
            }
        });

        return result;
    }
    // -----------------------
};
