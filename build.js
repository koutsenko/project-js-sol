/**
 * Сборочный скрипт, рассчитанный на запуск в среде NodeJS
 * Модуль path обеспечивает кроссплатформенную работу с файлами.
 */

/**
 * Модули
 */
var fs = require('fs'),
    path = require('path'),
    ink = require('inkscape'),
    opt = require('pngquant'),
    less = require('less');


/**
 * Сборочные утилиты
 */
var tools = {
    js: require('closure-compiler')
};

/**
 * Промежуточные данные
 */
var data = {
    js: undefined,
    css: undefined,
    png: []
};

/**
 * Реализация асинхронных задач
 */
var queue = {
    count: 0,
    callback: undefined
};

function startQueue(count, callback) {
    queue.count = count;
    queue.callback = callback;
}

function processQueue() {
    queue.count--;
    if (queue.count === 0) {
        queue.callback();
        queue.callback = undefined;
    }
}

/**
 * Entry point
 */
switch (process.argv[2]) {
    default:
        console.log('[BUILD]: starting...');
        taskRasterize(taskBuildPage);
}

function taskRasterize(callback) {
    var images = [{
        path: 'source/res/back.svg',
        size: '750x600',
        unit: '250x300',
        name: [ 'back', 'home', 'stack', '', 'deck', 'open']
    }, {
        path: 'source/res/face.svg',
        size: '1000x900',
        unit: '250x300',
        name: ['CJ', 'DJ', 'HJ', 'SJ', 'CQ', 'DQ', 'HQ', 'SQ', 'CK', 'DK', 'HK', 'SK']
    }, {
        path: 'source/res/rule.svg',
        size: '420x320',
        unit: '420x320',
        name: ['rule']
    }, {
        path: 'source/res/menu.svg',
        size: '300x200',
        unit: '100x100',
        name: ['undo', 'auto', 'help', '', 'records', 'deal']
    }];

    var count = 25;

    // обход всех картинок
    for (var i = 0, size, unit, x, y, idx, svg, png, range, iStream, oStream, pngfile; i < images.length; i++) {

        // разбиение каждой картинки на части, оптимизация и сохранение на диск.
        // в css их вшивать будет модуль css.
        // вероятно надо последовательно выписать названия файлов в конфиг images
        size = images[i].size.split('x');
        unit = images[i].unit.split('x');
        x = size[0]/unit[0];
        y = size[1]/unit[1];
        //console.log(x,y);

        // y это кол-во строк
        for (var z = 1; z <= y; z++) {
            // x это кол-во колонок
            for (var j = 1; j <= x; j++) {
                // находим актуальный индекс - пробегаем по горизонтали j-1 колонок и плюсуем расстояние на текущей строке
                idx = (z-1)*x + j-1;
                range = unit[0]*(j-1) + ':' + unit[1]*z + ':' + unit[0]*j + ':' + unit[1]*(z-1);
                svg = new ink([
                    '--export-png',
                    '--export-area=' + range
                ]);
                png = new opt([
                    '--quality=64',
                    '--iebug',
                    '--force',
                    '--speed=1',
                    '--ordered',
                    '64'
                ]);
                pngfile = images[i].path.replace('.svg', '_' + images[i].name[idx] + '.png');
                data.png.push(pngfile);
                oStream = fs.createWriteStream(pngfile);
                oStream.on('finish', function() {
                    count--;
                    if (count === 0) {
                        callback();
                    }
                });

                iStream = fs.createReadStream(images[i].path);
                iStream.pipe(svg).pipe(png).pipe(oStream);
            }
        }
    }
}

function taskBuildPage() {
    startQueue(2, writeHTML);
    processJS();
    processCSS();
}

function writeHTML() {
    fs.writeFile('build/index.html', [
        '<!DOCTYPE html>',
            '<head lang="en">',
                '<meta charset="UTF-8">',
                '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">',
                '<title>Solitaire Online</title>',
                '<style>',
                    data.css,
                '</style>',
            '</head>',
            '<body>',
                '<script>',
                    data.js,
                '</script>',
            '</body>',
        '</html>'
    ].join(''));
}

function processCSS() {
    var css = fs.readFileSync('source/app.less').toString(),
        opts = {
            compress: true,
            ieCompat: false
        };

    less.render(css, opts, function(error, output) {
        if (error) {
            console.log('[ERR]: ' + error.message);
            //throw error;
        }
        data.css = output.css;
        // костыль...
        for (var i = 0; i < data.png.length; i++) {
            fs.unlinkSync(data.png[i]);
        }
        data.png = [];
        processQueue();
    });
}

function processJS() {
    tools.js.compile(fs.readFileSync('source/app.js').toString(), {
        language_in: 'ECMASCRIPT5_STRICT',
        charset: 'UTF-8',
        compilation_level: 'ADVANCED_OPTIMIZATIONS'
    }, function(err, js, extra) {
        console.log(err)

        data.js = js;
        processQueue();
    });
}
