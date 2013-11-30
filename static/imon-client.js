$(document).ready(function(){

	$('#addNewSongForm').submit(function(event){
		var songTitle = $("#title-input").val();
		var songArtist = $("#artist-input").val();
		var songAlbum = $("#album-input").val();
		if((songTitle !== null || songTitle !== '') && (songArtist !== null || songArtist !== '')){
			console.log("Add new song clicked: ", event);
			handleNewSong({title: songTitle, artist: songArtist, album: songAlbum});
		}
		else{
			console.log("Handle empty string");
		}
	});




	//handleNewSong({title: "Yo Mama", artist: "Yo daddy", album: "Lettuce"});

});

function UserPanelCtrl($scope, $http){
	$http.get("/users/8").success(function(result){
		console.log(result);
		$scope.userName = result.data.first_name + " " + result.data.last_name;
	});
}

function RecentSongsCtrl($scope, $http){
	$http.get("/activity", {
		params: {user_id: 8}}).success(function(result){
		console.log(result);
		$scope.songs = result.data;
	});
}

function UserGroupsCtrl($scope, $http, $window, $document){
	$http.get("/groups/8").success(function(result){
		console.log(result);
		$scope.groups = result.data;
	});


	// function populateActivity(i){
	// 	if(i < $scope.groups.length){
	// 		$http.get("/activity", {
	// 			params: {group_id: i}}).success(function(result){
	// 			$scope.groups[i].activity = result.data;
	// 			console.log(result);
	// 			i++;
	// 			populateActivity(i);
	// 		});
	// 	}
	// }

	// populateActivity(0);

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
}