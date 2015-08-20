

module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var isDevMode,
        target = grunt.option('target'),
        cssTask,
        jsTask;

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
        <% if (addDocumentation) { %>
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= documentationPath %>/resources/css/*.css',
                        '<%= documentationPath %>/resources/img/**',
                        '<%= documentationPath %>/resources/js/*.js',
                        '<%= documentationPath %>/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './<%= documentationPath %>'
                }
            }
        },
        <% } %>
        clean: {
            start: [
                'tmp'
            ],
            dist: [
                '<%= distributionPath %>'
            ],<% if (addDocumentation) { %>
            doc: [
                '<%= documentationPath %>'
            ],<% } %>
            end: [
                'tmp'
            ]
        },

        concat: {
            options: {
                sourceMap: isDevMode,
                stripBanners: true
            }<% if (addDocumentation && featureModernizr && (moduleLoader == "requirejs")) { %>,
            initJsDoc: {
                src: [<% if (featureModernizr) { %>
                    'tmp/js/modernizr.js'<% } %><% if (moduleLoader == "requirejs") { %><% if (featureModernizr) { %>,<% } %>
                    '<%= sourcePath %>/libs/bower/requirejs/require.js'<% } %>
                ],
                dest: '<%= documentationPath %>/js/init.js'
            }<% } %><% if (moduleLoader != "requirejs") { %>,
            js: {
                src: [
                    '<%= sourcePath %>/js/main.js'
                ],
                dest: '<%= distributionPath %>/js/main.js'
            }<% } %>
        },<% if (testCssLint) { %>

        csslint: {
            dist: {
                options: {
                    csslintrc: '<%= testsPath %>/.csslintrc'
                },
                src: [
                    '<%= distributionPath %>/css/main.css'
                ]
            }
        },<% } %>

        cssmin: {
            dist: {
                files: {
                    '<%= distributionPath %>/css/main.min.css': [
                        '<%= distributionPath %>/css/main.css'
                    ]
                }
            }
        },

        copy: {
            scss: {
                expand: true,
                cwd: '<%= sourcePath %>/css/',
                src: [
                    '**/_*.scss'
                ],
                dest: '<%= distributionPath %>/scss/'
            },
            <% if (testMocha) { %>
            setupTestsChai: {
                nonull: true,
                    src: [
                    'src/libs/bower/chai/chai.js'
                ],
                    dest: 'tests/libs/chai.js'
            },
            setupTestsMocha: {
                nonull: true,
                    expand: true,
                    cwd: 'src/libs/bower/mocha/',
                    src: [
                    'mocha.js',
                    'mocha.css'
                ],
                    dest: 'tests/libs'
            },<% if (moduleLoader == "requirejs") { %>
            testLibsRequirejs: {
                nonull: true,
                src: [
                    'src/libs/bower/requirejs/require.js'
                ],
                dest: 'tests/libs/require.js'
            },<% } %>
            testDist: {
                nonull: true,
                src: [
                    '<%= distributionPath %>/js/main.js'
                ],
                dest: '<%= testsPath %>/dist/js/main.js'
            }<% } %>
        },

        header: {
            cssDist: {
                options: {
                    text: isDevMode ? '' : '<%%= banner %>'
                },
                files: {
                    '<%= distributionPath %>/css/main.css': '<%= distributionPath %>/css/main.css'
                }
            },
            jsDist: {
                options: {
                    text: isDevMode ? '' : '<%%= banner %>'
                },
                files: {
                    '<%= distributionPath %>/js/main.js': '<%= distributionPath %>/js/main.js'
                }
            }
        },

        imagemin: {
            options: {
                pngquant: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/img/',
                    src: [
                        '**/*.{png,jpg,gif}'
                    ],
                    dest: '<%= distributionPath %>/img/'
                }]
            }
        },
        <% if (addDocumentation) { %>
        jekyll: {
            options: {
                bundleExec: true
            },
            doc: {
                options: {
                    raw: 'devMode: ' + (isDevMode ? 'true' : 'false'),
                    src: '<%= sourcePath %>/jekyll',
                    dest: '<%= documentationPath %>'
                }
            }
        },<% } %>
        <% if (testJsHint) { %>

        jshint: {
            options: {
                jshintrc: '<%= testsPath %>/.jshintrc'
            },
            dist: {
                src: [
                    '<%= sourcePath %>/js/*.js'
                ]
            }
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
                        '<%= documentationPath %>/resources/css/**/*'
                    ]
                }
            }
        },
        <% } %>
        uglify: {
            options: {
                preserveComments: 'some',
                report: 'min'
            },
            dist: {
                src: [
                    '<%= distributionPath %>/js/main.js'
                ],
                dest: '<%= distributionPath %>/js/main.min.js'
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
            }
        },
        <% if (testMocha) { %>

        connect: {
            testServer: {
                options: {
                    hostname: 'localhost',
                        port: 8080,
                        base: 'tests/'
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
            main: {
                options: {
                    optimize: isDevMode ? 'none' : 'uglify2',
                    generateSourceMaps: isDevMode ? true : false,
                    baseUrl: './',
                    mainConfigFile: '<%= sourcePath %>/js/config/requirejs.js',
                    name: '<%= sourcePath %>/js/main.js',
                    out: '<%= distributionPath %>/js/main.js',
                    include: []
                }
            }
        },<% } %>

        watch: {
            css: {
                files: [
                    '<%= sourcePath %>/css/**'
                ],
                tasks: [
                    'clean:start',
                    'css',
                    'clean:end'
                ]
            },
            img: {
                files: [
                    '<%= sourcePath %>/img/**'
                ],
                tasks: [
                    'imagemin:dist'
                ]
            },
            js: {
                files: [
                    '<%= sourcePath %>/js/**'
                ],
                tasks: [
                    'clean:start',
                    'js',
                    'clean:end'
                ]
            }
        }
    });
    <% if (testCssLint || testJsHint || testMocha) { %>
    <% if (testMocha) { %>// First setup
    grunt.registerTask('setup-tests', [
        'copy:setupTestsMocha',
        'copy:setupTestsChai'
    ]);
    grunt.registerTask('setup', [
        'setup-tests'
    ]);<% } %>
    // Testing
    grunt.registerTask('test-css', [
        <% if (testCssLint) { %>'csslint:dist'<% } %>
    ]);
    grunt.registerTask('test-js', [
        <% if (testJsHint) { %>'jshint:dist'<% if (testMocha) { %>,<% } %><% } %><% if (testMocha) { %><% if (moduleLoader == "requirejs") { %>
        'copy:testLibsRequirejs',<% } %>
        'copy:testDist',
        'connect:testServer',
        'mocha:normal'<% if (moduleLoader == "requirejs") { %>,
        'mocha:withRequireJs'<% } %><% } %>
    ]);
    grunt.registerTask('test', [
        'test-css',
        'test-js'
    ]);<% } %>

    cssTask = [
        'sass:dist',
        <% if (testCssLint) { %>'test-css',<% } %>
        'cssmin:dist',
        'copy:scss'
    ];

    cssTask.push('header:cssDist');

    // CSS
    grunt.registerTask('css', cssTask);

    jsTask = [
        <% if (moduleLoader == "requirejs") { %>'requirejs:main'<% } else { %>'concat:js'<% } %>,
        'header:jsDist'<% if (featureModernizr && addDocumentation) { %>,
        'modernizr:doc'<% } %><% if (addDocumentation && featureModernizr && (moduleLoader == "requirejs")) { %>,
        'concat:initJsDoc'<% } %><% if (testJsHint) { %>,
        'test-js'<% } %>
    ];

    if (!isDevMode) {
        jsTask.push('uglify');
    }

    // JS
    grunt.registerTask('js', jsTask);

    // Images
    grunt.registerTask('images', [
        'imagemin:dist'
    ]);<% if (addDocumentation) { %>

    grunt.registerTask('doc', [
        'clean:doc',
        'jekyll',
        'default'
        // TODO: copy js & css to doc path
    ]);<% } %><% if (addDocumentation) { %>

    grunt.registerTask('serve', [
        'doc',
        'browserSync',
        'watch'
    ]);
    <% } %>
    // Default task
    grunt.registerTask('default', [
        'clean:start',
        'clean:dist',
        'css',
        'js',
        'images',
        'clean:end'
    ]);
};
