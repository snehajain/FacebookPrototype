var app = angular.module('groupProfile',['ngSanitize']);
app.controller('groupProfileController', function($http, $scope, $sce, $window){
	$scope.updatedGroupData = [];
	$scope.leftGroup = false;

	$scope.searchUser = function(userName) {
		$http.get('/searchUser?userName=' + userName ).success(function(data) {
		console.log("Success in Posts GET!!\n");
		$scope.userList = data.userResults;
		}); 
	}

	$scope.joinGroup = function(){
		console.log("In join group");
		$http({
			url:'/addMember',
			method:'POST',
			data: {"group_id":$scope.groupData.group_id},
			responseType: "json",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			console.log("Success in joinGroup!!\n" + $scope.memberData[0]);
			if(!$scope.leftGroup) {
				console.log(JSON.stringify({"firstname":data.userLastname+"", "lastname": data.userLastname+"", "user_id":data.user_id}));
				$scope.memberData.push({"firstname":data.username, "lastname": data.userLastname, "user_id":data.user_id});
				$scope.leftGroup = true;
			}
			$scope.isMember = true;
		}).error(function(data){
			console.log("Post Error in joinGroup");
		});
	}

	$scope.leaveGroup = function() {
	console.log("In join group");
		$http({
			url:'/leaveGroup',
			method:'PUT',
			data: {"group_id":$scope.groupData.group_id},
			responseType: "json",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			console.log("Success in joinGroup!!\n");
			$scope.leftGroup = true;
			$scope.isMember = false;
		}).error(function(data){
			console.log("Post Error in joinGroup");
		});	
	}

	$scope.changeToEdit = function() {
		console.log("In changeToEdit");
		$scope.membersIds=[];
		for(var i=0; i<$scope.memberData.length; i++) {
			$scope.membersIds[i] = $scope.memberData[i].user_id;
		}
		$scope.updatedGroupData["groupName"]=$scope.groupData.group_name;
		$scope.updatedGroupData["groupDesc"]=$scope.groupData.description;
		$scope.editGroup = true;
	}

	$scope.addUser = function(user) {
		console.log("In addUser");
		$http({
			url:'/addMember',
			method:'POST',
			data: {"group_id":$scope.groupData.group_id, "member_id": user.user_id},
			responseType: "json",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			$scope.memberData.push(user);
			$scope.membersIds.push(user.user_id);
		}).error(function(data){
			console.log("Post Error in joinGroup");
		});
	}

	$scope.removeUser = function(user) {
		console.log("In removeUser");
		$http({
			url:'/leaveGroup',
			method:'PUT',
			data: {"group_id":$scope.groupData.group_id, "member_id":user.user_id},
			responseType: "json",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			console.log("Success in joinGroup!!\n");
			for(var i=0; i<$scope.memberData.length; i++) {
			if($scope.memberData[i].user_id==user.user_id) {
				$scope.memberData.splice(i,1);
				$scope.membersIds.splice(i,1);
				console.log("removed " +user.user_id);
				break;
			}
		}			
		}).error(function(data){
			console.log("Post Error in joinGroup");
		});	

	}

	$scope.updateGroup = function() {
		if(!($scope.updatedGroupData&&$scope.updatedGroupData.groupName)) {
			$scope.noGroupNameError = "Group Name cannot be null";
			return;
		} else  {
			$scope.noGroupNameError ="";
		}
		if(!$scope.updatedGroupData.groupDesc) {
			$scope.updatedGroupData.groupDesc ='';
		}
	$http({
		url:'/updateGroup',
		method:'PUT',
		data: {"groupName":$scope.updatedGroupData.groupName, "groupDesc": $scope.updatedGroupData.groupDesc, "group_id": $scope.groupData.group_id},
		responseType: "json",
		headers: {'Content-Type': 'application/json'}
	}).success(function(data){
		$scope.groupData.group_name= $scope.updatedGroupData.groupName;
		$scope.groupData.description=$scope.updatedGroupData.groupDesc;
		$scope.editGroup=false;
		//$window.location.href='/groupProfile?groupId='+ data.groupId;
	}).error(function(data){
		console.log("Post Error");
	});
	}

	$scope.resetEdit= function() {
		$scope.editGroup = false;
		$scope.membersIds=[]; 
		$scope.userList=[];
		$scope.userName = '';
		//$scope.groupName = '';
		//$scope.groupDesc = '';
	}

	$scope.deleteGroup = function() {
		$http({
			url:'/deleteGroup',
			method:'PUT',
			data: {"group_id": $scope.groupData.group_id},
			responseType: "json",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			$window.location.href='/groups';
		}).error(function(data){
			console.log("Post Error");
		});
	}

});