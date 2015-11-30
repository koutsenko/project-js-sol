var app = {
    xhr: undefined,
    realMove: undefined,
    stopRender: undefined,
    server: 'http://min3win.ru/games/service.php',
    auth: {
        user: undefined
    },
    dnd: {

    },
    data: {
        oldTarget: undefined,
        currentTarget: undefined,
        drawn: undefined,
        oldXY: undefined,
        size: undefined,
        zones: undefined,
        hudtask: undefined,
        offset: undefined,
        timeend: undefined,
        timeout: undefined,
        card: undefined,
        cardCss: undefined,
        target: undefined,
        targetClass: '',
        stopRender: undefined,
        timer: undefined,
        moves: 1,
        deck: [],
        wins: undefined,
        games: undefined,
        records: undefined,
        currentRecord: undefined,
        cards: undefined,
        oldParent: undefined
    },
    last: {
        type: '',
        card: '',
        target: undefined,
        parent: undefined,
        flipped: false
    },
    el: {},
    placeCard: undefined,
    openCard: undefined,
    cacheDND: undefined,
    getDZ: undefined,
    getX: undefined,
    getY: undefined,
    drag: undefined,
    move: undefined,
    drop: undefined,
    canDrop: undefined,
    writeMove: undefined,
    undoMove: undefined,
    completeGame: undefined,
    gameEnd: undefined,
    canComplete: undefined,
    tryMoveHome: undefined,
    calculateElapsedTime: undefined,
    showRanks: undefined,
    writeRecord: undefined,
    showRules: undefined
};

function getCookie(name) {
    var b = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return decodeURIComponent(b ? b.pop() : '');
}

function clearCookie(name) {
    document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

// FIXME определить структуру движка и чуть ниже задать функции...

function cancelEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        for (var i = 0, prefixes = ['webkit', 'moz', 'o', 'ms'], name; i < prefixes.length; i++) {
            name = prefixes[i] + 'RequestAnimationFrame';
            if (typeof window[name] === 'Function') {
                return window[name];
            }
        }
        return function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    } ());
}

function shuffle(array) {
    var x, j,
        i = array.length;

    while (i) {
        //j = parseInt(Math.random() * i, 10);
        j = Math.round(Math.random() * i);
        i = i - 1;
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }

    return true;
}

function updateWinsPercentage() {
    app.el['records'].querySelectorAll('.value')[1].innerHTML = Math.ceil(100 * app.data.wins / app.data.games) + '%';
}

function increaseGamesCounter(force) {

    if (app.data.moves === 2 || force) {
        app.data.games++;
        document.cookie = "sol_games=" + app.data.games + "; path=/; expires=" + (new Date((new Date).getTime() + 31536E6)).toUTCString();
        // отразим это в таблице рекордов...
        app.el['records'].querySelector('.value').innerHTML = app.data.games;
        updateWinsPercentage();
    }
}

function increaseWinsCounter() {
    app.data.wins++;
    document.cookie = "sol_wins=" + app.data.wins + "; path=/; expires=" + (new Date((new Date).getTime() + 31536E6)).toUTCString();
    updateWinsPercentage();
}

function rebuildTable() {
    var table = app.el['records'].querySelectorAll('.recordstable')[0];
    table.innerHTML = buildTable();
}

function buildTable() {
    var table = '<span class="number head">#</span><span class="login head">игрок</span><span class="move head">ходы</span><span class="time head">время</span><br>';

    for (var i = 0; i < app.data.records.length && i < 5; i += 1) {
        var name = app.data.records[i].split(',')[0],
            move = app.data.records[i].split(',')[1],
            time = app.data.records[i].split(',')[2],
            highlight = '';

        // временно? проверка валидности данных.
        if ((move === undefined) || (time === undefined)) {
            name = 'Гость';
            time = '99:99';
            move = '500';
            app.data.records[i] = 'Гость,500,99:99';
        }

        if (app.data.currentRecord === i) {
            highlight = ' your'; // надо ли подсветить запись как текущий рекорд?
        }

        table += '<span class="number' + highlight + '">' + (i+1) + '</span><span class="login' + highlight + '">' + name + '</span><span class="move' + highlight + '">' + move + '</span><span class="time' + highlight + '">' + time + '</span><br>';
    }

    app.data.currentRecord = undefined;

    // заполним прочерки.
    for (var i = 0; i < 5 - app.data.records.length; i += 1) {
        table += '<span class="number">' + (i+1+app.data.records.length) + '</span><span class="login">-</span><span class="move">-</span><span class="time">-</span><br>';
    }

    table += '<span class="fill">...</span><br>';

    if (app.data.records[5]) {
        table += '<span class="number your">?</span><span class="login your">'+ app.data.records[5].split(',')[0] + '</span><span class="move your">'+ app.data.records[5].split(',')[1] + '</span><span class="time your">'+ app.data.records[5].split(',')[2] + '</span><br>';
    }

    return table;

}

function buildRecords() {
    // document.cookie = "record_diman=198,00:45; path=/; expires=" + (new Date((new Date).getTime() + 31536E6)).toUTCString();

    var layout = '<span class="header-top">Рейтинг *</span><div class="recordstable">' + buildTable() + '</div>' +
        '<span class="header-top">Cтатистика</span><div class="recordstable">' +
        '<span class="key">расклады</span><span class="value">' + app.data.games + '</span><span class="dummy">&nbsp;</span><br>' +
        '<span class="key">% побед</span><span class="value">' + (app.data.games === 0 ? 0 : Math.ceil(100 * app.data.wins / app.data.games)) + '%</span><span class="dummy">&nbsp;</span><br></div>';

    layout += '<div class="close">&times;</div><div class="note">* на данном устройстве</div>';
    layout += '<div class="recordsmask"></div>';
    layout += '<div class="prompt"><span>Новый рекорд!</span><br><input type="text" value="игрок"/><br><div class="submit">Записать</div></div>';

    return layout;
}

