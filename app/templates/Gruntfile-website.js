<% if (moduleLoader == "webpack") { %>
var webpack = require('webpack');<% } %>

module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var isDevMode,
        target = grunt.option('target'),
        cssTask,
        cssWatchTask,
        jsTask,
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
                    '<%= distributionPath %>/resources/js/main.js': 'tmp/js/main.js',
                }
            }
        },<% } %>

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= distributionPath %>/resources/css/*.css',
                        '<%= distributionPath %>/resources/img/**',
                        '<%= distributionPath %>/resources/js/*.js',
                        '<%= distributionPath %>/*.html',
                    ]
                },
                options: {
                    watchTask: true,
                    server: './<%= distributionPath %>',
                }
            }
        },

        clean: {
            start: [
                'tmp',
            ],
            dist: [
                '<%= distributionPath %>/resources/css',
                '<%= distributionPath %>/resources/img',
                '<%= distributionPath %>/resources/js',
            ],
            end: [
                'tmp',
            ]
        },

        concat: {
            options: {
                sourceMap: isDevMode,
                stripBanners: true,
            },<% if (featureModernizr || (moduleLoader == "requirejs")) { %>
            initJs: {
                src: [<% if (featureModernizr) { %>
                    'tmp/js/modernizr.js',<% } %><% if (moduleLoader == "requirejs") { %>
                    '<%= sourcePath %>/libs/bower/requirejs/require.js',<% } %>
                ],
                dest: '<%= distributionPath %>/resources/js/init.js'
            }<% } %><% if (moduleLoader == "none") { %>,
            js: {
                src: [
                    '<%= sourcePath %>/js/module-a.js',
                    '<%= sourcePath %>/js/main.js',
                ],
                dest: <% if (jsVersion != "es5") { %>'tmp/js/main.js'<% } else { %>'<%= distributionPath %>/resources/js/main.js'<% } %>
            }<% } %>
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
            dist: {
                files: {
                    '<%= distributionPath %>/resources/css/main.css': [
                        '<%= distributionPath %>/resources/css/main.css',
                    ]
                }
            }
        },<% if (testMocha) { %>

        copy: {
            setupTestsChai: {
                nonull: true,
                src: [
                    'src/libs/bower/chai/chai.js',
                ],
                dest: 'tests/libs/chai.js'
            },
            setupTestsMocha: {
                nonull: true,
                expand: true,
                cwd: 'src/libs/bower/mocha/',
                src: [
                    'mocha.js',
                    'mocha.css',
                ],
                dest: 'tests/libs'
            },<% if (moduleLoader == "requirejs") { %>
            testLibsRequirejs: {
                nonull: true,
                src: [
                    'src/libs/bower/requirejs/require.js',
                ],
                dest: 'tests/libs/require.js'
            },<% } %>
            testDist: {
                nonull: true,
                src: [
                    '<%= distributionPath %>/resources/js/main.js',
                ],
                dest: '<%= testsPath %>/dist/js/main.js'
            }
        },<% } %>

        header: {
            cssDist: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= distributionPath %>/resources/css/main.css': '<%= distributionPath %>/resources/css/main.css'
                }
            },
            jsDist: {
                options: {
                    text: '<%%= banner %>',
                },
                files: {
                    '<%= distributionPath %>/resources/js/main.js': '<%= distributionPath %>/resources/js/main.js'
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
                    dest: '<%= distributionPath %>/resources/img/',
                }]
            }
        },<% if (htmlJekyll) { %>

        jekyll: {
            options: {
                bundleExec: true,
            },
            doc: {
                options: {
                    raw: 'devMode: ' + (isDevMode ? 'true' : 'false'),
                    src: '<%= sourcePath %>/jekyll',
                    dest: '<%= distributionPath %>',
                }
            }
        },<% } %><% if (testESLint) { %>

        eslint: {
            options: {
                configFile: '<%= testsPath %>/.eslintrc',
            },
            src: [
                '<%= sourcePath %>/js/*.js'
            ]
        },<% } %><% if (featureModernizr) { %>

        modernizr: {
            dist: {
                devFile: '<%= sourcePath %>/libs/bower/modernizr/modernizr.js',
                outputFile: 'tmp/js/modernizr.js',
                uglify: false,
                extra : {},
                files: {
                    src: [
                        '<%= distributionPath %>/resources/js/**/*',
                        '<%= distributionPath %>/resources/css/**/*',
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
            init: {
                src: [
                    '<%= distributionPath %>/resources/js/init.js',
                ],
                dest: '<%= distributionPath %>/resources/js/init.js'
            },
            dist: {
                src: [
                    '<%= distributionPath %>/resources/js/main.js',
                ],
                dest: '<%= distributionPath %>/resources/js/main.js'
            }
        },

        sass: {
            options: {
                outputStyle: isDevMode ? 'expanded' : 'compressed',
                sourceMap: isDevMode,
            },
            dist: {
                files: {
                    '<%= distributionPath %>/resources/css/main.css': '<%= sourcePath %>/css/main.scss',
                }
            }
        },
        <% if (testMocha) { %>

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
                run: true,
            },<% if (moduleLoader == "requirejs") { %>
            dist: {
                options: {
                    run: false,
                    urls: ['http://localhost:8080/tests.html'],
                }
            }<% } else { %>
            dist: {
                options: {
                    urls: ['http://localhost:8080/tests.html'],
                }
            }<% } %>
        },<% } %><% if (moduleLoader == "requirejs") { %>
        requirejs: {
            main: {
                options: {
                    optimize: isDevMode ? 'none' : 'uglify2',
                    generateSourceMaps: isDevMode ? true : false,
                    baseUrl: './',
                    mainConfigFile: '<%= sourcePath %>/js/config/requirejs.js',
                    name: '<%= sourcePath %>/js/main.js',
                    out: '<%= distributionPath %>/resources/js/main.js',
                    include: [],
                }
            }
        },<% } %><% if (moduleLoader == "webpack") { %>

        webpack: {
            dist: {
                context: './',
                entry: '<%= sourcePath %>/js/main.js',
                output: {
                    path: '<%= distributionPath %>/resources/js/',
                    filename: 'main.js',
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
                        'node_modules',
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
    <% if (testSassLint || testESLint || testMocha) { %>
    <% if (testMocha) { %>// First setup
    grunt.registerTask('setup-tests', [
        'copy:setupTestsMocha',
        'copy:setupTestsChai',
    ]);
    grunt.registerTask('setup', [
        'setup-tests',
    ]);<% } %>
    // Testing
    grunt.registerTask('test-css', [
        <% if (testSassLint) { %>'sasslint:dist',<% } %>
    ]);
    grunt.registerTask('test-js', [
        <% if (testESLint) { %>'eslint:src',<% } %><% if (testMocha) { %><% if (moduleLoader == "requirejs") { %>
        'copy:testLibsRequirejs',<% } %>
        'copy:testDist',
        'connect:testServer',
        'mocha:dist',<% } %>
    ]);
    grunt.registerTask('test', [
        'test-css',
        'test-js',
    ]);<% } %>

    cssTask = [<% if (testSassLint) { %>
        'test-css',<% } %>
        'sass:dist',
    ];

    cssWatchTask = [<% if (testSassLint) { %>
        'sasslint:dist',<% } %>
        'sass:dist',
    ];

    if (!isDevMode) {
        cssTask.push('header:cssDist');
        cssTask.push('cssmin:dist');
        cssWatchTask = cssTask;
    }

    // CSS
    grunt.registerTask('css', cssTask);
    grunt.registerTask('css:watch', cssWatchTask);

    jsTask = [<% if (moduleLoader == "requirejs") { %>
        'requirejs:main',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:dist',<% } %><% if (moduleLoader == "none") { %>
        'concat:js',<% } %><% if ((moduleLoader == "none") && (jsVersion != "es5")) { %>
        'babel:dist',<% } %><% if (featureModernizr) { %>
        'modernizr:dist',<% } %><% if (featureModernizr || (moduleLoader == "requirejs")) { %>
        'concat:initJs',<% } %><% if (testESLint) { %>
        'test-js',<% } %>
    ];

    jsWatchTask = [
        'eslint:src',<% if (moduleLoader == "none") { %>
        'concat:js',<% } %><% if ((moduleLoader == "none") && (jsVersion != "es5")) { %>
        'babel:dist',<% } %><% if (moduleLoader == "webpack") { %>
        'webpack:dist',<% } %>
    ];

    if (!isDevMode) {
        jsTask.push('uglify');
        jsTask.push('header:jsDist');
        jsWatchTask = jsTask;
    }

    // JS
    grunt.registerTask('js', jsTask);
    grunt.registerTask('js:watch', jsWatchTask);

    // Images
    grunt.registerTask('images', [
        'imagemin:dist',
    ]);

    grunt.registerTask('serve', [
        'default',
        'browserSync',
        'watch',
    ]);

    // Default task
    grunt.registerTask('default', [
        'clean:start',
        'clean:dist',<% if (htmlJekyll) { %>
        'jekyll',<% } %>
        'css',
        'js',
        'images',
        'clean:end',
    ]);
};
