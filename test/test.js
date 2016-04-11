const expect = require('chai').expect;
var transform = require(__dirname + '/../lib/transform.js');
// const EventEmitter = require('events');
//test grayscale
describe('All the transformations mathematically work', () => {
  var fakeBuffer = new Buffer(4);

  var bitMapHeaderData = {};
  bitMapHeaderData.pixelArrayStart = 4;
  bitMapHeaderData.startOffSet = 0;

  beforeEach(() => {
    fakeBuffer.writeUInt8(100, 0);
    fakeBuffer.writeUInt8(120, 1);
    fakeBuffer.writeUInt8(100, 2);
    fakeBuffer.writeUInt8(50, 3);
  });

//grayscale
  it('should grayscale the colors', (done) => {
    function grayscaleFunction (fakeBuffer) {
      console.log(fakeBuffer);
      expect(fakeBuffer.readUInt8(0)).to.eql(92);
      expect(fakeBuffer.readUInt8(1)).to.eql(92);
      expect(fakeBuffer.readUInt8(2)).to.eql(92);
      expect(fakeBuffer.readUInt8(3)).to.eql(92);
      done();
    }
    transform.on('rewrite', grayscaleFunction);
    transform.emit('grayscale', fakeBuffer, bitMapHeaderData);
  });
});
