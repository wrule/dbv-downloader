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

function batch_download(urls: string[], pool_size = 5) {
  let pool = [] as string[];
  const queue = urls.slice();
  return new Promise<void>((resolve) => {
    const timer = setInterval(async () => {
      if (pool.length === 0 && queue.length === 0) {
        clearInterval(timer);
        resolve();
      }
      if (queue.length > 0 && pool.length < pool_size) {
        const task = queue.shift() as string;
        pool.push(task);
        try {
          await download(task);
          console.log((1 - (pool.length + queue.length - 1) / urls.length) * 100, '%');
        } catch (e) { queue.push(task) }
        pool = pool.filter((item) => item !== task);
      }
    }, 10);
  });
}

function main() {
  console.log(1234);
  batch_download([
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-07-03.zip',
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-06-28.zip',
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-06-24.zip',
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-06-20.zip',
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-06-11.zip',
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-06-02.zip',
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-05-27.zip',
    'https://data.binance.vision/data/futures/um/daily/klines/ETHUSDT/30m/ETHUSDT-30m-2023-05-13.zip',
  ]);
}

main();
