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
        '*/',
        <% if (moduleLoader == "none") { %>
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
            },
            initJs: {
                src: [<% if (featureModernizr) { %>
                    'tmp/js/modernizr.js',<% } %><% if (moduleLoader == "requirejs") { %>
                    '<%= sourcePath %>/libs/bower/requirejs/require.js',<% } %>
                ],
                dest: '<%= distributionPath %>/resources/js/init.js'
            }<% if (moduleLoader == "none") { %>,
            js: {
                src: [
                    '<%= sourcePath %>/js/main.js',
                ],
                dest: '<%= distributionPath %>/resources/js/main.js'
            }<% } %>
        },<% if (testCssLint) { %>

        csslint: {
            dist: {
                options: {
                    csslintrc: '<%= testsPath %>/.csslintrc',
                },
                src: [
                    '<%= distributionPath %>/resources/css/main.css',
                ]
            }
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
                    base: 'tests/',
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
                },
                resolve: {
                    root: './',

                    // Directory names to be searched for modules
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
    grunt.registerTask('test-css', [
        <% if (testCssLint) { %>'csslint:dist',<% } %>
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

    cssTask = [
        'sass:dist',<% if (testCssLint) { %>
        'test-css',<% } %>
    ];

    cssWatchTask = [
        'sass:dist',<% if (testCssLint) { %>
        'csslint:dist',<% } %>
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
        'concat:js',<% } %><% if (featureModernizr) { %>
        'modernizr:dist',<% } %>
        'concat:initJs',<% if (testESLint) { %>
        'test-js',<% } %>
    ];

    jsWatchTask = [
        'eslint:src',<% if (moduleLoader == "none") { %>
        'concat:js',
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
    ]);<% if (htmlJekyll) { %>

    grunt.registerTask('doc', [
        'jekyll',
        'default',
    ]);<% } %>

    grunt.registerTask('serve', [
        <% if (htmlJekyll) { %>'doc'<% } else { %>'default'<% } %>,
        'browserSync',
        'watch',
    ]);

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
