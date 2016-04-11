const fs = require('fs');
var transform = require(__dirname + '/../lib/transform.js');

var bitmap =fs.readFile(__dirname + '/' + process.argv[2], (err, data) => {
  if (err) return console.log(err);
  transform.emit('fileRead', data);
});
