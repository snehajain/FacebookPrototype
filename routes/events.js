var mysql=require('./mysql');

function addEvent(req,res) {
	console.log("In addEvent");
	var addEventQuery = "insert into life_events (user_id, event_title, event_desc, event_date) values ('"+req.session.userId+"', '"+req.param("newEvent").event_title+"', '"+req.param("newEvent").event_desc+"', DATE_FORMAT('"+(req.param("newEvent").event_date)+"','%Y/%m/%d'));"
	console.log(addEventQuery);
	mysql.fetchData(function(err, results) {
		if(err) {
		console.log('AddEvent Error: ' + err.message);
		throw err;
		} else {
			console.log('Success');
			res.send('/');
		}
	},addEventQuery);
}

exports.addEvent = addEvent;