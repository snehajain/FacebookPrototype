var mysql = require('./mysql');

function getUserInterests(req,res) {
	console.log("Get user Interests\n");
	var getUserInterestsQuery="select i.title, i.interest_type, i.description, i.interest_id from interests i join user_interest ui on ui.interest_id=i.interest_id where ui.user_id='"+req.session.userId+"' order by i.interest_type";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			console.log("In getUserInterests");
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

exports.getUserInterests = getUserInterests;

function removeInterest(req,res){
	var removeInterestQuery = "delete from user_interest where user_id = '"+req.session.userId+"' and interest_id = '"+req.param("interest_id")+"';";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('removeInterest error' + err.message);
			throw err;
		} else {			
			res.send('/');	
		} 
	},removeInterestQuery);
}

exports.removeInterest = removeInterest;

function searchInterest(req,res) {
	var searchInterestQuery = "select i.title, i.interest_type, i.description, i.interest_id from interests i where i.interest_type = '"+req.param("interestType")+"' and (i.title like '"+req.param('queryName').replace("'","\\'")+"%' or i.description like '"+req.param('queryName').replace("'","\\'")+"%') AND " +
			"i.interest_id not in (select ui.interest_id from user_interest ui where ui.user_id='"+req.session.userId+"') LIMIT 5;";
	console.log("searchInterestQuery: "+searchInterestQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('searchInterest error' + err.message);
			throw err;
		} else {
			res.send('/',{"searchResults" : results});
		} 
	},searchInterestQuery);
}
exports.searchInterest = searchInterest;

function addInterest(req,res) {
	var addInterestQuery = "insert into user_interest values ('"+req.param("interest_id")+"','"+req.session.userId+"');";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('addInterest error' + err.message);
			throw err;
		} else {			
			res.send('/');	
		} 
	},addInterestQuery);
}

exports.addInterest= addInterest;

function getInterestPage(req,res) {
	if(!req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',  { message: 'Login Required', error: false});
	} else {
		console.log("In getIntPage");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('interest',{"username":JSON.stringify(req.session.username), message: JSON.stringify("Add interest to our list")});
	}
}

exports.getInterestPage = getInterestPage;

function createInterest(req,res) {
	var addInterestQuery = "insert into interests (interest_type, title, description) values ('"+req.param("interest_type")+"','"+req.param("title").replace("'","\\'")+"', '"+req.param("description").replace("'","\\'")+"');";
	console.log("addInterestQuery " + addInterestQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('createInterest error' + err.message);
			throw err;
		} else {			
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render('interest',{"username":JSON.stringify(req.session.username), message: JSON.stringify("Interest created!! Add more interest to our list")});	
		} 
	},addInterestQuery);
}

exports.createInterest = createInterest;