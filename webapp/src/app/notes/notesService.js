angular.module('notes.service', []).
factory('NotesService', function($q, $timeout, cfpLoadingBar) {
	var STORAGE_ID = 'ng-kickstart';

	var get = function() {
		cfpLoadingBar.start();
		var deferred = $q.defer();

		$timeout(function() {
			var data = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			cfpLoadingBar.complete();
			deferred.resolve(data);
		}, 500);

		return deferred.promise;
	};

	var put = function(elems) {
		cfpLoadingBar.start();
		var deferred = $q.defer();
		$timeout(function() {
			localStorage.setItem(STORAGE_ID, JSON.stringify(elems));
			cfpLoadingBar.complete();
			deferred.resolve();
		}, 500);

		return deferred.promise;
	};


	return {
		get: get,
		put: put
	};
});
