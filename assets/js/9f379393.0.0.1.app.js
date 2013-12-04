/* ng-kickstart - v0.0.1 - 2013-12-04 */
window.app=window.app||{},app.bootstrap=function(){angular.bootstrap(document,["app"])},app.init=function(){app.bootstrap()},app.config={apiUrl:"api/v1",version:"0.0.1"},angular.element(document).ready(function(){app.init()}),angular.module("app",["templates.app","templates.common","app.home","app.notes","app.docs","ngRoute","ngAnimate","chieffancypants.loadingBar","common.directives.appVersion","common.directives.plusOne","common.interceptors.http"]).config(["$provide","$routeProvider","$locationProvider","$httpProvider",function($provide,$routeProvider,$locationProvider){$locationProvider.html5Mode(!0),$routeProvider.otherwise({redirectTo:"/"}),$provide.decorator("$sniffer",function($delegate){return $delegate.history=!1,$delegate})}]).run(["$rootScope","$window",function($rootScope,$window){$rootScope.config=$window.app.config}]).controller("AppCtrl",["$scope","$location",function($scope,$location){$scope.title="ng-kickstart | easy AngularJS development",$scope.isActive=function(viewLocation){return viewLocation===$location.path()}}]),angular.module("app.docs",[]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/gettingStarted",{templateUrl:"app/docs/docs.tpl.html"})}]),angular.module("app.home",["ngRoute"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/",{controller:"HomeCtrl",templateUrl:"app/home/home.tpl.html"})}]).controller("HomeCtrl",function(){}),angular.module("app.notes",["ngRoute","notes.service"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/notes",{controller:"NotesCtrl as notesCtrl",templateUrl:"app/notes/notes.tpl.html",resolve:{notesList:function(NotesService){return NotesService.get()}}})}]).controller("NotesCtrl",["$scope","NotesService","notesList",function($scope,NotesService,notesList){function store(copy,message){NotesService.put(copy).then(function(){app.notes=copy,alertify.log(message),app.reset()})}var app=this;app.notes=notesList,app.reset=function(){$scope.addForm.$setPristine(),app.newNote=""},app.addNote=function(newNote){if($scope.addForm.$valid){var copy=angular.copy(app.notes);copy.push({id:copy.length,note:newNote}),store(copy,"note saved :)")}},app.deleteNote=function(index){var copy=angular.copy(app.notes);copy.splice(index,1),store(copy,"note deleted :)")},app.updateNote=function(note){{var copy=angular.copy(app.notes);_.each(copy,function(element){element.id===note.id&&(element.note=note.note)})}store(copy,"note updated :)")}}]),angular.module("notes.service",[]).factory("NotesService",["$q","$timeout","cfpLoadingBar",function($q,$timeout,cfpLoadingBar){var STORAGE_ID="ng-kickstart",get=function(){cfpLoadingBar.start();var deferred=$q.defer();return $timeout(function(){var data=JSON.parse(localStorage.getItem(STORAGE_ID)||"[]");cfpLoadingBar.complete(),deferred.resolve(data)},200),deferred.promise},put=function(elems){cfpLoadingBar.start();var deferred=$q.defer();return $timeout(function(){localStorage.setItem(STORAGE_ID,JSON.stringify(elems)),cfpLoadingBar.complete(),deferred.resolve()},200),deferred.promise};return{get:get,put:put}}]),angular.module("common.directives.appVersion",[]).directive("appVersion",function(){return{restrict:"A",template:"v{{config.version}}"}}),angular.module("common.directives.plusOne",[]).directive("plusOne",function(){return{link:function(scope,element){gapi.plusone.render(element[0],{size:"medium",href:"http://bit.ly/ng-kickstart"})}}}),angular.module("common.interceptors.http",[]).config(["$provide","$httpProvider",function($provide,$httpProvider){$httpProvider.interceptors.push(function($q){return{responseError:function(rejection){return alertify.error(rejection.data.message),$q.reject(rejection)}}})}]),angular.module("templates.app",["app/docs/docs.tpl.html","app/home/home.tpl.html","app/notes/notes.tpl.html"]),angular.module("app/docs/docs.tpl.html",[]).run(["$templateCache",function($templateCache){$templateCache.put("app/docs/docs.tpl.html",'<p class="panel">\n<strong>Note that this is only a getting started guide, for more detailed information about the build system, the available tasks, the configuration of the build or anything else, please refer to the <a href="https://github.com/vesparny/ng-kickstart/#readme" target="_blank">documentation on the github project</a>.</strong>\n</p>\n<h3>What and Why</h3>\n<p>\n\n	<code>ng-kickstart</code> is an opinionated kickstart for single page application development in AngularJS 1.2 . It makes you development easy, keeps the structure of the project consistent and allows you to create a fully optimized production release whith a single grunt task.\n	I decided to build this tool because of the lack of a build system that let me develop a single page application keeping an organized file structure, and in the meantime that allows me to develop on a index.html file generated at build time, tied to my real backend.\n</p>\n<h3>Getting started</h3>\n<p>\n	Assume that you have <strong>Node.js and SASS</strong> installed.\n	You also need <strong>karma and bower</strong>.\n</p>\n\n<pre><code>\n$ sudo npm -g install grunt-cli karma bower\n</code></pre>\n\n<p>\nAfter that, install <code>ng-kickstart</code>\n</p>\n\n<pre><code>\n$ git clone git://github.com/vesparny/ng-kickstart yourProjectName\n$ cd yourProjectName\n$ npm install\n$ bower install\n$ grunt serve\n</code></pre>\n\n<p>\nYou are now ready to go, your applcation is avalable at <code>http://127.0.0.1:9000</code>.\nEvery request to <code>/api</code> will be proxied to <code>http://127.0.0.1:9001/api</code>.\n</p>\n<p>\nIn the <strong>/backend/silex</strong> folder, you can find an example REST api written with Silex PHP micro-framework. Refer to the README.md present in that folder and launch the api.\nThen go to <code>http://127.0.0.1:9000/notes</code>.\n\nYou are now ready to start coding, every file you add, edit or delete into the <strong>/webapp</strong> folder, will be handled by the build system.\n</p>\n<p>\nWhen you are ready to build a production release there is a task for that.\n</p>\n\n<pre><code>\n$ grunt dist\n</code></pre>\n\n<p>\nAfter the task has finished you can find an optimized version of your project into the <strong>/build/dist</strong> folder.\n</p>\n<hr/>\n<p class="text-center">\n<strong>Inspired by ng-boilerplate, yeoman and so many other beautiful projects.</strong>\n</p>\n</div>\n')}]),angular.module("app/home/home.tpl.html",[]).run(["$templateCache",function($templateCache){$templateCache.put("app/home/home.tpl.html",'<div class="row">\n	<div class="large-9 columns">\n		<blockquote><h3>Speed up your AngularJS 1.2 development with a complete and scalable build system that scaffolds the project for you. Just focus on your app, <code>ng-kickstart</code> will take care of the rest.</h3>\n		</blockquote>\n	</div>\n	<div class="large-3 columns">\n		<a ng-href="/" class="button expand">\n			<i class="fa fa-download"></i>&nbsp;&nbsp;Download\n		</a>\n		<a href="https://github.com/vesparny/ng-kickstart/#readme" target="_blank" class="button secondary expand">\n			<i class="fa fa-share"></i>&nbsp;&nbsp;View on GitHub\n		</a>\n	</div>\n</div>\n\n<div class="text-center">\n	<ul class="inline-list">\n		<li>\n			<iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user=vesparny&amp;repo=ng-kickstart&amp;type=watch&amp;count=false" allowtransparency="true" frameborder="0" scrolling="0" width="85px" height="20px"></iframe>\n		</li>\n		<li>\n			<iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user=vesparny&amp;repo=ng-kickstart&amp;type=fork&amp;count=false" allowtransparency="true" frameborder="0" scrolling="0" width="85px" height="20px"></iframe>\n		</li>\n		<li class="tweet-btn">\n\n			<iframe allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/tweet_button.html?url=http%3A%2F%2Fbit.ly%2Fng-kickstart&amp;counturl=http%3A%2F%2Fvesparny.github.io%2Fng-kickstart&amp;text=Try%20ng-kickstart%20-%20AngularJS%20development%20made%20easy&amp;hashtags=angularjs&amp;via=vesparny&amp;related=vesparny" style="width:130px; height:20px;"></iframe>\n		</li>\n		<li><div plus-one></div></li>\n	</ul>\n</div>\n<hr/>\n<div class="row">\n	<div class="large-4 columns">\n		<img src="assets/img/angular-logo.png">\n		<h4>AngularJS</h4>\n		<p>The best JavaScript framework out there will power up your awesome app.\n		</p>\n	</div>\n\n	<div class="large-4 columns">\n		<img src="assets/img/grunt-logo.png">\n		<h3>Grunt</h3>\n		<p>A smart and scalable <a href="http://gruntjs.com" target="_blank">grunt</a> based build system will take care of your development workflow, as well as the optimization process for production release. <a ng-href="/docs">read more...</a></p>\n	</div>\n\n	<div class="large-4 columns">\n		<img src="assets/img/bower-logo.png">\n		<h3>Bower</h3>\n		<p><a href="http://bower.io" target="_blank">Bower</a> will handle your front-end dependencies.</p>\n	</div>\n\n</div>\n\n<div class="row">\n	<div class="large-4 columns">\n		<h4>SASS</h4>\n		<p><a href="http://sass-lang.com/">SASS</a> is the most mature, stable, and powerful professional grade CSS extension language.\n			Write your CSS in a modular way, the build system will compile your .scss files into a single css files. It should be easy to integrate less, stylus or any other preprocessor if you prefer.</p>\n		</div>\n\n		<div class="large-4 columns">\n			<h4>API Proxy</h4>\n			<p>If you are developing a single page application tied to a <code>real backend</code>, ng-kickstart will proxy every AJAX request to your backend listening on another port. You can configure this of course. <a ng-href="/docs">read more...</a></p>\n		</div>\n\n		<div class="large-4 columns">\n			<h4>Modular Structure</h4>\n			<p>Instead of angular-seed monolithic files structure, ng-kickstart comes with a <code>  by feature files organization</code>, keeping your code organized and fast reachable, especially if you are working on a large code base. If you don\'t like it, just your preferred structure, and the build system will still work. <a ng-href="/docs">read more...</a></p>\n		</div>\n\n	</div>\n\n	<div class="row">\n		<div class="large-4 columns">\n			<h4>Keep Your Code Reusable</h4>\n			<p>Every general purpose directives, services or filters, should be placed into a common directory, in this way you can copy and paste the directory into another project, require the modules you need, and you are ready to go with your new project. <a ng-href="/docs">read more...</a></p>\n		</div>\n\n		<div class="large-4 columns">\n			<h4>Unit Testing</h4>\n			<p>The build system comes with a special task for running test using <a href="http://karma-runner.github.io/" target="_blank">Karma Test Runner</a>.\n				Every time you make a production release, unit tests will be run for you.\n			</p>\n		</div>\n\n		<div class="large-4 columns">\n			<h4>REST Backend Included</h4>\n			<p>Ng-kickstart ships with a working <code>REST api</code> written with <a href="http://silex.sensiolabs.org/">Silex PHP micro-framework</a>.See the  <a ng-href="/docs">docs</a> form more information. It would be awesome to have more working example in other technologies. Please feel free to code, hack and send PR.</p>\n		</div>\n\n	</div>\n')}]),angular.module("app/notes/notes.tpl.html",[]).run(["$templateCache",function($templateCache){$templateCache.put("app/notes/notes.tpl.html",'<div class="panel text-center"><h4>This demo stores data into localStorage. Download <code>ng-kickstart</code> and take a look at the <a ng-href="/gettingStarted">getting started</a> section  to obtain version of the project working with a real RESTFul backend</h4></div>\n<div class="notes">\n	<form ng-submit="notesCtrl.addNote(notesCtrl.newNote)" novalidate name="addForm">\n		<div class="row">\n			<small class="error" ng-show="addForm.newNote.$invalid && !addForm.newNote.$pristine">Please fill the input</small>\n			<input type="text" ng-model="notesCtrl.newNote" name="newNote"  required\n			placeholder="Write a new note and hit enter..." maxlength="100" class="noteInput">\n\n		</div>\n	</form>\n	<form ng-repeat="note in notesCtrl.notes" class="" novalidate ng-submit="notesCtrl.updateNote(note)">\n		<div class="row">\n			<div class="large-8 columns large-centered">\n				<div class="row collapse">\n					<div class="small-11 columns">\n						<input type="text" class="" ng-model="note.note">\n					</div>\n					<div class="small-1 columns">\n						<a ng-click="notesCtrl.deleteNote($index, note.id)" class="button postfix"><i class="fa fa-minus-circle" ></i></a>\n					</div>\n				</div></div></div>\n			</form>\n		</div>\n')}]),angular.module("templates.common",[]);