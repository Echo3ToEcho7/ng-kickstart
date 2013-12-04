#ngStart [![Dependency Status](https://gemnasium.com/marcorinck/ngStart.png)](https://gemnasium.com/marcorinck/ngStart)

This project is a grunt project. You need a running [nodeJS](http://nodejs.org/), [grunt](http://gruntjs.com/) and
[bower](https://github.com/bower/bower) installation.

##Installation

Fork this project on github and/or download this project from github as a ZIP file.

After that, in the project root, issue the following commands:

	npm install
	bower install

Done.

##Features

This project is a skeleton to use for new angular projects. It works out of the box without changes and contains
all the boiler plate code to setup a new project and two example pages. It contains hooks for your production code, 
unit tests, deployment, module loading and much more.

The following libraries are used:

* [angularJS](http://angularjs.org/) (of course)
* [bower](https://github.com/bower/bower) (for dependeny management of javascript libraries to be loaded in browser)
* [requireJS](http://requirejs.org/) (for javascript module loading and optimization)
* [jslint](http://www.jslint.com/) (for quality checking of javascript code)
* [grunt-manifest](https://github.com/gunta/grunt-manifest) (an appcache manifest will be created when creating a deployable artifact)
* [grunt-targethtml](https://github.com/changer/grunt-targethtml) (filtering of html files for deployment on production servers)
* [grunt-data-uri](https://github.com/ahomu/grunt-data-uri) Embeds all referenced images in css files in the generated project css file, which is optimized by grunt
* [karma](http://karma-runner.github.io/) (as a test runner for unit and ui tests)
* [angular-translate](https://github.com/PascalPrecht/angular-translate) (for i18n)
 
###Architecture

![Architecture](http://entwicklertagebuch.com/blog/wp-content/uploads/2013/10/modules-300x225.jpg)

I wrote a blog post about the architecture (aka folder structure) in this project: http://entwicklertagebuch.com/blog/2013/10/how-to-structure-large-angularjs-applications/

###angularJS 1.2

ngStart currently uses the stable version of angularJS 1.0.x. AngularJS 1.2.x does not work out of the box as there are some breaking changes most notably for defining routes with $routeProvider. 

However, there is already a branch for angularJS 1.2 with all needed changes to run ngStart with current release candidate: [ngStart@angularJS1.2](https://github.com/marcorinck/ngStart/tree/angular1.2)

###Differences to yeoman and angular-seed
This project is very similar to [yeoman](http://yeoman.io/) or [angular-seed](https://github.com/angular/angular-seed).
As much as I like yeoman and as cool it is to use it, its also very heavy as a technology stack. This project is much
lighter (besides node, grunt and bower, you don't need to install anything) with similar, but hardcoded
(and thus limited) features.

There are no features like yeoman generators. Its just a project with as much freedom and as much boundaries as
**I** (Marco Rinck) like.

I don't know where angular-seeds stands today, but at the time I was new to angular (November 2012), I didn't understand
what happened in angular-seed at all and was quite confused what it was doing to make something work. But i wanted to learn,
so I took the hard way and learned it by making my own build system. Which eventually resulted in this sample project.

##Usage

As browsers have a security model for files loaded from file URLs (file://....) angular projects should be loaded
from webservers even when doing local development. This project uses grunts built-in webserver to serve project files
(via [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)).

While running this web server following actions will be run automatically:

* serve all project files via http://localhost:8000, URL for index page is [http://localhost:8000/src/main/index.html](http://localhost:8000/src/main/index.html)
* jslint all javascript files (after changes in javascript files)
* unit-tests (after changes in javascript files)
* live reloading of ressources via grunt-watch (after changes in HTML/JS/CSS files)

To start the local web server:

	grunt web

(this runs jslint and unit-tests after javascript files are changed)

Create a deployable artifact:

	grunt install

Create a deployable artifact for your production webserver:

	grunt install:prod

Release a new version of your project:

	grunt release

List all packages and their licenses this project depends on, in case your boss wants to know that.

 	grunt license

###Javascript files

To get the most out of the automated build and of configured requireJS all javascript files must be
[AMD modules](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition)!

[src/main/modules/app.js](src/main/modules/app.js) is your main entrypoint for your own code. Declare a dependency in this file
to your own code and it will be automatically loaded by requireJS and will be included in the optimized javascript after
build for production use ( *grunt install* ). Look for the AboutController dependency if you need an example.

External packages should be included via bower. You can add additional dependencies in the included [bower.json](bower.json)
file. You need to run *bower install* after changes to this file.

If you need to include code that is not available as a bower module, I suggest you put it in
[src/main/external-libs](src/main/external-libs)

Currently there is no automated pick-up from bower dependencies for loading with requireJS. If you want to implement it,
please go ahead and fix [issue #4](https://github.com/marcorinck/ngStart/issues/4). Thanks!

So, after adding new dependencies you have to configure loading of the new files in 3 different project files:

1. [src/main/modules/main.js](src/main/modules/main.js) - this file is used during local development, please add your dependencies
to the existing *require.config* object: path for the file (without .js extension) and shim if this dependency needs other
packages to be present before loading this dependency
2. [src/test/main-test.js](src/test/main-test.js) - this file is used for test execution. It loads all your application (app.js)
and every file that ends with "Test.js" as requireJS modules automatically. You have to alter *require.config.path* and
*require.config.path* the same way you did in *main.js*
3. [gruntfile.js](gruntfile.js) - if you want to use a pre-minified version of your dependency you'll have to alter the
require.config.path configuration here.

You can use the existing angular configuration in both files as an example.

###HTML files

HTML files should go into the *src/main* folder and are filtered during *grunt install* build.

The included [index.html](index.html) can be used for local development out of the box without changes.
[grunt-targethtml](https://github.com/changer/grunt-targethtml) will filter all html files and will look for comment
sections like this:

````html
<!--(if target build)>
	<link rel="stylesheet" href="css/ngStart.css">
	<script src="js/main.js" data-main="main"></script></script>

<!(endif)-->
<!--(if target local)> -->
<!--<script type="text/javascript">parent.uitest && parent.uitest.instrument(window);</script>-->
	<script src="http://localhost:35729/livereload.js"></script>
	<link rel="stylesheet" href="css/sample.css">
	<script src="../../bower_components/requirejs/require.js" data-main="js/main"></script>
<!--<!(endif)-->
````

That is used to load javascript locally via requireJS and load the generated and optimized javascript file after
deploying the app to a production server.

The generated appcache manifest is included for production use only and not in local mode.

All html files in *src/main/* will be automatically filtered with [grunt-targethtml](https://github.com/changer/grunt-targethtml)

###CSS files

You can create as many css files as you want. You should place them in the [src/main/css](src/main/css/) folder.
*grunt install* will pick them up automatically from there.

You must load all css files in the HTML files manually for local development with *grunt web* target (via <link> tag).
Look for the sample.css file that is loaded in the sample index.html.

During grunt build ( *grunt install* ) and while creating a deployable artificat all css files will be concatenated and optimized
into one big css file. The grunt build has to know about the correct order of css files to do this. Currently you have
to configure the order yourself inside the [gruntfile.js](gruntfile.js). I have added a comment where to do that.

If you want to implement a more user-friendly version for the configuration, go ahead and fix
[issue #6](https://github.com/marcorinck/ngStart/issues/6).

###Images

Image files which are referenced in the project css files will be automatically embedded into the generated and
optimized css file of the project as data URIs. Image files need to placed into the [src/main/images](src/main/images/)
folder to be found.

Though data URI images are ~30% bigger than the original image, the browser saves heavily on HTTP requests. Thus, for
icons its usually faster to load them as data URIs than directly via HTTP.

**Warning**: No images inside the *images* folder will be included in the artifact generated by the *grunt install* goal.
If you need to deploy images on your webserver (usually only bigger images like in galleries) you need to place them into the
[src/main/images/build](src/main/images/build/) which *will* be included in the artifact.

###Configuration

There is a configuration system taking care of angular module dependencies and requireJS module loading.

The standard configuration is in [src/main/modules/config/configuration.js](src/main/modules/config/configuration.js)
which is used during a install build without any parameters.

If you want to do builds for a different build environment (like a production or test server) you can create files as
[src/main/modules/config/configuration_environmentName.js](src/main/modules/config/configuration_environmentName.js).
Afterwards, you can do specific builds for these environments like this:

	grunt install:environmentName

The configuration parameters are available as an angular constant too, just declare a dependency to "config". There is an
example for that in [src/main/modules/contact/ContactController.js](src/main/modules/contact/ContactController.js)



# [ngBoilerplate](http://joshdmiller.github.com/ng-boilerplate) [![Build Status](https://travis-ci.org/joshdmiller/ng-boilerplate.png?branch=master)](https://travis-ci.org/joshdmiller/ng-boilerplate)

An opinionated kickstarter for [AngularJS](http://angularjs.org) projects.

***

## Quick Start

Install Node.js and then:

```sh
$ git clone git://github.com/joshdmiller/ng-boilerplate
$ cd ng-boilerplate
$ sudo npm -g install grunt-cli karma bower
$ npm install
$ bower install
$ grunt watch
```

Finally, open `file:///path/to/ng-boilerplate/build/index.html` in your browser.

Happy hacking!

## Purpose

`ngBoilerplate` is designed to make life easy by providing a basic framework
with which to kickstart AngularJS projects. It contains a best-practice
directory structure to ensure code reusability and maximum scalability.
ngBoilerplate also comes prepackaged with the most popular design frameworks
around: [Twitter Bootstrap](http://getbootstrap.com),
[Angular UI](http://angular-ui.github.io),
[Angular Bootstrap](http://angular-ui.github.io/bootstrap),
[Font Awesome](http://fortawesome.github.com/Font-Awesome), and
[LESS](http://lesscss.org). Lastly, it contains a sophisticated
[Grunt](http://gruntjs.org)-based build system to ensure maximum productivity.
All you have to do is clone it and start coding!

## Philosophy

The principal goal of `ngBoilerplate` is to set projects up for long-term
success.  So `ngBoilerplate` tries to follow best practices everywhere it can.
These are:

- Properly orchestrated modules to encourage drag-and-drop component re-use.
- Tests exist alongside the component they are testing with no separate `test`
  directory required; the build process should be sophisticated enough to handle
  this.
- Speaking of which, the build system should work automagically, without
  involvement from the developer. It should do what needs to be done, while
  staying out of the way. Components should end up tested, linted, compiled,
  and minified, ready for use in a production environment.
- Integration with popular tools like Bower, Karma, and LESS.
- *Encourages* test-driven development. It's the only way to code.
- A directory structure that is cogent, meaningful to new team members, and
  supporting of the above points.
- Well-documented, to show new developers *why* things are set up the way they
  are.
- It should be responsive to evidence. Community feedback is therefore crucial
  to the success of `ngBoilerplate`.

But `ngBoilerplate` is not an example of an AngularJS app: this is a
kickstarter. If you're looking for an example of what a complete, non-trivial
AngularJS app that does something real looks like, complete with a REST backend
and authentication and authorization, then take a look at
[`angular-app`](http://github.com/angular-app/angular-app), which does just
that - and does it well.

## Learn

### Overall Directory Structure

At a high level, the structure looks roughly like this:

```
ng-boilerplate/
  |- grunt-tasks/
  |- karma/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- common/
  |  |  |- <reusable code>
  |  |- less/
  |  |  |- main.less
  |- vendor/
  |  |- angular-bootstrap/
  |  |- bootstrap/
  |  |- placeholders/
  |- .bowerrc
  |- bower.json
  |- build.config.js
  |- Gruntfile.js
  |- module.prefix
  |- module.suffix
  |- package.json
```

What follows is a brief description of each entry, but most directories contain
their own `README.md` file with additional documentation, so browse around to
learn more.

- `karma/` - test configuration.
- `src/` - our application sources. [Read more &raquo;](src/README.md)
- `vendor/` - third-party libraries. [Bower](http://bower.io) will install
  packages here. Anything added to this directory will need to be manually added
  to `build.config.js` and `karma/karma-unit.js` to be picked up by the build
  system.
- `.bowerrc` - the Bower configuration file. This tells Bower to install
  components into the `vendor/` directory.
- `bower.json` - this is our project configuration for Bower and it contains the
  list of Bower dependencies we need.
- `build.config.js` - our customizable build settings; see "The Build System"
  below.
- `Gruntfile.js` - our build script; see "The Build System" below.
- `module.prefix` and `module.suffix` - our compiled application script is
  wrapped in these, which by default are used to place the application inside a
  self-executing anonymous function to ensure no clashes with other libraries.
- `package.json` - metadata about the app, used by NPM and our build script. Our
  NPM dependencies are listed here.

### Detailed Installation

This section provides a little more detailed understanding of what goes into
getting `ngBoilerplate` up and running. Though `ngBoilerplate` is really simple
to use, it might help to have an understanding of the tools involved here, like
Node.js and Grunt and Bower. If you're completely new to highly organized,
modern JavaScript development, take a few short minutes to read [this overview
of the tools](tools.md) before continuing with this section.

Okay, ready to go? Here it is:

`ngBoilerplate` uses [Grunt](http://gruntjs.org) as its build system, so
[Node.js](http://nodejs.org) is required. Also, Grunt by default no longer comes
with a command-line utility and Karma and Bower must end up in your global path
for the build system to find it, so they must be installed independently. Once
you have Node.js installed, you can simply use `npm` to make it all happen:

```sh
$ npm -g install grunt-cli karma bower
```

If you're on Linux (like I am) then throw `sudo` in front of that command.  If
you're on Windows, then you're on your own.

Next, you can either clone this repository using Git, download it as a zip file
from GitHub, or merge the branch into your existing repository. Assuming you're
starting from scratch, simply clone this repository using git:

```sh
$ git clone git://github.com/joshdmiller/ng-boilerplate my-project-name
$ cd my-project-name
```

And then install the remaining build dependencies locally:

```sh
$ npm install
```

This will read the `dependencies` (empty by default) and the `devDependencies`
(which contains our build requirements) from `package.json` and install
everything needed into a folder called `node_modules/`.

There are many Bower packages used by `ngBoilerplate`, like Twitter Bootstrap
and Angular UI, which are listed in `bower.js`. To install them into the
`vendor/` directory, simply run:

```sh
$ bower install
```

In the future, should you want to add a new Bower package to your app, run the
`install` command:

```sh
$ bower install packagename --save-dev
```

The `--save-dev` flag tells Bower to add the package at its current version to
our project's `bower.js` file so should another developer download our
application (or we download it from a different computer), we can simply run the
`bower install` command as above and all our dependencies will be installed for
us. Neat!

Technically, `ngBoilerplate` is now ready to go.

However, prior to hacking on your application, you will want to modify the
`package.json` file to contain your project's information. Do not remove any
items from the `devDependencies` array as all are needed for the build process
to work.

To ensure your setup works, launch grunt:

```sh
$ grunt watch
```

The built files are placed in the `build/` directory by default. Open the
`build/index.html` file in your browser and check it out! Because everything is
compiled, no XHR requests are needed to retrieve templates, so until this needs
to communicate with your backend there is no need to run it from a web server.

`watch` is actually an alias of the `grunt-contrib-watch` that will first run a
partial build before watching for file changes. With this setup, any file that
changes will trigger only those build tasks necessary to bring the app up to
date. For example, when a template file changes, the templates are recompiled
and concatenated, but when a test/spec file changes, only the tests are run.
This allows the watch command to complete in a fraction of the time it would
ordinarily take.

In addition, if you're running a Live Reload plugin in your browser (see below),
you won't even have to refresh to see the changes! When the `watch` task detects
a file change, it will reload the page for you. Sweet.

When you're ready to push your app into production, just run the `compile`
command:

```sh
$ grunt compile
```

This will concatenate and minify your sources and place them by default into the
`bin/` directory. There will only be three files: `index.html`,
`your-app-name.js`, and `your-app-name.css`. All of the vendor dependencies like
Bootstrap styles and AngularJS itself have been added to them for super-easy
deploying. If you use any assets (`src/assets/`) then they will be copied to
`bin/` as is.

Lastly, a complete build is always available by simply running the default
task, which runs `build` and then `compile`:

```sh
$ grunt
```

### The Build System

The best way to learn about the build system is by familiarizing yourself with
Grunt and then reading through the heavily documented build script,
`Gruntfile.js`. But you don't need to do that to be very productive with
`ngBoilerplate`. What follows in this section is a quick introduction to the
tasks provided and should be plenty to get you started.

The driver of the process is the `delta` multi-task, which watches for file
changes using `grunt-contrib-watch` and executes one of nine tasks when a file
changes:

* `delta:gruntfile` - When `Gruntfile.js` changes, this task runs the linter
  (`jshint`) on that one file and reloads the configuration.
* `delta:assets` - When any file within `src/assets/` changes, all asset files
  are copied to `build/assets/`.
* `delta:html` - When `src/index.html` changes, it is compiled as a Grunt
  template, so script names, etc., are dynamically replaced with the correct
  values configured dynamically by Grunt.
* `delta:less` - When any `*.less` file within `src/` changes, the
  `src/less/main.less` file is linted and copied into
  `build/assets/ng-boilerplate.css`.
* `delta:jssrc` - When any JavaScript file within `src/` that does not end in
  `.spec.js` changes, all JavaScript sources are linted, all unit tests are run,
  and the all source files are re-copied to `build/src`.
* `delta:coffeesrc` - When any `*.coffee` file in `src/` that doesn't match
  `*.spec.coffee` changes, the Coffee scripts are compiled independently into
  `build/src` in a structure mirroring where they were in `src/` so it's easy to
  locate problems. For example, the file
  `src/common/titleService/titleService.coffee` is compiled to
  `build/src/common/titleService/titleService.js`.
* `delta:tpls` - When any `*.tpl.html` file within `src/` changes, all templates
  are put into strings in a JavaScript file (technically two, one for
  `src/common/` and another for `src/app/`) that will add the template to
  AngularJS's
  [`$templateCache`](http://docs.angularjs.org/api/ng.$templateCache) so
  template files are part of the initial JavaScript payload and do not require
  any future XHR.  The template cache files are `build/template-app.js` and
  `build/template-common.js`.
* `delta:jsunit` - When any `*.spec.js` file in `src/` changes, the test files
  are linted and the unit tests are executed.
* `delta:coffeeunit` - When any `*.spec.coffee` file in `src/` changes, the test
  files are linted, compiled their tests executed.

As covered in the previous section, `grunt watch` will execute a full build
up-front and then run any of the aforementioned `delta:*` tasks as needed to
ensure the fastest possible build. So whenever you're working on your project,
start with:

```sh
$ grunt watch
```

And everything will be done automatically!

### Build vs. Compile

To make the build even faster, tasks are placed into two categories: build and
compile. The build tasks (like those we've been discussing) are the minimal
tasks required to run your app during development.

Compile tasks, however, get your app ready for production. The compile tasks
include concatenation, minification, compression, etc. These tasks take a little
bit longer to run and are not at all necessary for development so are not called
automatically during build or watch.

To initiate a full compile, you simply run the default task:

```sh
$ grunt
```

This will perform a build and then a compile. The compiled site - ready for
uploading to the server! - is located in `bin/`, taking a cue from
traditional software development. To test that your full site works as
expected, open the `bin/index.html` file in your browser. Voila!

### Live Reload!

`ngBoilerplate` also includes [Live Reload](http://livereload.com/), so you no
longer have to refresh your page after making changes! You need a Live Reload
browser plugin for this:

- Chrome - [Chrome Webstore](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- Firefox - [Download from Live Reload](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
- Safari - [Download from Live Reload](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)
- Internet Explorer - Surely you jest.

Note that if you're using the Chrome version with `file://` URLs (as is the
default with `ngBoilerplate`) you need to tell Live Reload to allow it. Go to
`Menu -> Tools -> Extensions` and check the "Allow access to file URLs" box next
to the Live Reload plugin.

When you load your page, click the Live Reload icon in your toolbar and
everything should work magically. w00t!

If you'd prefer to not install a browser extension, then you must add the
following to the end of the `body` tag in `index.html`:

```html
<script src="http://localhost:35729/livereload.js"></script>
```

Boom!

## Roadmap

This is a project that is not broad in scope, so there's not really much of a
wish list here. But I would like to see a couple of things:

I'd like it to be a little simpler. I want this to be a universal starting
point. If someone is starting a new AngularJS project, she should be able to
clone, merge, or download its source and immediately start doing what she needs
without renaming a bunch of files and methods or deleting spare parts. What I
have works for a first release, but I just think there is a little too much here
right now.

I'd also like to see a simple generator. Nothing like Yeoman, as there already
is one of those, but just something that allows the user to say "I want
Bootstrap but not Font Awesome and my app is called 'coolApp'. Gimme." Perhaps a
custom download builder like UI Bootstrap has. Like that. Then again, perhaps
some Yeoman generators wouldn't be out of line. I don't know. What do you think?

Naturally, I am open to all manner of ideas and suggestions. See the
"Contributing" section below.

### To Do

See the [issues list](http://github.com/joshdmiller/ng-boilerplate/issues). And
feel free to submit your own!

### Contributing

This is an opinionated kickstarter, but the opinions are fluid and
evidence-based. Don't like the way I did something? Think you know of a better
way? Have an idea to make this more useful? Let me know! You can contact me
through all the usual channels or you can open an issue on the GitHub page. If
you're feeling ambitious, you can even submit a pull request - how thoughtful
of you!

So join the team! We're good people.