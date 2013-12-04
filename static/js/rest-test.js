function UserListCtrl($scope, $http){
	$http.get("/users").success(function(result){
		console.log(result);
		$scope.users = result;
	});

	$scope.deleteElement = function(user){
		console.log(user);
		$http.delete("/users/" + user._id).success(function(result){
			console.log(result);
		});
	};

	$scope.addElement = function(user){
		console.log(user);
		$http.post("/users", user).success(function(result){
			console.log(result);
		});
	};
}

function GroupListCtrl($scope, $http){
	$http.get("/groups").success(function(result){
		console.log(result);
		$scope.groups = result;
	});

	$scope.deleteElement = function(group){
		console.log(group);
		$http.delete("/groups/" + group._id).success(function(result){
			console.log(result);
		});
	};

	$scope.addElement = function(group){
		console.log(group);
		$http.post("/groups", group).success(function(result){
			console.log(result);
		});
	};
}

function AIListCtrl($scope, $http){
	$http.get("/activity_items").success(function(result){
		console.log(result);
		$scope.ais = result;
	});

	$scope.deleteElement = function(ai){
		console.log(ai);
		$http.delete("/activity_items/" + ai._id).success(function(result){
			console.log(result);
		});
	};

	$scope.addElement = function(ai){
		console.log(ai);
		$http.post("/activity_items", ai).success(function(result){
			console.log(result);
		});
	};
}

function AlbumListCtrl($scope, $http){
	$http.get("/albums").success(function(result){
		console.log(result);
		$scope.albums = result;
	});

	$scope.deleteElement = function(){
		console.log(album);
		$http.delete("/albums/" + album._id).success(function(result){
			console.log(result);
		});
	};

	$scope.addElement = function(){
		console.log(album);
		$http.post("/albums", album).success(function(result){
			console.log(result);
		});
	};
}

function SongListCtrl($scope, $http){
	$http.get("/songs").success(function(result){
		console.log(result);
		$scope.songs = result;
	});

	$scope.deleteElement = function(){
		console.log(song);
		$http.delete("/songs/" + song._id).success(function(result){
			console.log(result);
		});
	};

	$scope.addElement = function(){
		console.log(song);
		$http.post("/songs", song).success(function(result){
			console.log(result);
		});
	};
}