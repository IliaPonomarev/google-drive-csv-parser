import * as mongoose from 'mongoose';

import { IDBConfig, IDB } from './model';

import { DBMovieRating } from './collections/movie-rating';
import { DBMovieInfo } from './collections/movie-info';

import { IDBMovieRating } from './collections/movie-rating/model';

export class DB implements IDB {
  public movieRating: IDBMovieRating;
  public movieInfo;

  constructor(private config: IDBConfig) {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    this.movieRating = new DBMovieRating();
    this.movieInfo = new DBMovieInfo();
  }

  public connect() {
    return mongoose.connect(this.config.connectionUrl);
  }

  public close(): Promise<void> {
		return mongoose.connection.close();
  }
}