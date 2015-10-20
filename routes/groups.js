var mysql = require('./mysql');

function getGroups(req,res) {
	if(!req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',  { message: 'Login Required', error: false});
	} else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('groups',{"username":JSON.stringify(req.session.username)});
	}
}

exports.getGroups=getGroups;

function searchUser(req,res) {
	console.log("in searchUser");
	if(!req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',  { message: 'Login Required', error: false});
	} else {
	var searchQuery = "select firstname, lastname, user_id from user where (firstname like '"+req.param('userName')+"%' or lastname like '"+req.param('userName')+"%') AND user_id != '"+req.session.userId+"' ;";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('searchUser error' + err.message);
			throw err;
		} else {
			res.send('/',{"userResults" : results});
		} 
	},searchQuery);
	}
}

exports.searchUser=searchUser;

function createGroup(req,res) {
	var data = req.param('groupData');
	data.members.push(req.session.userId);
	var searchQuery = "insert into groups (group_name, creator_id, active_status, description) values ('" +
			data['groupName']+"' , '"+req.session.userId+"' , 't', '" +data['groupDesc']+"' );";
	console.log(searchQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('searchUser error' + err.message);
			throw err;
		} else {			
			var dataArray = [data.members.length];
			for(var i=0; i<data.members.length; i++) {
				dataArray[i]=[results.insertId, data.members[i]];
			}
			console.log(dataArray);
			var memberAddQuery = "insert into group_member (group_id, member_id) values ?;"; 
			mysql.multipleInsert(function(err, results_2) {
				if(err) {
					console.log('searchUser error' + err.message);
					throw err;
				} else {
					console.log("Insert members success ");
					res.send('groups',{"groupId":results.insertId});
				}
			},memberAddQuery, dataArray);	
		} 
	},searchQuery);
}

exports.createGroup=createGroup;

function getGroupProfile(req,res) {
	if(!req.session.userId) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',{message:"Login Required",error:true});
	} else {
		var getGroupProfileQuery = "select * from groups where group_id = "+req.param("groupId");
		mysql.fetchData(function(err, result){
			if(err) {
				console.log('getGroupProfile error' + err.message);
				throw err;
			} else {
				if(result.length==0) {
					res.render('groupProfile',{"username":JSON.stringify(req.session.username),"noGroup":true, "groupData":JSON.stringify(null), "memberData":JSON.stringify(null), "isMember": false, "isCreator": false});
					//res.status(err.status || 500);
//					  res.render('error', {
//					    message: "No such group found",
//					    error: {}
//					  });
				} else {
				var isCreator = false;
				var isMember = false; 
				var getGroupMemberQuery;
				if(result[0].creator_id==req.session.userId) {
					isCreator = true;
					isMember = true;
					getGroupMemberQuery = "select firstname, lastname, user_id from user usr join group_member gm on gm.member_id = usr.user_id" +
					" where gm.group_id=" + result[0].group_id + " and usr.user_id != " +req.session.userId;
				} else {
					getGroupMemberQuery = "select firstname, lastname, user_id from user usr join group_member gm on gm.member_id = usr.user_id" +
						" where gm.group_id=" + result[0].group_id;
				}
				mysql.fetchData(function(err, results2){
					if(err) {
						console.log('getGroupProfile error' + err.message);
						throw err;
					} else {
						if(!isCreator) {
							for(var i=0; i<results2.length; i++){
								if(results2[i].user_id==req.session.userId) {
									isMember=true;
									break;
								}
							}
						}
						res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
							res.render('groupProfile',{"username":JSON.stringify(req.session.username),"groupData":JSON.stringify(result[0]), "memberData":JSON.stringify(results2), "isMember": isMember, "isCreator": isCreator, "noGroup":false});
						}
				},getGroupMemberQuery); }
			}	
		}, getGroupProfileQuery);
	}
}
exports.getGroupProfile=getGroupProfile;

