import * as csv from 'csv-parser';

export function parseCSV(res): Promise<any[]> {
  const results = [];
  return new Promise((resolve) => {
    res
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        console.log('Файл записался');

        resolve(results);
      });
  });
}