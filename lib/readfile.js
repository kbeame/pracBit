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
console.log(bitmap);
console.log('alpha ' + bitmap[60]);
console.dir(bitmapData);
