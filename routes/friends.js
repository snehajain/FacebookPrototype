var mysql = require('./mysql');

function getUserFriends(req,res) {
	console.log("Get user Friends\n");
	var getUserFriendQuery =  "select firstname, lastname, user_id from user where user_id in (select userId_1 from friend where userId_2 = '"+req.session.userId+"') "
								+ " union "
								+ " select firstname, lastname, user_id from user where user_id in (select userId_2 from friend where userId_1 = '"+req.session.userId+"');";
	console.log("\nQuery is: "+getUserFriendQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			var getUserRequestsQuery = "select usr.firstname, usr.lastname, usr.user_id from user usr join friend_request fr on fr.requester_id=usr.user_id where fr.request_status='Pending' and fr.requestee_id ='"+req.session.userId+"';";
			mysql.fetchData(function(err, results2) {
				if(err) {
					console.log('Fetchdata error' + err.message);
					throw err;
				} else {
					console.log(JSON.stringify({ "userFriends" : JSON.stringify(results)}));
					res.send('welcomePage', { "userFriends" : results, "userRequests":results2});
				}
			},getUserRequestsQuery);
		}
	},getUserFriendQuery);	
}

exports.getUserFriends = getUserFriends;

function getUserProfile(req,res) {
	console.log("In getUserFriends");
	if(!req.session.userId) {
		res.render('main',  { message: 'Login Required', error: false});
	} else if(req.session.userId==req.param("userId")) { 
		res.render('welcomePage', { "username" : JSON.stringify(req.session.username), "isUser": true });
	} else {
		var getUserFriendQuery =  "select * from friend where userId_1= '"+req.param("userId")+"' and userId_2= '"+req.session.userId+"' "
			+ " union "
			+ " select * from friend where userId_2= '"+req.param("userId")+"' and userId_1= '"+req.session.userId+"' ";
		console.log("\nQuery is: "+getUserFriendQuery);
		mysql.fetchData(function(err, results) {
		if(err) {
		console.log('Fetchdata error' + err.message);
		throw err;
		} else {
		if(results.length>0) {
			console.log(JSON.stringify(results));
			res.render('friendProfile',{"isFriend":true, "friendId":req.param("userId"), "username": JSON.stringify(req.session.username)});
		} else {
			res.render('friendProfile',{"isFriend":false, "friendId":req.param("userId"), "username": JSON.stringify(req.session.username)});
			}
		}
		},getUserFriendQuery);
	}
}

exports.getUserProfile = getUserProfile;

function getFriendAbout(req,res) {
	var getFriendAboutQuery =  "select description as Description, education as Education, employment as Employment, contactNo as ContactNumber, dateOfBirth as DateOfBirth from userInfo where userId='"+req.param("friendId")+"';";
	console.log("\nQuery is: "+getFriendAboutQuery);
	mysql.fetchData(function(err, results) {
	if(err) {
	console.log('User About: ' + err.message);
	throw err;
	} else {
		var getUserEventsQuery = "select event_title, event_desc, event_date from life_events where user_id = '"+req.param("friendId")+"' order by event_date desc;";
		mysql.fetchData(function(err, results2) {
			if(err) {
			console.log('User About: ' + err.message);
			throw err;
			} else {
				if(results.length!=0) {
					console.log(JSON.stringify({ "userAbout" : (results[0])}));
					res.send('friendProfile', { "userAbout" : (results[0]), 'noData':false, "userEvents": results2});
				} else {
					var defaultValues = {Description:'', DoB:'', Education:'', Employment:'','ContactNumber':''};
					res.send('friendProfile', { "userAbout" : defaultValues, 'noData':true, "userEvents": results2});
				}
			}
		}, getUserEventsQuery);
	}
	},getFriendAboutQuery);
}

exports.getFriendAbout = getFriendAbout;

function getFriendFriends(req,res) {
	console.log("In getFriendFriends\n");
	var getUserFriendQuery =  "select firstname, lastname, user_id from user where user_id in (select userId_1 from friend where userId_2 = '"+req.param("friendId")+"') "
								+ " union "
								+ " select firstname, lastname, user_id from user where user_id in (select userId_2 from friend where userId_1 = '"+req.param("friendId")+"');";
	console.log("\nQuery is: "+getUserFriendQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			console.log(JSON.stringify({ "userFriends" : JSON.stringify(results)}));
			res.send('friendProfile', { "userFriends" : results});
		}
	},getUserFriendQuery);	
}

exports.getFriendFriends = getFriendFriends;

function getFriendInterests(req,res) {
	console.log("Get friend Interests\n");
	var getUserInterestsQuery="select i.title, i.interest_type, i.description, i.interest_id from interests i join user_interest ui on ui.interest_id=i.interest_id where ui.user_id='"+req.param("friendId")+"' order by i.interest_type";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			var music = new Array();
			var movies = new Array();
			var books = new Array();
			var shows = new Array();
			var sports = new Array();
			for(var i=0; i<results.length; i++){
				switch(parseInt(results[i].interest_type)) {
				case 1: {
					music.push(results[i]);
					break;
				}
				case 2: {
					sports.push(results[i]);
					break;
				}
				case 3: {
					movies.push(results[i]);
					break;
				}
				case 4: {
					shows.push(results[i]);
					break;
				}
				case 5: {
					books.push(results[i]);
					break;
				}
				}
			}
			res.send('/',  {"music": music, "sports": sports, "shows": shows, "movies": movies, "books": books});
		}
	},getUserInterestsQuery);
}