function buildLayout() {
    document.body.innerHTML =
        '<div class="game">' +
        '<div class="version">v1.1a</div>' +
        '<div class="wmark"><a href="mailto:koutsenko@gmail.com">©</a> Куценко Д. С., 2015<br>сборка для портала<br><span>www.solo-games.ru</span></div>' +
        '<div class="menu">' +
        '<div class="buttons">' +
        '<div title="Начать новый расклад, текущий будет закрыт"        class="btn1"> <div class="face"><div>Разложить</div></div></div><span>&nbsp;</span>' +
        '<div title="Отмена последнего сделанного хода"                 class="btn2"> <div class="face"><div>Ход назад</div></div></div><span>&nbsp;</span>' +
        '<div title="Автозавершение игры, если открыты все карты"       class="btn3"> <div class="face"><div>Автосбор </div></div></div><span>&nbsp;</span>' +
        '<div title="Как играть в пасьянс-косынку"                      class="btn4"> <div class="face"><div>Правила  </div></div></div><span>&nbsp;</span>' +
        '<div title="Авторизация, статистика, рекорды"                  class="btn5"> <div class="face"><div>Рекорды  </div></div></div><span>&nbsp;</span>' +
        '</div>' +
        '</div>' +
        '<div class="table">' +
        '<div class="deck"><div class="face"></div></div>' +
        '<div class="open"><div class="face"></div></div>' +
        '<div class="status">"Косынка"<br>классика<br><div class="counter"></div></div>' +
        '<div class="home1"><div class="face">Т</div></div>' +
        '<div class="home2"><div class="face">Т</div></div>' +
        '<div class="home3"><div class="face">Т</div></div>' +
        '<div class="home4"><div class="face">Т</div></div>' +
        '<div class="stack1"><div class="face">К</div></div>' +
        '<div class="stack2"><div class="face">К</div></div>' +
        '<div class="stack3"><div class="face">К</div></div>' +
        '<div class="stack4"><div class="face">К</div></div>' +
        '<div class="stack5"><div class="face">К</div></div>' +
        '<div class="stack6"><div class="face">К</div></div>' +
        '<div class="stack7"><div class="face">К</div></div>' +
        '</div>' +
        '<div class="records">' + buildRecords() + '</div>' +
        '<div class="rules">' +
        '<div class="close">&times;</div>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;Как играть?<br><br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;Цель - заполнить все четыре дома картами одной масти, сначала тузы, далее двойки, тройки и так до короля. ' +
        '<div class="image"></div><br><br>&nbsp;&nbsp;&nbsp;&nbsp;Карты берутся из колоды или со стола. ' +
        'Открытые карты стола Вы можете перемещать по принципу: короля - на пустую стопку, не короля - на карту выше рангом и другого цвета.<br><br> ' +
        '&nbsp;&nbsp;&nbsp;&nbsp;Сойдется ли пасьянс? Все как в жизни - зависит от везения и Вашего мастерства...' +
        '</div>' +
        '<div class="mask"></div>' +
        '</div>' +
        '<div class="mark"></div>';/* +
        '<div class="console"></div>';*/

    for (var i = 0, els = document.body.getElementsByTagName('div'); i < els.length; i++) {
        // face это чисто оформительский элемент верстки, ссылки на них не нужны
        if (els[i].className !== 'face' && els[i].className !== '') {
            app.el[els[i].className] = els[i];
        }
    }
}

function buildCards() {
    var suits = ['H', 'D', 'C', 'S'],
        ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'],
        i,
        j,
        id;

    function buildCardMarkup(id) {
        var el = document.createElement('div'),
            face = document.createElement('div'),
            back = document.createElement('div'),
            corner = document.createElement('span'),
            portrait,
            center,
            suit = {
                'H': '\u2665',
                'S': '\u2660',
                'C': '\u2663',
                'D': '\u2666'
            }[id[0]];


        back.className = 'back';

        corner.className = 'corner';
        corner.innerHTML = {
            'A': 'Т',
            'K': 'К',
            'Q': 'Д',
            'J': 'В',
            '=': '=',
            '9': '9',
            '8': '8',
            '7': '7',
            '6': '6',
            '5': '5',
            '4': '4',
            '3': '3',
            '2': '2'
        }[id[1]] + suit + '<br>' + suit;

        face.className = 'face';
        face.appendChild(corner);

        el.className = 'card ' + id;
        el.appendChild(back);
        el.appendChild(face);

        if (!(id[1] === 'K' || id[1] === 'Q' || id[1] === 'J')) {
            center = document.createElement('span');
            center.className = 'center';
            center.innerHTML = {
                '2': suit + '\n\n' + suit,
                '3': suit + '\n\n' + suit + '\n\n' + suit,
                '4': suit + ' ' + suit + '\n\n' + suit + ' ' + suit,
                '5': suit + ' ' + suit + '\n ' + suit + ' \n' + suit + ' ' + suit,
                '6': suit + ' ' + suit + '\n\n' + suit + ' ' + suit + '\n\n' + suit + ' ' + suit,
                '7': suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit,
                '8': suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit,
                '9': suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit,
                '=': '<span style="float: right;">' + suit + '</span>\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit,
                'A': '<span style="font-size: 3em;">' + suit + '</span>'
            }[id[1]];
            face.appendChild(center);
        }
        return el;
    }

    app.data.cards = {};
    for (i = 0; i < suits.length; i += 1) {
        for (j = 0; j < ranks.length; j += 1) {
            id = suits[i].concat(ranks[j]);
            app.data.deck[i * ranks.length + j] = buildCardMarkup(id);
            app.data.cards[id] = app.data.deck[i * ranks.length + j];
        }
    }

    shuffle(app.data.deck);
}

