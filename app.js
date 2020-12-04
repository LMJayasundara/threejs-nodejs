var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

app.use(express.static(__dirname + "/public"));

function tryParseJson (str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return JSON.parse(str);
}

SerialPort.list().then(ports => {
  ports.forEach(function(port) {
    var arduinoCOMPort = port.path;

    var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
      baudRate: 115200
     });

    arduinoSerialPort.on('open',function() {
      console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
    });

    arduinoSerialPort.pipe(parser);
    parser.on('data', onData);

    function onData(data){
      const inputData = tryParseJson(data);

      io.sockets.emit('outputData', { roll: inputData.roll, pitch: inputData.pitch, yaw: inputData.yaw });
      console.log("Yaw :"+ inputData.yaw + " Pitch :" + inputData.yaw + " Roll " + inputData.yaw);
    }

   });

 });

server.listen(port, function(){
  console.log('listening on *:' + port);
});