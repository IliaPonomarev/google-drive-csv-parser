import { DB } from './store';
// import { GoogleDrive } from './google-drive';

// import { parseCSV } from './parser';

async function run() {
  const connectionUrl = process.argv[2];

  if (!connectionUrl) {
    throw new Error('ConnectionUrl is required, example: mongodb://localhost:27017/lad24');
  }

	try {
    const db = new DB({ connectionUrl });

    await db.connect();

    // await db.close();

    console.log('Соединение с базой данных установлено');

    await db.movieInfo.findWithHighestRating(10);


    // films.map

    // console.log(await db.movieInfo.model.find());
    // console.log(await db.movieRating.model.find());



    // const googleDrive = new GoogleDrive();
    // const googleDriveAuth = await googleDrive.start();

    // const ratingFile = await googleDrive.getFileByName(googleDriveAuth, 'ratings.csv');
    // const metaFile = await googleDrive.getFileByName(googleDriveAuth, 'movies_metadata.csv');

    // if (metaFile) {
    //   const metaResponse = await googleDrive.downloadFile(googleDriveAuth, metaFile.id);

    //   parseCSV(metaResponse.data, async (data) => {
    //     const { id: movie_id, original_title } = data;

    //     if (movie_id && original_title) {
    //       await db.movieInfo.add({ movie_id: Number(movie_id), original_title });
    //     }
    //   });
    // }

    // if (ratingFile) {
    //   const ratingResponse = await googleDrive.downloadFile(googleDriveAuth, ratingFile.id);

    //   parseCSV(ratingResponse.data, async (data) => {
    //     const { movieId: movie_id, rating } = data;

    //     if (movie_id && rating) {
    //       await db.movieRating.add({ movie_id: Number(movie_id), rating: Number(rating) });
    //     }
    //   });
    // }
	} catch (error) {
		console.log('Error', error);

		throw error;
	}
}

run();