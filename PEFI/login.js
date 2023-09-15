/*

To use a module in a Node.js app, we need to include it. Therefore, we need
to add the following variables to our login.js file:*/

const mysql = require('mysql2');

const express = require('express');

const session = require('express-session');

const path = require('path');

/*

The above code will include the MySQL, Express, Express-session, and Path
modules, and associate them with the variables we have declared. */

/*

To connect to our database with the following code:*/

const connection = mysql.createConnection({

host : 'localhost',

user : 'root',

//provide the password

password : 'web',

database : 'NODELOGIN'

});

/*

Express is what we'll use for our web application, which includes packages that are essential for server-side web
development, such as sessions and handling HTTP requests. */

const app = express();

app.use(session({

secret: 'secret',

resave: true,

saveUninitialized: true

}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'static')));

//remove the below line and check the output

app.use(express.static(__dirname));

/*

The json and urlencoded methods will extract the form data from
our login.html file. */

// http://localhost:3000/

/*After, we need to declare the login route that will output
our login.html file to the client using a GET request.*/

app.get('/', function(request, response) {

// Render login template

response.sendFile(path.join(__dirname + '/login.html'));

});

/*When the client establishes a new connection to our Node.js server,
it will output the login.html file.*/

// http://localhost:3000/auth

/*When the client establishes a new connection to our Node.js server,
it will output the login.html file. Next, we need to add a new route that
will authenticate the user.*/

app.post('/auth', function(request, response) {

// Capture the input fields

let username = request.body.username;


let password = request.body.password;

// Ensure the input fields exists and are not empty

if (username && password) {



connection.query('SELECT * FROM USER WHERE EMAIL = ? AND password = ?', [username, password], function(error, results, fields) {

// If there is an issue with the query, output the error

if (error) throw error;

// If the account exists

if (results.length > 0) {

// Authenticate the user


request.session.loggedin = true;

request.session.username = username;

// Redirect to home page

response.redirect('/home');

} else {

    
    console.log('Incorrect Username and/or Password!');
    
    response.redirect('http://localhost:3000/')

}

response.end();

});

} else {

response.send('Please enter Username and Password!');

response.end();

}

});

// http://localhost:3000/home

app.get('/home', function(request, response) {

// If the user is loggedin

if (request.session.loggedin) {

// Output username

return response.redirect('/dashboard.html');

} else {

// Not logged in

response.send('Please login to view this page!');

}

response.end();

});

/*Finally, our Node.js server needs to listen on a port, so for testing purposes, we can use port 3000.*/

app.listen(3000);