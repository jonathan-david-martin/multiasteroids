/**
 * Created by jonathanmar on 12/25/16.
 */

var hostname = '0.0.0.0';
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
app.use(express.static(__dirname));

var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

var players = [];

var player = function(x,y,angle,speed,velocityx,velocityy,socketid){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.velocityx = velocityx;
    this.velocityy = velocityy;
    
    this.socketid = socketid;
    
}

//placeholder - this function will just loop through players looking for a matching socket id
var idLookup = function(id,playersArray){
    
}


io.on('connection', function(socket) {
    //console.log('connection');
    //console.log('here is the socket id:' + socket.id);
    
    socket.on('phaser create function initiated', function(msg){
        
        newplayer = new player(400,100,0,0,0,0,socket.id);
        players.push(newplayer);
        io.emit('server knows phaser create initiated', players);
        //console.log(players);
        
    });

    socket.on('left', function(msg){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                players[i].angle -= 5;
            }
        }
        io.emit('update',players);
    });

    socket.on('right', function(msg){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                players[i].angle += 5;
            }
        }
        io.emit('update',players);
    });

    socket.on('up', function(msg){

        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                //players[i].angle = msg[i].angle;
                players[i].speed = 400;
                //players[i].x = msg[i].x;
                //players[i].y = msg[i].y;
              //console.log('server up' + msg[i].socketid);
            }
        }
        //io.emit('update locations',players);
        io.emit('update',players);

    });

    socket.on('no movement', function(msg){
        for(i=0;i<players.length;i++){
            //if(players[i].socketid == msg.socketid){
            players[i].angle = msg[i].angle;
            players[i].x = msg[i].x;
            players[i].y = msg[i].y;

            //}
        }
        //io.emit('update locations',players);


    });

    socket.on('down', function(msg){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                players[i].y += 5;
            }
        }
        io.emit('update',players);
    });


    
   socket.on('phaserupdate', function(data){
    for(i=0;i<players.length;i++){
                //players[i].angle = data[i].angle;
                //players[i].x = data[i].x;
                //players[i].y = data[i].y;
                //console.log('phaser update:' + i + ' ' + data[i].speed)
                players[i].speed = data[i].speed;
                
        
        
        }
        io.emit('update',players);

    }); 

    socket.on('velocity update', function(data){

        for(i=0;i<players.length;i++){
          if(players[i].socketid == data[i].socketid) {
              //console.log(i + ' ' + players[i].socketid + ' ' + data[0].socketid)
            players[i].angle     = data[i].angle;
            players[i].x         = data[i].x;
            players[i].y         = data[i].y;
            //console.log('phaser update:' + i + ' ' + data[i].speed)
            players[i].velocityx = data[i].velocityx;
            players[i].velocityy = data[i].velocityy;

          }
            
            



        }

        io.emit('velocity update',players);

    });


    socket.on('disconnect',function(){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == socket.id){
                players[i].x = -999;
                players[i].y = -999;
            }
        }
        var disconnectedUsers = 0;
        for(i=0;i<players.length;i++){
            if(players[i].x == -999){
                disconnectedUsers++;
            }

        }
        if(disconnectedUsers == players.length){
            //console.log("players.length:" + players.length + " disconnected users:" + disconnectedUsers)
            players = [];
        }
        io.emit('update',players);

    });



});




server.listen(port, hostname, function(){
    console.log('listening on ' + hostname + ':' + port);
});
