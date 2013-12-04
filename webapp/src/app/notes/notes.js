angular.module('app.notes', [
	'ngRoute',
	'notes.service'
]).config(function config($routeProvider) {
	$routeProvider.when('/notes', {
		controller: 'NotesCtrl as notesCtrl',
		templateUrl: 'app/notes/notes.tpl.html',
		resolve: {
			notesList: function(NotesService) {
				return NotesService.get();
			}
		}
	});
}).controller('NotesCtrl', function($scope, NotesService, notesList) {

	function store(copy, message){
		NotesService.put(copy).then(function() {
			app.notes = copy;
			alertify.log(message);
			app.reset();
		});
	}

	var app = this;
	app.notes = notesList;

	app.reset = function() {
		$scope.addForm.$setPristine();
		app.newNote = '';
	};

	app.addNote = function(newNote) {
		if ($scope.addForm.$valid) {
			var copy = angular.copy(app.notes);
			copy.push({
				id: copy.length,
				note: newNote
			});
			store(copy, "note saved :)");
		}
	};
	app.deleteNote = function(index, id) {
		var copy = angular.copy(app.notes);
		copy.splice(index, 1);
		store(copy, "note deleted :)");

	};
	app.updateNote = function(note) {
		var copy = angular.copy(app.notes);
		var el = _.each(copy, function(element, index, list){
			if (element.id === note.id){
				element.note=note.note;
			}
		});
		store(copy, "note updated :)");
	};
});