function collectCards() {
    var i;
    for (i = 0; i < 52; i += 1) {
        app.data.deck[i].className = app.data.deck[i].className.replace(' flipped', '');
        app.data.deck[i].parentNode.removeChild(app.data.deck[i]);
    }
}

function dealCards(state) {
    // восстанавливаем перевернутые по окончании игры короли
    app.data.cards['HK'].className = app.data.cards['HK'].className.replace(' flipped', '');
    app.data.cards['DK'].className = app.data.cards['DK'].className.replace(' flipped', '');
    app.data.cards['CK'].className = app.data.cards['CK'].className.replace(' flipped', '');
    app.data.cards['SK'].className = app.data.cards['SK'].className.replace(' flipped', '');

    var i, j;

    // FIXME неоднозначность
    if (state === '' || state === undefined) {
        var index = 0,
            temp;

        for (i = 0; i < 7; i += 1) {

            app.el['stack'+(i+1)].appendChild(app.data.deck[index]);
            if (i !== 0) {
                app.data.deck[index].className += ' flipped';
            }

            for (j = 0; j < i + 1; j += 1, index += 1) {
                if (temp) {
                    temp.appendChild(app.data.deck[index]);
                    if (j !== i) {
                        app.data.deck[index].className += ' flipped';
                    }
                }
                temp = app.data.deck[index];
            }
            temp = undefined;
        }

        index = 28;
        for (i = index; i < 50; i += 1) {
            app.data.deck[i].appendChild(app.data.deck[i + 1]);
        }
        app.el['deck'].appendChild(app.data.deck[index]);
        app.el['open'].appendChild(app.data.deck[51]);
        unsetEnd();
        unsetLast();
    } else {
        // разбираем строку, она должна быть такой: dkCKH8_opH9_h1_h2_h3SA_h4_s1_s2_s3_s4_s5_s6_s7fSKoD9_2300_230 но без префиксов см ниже
        // элементы тут app.data.cards[{'H', 'D', 'C', 'S'}{'A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'}]
        // 0 генерирую руками сохраненку с почти законченной игрой и думаю как проверить кнопку закончить игру и надо ли увеличить кол-во раскладов
        state = '__HAH2H3H4H5H6H7H8H9H=HJHQHK_DAD2D3D4D5D6D7D8D9D=DJDQDK_CAC2C3C4C5C6C7C8C9C=CJCQCK_SAS2S3S4S5S6S7S8S9S=SJSQ_oSK_______23:00_230';
        var data = state.split('_');
        // 0 - колода, 1 - опен, 2-5 - хомы, 6-13 - стеки, 14-15 - время и ход
        for (i = 0; i < data[0].length / 2; i++) {
            // TODO парсим колоду
        }
        // TODO парсим опен
        // парсим хомы
        for (j = 0; j < 4; j++) {
            var target = app.el['home' + (j+1)];
            for (i = 0; i < data[2+j].length; i += 2) {
                target = target.appendChild(app.data.cards[data[2+j][i] + data[2+j][i+1]]);
            }
        }
        // парсим стеки
        for (j = 0; j < 7; j++) {
            var target = app.el['stack' + (j+1)];
            for (i = 0; i < data[6+j].length; i += 3) {
                target = target.appendChild(app.data.cards[data[6+j][i+1] + data[6+j][i+2]]);
                if (data[6+j][i] === 'f') {
                    target.className += ' flipped';
                }
            }
        }

        // загружаем время старта раунда
        var time = data[13];
        app.data.timer = new Date(new Date().getTime() - 60000 * (+(time[0] + time[1]) - 1000 * (+(time[3] + time[4])))).getTime();

        // обновляем счетчик ходов
        app.data.moves = data[14];

        increaseGamesCounter(1);
    }
}

