

module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var isDevMode,
        target = grunt.option('target'),
        cssTask,
        jsTask;

    switch (target) {
        case 'prod':
        /* falls through */
        case 'production':
        /* falls through */
        case 'staging':
            isDevMode = false;
            break;
        case 'dev':
        /* falls through */
        case 'development':
        /* falls through */
        default:
            isDevMode = true;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
        ' <%%= pkg.name %> <%%= pkg.version %>\n' +
        ' Copyright <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %> (<%%= pkg.author.url %>)\n' +
        ' All rights reserved.\n' +
        ' <%%= pkg.description %>\n' +
        '*/',
        <% if (addServeTask) { %>
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= distributionPath %>/resources/css/*.css',
                        '<%= distributionPath %>/resources/img/**',
                        '<%= distributionPath %>/resources/js/*.js',
                        '<%= distributionPath %>/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './<%= distributionPath %>'
                }
            }
        },
        <% } %>
        clean: {
            start: [
                'tmp'
            ],
            dist: [
                '<%= distributionPath %>/resources/css',
                '<%= distributionPath %>/resources/img',
                '<%= distributionPath %>/resources/js'
            ],
            end: [
                'tmp'
            ]
        },

        concat: {
            options: {
                sourceMap: isDevMode,
                stripBanners: true
            },
            initJs: {
                src: [<% if (featureModernizr) { %>
                    'tmp/js/modernizr.js'<% } %><% if (moduleLoader == "requirejs") { %><% if (featureModernizr) { %>,<% } %>
                    '<%= sourcePath %>/libs/bower/requirejs/require.js'<% } %>
                ],
                dest: '<%= distributionPath %>/resources/js/init.js'
            }<% if (moduleLoader != "requirejs") { %>,
            js: {
                src: [
                    '<%= sourcePath %>/js/main.js'
                ],
                dest: '<%= distributionPath %>/resources/js/main.js'
            }<% } %>
        },<% if (testCssLint) { %>

        csslint: {
            dist: {
                options: {
                    csslintrc: '<%= testsPath %>/.csslintrc'
                },
                src: [
                    '<%= distributionPath %>/resources/css/main.css'
                ]
            }
        },<% } %>

        cssmin: {
            dist: {
                files: {
                    '<%= distributionPath %>/resources/css/main.css': [
                        '<%= distributionPath %>/resources/css/main.css'
                    ]
                }
            }
        },<% if (testMocha) { %>

        copy: {
            testLibsChai: {
                nonull: true,
                src: [
                    'src/libs/bower/chai/chai.js'
                ],
                dest: 'tests/libs/chai.js'
            },
            testLibsMocha: {
                nonull: true,
                src: [
                    'src/libs/bower/mocha/mocha.js'
                ],
                dest: 'tests/libs/mocha.js'
            },
            testLibsMochaCss: {
                nonull: true,
                    src: [
                    'src/libs/bower/mocha/mocha.css'
                ],
                    dest: 'tests/libs/mocha.css'
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
                    '<%= distributionPath %>/resources/js/main.js'
                ],
                dest: '<%= testsPath %>/dist/js/main.js'
            }
        },<% } %>

        header: {
            cssDist: {
                options: {
                    text: isDevMode ? '' : '<%%= banner %>'
                },
                files: {
                    '<%= distributionPath %>/resources/css/main.css': '<%= distributionPath %>/resources/css/main.css'
                }
            },
            jsDist: {
                options: {
                    text: isDevMode ? '' : '<%%= banner %>'
                },
                files: {
                    '<%= distributionPath %>/resources/js/main.js': '<%= distributionPath %>/resources/js/main.js'
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
                    dest: '<%= distributionPath %>/resources/img/'
                }]
            }
        },<% if (htmlJekyll) { %>

        jekyll: {
            options: {
                bundleExec: true
            },
            doc: {
                options: {
                    raw: 'devMode: ' + (isDevMode ? 'true' : 'false'),
                    src: '<%= sourcePath %>/jekyll',
                    dest: '<%= distributionPath %>'
                }
            }
        },<% } %><% if (testJsHint) { %>

        jshint: {
            options: {
                jshintrc: '<%= testsPath %>/.jshintrc'
            },
            dist: {
                src: [
                    '<%= sourcePath %>/js/*.js'
                ]
            }
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
                        '<%= distributionPath %>/resources/css/**/*'
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
            init: {
                src: [
                    '<%= distributionPath %>/resources/js/init.js'
                ],
                    dest: '<%= distributionPath %>/resources/js/init.js'
            },
            dist: {
                src: [
                    '<%= distributionPath %>/resources/js/main.js'
                ],
                dest: '<%= distributionPath %>/resources/js/main.js'
            }
        },

        sass: {
            options: {
                outputStyle: isDevMode ? 'expanded' : 'compressed',
                sourceMap: isDevMode
            },
            dist: {
                files: {
                    '<%= distributionPath %>/resources/css/main.css': '<%= sourcePath %>/css/main.scss'
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
            },<% if (moduleLoader == "requirejs") { %>
            dist: {
                options: {
                    run: false,
                    urls: ['http://localhost:8080/tests.html']
                }
            }<% } else { %>
            dist: {
                options: {
                    urls: ['http://localhost:8080/tests.html']
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
                    'css',<% if (featureModernizr) { %>
                    'modernizr:dist',<% } %>
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
                    'js',<% if (featureModernizr) { %>
                    'modernizr:dist',<% } %>
                    'clean:end'
                ]
            }<% if (!addServeTask) { %>,
            // TODO: Deprecated in favor of Browsersync which needs more evaluating
            livereload: {
                options: {
                    livereload: 1337
                },
                files: [
                    '<%= distributionPath %>/resources/css/main.css',
                    '<%= distributionPath %>/resources/js/main.js'
                ]
            }<% } %>
        }
    });
    <% if (testCssLint || testJsHint || testMocha) { %>
    // Testing
    <% if (testMocha) { %>grunt.registerTask('install-tests', [
        'copy:testLibsChai',
        'copy:testLibsMocha',
        'copy:testLibsMochaCss'
    ]);<% } %>

    grunt.registerTask('test-css', [
        <% if (testCssLint) { %>'csslint:dist'<% } %>
    ]);
    grunt.registerTask('test-js', [
        <% if (testJsHint) { %>'jshint:dist'<% if (testMocha) { %>,<% } %><% } %><% if (testMocha) { %><% if (moduleLoader == "requirejs") { %>
        'copy:testLibsRequirejs',<% } %>
        'copy:testDist',
        'connect:testServer',
        'mocha:dist'<% } %>
    ]);
    grunt.registerTask('test', [
        'test-css',
        'test-js'
    ]);<% } %>

    cssTask = [
        'sass:dist',
        <% if (testCssLint) { %>'test-css'<% } %><% if (projectType == 'module') { %>,
        'cssmin:dist'<% } %>
    ];

    <% if (projectType != 'module') { %>if (!isDevMode) {
        cssTask.push('cssmin:dist');
    }<% } %>

    cssTask.push('header:cssDist');

    // CSS
    grunt.registerTask('css', cssTask);

    jsTask = [
        <% if (moduleLoader == "requirejs") { %>'requirejs:main'<% } else { %>'concat:js'<% } %>,
        'header:jsDist',<% if (featureModernizr) { %>
        'modernizr:dist',<% } %>
        'concat:initJs'<% if (testJsHint) { %>,
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
    ]);<% if (htmlJekyll) { %>

    grunt.registerTask('doc', [
        'jekyll',
        'default'
        // TODO: copy js & css to doc path
    ]);<% } %><% if (addServeTask) { %>

    grunt.registerTask('serve', [
        <% if (htmlJekyll) { %>'doc'<% } else {%>'default'<% } %>,
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