function addMember(req,res) {
	if(req.param("member_id")) {
		var searchQuery = "insert into group_member (member_id, group_id) values ('"+req.param("member_id")+"', '"+req.param("group_id")+"') ;";
	} else {
		var searchQuery = "insert into group_member (member_id, group_id) values ('"+req.session.userId+"', '"+req.param("group_id")+"') ;";
	}
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('addMember error' + err.message);
			throw err;
		} else {
			res.send('/', {"username": JSON.stringify(req.session.username),"userLastname":req.session.userLastname, "user_id":req.session.userId});
		} 
	},searchQuery);
}
exports.addMember=addMember;

function deleteMember(req,res) {
	console.log("in leaveGroup");
	if(req.param("member_id")) {
		var searchQuery = "delete from group_member where member_id = '"+req.param("member_id")+"' and group_id = '"+req.param("group_id")+"' ;";
	} else {
		var searchQuery = "delete from group_member where member_id = '"+req.session.userId+"' and group_id = '"+req.param("group_id")+"' ;";
	}
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('addMember error' + err.message);
			throw err;
		} else {
			res.send('groupProfile');
		} 
	},searchQuery);
}
exports.deleteMember = deleteMember;

function updateGroup(req,res){
	var updateGroupQuery = "update groups set group_name= '"+req.param("groupName")+"', description='"+req.param("groupDesc")+"' where group_id = '"+req.param("group_id")+"';"
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('updateGroup error' + err.message);
			throw err;
		} else {
			res.send('/');
		} 
	},updateGroupQuery);
}
exports.updateGroup = updateGroup;

function deleteGroup(req,res) {
	var deleteMembersQuery = "delete from group_member where group_id = '"+req.param("group_id")+"';";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('searchUser error' + err.message);
			throw err;
		} else {			
			var deleteGroupQuery = "delete from groups where group_id = '"+req.param("group_id")+"';"; 
			mysql.fetchData(function(err, results_2) {
				if(err) {
					console.log('searchUser error' + err.message);
					throw err;
				} else {
					console.log("Delete group success");
					res.send('/');
				}
			},deleteGroupQuery);	
		} 
	},deleteMembersQuery);
}
exports.deleteGroup=deleteGroup;

function getMyGroups(req,res){
	var getMyGroupQuery = "select group_name, group_id from groups where creator_id='"+req.session.userId+"';"
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('getMyGroups error' + err.message);
			throw err;
		} else {
			var getMyOtherGroupsQuery = "select * from groups grp join group_member gm on grp.group_id=gm.group_id " +
								 " where gm.member_id = '"+req.session.userId+"' and grp.creator_id != '"+req.session.userId+"' ;";
			mysql.fetchData(function(err, results2) {
				if(err) {
					console.log('getMyGroups error' + err.message);
					throw err;
				} else {
					var getFriendGroupsQuery = "select grp.group_name as group_name, grp.group_id as group_id  from groups grp "
												+ " join group_member gm "
												+ " on gm.group_id=grp.group_id " 
												+ "where gm.member_id in (select t1.userId_1 from friend t1 where t1.userId_2='"+req.session.userId+"' and gm.member_id=t1.userId_1) "
												+ " and gm.group_id not in (select group_id from group_member where member_id='"+req.session.userId+"') "
												+ " union " 
												+ " select grp.group_name as group_name, grp.group_id as group_id from groups grp "
												+ " join group_member gm "
												+ " on gm.group_id=grp.group_id " 
												+ " where gm.member_id in (select t1.userId_2 from friend t1 where t1.userId_1='"+req.session.userId+"' and gm.member_id=t1.userId_2) "
												+ " and gm.group_id not in (select group_id from group_member where member_id='"+req.session.userId+"');";
					console.log("getFriendGroupsQuery: " + getFriendGroupsQuery);
					mysql.fetchData(function(err, results3) {
						if(err) {
							console.log('friendGroupList error' + err.message);
							throw err;
						} else {
							res.send('/groups', {"myGroups":results,"otherGroups":results2, "friendGroupList": results3});
							}
					},getFriendGroupsQuery);
				}
			},getMyOtherGroupsQuery);
		} 
	},getMyGroupQuery);
}
exports.getMyGroups = getMyGroups;