function doLayout() {
    var unitSize, fluid, rnd = function(value) {
        return Math.round(value) + 'px';
    };

    // УНИКАЛЬНЫЕ для всех трех случаев значения
    if (window.matchMedia("(max-aspect-ratio: 17/12)").matches) {
        unitSize = document.documentElement.offsetWidth / 8.5;

        // X-координата элементов стола
        app.el['deck'].style.left = 0;
        app.el['open'].style.left = rnd(unitSize * 5 / 4);
        app.el['status'].style.left = rnd(2 * unitSize * 5 / 4);
        for (var i = 0; i < 4; i++) {
            app.el['home' + (i+1)].style.left = rnd((i+3) * unitSize * 5 / 4);
        }
        for (var i = 0; i < 7; i++) {
            app.el['stack' + (i+1)].style.left = rnd(i * unitSize * 5 / 4);
        }

        app.el['menu'].className = 'menu horizontal';
        app.el['menu'].style.right = '';
        app.el['menu'].style.height = rnd(unitSize * 5 / 4);
        app.el['menu'].style.bottom = rnd(unitSize / 4);
        app.el['menu'].style.width = '';
        app.el['menu'].style.top = '';
        app.el['buttons'].style.height = rnd(unitSize * 5 / 4);
        app.el['buttons'].style.width = rnd(unitSize * 6 * 5 / 4);
        for (var i = 0; i < 5; i++) {
            app.el['btn' + (i+1)].style.marginTop = '';
            app.el['btn' + (i+1)].style.width = rnd(unitSize * 5 / 4);
            app.el['btn' + (i+1)].style.height = rnd(unitSize * 5 / 4);
        }

        app.el['wmark'].style.bottom = rnd(2 * unitSize);
    } else {
        if (window.matchMedia("(min-aspect-ratio: 59/24)").matches) {
            //app.el['debug'].innerHTML = 'AR > 59/24';

            unitSize = document.documentElement.offsetHeight / 6,
                fluid = document.documentElement.offsetWidth / 2 - 59 * unitSize / 8;

            app.el['deck'].style.left = rnd(unitSize / 4 + fluid);
            app.el['open'].style.left = rnd(unitSize / 4 + 2 * unitSize + fluid);
            app.el['status'].style.left = rnd(unitSize / 4 + 4 * unitSize + fluid);
            for (var i = 0; i < 4; i++) {
                app.el['home' + (i+1)].style.left = rnd(unitSize / 4 + 2 * (i+3) * unitSize + fluid);
            }
            for (var i = 0; i < 7; i++) {
                app.el['stack' + (i+1)].style.left = rnd(unitSize / 4 + 2 * i * unitSize + fluid);
            }
        } else if (window.matchMedia("(min-aspect-ratio: 17/12)").matches) {
            //app.el['debug'].innerHTML = '17/12 < AR < 59/24';

            unitSize = document.documentElement.offsetHeight / 6,
                fluid = (((6 * document.documentElement.offsetWidth - 8.5 * 6* unitSize) / 42)+unitSize);
            app.el['deck'].style.left = rnd(unitSize / 4);
            app.el['open'].style.left = rnd(unitSize / 4 + fluid);
            app.el['status'].style.left = rnd(unitSize / 4 + 2*fluid);
            for (var i = 0; i < 4; i++) {
                app.el['home' + (i+1)].style.left = rnd(unitSize / 4 + (i+3)*fluid);
            }
            for (var i = 0; i < 7; i++) {
                app.el['stack' + (i+1)].style.left = rnd(unitSize / 4 + i*fluid);
            }
        }

        // В последних двух случаях общее меню
        app.el['menu'].className = 'menu vertical';
        app.el['menu'].style.height = '';
        app.el['menu'].style.width = rnd(unitSize);
        app.el['menu'].style.top = rnd(unitSize / 4);
        app.el['menu'].style.bottom = 0;
        app.el['menu'].style.right = rnd(unitSize / 4);
        app.el['buttons'].style.height = rnd(unitSize * 6);
        app.el['buttons'].style.width = 'inherit';

        app.el['wmark'].style.bottom = rnd(unitSize);

        for (var i = 0; i < 5; i++) {
            app.el['btn' + (i+1)].style.width = rnd(unitSize);
            app.el['btn' + (i+1)].style.height = rnd(unitSize);
        }
    }

    // ОБЩИЕ для всех трех случаев значения

    // ширина элементов стола
    app.el['deck'].style.width =
        app.el['open'].style.width =
            app.el['status'].style.width = rnd(unitSize);
    for (var i = 0; i < 4; i++) {
        app.el['home' + (i+1)].style.width = rnd(unitSize);
    }
    for (var i = 0; i < 7; i++) {
        app.el['stack' + (i+1)].style.width = rnd(unitSize);
    }

    // высота элементов стола
    app.el['deck'].style.height =
        app.el['open'].style.height =
            app.el['status'].style.height = rnd(6*unitSize/5);
    for (var i = 0; i < 4; i++) {
        app.el['home' + (i+1)].style.height = rnd(6*unitSize/5);
    }
    for (var i = 0; i < 7; i++) {
        app.el['stack' + (i+1)].style.height = rnd(6*unitSize/5);
    }

    // верхняя координата зон первого ряда стола
    app.el['deck'].style.top =
        app.el['open'].style.top =
            app.el['status'].style.top =
                app.el['home1'].style.top =
                    app.el['home2'].style.top =
                        app.el['home3'].style.top =
                            app.el['home4'].style.top = rnd(unitSize/4);

    // верхняя координата зон второго ряда стола
    app.el['stack1'].style.top =
        app.el['stack2'].style.top =
            app.el['stack3'].style.top =
                app.el['stack4'].style.top =
                    app.el['stack5'].style.top =
                        app.el['stack6'].style.top =
                            app.el['stack7'].style.top = rnd(unitSize*17/10); // 1/4 + 6/5 + 1/4

    document.documentElement.style.fontSize = unitSize*1.2 + '%';
}

function handlePress(el, fn, animated) {
    (function(el, fn, animated) {
        app.dnd["touchstart"] = 0;
        app.dnd["mousedown"] = 0;
        el.fn = fn;
        el.onmousedown = el.ontouchstart = function(event) {
            cancelEvent(event);
            if (app.dnd["touchstart"] > 0 && event.type === 'mousedown') {
                return;
            }
            app.dnd[event.type] += 1;

            // Анимация нажатия. 250ms вроде нормально.
            if (animated) {
                el.className += ' pressed';
                setTimeout(function() {
                    el.className = el.className.replace(' pressed', '');
                }, 250);
            }
            // 500ms is minimum recommended for Android < 4.4, because there is native delay between touchstart and mousedown...
            setTimeout(function() {
                app.dnd[event.type] = 0;
            }, 500);

            // Тяжелая функция может помешать анимации нажатия, поэтому отсрочим немного ее вызов.
            if (animated) {
                setTimeout(function() {
                    el.fn(event);
                }, 0);
            } else {
                el.fn(event);
            }
        };
    }) (el, fn, animated);
}

function handleUnpress(el, fn) {
    (function(el, fn) {
        app.dnd["mouseup"] = 0;
        app.dnd["touchend"] = 0;
        el.fn = fn;
        el.onmouseup = el.ontouchend = function(event) {
            cancelEvent(event);
            if (app.dnd["touchend"] > 0 && event.type === 'mouseup') {
                return;
            }
            app.dnd[event.type] += 1;
            if (app.dnd[event.type] < 2) {
                el.fn(event);
            }
            setTimeout(function() {
                app.dnd[event.type] = 0;
            }, 500);
        }
    }) (el, fn);
}

