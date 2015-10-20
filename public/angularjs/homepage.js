var app = angular.module("userPage",['ngSanitize']);
		app.controller('userHomePage',function($scope, $http, $sce, $interval){
			$scope.loadPosts = function() {
				$http.get('/getUserPosts').success(function(data) {
				console.log("Success in Posts GET!!\n");
				$scope.userPosts = data.userPosts;
				$scope.postCreated = false; //re-check
				}); 
			};

			$scope.loadFriends = function() {
				$http.get('/getUserFriends').success(function(data) {
				console.log("Success in Friends GET!!\n");
				$scope.userFriends = data.userFriends;
				$scope.userRequests = data.userRequests;
				}); 
			};

			$scope.loadAbout = function() {
				$http.get('/getUserAbout').success(function(data) {
				console.log("Success in About GET!!\n");
				$scope.userAbout = data.userAbout;
				if($scope.userAbout.DateOfBirth) {
					var tempDate = new Date($scope.userAbout.DateOfBirth);
					$scope.userAbout.DateOfBirth = (tempDate.getMonth()+1)+'-'+tempDate.getDate()+'-'+tempDate.getFullYear();
				}
				$scope.userEvents = data.userEvents;
				$scope.modifiedUserAbout=angular.copy($scope.userAbout);
				
				}); 
			};

			$scope.loadInterests = function() {
				$http.get('/getUserInterests').success(function(data) {
				console.log("Success in loadInterests GET!!\n");
				$scope.userMusic = data.music;
				$scope.userMovies = data.movies;
				$scope.userSports = data.sports;
				$scope.userBooks = data.books;
				$scope.userShows = data.shows;
				$scope.searchList = new Array(5);
				}); 
			};
					
			$scope.redirectToFriend = function(user_id) {
				console.log('in redirectToFriend');
				console.log ("user_id: " + user_id);
			};

			$scope.createPost = function() {
				$http({
					url:'/createPost',
					method:'POST',
					data: {"postContent":$scope.newPost.postContent},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){

				$scope.newPost.postContent = null;
				$scope.postCreated = data.status;
				$scope.loadPosts();
				console.log("Post Created");
			}).error(function(data){
				$scope.postCreated = false;
				console.log("Post Error");
			});
			}

			$scope.onCancelClick = function(){
				$scope.EditAbout=false;
				console.log('ModeUser: ' + $scope.userAbout.ContactNumber);
				$scope.modifiedUserAbout=angular.copy($scope.userAbout);
			}

			$scope.editAboutCall =  function() {
				if($scope.modifiedUserAbout.DateOfBirth) {
					var tempDate = new Date($scope.modifiedUserAbout.DateOfBirth);
					if(!isFinite(tempDate)) {
						$scope.dateErrorMessage="DateOfBirth entered is invalid";
						return;
					} else {
						$scope.modifiedUserAbout.DateOfBirth = tempDate.getFullYear()+'/'+(tempDate.getMonth()+1)+'/'+tempDate.getDate();
						$scope.dateErrorMessage=""
					}
				}
				$http({
					url:'/editAbout',
					method:'PUT',
					data: {"userAbout":$scope.modifiedUserAbout},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){
				$scope.EditAbout = false;
				$scope.loadAbout();
				console.log("About Editted Created");
			}).error(function(data){
				console.log("About Edit Error");
			});
			}

			$scope.unfriendUser = function(userId) {
				$http({
					url:'/unfriendUser',
					method:'PUT',
					data: {"friend_id":userId},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){
				$scope.loadFriends();
				console.log("Success in unfriendUser");
			}).error(function(data){
				console.log("About Edit Error");
			});
			}

			$scope.gotoNewsFeed = function() {
				console.log("In gotoNewsFeed");
				$http.get('/userNewsFeed').success(function(data) {console.log("Success in gotoNewsFeed")});
			}

			$scope.removeInterest = function(interest_id){
				$http({
					url:'/removeInterest',
					method:'PUT',
					data: {"interest_id":interest_id},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){
				$scope.loadInterests();
				console.log("Success in unfriendUser");
			}).error(function(data){
				console.log("About Edit Error");
			});
			}

			$scope.searchInterest = function(queryName, interestType) {
				$http.get('/searchInterest?queryName=' + queryName + '&interestType=' + interestType).success(function(data) {
				console.log("Success in searchInterest GET!!\n");
				switch(parseInt(interestType)){
					case 1: {
						$scope.searchList = new Array(5);
						$scope.searchList[0] = data.searchResults;
						$scope.musicName = "";
						break;
					}
					case 2: {
						$scope.searchList = new Array(5);
						$scope.searchList[1] = data.searchResults;
						$scope.sportName = "";
						break;
					}
					case 3: {
						$scope.searchList = new Array(5);
						$scope.searchList[2] = data.searchResults;
						$scope.movieName = "";
						break;
					}
					case 4: {
						$scope.searchList = new Array(5);
						$scope.searchList[3] = data.searchResults;
						$scope.showName = "";
						break;
					}
					case 5: {
						$scope.searchList = new Array(5);
						$scope.searchList[4] = data.searchResults;
						$scope.bookName = "";
						break;
					}
				}
				});
			}

			$scope.addInterest = function(interest_id) {
				console.log("In Add interest");
				$http({
					url:'/addInterest',
					method:'POST',
					data: {"interest_id":interest_id},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){
					$scope.loadInterests();
					console.log("Success in unfriendUser");
				}).error(function(data){
					console.log("About Edit Error");
				});
			}
		
			$scope.toTrustedHTML = function( html ){
 			   return $sce.trustAsHtml( html );
			}

			$scope.addEvent = function(){
				if(!($scope.newEvent.event_title&&$scope.newEvent.event_date)) {
					$scope.newEventErrorMessage="Event Title and Date are required";
					return;
				} else {
					var tempDate = new Date($scope.newEvent.event_date);
					if(!isFinite(tempDate)) {
						$scope.newEventErrorMessage="Event date entered is invalid";
						return;
					} else {
						$scope.newEvent.event_date = tempDate.getFullYear()+'/'+(tempDate.getMonth()+1)+'/'+tempDate.getDate();
						}
					$scope.newEventErrorMessage = "";
				}
				if(!$scope.newEvent.event_desc) {
					$scope.newEvent.event_desc ="";
				}
				console.log("In add event");
				$http({
					url:'/addEvent',
					method:'POST',
					data: {"newEvent":$scope.newEvent},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){
					$scope.loadAbout();
					$scope.newEvent.event_title = '';
					$scope.newEvent.event_desc = '';
					$scope.newEvent.event_date = '';
					$('#addLifeEventModal').modal('hide');
				}).error(function(data){
					console.log("About Edit Error");
				});
				
			}
			$interval(function(){
			console.log("Upadted!!");
			},1000000);
		//On page load
		$scope.loadPosts();
		$scope.loadFriends();		
		$scope.loadAbout();
		$scope.loadInterests();		
		});

	angular.module('userPage').filter('datetime', function($filter)
	{
	 return function(input)
	 {
	  if(input == null){ return ""; } 
	 
	  var _date = $filter('date')(new Date(input),
	                              'HH:mm a MMM dd yyyy');
	 
	  return _date.toUpperCase();

	 };
	});