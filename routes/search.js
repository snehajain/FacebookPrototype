var mysql = require('./mysql');

function searchRequest(req,res) {
	if(!req.session.userId) {
		res.render('main',  { message: 'Login Required', error: false});
	} else {
		var getSearchQuery="select firstname, lastname, user_id from user where (firstname like '"+req.param('searchQuery')+"%' or lastname like '"+req.param('searchQuery')+"%') AND user_id != '"+req.session.userId+"' ;";
		console.log("\nQuery is: "+getSearchQuery);
		var results1;
		mysql.fetchData(function(err, results) {
			if(err) {
				console.log('searchRequest error' + err.message);
				throw err;
			} else {
				console.log("Search result: " + JSON.stringify(results));
				var getGroupQuery = "select group_name, group_id from groups where group_name like '"+req.param('searchQuery')+"%' ;";
				mysql.fetchData(function(err, results2) { 
					if(err) {
						console.log('searchRequest error' + err.message);
						throw err;
						} else {
							console.log(JSON.stringify(results2));
						res.render('search', {"username": JSON.stringify(req.session.username), "userResults" : JSON.stringify(results), "groupResults": JSON.stringify(results2)});	
						} 
					},getGroupQuery);
			}
		},getSearchQuery);
	}
}

exports.searchRequest= searchRequest;

function searchUser(req,res) {
	if(!req.session.userId) {
		res.render('main',  { message: 'Login Required', error: false});
	} else {
		var getSearchQuery="select * from user where firstname like '%"+req.param('searchQuery')+"%' or lastname like '%"+req.param('searchQuery')+"%';";
		console.log("\nQuery is: "+getSearchQuery);
		mysql.fetchData(function(err, results) {
			if(err) {
				console.log('searchRequest error' + err.message);
				throw err;
			} else {
				console.log("Search result: " + JSON.stringify(results));
				res.send('groupProfile', { "userResults" : JSON.stringify(results)});
			}
		},getSearchQuery);	
	}
}

exports.searchUser= searchUser;

function searchGroup(req,res) {
	Console.log("In searchGroup");
	//res.render('search', {"username": req.session.username});
}

exports.searchGroup= searchGroup;