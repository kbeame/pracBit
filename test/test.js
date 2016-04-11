const expect = require('chai').expect;
var transform = require(__dirname + '/../lib/bit.js');
// const EventEmitter = require('events');
//test grayscale
describe('All the transformations mathematically work', () => {
  var fakeBuffer = new Buffer(4);

  var bitMapHeaderData = {};
  bitMapHeaderData.pixelArrayStart = 4;
  bitMapHeaderData.startOffSet = 0;

  function grayscaleFunction (fakeBuffer) {
    console.log(fakeBuffer);
    expect(fakeBuffer.readUInt8(0)).to.eql(92);
    expect(fakeBuffer.readUInt8(1)).to.eql(92);
    expect(fakeBuffer.readUInt8(2)).to.eql(92);
    expect(fakeBuffer.readUInt8(3)).to.eql(92);
  }

  function bluescaleFunction (fakeBuffer) {
    console.log(fakeBuffer);
    expect(fakeBuffer.readUInt8(0)).to.eql(100);
    expect(fakeBuffer.readUInt8(1)).to.eql(18);
    expect(fakeBuffer.readUInt8(2)).to.eql(15);
    expect(fakeBuffer.readUInt8(3)).to.eql(7);
  }

  beforeEach(() => {
    fakeBuffer.writeUInt8(100, 0);
    fakeBuffer.writeUInt8(120, 1);
    fakeBuffer.writeUInt8(100, 2);
    fakeBuffer.writeUInt8(50, 3);
  });
  afterEach(() => {
    transform.removeListener('rewrite', grayscaleFunction);
    transform.removeListener('rewrite', bluescaleFunction);
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
    transform.on('rewrite', grayscaleFunction, done);
    transform.emit('grayscale', fakeBuffer, bitMapHeaderData);
  });
// //bluescale
it('should bluescale the colors', (done) => {
  function bluescaleFunction (fakeBuffer) {
    console.log(fakeBuffer);
    expect(fakeBuffer.readUInt8(0)).to.eql(100);
    expect(fakeBuffer.readUInt8(1)).to.eql(18);
    expect(fakeBuffer.readUInt8(2)).to.eql(15);
    expect(fakeBuffer.readUInt8(3)).to.eql(7);
    done();
  }
  transform.on('rewrite', bluescaleFunction);
  transform.emit('bluescale', fakeBuffer, bitMapHeaderData);
});
});
