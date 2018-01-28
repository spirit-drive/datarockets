"use strict";
let renderTrees = {
    count: 0,
    index: null,
    container: [],
    arrayTreesObj: [],
    currentElem: null,

    // Принимает начальные данные, запускает все функции
    start (objTree,idContainer) {

        // Проверка на валидность данных. Если не проходит проверку, завершаем функцию
        let check = this.inputValidation(objTree,idContainer);
        if (!check) { return; }

        // Увеличиваем переменную количества вызовов
        ++this.count;

        // Если в локальной истории что-то есть, то берем данные оттуда
        let localStorageTree = localStorage.getItem(`tree_${this.count}`);
        this.arrayTreesObj.push((localStorageTree) ? JSON.parse(localStorageTree) : objTree);

        // Присваиваем контейнер и рендерим элементы по объекту
        this.container.push(check);
        this.render();
    },

    // Принимает входные данные. Если они не валидны, выкидывает сообщение в консоль и возвращает false иначе возвращает объект контейнера
    inputValidation (treeInput,idInput) {
        if (typeof treeInput !== 'object'){
            console.log(`${treeInput} - не является объектом. \n"objTree" - это объект вида:\n {\n  name: 'name',\n  skills:\n    [\n      {\n        name: 'name'\n      }\n    ]\n  }`);
            return false;
        }
        if (typeof idInput !== 'string'){
            console.log(`${idInput} - не является строкой. \n"idContainer" - это id блока, внутри которого Вы хотите создать дерево`);
            return false;
        }
        if (!("name" in treeInput)){
            console.log(`${treeInput} - не является валидным объектом. \n"objTree" - это объект вида:\n {\n  name: 'name',\n  skills:\n    [\n      {\n        name: 'name'\n      }\n    ]\n  }`);
            return false;
        }
        if (!document.getElementById(idInput)){
            console.log(`На странице не существует элемента и с id "${idInput}". \nПроверьте правильность написания id и/или наличие такого элемента на данной странице`);
            return false;
        }
        return document.getElementById(idInput);

    },

    // Производит операции над объектом древовидной структуры. Добавляет, Редактирует, Удаляет
    operations (operation,operationsTreeObj,operationsNewName,operationsIndex) {
        // operation - вид операции, которую нужно выполнить
        // operationsTreeObj - объект древовидной структуры
        // operationsNewName - новое имя
        // operationsIndex - индекс нужного элемента в массиве

        // Останавливаем функцию, если нет обязательных данных
        if (!operation || !operationsTreeObj){
            console.log('Недостаточно данных. Функция "operations" остановлена');
            return;
        }

        let currentElem;
        let isRoot = operationsIndex === undefined;
        let skills;

        switch (operation){

            // Сохранение
            case 'save':
                if (isRoot){
                    operationsTreeObj.name = operationsNewName;
                } else {
                    operationsTreeObj.skills[operationsIndex].name = operationsNewName;
                }
                this.currentElem.children[0].textContent = operationsNewName;
                break;

            // Добавление подстроки
            case 'add':
                if (isRoot){
                    skills = operationsTreeObj.skills;

                    // Если есть скилы, то добавляем в массив, если нет, то создаем массив
                    if (skills){
                        skills.push({name: operationsNewName});
                    } else {
                        operationsTreeObj.skills = [{name: operationsNewName}];
                    }

                    currentElem = this.currentElem.parentNode.parentNode;
                    this.currentElem.parentNode.parentNode.innerHTML = this.getHtml(operationsTreeObj);
                    this.currentElem = currentElem.childNodes[0].childNodes[0];

                } else {
                    skills = operationsTreeObj.skills[operationsIndex].skills;

                    // Если есть скилы, то добавляем в массив, если нет, то создаем массив
                    if (skills){
                        skills.push({name: operationsNewName});
                    } else {
                        operationsTreeObj.skills[operationsIndex].skills = [{name: operationsNewName}];
                    }

                    // Рендерим родительскую ветку и переназначаем переменную выбранного элемента
                    currentElem = this.currentElem.parentNode.parentNode.childNodes[operationsIndex];
                    this.currentElem.parentNode.parentNode.childNodes[operationsIndex].innerHTML = this.getHtmlBranch(operationsTreeObj.skills[operationsIndex]);
                    this.currentElem = currentElem.childNodes[0];

                }
                break;

            // Удаление
            case 'del':

                if (isRoot){

                    operationsTreeObj.name = 'New tree';
                    delete operationsTreeObj.skills;
                    // Создаем элементы
                    this.render();
                    this.currentElem = this.container[this.index].childNodes[0].childNodes[0].childNodes[0].childNodes[0];

                } else {

                    // Удаляем из дерева
                    operationsTreeObj.skills.splice(operationsIndex, 1);

                    // Если skills оказывается пустой, то и его удаляем
                    let isSkills = !operationsTreeObj.skills.length;
                    if (isSkills) {
                        delete operationsTreeObj.skills;
                    }

                    // Рендерим родительскую ветку и переназначаем переменную выбранного элемента
                    currentElem = this.currentElem.parentNode.parentNode.parentNode;
                    this.currentElem.parentNode.parentNode.parentNode.innerHTML = this.getHtmlBranch(operationsTreeObj);

                    // Если скилов не оставалось, значит и детей не оставалось и текущий элемент - родитель
                    if (isSkills) {
                        this.currentElem = currentElem.childNodes[0];

                        // В противном случае текущий элемент - следующий в списке, или предыдущий, если удаленный элемент был последним
                    } else {
                        let operationsJ = (operationsIndex === currentElem.childNodes[1].childNodes.length) ? operationsIndex - 1 : operationsIndex;
                        this.currentElem = currentElem.childNodes[1].childNodes[operationsJ].childNodes[0];
                    }
                }
                break;
        }

        // Сохраняем в локальную историю
        localStorage.setItem(`tree_${this.index + 1}`,JSON.stringify(this.arrayTreesObj[this.index], '', 2));
    },

    // Находит заданный узел в объекте древовидной структуры и передает данные функции операций
    search (searchFunc,searchTreeObj,searchName,searchParent,searchNewName) {
        // searchFunc - вид функции, которую нужно выполнить
        // searchTreeObj - объект древовидной структуры
        // searchName - параметр, который будет изменен
        // searchNewName - новый параметр
        // searchParent - родитель, дабы исключить изменение параметра в другой ветке. Не слишком надежное решение, можно усовершенствовать, но в рамках учебного задания, достаточно

        // Останавливаем функцию, если нет обязательных данных
        if (!searchFunc || !searchTreeObj || !searchName){
            console.log('Недостаточно данных. Функция "search" остановлена');
            return;
        }

        // Если текст родителя отсутствует, значит это корневой элемент
        if (!searchParent && searchTreeObj.name === searchName){
            // Корневому элементу особые функции. Последний аргумент не передается
            this.operations(searchFunc,searchTreeObj,searchNewName);
            return;
        }

        // Бежим по всем элементам списка
        for (let i = 0; i < searchTreeObj.skills.length; ++i){

            // Если текст элеменра и родителя соответствуют поиску, то выполнем обозначенную операцию и завершаем функцию
            if (searchTreeObj.skills[i].name === searchName && searchTreeObj.name === searchParent){

                this.operations(searchFunc,searchTreeObj,searchNewName,i);
                return;
            }

            // Если функция еще не нашла результат и есть подветка, ищем в подветке
            if (searchTreeObj.skills[i].skills){
                this.search(searchFunc,searchTreeObj.skills[i],searchName,searchParent,searchNewName);
            }
        }
    },

    // Элемент из списка (линия)
    line: {

        // Убирает/показывает подветки, если они есть
        hideShowSublist () {
            $(renderTrees.currentElem).parent().children('.tree-space__list').slideToggle();
        },

        // Инициализирует переменные и события
        init () {
            let pendingClick = 0;
            let line = this;
            // Если еще не определен index то берем номер количество вызовов .start
            let index = (renderTrees.index === null) ? renderTrees.count - 1  : renderTrees.index;

            let container = $(renderTrees.container[index]);

            // Удаляем все обработчики событий что были до этого
            container.off('click.line keyup.line focus.line');

            // При клике
            container.on('click.line','.tree-space__line',function(e) {

                // Установить текущий элемент
                renderTrees.currentElem = this;

                // При втором клике обнаружит, что уже есть отложенный клик, отменит действие одинарного клика и выполнит функции двойного клика
                if (pendingClick) {
                    clearTimeout(pendingClick);
                    pendingClick = 0;
                }

                switch(e.originalEvent.detail){

                    // При одиночном клике
                    case 1:
                        pendingClick = setTimeout(() => {

                            let blockChanges = renderTrees.blockChanges;

                            // Если фокус на блоке изменений, то при клике на другой элемент закрываем блок изменений
                            // В противном случае скрываем подсписок у нажатого элемента
                            if (blockChanges.focus){
                                blockChanges.focus = false;
                            } else {
                                line.hideShowSublist();
                            }

                        },200);
                        break;

                    // При двойном клике
                    case 2:
                        // Показываем блок изменений
                        renderTrees.blockChanges.open();
                        break;
                }

            });

            // При нажатии клавиш на сфокусированном объекте
            container.on('keyup.line','.tree-space__line',(e) => {
                switch (e.keyCode){

                    // del
                    case 46:
                        renderTrees.blockChanges.del();
                        break;

                    // enter
                    case 13:
                        renderTrees.blockChanges.open();
                        break;

                    // space
                    case 32:
                        this.hideShowSublist();
                        break;
                }
            });

            // При фокусировании переменной currentElem присваиваем текущий элемент
            container.on('focus.line','.tree-space__line',function () {
                renderTrees.currentElem = this;
                renderTrees.index = $(this).parents('.tree-space__tree').attr('id').match(/\d+/g)[0] - 1;
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

        // Пробегет по всему массиву, содержащему блоки изменений для каждого дерева и закрывает эти блоки
        closeAll () { for (let elem of this.elem){ elem.hide(); } },

        // Стандартная функция закрытия блока изменений
        close (delayFocus) {

            this.closeAll();
            // Задержка потому что элемент может рендерится с задержкой,
            // и если мы не задержим функцию, то фокус может встать на уже не существующий элемент
            setTimeout(() => {
                renderTrees.currentElem.focus();
                // По умолчанию 100 мс это позволяет при при коротком нажатии не открывать блок редактирования, либо длинном нажатии enter открывать повторно
            },(delayFocus) ? delayFocus : 100);
        },

        // Показывает блок
        open () {
            // Закрыть все блоки
            this.closeAll();
            // Показать нужный блок
            this.elem[renderTrees.index].show();

            let currentElem = $(renderTrees.currentElem);

            // Переменные элемента
            let top = currentElem.position().top + (currentElem.height() - this.elem[renderTrees.index].height())/2;
            let left = currentElem.position().left;

            // Переменные инпута
            let input = {
                width: (currentElem.children().width() < 200) ? 200 : currentElem.children().width() + 12, // 200 и 12 - произвольные величины выбранные на глаз
                fontFamily: currentElem.css('fontFamily'),
                fontSize: currentElem.css('fontSize'),
                text: currentElem.text(),
            };

            // Действия над блоком изменений
            this.elem[renderTrees.index].css({
                'top': top,
                'left': left - 2 // - 2 позволяет скрыть outline элемента находящегося под блоком изменений
            });

            // Действия над инпутом
            this.input[renderTrees.index].val(input.text);
            this.input[renderTrees.index].select();
            this.focus = true;
            this.input[renderTrees.index].css({
                'width': input.width,
                'fontFamily' : input.fontFamily,
                'fontSize' : input.fontSize,
            });
        },

        // Сохранить значение пункта
        save () {
            let tree = renderTrees.arrayTreesObj[renderTrees.index];
            let elemText = renderTrees.getNames().elem;
            let parentText = renderTrees.getNames().parent;
            let inputValue = this.input[renderTrees.index].val();

            // Сохраняем только если значение инпута отличается от первоначального текста или непустое значение
            if (inputValue !== elemText && inputValue){
                renderTrees.search('save',tree,elemText,parentText,inputValue);
            }

            // Закрываем окно в любом случае
            this.close();
        },

        // Добавить подстроку
        add () {
            let tree = renderTrees.arrayTreesObj[renderTrees.index];
            let elemText = renderTrees.getNames().elem;
            let parentText = renderTrees.getNames().parent;
            let inputValue = this.input[renderTrees.index].val();

            // Общая операция добавления
            let add = () => {
                renderTrees.search('add',tree,elemText,parentText,inputValue);
                this.close();
            };

            // Если сработала функция добавления, то текст такой же как элемента, вероятно функция вызвана по ошибке
            if (inputValue === elemText){
                if (confirm(`Вы хотите добавить строку с тем же названием, что и у родителя? "${elemText}"`)){
                    // Небольшая задержка для комфортного наблюдения
                    setTimeout(() => {
                        add();
                    },300);
                } else {
                    // Задержка для исключения длительгого нажатия esc и установки фокуса на input
                    setTimeout(() => {
                        renderTrees.blockChanges.open();
                    },300);
                }
            } else {
                add();
            }


        },

        // Удалить выбранный пункт
        del () {

            let tree = renderTrees.arrayTreesObj[renderTrees.index];
            let elemText = renderTrees.getNames().elem;
            let parentText = renderTrees.getNames().parent;

            if (confirm(`Удалить "${elemText}"?`)){
                // Скрываем элемент
                $(renderTrees.currentElem).parent().slideUp();

                // Когда элемент скроется перерендериваем ветку
                setTimeout(() => {
                    renderTrees.search('del',tree,elemText,parentText);
                }, 600);

                // Закрываем окно
                renderTrees.blockChanges.close(600);
            } else {
                // Задержка для исключения длительгого нажатия esc и для установки фокуса на input
                setTimeout(() => {
                    renderTrees.blockChanges.open();
                },300);
            }

        },

        // Принимает индекс и сравнивает его с id элемента, если нет таких элементов, возвращает true, в противном случае false
        isNotElem (index) {
            for (let elem of this.elem){
                if (parseInt(elem.attr('id').match(/\d+/)[0]) === index) {
                    return false;
                }
            }
            return true;
        },

        // Инициализирует элементы блока изменений в зависимости от того, создан блок при загрузке страницы или же при удалении всего дерева и создания нового
        initElements (index){

            let domElements = [
                $(`#tree-space__change_${index}`),
                $(`#change__field_${index}`),
                $(`#change__save_${index}`),
                $(`#change__add_${index}`),
                $(`#change__del_${index}`),
            ];

            let elements = [
                this.elem,
                this.input,
                this.saveButton,
                this.addButton,
                this.delButton,
            ];

            // Разные циклы в зависимости от результата проверки
            if (this.isNotElem(index)) {
                elements.forEach((elem,i)=>{
                    elem.push(domElements[i]);
                });
            } else {
                elements.forEach((elem,i)=>{
                    elem[index - 1] = domElements[i];
                });
            }
        },

        // Инициализация переменных и событий
        init () {

            let index = (renderTrees.index === null) ? renderTrees.count : renderTrees.index + 1;
            let pendingClick = 0;
            let elem = $('.tree-space__change');

            // Инициализация элементов блока изменений
            this.initElements(index);

            // Кнопки и инпут не требуют снятия предыдущих обработчиков событий, т.к. инициализация происходит только при удалении всего дерева и создания нового, но во время этого процесса и блок изменений создается новый
            // Функции нажатия на кнопки
            this.saveButton[index - 1].click(() => {
                this.save();
            });
            this.addButton[index - 1].click(() => {
                this.add();
            });
            this.delButton[index - 1].click(() => {
                this.del();
            });

            // При нажатии enter происходит функция сохранения
            this.input[index - 1].keyup((e) => {
                switch (e.keyCode) {
                    // enter
                    case 13:
                        this.save();
                        break;

                }
            });

            // Если esc блок изменений закрывается
            $(window).off('keyup.blockChange'); // Во избежание вызова данной функции несколько раз
            $(window).on('keyup.blockChange',(e) => {
                switch (e.keyCode) {
                    // esc
                    case 27:
                        this.close(0);
                        break;
                }
            });

            // Если нажать в любое место окна, закрывается блок изменений
            $(window).off('click.window-block');
            $(window).on('click.window-block',(e) => {
                // При втором клике обнаружит, что уже есть отложенный клик, отменит действие одинарного клика и выполнит функции двойного клика
                if (pendingClick) {
                    clearTimeout(pendingClick);
                    pendingClick = 0;
                }

                switch(e.originalEvent.detail){
                    case 1:
                        pendingClick = setTimeout(() => {
                            this.closeAll();
                        },200);
                        break;
                }
            });

            // При кликах по самому блоку изменений, не срабатывает событие, объвленное выше
            elem.off('click.block');
            elem.on('click.block',(e)=>{
                e.stopPropagation();
            });

        },

        // Создает Html код блока изменений
        render () {
            let index = (renderTrees.index === null) ? renderTrees.count : renderTrees.index + 1;
            return `<div id="tree-space__change_${index}" class="tree-space__change">
                        <input id="change__field_${index}" class="change__field" value=""/>
                        <button id="change__save_${index}" title="Сохраняет название элементу" class="change__button change__save">Сохранить</button>
                        <button id="change__add_${index}" title="Добавляет подэлемент. Название берет из значения инпута" class="change__button change__add">Добавить подстроку</button>
                        <button id="change__del_${index}" title="Удаляет текущий элемент. Значение инпута никак не влияет" class="change__button change__del">Удалить</button>
                        </div>`;
        },

    },

    // Возвращает текст родителя и самого элемента
    getNames () {
        return {
            elem: this.currentElem.textContent,
            parent: $(this.currentElem).parent().parent().parent().children('.tree-space__line').text(),
        };
    },

    // Возвращем тот же результут, что и getHtml, но без первой обертки <li></li>
    getHtmlBranch (objTree) {
        let html = this.getHtml(objTree);
        return html.slice(4,html.length - 5);
    },

    // Принимает объект древовидной структуры, возвращает код HTML
    getHtml (objTree) {
        // Проверяем один раз на наличие скилов и результат используем
        let skills = !!objTree.skills;
        let res = `<li><button class="tree-space__line${(skills) ? ' tree-space__parent' : ''}"><span>${objTree.name}</span></button>`;

        // Если есть skills, то создаем обертку ul и бежим по внутренностям
        if (skills) {
            res += `<ul class="tree-space__list">`;
            objTree.skills.forEach((skill) => {
                res += this.getHtml(skill);
            });
            res += '</ul>';
        }
        res += '</li>';
        return res;
    },

    // Инициализирует все переменные и события
    init () {

        // Инициализируем элементы
        this.blockChanges.init();
        this.line.init();

    },

    // Создает елементы HTML и инициализирует переменные
    render () {
        let index = (this.index === null) ? this.count - 1 : this.index;
        this.container[index].innerHTML = `<div class="tree-space"><ul id="tree_${index + 1}" class="tree-space__tree">${this.getHtml(this.arrayTreesObj[index])}</ul>${this.blockChanges.render()}</div>`;
        this.init();
    },
};
