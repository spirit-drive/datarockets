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
        this.tree = tree;
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
                this.render();
                console.log(JSON.stringify(this.tree, '', 2));
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

        this.container.innerHTML = `<ul>${this.getHtml(this.tree)}</ul>`;
        this.init();
    },

    // Инициализируем переменные и события
    init: function () {
        let line = $('.line');
        let contextFunc = this;

        // При клике
        line.click(function () {
            let context = $(this);
            setTimeout(function () {
                context.parent().children('ul').slideToggle();
            },200);
        });

        // При двойном клике
        line.dblclick(function () {
            let param = contextFunc.getNames(this);

            contextFunc.operations('edit',contextFunc.tree,param.elem,param.parent,"JavaScript!!");
        });

        // При нажатии клавиш на сфокусированном объекте
        line.focus(function () {
            $(this).keyup(function (e) {
                let param = contextFunc.getNames(this);

                switch (e.keyCode){
                    case 8:
                        contextFunc.operations('edit',contextFunc.tree,param.elem,param.parent,"JavaScript!!");
                        break;
                    case 46:
                        if (confirm(`Удалить "${param.elem}"?`)){
                            $(this).parent().slideUp();
                            setTimeout(function () {
                                contextFunc.operations('del',contextFunc.tree,param.elem,param.parent);
                            }, 1000);
                        }
                        break;
                    case 187:
                        contextFunc.operations('add',contextFunc.tree,param.elem,param.parent,"JavaScript!!");
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
        let res = `<li><button class="line${(skills) ? ' parent' : ''}">${tree.name}</button>`;

        // Если есть skills, то создаем обертку ul и бежим по внутренностям
        if (skills) {
            res += '<ul>';
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
