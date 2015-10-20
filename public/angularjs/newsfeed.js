var app = angular.module("newsPage",['ngSanitize']);
		app.controller('newsFeed',function($scope, $http, $sce){
			$scope.loadNewsFeed = function() {
				$http.get('/getNewsFeed').success(function(data) {
				console.log("Success in newsFeed GET!!\n");
				$scope.newsFeed = data.newsFeed;
				}); 
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
			$scope.loadNewsFeed();
			console.log("Post Created");
		}).error(function(data){
			$scope.postCreated = false;
			console.log("Post Error");
		});
		}
		$scope.toTrustedHTML = function( html ){
 			   return $sce.trustAsHtml( html );
		}
		//On page load
		console.log("In user feed ejs");
		$scope.loadNewsFeed();		
		});

angular.module('newsPage').filter('datetime', function($filter)
	{
	 return function(input)
	 {
	  if(input == null){ return ""; } 
	 
	  var _date = $filter('date')(new Date(input),
	                              'HH:mm a MMM dd yyyy');
	 
	  return _date.toUpperCase();

	 };
	});