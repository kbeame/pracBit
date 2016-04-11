module.exports = require(__dirname + '/lib/bit.js');
const fs = require('fs');
const EventEmitter = require('events');


var colors = {};
var pinpointColor = {};

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
    colors.setColors(i, data);
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
    colors.setColors(i, data);
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
    colors.setColors(i, data);
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
    colors.setColors(i, data);
    data.writeUInt8(255-pinpointColor.blue, i);
    data.writeUInt8(255-pinpointColor.green, i + 1);
    data.writeUInt8(255-pinpointColor.red, i + 2);
    data.writeUInt8(255-pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
});
//create the new image
eventHandler.on('rewrite', function (data) {
  fs.writeFileSync(__dirname + '/image.bmp', data);
});
