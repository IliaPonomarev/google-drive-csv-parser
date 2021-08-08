import * as csvParser from 'csv-parser';
const MAX_OBJECT_COUNT = 1000;

export function parseCSV(res, callback): Promise<boolean> {
  let temp = [];

  return new Promise((resolve) => {
    res
      .pipe(csvParser())
      .on('data', async (data) => {
        temp.push(data);

        if (temp.length > MAX_OBJECT_COUNT) {
          res.pause();
          const infoForSave = [...temp];
          temp = [];

          await callback(infoForSave);

          res.resume();
        }
      })
      .on('end', async () => {
        await callback(temp);

        temp = [];
        resolve(true);
      });
  });
}