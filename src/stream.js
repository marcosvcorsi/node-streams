import { pipeline, Readable, Writable } from 'stream'
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

const readableStream = Readable({
  read: function() {
    this.push('hello 1');
    this.push('hello 2');
    this.push('hello 3');
    this.push(null);
  }
});

const writableStream = Writable({
  write: function(chunk, encoding, cb) {
    console.log('msg', chunk.toString());
    cb();
  }
});

await pipelineAsync(
  readableStream,
  // process.stdout
  writableStream,
)

console.log('end');