// "use strict";
// let renderTreeObj = {
//     number: 0,
//     container: '',
//     tree: '',
//     start: function (obj,idContainer) {
//
//         ++this.number;
//
//         // Если в локальной истории что-то есть, то берем данные оттуда
//         let localStorageTree = localStorage.getItem("tree" + this.number);
//         // this.tree = (localStorageTree) ? JSON.parse(localStorageTree) : obj;
//         this.tree = obj;
//
//         // Присваиваем контейнер и рендерим элементы по объекту
//         this.container = document.getElementById(idContainer);
//         this.render();
//     },
//
//     endOperations: function () {
//         this.render();
//         localStorage.setItem("tree" + this.number,JSON.stringify(this.tree, '', 2));
//     },
//
//     // Произодит операции над объектом древовидной структуры. Добавляет, Редактирует, Удаляет
//     operations: function (func,tree,name,parent,newName) {
//         // tree - объект древовидной структуры
//         // name - параметр, который будет изменен
//         // newName - новый параметр
//         // parent - родитель, дабы исключить изменение параметра в другой ветке. Не слишком надежное решение, можно усовершенствовать, но в рамках учебного задания, достаточно
//
//         // Останавливаем функцию, если нет какого-то из данных
//         if (!tree || !name){ return; }
//
//         if (tree.name === name){
//
//             switch (func){
//
//                 // Редактирование
//                 case 'edit':
//                     tree.name = newName;
//                     break;
//
//                 // Добавление подстроки
//                 case 'add':
//                     let skills = tree.skills;
//                     if (skills){
//                         skills.push({name: newName});
//                     } else {
//                         tree.skills = [{name: newName}];
//                     }
//                     break;
//
//                 // Удаление
//                 case 'del':
//                 case 'delete':
//                     tree.name = 'Новая ветка';
//                     delete tree.skills;
//                     break;
//
//                 // По умолчанию добавление
//                 default:
//                     tree.name = newName;
//             }
//             // Рендерим элементы, сохраняем в локальную историю, завершем функцию
//             this.endOperations();
//             return;
//
//         }
//
//         // Бежим по всем элементам списка
//         for (let i = 0; tree.skills[i]; ++i){
//
//             // Если найден элемент, то выполнем обозначенную операцию и завершаем функцию
//             if (tree.skills[i].name === name && tree.name === parent){
//                 switch (func){
//
//                     // Редактирование
//                     case 'edit':
//                         tree.skills[i].name = newName;
//                         break;
//
//                     // Добавление подстроки
//                     case 'add':
//                         let skills = tree.skills[i].skills;
//                         if (skills){
//                             skills.push({name: newName});
//                         } else {
//                             tree.skills[i].skills = [{name: newName}];
//                         }
//                         break;
//
//                     // Удаление
//                     case 'del':
//                     case 'delete':
//                         tree.skills.splice(i, 1);
//                         if (!tree.skills.length) {
//                             delete tree.skills;
//                         }
//                         break;
//
//                     // По умолчанию добавление
//                     default:
//                         tree.skills[i].name = newName;
//                 }
//
//                 // Рендерим элементы, сохраняем в локальную историю, завершем функцию
//                 this.endOperations();
//                 return;
//             }
//
//             // Если есть скилы, то запускаем очередной поиск
//             if (tree.skills[i].skills){
//                 this.operations(func,tree.skills[i],name,parent,newName);
//             }
//         }
//     },
//
//     // Элемент из списка (линия)
//     line: {
//         elem: '',
//
//         // Убирает/показывает под список, если он есть
//         hideShowSublist: function (currentElem) {
//             $(currentElem).parent().children('.list_' + renderTreeObj.number).slideToggle();
//         },
//
//         // Инициализирует переменные и события
//         init: function () {
//             let pendingClick = 0;
//             let line = this;
//
//             this.elem = $('.line_' + renderTreeObj.number);
//
//             // При клике
//             this.elem.click(function (e) {
//
//                 // Элемент вызова
//                 let currentElem = this;
//
//                 // При втором клике обнаружит, что уже есть отложенный клик, отменит действие и выполнит функции двойного клика
//                 if (pendingClick) {
//                     clearTimeout(pendingClick);
//                     pendingClick = 0;
//                 }
//
//                 switch(e.originalEvent.detail){
//
//                     // При одиночном клике
//                     case 1:
//                         pendingClick = setTimeout(function () {
//
//                             let blockChanges = renderTreeObj.blockChanges;
//
//                             // Если элемент на блоке изменений, то при клике на другой элемент закрываем блок изменений
//                             // В противном случае скрываем подсписок у нажатого элемента
//                             if (blockChanges.focus){
//                                 blockChanges.close();
//                                 $(currentElem).focus(); // Фокус на
//                                 blockChanges.focus = false;
//                             } else {
//                                 line.hideShowSublist(currentElem);
//                             }
//                         },200);
//                         break;
//
//                     // При двойном клике
//                     case 2:
//
//                         // Показываем блок изменений
//                         renderTreeObj.blockChanges.show(this);
//                         break;
//                 }
//             });
//
//             // При нажатии клавиш на сфокусированном объекте
//             this.elem.focus(function () {
//                 $(this).keyup(function (e) {
//
//                     switch (e.keyCode){
//
//                         // del
//                         case 46:
//                             renderTreeObj.blockChanges.del(this);
//                             break;
//
//                         // enter
//                         case 13:
//                             renderTreeObj.blockChanges.show(this);
//                             break;
//
//                         // space
//                         case 32:
//                             line.hideShowSublist(this);
//                             break;
//                     }
//                 });
//             });
//         },
//     },
//
//     // Блок изменений элемента из списка
//     blockChanges: {
//
//         // Необходимые переменные
//         elem: '',
//         input: '',
//         saveButton: '',
//         addButton: '',
//         delButton: '',
//
//         currentElem: '',
//
//         focus: false,
//
//         // Закрывает блок
//         close: function () {
//             this.elem.hide();
//             $(this.currentElem).focus();
//         },
//
//         // Показывает блок
//         show: function (currentElem) {
//
//             this.currentElem = currentElem;
//
//             let thisElem = $(currentElem);
//
//             // Показать
//             this.elem.show();
//
//             // Переменные элемента
//             let top = (thisElem.offset().top - $('#tree_1').offset().top) + (thisElem.height() - this.elem.height())/2;
//             let left = thisElem.offset().left;
//
//             // Переменные инпута
//             let input = {
//                 width: thisElem.children().width(),
//                 fontFamily: thisElem.css('fontFamily'),
//                 fontSize: thisElem.css('fontSize'),
//                 text: thisElem.text(),
//             };
//
//             // Действия над блоком изменений
//             this.elem.css({
//                 'top': top,
//                 'left': left - 2 // - 2 позволяет скрыть outline элемента находящегося под блоком изменений
//             });
//
//             // Действия над инпутом
//             this.input.focus();
//             this.focus = true;
//             this.input.val(input.text);
//             this.input.css({
//                 'width': input.width + 12, // 12 - произвольная величина выбранная на глаз
//                 'fontFamily' : input.fontFamily,
//                 'fontSize' : input.fontSize,
//             });
//         },
//
//         // Сохранить значение пункта
//         save: function () {
//             let tree = renderTreeObj.tree;
//             console.log(tree);
//             let elemText = renderTreeObj.getNames(this.currentElem).elem;
//             let parentText = renderTreeObj.getNames(this.currentElem).parent;
//             let inputValue = this.input.val();
//
//             // Только если значение инпута отличается от первоначального текста
//             if (inputValue !== elemText){
//                 renderTreeObj.operations('edit',tree,elemText,parentText,inputValue);
//                 renderTreeObj.blockChanges.focusLine('.line__text_' + renderTreeObj.number,inputValue);
//             }
//
//             // Закрываем окно в любом случае
//             this.close();
//
//         },
//
//         // Добавить подстроку
//         add: function () {
//             let tree = renderTreeObj.tree;
//             let elemText = renderTreeObj.getNames(this.currentElem).elem;
//             let parentText = renderTreeObj.getNames(this.currentElem).parent;
//             let inputValue = this.input.val();
//
//             // Все операции добавления
//             function add() {
//                 renderTreeObj.operations('add',tree,elemText,parentText,inputValue);
//                 renderTreeObj.blockChanges.close();
//                 renderTreeObj.blockChanges.focusLine('.parent .line__text_' + renderTreeObj.number,inputValue);
//             }
//
//             // Если сработала функция добавления, то текст такой же как элемента, вероятно функция вызвана по ошибке
//             if (inputValue === elemText){
//                 if (confirm(`Вы хотите добавить строку с тем же названием, что и у родителя? "${elemText}"`)){
//                     // Небольшая задержка для комфортного наблюдения
//                     setTimeout(function () {
//                         add();
//                     },300);
//                 }
//             } else {
//                 add();
//             }
//
//
//         },
//
//         // Удалить выбранный пункт
//         del: function (currentElem) {
//
//             let curElem = (currentElem) ? currentElem : this.currentElem;
//             let tree = renderTreeObj.tree;
//             let elemText = renderTreeObj.getNames(curElem).elem;
//             let parentText = renderTreeObj.getNames(curElem).parent;
//
//             // Принимает текст текущего элемента, возвращает текст предыдущего элемента
//             function prevText(text) {
//                 let parentElem = $(`.line__text_${renderTreeObj.number}:contains(${text})`).parent().parent();
//                 let prevText = parentElem.prev().children().children('.line__text_' + renderTreeObj.number).text();
//                 return (prevText) ? prevText : parentElem.parent().parent().children().children('.line__text_' + renderTreeObj.number).eq(0).text();
//             }
//
//             if (confirm(`Удалить "${elemText}"?`)){
//                 // Закрываем окно
//                 renderTreeObj.blockChanges.close();
//
//                 // Скрываем элемент
//                 $(curElem).parent().slideUp();
//
//                 // Когда элемент скроется перерендериваем ветку
//                 setTimeout(function () {
//                     // Переменные для определения фокусировки. Надо до рендеринга их определить
//                     let text = prevText(elemText);
//                     renderTreeObj.operations('del',tree,elemText,parentText);
//                     renderTreeObj.blockChanges.focusLine('.line__text_' + renderTreeObj.number,text);
//
//                 }, 600);
//             }
//
//         },
//
//         // Фокусировка на элементе с в данным селектором и текстом
//         focusLine: function (selector,text) {
//             $(selector + `:contains(${text})`).parent().focus();
//         },
//
//         // Инициализация переменных и событий
//         init: function () {
//
//             let blockChanges = this;
//
//             this.elem = $('#change_' + renderTreeObj.number);
//             this.input = $('#change__field_' + renderTreeObj.number);
//             this.saveButton = $('#change__save_' + renderTreeObj.number);
//             this.addButton = $('#change__add_' + renderTreeObj.number);
//             this.delButton = $('#change__del_' + renderTreeObj.number);
//
//             // Функции нажатия на кнопки
//             this.saveButton.click(function () {
//                 blockChanges.save();
//             });
//             this.addButton.click(function () {
//                 blockChanges.add();
//             });
//             this.delButton.click(function () {
//                 blockChanges.del();
//             });
//
//             // При нажатии enter происходит функция сохранения
//             this.input.focus(function () {
//                 $(this).keyup(function (e) {
//                     switch (e.keyCode) {
//                         // enter
//                         case 13:
//                             blockChanges.save();
//                             break;
//
//                     }
//                 });
//             });
//
//             // Если esc блок изменений закрывается
//             $(window).keyup(function (e) {
//                 switch (e.keyCode) {
//                     // esc
//                     case 27:
//                         blockChanges.close();
//                         break;
//                 }
//             });
//
//         },
//
//         // Создает Html блока
//         render: function () {
//             return `<div id="change_${renderTreeObj.number}" class="change">
//                         <input id="change__field_${renderTreeObj.number}" class="change__field" value=""/>
//                         <button id="change__save_${renderTreeObj.number}" class="change__save">Сохранить</button>
//                         <button id="change__add_${renderTreeObj.number}" class="change__add">Добавить подстроку</button>
//                         <button id="change__del_${renderTreeObj.number}" class="change__del">Удалить</button>
//                         </div>`;
//         },
//
//     },
//
//     // Принимает выбранный элемент, возвращает текст родителя и самого элемента
//     getNames: function (currentElem) {
//         return {
//             parent: $(currentElem).parent().parent().parent().children('.line_'+ this.number).text(),
//             elem: $(currentElem).text(),
//         };
//     },
//
//     // Принимает объект древовидной структуры, возвращает код HTML
//     getHtml: function (objTree) {
//         // Проверяем один раз на наличие скилов и результат используем
//         let skills = !!objTree.skills;
//         let res = `<li><button class="line_${this.number} line${(skills) ? ' parent' : ''}"><span class="line__text_${this.number}">${objTree.name}</span></button>`;
//
//         // Если есть skills, то создаем обертку ul и бежим по внутренностям
//         if (skills) {
//             res += `<ul class="list_${this.number}">`;
//             for (let i = 0; objTree.skills[i]; ++i) {
//                 res += this.getHtml(objTree.skills[i]);
//             }
//             res += '</ul>';
//         }
//         res += '</li>';
//         return res;
//     },
//
//     // Инициализируем переменные и события
//     init: function () {
//
//         // Инициализируем элементы
//         this.blockChanges.init();
//         this.line.init();
//
//     },
//
//     // Создает елементы HTML и инициализирует переменные
//     render: function () {
//
//         this.container.innerHTML = `<ul id="tree_1" class="tree">${this.getHtml(this.tree)}</ul>${this.blockChanges.render()}`;
//         this.init();
//     },
//
//
// };
