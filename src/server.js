import http from 'http';

import { readFileSync, createReadStream } from 'fs';

// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
// curl http://localhost:3000 --output file.txt
http.createServer((req, res) => {
  // const file = readFileSync('big.file');

  // res.write(file);
  // res.end();
  createReadStream('big.file').pipe(res);
}).listen(3000, () => console.log('Running on port 3000'));