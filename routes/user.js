var mysql = require('./mysql'); 

function getUserAbout(req, res) {
	console.log("User About get function");
	var getUserAboutQuery =  "select description as Description, education as Education, employment as Employment, contactNo as ContactNumber, dateOfBirth as DateOfBirth from userInfo where userId='"+req.session.userId+"';";
	console.log("\nQuery is: "+getUserAboutQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('User About: ' + err.message);
			throw err;
		} else {
			var getUserEventsQuery = "select event_title, event_desc, event_date from life_events where user_id = '"+req.session.userId+"' order by event_date desc;";
			mysql.fetchData(function(err, results2) {
				if(err) {
				console.log('User About: ' + err.message);
				throw err;
				} else {
					if(results.length!=0) {
						console.log(JSON.stringify({ "userAbout" : (results[0])}));
						res.send('welcomePage', { "userAbout" : (results[0]), 'noData':false, "userEvents": results2});
					} else {
						var defaultValues = {Description:'', DateOfBirth:'', Education:'', Employment:'','ContactNumber':''};
						res.send('welcomePage', { "userAbout" : defaultValues, 'noData':true, "userEvents": results2});
					}
				}
			},getUserEventsQuery);
		}
	},getUserAboutQuery);
}

exports.getUserAbout = getUserAbout;

function editAbout(req, res) {
	console.log(req.param('userAbout'));
	if(req.param('userAbout')['DateOfBirth']!='') {
		var getUserAboutQuery =  "INSERT INTO userInfo (userId, description, education, employment, dateOfBirth, contactNo) "
							+ "VALUES('"+req.session.userId+"', '"+req.param('userAbout').Description+"', '"+req.param('userAbout')['Education']+"', '"+req.param('userAbout')['Employment']+"', DATE_FORMAT('"+req.param('userAbout')['DateOfBirth']+"','%Y/%m/%d'),'"+req.param('userAbout')['ContactNumber']+"') " 
							+ " ON DUPLICATE KEY UPDATE description='"+req.param('userAbout').Description+"',education='"+req.param('userAbout')['Education']+"', "
							+ " employment = '"+req.param('userAbout')['Employment']+"', dateOfBirth=DATE_FORMAT('"+req.param('userAbout')['DateOfBirth']+"','%Y/%m/%d'), contactNo='"+req.param('userAbout')['ContactNumber']+"';";
	} else {
		var getUserAboutQuery =  "INSERT INTO userInfo (userId, description, education, employment, contactNo) "
			+ "VALUES('"+req.session.userId+"', '"+req.param('userAbout').Description+"', '"+req.param('userAbout')['Education']+"', '"+req.param('userAbout')['Employment']+"','"+req.param('userAbout')['ContactNumber']+"') " 
			+ " ON DUPLICATE KEY UPDATE description='"+req.param('userAbout').Description+"',education='"+req.param('userAbout')['Education']+"', "
			+ " employment = '"+req.param('userAbout')['Employment']+"', contactNo='"+req.param('userAbout')['ContactNumber']+"';";
	}
	console.log("\nQuery is: "+getUserAboutQuery);
	mysql.fetchData(function(err, results) {
	if(err) {
	console.log('User Edit About: ' + err.message);
	throw err;
	} else {
	//console.log(JSON.stringify({ "userAbout" : (results[0])}));
	res.send('welcomePage', {"status":true});
	}
	},getUserAboutQuery);	
}

exports.editAbout = editAbout;

