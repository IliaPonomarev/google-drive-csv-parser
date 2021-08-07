import * as csvParser from 'csv-parser';

export function parseCSV(res, callback): Promise<boolean> {
  let temp = [];

  return new Promise((resolve) => {
    res
      .on('data', async () => {
        res.pause();

        if (temp.length > 0) {
          await callback(temp);

          temp = [];
        }

        res.resume();
      })
      .pipe(csvParser())
      .on('data', async (data) => {
        temp.push(data);
      })
      .on('end', () => {
        resolve(true);
      });
  });
}