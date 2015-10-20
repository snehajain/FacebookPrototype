//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('main',  { header: 'Login', error: false});
//});
//
//module.exports = router;

exports.index = function(req, res) {
	if(req.session.userId) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('welcomePage', { "username" : JSON.stringify(req.session.username), "isUser": true });
	} else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',  { header: 'Login', error: false, message: "Please enter your login credentials"});
	}
}