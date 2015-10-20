var app = angular.module("friendProfilePage",['ngSanitize']);
		app.controller('friendProfilePageController',function($scope, $http, $sce){
			$scope.loadData = function() {
				$http.get('/getFriendName?friendId='+$scope.friendId).success(function(data) {
					if(data.noUser) {
						$scope.noData = true;	
					} else  {
					$scope.friendFirstName = data.userData.firstname;
					$scope.friendLastName = data.userData.lastname;
					}
					}); 

				if($scope.isFriend) {
					$http.get('/getFriendPosts?friendId='+$scope.friendId).success(function(data) {
					$scope.userPosts = data.userPosts;
					}); 

					$http.get('/getFriendFriends?friendId='+$scope.friendId).success(function(data) {
					$scope.userFriends = data.userFriends;
					}); 

					$http.get('/getFriendAbout?friendId='+$scope.friendId).success(function(data) {
					console.log("Success in About GET!!\n");
					$scope.userAbout = data.userAbout;
						if($scope.userAbout.DateOfBirth) {
							var tempDate = new Date($scope.userAbout.DateOfBirth);
							$scope.userAbout.DateOfBirth = (tempDate.getMonth()+1)+'-'+tempDate.getDate()+'-'+tempDate.getFullYear();
						}
					$scope.userEvents = data.userEvents;
					}); 

					$http.get('/getFriendInterests?friendId='+$scope.friendId).success(function(data) {
						console.log("Success in Interest GET!!\n");
						$scope.userMusic = data.music;
						$scope.userMovies = data.movies;
						$scope.userSports = data.sports;
						$scope.userBooks = data.books;
						$scope.userShows = data.shows;
					});
				} else {
					$http.get('/getFriendRequestStatus?friendId='+$scope.friendId).success(function(data) {
					console.log("Success in getFriendRequestStatus\n");
					$scope.requestStatus = data.requestStatus;
					$scope.friendRequestId = data.friendRequestId.friend_request_id || -1;
					}); 
				}
			};

			$scope.changeRequestStatus = function(responseStatus) {
				console.log("In change req");
				$http({
					url:'/' + responseStatus,
					method:'POST',
					data: {"friendId":$scope.friendId, "friendRequestId": $scope.friendRequestId},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){
					$scope.isFriend = data.isFriend;
					$scope.loadData();
					// $scope.friendRequestId = data.friend_request_id || -1;
					console.log("changeRequestStatus success");
				}).error(function(data){
					console.log("changeRequestStatus Error");
				});

			}

			$scope.gotoNewsFeed = function() {
				console.log("In gotoNewsFeed");
				$http.get('/userNewsFeed').success(function(data) {console.log("Success in gotoNewsFeed")});
			}
		
			$scope.toTrustedHTML = function( html ){
 			   return $sce.trustAsHtml( html );
			}
		});

angular.module('friendProfilePage').filter('datetime', function($filter)
	{
	 return function(input)
	 {
	  if(input == null){ return ""; } 
	 
	  var _date = $filter('date')(new Date(input),
	                              'HH:mm a MMM dd yyyy');
	 
	  return _date.toUpperCase();

	 };
	});