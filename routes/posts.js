var mysql = require('./mysql');

function getUserPosts(req,res) {
	console.log("Get user Posts\n");
	var getUserPostQuery="select * from post where userId='"+req.session.userId+"' order by createTime desc";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			if(results.length > 0){
				res.send('welcomePage', { "userPosts" : results, "noPost": false });
			}
			else {    
				
				console.log("No post");
				res.send('welcomePage',  {"noPost": true});
			}
		}
	},getUserPostQuery);	
}

exports.getUserPosts = getUserPosts;

function getNewsFeed(req,res) {
	console.log("Get News Feed\n");
	var getNewsFeedQuery= "select t1.postContent , t2.firstname, t1.createTime as timeCreated from post t1 "
				+ "join user t2 on t2.user_id=t1.userId "
				+ "join friend t3 on t3.userId_1=t2.user_id "
				+ "where t3.userId_2='"+req.session.userId+"' "
				+ "union "
				+ "select t1.postContent, t2.firstname, t1.createTime as timeCreated from post t1 "
				+ "join user t2 on t2.user_id=t1.userId "
				+ "join friend t3 on t3.userId_2=t2.user_id " 
				+ "where t3.userId_1='"+req.session.userId+"' "
				+ "union "
				+ "select t1.postContent, t2.firstname, t1.createTime as timeCreated from post t1 "
				+ "join user t2 on t2.user_id=t1.userId "
				+ "where t2.user_id='"+req.session.userId+"' "
				+ "order by timeCreated desc";

	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			if(results.length > 0){
				res.send('userNewsFeed', { "newsFeed" : results, "noPost": false });
			}
			else {    
				
				console.log("No post");
				res.send('userNewsFeed',  {"noPost": true});
			}
		}
	},getNewsFeedQuery);	
}
exports.getNewsFeed = getNewsFeed;

function getNewsFeedPage(req,res) {
	if(req.session.username) {
	res.render('userNewsFeed', { "username" : JSON.stringify(req.session.username)});
	} else {
		res.render('main',  { message: 'Login Required', error: false});	
	}
}
exports.getNewsFeedPage = getNewsFeedPage;

function createPost(req,res) {
	console.log("Create user Posts\n");
	var postContent = req.param("postContent"); 
	postContent = postContent.replace("'", "\\'");
    console.log(postContent);
	postContent = postContent.replace("\n", "<br />");
    console.log(postContent);
    var createPostQuery="insert into post (userId, postContent) values ('"+req.session.userId+"', '"+postContent +"');";
	console.log("\nQuery is: "+createPostQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error in post.post' + err.message);
			throw err;
		} else {
			res.send('welcomePage', {"status":true});
		}
	},createPostQuery);
}

exports.createPost = createPost;

function getFriendPosts(req,res) {
	console.log("In getFriendPost\n");
	var getUserPostQuery="select * from post where userId='"+req.param("friendId")+"' order by createTime desc";
	//console.log("\nQuery is: "+getUserPostQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			if(results.length > 0){
				//console.log(JSON.stringify({ "userPosts" : JSON.stringify(results), "noPost": false }));
				res.send('friendProfile', { "userPosts" : results, "noPost": false });
			}
			else {    
				console.log("No post");
				res.send('friendProfile',  {"noPost": true});
			}
		}
	},getUserPostQuery);
}

exports.getFriendPosts = getFriendPosts;