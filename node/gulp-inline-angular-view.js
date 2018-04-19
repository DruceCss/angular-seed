let fs = require('fs'),
    path = require('path'),
    through = require('through2');
// -----------------------
// Подменяет все templateUrl на инлайновые template из _template_root
// Удобно использовать в схеме app -> dist где в dist будут лежать файлы для production
//  Плагин будет брать из потока js файлы искать в них templateUrl
//  после считывать указанный там путь, и по нему искать в _template_root шаблон
//  далее он удалит из него все переносы и вставит в результирующий файл: template: "..."
//  где ... это содержимое искомого темплейта
// ---
// _template_root - корневая директория поиска шаблонов
// _ignore - файлы которые необходимо проигнорировать
module.exports = function (_template_root, _ignore) {
    let template_root = _template_root || './';
    let ignore = _ignore || [];

    let transform = function (file, enc, cb) {
        let file_name = path.basename(file.path);

        if (isIgnore(file_name, ignore)) {
            return cb(null, file);
        } else {
            let contents = file.contents.toString();
            let data = contents.match(/templateUrl:(\s*?)["|'](.*?)["']/gm);
            let final_data = contents;

            if (!data) return cb(null, file);

            for (let i=0; i < data.length; i++) {
                let item = data[i].match(/["'].*?["']/)[0].replace(/"|'/g, "");
                let inline_file = fs.readFileSync(template_root+'/'+item, 'utf8').replace(/[\r\n\t]/g, "");
                //let safe_quote_inline_file = inline_file.replace(/"/g, "&#34;");

                final_data = final_data.replace(data[i], 'template:\''+inline_file+'\'');
            }

            file.contents = new Buffer(final_data);

            return cb(null, file);
        }
    };

    return through.obj(transform);
};

function isIgnore(file_name, ignore_array) {
    let result = false;
    if (!ignore_array.length) return result;

    for (let i=0; i<ignore_array.length; i++) {
        if (file_name === ignore_array[i]) result = true;
    }

    return result;
}