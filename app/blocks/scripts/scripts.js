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
    currentElem: '',
    start: function (obj,idContainer) {

        ++this.number;

        // Если в локальной истории что-то есть, то берем данные оттуда
        let localStorageTree = localStorage.getItem("tree_" + this.number);
        // this.tree = (localStorageTree) ? JSON.parse(localStorageTree) : obj;
        this.tree = obj;

        // Присваиваем контейнер и рендерим элементы по объекту
        this.container = document.getElementById(idContainer);
        this.render();
    },

    // Производит операции над объектом древовидной структуры. Добавляет, Редактирует, Удаляет
    operations: function (func,tree,newName,i) {
        let currentElem;
        let isRoot = i === undefined;
        let skills;
        switch (func){

            // Сохранение
            case 'save':
                if (isRoot){
                    tree.name = newName;
                } else {
                    tree.skills[i].name = newName;
                }
                this.currentElem.children[0].textContent = newName;
                break;

            // Добавление подстроки
            case 'add':
                if (isRoot){
                    skills = tree.skills;

                    // Если есть скилы, то добавляем в массив, если нет, то создаем массив
                    if (skills){
                        skills.push({name: newName});
                    } else {
                        tree.skills = [{name: newName}];
                    }

                    currentElem = this.currentElem.parentNode.parentNode;
                    this.currentElem.parentNode.parentNode.innerHTML = this.getHtml(tree);
                    this.currentElem = $(currentElem).children().children('.line');

                } else {
                    skills = tree.skills[i].skills;

                    // Если есть скилы, то добавляем в массив, если нет, то создаем массив
                    if (skills){
                        skills.push({name: newName});
                    } else {
                        tree.skills[i].skills = [{name: newName}];
                    }

                    // Рендерим родительскую ветку и переназначаем переменную выбранного элемента
                    currentElem = this.currentElem.parentNode.parentNode.childNodes[i];
                    this.currentElem.parentNode.parentNode.childNodes[i].innerHTML = this.getHtmlBranch(tree.skills[i]);
                    this.currentElem = $(currentElem).children('.line');
                }
                break;

            // Удаление
            case 'del':

                if (isRoot){

                    tree.name = 'Новая ветка';
                    delete tree.skills;
                    // Создаем элементы
                    this.render();
                    this.currentElem = $(this.container).children().children().children('.line');

                } else {

                    tree.skills.splice(i, 1);
                    // Если skills оказывается пустой, то и его удаляем
                    if (!tree.skills.length) { delete tree.skills; }

                    // Рендерим родительскую ветку и переназначаем переменную выбранного элемента
                    currentElem = this.currentElem.parentNode.parentNode.parentNode;
                    this.currentElem.parentNode.parentNode.parentNode.innerHTML = this.getHtmlBranch(tree);
                    this.currentElem = $(currentElem).children('.line');

                }
                break;
        }
        // Сохраняем в локальную историю
        localStorage.setItem("tree_" + this.number,JSON.stringify(this.tree, '', 2));
    },

    // Производит операции над объектом древовидной структуры. Добавляет, Редактирует, Удаляет
    search: function (func,tree,name,parent,newName) {
        // tree - объект древовидной структуры
        // name - параметр, который будет изменен
        // newName - новый параметр
        // parent - родитель, дабы исключить изменение параметра в другой ветке. Не слишком надежное решение, можно усовершенствовать, но в рамках учебного задания, достаточно

        // Останавливаем функцию, если нет какого-то из данных
        if (!tree || !name){ return; }

        // Если нет родителя, то это либо корневой элемент, либо недостаток данных и завершаем функцию
        if (!parent){

            if (tree.name === name){
                // Корневому элементу особые функции
                this.operations(func,tree,newName);
                return;

            }
            else { return; }
        }

        // Бежим по всем элементам списка
        for (let i = 0; tree.skills[i]; ++i){

            // Если найден элемент, то выполнем обозначенную операцию и завершаем функцию
            if (tree.skills[i].name === name && tree.name === parent){

                this.operations(func,tree,newName,i);
                return;
            }

            // Если есть подветка, ищем в подветке
            if (tree.skills[i].skills){ this.search(func,tree.skills[i],name,parent,newName); }
        }
    },

    // Элемент из списка (линия)
    line: {
        // Убирает/показывает под список, если он есть
        hideShowSublist: function (currentElem) {
            $(currentElem).parent().children('.list').slideToggle();
        },

        // Инициализирует переменные и события
        init: function () {
            let pendingClick = 0;
            let line = this;

            let container = $(renderTrees.container);

            // При клике
            container.on('click','.line',function (e) {

                // Текущий элемент
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
                                blockChanges.focus = false;
                            } else {
                                line.hideShowSublist(currentElem);
                            }
                            console.log('line 1');

                        },200);
                        break;

                    // При двойном клике
                    case 2:

                        // Показываем блок изменений
                        renderTrees.blockChanges.show(this);
                        console.log('line 2');

                        break;
                }

            });

            // При нажатии клавиш на сфокусированном объекте
            container.on('keyup','.line',function (e) {
                console.log('line_focus');

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
        focus: false,

        // Закрывает блок
        close: function (delayFocus) {
            this.elem.hide();
            setTimeout(function () {
                if (renderTrees.currentElem){
                    renderTrees.currentElem.focus();
                }
            },(delayFocus) ? delayFocus : 0);
        },

        // Показывает блок
        show: function (currentElem) {

            let thisElem = $(currentElem);

            // Показать
            this.elem.show();

            // Переменные элемента
            let top = (thisElem.offset().top - $('#tree_' + renderTrees.number).offset().top) + (thisElem.height() - this.elem.height())/2;
            let left = thisElem.offset().left;

            // Переменные инпута
            let input = {
                width: (thisElem.children().width() < 200) ? 200 : thisElem.children().width() + 12, // 200 и 12 - произвольные величины выбранные на глаз
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

            // Только если значение инпута отличается от первоначального текста и непустое значение
            if (inputValue !== elemText && inputValue){
                renderTrees.search('save',tree,elemText,parentText,inputValue);
            }

            // Закрываем окно в любом случае и возвращаем фокус на выбранный элемент
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
                renderTrees.search('add',tree,elemText,parentText,inputValue);
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
                // Скрываем элемент
                $(curElem).parent().slideUp();

                // Когда элемент скроется перерендериваем ветку
                setTimeout(function () {
                    renderTrees.search('del',tree,elemText,parentText);
                }, 600);

                // Закрываем окно
                renderTrees.blockChanges.close(600);
            }

        },

        // Инициализация переменных и событий
        init: function () {

            let blockChanges = this;

            this.elem = $('#change_' + renderTrees.number);
            this.input = $('#change__field_' + renderTrees.number);
            this.saveButton = $('#change__save_' + renderTrees.number);
            this.addButton = $('#change__add_' + renderTrees.number);
            this.delButton = $('#change__del_' + renderTrees.number);

            // Функции нажатия на кнопки
            this.saveButton.click(function () {
                console.log('save');
                blockChanges.save();
            });
            // this.addButton.unbind();
            this.addButton.click(function () {
                console.log('add');
                blockChanges.add();
            });
            this.delButton.click(function () {
                console.log('del');
                blockChanges.del();
            });

            // При нажатии enter происходит функция сохранения
            this.input.keyup(function (e) {
                    switch (e.keyCode) {
                        // enter
                        case 13:
                            console.log('input_focus');

                            blockChanges.save();
                            break;

                    }
            });

            // Если esc блок изменений закрывается
            $(window).keyup(function (e) {
                switch (e.keyCode) {
                    // esc
                    case 27:
                        console.log('window esc');

                        blockChanges.close();
                        break;
                }
            });

        },

        // Создает Html блока изменения
        render: function () {
            return `<div id="change_${renderTrees.number}" class="change">
                        <input id="change__field_${renderTrees.number}" class="change__field" value=""/>
                        <button id="change__save_${renderTrees.number}" title="Сохраняет название элементу" class="change__button change__save">Сохранить</button>
                        <button id="change__add_${renderTrees.number}" title="Добавляет подэлемент. Название берет из значения текста" class="change__button change__add">Добавить подстроку</button>
                        <button id="change__del_${renderTrees.number}" title="Удаляет текущий элемент. Значение текста никак не влияет" class="change__button change__del">Удалить</button>
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

        this.container.innerHTML = `<ul id="tree_${this.number}" class="tree">${this.getHtml(this.tree)}</ul>${this.blockChanges.render()}`;
        this.init();
    },


};


renderTrees.start(tree,"container_1");