function getClickedCard(event) {
    var target, classes;
    for (target = event.target; target.className !== 'table'; target = target.parentNode) {
        classes = target.className.split(' ');
        if (classes[0] === 'card') {
            return classes[2] === 'flipped' ? null : target;
        }
    }
    return null;
}

app.openCard = function() {
    var deckCard = app.el['deck'],
        openCard = app.el['open'],
        o;

    while (deckCard.hasChildNodes() && deckCard.lastChild.className.split(' ')[0] === 'card') {
        deckCard = deckCard.lastChild;
    }
    while (openCard.hasChildNodes() && openCard.lastChild.className.split(' ')[0] === 'card') {
        openCard = openCard.lastChild;
    }

    if (deckCard !== app.el['deck']) {
        openCard.appendChild(deckCard.parentNode.removeChild(deckCard));
    } else if (openCard !== app.el['open']) {
        while (openCard !== app.el['open']) {
            o = openCard.parentNode;
            deckCard = deckCard.appendChild(openCard.parentNode.removeChild(openCard));
            openCard = o;
        }
    }
    app.data.moves++;
    increaseGamesCounter();
    updateHud();
};

app.canDrop = function(card, target) {
    var matrix,
        cardClasses,
        targetClasses,
        parent;

    if (app.data.oldParent.isEqualNode(target)) {
        return false;
    }

    cardClasses = card.className.split(' ');
    targetClasses = target.className.split(' ');

    if (target.className.indexOf('home') + 1) {
        return cardClasses[1][1] === 'A';
    }

    if (target.className.indexOf('stack') + 1) {
        return cardClasses[1][1] === 'K';
    }

    parent = target;
    while (parent.className.indexOf('home') < 0 && parent.className.indexOf('stack') < 0) {
        parent = parent.parentNode;
    }
    if (parent.className.indexOf('home') + 1) {
        matrix = {
            '2': 'A',
            '3': '2',
            '4': '3',
            '5': '4',
            '6': '5',
            '7': '6',
            '8': '7',
            '9': '8',
            '=': '9',
            'J': '=',
            'Q': 'J',
            'K': 'Q'
        };
        if (targetClasses[1][1] !== matrix[cardClasses[1][1]]) {
            return false;
        }
        if (targetClasses[1][0] !== cardClasses[1][0]) {
            return false;
        }
        if (card.lastChild && card.lastChild.className.substring(0, 5) === 'card ') {
            return false;
        }
    } else if (parent.className.indexOf('stack') + 1) {
        matrix = {
            'K': 'A',
            'Q': 'K',
            'J': 'Q',
            '=': 'J',
            '9': '=',
            '8': '9',
            '7': '8',
            '6': '7',
            '5': '6',
            '4': '5',
            '3': '4',
            '2': '3'
        };
        if (targetClasses[1][1] !== matrix[cardClasses[1][1]]) {
            return false;
        }
        switch (targetClasses[1][0]) {
            case 'D':
            case 'H':
                if (cardClasses[1][0] !== 'S' && cardClasses[1][0] !== 'C') {
                    return false;
                }
                break;
            case 'C':
            case 'S':
                if (cardClasses[1][0] !== 'D' && cardClasses[1][0] !== 'H') {
                    return false;
                }
                break;
        }

    }
    return true;
};

app.placeCard = function(card, target) {
    // FIXME на этом этапе может сохраняться moving класс у card, почему?
    var i, lastChild, flipped = false;

    target.appendChild(card);
    // flip old parent to get visible.
    for (i = 0; i < 7; i += 1) {
        lastChild = app.el['stack' + (i+1)];
        while (lastChild.lastChild && (lastChild.lastChild.className.indexOf('card') + 1)) {
            lastChild = lastChild.lastChild;
        }
        if (lastChild.className.split(' ')[2] === 'flipped') {
            flipped = true;
            lastChild.className = lastChild.className.replace(' flipped', '');
            break;
        }
    }

    if (!app.gameEnd()) {
        app.writeMove('move', card, app.data.oldParent, target, flipped);
        if (app.canComplete()) {
            app.el['btn3'].className = app.el['btn3'].className.replace(' disabled', '');
        }
    }
};

app.canComplete = function() {
    var i, card;
    for (i = 0; i < 7; i += 1) {
        card = app.el['stack' + (i+1)];
        while (card.hasChildNodes() && card.lastChild.className.split(' ')[0] === 'card') {
            card = card.lastChild;
            if (card.className.indexOf('flipped') + 1) {
                return false;
            }
        }
    }
    return true;
};

app.writeMove = function(action, card, parent, target, flipped) {
    if (action === 'open') {
        app.last.type = 'open';
    } else {
        app.last = {
            type: action,
            card: card,
            target: target,
            parent: parent,
            flipped: flipped
        };
    }

    if (app.el['btn2'].className.indexOf('disabled') + 1) {
        app.el['btn2'].className = app.el['btn2'].className.replace(' disabled', '');
    }
};

app.tryMoveHome = function(card) {
    var i, child;
    if (card === null) {
        return;
    }
    for (i = 0; i < 4; i += 1) {
        child = app.el['home'+(i+1)];
        while (child.lastChild && (child.lastChild.className.indexOf('card')+1)) {
            child = child.lastChild;
        }
        app.data.oldParent = card.parentElement;
        if (app.canDrop(card, child)) {
            app.placeCard(card, child);
            app.data.moves++;
            increaseGamesCounter();
            updateHud();
            return;
        }
    }
    app.data.card = null;
};

