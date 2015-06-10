'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    constructor: function ()
    {
        // Calling the super constructor is important so our generator is correctly set up
        yeoman.generators.Base.apply(this, arguments);

        this.argument('project-name', {
            type: String,
            required: false
        });
        this.projectName = this['project-name'] || 'project-name';
        this.projectName = this._.slugify(this.projectName);

        // settings:
        this.option('settings-min-files', {
            type: Boolean,
            desc: 'Generate extra .min files for css & js files. Or just minify without extra file.',
            defaults: false
        });

        this.option('settings-documentation', {
            type: Boolean,
            desc: 'Add Documentation (Jekyll)',
            defaults: false
        });

        this.option('settings-tests', {
            type: Boolean,
            desc: 'Add Tests (CSS Lint, JSHint and Mocha & Chai)',
            defaults: true
        });

        this.option('skip-install', {
            type: Boolean,
            desc: 'Skip the bower, node and maybe gem installations',
            defaults: false
        });
    },

    promptProjectName: function ()
    {
        if (!this['project-name']) {
            var done = this.async();

            this.prompt({
                type: 'input',
                name: 'name',
                message: 'Project Name',
                default: this.projectName
            }, function (answers) {
                this.projectName = answers.name;
                this.projectName = this._.slugify(this.projectName);
                this.config.set('projectName', this.projectName);

                done();
            }.bind(this));
        }
    },

    promptSourcePathName: function ()
    {
        var done = this.async();

        this.prompt({
            type: 'input',
            name: 'src-path',
            message: 'Source Path',
            default: 'src'
        }, function (answers) {
            this.sourcePath = answers['src-path'];
            this.sourcePath = this._.slugify(this.sourcePath);
            this.config.set('sourcePath', this.sourcePath);

            done();
        }.bind(this));
    },

    promptDistributionPathName: function ()
    {
        var done = this.async();

        this.prompt({
            type: 'input',
            name: 'dist-path',
            message: 'Distribution Path',
            default: 'dist'
        }, function (answers) {
            this.distributionPath = answers['dist-path'];
            this.distributionPath = this._.slugify(this.distributionPath);
            this.options.distributionPath = this.distributionPath;
            this.config.set('distributionPath', this.distributionPath);

            done();
        }.bind(this));
    },

    prompSettings: function ()
    {
        var done = this.async(),
            hasFeature = function (features, feature) {
                return features.indexOf(feature) !== -1;
            };

        this.log('By default css & js will be minified if not run in dev mode.');

        this.prompt({
            type: 'checkbox',
            name: 'settings',
            message: 'Settings',
            choices: [
                {
                    name: 'Generate extra .min files for css & js files',
                    value: 'minFiles',
                    checked: this.options['settings-min-files'] || false
                },
                {
                    name: 'Add Documentation (Jekyll)',
                    value: 'documentation',
                    checked: this.options['settings-documentation'] || false
                },
                {
                    name: 'Add Tests (CSS Lint, JSHint and Mocha & Chai)',
                    value: 'tests',
                    checked: this.options['settings-tests'] || true
                }
            ]
        }, function (answers) {
            var features = answers.settings;

            this.settingsMinFiles = hasFeature(features, 'minFiles');
            this.settingsDocumentation = hasFeature(features, 'documentation');
            this.settingsTests = hasFeature(features, 'tests');
            this.config.set('settingsMinFiles', this.settingsMinFiles);
            this.config.set('settingsDocumentation', this.settingsDocumentation);
            this.config.set('settingsTests', this.settingsTests);

            done();
        }.bind(this));
    },

    promptDocumentationPathName: function ()
    {
        if (this.settingsDocumentation) {
            var done = this.async();

            this.prompt({
                type: 'input',
                name: 'doc-path',
                message: 'Documentation Path',
                default: 'doc'
            }, function (answers) {
                this.documentationPath = answers['doc-path'];
                this.documentationPath = this._.slugify(this.documentationPath);
                this.config.set('docPath', this.documentationPath);

                done();
            }.bind(this));
        }
    },

    prompTestSettings: function ()
    {
        if (this.settingsTests) {
            var done = this.async(),
                hasFeature = function (features, feature) {
                    return features.indexOf(feature) !== -1;
                };

            this.prompt({
                type: 'checkbox',
                name: 'tests',
                message: 'Tests',
                choices: [
                    {
                        name: 'CSS Lint',
                        value: 'csslint',
                        checked: true
                    },
                    {
                        name: 'JSHint',
                        value: 'jshint',
                        checked: true
                    },
                    {
                        name: 'Mocha & Chai',
                        value: 'mocha',
                        checked: true
                    }
                ]
            }, function (answers) {
                var features = answers.tests;

                this.testCssLint = hasFeature(features, 'csslint');
                this.testJsHint = hasFeature(features, 'jshint');
                this.testMocha = hasFeature(features, 'mocha');
                this.config.set('testCssLint', this.testCssLint);
                this.config.set('testJsHint', this.testJsHint);
                this.config.set('testMocha', this.testMocha);

                done();
            }.bind(this));
        }
    },

    promptTestsPath: function ()
    {
        if (this.testCssLint || this.testJsHint || this.testMocha) {
            var done = this.async();

            this.prompt({
                type: 'input',
                name: 'tests-path',
                message: 'Tests Path',
                default: 'tests'
            }, function (answers) {
                this.testsPath = answers['tests-path'];
                this.testsPath = this._.slugify(this.testsPath);
                this.config.set('testsPath', this.testsPath);

                done();
            }.bind(this));
        }
    },

    promptModuleLoaders: function ()
    {
        var done = this.async(),
            prompts = {
                type: 'list',
                name: 'module-loader',
                message: 'Module Loader:',
                choices: [
                    {
                        name: 'None',
                        value: 'none'
                    },
                    {
                        name: 'jspm (TODO! not working yet)',
                        value: 'jspm'
                    },
                    {
                        name: 'Require.js',
                        value: 'requirejs'
                    },
                    {
                        name: 'Webpack',
                        value: 'webpack'
                    }
                ],
                default: 'requirejs'
            };

        this.prompt(prompts, function (answers) {
            this.moduleLoader = answers['module-loader'];
            this.config.set('module-loader', this.moduleLoader);

            done();
        }.bind(this));
    },

    promptFeatures: function ()
    {
        var done = this.async(),
            prompts = {
                type: 'checkbox',
                name: 'features',
                message: 'Extras',
                choices: [
                    {
                        name: 'Use Modernizr',
                        value: 'modernizr',
                        checked: true
                    }
                ]
            },
            hasFeature = function (features, feature) {
                return features.indexOf(feature) !== -1;
            };

        this.log('By default breakpoint-sass, compass-mixins and susy2-grid are included.');

        this.prompt(prompts, function (answers) {
            var features = answers.features;
            this.featureModernizr = hasFeature(features, 'modernizr');
            this.config.set('featureModernizr', this.featureModernizr);

            done();
        }.bind(this));
    },

    writing: {
        bower: function () {
            var bower = {
                name: this._.slugify(this.projectName),
                private: true,
                version: '0.0.0',
                dependencies: {
                    'breakpoint-sass': '~2.4.2',
                    'compass-mixins': '~0.12.6'
                },
                devDependencies: {}
            };

            if (this.moduleLoader == "requirejs") {
                bower.dependencies.requirejs = '~2.1.15';
            }

            if (this.featureModernizr) {
                bower.dependencies.modernizr = '~2.7.1';
            }

            if (this.testMocha) {
                bower.devDependencies.chai = '~1.10.0';
                bower.devDependencies.mocha = '~2.1.0';
            }

            if (this.settingsDocumentation) {
                bower.devDependencies['google-code-prettify'] = '~1.0.4';
            }

            this.copy('bowerrc', '.bowerrc');
            this.write('bower.json', JSON.stringify(bower, null, 2));
        },

        csslint: function () {
            if (this.testCssLint) {
                this.copy('tests/csslintrc', this.testsPath + '/.csslintrc');
            }
        },

        editorConfig: function () {
            this.copy('editorconfig', '.editorconfig');
        },

        gem: function () {
            if (this.settingsDocumentation) {
                this.copy('Gemfile');
            }
        },

        git: function () {
            this.template('gitignore', '.gitignore');
        },

        gruntfile: function () {
            this.copy('Gruntfile.js');
        },

        jshint: function () {
            if (this.testJsHint) {
                this.copy('tests/jshintrc', this.testsPath + '/.jshintrc');
            }
        },

        packageJSON: function () {
            var packageJSON = {
                name: this._.slugify(this.projectName),
                private: true,
                version: '0.0.0',
                "author": {
                    "name" : "Author Name",
                    "email" : "author@email",
                    "url" : "http://www.author.url"
                },
                dependencies: {},
                devDependencies: {
                    bower: '^1.4.1',
                    grunt: '^0.4.5',
                    'grunt-cli': '^0.1.13',
                    'grunt-contrib-clean': '^0.6.0',
                    'grunt-contrib-concat': '^0.5.1',
                    'grunt-contrib-copy': '^0.8.0',
                    'grunt-contrib-cssmin': '^0.12.3',
                    'grunt-contrib-imagemin': '^0.9.4',
                    'grunt-contrib-uglify': '^0.9.1',
                    'grunt-contrib-watch': '^0.6.1',
                    'grunt-header': '^1.0.0',
                    'grunt-sass': '^1.0.0',
                    'load-grunt-tasks': '^3.2.0',
                    'time-grunt': '^1.2.1'
                }
            };

            if (this.testCssLint) {
                packageJSON.devDependencies['grunt-contrib-csslint'] = '^0.4.0';
            }

            if (this.testJsHint) {
                packageJSON.devDependencies['grunt-contrib-jshint'] = '^0.11.2';
            }

            if (this.moduleLoader == 'requirejs') {
                packageJSON.devDependencies['grunt-requirejs'] = '^0.4.2';
            }

            if (this.moduleLoader == 'webpack') {
                packageJSON.devDependencies['grunt-webpack'] = '^1.0.8';
            }

            if (this.testMocha) {
                packageJSON.devDependencies['grunt-contrib-connect'] = '^0.10.1';
                packageJSON.devDependencies['grunt-mocha'] = '^0.4.12';
            }

            this.write('package.json', JSON.stringify(packageJSON, null, 2));
        },

        source: function () {
            this.mkdir(this.sourcePath);
            this.mkdir(this.sourcePath + '/css');
            this.mkdir(this.sourcePath + '/fonts');
            this.mkdir(this.sourcePath + '/img');
            this.mkdir(this.sourcePath + '/js');
            this.copy('src/js/main.js', this.sourcePath + '/js/main.js');
            this.copy('src/css/main.scss', this.sourcePath + '/css/main.scss');
        },

        jekyll: function () {
            if (this.settingsDocumentation) {
                this.mkdir(this.sourcePath + '/jekyll');
                this.copy('src/jekyll/_config.yml', this.sourcePath + '/jekyll/_config.yml');
                this.copy('src/jekyll/index.html', this.sourcePath + '/jekyll/index.html');
                this.copy('src/jekyll/_layouts/default.html', this.sourcePath + '/jekyll/_layouts/default.html');
                this.copy('src/jekyll/_includes/main-navigation.html', this.sourcePath + '/jekyll/_includes/main-navigation.html');
            }
        },

        test: function () {
            this.mkdir(this.testsPath + '/unit');
            this.copy('tests/unit/basic.js', this.testsPath + '/unit/basic.js');
            this.copy('tests/tests.html', this.testsPath + '/tests.html');

            if (this.moduleLoader == "requirejs") {
                this.mkdir(this.testsPath + '/unit/requirejs');
                this.copy('tests/unit/requirejs/_main.js', this.testsPath + '/unit/requirejs/_main.js');
                this.copy('tests/unit/requirejs/basic.js', this.testsPath + '/unit/requirejs/basic.js');
                this.copy('tests/unit/basic.js', this.testsPath + '/unit/basic.js');
                this.copy('tests/tests-requirejs.html', this.testsPath + '/tests-requirejs.html');
            }
        }
    },

    install: function ()
    {
        if (this.options['skip-install']) {
            var installInfo = 'To install:\n> ' + chalk.yellow.bold('npm install && bower install');

            if (this.testMocha) {
                installInfo += chalk.yellow.bold('grunt install-tests');
            }

            if (this.settingsDocumentation) {
                installInfo += chalk.yellow.bold(' && bundler install');
            }

            this.log(installInfo);
            this.log('Then:\n> ' + chalk.yellow.bold('grunt && grunt watch'));
        } else {
            this.installDependencies({
                callback: function () {
                    if (this.testMocha) {
                        this.spawnCommand('grunt', ['install-tests']);
                    }

                    if (this.settingsDocumentation) {
                        this.spawnCommand('bundler', ['install']);
                    }
                }.bind(this)
            });
        }
    }
});