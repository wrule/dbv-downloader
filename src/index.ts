import fs from 'fs';
import axios from 'axios';

async function download(url: string) {
  const filename = url.split('/').pop() as string;
  console.log('download', filename, '...');
  const response = await axios.get(url, {
    responseType: 'stream',
    timeout: 60 * 1000,
  });
  const writer = fs.createWriteStream(filename);
  response.data.pipe(writer);
  return new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function batch_download(urls: string[]) {

}

function main() {
  console.log(1234);
  download('https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-07-03.zip');
}

main();
