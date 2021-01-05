import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

async function getAddresses(): Promise<string[]> {
  const fileStream = fs.createReadStream(path.resolve('./public', 'data.txt'));
  let data = '';
  const addresses: string[] = [];

  return new Promise((resolve, reject) => {
    fileStream.on('readable', () => {
      data += fileStream.read();
      while (data.indexOf('\n') >= 0) {
        fileStream.emit('newLine', data.substring(0, data.indexOf('\n')));
        data = data.substring(data.indexOf('\n') + 1);
      }
    });

    fileStream.on('end', function () {
      fileStream.emit('newLine', data, true);
    });

    fileStream.on('newLine', function (line_of_text, end_of_file) {
      try {
        const item = line_of_text.split(',')[0];
        if (!addresses.find(_item => item === _item)) addresses.push(item);
      } catch (e) {
        console.error(e);
        reject(e.message);
      }
      if (end_of_file) {
        resolve(addresses);
      }
    });
  });
}

let cache: string[] = [];

export default async function addressesHandler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  if (!cache.length) {
    cache = await getAddresses();
  }
  res.status(200).json(cache);
}
