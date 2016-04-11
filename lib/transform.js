module.exports = require(__dirname + '/lib/bit.js');
const fs = require('fs');
const EventEmitter = require('events');
var convert;
const eventHandler = new EventEmitter();
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
function grayscale (data) {
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
};

//bluescale
function bluescale (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    colors.setColors(i, data);
    data.writeUInt8(pinpointColor.blue, i);
    data.writeUInt8(0.15*pinpointColor.green, i + 1);
    data.writeUInt8(0.15*pinpointColor.red, i + 2);
    data.writeUInt8(0.15*pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
};

//redscale
function redscale (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    colors.setColors(i, data);
    data.writeUInt8(0.15*pinpointColor.blue, i);
    data.writeUInt8(0.15*pinpointColor.green, i + 1);
    data.writeUInt8(pinpointColor.red, i + 2);
    data.writeUInt8(0.15*pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
};

//invert transformer
function invert (data) {
  for (var i = 54; i<bitMapHeaderData.pixelArrayStart; i+=4) {
    colors.setColors(i, data);
    data.writeUInt8(255-pinpointColor.blue, i);
    data.writeUInt8(255-pinpointColor.green, i + 1);
    data.writeUInt8(255-pinpointColor.red, i + 2);
    data.writeUInt8(255-pinpointColor.alpha, i + 3);
  }
  eventHandler.emit('rewrite', data);
};

// How to handle the conversion
if (process.argv[3] === grayscale) {
  convert = grayscale;
} else if (process.argv[3] === bluescale) {
  convert = bluescale;
} else if (process.argv[3] === redscale) {
  convert = redscale;
} else if (process.argv[3] === invert) {
  convert = invert;
}

//call the function
convert(bitmap);

//create the new image
eventHandler.on('rewrite', function (data) {
  fs.writeFileSync(__dirname + '/image.bmp', data);
});
