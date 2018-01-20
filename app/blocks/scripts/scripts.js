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

function changeTree(tree,name,newName,parent){
    // tree - объект древовидной структуры
    // name - параметр, который будет изменен
    // newName - новый параметр
    // parent - родитель, дабы исключить изменение параметра в другой ветке

    // Останавливаем функцию, если нет какого-то из данных
    if (!tree || !name || !newName || !parent){return;}

    // Бежим по всем элементам списка
    for (let i = 0; tree.skills[i]; ++i){

        // Если найдено слово, то замещаем его и останавливаем функцию
        if (tree.skills[i].name === name && tree.name === parent){
            tree.skills[i].name = newName;
            return;
        }

        // Если есть скилы, то запускаем очередной поиск
        if (tree.skills[i].skills){
            changeTree(tree.skills[i],name,newName,parent);
        }
    }
}

changeTree(tree,'class','class!!!','OOP');

function createHtml(tree) {
    let res = `<li><div class="line"><button>${tree.name}</button></div>`;

    // Если есть skills, то создаем обертку ul и бежим по внутренностям
    if (tree.skills) {
        res += '<ul>';
        for (let i = 0; tree.skills[i]; ++i) {
            res += createHtml(tree.skills[i]);
        }
        res += '</ul>';
    }
    res += '</li>';
    return res;
}

let main = document.getElementsByClassName('home__main')[0];
main.innerHTML = "<ul>" + createHtml(tree) + "</ul>";