app.completeGame = function() {
    if (app.el['btn3'].className.indexOf('disabled') + 1) {
        return false;
    }

    var i, lastChild;
    while (!app.gameEnd()) {
        for (i = 0; i < 7; i += 1) {
            lastChild = app.el['stack' + (i+1)];
            while (lastChild.lastChild.className.indexOf('card') + 1) {
                lastChild = lastChild.lastChild;
            }
            if (!lastChild.isEqualNode(app.el['stack' + (i+1)])) {
                app.tryMoveHome(lastChild);
            }
        }
        app.openCard();
        lastChild = app.el['open'];
        while (lastChild.lastChild.className.indexOf('card') + 1) {
            lastChild = lastChild.lastChild;
        }
        if (!lastChild.isEqualNode(app.el['open'])) {
            app.tryMoveHome(lastChild);
        }
    }
};

app.gameEnd = function() {
    var i, kings, last;
    for (i = 0, kings = 0; i < 4; i += 1) {
        last = app.el['home' + (i+1)];
        if (!(last.lastChild.className.indexOf('card') + 1)) {
            return false;
        }
        while (last.lastChild && (last.lastChild.className.indexOf('card') + 1)) {
            last = last.lastChild;
        }
        if (last.className.split(' ')[1][1] === 'K') {
            kings += 1;
        }
        if (kings === 4) {
            // именно в этот момент останавливается время, которое мы хотим записать.
            app.data.timeend = app.calculateElapsedTime();
            for (var j = 0; j < 4; j++) {
                var z = app.el['home' + (j+1)];
                while (z.lastChild && (z.lastChild.className.indexOf('card') + 1)) {
                    z = z.lastChild;
                }
                z.className += ' flipped';
            }
            unsetEnd();
            unsetLast();
            increaseWinsCounter();
            app.showRanks(true);
            return true;
        }
    }
    return false;
};

app.writeRecord = function() {
    // считать поле ввода
    var nickname = app.el['records'].querySelector('input').value;
    if (nickname === '') {
        nickname = 'игрок';
    } else {
        nickname = nickname.replace('_', ' ').replace(',', ' ');
    }

    app.data.records.splice(app.data.currentRecord, 0, nickname + ',' + app.data.moves + ',' + app.data.timeend);
    app.data.records = app.data.records.slice(0, 5);

    var cookie = '';
    for (var i = 0; i < app.data.records.length; i++) {
        if (!app.data.records[i]) {
            break;
        }

        if (i !== 0) {
            cookie += '_';
        }
        cookie += app.data.records[i];
    }
    document.cookie = 'sol_records=' + encodeURIComponent(cookie) + '; path=/; expires=' + (new Date(new Date().getTime() + 60 * 60 * 24 * 30 * 365 * 10)).toUTCString();

    // перестроим таблицу?
    rebuildTable();
};

app.showRanks = function(current) {
    app.el['mask'].style.visibility = 'visible';



    if (current) {
        // останавливаем таймер
        // FIXME мб это не нужно? сделать вечную обновлялку...
        clearInterval(app.data.hudtask);



        // читаем ходы и сравниваем с нашим результатом
        for (var i = 0; i < 5; i += 1) {
            if (app.data.records[i]) {
                var move = app.data.records[i].split(',')[1],
                    name = app.data.records[i].split(',')[0];

                if (app.data.moves < move) {
                    app.data.currentRecord = i;
                    app.el['records'].querySelector('input').value = 'игрок';
                    app.el['records'].className = 'records visible prompt';
                    app.el['records'].querySelector('input').focus();
                    return;
                }
            } else {
                // заняли пустой рекорд, спрашиваем кто
                app.data.currentRecord = i;
                app.el['records'].querySelector('input').value = 'игрок';
                app.el['records'].className = 'records visible prompt';
                app.el['records'].querySelector('input').focus();
                return;
            }
        }

        // ничего не заняли? временно покажем результат в так называемой 6-й строчке, она не сохранится ибо метод записи пишет не больше 5
        if (app.data.currentRecord === undefined) {
            app.data.records[5] = 'Вы,' + app.data.moves + ',' + app.data.timeend;
            rebuildTable();
            app.el['records'].className = 'records visible';
        }
    } else {
        app.el['records'].className = 'records visible';
    }
};

app.showRules = function() {
    app.el['mask'].style.visibility = 'visible';
    app.el['rules'].className = 'rules visible';
};

app.getX = function(event) {
    return event.targetTouches ? event.targetTouches[0].clientX : event.pageX;
};

app.getY = function(event) {
    return event.targetTouches ? event.targetTouches[0].clientY : event.pageY;
};

app.cacheDND = function(event) {
    var i,
        j,
        targPos,
        rec = app.data.card.getBoundingClientRect(),
        stackTop = app.el['stack1'].getBoundingClientRect().top;
    // FIXME теперь это можно из стилей вытащить вроде как.

    app.data.offset = [app.getX(event) - rec.left, app.getY(event) - rec.top];
    app.data.size = [rec.right - rec.left, rec.bottom - rec.top];
    app.data.zones = [];

    for (i = 0; i < 4; i += 1) {
        j = app.el['home' + (i+1)];
        while (j.lastChild && j.lastChild.className !== app.data.card.className && j.lastChild.className.split(' ')[0] === 'card') {
            j = j.lastChild;
        }
        targPos = j.getBoundingClientRect();
        app.data.zones.push({
            xmin: targPos.left,
            xmax: targPos.left + app.data.size[0],
            ymin: targPos.top,
            ymax: targPos.top + app.data.size[1],
            target: j
        });
    }
    for (i = 0; i < 7; i += 1) {
        j = app.el['stack' + (i+1)];
        while (j.lastChild && j.lastChild.className !== app.data.card.className && j.lastChild.className.split(' ')[0] === 'card') {
            j = j.lastChild;
        }
        // последняя карта стека это необычная дропзона, с топ координатой равной топ самого стека
        // также раз такая пьянка то для скорости применяем хак - запоминаем высоту первого стека...
        targPos = j.getBoundingClientRect();
        app.data.zones.push({
            xmin: targPos.left,
            xmax: targPos.left + app.data.size[0],
            ymin: stackTop,
            ymax: targPos.top + app.data.size[1],
            target: j
        });
    }
};

