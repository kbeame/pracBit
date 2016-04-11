// how to read bitmap data
const fs = require('fs');
const EventEmitter = require('events');

const eventHandler = new EventEmitter();

var bitmap =fs.readFile(__dirname + '/' + process.argv[2], (err, data) => {
  if (err) return console.log(err);
  eventHandler.emit('fileRead', data);
});

var bitMapHeaderData = {};

eventHandler.on('fileRead', function(data) {
  bitMapHeaderData.headField = data.toString('ascii', 0, 2);
  bitMapHeaderData.mapSize = data.readUInt32LE(2);
  bitMapHeaderData.pixelArrayStart = data.readUInt32LE(10);
  bitMapHeaderData.paletteColors = data.readUInt32LE(46);
  bitMapHeaderData.mapHeight = data.readUInt32LE(18);
  bitMapHeaderData.mapWidth = data.readUInt32LE(22);
});

module.exports = bitMapHeaderData;
module.exports = bitmap;
