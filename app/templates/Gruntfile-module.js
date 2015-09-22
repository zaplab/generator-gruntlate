<% if (moduleLoader == "webpack") { %>
var webpack = require('webpack');
<% } %>
module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var isDevMode,
        target = grunt.option('target'),
        cssTask,
        cssDocTask,
        cssWatchTask,
        jsTask,
        jsDocTask,
        jsWatchTask;

    switch (target) {
        case 'dev':
            /* falls through */
        case 'development':
            isDevMode = true;
            break;
        default:
            isDevMode = false;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
        ' <%%= pkg.name %> <%%= pkg.version %>\n' +
        ' Copyright <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %> (<%%= pkg.author.url %>)\n' +
        ' All rights reserved.\n' +
        ' <%%= pkg.description %>\n' +
        '*/',<% if ((moduleLoader == "none") && (jsVersion != "es5")) { %>

        babel: {
            options: {
                sourceMap: isDevMode,
            },
            dist: {
                files: {
                    '<%= distributionPath %>/js/main.js': '<%= distributionPath %>/js/main.js',
                }
            },<% if (addDocumentation) { %>
            doc: {
                files: {
                    '<%= documentationPath %>/resources/js/main.js': 'tmp/js/main.js',
                }
            }<% } %>
        },<% } %><% if (addDocumentation) { %>

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= documentationPath %>/resources/css/*.css',
                        '<%= documentationPath %>/resources/img/**',
                        '<%= documentationPath %>/resources/js/*.js',
                        '<%= documentationPath %>/*/*.html',
                    ]
                },
                options: {
                    watchTask: true,
                    server: './<%= documentationPath %>',
                }
            }
        },<% } %>

        clean: {
            start: [
                'tmp',
            ],
            dist: [
                '<%= distributionPath %>',
            ],<% if (addDocumentation) { %>
            doc: [
                '<%= documentationPath %>',
            ],<% } %>
            end: [
                'tmp',
            ]
        },

        concat: {
            options: {
                sourceMap: isDevMode,
                stripBanners: true,
            },<% if (addDocumentation && (featureModernizr || (moduleLoader == "requirejs"))) { %>
            initJsDoc: {
                src: [<% if (featureModernizr) { %>
                    'tmp/js/modernizr.js',<% } %><% if (moduleLoader == "requirejs") { %>
                    '<%= sourcePath %>/libs/bower/requirejs/require.js',<% } %>
                ],
                dest: '<%= documentationPath %>/resources/js/init.js'
            },<% } %><% if (moduleLoader == "none") { %>
            jsDist: {
                src: [
                    '<%= sourcePath %>/js/module-a.js',
                    '<%= sourcePath %>/js/main.js',
                ],
                dest: '<%= distributionPath %>/js/main.js'
            },<% if (addDocumentation) { %>
            jsDoc: {
                src: [
                    '<%= sourcePath %>/js/module-a.js',
                    '<%= sourcePath %>/js/main.js',
                ],
                dest: <% if (jsVersion != "es5") { %>'tmp/js/main.js'<% } else { %>'<%= documentationPath %>/resources/js/main.js'<% } %>
            }<% } %><% } %>
        },<% if (testSassLint) { %>

        sasslint: {
            options: {
                configFile: '<%= testsPath %>/.sass-lint.yml'
            },
            dist: [
                '<%= sourcePath %>/css/**/*.scss'
            ]
        },<% } %>

        cssmin: {
            options: {
                keepSpecialComments: true
            },
            dist: {
                files: {
                    '<%= distributionPath %>/css/main.min.css': [
                        '<%= distributionPath %>/css/main.css',
                    ]
                }
            },<% if (addDocumentation) { %>
            doc: {
                files: {
                    '<%= documentationPath %>/resources/css/main.css': [
                        '<%= documentationPath %>/resources/css/main.css',
                    ]
                }
            }<% } %>
        },

        copy: {
            scss: {
                expand: true,
                cwd: '<%= sourcePath %>/css/',
                src: [
                    '**/*.scss',
                ],
                dest: '<%= distributionPath %>/scss/',
            },<% if (testMocha) { %>
            setupTestsChai: {
                nonull: true,
                src: [
                    'src/libs/bower/chai/chai.js',
                ],
                dest: 'tests/libs/chai.js',
            },
            setupTestsMocha: {
                nonull: true,
                expand: true,
                cwd: 'src/libs/bower/mocha/',
                src: [
                    'mocha.js',
                    'mocha.css',
                ],
                dest: 'tests/libs',
            },<% if (moduleLoader == "requirejs") { %>
            testLibsRequirejs: {
                nonull: true,
                src: [
                    'src/libs/bower/requirejs/require.js',
                ],
                dest: 'tests/libs/require.js',
            },<% } %>
            testDist: {
                nonull: true,
                src: [
                    '<%= distributionPath %>/js/main.js',
                ],
                dest: '<%= testsPath %>/dist/js/main.js',
            },<% } %><% if (addDocumentation) { %>
            docCss: {
                nonull: true,
                src: [
                    '<%= distributionPath %>/css/main.css',
                ],
                dest: '<%= documentationPath %>/resources/css/main.css',
            },
            docJs: {
                nonull: true,
                    src: [
                    '<%= distributionPath %>/js/main.js',
                ],
                dest: '<%= documentationPath %>/resources/js/main.js',
            },
            docImages: {
                expand: true,
                cwd: '<%= distributionPath %>/img/',
                src: [
                    '**/*.{png,jpg,gif,svg}',
                ],
                dest: '<%= documentationPath %>/resources/img/',
            }<% } %>
        },

        header: {
            cssDist: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= distributionPath %>/css/main.css': '<%= distributionPath %>/css/main.css',
                }
            },<% if (addDocumentation) { %>
            cssDoc: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= documentationPath %>/resources/css/main.css': '<%= documentationPath %>/resources/css/main.css',
                }
            },<% } %>
            jsDist: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= distributionPath %>/js/main.js': '<%= distributionPath %>/js/main.js',
                }
            },<% if (addDocumentation) { %>
            jsDoc: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= documentationPath %>/resources/js/main.js': '<%= documentationPath %>/resources/js/main.js',
                }
            }<% } %>
        },

        imagemin: {
            options: {
                pngquant: true,
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/img/',
                    src: [
                        '**/*.{png,jpg,gif,svg}',
                    ],
                    dest: '<%= distributionPath %>/img/',
                }]
            },<% if (addDocumentation) { %>
            doc: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/img/',
                    src: [
                        '**/*.{png,jpg,gif,svg}',
                    ],
                    dest: '<%= documentationPath %>/resources/img/',
                }]
            }<% } %>
        },<% if (addDocumentation) { %>

        jekyll: {
            options: {
                bundleExec: true,
            },
            doc: {
                options: {
                    raw: 'devMode: ' + (isDevMode ? 'true' : 'false'),
                    src: '<%= sourcePath %>/jekyll',
                    dest: '<%= documentationPath %>',
                }
            }
        },<% } %><% if (testESLint) { %>

        eslint: {
            options: {
                configFile: '<%= testsPath %>/.eslintrc',
            },
            src: [
                '<%= sourcePath %>/js/*.js',
            ]
        },<% } %><% if (featureModernizr && addDocumentation) { %>

        modernizr: {
            doc: {
                devFile: '<%= sourcePath %>/libs/bower/modernizr/modernizr.js',
                outputFile: 'tmp/js/modernizr.js',
                uglify: false,
                extra : {},
                files: {
                    src: [
                        '<%= documentationPath %>/resources/js/**/*',
                        '<%= documentationPath %>/resources/css/**/*',
                    ]
                }
            },
        },<% } %>

        uglify: {
            options: {
                preserveComments: 'some',
                report: 'min',
            },
            dist: {
                src: [
                    '<%= distributionPath %>/js/main.js',
                ],
                dest: '<%= distributionPath %>/js/main.min.js'
            },<% if (addDocumentation) { %>
            doc: {
                src: [
                    '<%= documentationPath %>/resources/js/main.js',
                ],
                dest: '<%= documentationPath %>/resources/js/main.js'
            },<% } %><% if (addDocumentation && (featureModernizr || (moduleLoader == "requirejs"))) { %>
            docInit: {
                src: [
                    '<%= documentationPath %>/resources/js/init.js',
                ],
                dest: '<%= documentationPath %>/resources/js/init.js'
            },<% } %>
        },

        sass: {
            options: {
                outputStyle: isDevMode ? 'expanded' : 'compressed',
                sourceMap: isDevMode
            },
            dist: {
                files: {
                    '<%= distributionPath %>/css/main.css': '<%= sourcePath %>/css/main.scss'
                }
            },<% if (addDocumentation) { %>
            doc: {
                files: {
                    '<%= documentationPath %>/resources/css/main.css': '<%= sourcePath %>/css/main.scss'
                }
            }<% } %>
        },<% if (testMocha) { %>

        connect: {
            testServer: {
                options: {
                    hostname: 'localhost',
                    port: 8080,
                    base: '<%= testsPath %>/',
                }
            }
        },

        mocha: {
            options: {
                run: true
            },
            normal: {
                options: {
                    urls: ['http://localhost:8080/tests.html']
                }
            }<% if (moduleLoader == "requirejs") { %>,
            withRequireJs: {
                options: {
                    run: false,
                        urls: ['http://localhost:8080/tests-requirejs.html']
                }
            }<% } %>
        },<% } %><% if (moduleLoader == "requirejs") { %>

        requirejs: {
            dist: {
                options: {
                    optimize: isDevMode ? 'none' : 'uglify2',
                    generateSourceMaps: isDevMode ? true : false,
                    baseUrl: './',
                    mainConfigFile: '<%= sourcePath %>/js/config/requirejs.js',
                    name: '<%= sourcePath %>/js/main.js',
                    out: '<%= distributionPath %>/js/main.js',
                    include: []
                }
            },<% if (addDocumentation) { %>
            doc: {
                options: {
                    optimize: isDevMode ? 'none' : 'uglify2',
                    generateSourceMaps: isDevMode ? true : false,
                    baseUrl: './',
                    mainConfigFile: '<%= sourcePath %>/js/config/requirejs.js',
                    name: '<%= sourcePath %>/js/main.js',
                    out: '<%= documentationPath %>/resources/js/main.js',
                    include: []
                }
            }<% } %>
        },<% } %><% if (moduleLoader == "webpack") { %>

        webpack: {
            dist: {
                context: './',
                entry: '<%= sourcePath %>/js/main.js',
                output: {
                    path: '<%= distributionPath %>/js/',
                    filename: 'main.js'
                },<% if (jsVersion != "es5") { %>
                module: {
                    loaders: [
                        {
                            test: /\.js?$/,
                            exclude: /(node_modules|<%= sourcePath %>\/libs\/bower)/,
                            loader: 'babel-loader',
                        }
                    ]
                },<% } %>
                resolve: {
                    root: './',
                    modulesDirectories: [
                        '<%= sourcePath %>/js',
                        '<%= sourcePath %>/libs/bower',
                        'node_modules'
                    ]
                },
                plugins: [
                    new webpack.ResolverPlugin(
                        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
                    )
                ],
                devtool: isDevMode ? 'sourcemap' : ''
            },<% if (addDocumentation) { %>
            doc: {
                context: './',
                entry: '<%= sourcePath %>/js/main.js',
                output: {
                    path: '<%= documentationPath %>/resources/js/',
                    filename: 'main.js'
                },<% if (jsVersion != "es5") { %>
                module: {
                    loaders: [
                        {
                            test: /\.js?$/,
                            exclude: /(node_modules|<%= sourcePath %>\/libs\/bower)/,
                            loader: 'babel-loader',
                        }
                    ]
                },<% } %>
                resolve: {
                    root: './',
                    modulesDirectories: [
                        '<%= sourcePath %>/js',
                        '<%= sourcePath %>/libs/bower',
                        'node_modules'
                    ]
                },
                plugins: [
                    new webpack.ResolverPlugin(
                        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
                    )
                ],
                devtool: isDevMode ? 'sourcemap' : ''
            }<% } %>
        },<% } %>

        watch: {
            css: {
                files: [
                    '<%= sourcePath %>/css/**',
                ],
                tasks: [
                    'clean:start',
                    'css:watch',
                    'clean:end',
                ]
            },
            img: {
                files: [
                    '<%= sourcePath %>/img/**',
                ],
                tasks: [
                    'imagemin:dist',
                ]
            },
            js: {
                files: [
                    '<%= sourcePath %>/js/**',
                ],
                tasks: [
                    'clean:start',
                    'js:watch',
                    'clean:end',
                ]
            }
        }
    });<% if (testSassLint || testESLint || testMocha) { %><% if (testMocha) { %>

    // First setup
    grunt.registerTask('setup-tests', [
        'copy:setupTestsMocha',
        'copy:setupTestsChai',
    ]);
    grunt.registerTask('setup', [
        'setup-tests',
    ]);<% } %>

    // Testing
    grunt.registerTask('test-js', [<% if (testESLint) { %>
        'eslint:src',<% } %><% if (testMocha) { %><% if (moduleLoader == "requirejs") { %>
        'copy:testLibsRequirejs',<% } %>
        'copy:testDist',
        'connect:testServer',
        'mocha:normal',<% if (moduleLoader == "requirejs") { %>
        'mocha:withRequireJs',<% } %><% } %>
    ]);

    grunt.registerTask('test', [
        'test-js',
    ]);<% } %>

    cssTask = [<% if (testSassLint) { %>
        'sasslint:dist',<% } %>
        'sass:dist',
        'copy:scss',
    ];

    cssDocTask = [<% if (testSassLint) { %>
        'sasslint:dist',<% } %>
        'sass:doc',
    ];

    cssWatchTask = [<% if (testSassLint) { %>
        'sasslint:doc',<% } %>
        'sass:doc',
    ];

    if (!isDevMode) {
        cssTask.push('header:cssDist');
        cssTask.push('cssmin:dist');

        cssDocTask.push('header:cssDoc');
        cssDocTask.push('cssmin:doc');

        cssWatchTask = cssDocTask;
    }

    // CSS
    grunt.registerTask('css', cssTask);
    grunt.registerTask('css:doc', cssDocTask);
    grunt.registerTask('css:watch', cssWatchTask);

    jsTask = [<% if (moduleLoader == "requirejs") { %>
        'requirejs:dist',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:dist',<% } %><% if (moduleLoader == "none") { %>
        'concat:jsDist',<% } %><% if ((moduleLoader == "none") && (jsVersion != "es5")) { %>
        'babel:dist',<% } %><% if (testESLint) { %>
        'test-js',<% } %>
    ];

    jsDocTask = [<% if (testESLint) { %>
        'eslint:src',<% } %><% if (moduleLoader == "requirejs") { %>
        'requirejs:doc',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:doc',<% } %><% if (moduleLoader == "none") { %>
        'concat:jsDoc',<% } %><% if ((moduleLoader == "none") && (jsVersion != "es5")) { %>
        'babel:doc',<% } %><% if (featureModernizr && addDocumentation) { %>
        'modernizr:doc',<% } %><% if (addDocumentation && (featureModernizr || (moduleLoader == "requirejs"))) { %>
        'concat:initJsDoc',<% } %>
    ];

    jsWatchTask = [<% if (testESLint) { %>
        'eslint:src',<% } %><% if (moduleLoader == "requirejs") { %>
        'requirejs:doc',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:doc',<% } %><% if (moduleLoader == "none") { %>
        'concat:jsDoc',<% } %><% if ((moduleLoader == "none") && (jsVersion != "es5")) { %>
        'babel:doc',<% } %>
    ];

    if (!isDevMode) {
        jsTask.push('header:jsDist');
        jsTask.push('uglify:dist');

        jsDocTask.push('header:jsDoc');
        jsDocTask.push('uglify:doc');
        jsDocTask.push('uglify:docInit');

        jsWatchTask = jsDocTask;
    }

    // JS
    grunt.registerTask('js', jsTask);
    grunt.registerTask('js:doc', jsDocTask);
    grunt.registerTask('js:watch', jsWatchTask);

    // Images
    grunt.registerTask('images', [
        'imagemin:dist',
    ]);<% if (addDocumentation) { %>

    grunt.registerTask('doc', [
        'clean:start',
        'clean:doc',
        'jekyll',
        'css:doc',
        'js:doc',
        'imagemin:doc',
        'clean:end',
    ]);

    grunt.registerTask('serve', [
        'doc',
        'browserSync',
        'watch',
    ]);<% } %>

    // Default task
    grunt.registerTask('default', [
        'clean:start',
        'clean:dist',
        'css',
        'js',
        'images',
        'clean:end',
    ]);
};
