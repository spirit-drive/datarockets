"use strict";
let tree = {
    name: "Frontend",
    skills: [
        {
            name: "HTML & CSS",
            skills: [
                {
                    name: "Understanding block, inline and table models"
                },
                {
                    name: "Stylesheets",
                    skills: [
                        {
                            name: 'class'
                        },
                        {
                            name: "Positioning",
                            skills: [
                                {
                                    name: "static, relative and absolute, fixed, sticky"
                                }
                            ]
                        },
                        {
                            name: "Understanding of box model"
                        },
                        {
                            name: "Understanding floating"
                        },
                        {
                            name: 'FlexBox'
                        },
                        {
                            name: 'Animations'
                        },
                    ]
                },
                {
                    name: 'Preprocessors',
                    skills: [
                        {
                            name: 'For HTML',
                            skills: [
                                {
                                    name: 'Pug/Jade'
                                }
                            ]
                        },
                        {
                            name: 'For CSS',
                            skills: [
                                {
                                    name: 'Sass'
                                },
                                {
                                    name: 'Stylus'
                                },
                                {
                                    name: 'Scss'
                                },
                                {
                                    name: 'Less'
                                },
                            ]
                        },
                    ]
                },
                {
                    name: 'SVG'
                },
            ]
        },
        {
            name: "JavaScript",
            skills: [
                {
                    name: "Core",
                    skills: [
                        {
                            name: "DOM"
                        },
                        {
                            name: "Events"
                        },
                        {
                            name: "Data structures",
                            skills: [
                                {
                                    name: "Primitives and limitations"
                                },
                                {
                                    name: "Object"
                                }
                            ]
                        },
                    ]
                },
                {
                    name: "Approaches",
                    skills: [
                        {
                            name: "OOP",
                            skills: [
                                {
                                    name: "class"
                                },
                                {
                                    name: "Prototypes"
                                }
                            ]
                        },
                        {
                            name: "Asynchronous programming"
                        }
                    ]
                },
                {
                    name: "Frameworks & libraries",
                    skills: [
                        {
                            name: "React"
                        },
                        {
                            name: "jQuery"
                        }
                    ]
                },
                {
                    name: 'Additionally',
                    skills: [
                        {
                            name: 'Gulp'
                        }
                    ]
                }
            ]
        }
    ]
};
let tree1 = {
    name: '1213',
    skills: [
        {
            name: '1243'
        }
    ]
};

