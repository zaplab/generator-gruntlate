

module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var isDevMode,
        target = grunt.option('target'),
        cssTask,
        jsTask;

    switch (target) {
        case 'live':
        /* falls through */
        case 'staging':
            isDevMode = false;
            break;
        case 'dev':
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

        clean: {
            start: [],
            dist: [
                '<%= options.distributionPath %>/css',
                '<%= options.distributionPath %>/img',
                '<%= options.distributionPath %>/js'
            ],
            end: []
        },

        concat: {
            options: {
                banner: '<%%= banner %>',
                sourceMap: isDevMode,
                stripBanners: true
            },
            js: {
                src: [
                    '<%= sourcePath %>/js/main.js'
                ],
                dest: '<%= distributionPath %>/js/main.js'
            }
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
                    <% if (settingsMinFiles) { %>'<%= distributionPath %>/css/main.min.css'<% } else { %>'<%= distributionPath %>/css/main.css'<% } %>: [
                        '<%= distributionPath %>/css/main.css'
                    ]
                }
            }
        },
        <% if (testMocha) { %>
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
                    '<%= distributionPath %>/js/main.js'
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
                    '<%= distributionPath %>/css/main.css': '<%= distributionPath %>/css/main.css'
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
        },

        uglify: {
            options: {
                preserveComments: 'some',
                report: 'min'
            },
            dist: {
                src: [
                    '<%%= concat.js.dest %>'
                ],
                dest: <% if (settingsMinFiles) { %>'<%= distributionPath %>/js/main.min.js'<% } else { %>'<%= distributionPath %>/js/main.js'<% } %>
            }
        },<% } %>

        sass: {
            options: {
                // TODO: ['expanded' and 'compact' are not currently supported by libsass]
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
            js: {
                files: [
                    '<%= sourcePath %>/js/**'
                ],
                tasks: [
                    'clean:start',
                    'js',
                    'clean:end'
                ]
            },
            livereload: {
                options: {
                    livereload: 1337
                },
                files: [
                    '<%= distributionPath %>/css/main.css',
                    '<%= distributionPath %>/js/main.js'
                ]
            }
        }
    });
    <% if (settingsTests) { %>

    // Testing
    <% if (testMocha) { %>grunt.registerTask('install-tests', [
        'copy:testLibsChai',
        'copy:testLibsMocha',
        'copy:testLibsMochaCss'
    ]);<% } %>

    grunt.registerTask('test-css', [
        'csslint:dist'
    ]);
    grunt.registerTask('test-js', [
        'jshint:dist'<% if (testMocha) { %>,<% if (moduleLoader == "requirejs") { %>
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
        <% if (settingsTests) { %>'test-css'<% } %><% if (settingsMinFiles) { %>,
        'cssmin:dist'<% } %>
    ];

    <% if (!settingsMinFiles) { %>if (!isDevMode) {
        cssTask.push('cssmin:dist');
    }<% } %>

    cssTask.push('header:cssDist');

    // CSS
    grunt.registerTask('css', cssTask);

    jsTask = [
        'concat:js'<% if (settingsTests) { %>,
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
    ]);

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
