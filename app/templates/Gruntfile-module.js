<% if (moduleLoader == "webpack") { %>
var webpack = require('webpack');<% } %>

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
        '*/',<% if (moduleLoader == "none") { %>

        babel: {
            options: {
                sourceMap: isDevMode,
            },
            dist: {
                files: {
                    '<%= distributionPath %>/js/main.js': 'tmp/js/main.js',
                }
            }
        },<% } %>
        <% if (addDocumentation) { %>
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
        },
        <% } %>
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
            },<% if (addDocumentation && featureModernizr && (moduleLoader == "requirejs")) { %>
            initJsDoc: {
                src: [<% if (featureModernizr) { %>
                    'tmp/js/modernizr.js',<% } %><% if (moduleLoader == "requirejs") { %>
                    '<%= sourcePath %>/libs/bower/requirejs/require.js',<% } %>
                ],
                dest: '<%= documentationPath %>/js/init.js'
            },<% } %><% if (moduleLoader == "none") { %>
            jsDist: {
                src: [
                    '<%= sourcePath %>/js/main.js',
                ],
                dest: '<%= distributionPath %>/js/main.js'
            },
            jsDoc: {
                src: [
                    '<%= sourcePath %>/js/main.js',
                ],
                    dest: '<%= distributionPath %>/js/main.js'
            }<% } %>
        },<% if (testCssLint) { %>

        csslint: {
            dist: {
                options: {
                    csslintrc: '<%= testsPath %>/.csslintrc',
                },
                src: [
                    '<%= distributionPath %>/css/main.css',
                ]
            },
            doc: {
                options: {
                    csslintrc: '<%= testsPath %>/.csslintrc',
                },
                src: [
                    '<%= documentationPath %>/resources/css/main.css',
                ]
            }
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
            },
            doc: {
                files: {
                    '<%= documentationPath %>/resources/css/main.css': [
                        '<%= documentationPath %>/resources/css/main.css',
                    ]
                }
            }
        },

        copy: {
            scss: {
                expand: true,
                cwd: '<%= sourcePath %>/css/',
                src: [
                    '**/*.scss',
                ],
                dest: '<%= distributionPath %>/scss/',
            },
            <% if (testMocha) { %>
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
            },<% } %>
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
            }
        },

        header: {
            cssDist: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= distributionPath %>/css/main.css': '<%= distributionPath %>/css/main.css',
                }
            },
            cssDoc: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= documentationPath %>/resources/css/main.css': '<%= documentationPath %>/resources/css/main.css',
                }
            },
            jsDist: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= distributionPath %>/js/main.js': '<%= distributionPath %>/js/main.js',
                }
            },
            jsDoc: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= documentationPath %>/resources/js/main.js': '<%= documentationPath %>/resources/js/main.js',
                }
            }
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
            },
            doc: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/img/',
                    src: [
                        '**/*.{png,jpg,gif,svg}',
                    ],
                    dest: '<%= documentationPath %>/resources/img/',
                }]
            }
        },
        <% if (addDocumentation) { %>
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
        },<% } %>
        <% if (testESLint) { %>

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
            }
        },
        <% } %>
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
            },
            doc: {
                src: [
                    '<%= documentationPath %>/resources/js/main.js',
                ],
                    dest: '<%= documentationPath %>/resources/js/main.js'
            }
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
            },
            doc: {
                files: {
                    '<%= documentationPath %>/resources/css/main.css': '<%= sourcePath %>/css/main.scss'
                }
            }
        },
        <% if (testMocha) { %>

        connect: {
            testServer: {
                options: {
                    hostname: 'localhost',
                    port: 8080,
                    base: 'tests/',
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
            },
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
            }
        },<% } %><% if (moduleLoader == "webpack") { %>

        webpack: {
            dist: {
                context: './',
                    entry: '<%= sourcePath %>/js/main.js',
                    output: {
                    path: '<%= distributionPath %>/js/',
                    filename: 'main.js'
                },
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
            },
            doc: {
                context: './',
                    entry: '<%= sourcePath %>/js/main.js',
                    output: {
                    path: '<%= documentationPath %>/resources/js/',
                    filename: 'main.js'
                },
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
            }
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
    });
    <% if (testCssLint || testESLint || testMocha) { %>
    <% if (testMocha) { %>// First setup
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

    cssTask = [
        'sass:dist',
        <% if (testCssLint) { %>'csslint:dist',<% } %>
        'copy:scss',
    ];

    cssDocTask = [
        'sass:doc',
        <% if (testCssLint) { %>'csslint:doc',<% } %>
    ];

    cssWatchTask = [
        'sass:doc',<% if (testCssLint) { %>
        'csslint:doc',<% } %>
    ];

    if (!isDevMode) {
        cssTask.push('header:cssDist');
        cssTask.push('cssmin:dist');

        cssDocTask.push('header:cssDoc');
        cssDocTask.push('cssmin:doc');

        cssWatchTask = cssTask;
    }

    // CSS
    grunt.registerTask('css', cssTask);
    grunt.registerTask('css:doc', cssDocTask);
    grunt.registerTask('css:watch', cssWatchTask);

    jsTask = [<% if (moduleLoader == "requirejs") { %>
        'requirejs:dist',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:dist',<% } %><% if (moduleLoader == "none") { %>
        'concat:jsDist',<% } %><% if (testESLint) { %>
        'test-js',<% } %>
    ];

    jsDocTask = [<% if (testESLint) { %>
        'eslint:src',<% } %><% if (moduleLoader == "requirejs") { %>
        'requirejs:doc',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:doc',<% } %><% if (moduleLoader == "none") { %>
        'concat:jsDoc',<% } %><% if (featureModernizr && addDocumentation) { %>
        'modernizr:doc',<% } %><% if (addDocumentation && featureModernizr && (moduleLoader == "requirejs")) { %>
        'concat:initJsDoc',<% } %>
    ];

    jsWatchTask = [<% if (testESLint) { %>
        'eslint:src',<% } %><% if (moduleLoader == "requirejs") { %>
        'requirejs:doc',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:doc',<% } %><% if (moduleLoader == "none") { %>
        'concat:jsDoc',
        'babel:doc',<% } %>
    ];

    if (!isDevMode) {
        jsTask.push('header:jsDist');
        jsTask.push('uglify:dist');

        jsDocTask.push('header:jsDoc');
        jsDocTask.push('uglify:doc');

        jsWatchTask = jsTask;
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
    ]);<% } %><% if (addDocumentation) { %>

    grunt.registerTask('serve', [
        'doc',
        'browserSync',
        'watch',
    ]);
    <% } %>
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
