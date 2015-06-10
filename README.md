generator-gruntlate
=========

yeoman generator for the basic structure of a web project with a grunt template

## Usage

```
$ mkdir my-project && cd $_
```

then run this yeoman generator

```
$ yo gruntlate
```

## What you get

by default (you can change the names of the directories when running the generator)

```
.
├── dist
│   ├── css
│   ├── fonts
│   ├── img
│   └── js
├── src
│   ├── css
│   │   └── main.scss
│   ├── fonts
│   ├── img
│   ├── js
│   │   └── main.js
│   └── libs
│       └── bower
├── tests
│   ├── .csslintrc
│   └── .jshintrc
├── .bowerrc
├── .editorconfig
├── .gitignore
├── bower.json
├── Gruntfile.js
└── package.json
```

```
$ grunt
$ grunt watch
```

```
$ grunt css
$ grunt images
$ grunt js
```

you can also add jekyll.
(if you are creating some kind of library that needs a documentation)
the following folders / files will be added

```
.
├── doc
├── src
│   └── jekyll
│       ├── _includes
│       │   └── main-navigation.html
│       ├── _layouts
│       │   └── default.html
│       ├── _config.yml
│       └── index.html
└── Gemfile
```

and the following grunt task

```
$ grunt doc
```
