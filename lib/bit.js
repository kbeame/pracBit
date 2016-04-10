//how to read bitmap data
const fs = require('fs');
var bitmap = fs.readFileSync(__dirname + '/' + process.argv[2]); //make bitmap equal to the reading of the specified file
//(process.argv[2] is the file name that)
var bitmapData = {}; //bitmapData is a mutable empty object
console.log("process.argv " + process.argv[2]);

console.log(bitmap);
console.log('bitmap blue ' + bitmap.readUInt8(98));
console.log('bitmap green ' + bitmap.readUInt8(99));
console.log('bitmap red ' + bitmap.readUInt8(100));
console.log('bitmap alpha ' + bitmap.readUInt8(101));



bitmapData.headField = bitmap.toString('ascii', 0, 2);
bitmapData.mapSize = bitmap.readUInt32LE(2);
bitmapData.pixelArrayStart = bitmap.readUInt32LE(10);
bitmapData.paletteColors = bitmap.readUInt32LE(46);
bitmapData.mapHeight = bitmap.readUInt32LE(18);
bitmapData.mapWidth = bitmap.readUInt32LE(22);

console.dir(bitmapData);

var colors = {};
var pinpointColor = {};
//
// colors.setColors = function(byte, bitmap) {
//   pinpointColor.blue = bitmap.readUInt8(byte);
//   pinpointColor.green = bitmap.readUInt8(byte +1);
//   pinpointColor.red = bitmap.readUInt8(byte + 2);
//   pinpointColor.alpha = bitmap.readUInt8(byte + 3);
//   return pinpointColor;
// };

//
// pinpointColor.blue = bitmap.readUInt8(96);
// pinpointColor.green = bitmap.readUInt8(97);
// pinpointColor.red = bitmap.readUInt8(98);
// pinpointColor.alpha = bitmap.readUInt8(99);
//
// gray = ((pinpointColor.blue + pinpointColor.green + pinpointColor.red)/3);
// console.log(gray);
// bitmap.writeUInt8(gray, 96);
// bitmap.writeUInt8(gray, 97);
// bitmap.writeUInt8(gray, 98);
// bitmap.writeUInt8(gray, 99);

for (var i = 54; i<bitmapData.pixelArrayStart; i+=4) {
  var gray = 0;
  pinpointColor.blue = bitmap.readUInt8(i);
  pinpointColor.green = bitmap.readUInt8(i + 1);
  pinpointColor.red = bitmap.readUInt8(i + 2);
  pinpointColor.alpha = bitmap.readUInt8(i + 3);
  gray = ((pinpointColor.blue + pinpointColor.green + pinpointColor.red + pinpointColor.alpha)/4);
  console.log('gray ' + gray);
  bitmap.writeUInt8(gray, i);
  bitmap.writeUInt8(gray, i + 1);
  bitmap.writeUInt8(gray, i + 2);
  bitmap.writeUInt8(gray, i + 3);
}

fs.writeFileSync(__dirname + '/newimage.bmp', bitmap);

var NEWbitmap = fs.readFileSync(__dirname + '/newimage.bmp');

console.log('new bitmap blue ' + NEWbitmap.readUInt8(98));
console.log('new bitmap green ' + NEWbitmap.readUInt8(99));
console.log('new bitmap red ' + NEWbitmap.readUInt8(100));
console.log('new bitmap alpha ' + NEWbitmap.readUInt8(101));
