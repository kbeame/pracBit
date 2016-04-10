//how to read bitmap data
const fs = require('fs');

var bitmap = fs.readFileSync(__dirname + '/palette-bitmap.bmp'); //make bitmap equal to the reading of the specified file
//(process.argv[2] is the file name that)
var bitmapData = {}; //bitmapData is a mutable empty object

function headerReader(bitmap) {
  bitmapData.headField = bitmap.toString('ascii', 0, 2);
  bitmapData.mapSize = bitmap.readUInt32LE(2);
  bitmapData.pixelArrayStart = bitmap.readUInt32LE(10);
  bitmapData.paletteColors = bitmap.readUInt32LE(46);
  bitmapData.mapHeight = bitmap.readUInt32LE(18);
  bitmapData.mapWidth = bitmap.readUInt32LE(22);
  return bitmapData;
}

headerReader(bitmap);

var colors = {};
var pinpointColor = {};

colors.setColors = function(byte, bitmap) {
  pinpointColor.blue = bitmap.readUInt8(byte);
  pinpointColor.green = bitmap.readUInt8(byte +1);
  pinpointColor.red = bitmap.readUInt8(byte + 2);
  pinpointColor.alpha = bitmap.readUInt8(byte + 3);
  return pinpointColor;
};

colors.greyColors = function (bitmap) {
  headerReader(bitmap);
  var gray = 0;
  for (var i = 54; i<bitmapData.pixelArrayStart; i ++) {
    pinpointColor.blue = bitmap.readUInt8(i);
    pinpointColor.green = bitmap.readUInt8(i +1);
    pinpointColor.red = bitmap.readUInt8(i+ 2);
    pinpointColor.alpha = bitmap.readUInt8(i+ 3);
    gray = ((pinpointColor.blue + pinpointColor.green + pinpointColor.red)/3);
    bitmap.writeUInt8(pinpointColor.blue, i);
    bitmap.writeUInt8(pinpointColor.green, i + 1);
    bitmap.writeUInt8(pinpointColor.red, i + 2);
    bitmap.writeUInt8(pinpointColor.alpha, i + 3);
  }
  return bitmap;

  fs.writeFileSync(__dirname + '/newimage.bmp', bitmap);
};

colors.greyColors(bitmap);