app.drag = function(event) {
    // проверяем что это не второй палец при мультитаче...
    if (app.data.card) {
        return;
    }

    app.data.card = getClickedCard(event);
    if (app.data.card === null) {
        return;
    }

    // реального движения или второго клика не было - пока "как дроп" не обрабатываем...
    handleUnpress(document, function() {
        document.onmousemove = document['ontouchmove'] = null;
        document.onmouseup = document['ontouchend'] = null;
        app.data.card = null;
    });

    // здесь пора задуматься о включении игрового таймера

    // второй клик, обработка как дабл-клик. Этот хэндлер позднее снимется при реальном движении или по истечении 0.5с
    handlePress(app.el['table'], function(event) {
        // первый вариант запуска таймера - попытка даблклика
        if (app.data.moves === 1) {
            app.data.timer = new Date().getTime();
        }
        app.tryMoveHome(getClickedCard(event));
        handlePress(app.el['table'], app.drag);
    });

    // снятие дабл-клик-хэндлера по истечение 0.5с
    setTimeout(function() {
        handlePress(app.el['table'], app.drag);
    }, 500);

    app.data.oldXY = app.getX(event) + ';' + app.getY(event);

    // обработка мува
    document.onmousemove = document['ontouchmove'] = function(event) {
        // смотрим реально ли мы сдвинули мышь.
        var oldXY = app.data.oldXY.split(';');
        if ((Math.abs(oldXY[0] - app.getX(event)) < 8) && (Math.abs(oldXY[1] - app.getY(event)) < 8)) {
            return;
        }

        // второй и последний вариант запуска таймера - начало драг и дропа
        if (app.data.moves === 1) {
            app.data.timer = new Date().getTime();
        }
        document.onmousemove = document['ontouchmove'] = function(event) {
            if (app.data.oldXY === app.getX(event) + ';' + app.getY(event)) {
                app.stopRender = true;
                return;
            }

            app.move(event);
        };
        // нормальный клик (отмена дабл-клика)
        handlePress(app.el['table'], app.drag);

        // дроп для любителей таскать карту за краешек, когда курсор мыши отстает от карты...
        handleUnpress(document, function(event) {
            document.onmousemove = document['ontouchmove'] = null;
            document.onmouseup = document['ontouchend'] = null;
            app.data.card.className = app.data.card.className.replace(' moving', '');
            app.drop(event);
        });

        app.data.oldParent = app.data.card.parentElement;
        app.cacheDND(event);
        app.data.card.className += ' moving';
        document.body.appendChild(app.data.card);

        app.stopRender = true;
        app.move(event);
    };
};

app.getDZ = function(center) {
    var rect, i;
    for (i = 0; i < app.data.zones.length; i += 1) {
        rect = app.data.zones[i];
        if ((center[0] > rect.xmin) && (center[0] < rect.xmax) && (center[1] > rect.ymin) && (center[1] < rect.ymax)) {
            return rect.target;
        }
    }
    return null;
};

app.realMove = function() {
    if (app.stopRender) {
        return;
    }
    if (!app.data.drawn) {
        app.data.card.style.cssText = app.data.cardCss;

        if (app.data.currentTarget && app.data.targetClass.length) {
            var rect = app.data.currentTarget.getBoundingClientRect(),
                coor = 'translate(' + rect.left + 'px,' + rect.top + 'px)',
                tran = '-ms-transform: ' + coor + '; -webkit-transform: ' + coor + '; transform: ' + coor + ';',
                size = 'width: ' + app.data.size[0] + 'px; height: ' + app.data.size[1] + 'px;',
                back = 'background-color: ' + (app.data.targetClass.indexOf('invalid') >= 0 ? 'rgba(255,0,0,0.5)' : 'rgba(0,255,0,0.5)');

            app.el['mark'].style.cssText = 'visibility: visible; ' + tran + size + back;

        } else {
            app.el['mark'].style.cssText = 'visibility: hidden;';
        }
        app.data.drawn = true;
    }
    window.requestAnimationFrame(app.realMove);
};

app.move = function(event) {
    app.data.drawn = false;

    var coor = 'translate(' + (app.getX(event) - app.data.offset[0]) + 'px,' + (app.getY(event) - app.data.offset[1]) + 'px)',
        size = 'width: ' + app.data.size[0] + 'px; height: ' + app.data.size[1] + 'px;';

    app.data.cardCss = '-ms-transform: ' + coor + '; -webkit-transform: ' + coor + '; transform: ' + coor + ';' + size;
    app.data.currentTarget = app.getDZ([app.getX(event) - app.data.offset[0] + app.data.size[0] / 2, app.getY(event) - app.data.offset[1] + app.data.size[1] / 2]);

    app.data.oldTarget = app.data.currentTarget;
    if (app.data.currentTarget !== null) {
        app.data.targetClass = app.canDrop(app.data.card, app.data.currentTarget) ? 'valid' : 'invalid';
    }

    if (app.stopRender) {
        app.stopRender = false;
        app.realMove();
    }

};

app.drop = function() {
    app.stopRender = true;
    app.data.card.style.cssText = '';
    app.el['mark'].style.cssText = '';
    if (app.data.currentTarget) {
        app.data.currentTarget.className = app.data.currentTarget.className.replace(/ (in)?valid/, '');
        if (app.canDrop(app.data.card, app.data.currentTarget)) {
            app.placeCard(app.data.card, app.data.currentTarget);
            app.data.moves++;
            increaseGamesCounter();
            updateHud();
        } else {
            app.data.oldParent.appendChild(app.data.card);
        }
    } else {
        app.data.oldParent.appendChild(app.data.card);
    }
    app.data.oldParent = null;
    app.data.currentTarget = null;
    app.data.card = null;
};

