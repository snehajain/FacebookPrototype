var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session  = require('express-session');
var mysql = require('mysql'); //check
var passwordHash = require('password-hash');

var login = require('./routes/login');
var posts = require('./routes/posts');
var signup = require('./routes/signup');
var routes = require('./routes/index');
var friends = require('./routes/friends');
var users = require('./routes/users');
var user = require('./routes/user');
var search = require('./routes/search');
var groups = require('./routes/groups');
var interests = require('./routes/interests');
var events = require('./routes/events');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'secretValue',
	resave: true,
    saveUninitialized: true}));

//app.use('/', routes);
app.use('/users', users);

app.get('/', routes.index);
app.get('/signup',signup.getSignup);
app.post('/signup', signup.createUser);
app.post('/login',login.validateLogin);
app.get('/login',login.getLogin);
app.get('/getUserPosts',posts.getUserPosts);
app.get('/getUserFriends',friends.getUserFriends);
app.get('/getUserInterests', interests.getUserInterests);
app.put('/removeInterest', interests.removeInterest);
app.get('/searchInterest', interests.searchInterest);
app.post('/addInterest', interests.addInterest);
app.post('/createInterest', interests.createInterest);
app.get('/createInterest', interests.getInterestPage);
app.post('/createPost',posts.createPost);
app.get('/userNewsFeed',posts.getNewsFeedPage);
app.get('/getNewsFeed',posts.getNewsFeed);
app.get('/logout',login.logout);
app.get('/getUserAbout',user.getUserAbout);
app.put('/editAbout',user.editAbout);
app.get('/searchQuery',search.searchRequest);
app.get('/getUserProfile',friends.getUserProfile);
app.get('/getFriendName',friends.getFriendName);
app.get('/getFriendPosts',posts.getFriendPosts);
app.get('/getFriendAbout',friends.getFriendAbout);
app.get('/getFriendFriends',friends.getFriendFriends);
app.get('/getFriendInterests',friends.getFriendInterests);
app.get('/getFriendRequestStatus',friends.getFriendRequestStatus);
app.post('/acceptRequest',friends.acceptRequest);
app.post('/declineRequest',friends.declineRequest);
app.post('/addAsFriend',friends.addAsFriend);
app.post('/cancelRequest',friends.cancelRequest);
app.put('/unfriendUser',friends.unfriendUser);
app.get('/groups',groups.getGroups);
app.post('/createGroup',groups.createGroup);
app.get('/searchUser',groups.searchUser);
app.get('/groupProfile',groups.getGroupProfile);
app.post('/addMember',groups.addMember);
app.put('/leaveGroup', groups.deleteMember);
app.put('/updateGroup', groups.updateGroup);
app.put('/deleteGroup',groups.deleteGroup);
app.get('/getMyGroups',groups.getMyGroups);
app.post('/addEvent', events.addEvent);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log(res.toString());
	console.log(req.toString());
	var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    //res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
