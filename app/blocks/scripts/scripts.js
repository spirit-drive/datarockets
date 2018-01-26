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
};
let tree2 = {
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
};

let renderTrees = {
    number: 0,
    id: null,
    container: [],
    tree: [],
    currentElem: null,
    start: function (obj,idContainer) {

        ++this.number;

        // Если в локальной истории что-то есть, то берем данные оттуда
        let localStorageTree = localStorage.getItem("tree_" + this.number);
        // this.tree = (localStorageTree) ? JSON.parse(localStorageTree) : obj;
        this.tree.push(obj);

        // Присваиваем контейнер и рендерим элементы по объекту
        this.container.push(document.getElementById(idContainer));
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
                    this.currentElem = currentElem.childNodes[0].childNodes[0];

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
                    this.currentElem = currentElem.childNodes[0];

                }
                break;

            // Удаление
            case 'del':

                if (isRoot){

                    tree.name = 'Новая ветка';
                    delete tree.skills;
                    // Создаем элементы
                    this.render();
                    this.currentElem = this.container[this.id].childNodes[0].childNodes[0].childNodes[0].childNodes[0];

                } else {

                    tree.skills.splice(i, 1);
                    // Если skills оказывается пустой, то и его удаляем
                    let isSkills = !tree.skills.length;
                    if (isSkills) {
                        delete tree.skills;
                    }

                    // Рендерим родительскую ветку и переназначаем переменную выбранного элемента
                    currentElem = this.currentElem.parentNode.parentNode.parentNode;
                    this.currentElem.parentNode.parentNode.parentNode.innerHTML = this.getHtmlBranch(tree);

                    // Если скилов не оставалось, значит и детей не оставалось и текущий элемент - родитель
                    if (isSkills) {
                        this.currentElem = currentElem.childNodes[0];

                    // В противном случае текущий элемент - следующий в списке, или предыдущий, если удаленный элемент был последним
                    } else {
                        let j = (i === currentElem.childNodes[1].childNodes.length) ? i - 1 : i;
                        this.currentElem = currentElem.childNodes[1].childNodes[j].childNodes[0];
                    }
                }
                break;
        }
        // Сохраняем в локальную историю
        localStorage.setItem("tree_" + this.id,JSON.stringify(this.tree[this.id], '', 2));
    },

    // Производит операции над объектом древовидной структуры. Добавляет, Редактирует, Удаляет
    search: function (func,tree,name,parent,newName) {
        // tree - объект древовидной структуры
        // name - параметр, который будет изменен
        // newName - новый параметр
        // parent - родитель, дабы исключить изменение параметра в другой ветке. Не слишком надежное решение, можно усовершенствовать, но в рамках учебного задания, достаточно

        // Останавливаем функцию, если нет какого-то из данных
        if (!tree || !name){ return; }

        // Если текст родителя и дитя совпадает, значит корневой элемент
        if (name === parent && tree.name === name){
            // Корневому элементу особые функции
            this.operations(func,tree,newName);
            return;
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
        hideShowSublist: function () {
            $(renderTrees.currentElem).parent().children('.list').slideToggle();
        },

        // Инициализирует переменные и события
        init: function () {
            let pendingClick = 0;
            let line = this;
            // Если еще не определен id то берем номер количество вызовов .start
            let index = (renderTrees.id !== null) ? renderTrees.id : renderTrees.number - 1;

            let container = $(renderTrees.container[index]);

            // Удаляем все обработчики событий что были до этого
            container.off();

            // При клике
            container.on('click','.line',function (e) {

                // Установить текущий элемент
                renderTrees.currentElem = this;

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
                                line.hideShowSublist();
                            }

                        },200);
                        break;

                    // При двойном клике
                    case 2:
                        // Показываем блок изменений
                        renderTrees.blockChanges.show();
                        break;
                }

            });

            // При нажатии клавиш на сфокусированном объекте
            container.on('keyup','.line',function (e) {
                switch (e.keyCode){

                    // del
                    case 46:
                        renderTrees.blockChanges.del();
                        break;

                    // enter
                    case 13:
                        renderTrees.blockChanges.show();
                        break;

                    // space
                    case 32:
                        line.hideShowSublist();
                        break;
                }
            });

            // При фокусировании переменной currentElem присваиваем текущий элемент
            container.on('focus','.line',function () {
                renderTrees.currentElem = this;
                renderTrees.id = $(this).parents('.tree').attr('id').match(/\d+/g)[0] - 1;
            });
        },
    },

    // Блок изменений элемента из списка
    blockChanges: {

        // Необходимые переменные
        elem: [],
        input: [],
        saveButton: [],
        addButton: [],
        delButton: [],
        focus: false,

        closeAll: function () { for (let elem of this.elem){ elem.hide(); } },

        // Закрывает блок
        close: function (delayFocus) {
            this.closeAll();
            // Задержка потому что элемент может рендерится с задержкой,
            // и если мы не задержим функцию, то фокус встанет на уже не существующий элемент
            setTimeout(function () {
                renderTrees.currentElem.focus();
            // По умолчанию 100 мс это позволяет при задержке enter открывать повторно окно редактирования, либо при коротком нажатии не открывать
            },(delayFocus) ? delayFocus : 100);
        },

        // Показывает блок
        show: function () {

            this.closeAll();

            let thisElem = $(renderTrees.currentElem);

            // Показать
            this.elem[renderTrees.id].show();

            // Переменные элемента
            let top = (thisElem.offset().top - $('#tree_' + (renderTrees.id + 1)).offset().top) + (thisElem.height() - this.elem[renderTrees.id].height())/2;
            let left = thisElem.offset().left;

            // Переменные инпута
            let input = {
                width: (thisElem.children().width() < 200) ? 200 : thisElem.children().width() + 12, // 200 и 12 - произвольные величины выбранные на глаз
                fontFamily: thisElem.css('fontFamily'),
                fontSize: thisElem.css('fontSize'),
                text: thisElem.text(),
            };

            // Действия над блоком изменений
            this.elem[renderTrees.id].css({
                'top': top,
                'left': left - 2 // - 2 позволяет скрыть outline элемента находящегося под блоком изменений
            });

            // Действия над инпутом
            this.input[renderTrees.id].val(input.text);
            this.input[renderTrees.id].select();
            this.focus = true;
            this.input[renderTrees.id].css({
                'width': input.width,
                'fontFamily' : input.fontFamily,
                'fontSize' : input.fontSize,
            });
        },

        // Сохранить значение пункта
        save: function () {
            let tree = renderTrees.tree[renderTrees.id];
            let names = renderTrees.getNames();
            let elemText = names.elem;
            let parentText = names.parent;
            let inputValue = this.input[renderTrees.id].val();

            // Только если значение инпута отличается от первоначального текста и непустое значение
            if (inputValue !== elemText && inputValue){
                renderTrees.search('save',tree,elemText,parentText,inputValue);
            }

            // Закрываем окно в любом случае и возвращаем фокус на выбранный элемент
            this.close();
        },

        // Добавить подстроку
        add: function () {
            let tree = renderTrees.tree[renderTrees.id];
            let names = renderTrees.getNames();
            let elemText = names.elem;
            let parentText = names.parent;
            let inputValue = this.input[renderTrees.id].val();

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
                } else {
                    // Задержка для исключения длительгого нажатия esc и установки фокуса на input
                    setTimeout(function () {
                        renderTrees.blockChanges.show();
                    },300);
                }
            } else {
                add();
            }


        },

        // Удалить выбранный пункт
        del: function () {

            let tree = renderTrees.tree[renderTrees.id];
            let names = renderTrees.getNames();
            let elemText = names.elem;
            let parentText = names.parent;

            if (confirm(`Удалить "${elemText}"?`)){
                // Скрываем элемент
                $(renderTrees.currentElem).parent().slideUp();

                // Когда элемент скроется перерендериваем ветку
                setTimeout(function () {
                    renderTrees.search('del',tree,elemText,parentText);
                }, 600);

                // Закрываем окно
                renderTrees.blockChanges.close(600);
            } else {
                // Задержка для исключения длительгого нажатия esc и для установки фокуса на input
                setTimeout(function () {
                    renderTrees.blockChanges.show();
                },300);
            }

        },

        wasNoElem: function (index) {
            for (let i = 0; i < this.elem.length; ++i){
                // console.log(this.elem[i].length);
                if (parseInt(this.elem[i].attr('id').match(/\d+/)[0]) === index) {
                    return false;
                }
            }
            return true;
        },

        // Инициализация переменных и событий
        init: function () {

            let blockChanges = this;
            let index = (renderTrees.id !== null) ? renderTrees.id + 1 : renderTrees.number;

            console.log(this.elem);
            if (this.wasNoElem(index)) {
                this.elem.push($(`#change_${index}`));
                this.input.push($(`#change__field_${index}`));
                this.saveButton.push($(`#change__save_${index}`));
                this.addButton.push($(`#change__add_${index}`));
                this.delButton.push($(`#change__del_${index}`));
            } else {
                this.elem[index - 1] = ($(`#change_${index}`));
                this.input[index - 1] = ($(`#change__field_${index}`));
                this.saveButton[index - 1] = ($(`#change__save_${index}`));
                this.addButton[index - 1] = ($(`#change__add_${index}`));
                this.delButton[index - 1] = ($(`#change__del_${index}`));
            }

            // Функции нажатия на кнопки
            this.saveButton[index - 1].click(function () {
                blockChanges.save();
            });
            this.addButton[index - 1].click(function () {
                blockChanges.add();
            });
            this.delButton[index - 1].click(function () {
                blockChanges.del();
            });

            // При нажатии enter происходит функция сохранения
            this.input[index - 1].keyup(function (e) {
                    switch (e.keyCode) {
                        // enter
                        case 13:
                            blockChanges.save();
                            break;

                    }
            });

            // Если esc блок изменений закрывается
            $(window).off('keyup'); // Во избежание вызова несколько раз данной функции
            $(window).keyup(function (e) {
                switch (e.keyCode) {
                    // esc
                    case 27:
                        blockChanges.close(0);
                        break;
                }
            });


        },

        // Создает Html код блока изменений
        render: function () {
            return `<div id="change_${renderTrees.number}" class="change">
                        <input id="change__field_${renderTrees.number}" class="change__field" value=""/>
                        <button id="change__save_${renderTrees.number}" title="Сохраняет название элементу" class="change__button change__save">Сохранить</button>
                        <button id="change__add_${renderTrees.number}" title="Добавляет подэлемент. Название берет из значения инпута" class="change__button change__add">Добавить подстроку</button>
                        <button id="change__del_${renderTrees.number}" title="Удаляет текущий элемент. Значение инпута никак не влияет" class="change__button change__del">Удалить</button>
                        </div>`;
        },

    },

    // Возвращает текст родителя и самого элемента
    getNames: function () {
        return {
            elem: this.currentElem.textContent,
            parent: $(this.currentElem).parent().parent().parent().children('.line').text() || this.currentElem.textContent,
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
        let index = (this.id !== null) ? this.id : this.number - 1;
        this.container[index].innerHTML = `<div class="tree-block"><ul id="tree_${index + 1}" class="tree">${this.getHtml(this.tree[index])}</ul>${this.blockChanges.render()}</div>`;
        this.init();
    },


};


renderTrees.start(tree,"container_1");
renderTrees.start(tree1,"container_2");
renderTrees.start(tree2,"container_3");
