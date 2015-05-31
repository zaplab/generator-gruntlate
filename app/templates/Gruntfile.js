

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

        mocha: {
            options: {
                run: true
            },
            dist: {
                src: [
                    '<%= testsPath %>/dist.html'
                ]
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
    grunt.registerTask('test-css', [
        'csslint:dist'
    ]);
    grunt.registerTask('test-js', [
        'jshint:dist',
        'copy:testDist'<% if (testMocha) { %>,
        'mocha:dist'<% } %>
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
