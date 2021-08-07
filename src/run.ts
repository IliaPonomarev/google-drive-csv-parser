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
      const metaResponse = await googleDrive.downloadFile(googleDriveAuth, metaFile.id);
      const ratingResponse = await googleDrive.downloadFile(googleDriveAuth, ratingFile.id);

      await parseCSV(metaResponse.data, async (movies) => {
        const preparedData = movies.filter(movie => movie.id && Number.isInteger(+movie.id) && movie.original_title)
          .map(movie => {
            return {
              movie_id: Number(movie.id),
              original_title: movie.original_title
            };
          });

        return db.movieInfo.model.insertMany(preparedData);
      });

      console.log('Информация из файла movies_metadata.csv сохранена в базе данных');

      await parseCSV(ratingResponse.data, async (rating) => {

        const preparedData = rating.filter(movie => movie.movieId && movie.rating && Number.isInteger(+movie.movieId) && Number.isInteger(+movie.rating))
          .map(movie => {
              return {
                movie_id: Number(movie.movieId),
                rating: Number(movie.rating)
              };
            });

        return db.movieRating.model.insertMany(preparedData);
      });

      console.log('Информация из файла ratings.csv сохранена в базе данных');


      const highestRatingMovies = await db.movieInfo.findWithHighestRating(10);

      console.log('Фильмы по рейтингу: ');

      highestRatingMovies.forEach(movie => {
       console.log(`${movie.originalTitle} ${movie.avgRating}`);
      });
    }


	} catch (error) {
		console.log('Error', error);

		throw error;
	}
}

run();