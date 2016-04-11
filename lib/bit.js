// how to read bitmap data
const fs = require('fs');
const EventEmitter = require('events');

const eventHandler = new EventEmitter();

fs.readFile(__dirname + '/' + process.argv[2], (err, data) => {
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
  eventHandler.emit(process.argv[3], data);

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
//grayscale transformer
eventHandler.on('grayscale', function (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    var gray = 0;
    pinpointColor.blue = data.readUInt8(i);
    pinpointColor.green = data.readUInt8(i + 1);
    pinpointColor.red = data.readUInt8(i + 2);
    pinpointColor.alpha = data.readUInt8(i + 3);
    gray = ((pinpointColor.blue + pinpointColor.green + pinpointColor.red + pinpointColor.alpha)/4);
    data.writeUInt8(gray, i);
    data.writeUInt8(gray, i + 1);
    data.writeUInt8(gray, i + 2);
    data.writeUInt8(gray, i + 3);
  }
  eventHandler.emit('rewrite', data);
});

//bluescale
eventHandler.on('bluescale', function (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    pinpointColor.blue = data.readUInt8(i);
    pinpointColor.green = data.readUInt8(i + 1);
    pinpointColor.red = data.readUInt8(i + 2);
    pinpointColor.alpha = data.readUInt8(i + 3);
    data.writeUInt8(pinpointColor.blue, i);
    data.writeUInt8(0.15*pinpointColor.green, i + 1);
    data.writeUInt8(0.15*pinpointColor.red, i + 2);
    data.writeUInt8(0.15*pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
});
//redscale
eventHandler.on('redscale', function (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    pinpointColor.blue = data.readUInt8(i);
    pinpointColor.green = data.readUInt8(i + 1);
    pinpointColor.red = data.readUInt8(i + 2);
    pinpointColor.alpha = data.readUInt8(i + 3);
    data.writeUInt8(0.15*pinpointColor.blue, i);
    data.writeUInt8(0.15*pinpointColor.green, i + 1);
    data.writeUInt8(pinpointColor.red, i + 2);
    data.writeUInt8(0.15*pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
});

//invert transformer
eventHandler.on('invert', function (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    pinpointColor.blue = data.readUInt8(i);
    pinpointColor.green = data.readUInt8(i + 1);
    pinpointColor.red = data.readUInt8(i + 2);
    pinpointColor.alpha = data.readUInt8(i + 3);
    data.writeUInt8(255-pinpointColor.blue, i);
    data.writeUInt8(255-pinpointColor.green, i + 1);
    data.writeUInt8(255-pinpointColor.red, i + 2);
    data.writeUInt8(255-pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
});

eventHandler.on('rewrite', function (data) {
  fs.writeFileSync(__dirname + '/image.bmp', data);
})
console.log('3 ' + process.argv[3]);

module.exports= eventHandler;
