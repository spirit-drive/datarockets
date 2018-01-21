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

let treeFunc = {
    container: '',
    tree: '',
    start: function (tree,idElem) {

        // Если в локальной истории что-то есть, то берем данные оттуда
        let localStorageTree = localStorage.getItem("tree");
        // this.tree = (localStorageTree) ? JSON.parse(localStorageTree) : tree;
        this.tree = tree;

        // Присваиваем контейнер и рендерим элементы по объекту
        this.container = document.getElementById(idElem);
        this.render();
    },

    // Произодит операции над объектом древовидной структуры. Добавляет, Редактирует, Удаляет
    operations: function (func,tree,name,parent,newName) {
        // tree - объект древовидной структуры
        // name - параметр, который будет изменен
        // newName - новый параметр
        // parent - родитель, дабы исключить изменение параметра в другой ветке. Не слишком надежное решение, можно усовершенствовать, но в рамках учебного задания, достаточно

        // Останавливаем функцию, если нет какого-то из данных
        if (!tree || !name || !parent){ return; }

        // Бежим по всем элементам списка
        for (let i = 0; tree.skills[i]; ++i){

            // Если найден элемент, то выполнем операцию и завершаем функцию
            if (tree.skills[i].name === name && tree.name === parent){
                switch (func){

                    case 'edit':
                        tree.skills[i].name = newName;
                        break;

                    case 'add':
                        let skills = tree.skills[i].skills;
                        if (skills){
                            skills.push({name: newName});
                        } else {
                            tree.skills[i].skills = [{name: newName}];
                        }
                        break;

                    case 'del':
                    case 'delete':
                        tree.skills.splice(i, 1);
                        if (!tree.skills.length) {
                            delete tree.skills;
                        }
                        break;

                    default:
                        tree.skills[i].name = newName;
                }

                // Рендерим элементы, сохраняем в локальную историю, завершем функцию
                this.render();
                localStorage.setItem("tree",JSON.stringify(this.tree, '', 2));
                return;
            }

            // Если есть скилы, то запускаем очередной поиск
            if (tree.skills[i].skills){
                this.operations(func,tree.skills[i],name,parent,newName);
            }
        }
    },

    // Создает елементы HTML
    render: function () {

        this.container.innerHTML = `<ul id="tree_1" class="tree">${this.getHtml(this.tree)}</ul>${this.blockChange.render()}`;
        this.init();
    },

    // Элемент из списка (линия)
    line: {
        elem: '',
        hideShowSublist: function (callingContext) {
            $(callingContext).parent().children('.list').slideToggle();
        },
        init: function () {
            this.elem = $('.line');
        },
    },

    // Блок изменений элемента из списка
    blockChange: {
        elem: '',
        input: '',
        saveButton: '',
        addButton: '',
        delButton: '',

        currentElem: '',

        focus: false,
        render: function () {
            return `<div id="change_1" class="change">
                        <input id="change__field_1" class="change__field" value=""/>
                        <button id="change__save_1" class="change__save">Сохранить</button>
                        <button id="change__add_1" class="change__add">Добавить подстроку</button>
                        <button id="change__del_1" class="change__del">Удалить</button>
                        </div>`;
        },
        close: function () {
            this.elem.hide();
        },
        show: function (currentElem) {

            this.currentElem = currentElem;

            let thisElem = $(currentElem);

            // Показать
            this.elem.show();

            // Переменные элемента
            let top = (thisElem.offset().top - $('#tree_1').offset().top) + (thisElem.height() - this.elem.height())/2;
            let left = thisElem.offset().left;

            // Переменные инпута
            let input = {
                width: thisElem.children().width(),
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
            this.input.focus();
            this.focus = true;
            this.input.val(input.text);
            this.input.css({
                'width': input.width + 12, // 12 - произвольная величина выбранная на глаз
                'fontFamily' : input.fontFamily,
                'fontSize' : input.fontSize,
            });
        },
        save: function () {
            let tree = treeFunc.tree;
            let elemText = treeFunc.getNames(this.currentElem).elem;
            let parentText = treeFunc.getNames(this.currentElem).parent;
            let inputValue = this.input.val();

            // Только если значение инпута отличается от первоначального текста
            if (inputValue !== elemText){
                treeFunc.operations('edit',tree,elemText,parentText,inputValue);
            }

            // Закрываем окно в любом случае
            this.close();

        },
        add: function () {
            let tree = treeFunc.tree;
            let elemText = treeFunc.getNames(this.currentElem).elem;
            let parentText = treeFunc.getNames(this.currentElem).parent;
            let inputValue = this.input.val();

            treeFunc.operations('add',tree,elemText,parentText,inputValue);

            // Закрываем окно в любом случае
            this.close();


        },
        del: function () {
            let tree = treeFunc.tree;
            let elemText = treeFunc.getNames(this.currentElem).elem;
            let parentText = treeFunc.getNames(this.currentElem).parent;

            if (confirm(`Удалить "${elemText}"?`)){
                // Закрываем окно
                this.close();

                $(this.currentElem).parent().slideUp();
                setTimeout(function () {
                    treeFunc.operations('del',tree,elemText,parentText);
                }, 600);
            }

        },
        init: function () {

            let blockChange = this;

            this.elem = $('#change_1');
            this.input = $('#change__field_1');
            this.saveButton = $('#change__save_1');
            this.addButton = $('#change__add_1');
            this.delButton = $('#change__del_1');

            this.saveButton.click(function () {
                blockChange.save();
            });
            this.addButton.click(function () {
                blockChange.add();
            });
            this.delButton.click(function () {
                blockChange.del();
            });

            // При нажатии enter происходит функция сохранения
            this.input.focus(function () {
                $(this).keyup(function (e) {
                    switch (e.keyCode) {
                        // enter
                        case 13:
                            blockChange.save();
                            break;

                    }
                });
            });

            // Если
            $(window).keyup(function (e) {
                switch (e.keyCode) {
                    // esc
                    case 27:
                        blockChange.close();
                        break;
                }
            });

        },

    },

    // Инициализируем переменные и события
    init: function () {

        // Инициализируем элементы
        this.blockChange.init();
        this.line.init();

        // Необходимые переменные
        let callingContext = this;
        let pendingClick = 0;

        // При клике
        this.line.elem.click(function (e) {

            // Элемент вызова
            let elemCall = this;

            // При втором клике обнаружит, что уже есть отложенный клик, отменит действие и выполнит функции двойного клика
            if (pendingClick) {
                clearTimeout(pendingClick);
                pendingClick = 0;
            }

            switch(e.originalEvent.detail){

                // При одиночном клике
                case 1:
                    pendingClick = setTimeout(function () {

                        let blockChange = callingContext.blockChange;

                        // Если элемент на блоке изменений, то при клике на другой элемент закрываем блок изменений
                        // В противном случае скрываем подсписок у нажатого элемента
                        if (blockChange.focus){
                            blockChange.close();
                            blockChange.focus = false;
                        } else {
                            callingContext.line.hideShowSublist(elemCall);
                        }
                    },200);
                    break;
                // При двойном клике
                case 2:

                    // Показываем блок изменений
                    callingContext.blockChange.show(this);
                    break;
            }
        });

        // При нажатии клавиш на сфокусированном объекте
        this.line.elem.focus(function () {
            $(this).keyup(function (e) {
                let param = callingContext.getNames(this);

                console.log(e.keyCode);

                switch (e.keyCode){

                    // del
                    case 46:
                        if (confirm(`Удалить "${param.elem}"?`)){
                            $(this).parent().slideUp();
                            setTimeout(function () {
                                callingContext.operations('del',callingContext.tree,param.elem,param.parent);
                            }, 600);
                        }
                        break;

                    // enter
                    case 13:
                        callingContext.blockChange.show(this);
                        break;

                }
            });
        });
    },

    // Принимает контекст вызова, возвращает текст родителя и самого элемента
    getNames: function (context) {
        return {
            parent: $(context).parent().parent().parent().children('.line').text(),
            elem: $(context).text(),
        };
    },

    // Принимает объект древовидной структуры, возвращает код HTML
    getHtml: function (tree) {
        // Проверяем один раз на наличие скилов и результат используем
        let skills = !!tree.skills;
        let res = `<li><button class="line${(skills) ? ' parent' : ''}"><span>${tree.name}</span></button>`;

        // Если есть skills, то создаем обертку ul и бежим по внутренностям
        if (skills) {
            res += '<ul class="list">';
            for (let i = 0; tree.skills[i]; ++i) {
                res += this.getHtml(tree.skills[i]);
            }
            res += '</ul>';
        }
        res += '</li>';
        return res;
    }

};

treeFunc.start(tree,"container");
