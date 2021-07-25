import { DB } from './store';
import { GoogleDrive } from './google-drive';

import { parseCSV } from './parser';

async function run() {
  const connectionUrl = process.argv[2];

  if (!connectionUrl) {
    throw new Error('ConnectionUrl is required, example: mongodb://localhost:27017/lad24');
  }

	try {
    const db = new DB({ connectionUrl });

    await db.connect();

    console.log('Соединение с базой данных установлено');

    const googleDrive = new GoogleDrive();
    const googleDriveAuth = await googleDrive.start();

    const metaFile = await googleDrive.getFileByName(googleDriveAuth, 'movies_metadata.csv');
    const ratingFile = await googleDrive.getFileByName(googleDriveAuth, 'ratings.csv');

    if (metaFile && ratingFile) {
      // const metaResponse = await googleDrive.downloadFile(googleDriveAuth, metaFile.id);
      const ratingResponse = await googleDrive.downloadFile(googleDriveAuth, ratingFile.id);

      // const metaFromFile = await parseCSV(metaResponse.data);

      // const meta = metaFromFile
      //   .filter(movie => movie.id && Number.isInteger(+movie.id) && movie.original_title)
      //   .map(movie => {
      //     return {
      //       movie_id: Number(movie.id),
      //       original_title: movie.original_title
      //     };
      //   });

      // await db.movieInfo.model.insertMany(meta);


      const ratingFromFile = await parseCSV(ratingResponse.data);

      const rating = ratingFromFile
        .filter(movie => movie.movieId && movie.rating && Number.isInteger(+movie.movieId) && Number.isInteger(+movie.rating))
        .map(movie => {
          return {
            movie_id: Number(movie.movieId),
            rating: Number(movie.rating)
          };
        });

      // await db.movieRating.model.insertMany(rating);

      console.log('data inserted', rating);

      // await parseCSV(ratingResponse.data, async (data) => {
      //   const { movieId: movie_id, rating } = data;

      //   if (movie_id && rating) {
      //     db.movieRating.add({ movie_id: Number(movie_id), rating: Number(rating) });
      //   }
      // });

      const films = await db.movieInfo.findWithHighestRating(10);

      console.log(films);
    }


	} catch (error) {
		console.log('Error', error);

		throw error;
	}
}

run();