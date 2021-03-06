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

    promptProjectType: function ()
    {
        var done = this.async(),
            prompts = {
                type: 'list',
                name: 'type',
                message: 'Project Type:',
                choices: [
                    {
                        name: 'Website',
                        value: 'website'
                    },
                    {
                        name: 'Module/Plugin/Library',
                        value: 'module'
                    }
                ],
                default: 'website'
            };

        this.prompt(prompts, function (answers) {
            this.projectType = answers['type'];
            this.config.set('type', this.projectType);

            done();
        }.bind(this));
    },

    prompHTML: function ()
    {
        if (this.projectType === 'website') {
            var done = this.async();

            this.prompt({
                type: 'list',
                name: 'html',
                message: 'HTML Template',
                choices: [
                    {
                        name: 'Basic index.html',
                        value: 'basic'
                    },
                    {
                        name: 'Use Jekyll',
                        value: 'jekyll'
                    }
                ],
                default: 'basic'
            }, function (answers) {
                this.htmlBasic = (answers.html === 'basic');
                this.htmlJekyll = (answers.html === 'jekyll');
                this.config.set('htmlBasic', this.htmlBasic);
                this.config.set('htmlJekyll', this.htmlJekyll);

                done();
            }.bind(this));
        }
    },

    prompSpacesOrTabs: function ()
    {
        var done = this.async();

        this.prompt({
            type: 'list',
            name: 'indentation',
            message: 'Indentation',
            choices: [
                {
                    name: 'Spaces',
                    value: 'spaces'
                },
                {
                    name: 'Tabs',
                    value: 'tabs'
                }
            ],
            default: 'spaces'
        }, function (answers) {
            this.indentation = answers.indentation;
            this.config.set('indentation', this.indentation);

            done();
        }.bind(this));
    },

    prompSpaces: function ()
    {
        if (this.indentation === 'spaces') {
            var done = this.async();

            this.prompt({
                type: 'input',
                name: 'indentationSpaces',
                message: 'Number of spaces',
                validate: function (input) {
                    var numberValue = parseInt(input, 10);

                    if (numberValue >= 0) {
                        return true;
                    } else {
                        return 'You need to provide a number';
                    }
                }.bind(this),
                default: 4
            }, function (answers) {
                this.indentationSpaces = answers.indentationSpaces;
                this.config.set('indentationSpaces', this.indentationSpaces);

                done();
            }.bind(this));
        }
    },

    prompJSVersion: function ()
    {
        var done = this.async();

        this.prompt({
            type: 'list',
            name: 'jsVersion',
            message: 'JavaScript version',
            choices: [
                {
                    name: 'ES5',
                    value: 'es5'
                },
                {
                    name: 'ES6',
                    value: 'es6'
                }/* TODO: ,
                {
                    name: 'ES7',
                    value: 'es7'
                }*/
            ],
            default: 'es6'
        }, function (answers) {
            this.jsVersion = answers.jsVersion;
            this.config.set('jsVersion', this.jsVersion);

            done();
        }.bind(this));
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
            this.config.set('distributionPath', this.distributionPath);

            done();
        }.bind(this));
    },

    prompAddDocumentation: function ()
    {
        if (this.projectType === 'module') {
            var done = this.async();

            this.prompt({
                type: 'confirm',
                name: 'documentation',
                message: 'Add Documentation (Jekyll)',
                default: true
            }, function (answers) {
                this.addDocumentation = answers.documentation;
                this.config.set('addDocumentation', this.addDocumentation);

                done();
            }.bind(this));
        }
    },

    promptDocumentationPathName: function ()
    {
        if (this.addDocumentation) {
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
                    name: 'SASS Lint',
                    value: 'sasslint',
                    checked: true
                },
                {
                    name: 'ESLint',
                    value: 'eslint',
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

            this.testSassLint = hasFeature(features, 'sasslint');
            this.testESLint = hasFeature(features, 'eslint');
            this.testMocha = hasFeature(features, 'mocha');
            this.config.set('testSassLint', this.testSassLint);
            this.config.set('testESLint', this.testESLint);
            this.config.set('testMocha', this.testMocha);

            done();
        }.bind(this));
    },

    promptTestsPath: function ()
    {
        if (this.testSassLint || this.testESLint || this.testMocha) {
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
                    },/*, // TODO
                    {
                        name: 'jspm',
                        value: 'jspm'
                    },*/
                    {
                        name: 'Require.js',
                        value: 'requirejs'
                    },
                    {
                        name: 'Webpack',
                        value: 'webpack'
                    }
                ],
                default: 'webpack'
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
                    'compass-breakpoint': '~2.6.1',
                    'compass-mixins': '~0.12.6'
                },
                devDependencies: {}
            };

            if (this.moduleLoader == 'requirejs') {
                bower.dependencies.requirejs = '~2.1.15';
            }

            if (this.featureModernizr) {
                bower.dependencies.modernizr = '~2.7.1';
            }

            if (this.testMocha) {
                bower.devDependencies.chai = '~3.0.0';
                bower.devDependencies.mocha = '~2.1.0';
            }

            if (this.addDocumentation) {
                bower.devDependencies['google-code-prettify'] = '~1.0.4';
            }

            this.copy('bowerrc', '.bowerrc');
            this.write('bower.json', JSON.stringify(bower, null, 2));
        },

        sasslint: function () {
            if (this.testSassLint) {
                this.copy('tests/sass-lint.yml', this.testsPath + '/.sass-lint.yml');
            }
        },

        editorConfig: function () {
            this.copy('editorconfig', '.editorconfig');
        },

        gem: function () {
            if (this.htmlJekyll || this.addDocumentation) {
                this.copy('Gemfile');
            }
        },

        git: function () {
            this.template('gitignore', '.gitignore');
        },

        gruntfile: function () {
            if (this.projectType === 'website') {
                this.copy('Gruntfile-website.js', 'Gruntfile.js');
            } else {
                this.copy('Gruntfile-module.js', 'Gruntfile.js');
            }
        },

        eslint: function () {
            if (this.testESLint) {
                this.copy('tests/eslintrc', this.testsPath + '/.eslintrc');
            }
        },

        modules: function () {
            if (this.moduleLoader == 'requirejs') {
                this.mkdir(this.sourcePath + '/js/config');
                this.copy('src/js/config/requirejs.js', this.sourcePath + '/js/config/requirejs.js');
            }

            this.copy('src/js/module-a.js', this.sourcePath + '/js/module-a.js');
        },

        packageJSON: function () {
            var packageJSON = {
                name: this._.slugify(this.projectName),
                private: true,
                version: '0.0.0',
                author: {
                    name : 'Author Name',
                    email : 'author@email',
                    url : 'http://www.author.url'
                },
                description: 'project description',
                dependencies: {},
                devDependencies: {
                    bower: '^1.4.1',
                    grunt: '^0.4.5',
                    'grunt-babel': '^5.0.3',
                    'grunt-cli': '^0.1.13',
                    'grunt-contrib-clean': '^0.6.0',
                    'grunt-contrib-concat': '^0.5.1',
                    'grunt-contrib-copy': '^0.8.0',
                    'grunt-contrib-cssmin': '^0.13.0',
                    'grunt-contrib-imagemin': '^0.9.4',
                    'grunt-contrib-uglify': '^0.9.1',
                    'grunt-contrib-watch': '^0.6.1',
                    'grunt-header': '^1.0.0',
                    'grunt-sass': '^1.0.0',
                    'load-grunt-tasks': '^3.2.0',
                    'time-grunt': '^1.2.1'
                },
                scripts: {
                    postinstall: 'node_modules/.bin/bower install' + (this.testMocha ? ' && node_modules/.bin/grunt setup' : '')
                }
            };

            if (this.testSassLint) {
                packageJSON.devDependencies['grunt-sass-lint'] = 'https://github.com/sasstools/grunt-sass-lint.git';
            }

            if (this.testESLint) {
                packageJSON.devDependencies['babel-eslint'] = '^4.0.10';

                if (this.jsVersion === 'es5') {
                    packageJSON.devDependencies['eslint-config-airbnb-es5'] = '^1.0.5';
                } else {
                    packageJSON.devDependencies['eslint-config-airbnb'] = '^0.0.8';
                }

                packageJSON.devDependencies['grunt-eslint'] = '^17.1.0';
            }

            if (this.moduleLoader == 'requirejs') {
                packageJSON.devDependencies['grunt-requirejs'] = '^0.4.2';
            }

            if (this.moduleLoader == 'webpack') {
                if (this.jsVersion !== 'es5') {
                    packageJSON.devDependencies['babel-loader'] = '^5.3.2';
                }

                packageJSON.devDependencies['grunt-webpack'] = '^1.0.11';
            }

            if ((this.projectType === 'website') || this.addDocumentation) {
                packageJSON.devDependencies['grunt-browser-sync'] = '^2.1.2';
            }

            if (this.testMocha) {
                packageJSON.devDependencies['grunt-contrib-connect'] = '^0.10.1';
                packageJSON.devDependencies['grunt-mocha'] = '^0.4.13';
            }

            if (this.htmlJekyll || this.addDocumentation) {
                packageJSON.devDependencies['grunt-jekyll'] = '^0.4.2';
            }

            if (this.featureModernizr) {
                packageJSON.devDependencies['grunt-modernizr'] = '^0.6.0';
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
            this.copy('src/css/_functions.scss', this.sourcePath + '/css/_functions.scss');
            this.copy('src/css/_mixins.scss', this.sourcePath + '/css/_mixins.scss');
            this.copy('src/css/_variables.scss', this.sourcePath + '/css/_variables.scss');
            this.copy('src/css/main.scss', this.sourcePath + '/css/main.scss');
        },

        dist: function () {
            this.mkdir(this.distributionPath);

            if (this.htmlBasic) {
                this.copy('src/index.html', this.distributionPath + '/index.html');
            }
        },

        jekyll: function () {
            if (this.htmlJekyll || this.addDocumentation) {
                this.mkdir(this.sourcePath + '/jekyll');
                this.copy('src/jekyll/index.html', this.sourcePath + '/jekyll/index.html');
                this.copy('src/jekyll/_layouts/default.html', this.sourcePath + '/jekyll/_layouts/default.html');
                this.copy('src/jekyll/_includes/main-navigation.html', this.sourcePath + '/jekyll/_includes/main-navigation.html');

                if (this.htmlJekyll) {
                    this.copy('src/jekyll/_config-website.yml', this.sourcePath + '/jekyll/_config.yml');
                } else {
                    this.copy('src/jekyll/_config-module.yml', this.sourcePath + '/jekyll/_config.yml');
                }
            }
        },

        test: function () {
            if (this.testMocha) {
                this.mkdir(this.testsPath + '/unit');
                this.copy('tests/unit/basic.js', this.testsPath + '/unit/basic.js');

                if (this.moduleLoader == 'requirejs') {
                    this.mkdir(this.testsPath + '/unit/requirejs');
                    this.copy('tests/unit/requirejs/_main.js', this.testsPath + '/unit/requirejs/_main.js');
                    this.copy('tests/unit/requirejs/basic.js', this.testsPath + '/unit/requirejs/basic.js');
                    this.copy('tests/unit/basic.js', this.testsPath + '/unit/basic.js');

                    if (this.projectType === 'website') {
                        this.copy('tests/tests-requirejs.html', this.testsPath + '/tests.html');
                    } else {
                        this.copy('tests/tests.html', this.testsPath + '/tests.html');
                        this.copy('tests/tests-requirejs.html', this.testsPath + '/tests-requirejs.html');
                    }
                } else {
                    this.copy('tests/tests.html', this.testsPath + '/tests.html');
                }
            }
        }
    },

    install: function ()
    {
        if (this.options['skip-install']) {
            var installInfo = 'To install:\n> ' + chalk.yellow.bold('npm install');

            if (this.htmlJekyll || this.addDocumentation) {
                installInfo += chalk.yellow.bold(' && bundler install');
            }

            this.log(installInfo);

            if ((this.projectType === 'website') || this.addDocumentation) {
                this.log('Then:\n> ' + chalk.yellow.bold('grunt serve'));
            } else {
                this.log('Then:\n> ' + chalk.yellow.bold('grunt'));
            }
        } else {
            this.installDependencies({
                callback: function () {
                    if (this.htmlJekyll || this.addDocumentation) {
                        this.spawnCommand('bundler', ['install']);
                    }
                }.bind(this)
            });
        }
    }
});