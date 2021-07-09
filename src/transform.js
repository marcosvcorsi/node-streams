import { pipeline, Readable, Writable, Transform } from 'stream'
import { promisify } from 'util';
import { createWriteStream } from 'fs';

const pipelineAsync = promisify(pipeline);

const readableStream = Readable({
  read: function() {
    for(let index = 0; index < 1e5; index++) {
      const person = { id: Date.now() + index, name: `Any-${index}` };
      const data = JSON.stringify(person);

      this.push(data);
    }

    this.push(null);
  }
});

const writableMapToCSV = Transform({
  transform: function(chunk, enconding, cb) {
    const data = JSON.parse(chunk);

    const result = `${data.id},${data.name.toUpperCase()}\n`

    cb(null, result);
  } 
});

const setHeader = Transform({
  transform: function(chunk, enconding, cb) {
    this.counter = this.counter ?? 0;

    if(this.counter){
      return cb(null, chunk);
    }

    this.counter += 1;

    cb(null, "id,name\n".concat(chunk));
  } 
});

const writableStream = Writable({
  write: function(chunk, encoding, cb) {
    console.log(chunk.toString());
    cb();
  }
});

await pipelineAsync(
  readableStream,
  writableMapToCSV,
  setHeader,
  // writableStream,
  createWriteStream('out.csv')
)

console.log('end');