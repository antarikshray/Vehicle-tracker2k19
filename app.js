var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var app = express();
var session;
//app.use('/cssFiles', express.static(__dirname + '/assets'));

var socket = require('socket.io');

const port = process.env.PORT || 4000;
var server = app.listen(port,function(){
	console.log(`LISTENING AT PORT ${port}...`);
});

app.use(express.static('public'));

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
     socket.on('message',function(data){
     	console.log(data);
     	//values = data.split(",");
         // socket.broadcast.emit(values[0], values[1]);
         socket.emit('chat',data);
     });
     //socket.on('truck', function(data){
    //     values = data.split(",");
    //     socket.broadcast.emit(values[0], values[1]);
    // });
});



// socket.on('chat', function(data){
//     feedback.innerHTML = '';
//     output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(sessions({
	secret: 'suhdh&%$hgsdy%29JDG8747^$^',
	resave: false,
	saveUninitialized: true
}))


app.get('/login', function(req,res){
	session = req.session;
	if(session.uniqueID){
		res.redirect('/redirects');
	}
	res.sendFile('login.html', {root: __dirname});
});

app.post('/login', function(req, res){
	//resp.end(JSON.stringify(req.body));
	session = req.session;
	if(session.uniqueID){
		res.redirect('/redirects');
	}
	if(req.body.username == 'admin' && req.body.password == 'admin'){
		session.uniqueID = req.body.username;
	}
	res.redirect('/login');
});

app.get('/logout', function(req, res){
	req.session.destroy(function(error){
	console.log(error);
	res.redirect('/login');
	})
});

app.get('/admin', function(req, res){
	session=req.session;
	if(session.uniqueID != 'admin'){
		res.end('Unauthorized access');
	}
    res.sendFile('no.html', {root: path.join(__dirname, '')});
});


app.get('/redirects', function(req, res){
   session = req.session;
   if(session.uniqueID){
   	console.log(session.uniqueID);
   	res.redirect('/admin');
   }else{
   	res.send('Who are you?? <a href="/logout">KILL SESSION</a>');
   }
});


  