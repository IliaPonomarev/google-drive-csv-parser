import * as csv from 'csv-parser';

export function parseCSV(res, callback) {
  return new Promise((resolve) => {
    res
      .pipe(csv())
      .on('data', (data) => {
        console.log(data);
        callback(data);
      })
      .on('end', () => {
        console.log('Файл записался');

        resolve('Файл записался');
      });
  });
}