let renderTrees = {
    number: 0,
    container: '',
    tree: '',
    nameFirst: '',
    currentElem: '',
    start: function (obj,idContainer) {

        ++this.number;

        // Если в локальной истории что-то есть, то берем данные оттуда
        let localStorageTree = localStorage.getItem("tree");
        // this.tree = (localStorageTree) ? JSON.parse(localStorageTree) : obj;
        this.tree = obj;

        this.nameFirst = this.tree.name;

        // Присваиваем контейнер и рендерим элементы по объекту
        this.container = document.getElementById(idContainer);
        this.render();
    },

    // Произодит операции над объектом древовидной структуры. Добавляет, Редактирует, Удаляет
    operations: function (func,tree,name,parent,newName) {
        // tree - объект древовидной структуры
        // name - параметр, который будет изменен
        // newName - новый параметр
        // parent - родитель, дабы исключить изменение параметра в другой ветке. Не слишком надежное решение, можно усовершенствовать, но в рамках учебного задания, достаточно

        // Останавливаем функцию, если нет какого-то из данных
        if (!tree || !name){ return; }

        // Самый первый элемент? Функции особые
        if (!parent && tree.name === name){

            switch (func){

                // Редактирование
                case 'edit':
                    tree.name = newName;
                    this.currentElem.children[0].textContent = newName;
                    break;

                // Добавление подстроки
                case 'add':
                    let skills = tree.skills;
                    if (skills){
                        skills.push({name: newName});
                    } else {
                        tree.skills = [{name: newName}];
                    }

                    this.currentElem.parentNode.parentNode.innerHTML = this.getHtml(tree);
                    // this.init();
                    break;

                // Удаление
                case 'del':
                case 'delete':
                    tree.name = 'Новая ветка';
                    delete tree.skills;
                    this.render();
                    break;

                // По умолчанию добавление
                default:
                    tree.name = newName;
                    this.currentElem.children[0].textContent = newName;
            }
            // Рендерим элементы, сохраняем в локальную историю, завершем функцию
            localStorage.setItem("tree",JSON.stringify(this.tree, '', 2));
            return;

        }

        // Бежим по всем элементам списка
        for (let i = 0; tree.skills[i]; ++i){

            // Если найден элемент, то выполнем обозначенную операцию и завершаем функцию
            if (tree.skills[i].name === name && tree.name === parent){
                switch (func){

                    // Редактирование
                    case 'edit':

                        // Изменяем переменную и имя у элемента
                        tree.skills[i].name = newName;
                        this.currentElem.children[0].textContent = newName;
                        break;

                    // Добавление подстроки
                    case 'add':
                        let skills = tree.skills[i].skills;

                        // Если есть скилы, то добавляем в массив, если нет, то создаем массив
                        if (skills){
                            skills.push({name: newName});
                        } else {
                            tree.skills[i].skills = [{name: newName}];
                        }

                        // Рендерим родительскую ветку и инициализируем переменные и события
                        this.currentElem.parentNode.parentNode.childNodes[i].innerHTML = this.getHtmlBranch(tree.skills[i]);
                        // this.init();
                        break;

                    // Удаление
                    case 'del':
                    case 'delete':
                        tree.skills.splice(i, 1);
                        // Если skills оказывается пустой, то и его удаляем
                        if (!tree.skills.length) {
                            delete tree.skills;
                        }

                        // Рендерим родительскую ветку и инициализируем переменные и события
                        this.currentElem.parentNode.parentNode.parentNode.innerHTML = this.getHtmlBranch(tree);
                        // this.init();
                        break;

                    // По умолчанию добавление
                    default:

                        // Изменяем переменную и имя у элемента
                        tree.skills[i].name = newName;
                        this.currentElem.children[0].textContent = newName;
                }

                // Сохраняем в локальную историю, завершем функцию
                localStorage.setItem("tree",JSON.stringify(this.tree, '', 2));
                return;
            }

            // Если есть скилы, то запускаем очередной поиск
            if (tree.skills[i].skills){
                this.operations(func,tree.skills[i],name,parent,newName);
            }
        }
    },

    // Элемент из списка (линия)
    line: {
        elem: '',

        // Убирает/показывает под список, если он есть
        hideShowSublist: function (currentElem) {
            $(currentElem).parent().children('.list').slideToggle();
        },

        // Инициализирует переменные и события
        init: function () {
            let pendingClick = 0;
            let line = this;

            this.elem = $('.line');

            // При клике
            this.elem.click(function (e) {

                // Элемент вызова
                let currentElem = renderTrees.currentElem = this;

                // При втором клике обнаружит, что уже есть отложенный клик, отменит действие и выполнит функции двойного клика
                if (pendingClick) {
                    clearTimeout(pendingClick);
                    pendingClick = 0;
                }

                switch(e.originalEvent.detail){

                    // При одиночном клике
                    case 1:
                        pendingClick = setTimeout(function () {

                            let blockChanges = renderTrees.blockChanges;

                            // Если элемент на блоке изменений, то при клике на другой элемент закрываем блок изменений
                            // В противном случае скрываем подсписок у нажатого элемента
                            if (blockChanges.focus){
                                blockChanges.close();
                                $(currentElem).focus(); // Фокус на
                                blockChanges.focus = false;
                            } else {
                                line.hideShowSublist(currentElem);
                            }
                        },200);
                        break;

                    // При двойном клике
                    case 2:

                        // Показываем блок изменений
                        renderTrees.blockChanges.show(this);
                        break;
                }
            });

            // При нажатии клавиш на сфокусированном объекте
            this.elem.focus(function () {
                $(this).keyup(function (e) {

                    switch (e.keyCode){

                        // del
                        case 46:
                            renderTrees.blockChanges.del(this);
                            break;

                        // enter
                        case 13:
                            renderTrees.blockChanges.show(this);
                            break;

                        // space
                        case 32:
                            line.hideShowSublist(this);
                            break;
                    }
                });
            });
        },
    },

    // Блок изменений элемента из списка
    blockChanges: {

        // Необходимые переменные
        elem: '',
        input: '',
        saveButton: '',
        addButton: '',
        delButton: '',
        i: '',

        currentElem: '',

        focus: false,

        // Закрывает блок
        close: function () {
            this.elem.hide();
            $(this.currentElem).focus();
        },

        // Показывает блок
        show: function (currentElem) {

            let thisElem = $(currentElem);

            // Показать
            this.elem.show();

            // Переменные элемента
            let top = (thisElem.offset().top - $('#tree_1').offset().top) + (thisElem.height() - this.elem.height())/2;
            let left = thisElem.offset().left;

            // Переменные инпута
            let input = {
                width: (thisElem.children().width() < 200) ? 200 : thisElem.children().width() + 12, // 12 - произвольная величина выбранная на глаз
                fontFamily: thisElem.css('fontFamily'),
                fontSize: thisElem.css('fontSize'),
                text: thisElem.text(),
            };

            // Действия над блоком изменений
            this.elem.css({
                'top': top,
                'left': left - 2 // - 2 позволяет скрыть outline элемента находящегося под блоком изменений
            });

            // Действия над инпутом
            this.input.val(input.text);
            this.input.select();
            this.input.focus();
            this.focus = true;
            this.input.css({
                'width': input.width,
                'fontFamily' : input.fontFamily,
                'fontSize' : input.fontSize,
            });
        },

        // Сохранить значение пункта
        save: function () {
            let tree = renderTrees.tree;
            let elemText = renderTrees.getNames(renderTrees.currentElem).elem;
            let parentText = renderTrees.getNames(renderTrees.currentElem).parent;
            let inputValue = this.input.val();

            // Только если значение инпута отличается от первоначального текста
            if (inputValue !== elemText){
                renderTrees.operations('edit',tree,elemText,parentText,inputValue);
            }

            // Закрываем окно в любом случае
            this.close();

        },

        // Добавить подстроку
        add: function () {
            ++this.i;
            let tree = renderTrees.tree;
            let elemText = renderTrees.getNames(renderTrees.currentElem).elem;
            let parentText = renderTrees.getNames(renderTrees.currentElem).parent;
            let inputValue = this.input.val();

            // Все операции добавления
            function add() {
                renderTrees.operations('add',tree,elemText,parentText,inputValue);
                renderTrees.blockChanges.close();
            }

            // Если сработала функция добавления, то текст такой же как элемента, вероятно функция вызвана по ошибке
            if (inputValue === elemText){
                if (confirm(`Вы хотите добавить строку с тем же названием, что и у родителя? "${elemText}"`)){
                    // Небольшая задержка для комфортного наблюдения
                    setTimeout(function () {
                        add();
                    },300);
                }
            } else {
                add();
            }


        },

        // Удалить выбранный пункт
        del: function (currentElem) {

            let curElem = (currentElem) ? currentElem : renderTrees.currentElem;
            let tree = renderTrees.tree;
            let elemText = renderTrees.getNames(curElem).elem;
            let parentText = renderTrees.getNames(curElem).parent;

            if (confirm(`Удалить "${elemText}"?`)){
                // Закрываем окно
                renderTrees.blockChanges.close();

                // Скрываем элемент
                $(curElem).parent().slideUp();

                // Когда элемент скроется перерендериваем ветку
                setTimeout(function () {
                    renderTrees.operations('del',tree,elemText,parentText);
                }, 600);
            }

        },

        // Фокусировка на элементе с в данным селектором и текстом
        focusLine: function (selector,text) {
            $(selector + `:contains(${text})`).parent().focus();
        },

        // Инициализация переменных и событий
        init: function () {

            let blockChanges = this;

            this.elem = $('#change_1');
            this.input = $('#change__field_1');
            this.saveButton = $('#change__save_1');
            this.addButton = $('#change__add_1');
            this.delButton = $('#change__del_1');

            // Функции нажатия на кнопки
            this.saveButton.click(function () {
                blockChanges.save();
            });
            // this.addButton.unbind();
            this.addButton.click(function () {
                blockChanges.add();
            });
            this.delButton.click(function () {
                blockChanges.del();
            });

            // При нажатии enter происходит функция сохранения
            this.input.focus(function () {
                $(this).keyup(function (e) {
                    switch (e.keyCode) {
                        // enter
                        case 13:
                            blockChanges.save();
                            break;

                    }
                });
            });

            // Если esc блок изменений закрывается
            $(window).keyup(function (e) {
                switch (e.keyCode) {
                    // esc
                    case 27:
                        blockChanges.close();
                        break;
                }
            });

        },

        // Создает Html блока изменения
        render: function () {
            return `<div id="change_1" class="change">
                        <input id="change__field_1" class="change__field" value=""/>
                        <button id="change__save_1" title="Сохраняет название элементу" class="change__save">Сохранить</button>
                        <button id="change__add_1" title="Добавляет подэлемент. Название берет из значения текста" class="change__add">Добавить подстроку</button>
                        <button id="change__del_1" title="Удаляет текущий элемент. Значение текста никак не влияет" class="change__del">Удалить</button>
                        </div>`;
        },

    },

    // Принимает выбранный элемент, возвращает текст родителя и самого элемента
    getNames: function (currentElem) {
        return {
            parent: $(currentElem).parent().parent().parent().children('.line').text(),
            elem: $(currentElem).text(),
        };
    },

    // Возвращем тот же результут, что и getHtml, но без первой обертки <li></li>
    getHtmlBranch: function (objTree) {
        let html = this.getHtml(objTree);
        return html.slice(4,html.length - 5);
    },

    // Принимает объект древовидной структуры, возвращает код HTML
    getHtml: function (objTree) {
        // Проверяем один раз на наличие скилов и результат используем
        let skills = !!objTree.skills;
        let res = `<li><button class="line${(skills) ? ' parent' : ''}"><span>${objTree.name}</span></button>`;

        // Если есть skills, то создаем обертку ul и бежим по внутренностям
        if (skills) {
            res += `<ul class="list">`;
            for (let i = 0; objTree.skills[i]; ++i) {
                res += this.getHtml(objTree.skills[i]);
            }
            res += '</ul>';
        }
        res += '</li>';
        return res;
    },

    // Инициализируем переменные и события
    init: function () {

        // Инициализируем элементы
        this.blockChanges.init();
        this.line.init();

    },

    // Создает елементы HTML и инициализирует переменные
    render: function () {

        this.container.innerHTML = `<ul id="tree_1" class="tree">${this.getHtml(this.tree)}</ul>${this.blockChanges.render()}`;
        this.init();
    },


};


renderTrees.start(tree,"container_1");
