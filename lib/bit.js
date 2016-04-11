//how to read bitmap data
const fs = require('fs');
const EventEmitter = require('events');

const eventHandler = new EventEmitter();

fs.readFile(__dirname + '/palette-bitmap.bmp', (err, data) => {
  if (err) return console.log(err);
  eventHandler.emit('fileRead', data);
  // console.log('first step data ' + data);
});
//console logs which file I have used within the command line
console.log("process.argv " + process.argv[2]);


var bitMapHeaderData = {}; //bitmapData is a pty object

eventHandler.on('fileRead', function(data) {
  bitMapHeaderData.headField = data.toString('ascii', 0, 2);
  bitMapHeaderData.mapSize = data.readUInt32LE(2);
  bitMapHeaderData.pixelArrayStart = data.readUInt32LE(10);
  bitMapHeaderData.paletteColors = data.readUInt32LE(46);
  bitMapHeaderData.mapHeight = data.readUInt32LE(18);
  bitMapHeaderData.mapWidth = data.readUInt32LE(22);
  eventHandler.emit('transform', data);
  // console.log('2nd step data ' + data);
});

//console.dir of the header information
// console.dir(bitMapHeaderData);

var colors = {};
var pinpointColor = {};
//
colors.setColors = function(byte, bitmap) {
  pinpointColor.blue = bitmap.readUInt8(byte);
  pinpointColor.green = bitmap.readUInt8(byte +1);
  pinpointColor.red = bitmap.readUInt8(byte + 2);
  pinpointColor.alpha = bitmap.readUInt8(byte + 3);
  return pinpointColor;
};

eventHandler.on('transform', function (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    var gray = 0;
    pinpointColor.blue = data.readUInt8(i);
    pinpointColor.green = data.readUInt8(i + 1);
    pinpointColor.red = data.readUInt8(i + 2);
    pinpointColor.alpha = data.readUInt8(i + 3);
    gray = ((pinpointColor.blue + pinpointColor.green + pinpointColor.red + pinpointColor.alpha)/4);
    console.log('gray ' + gray);
    data.writeUInt8(gray, i);
    data.writeUInt8(gray, i + 1);
    data.writeUInt8(gray, i + 2);
    data.writeUInt8(gray, i + 3);
  }
  eventHandler.emit('rewrite', data);
});


eventHandler.on('rewrite', function (data) {
  fs.writeFileSync(__dirname + '/image.bmp', data);
})
