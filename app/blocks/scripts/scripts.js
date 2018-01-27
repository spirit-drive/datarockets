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


renderTrees.start(tree,"container_1");
renderTrees.start(tree1,"container_2");
renderTrees.start(tree2,"container_3");