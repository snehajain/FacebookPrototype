var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();


var pool      =    mysql.createPool({
    host: 'localhost',
	user:'root',
	password:'',
	database:'test',
	port: 3307,
	connectionLimit : 10,
	waitForConnections : true,
    queueLimit : 500
});

function fetchData(callback, sqlQuery) {
	pool.getConnection(function(err, connection) {
        if (err) { 
        	throw err;
        	connection.release();
        }
        connection.query(sqlQuery, function(err, rows, fields) {
        	connection.release();
            if (err) {
    			console.log("ERROR: " + err.message);
    		} else {	
    			callback(err, rows);
    		}
        });
	});
}

exports.fetchData = fetchData;

function multipleInsert(callback, sqlQuery, values) {
	pool.getConnection(function(err, connection) {
        if (err) { 
        	throw err;
        	connection.release();
        }
        connection.query(sqlQuery, [values], function(err, rows, fields) {
    		if(err){
    			console.log("ERROR: " + err.message);
    		}
    		else 
    		{	
    			callback(err, rows);
    		}
    	});
	});
}

exports.multipleInsert = multipleInsert;