exports.getFriendInterests = getFriendInterests;

function getFriendName(req,res) {
	if(!req.session.userId) {
		res.render('main',  { message: 'Login Required', error: false});
	} else {
		var getFriendNameQuery =  "select * from user where user_id='"+req.param("friendId")+"';";
		console.log("\nQuery is: "+getFriendNameQuery);
		mysql.fetchData(function(err, results) {
		if(err) {
		console.log('User About: ' + err.message);
		throw err;
		} else {
			if(results.length==0) {
				res.send('friendProfile', { "noUser" : "No such user exists"});
			} else {
			res.send('friendProfile', { "userData" : results[0]});
			}
		}
		},getFriendNameQuery);
	}
}

exports.getFriendName = getFriendName;

function getFriendRequestStatus(req,res) {
	var getRequestStatusQuery =  "select friend_request_id from friend_request where requester_id='"+req.param('friendId')+"' and requestee_id='"+req.session.userId+"' and active='t';";
	console.log("\nQuery is: "+getRequestStatusQuery);
	mysql.fetchData(function(err, results) {
	if(err) {
	console.log('User About: ' + err.message);
	throw err;
	} else {
		if(results.length>0) {
			res.send('friendProfile',{"requestStatus":"Respond To Request", "friendRequestId": results[0]});
		} else {
			var getRequestStatusQuery_2 = "select friend_request_id from friend_request where requestee_id='"+req.param('friendId')+"' and requester_id='"+req.session.userId+"' and active='t';";
			mysql.fetchData(function(err, results_2) {
				if(err) {
				console.log('User About: ' + err.message);
				throw err;
				} else {
					if(results_2.length>0) {
						res.send('friendProfile',{"requestStatus":"Request Pending", "friendRequestId": results_2[0]});
					} else {
						res.send('friendProfile',{"requestStatus":"Send Friend Request"});
					}
				}
				},getRequestStatusQuery_2);
			}
		}
	},getRequestStatusQuery);
}

exports.getFriendRequestStatus = getFriendRequestStatus;

function acceptRequest(req, res) {
	var acceptRequestQuery = "update friend_request set active = 'f', request_status='Accepted' where friend_request_id='"+req.param("friendRequestId")+"';";
	console.log(acceptRequestQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
		console.log('AcceptRequest friend_request update Error: ' + err.message);
		throw err;
		} else {
			var insertFriendQuery = "insert into friend (userId_2, userId_1) values ('"+req.param('friendId')+"','"+req.session.userId+"');";
			mysql.fetchData(function(err, results_2) {
				if(err) {
				console.log('insertFriendQuery error: ' + err.message);
				throw err;
				} else {
					res.send('friendProfile',{"isFriend":true});
				}
				},insertFriendQuery);
			}
		},acceptRequestQuery);
	
}
exports.acceptRequest = acceptRequest;

function declineRequest(req, res) {
	var declineRequestQuery = "update friend_request set active = 'f', request_status='Denied' where friend_request_id='"+req.param("friendRequestId")+"';";
	mysql.fetchData(function(err, results) {
		if(err) {
		console.log('AcceptRequest friend_request update Error: ' + err.message);
		throw err;
		} else {
			res.send('friendProfile',{"isFriend":false});
		}
	},declineRequestQuery);
}
exports.declineRequest = declineRequest;

function addAsFriend(req, res) {
	var addFriendQuery = "insert into friend_request (requester_id, requestee_id, request_status, active) values ('"+req.session.userId+"','"+req.param('friendId')+"','Pending','t');";
	console.log(addFriendQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
		console.log('addFriendQuery Error: ' + err.message);
		throw err;
		} else {
			res.send('friendProfile',{"isFriend":false});
		}
	},addFriendQuery);
}
exports.addAsFriend = addAsFriend;

function cancelRequest(req, res) {
	var canceRequestQuery = "update friend_request set active = 'f', request_status='Cancelled' where friend_request_id='"+req.param("friendRequestId")+"';";
	console.log(canceRequestQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
		console.log('addFriendQuery Error: ' + err.message);
		throw err;
		} else {
			res.send('friendProfile',{"isFriend":false});
		}
	},canceRequestQuery);
}
exports.cancelRequest = cancelRequest;

function unfriendUser(req,res){
	var unfriendUserQuery = "delete from friend where (userId_1 = '"+req.param("friend_id")+"' and userId_2='"+req.session.userId+"') or (userId_2 = '"+req.param("friend_id")+"' and userId_1='"+req.session.userId+"');";
	mysql.fetchData(function(err, results) {
		if(err) {
		console.log('unfriendUser Error: ' + err.message);
		throw err;
		} else {
			res.send('/');
		}
	},unfriendUserQuery);
}

exports.unfriendUser = unfriendUser;