function unsetLast() {
    app.last = {
        type: undefined,
        card: undefined,
        target: undefined,
        parent: undefined,
        flipped: undefined
    };
    if (!(app.el['btn' + 2].className.indexOf('disabled') + 1)) {
        app.el['btn' + 2].className += ' disabled';
    }
}

app.undoMove = function() {
    var temp1, temp2;
    if (app.el['btn' + 2].className.indexOf('disabled') + 1) {
        return;
    }

    if (app.last.type === 'open') {
        if (app.el['open'].lastChild.className.indexOf('card') === -1) {
            temp1 = [];
            temp2 = app.el['deck'];
            while (temp2.lastChild.className.indexOf('card') + 1) {
                temp2 = temp2.lastChild;
                temp1.push(temp2.parentNode.removeChild(temp2));
            }
            for (temp2 = temp1.length - 1; temp2 > 0; temp2 -= 1) {
                temp1[temp2].appendChild(temp1[temp2 - 1]);
            }

            app.el['open'].appendChild(temp1[temp1.length - 1]);

        } else {
            temp1 = app.el['open'];
            temp2 = app.el['deck'];
            while (temp1.lastChild.className.split(' ')[0] === 'card') {
                temp1 = temp1.lastChild;
            }
            while (temp2.lastChild.className.split(' ')[0] === 'card') {
                temp2 = temp2.lastChild;
            }
            temp2.appendChild(temp1.parentNode.removeChild(temp1));
        }
    } else {
        app.last.parent.appendChild(app.last.target.removeChild(app.last.card));
        if (app.last.flipped) {
            app.last.parent.className += ' flipped';
        }
    }
    unsetLast();
    unsetEnd();
};

function unsetEnd() {
    if (!(app.el['btn' + 3].className.indexOf('disabled') + 1)) {
        app.el['btn'+3].className += ' disabled';
    }
}

app.calculateElapsedTime = function() {
    var time = new Date().getTime(),
        elapsedSeconds = Math.floor((time - (app.data.timer || time)) / 1000),
        elapsedMinutes = Math.floor(elapsedSeconds/60),
        elapsedHours = Math.floor(elapsedMinutes/60);

    if (elapsedHours > 0) {
        return '99:99';
    } else {
        return ('0' + elapsedMinutes).slice(-2) + ':' + ('0' + (elapsedSeconds-elapsedMinutes*60)).slice(-2);
    }
};

function scheduleHud() {
    clearInterval(app.data.hudtask);
    app.data.hudtask = setInterval(updateHud, 1000);
}

function updateHud() {
    app.el['counter'].innerHTML = 'ход ' + app.data.moves + '<br>' + app.calculateElapsedTime();
}

function initHandlers() {
    document.ondragstart = cancelEvent;
    document.body.onselectstart = cancelEvent;
    app.el['deck'].onmouseup = app.el['deck'].ontouchend = cancelEvent;
    handlePress(app.el['deck'], function() {
        app.openCard();
        app.writeMove('open');
    });
    handlePress(app.el['table'], app.drag);
    handlePress(app.el['btn1'], function() {
        app.data.moves = 1;
        app.data.timer = null;
        scheduleHud();
        collectCards();
        shuffle(app.data.deck);
        dealCards();
    }, true);
    handlePress(app.el['btn2'], app.undoMove, true);
    handlePress(app.el['btn3'], app.completeGame, true);
    handlePress(app.el['btn4'], app.showRules, true);
    handlePress(app.el['btn5'], function() {
        rebuildTable();
        app.showRanks()
    }, true);

    handlePress(app.el['records'].childNodes[4], function() {
        app.el['records'].className = 'records';
        app.el['mask'].style.visibility = '';
    });

    handlePress(app.el['records'].querySelector('.submit'), function() {
        app.el['records'].querySelector('input').blur();
        app.writeRecord();
        app.el['records'].className = 'records visible';
    });
    app.el['records'].querySelector('input').onkeyup = function(event) {
        if (event.keyCode == 13) {
            app.el['records'].querySelector('input').blur();
            app.writeRecord();
            app.el['records'].className = 'records visible';
        }
    };

    handlePress(app.el['rules'].childNodes[0], function() {
        app.el['rules'].className = 'rules';
        app.el['mask'].style.visibility = '';
    });
}

function setupResize() {
    window.onresize = function(event) {
        document.body.style.display = 'none';
        clearTimeout(app.data.timeout);
        app.data.timeout = setTimeout(function() {
            document.body.style.display = '';

            // технически можно отследить поворот...
            //app.el['console'].innerHTML += screen.width + ':' + screen.height + '<br>';

            // но надо однозначно установить алгоритм расчета размеров
            doLayout();
        }, 200);
    };
}

function initXhr() {
    app.xhr = new XMLHttpRequest();

    if (app.xhr.onload === undefined) { // это IE 8/9, в них старый XMLHttpRequest
        if (!window['XDomainRequest']) {
            throw new Error("Not supported");
        }
        app.xhr = new XDomainRequest(); // ..но есть XDomainRequest
    }
}

window.onload = function() {
    // FIXME ужасно некрасивый код
    app.data.records = getCookie('sol_records');
    if (app.data.records === '') {
        app.data.records = [];
    } else {
        app.data.records = app.data.records.split('_');
    }

    app.data.games = getCookie('sol_games');
    if (app.data.games === '') {
        app.data.games = 0;
    }

    app.data.wins = getCookie('sol_wins');
    if (app.data.wins === '') {
        app.data.wins = 0;
    }

    buildLayout();
    buildCards();
    dealCards(window.location.hash);
    doLayout();

    scheduleHud();
    initXhr();
    initHandlers();
    setupResize();

}