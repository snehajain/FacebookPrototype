var mysql = require('./mysql');
var hashFunction = require('./hashFunction'); //Check for

function getLogin(req, res) {
	if(req.session.userId) {
		res.render('welcomePage', { "username" : JSON.stringify(req.session.username)});	
	} else {
	res.render('main',  {message:"Login required"});
	}
}

exports.getLogin = getLogin;

function logout(req, res) {
	req.session.destroy();
	res.render('main',  {message:"Thank-you for stopping by"});
}

exports.logout = logout;

function validateLogin(req, res) {	
	var passwordHash = hashFunction.hash(req.param('password'), req.param('username'));
	var getUserQuery="select * from user where email='"+req.param("username")+"' and password='" + passwordHash +"'";
	mysql.fetchData(function(err, results) {
		if(err) {
			console.log('Fetchdata error' + err.message);
			throw err;
		} else {
			if(results.length > 0){
				req.session.username= results[0]["firstname"];
				req.session.userLastname= results[0]["lastname"];
				req.session.userId= results[0]["user_id"];
				res.render('welcomePage', { "username" : JSON.stringify(req.session.username), "isUser": true } , 
						function(err, result) {
					        if (!err) {
					            res.end(result);
					        }
					        else {
					            res.end('An error occurred');
					            console.log(err);
					        }
			    });
			}
			else {    
				res.render('main',  { message: 'Incorrect credentials. Please try again', error: true});
			}
		}
	},getUserQuery);
	
	
}
exports.validateLogin = validateLogin;