const fs = require('fs');
const EventEmitter = require('events');

const eventHandler = new EventEmitter();

var bitMapHeaderData = {};

eventHandler.on('fileRead', (data) => {
  bitMapHeaderData.headField = data.toString('ascii', 0, 2);
  bitMapHeaderData.mapSize = data.readUInt32LE(2);
  bitMapHeaderData.pixelArrayStart = data.readUInt32LE(10);
  bitMapHeaderData.paletteColors = data.readUInt32LE(46);
  bitMapHeaderData.mapHeight = data.readUInt32LE(18);
  bitMapHeaderData.mapWidth = data.readUInt32LE(22);
  bitMapHeaderData.sizeOfHeader = data.readUInt32LE(14);
  bitMapHeaderData.startOffSet = bitMapHeaderData.sizeOfHeader + 14;
  eventHandler.emit(process.argv[3], data, bitMapHeaderData);
});


var colors = {};
var pinpointColor = {};

colors.setColors = function(byte, bitmap) {
  pinpointColor.blue = bitmap.readUInt8(byte);
  pinpointColor.green = bitmap.readUInt8(byte + 1);
  pinpointColor.red = bitmap.readUInt8(byte + 2);
  pinpointColor.alpha = bitmap.readUInt8(byte + 3);
  return pinpointColor;
};
// grayscale transformer
eventHandler.on('grayscale', function(data, bitMapHeaderData) {
  for (var i = bitMapHeaderData.startOffSet; i < bitMapHeaderData.pixelArrayStart; i += 4) {
    var gray = 0;
    colors.setColors(i, data);
    gray = (pinpointColor.blue + pinpointColor.green + pinpointColor.red + pinpointColor.alpha) / 4;
    data.writeUInt8(gray, i);
    data.writeUInt8(gray, i + 1);
    data.writeUInt8(gray, i + 2);
    data.writeUInt8(gray, i + 3);
  }
  eventHandler.emit('rewrite', data);
});

// bluescale
eventHandler.on('bluescale', function(data, bitMapHeaderData) {
  for (var i = bitMapHeaderData.startOffSet; i < bitMapHeaderData.pixelArrayStart; i += 4) {
    colors.setColors(i, data);
    data.writeUInt8(pinpointColor.blue, i);
    data.writeUInt8(0.15 * pinpointColor.green, i + 1);
    data.writeUInt8(0.15 * pinpointColor.red, i + 2);
    data.writeUInt8(0.15 * pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
});

// redscale
eventHandler.on('redscale', function(data, bitMapHeaderData) {
  for (var i = bitMapHeaderData.startOffSet; i < bitMapHeaderData.pixelArrayStart; i += 4) {
    colors.setColors(i, data);
    data.writeUInt8(0.15 * pinpointColor.blue, i);
    data.writeUInt8(0.15 * pinpointColor.green, i + 1);
    data.writeUInt8(pinpointColor.red, i + 2);
    data.writeUInt8(0.15 * pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
});

// invert transformer
eventHandler.on('invert', function(data, bitMapHeaderData) {
  for (var i = bitMapHeaderData.startOffSet; i < bitMapHeaderData.pixelArrayStart; i += 4) {
    colors.setColors(i, data);
    data.writeUInt8(255 - pinpointColor.blue, i);
    data.writeUInt8(255 - pinpointColor.green, i + 1);
    data.writeUInt8(255 - pinpointColor.red, i + 2);
    data.writeUInt8(255 - pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
});
// create the new image
eventHandler.on('rewrite', function(data) {
  fs.writeFileSync(__dirname + '/image.bmp', data);
});

module.exports = eventHandler;
