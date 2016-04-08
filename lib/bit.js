//how to read bitmap data
const fs = require('fs');

var bitmap = fs.readFile(__dirname + '/' + process.argv[2]); //make bitmap equal to the reading of the specified file (process.argv[2] is the file name that)
var bitmapData = {}; //bitmapData is a mutable empty object

bitmapData.headField = bitmap.toString('ascii', 0, 2); //bitmap.headField is equal
//to the reading of the first two bytes of the the file name, these should be the
//total header and stores general information about a bitmap image file
//it is ascii
bitmapData.size = bitmap.readUInt32LE(2); //What does this mean? Why enter in the numbers
//that we have here?
//readUInt32LE: this reads a 32-bit integer from a BUFFER at a particular ofset
//offset:
bitmapData.pixelArrayStart = bitmap.readUInt32LE(10); //
//Offset where the pixel array (bitmap image data) can be found is 10???
//What is the pixel array??: this section defines the actual values of pixels
//Pixel Array: these describe the image pixel by pixel
bitmapData.paletteColors = bitmap.readUInt32LE(46); //called color table
bitmapData.height = readUInt32LE(18);
bitmapData.width = readUInt32LE(22);
bitmapData.colorDepth = bitmapData(28);
console.log('first color:' + bitmap[54]);
console.dir(bitmapData);