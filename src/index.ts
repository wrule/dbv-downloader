import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

async function download(url: string) {
  const filename = url.split('/').pop() as string;
  const response = await axios.get(url, {
    responseType: 'stream',
    timeout: 1e4,
  });
  const writer = fs.createWriteStream(path.join('download', filename));
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

async function get_urls(
  prefix = 'data/futures/um/daily/klines/ETHUSDT/30m/',
  api = 'https://s3-ap-northeast-1.amazonaws.com/data.binance.vision',
  marker?: string,
) {
  const params = { delimiter: '/', prefix, marker };
  const response = await axios.get(api, { params });
  const parser = new XMLParser();
  const data = parser.parse(response.data)?.ListBucketResult;
  const urls = ((data?.Contents || []) as any[])
    .map((item) => item?.Key || '')
    .filter((item) => item.toLowerCase().endsWith('.zip'))
    .map((pathname) => `https://data.binance.vision/${pathname}`);
  if (data.IsTruncated)
    urls.push(...(await get_urls(prefix, api, data.NextMarker)));
  return urls;
}

async function main() {
  console.log('搜集数据地址...');
  const urls = await get_urls();
  console.log('搜集到', urls.length, '个数据地址');
  console.log('开始下载...');
  await batch_download(urls, 20);
  console.log('下载完成');
}

main();
