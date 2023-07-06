import fs from 'fs';
import axios from 'axios';
import { JSDOM } from 'jsdom';

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

async function get_urls(marker?: string) {
  const response = await axios.get('https://s3-ap-northeast-1.amazonaws.com/data.binance.vision', { params: {
    delimiter: '/',
    prefix: 'data/futures/um/daily/klines/ETHUSDT/30m/',
    marker,
  } });
  const document = new JSDOM(response.data).window.document;
  const urls = Array.from(document.querySelectorAll('Key'))
    .map((key) => key.innerHTML.trim())
    .filter((url) => url.toLowerCase().endsWith('.zip'))
    .map((pathname) => `https://data.binance.vision/${pathname}`);
  return urls;
}

async function main() {
  const urls = await get_urls();
  await batch_download(urls, 10);
}

main();
