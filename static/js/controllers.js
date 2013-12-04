var wayoControllers = angular.module('wayoControllers', []);

wayoControllers.controller('HomeCtrl', ['$scope', '$http',
	function($scope, $http){
		$http.get("/users/").success(function(result){
			console.log(result);
			$scope.user = result.data;
		});

		$http.get("/activity", {
			params: {user_id: 8}}).success(function(result){
			console.log(result);
			$scope.songs = result.data;
		});
			
		$http.get("/groups/8").success(function(result){
			$scope.groups = result.data;
			console.log("user group controller: ", $scope.groups);
		});


	$scope.handleNewSong = function($event, song, group){
		//POST new song to server and make button have success and be disabled
		console.log(group);
		var data = {song: song, group: group};
		if(song !== undefined){
			$http.post("/song", data).success(function(result){
				console.log(result);
				// if(result.success === true){
				// 	$event.target.className = "btn btn-success disabled";
				// 	$event.target.innerHTML = "Added Song!";
				// }
				//handleCloseModal();
			});
			// $http.get("/songs/" + group.id).success(function(result){
			// 	console.log(result);
			// 	$scope.groupSongs = result.data;
			// });
		}
	};

	var handleCloseModal = function(){
		//Change button back to blue and clickable
		//Clear input fields
		// var buttonTarget = $document[0].querySelectorAll('#addNewSongButton')[0];
		// buttonTarget.className = "btn btn-primary";
		// buttonTarget.innerHTML = "Save Changes";

		var titleTarget = $document[0].querySelectorAll('#title-input')[0];
		var artistTarget = $document[0].querySelectorAll('#artist-input')[0];
		var albumTarget = $document[0].querySelectorAll('#album-input')[0];

		titleTarget.value = "";
		artistTarget.value = "";
		albumTarget.value = "";
	};
}]);